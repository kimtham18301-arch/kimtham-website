<?php

declare(strict_types=1);

require __DIR__ . '/common.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(['ok' => false, 'message' => 'Phương thức không được hỗ trợ.'], 405);
}

require_csrf();

$data = request_json();
$name = trim((string) ($data['name'] ?? ''));
$email = trim((string) ($data['email'] ?? ''));
$phone = trim((string) ($data['phone'] ?? ''));
$service = trim((string) ($data['service'] ?? 'Tư vấn nước hoa'));
$goal = trim((string) ($data['goal'] ?? ''));
$channels = trim((string) ($data['channels'] ?? ''));
$timeline = trim((string) ($data['timeline'] ?? ''));
$budget = trim((string) ($data['budget'] ?? ''));
$recipient = trim((string) ($data['recipient'] ?? ''));
$occasion = trim((string) ($data['occasion'] ?? ''));
$scent = trim((string) ($data['scent'] ?? ''));
$message = trim((string) ($data['message'] ?? $scent));
$website = trim((string) ($data['website'] ?? ''));

if ($website !== '') {
    json_response(['ok' => true, 'message' => 'Đã nhận thông tin tư vấn.']);
}

if ($name === '' || $phone === '' || $budget === '' || $occasion === '' || $message === '') {
    json_response(['ok' => false, 'message' => 'Vui lòng nhập tên, số điện thoại/Zalo, ngân sách, dịp dùng và gu mùi.'], 422);
}

if ($email !== '' && !validate_email($email)) {
    json_response(['ok' => false, 'message' => 'Email không hợp lệ.'], 422);
}

$leads = load_json_file(leads_file(), []);
$ip = $_SERVER['REMOTE_ADDR'] ?? '';
$recentLeads = array_filter($leads, static function ($lead) use ($ip): bool {
    if (($lead['ip'] ?? '') !== $ip) return false;
    $createdAt = strtotime((string) ($lead['createdAt'] ?? ''));
    return $createdAt !== false && $createdAt > time() - 600;
});

if (count($recentLeads) >= 3) {
    json_response(['ok' => false, 'message' => 'Bạn đã gửi nhiều yêu cầu trong thời gian ngắn. Vui lòng thử lại sau.'], 429);
}

$leads[] = [
    'id' => bin2hex(random_bytes(8)),
    'createdAt' => date('c'),
    'name' => $name,
    'email' => $email,
    'phone' => $phone,
    'service' => $service ?: 'Tư vấn nước hoa',
    'goal' => $goal,
    'channels' => $channels,
    'timeline' => $timeline,
    'budget' => $budget,
    'recipient' => $recipient,
    'occasion' => $occasion,
    'scent' => $scent,
    'message' => $message,
    'ip' => $ip,
];
$newLead = $leads[array_key_last($leads)];

if (!save_json_file(leads_file(), $leads)) {
    json_response(['ok' => false, 'message' => 'Không thể lưu yêu cầu tư vấn.'], 500);
}

$config = app_config();
$notificationEmail = trim((string) ($config['notification_email'] ?? ''));
if ($notificationEmail !== '' && validate_email($notificationEmail)) {
    $subject = 'Lead nước hoa mới từ kimtham.id.vn';
    $body = implode("\n", [
        'Có lead tư vấn nước hoa mới từ website Kim Thắm:',
        '',
        'Họ tên: ' . $newLead['name'],
        'Email: ' . ($newLead['email'] ?: 'Không cung cấp'),
        'Điện thoại/Zalo: ' . $newLead['phone'],
        'Dịch vụ: ' . $newLead['service'],
        'Mua cho: ' . ($newLead['recipient'] ?: 'Chưa cung cấp'),
        'Dịp dùng: ' . ($newLead['occasion'] ?: 'Chưa cung cấp'),
        'Ngân sách: ' . ($newLead['budget'] ?: 'Chưa cung cấp'),
        '',
        'Gu mùi:',
        $newLead['message'],
    ]);
    $headers = implode("\r\n", [
        'From: no-reply@kimtham.id.vn',
        'Content-Type: text/plain; charset=UTF-8',
    ]);
    @mail($notificationEmail, $subject, $body, $headers);
}

json_response(['ok' => true, 'message' => 'Đã nhận thông tin tư vấn.']);
