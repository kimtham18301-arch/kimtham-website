<?php

declare(strict_types=1);

require __DIR__ . '/common.php';

function pages_file(): string
{
    return storage_path('pages.json');
}

function load_pages(): array
{
    return load_json_file(pages_file(), []);
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $pages = load_pages();

    if (!empty($_GET['page'])) {
        $pageKey = $_GET['page'];
        $pageData = $pages[$pageKey] ?? null;
        if ($pageData === null) {
            json_response(['ok' => false, 'message' => 'Không tìm thấy trang.'], 404);
        }
        json_response(['ok' => true, 'page' => $pageData, 'csrfToken' => csrf_token()]);
    }

    json_response(['ok' => true, 'pages' => $pages, 'csrfToken' => csrf_token()]);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    require_admin();
    require_csrf();

    $input = request_json();
    $pageKey = trim((string) ($input['page'] ?? ''));
    $data = $input['data'] ?? null;

    if (empty($pageKey) || !is_array($data)) {
        json_response(['ok' => false, 'message' => 'Thiếu tên trang hoặc dữ liệu.'], 400);
    }

    $pages = load_pages();
    $pages[$pageKey] = $data;

    if (!save_json_file(pages_file(), $pages)) {
        json_response(['ok' => false, 'message' => 'Không thể lưu nội dung trang.'], 500);
    }

    json_response(['ok' => true, 'page' => $pages[$pageKey], 'csrfToken' => csrf_token()]);
}

json_response(['ok' => false, 'message' => 'Phương thức không được hỗ trợ.'], 405);
