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
    @mkdir($uploadDir, 0755, true);
}

$input = json_decode(file_get_contents('php://input'), true) ?: [];

if (empty($_FILES['file']) && empty($_FILES['image']) && empty($input['base64'])) {
    json_response(['ok' => false, 'message' => 'Không tìm thấy file upload.'], 400);
}

$fileData = null;
$mimeType = '';

if (!empty($input['base64'])) {
    $base64String = $input['base64'];
    $fileSize = $input['size'] ?? 0;

    if ($fileSize > 2 * 1024 * 1024) {
        json_response(['ok' => false, 'message' => 'File quá lớn. Tối đa 2MB.'], 400);
    }

    $parts = explode(';base64,', $base64String);
    if (count($parts) !== 2 || strpos($parts[0], 'data:image/') !== 0) {
        json_response(['ok' => false, 'message' => 'Định dạng base64 không hợp lệ.'], 400);
    }

    $mimeType = str_replace('data:', '', $parts[0]);
    $fileData = base64_decode($parts[1]);

    if ($fileData === false) {
        json_response(['ok' => false, 'message' => 'Lỗi giải mã base64.'], 400);
    }
} else {
    $file = $_FILES['file'] ?? $_FILES['image'];

    if ($file['error'] !== UPLOAD_ERR_OK) {
        json_response(['ok' => false, 'message' => 'Lỗi upload file (Mã lỗi: ' . $file['error'] . ').'], 400);
    }

    if ($file['size'] > 2 * 1024 * 1024) {
        json_response(['ok' => false, 'message' => 'File quá lớn. Tối đa 2MB.'], 400);
    }

    if (function_exists('finfo_open')) {
        $finfo = @finfo_open(FILEINFO_MIME_TYPE);
        if ($finfo) {
            $mimeType = @finfo_file($finfo, $file['tmp_name']);
            @finfo_close($finfo);
        }
    }
    if (!$mimeType && function_exists('mime_content_type')) {
        $mimeType = @mime_content_type($file['tmp_name']);
    }
    if (!$mimeType) {
        $mimeType = $file['type'] ?? '';
    }
}

$allowedTypes = [
    'image/jpeg' => 'jpg',
    'image/pjpeg' => 'jpg',
    'image/png'  => 'png',
    'image/webp' => 'webp',
    'image/svg+xml' => 'svg',
    'image/gif'  => 'gif',
];

if (!isset($allowedTypes[$mimeType])) {
    json_response(['ok' => false, 'message' => 'Định dạng file không được hỗ trợ (' . htmlspecialchars($mimeType) . '). Chỉ chấp nhận: JPG, PNG, WebP, SVG, GIF.'], 400);
}

$ext = $allowedTypes[$mimeType];
$filename = date('Ymd-His') . '-' . bin2hex(random_bytes(4)) . '.' . $ext;
$destination = $uploadDir . $filename;

if ($fileData !== null) {
    if (file_put_contents($destination, $fileData) === false) {
        json_response(['ok' => false, 'message' => 'Không thể lưu file (Base64). Kiểm tra quyền ghi thư mục: images/uploads/'], 500);
    }
} else {
    if (!@move_uploaded_file($file['tmp_name'], $destination)) {
        json_response(['ok' => false, 'message' => 'Không thể lưu file. Kiểm tra quyền ghi thư mục: images/uploads/'], 500);
    }
}

$url = 'images/uploads/' . $filename;

json_response(['ok' => true, 'url' => $url, 'filename' => $filename, 'csrfToken' => csrf_token()]);

