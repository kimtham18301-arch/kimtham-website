<?php

declare(strict_types=1);

require __DIR__ . '/common.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(['ok' => false, 'message' => 'Phương thức không được hỗ trợ.'], 405);
}

require_admin();
require_csrf();

$uploadDir = __DIR__ . '/../images/uploads/';

if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

if (empty($_FILES['file'])) {
    json_response(['ok' => false, 'message' => 'Không tìm thấy file upload.'], 400);
}

$file = $_FILES['file'];

if ($file['error'] !== UPLOAD_ERR_OK) {
    json_response(['ok' => false, 'message' => 'Lỗi upload file.'], 400);
}

// Max 2MB
if ($file['size'] > 2 * 1024 * 1024) {
    json_response(['ok' => false, 'message' => 'File quá lớn. Tối đa 2MB.'], 400);
}

$allowedTypes = [
    'image/jpeg' => 'jpg',
    'image/png'  => 'png',
    'image/webp' => 'webp',
    'image/svg+xml' => 'svg',
    'image/gif'  => 'gif',
];

$finfo = finfo_open(FILEINFO_MIME_TYPE);
$mimeType = finfo_file($finfo, $file['tmp_name']);
finfo_close($finfo);

if (!isset($allowedTypes[$mimeType])) {
    json_response(['ok' => false, 'message' => 'Định dạng file không được hỗ trợ. Chỉ chấp nhận: JPG, PNG, WebP, SVG, GIF.'], 400);
}

$ext = $allowedTypes[$mimeType];
$filename = date('Ymd-His') . '-' . bin2hex(random_bytes(4)) . '.' . $ext;
$destination = $uploadDir . $filename;

if (!move_uploaded_file($file['tmp_name'], $destination)) {
    json_response(['ok' => false, 'message' => 'Không thể lưu file.'], 500);
}

$url = 'images/uploads/' . $filename;

json_response(['ok' => true, 'url' => $url, 'filename' => $filename, 'csrfToken' => csrf_token()]);
