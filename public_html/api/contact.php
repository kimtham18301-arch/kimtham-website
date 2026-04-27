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
$service = trim((string) ($data['service'] ?? ''));
$goal = trim((string) ($data['goal'] ?? ''));
$channels = trim((string) ($data['channels'] ?? ''));
$timeline = trim((string) ($data['timeline'] ?? ''));
$budget = trim((string) ($data['budget'] ?? ''));
$message = trim((string) ($data['message'] ?? ''));
$website = trim((string) ($data['website'] ?? ''));

if ($website !== '') {
    json_response(['ok' => true, 'message' => 'Đã nhận thông tin liên hệ.']);
}

if ($name === '' || $email === '' || $message === '') {
    json_response(['ok' => false, 'message' => 'Vui lòng nhập tên, email và nội dung.'], 422);
}

if (!validate_email($email)) {
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
    json_response(['ok' => false, 'message' => 'Bạn đã gửi nhiều liên hệ trong thời gian ngắn. Vui lòng thử lại sau.'], 429);
}

$leads[] = [
    'id' => bin2hex(random_bytes(8)),
    'createdAt' => date('c'),
    'name' => $name,
    'email' => $email,
    'phone' => $phone,
    'service' => $service,
    'goal' => $goal,
    'channels' => $channels,
    'timeline' => $timeline,
    'budget' => $budget,
    'message' => $message,
    'ip' => $ip,
];
$newLead = $leads[array_key_last($leads)];

if (!save_json_file(leads_file(), $leads)) {
    json_response(['ok' => false, 'message' => 'Không thể lưu liên hệ.'], 500);
}

$config = app_config();
$notificationEmail = trim((string) ($config['notification_email'] ?? ''));
if ($notificationEmail !== '' && validate_email($notificationEmail)) {
    $subject = 'Lead mới từ kimtham.id.vn';
    $body = implode("\n", [
        'Có lead mới từ website Kim Thắm:',
        '',
        'Họ tên: ' . $newLead['name'],
        'Email: ' . $newLead['email'],
        'Điện thoại: ' . ($newLead['phone'] ?: 'Không cung cấp'),
        'Dịch vụ: ' . $newLead['service'],
        'Mục tiêu: ' . ($newLead['goal'] ?: 'Chưa cung cấp'),
        'Kênh: ' . ($newLead['channels'] ?: 'Chưa cung cấp'),
        'Timeline: ' . ($newLead['timeline'] ?: 'Chưa cung cấp'),
        'Ngân sách: ' . ($newLead['budget'] ?: 'Chưa cung cấp'),
        '',
        'Nội dung:',
        $newLead['message'],
    ]);
    @mail($notificationEmail, $subject, $body, 'From: no-reply@kimtham.id.vn');
}

json_response(['ok' => true, 'message' => 'Đã nhận thông tin liên hệ.']);
