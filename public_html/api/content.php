<?php

declare(strict_types=1);

require __DIR__ . '/common.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $content = load_content();
    $content['csrfToken'] = csrf_token();
    json_response(['ok' => true, 'content' => $content, 'csrfToken' => csrf_token()]);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    require_admin();
    require_csrf();

    $content = clean_content(request_json());

    if (!save_json_file(content_file(), $content)) {
        json_response(['ok' => false, 'message' => 'Không thể lưu nội dung.'], 500);
    }

    json_response(['ok' => true, 'content' => $content, 'csrfToken' => csrf_token()]);
}

json_response(['ok' => false, 'message' => 'Phương thức không được hỗ trợ.'], 405);
