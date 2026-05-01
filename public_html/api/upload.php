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

$allowedTypes = [
    'image/jpeg' => 'jpg',
    'image/pjpeg' => 'jpg',
    'image/png'  => 'png',
    'image/webp' => 'webp',
    'image/svg+xml' => 'svg',
    'image/gif'  => 'gif',
];

$rawInput = file_get_contents('php://input') ?: '';
$input = json_decode($rawInput, true);
if (!is_array($input)) {
    $input = [];
}

if (($input['mode'] ?? '') === 'chunk') {
    $uploadId = preg_replace('/[^a-zA-Z0-9_-]/', '', (string) ($input['uploadId'] ?? ''));
    $index = (int) ($input['index'] ?? -1);
    $total = (int) ($input['total'] ?? 0);
    $chunk = (string) ($input['chunk'] ?? '');
    $mimeType = (string) ($input['type'] ?? '');
    $fileSize = (int) ($input['size'] ?? 0);

    if ($uploadId === '' || $index < 0 || $total < 1 || $total > 800 || $chunk === '') {
        json_response(['ok' => false, 'message' => 'Du lieu upload tung phan khong hop le.'], 400);
    }
    if (strlen($chunk) > 12 * 1024) {
        json_response(['ok' => false, 'message' => 'Mot phan upload qua lon, hay tai lai trang admin roi thu lai.'], 413);
    }
    if (!isset($allowedTypes[$mimeType])) {
        json_response(['ok' => false, 'message' => 'Dinh dang file khong duoc ho tro. Chi chap nhan: JPG, PNG, WebP, SVG, GIF.'], 400);
    }
    if ($fileSize > 2 * 1024 * 1024) {
        json_response(['ok' => false, 'message' => 'File qua lon. Toi da 2MB.'], 400);
    }

    $chunkDir = storage_path('upload_chunks');
    if (!is_dir($chunkDir)) {
        @mkdir($chunkDir, 0755, true);
    }
    if (!is_dir($chunkDir) || !is_writable($chunkDir)) {
        json_response(['ok' => false, 'message' => 'Khong the ghi thu muc tam upload_chunks trong storage/.'], 500);
    }

    $chunkFile = $chunkDir . DIRECTORY_SEPARATOR . $uploadId . '.b64';
    $flags = $index === 0 ? LOCK_EX : FILE_APPEND | LOCK_EX;
    if (file_put_contents($chunkFile, $chunk, $flags) === false) {
        json_response(['ok' => false, 'message' => 'Khong the ghi tam du lieu upload.'], 500);
    }

    if ($index + 1 < $total) {
        json_response(['ok' => true, 'partial' => true, 'csrfToken' => csrf_token()]);
    }

    $base64Payload = file_get_contents($chunkFile) ?: '';
    @unlink($chunkFile);
    $fileData = base64_decode($base64Payload, true);
    if ($fileData === false) {
        json_response(['ok' => false, 'message' => 'Loi giai ma du lieu anh sau khi ghep file.'], 400);
    }
    if (strlen($fileData) > 2 * 1024 * 1024) {
        json_response(['ok' => false, 'message' => 'File qua lon sau khi giai ma. Toi da 2MB.'], 400);
    }

    $ext = $allowedTypes[$mimeType];
    $filename = date('Ymd-His') . '-' . bin2hex(random_bytes(4)) . '.' . $ext;
    $destination = $uploadDir . $filename;
    if (file_put_contents($destination, $fileData) === false) {
        json_response(['ok' => false, 'message' => 'Khong the luu file. Kiem tra quyen ghi thu muc: images/uploads/'], 500);
    }

    $url = 'images/uploads/' . $filename;
    json_response(['ok' => true, 'url' => $url, 'filename' => $filename, 'csrfToken' => csrf_token()]);
}

if (empty($_FILES['file']) && empty($_FILES['image']) && empty($input['base64'])) {
    $contentLength = (int) ($_SERVER['CONTENT_LENGTH'] ?? 0);
    if ($contentLength > 0) {
        json_response(['ok' => false, 'message' => 'Request upload bị rỗng khi tới PHP (upload engine: chunks-4kb). Nếu ảnh chỉ vài trăm KB, hãy hard refresh admin hoặc kiểm tra hosting có chặn request JSON/body POST.'], 413);
    }
    json_response(['ok' => false, 'message' => 'Không tìm thấy file upload. Hãy tải lại trang admin rồi thử lại.'], 400);
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
        $uploadErrors = [
            UPLOAD_ERR_INI_SIZE => 'File vượt quá giới hạn upload_max_filesize của PHP.',
            UPLOAD_ERR_FORM_SIZE => 'File vượt quá giới hạn MAX_FILE_SIZE của form.',
            UPLOAD_ERR_PARTIAL => 'File chỉ được upload một phần, hãy thử lại.',
            UPLOAD_ERR_NO_FILE => 'Không có file nào được upload.',
            UPLOAD_ERR_NO_TMP_DIR => 'Server thiếu thư mục tạm để upload.',
            UPLOAD_ERR_CANT_WRITE => 'Server không ghi được file tạm (mã lỗi 7). Hãy tải lại trang admin để dùng upload base64, hoặc kiểm tra quyền ghi thư mục tạm trên hosting.',
            UPLOAD_ERR_EXTENSION => 'Một PHP extension đã chặn upload.',
        ];
        json_response(['ok' => false, 'message' => $uploadErrors[$file['error']] ?? ('Lỗi upload file (mã lỗi: ' . $file['error'] . ').')], 400);
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
