<?php

declare(strict_types=1);

require __DIR__ . '/common.php';

function products_file(): string
{
    return storage_path('products.json');
}

function load_products(): array
{
    return load_json_file(products_file(), []);
}

function generate_product_id(): string
{
    return 'prod_' . bin2hex(random_bytes(6));
}

function clean_product(array $input): array
{
    return [
        'name'     => trim((string) ($input['name'] ?? '')),
        'category' => trim((string) ($input['category'] ?? '')),
        'tagColor' => in_array($input['tagColor'] ?? '', ['pink', 'sage', 'lavender', 'gold']) ? $input['tagColor'] : 'pink',
        'emoji'    => trim((string) ($input['emoji'] ?? '🌸')),
        'story'    => trim((string) ($input['story'] ?? '')),
        'ctaText'  => trim((string) ($input['ctaText'] ?? 'Nhắn mình để chọn mùi này')),
        'ctaUrl'   => trim((string) ($input['ctaUrl'] ?? 'contact.html?intent=perfume')),
        'order'    => (int) ($input['order'] ?? 0),
    ];
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $products = load_products();
    usort($products, fn($a, $b) => ($a['order'] ?? 0) - ($b['order'] ?? 0));

    if (!empty($_GET['id'])) {
        $id = $_GET['id'];
        $found = array_values(array_filter($products, fn($p) => ($p['id'] ?? '') === $id));
        if (empty($found)) {
            json_response(['ok' => false, 'message' => 'Không tìm thấy sản phẩm.'], 404);
        }
        json_response(['ok' => true, 'product' => $found[0]]);
    }

    json_response(['ok' => true, 'products' => $products, 'total' => count($products)]);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    require_admin();
    require_csrf();

    $input = request_json();
    $clean = clean_product($input);

    if (empty($clean['name'])) {
        json_response(['ok' => false, 'message' => 'Tên sản phẩm là bắt buộc.'], 400);
    }

    $products = load_products();
    $product = array_merge($clean, [
        'id'        => generate_product_id(),
        'createdAt' => date('c'),
    ]);

    $products[] = $product;

    if (!save_json_file(products_file(), $products)) {
        json_response(['ok' => false, 'message' => 'Không thể lưu sản phẩm.'], 500);
    }

    json_response(['ok' => true, 'product' => $product, 'csrfToken' => csrf_token()], 201);
}

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    require_admin();
    require_csrf();

    $input = request_json();
    $id = trim((string) ($input['id'] ?? ''));

    if (empty($id)) {
        json_response(['ok' => false, 'message' => 'Thiếu ID sản phẩm.'], 400);
    }

    $products = load_products();
    $index = null;

    foreach ($products as $i => $p) {
        if (($p['id'] ?? '') === $id) {
            $index = $i;
            break;
        }
    }

    if ($index === null) {
        json_response(['ok' => false, 'message' => 'Không tìm thấy sản phẩm.'], 404);
    }

    $clean = clean_product($input);
    $products[$index] = array_merge($products[$index], $clean);

    if (!save_json_file(products_file(), $products)) {
        json_response(['ok' => false, 'message' => 'Không thể lưu sản phẩm.'], 500);
    }

    json_response(['ok' => true, 'product' => $products[$index], 'csrfToken' => csrf_token()]);
}

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    require_admin();
    require_csrf();

    $input = request_json();
    $id = trim((string) ($input['id'] ?? ''));

    if (empty($id)) {
        json_response(['ok' => false, 'message' => 'Thiếu ID sản phẩm.'], 400);
    }

    $products = load_products();
    $products = array_values(array_filter($products, fn($p) => ($p['id'] ?? '') !== $id));

    if (!save_json_file(products_file(), $products)) {
        json_response(['ok' => false, 'message' => 'Không thể xóa sản phẩm.'], 500);
    }

    json_response(['ok' => true, 'csrfToken' => csrf_token()]);
}

json_response(['ok' => false, 'message' => 'Phương thức không được hỗ trợ.'], 405);
