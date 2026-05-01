<?php

declare(strict_types=1);

require __DIR__ . '/common.php';

function blogs_file(): string
{
    return storage_path('blogs.json');
}

function load_blogs(): array
{
    return load_json_file(blogs_file(), []);
}

function generate_slug(string $title): string
{
    $map = [
        'à'=>'a','á'=>'a','ả'=>'a','ã'=>'a','ạ'=>'a',
        'ă'=>'a','ằ'=>'a','ắ'=>'a','ẳ'=>'a','ẵ'=>'a','ặ'=>'a',
        'â'=>'a','ầ'=>'a','ấ'=>'a','ẩ'=>'a','ẫ'=>'a','ậ'=>'a',
        'è'=>'e','é'=>'e','ẻ'=>'e','ẽ'=>'e','ẹ'=>'e',
        'ê'=>'e','ề'=>'e','ế'=>'e','ể'=>'e','ễ'=>'e','ệ'=>'e',
        'ì'=>'i','í'=>'i','ỉ'=>'i','ĩ'=>'i','ị'=>'i',
        'ò'=>'o','ó'=>'o','ỏ'=>'o','õ'=>'o','ọ'=>'o',
        'ô'=>'o','ồ'=>'o','ố'=>'o','ổ'=>'o','ỗ'=>'o','ộ'=>'o',
        'ơ'=>'o','ờ'=>'o','ớ'=>'o','ở'=>'o','ỡ'=>'o','ợ'=>'o',
        'ù'=>'u','ú'=>'u','ủ'=>'u','ũ'=>'u','ụ'=>'u',
        'ư'=>'u','ừ'=>'u','ứ'=>'u','ử'=>'u','ữ'=>'u','ự'=>'u',
        'ỳ'=>'y','ý'=>'y','ỷ'=>'y','ỹ'=>'y','ỵ'=>'y',
        'đ'=>'d',
        'À'=>'A','Á'=>'A','Ả'=>'A','Ã'=>'A','Ạ'=>'A',
        'Ă'=>'A','Ằ'=>'A','Ắ'=>'A','Ẳ'=>'A','Ẵ'=>'A','Ặ'=>'A',
        'Â'=>'A','Ầ'=>'A','Ấ'=>'A','Ẩ'=>'A','Ẫ'=>'A','Ậ'=>'A',
        'È'=>'E','É'=>'E','Ẻ'=>'E','Ẽ'=>'E','Ẹ'=>'E',
        'Ê'=>'E','Ề'=>'E','Ế'=>'E','Ể'=>'E','Ễ'=>'E','Ệ'=>'E',
        'Ì'=>'I','Í'=>'I','Ỉ'=>'I','Ĩ'=>'I','Ị'=>'I',
        'Ò'=>'O','Ó'=>'O','Ỏ'=>'O','Õ'=>'O','Ọ'=>'O',
        'Ô'=>'O','Ồ'=>'O','Ố'=>'O','Ổ'=>'O','Ỗ'=>'O','Ộ'=>'O',
        'Ơ'=>'O','Ờ'=>'O','Ớ'=>'O','Ở'=>'O','Ỡ'=>'O','Ợ'=>'O',
        'Ù'=>'U','Ú'=>'U','Ủ'=>'U','Ũ'=>'U','Ụ'=>'U',
        'Ư'=>'U','Ừ'=>'U','Ứ'=>'U','Ử'=>'U','Ữ'=>'U','Ự'=>'U',
        'Ỳ'=>'Y','Ý'=>'Y','Ỷ'=>'Y','Ỹ'=>'Y','Ỵ'=>'Y',
        'Đ'=>'D',
    ];

    $slug = strtr($title, $map);
    if (function_exists('iconv')) {
        $ascii = iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $title);
        if ($ascii !== false) {
            $slug = $ascii;
        }
    }
    $slug = strtolower($slug);
    $slug = preg_replace('/[^a-z0-9\s-]/', '', $slug);
    $slug = preg_replace('/[\s-]+/', '-', $slug);
    $slug = trim($slug, '-');

    return $slug !== '' ? $slug : 'bai-viet';
}

function generate_blog_id(): string
{
    return 'blog_' . bin2hex(random_bytes(6));
}

function clean_blog(array $input): array
{
    return [
        'title'     => trim((string) ($input['title'] ?? '')),
        'category'  => trim((string) ($input['category'] ?? '')),
        'tag'       => trim((string) ($input['tag'] ?? '')),
        'readTime'  => trim((string) ($input['readTime'] ?? '')),
        'date'      => trim((string) ($input['date'] ?? date('Y-m-d'))),
        'excerpt'   => trim((string) ($input['excerpt'] ?? '')),
        'content'   => (string) ($input['content'] ?? ''),
        'thumbnail' => trim((string) ($input['thumbnail'] ?? '')),
        'status'    => in_array($input['status'] ?? '', ['published', 'draft']) ? $input['status'] : 'draft',
    ];
}

