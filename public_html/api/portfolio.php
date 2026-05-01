<?php

declare(strict_types=1);

require __DIR__ . '/common.php';

function portfolio_file(): string
{
    return storage_path('portfolio.json');
}

function load_portfolio(): array
{
    return load_json_file(portfolio_file(), []);
}

function generate_case_id(): string
{
    return 'case_' . bin2hex(random_bytes(6));
}

function clean_case(array $input): array
{
    return [
        'tag'       => trim((string) ($input['tag'] ?? '')),
        'tagColor'  => in_array($input['tagColor'] ?? '', ['pink', 'sage', 'lavender', 'gold']) ? $input['tagColor'] : 'pink',
        'title'     => trim((string) ($input['title'] ?? '')),
        'problem'   => trim((string) ($input['problem'] ?? '')),
        'insight'   => trim((string) ($input['insight'] ?? '')),
        'strategy'  => trim((string) ($input['strategy'] ?? '')),
        'execution' => trim((string) ($input['execution'] ?? '')),
        'result'    => trim((string) ($input['result'] ?? '')),
        'image'     => trim((string) ($input['image'] ?? '')),
        'order'     => (int) ($input['order'] ?? 0),
    ];
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $cases = load_portfolio();
    usort($cases, fn($a, $b) => ($a['order'] ?? 0) - ($b['order'] ?? 0));

    if (!empty($_GET['id'])) {
        $id = $_GET['id'];
        $found = array_values(array_filter($cases, fn($c) => ($c['id'] ?? '') === $id));
        if (empty($found)) {
            json_response(['ok' => false, 'message' => 'Không tìm thấy case study.'], 404);
        }
        json_response(['ok' => true, 'case' => $found[0]]);
    }

    json_response(['ok' => true, 'cases' => $cases, 'items' => $cases, 'total' => count($cases)]);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    require_admin();
    require_csrf();

    $input = request_json();
    $clean = clean_case($input);

    if (empty($clean['title'])) {
        json_response(['ok' => false, 'message' => 'Tiêu đề case study là bắt buộc.'], 400);
    }

    $cases = load_portfolio();
    $case = array_merge($clean, [
        'id'        => generate_case_id(),
        'createdAt' => date('c'),
    ]);

    $cases[] = $case;

    if (!save_json_file(portfolio_file(), $cases)) {
        json_response(['ok' => false, 'message' => 'Không thể lưu case study.'], 500);
    }

    json_response(['ok' => true, 'case' => $case, 'csrfToken' => csrf_token()], 201);
}

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    require_admin();
    require_csrf();

    $input = request_json();
    $id = trim((string) ($input['id'] ?? ''));

    if (empty($id)) {
        json_response(['ok' => false, 'message' => 'Thiếu ID case study.'], 400);
    }

    $cases = load_portfolio();
    $index = null;

    foreach ($cases as $i => $c) {
        if (($c['id'] ?? '') === $id) {
            $index = $i;
            break;
        }
    }

    if ($index === null) {
        json_response(['ok' => false, 'message' => 'Không tìm thấy case study.'], 404);
    }

    $clean = clean_case($input);
    $cases[$index] = array_merge($cases[$index], $clean);

    if (!save_json_file(portfolio_file(), $cases)) {
        json_response(['ok' => false, 'message' => 'Không thể lưu case study.'], 500);
    }

    json_response(['ok' => true, 'case' => $cases[$index], 'csrfToken' => csrf_token()]);
}

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    require_admin();
    require_csrf();

    $input = request_json();
    $id = trim((string) ($input['id'] ?? ''));

    if (empty($id)) {
        json_response(['ok' => false, 'message' => 'Thiếu ID case study.'], 400);
    }

    $cases = load_portfolio();
    $cases = array_values(array_filter($cases, fn($c) => ($c['id'] ?? '') !== $id));

    if (!save_json_file(portfolio_file(), $cases)) {
        json_response(['ok' => false, 'message' => 'Không thể xóa case study.'], 500);
    }

    json_response(['ok' => true, 'csrfToken' => csrf_token()]);
}

json_response(['ok' => false, 'message' => 'Phương thức không được hỗ trợ.'], 405);
