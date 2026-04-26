<?php

declare(strict_types=1);

require __DIR__ . '/common.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    json_response(['ok' => true, 'content' => load_content()]);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    require_admin();

    $content = clean_content(request_json());
    $saved = file_put_contents(
        content_file(),
        json_encode($content, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE),
        LOCK_EX
    );

    if ($saved === false) {
        json_response(['ok' => false, 'message' => 'Không thể lưu nội dung.'], 500);
    }

    json_response(['ok' => true, 'content' => $content]);
}

json_response(['ok' => false, 'message' => 'Phương thức không được hỗ trợ.'], 405);