// GET – list all blogs (public) or single blog by ?slug= or ?id=
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $blogs = load_blogs();

    // Single by slug
    if (!empty($_GET['slug'])) {
        $slug = $_GET['slug'];
        $found = array_values(array_filter($blogs, fn($b) => ($b['slug'] ?? '') === $slug));
        if (empty($found)) {
            json_response(['ok' => false, 'message' => 'Không tìm thấy bài viết.'], 404);
        }
        json_response(['ok' => true, 'blog' => $found[0]]);
    }

    // Single by id
    if (!empty($_GET['id'])) {
        $id = $_GET['id'];
        $found = array_values(array_filter($blogs, fn($b) => ($b['id'] ?? '') === $id));
        if (empty($found)) {
            json_response(['ok' => false, 'message' => 'Không tìm thấy bài viết.'], 404);
        }
        json_response(['ok' => true, 'blog' => $found[0]]);
    }

    // Filter by status for public
    $status = $_GET['status'] ?? null;
    if ($status) {
        $blogs = array_values(array_filter($blogs, fn($b) => ($b['status'] ?? 'draft') === $status));
    }

    json_response(['ok' => true, 'blogs' => $blogs, 'total' => count($blogs)]);
}

// POST – create new blog
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    require_admin();
    require_csrf();

    $input = request_json();
    $clean = clean_blog($input);

    if (empty($clean['title'])) {
        json_response(['ok' => false, 'message' => 'Tiêu đề bài viết là bắt buộc.'], 400);
    }

    $blogs = load_blogs();
    $now = date('c');

    $blog = array_merge($clean, [
        'id'        => generate_blog_id(),
        'slug'      => generate_slug($clean['title']),
        'createdAt' => $now,
        'updatedAt' => $now,
    ]);

    // Ensure unique slug
    $existingSlugs = array_column($blogs, 'slug');
    $baseSlug = $blog['slug'];
    $counter = 1;
    while (in_array($blog['slug'], $existingSlugs)) {
        $blog['slug'] = $baseSlug . '-' . (++$counter);
    }

    array_unshift($blogs, $blog);

    if (!save_json_file(blogs_file(), $blogs)) {
        json_response(['ok' => false, 'message' => 'Không thể lưu bài viết.'], 500);
    }

    json_response(['ok' => true, 'blog' => $blog, 'csrfToken' => csrf_token()], 201);
}

// PUT – update blog
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    require_admin();
    require_csrf();

    $input = request_json();
    $id = trim((string) ($input['id'] ?? ''));

    if (empty($id)) {
        json_response(['ok' => false, 'message' => 'Thiếu ID bài viết.'], 400);
    }

    $blogs = load_blogs();
    $index = null;

    foreach ($blogs as $i => $b) {
        if (($b['id'] ?? '') === $id) {
            $index = $i;
            break;
        }
    }

    if ($index === null) {
        json_response(['ok' => false, 'message' => 'Không tìm thấy bài viết.'], 404);
    }

    $clean = clean_blog($input);
    $blogs[$index] = array_merge($blogs[$index], $clean, [
        'updatedAt' => date('c'),
    ]);

    // Update slug if title changed
    if (!empty($input['title']) && ($blogs[$index]['slug'] ?? '') !== generate_slug($input['title'])) {
        $newSlug = generate_slug($input['title']);
        $existingSlugs = array_column($blogs, 'slug');
        $existingSlugs = array_values(array_filter($existingSlugs, fn($s) => $s !== ($blogs[$index]['slug'] ?? '')));
        $baseSlug = $newSlug;
        $counter = 1;
        while (in_array($newSlug, $existingSlugs)) {
            $newSlug = $baseSlug . '-' . (++$counter);
        }
        $blogs[$index]['slug'] = $newSlug;
    }

    if (!save_json_file(blogs_file(), $blogs)) {
        json_response(['ok' => false, 'message' => 'Không thể lưu bài viết.'], 500);
    }

    json_response(['ok' => true, 'blog' => $blogs[$index], 'csrfToken' => csrf_token()]);
}

// DELETE – delete blog
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    require_admin();
    require_csrf();

    $input = request_json();
    $id = trim((string) ($input['id'] ?? ''));

    if (empty($id)) {
        json_response(['ok' => false, 'message' => 'Thiếu ID bài viết.'], 400);
    }

    $blogs = load_blogs();
    $blogs = array_values(array_filter($blogs, fn($b) => ($b['id'] ?? '') !== $id));

    if (!save_json_file(blogs_file(), $blogs)) {
        json_response(['ok' => false, 'message' => 'Không thể xóa bài viết.'], 500);
    }

    json_response(['ok' => true, 'csrfToken' => csrf_token()]);
}

json_response(['ok' => false, 'message' => 'Phương thức không được hỗ trợ.'], 405);
