<?php

declare(strict_types=1);

// Ensure session lasts at least 24h on shared hosting
ini_set('session.gc_maxlifetime', '86400');

$secure = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off');
session_set_cookie_params([
    'lifetime' => 86400,
    'path' => '/',
    'secure' => $secure,
    'httponly' => true,
    'samesite' => 'Lax',
]);
session_start();

const STRING_CONTENT_KEYS = [
    'heroEyebrow',
    'heroTitle',
    'heroLead',
    'primaryCta',
    'secondaryCta',
    'profileCta',
    'profileUrl',
    'profileName',
    'profileSummary',
    'servicesTitle',
    'servicesIntro',
    'packagesTitle',
    'projectsTitle',
    'processTitle',
    'aboutTitle',
    'aboutParagraph1',
    'aboutParagraph2',
    'proofTitle',
    'contactTitle',
    'email',
    'phone',
    'facebook',
    'linkedin',
];

const LIST_CONTENT_KEYS = [
    'services',
    'packages',
    'projects',
    'process',
    'proofs',
];

function app_config(): array
{
    return require __DIR__ . '/../../config/config.php';
}

function storage_path(string $file): string
{
    return __DIR__ . '/../../storage/' . $file;
}

function content_file(): string
{
    return storage_path('content.json');
}

function leads_file(): string
{
    return storage_path('leads.json');
}

function json_response(array $payload, int $status = 200): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('X-Content-Type-Options: nosniff');
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}

function request_json(): array
{
    $data = json_decode(file_get_contents('php://input') ?: '', true);

    if (!is_array($data)) {
        json_response(['ok' => false, 'message' => 'Dữ liệu gửi lên không hợp lệ.'], 400);
    }

    return $data;
}

function csrf_token(): string
{
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }

    return $_SESSION['csrf_token'];
}

function require_csrf(): void
{
    $token = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';

    if (!$token || !hash_equals(csrf_token(), $token)) {
        json_response(['ok' => false, 'message' => 'Phiên bảo mật không hợp lệ. Hãy tải lại trang.'], 419);
    }
}

function require_admin(): void
{
    if (empty($_SESSION['admin_logged_in'])) {
        json_response(['ok' => false, 'message' => 'Bạn cần đăng nhập admin.'], 401);
    }
}

function load_json_file(string $path, array $fallback): array
{
    if (!is_file($path)) {
        return $fallback;
    }

    $content = json_decode(file_get_contents($path) ?: '', true);
    return is_array($content) ? $content : $fallback;
}

function save_json_file(string $path, array $payload): bool
{
    return file_put_contents(
        $path,
        json_encode($payload, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE),
        LOCK_EX
    ) !== false;
}

function load_content(): array
{
    return load_json_file(content_file(), []);
}

function clean_list(array $items, array $allowedKeys): array
{
    return array_values(array_map(static function ($item) use ($allowedKeys): array {
        $clean = [];

        foreach ($allowedKeys as $key) {
            $clean[$key] = trim((string) ($item[$key] ?? ''));
        }

        return $clean;
    }, array_filter($items, 'is_array')));
}

function clean_content(array $input): array
{
    $content = [];

    foreach (STRING_CONTENT_KEYS as $key) {
        $content[$key] = trim((string) ($input[$key] ?? ''));
    }

    $content['services'] = clean_list(is_array($input['services'] ?? null) ? $input['services'] : [], ['tag', 'title', 'text']);
    $content['packages'] = clean_list(is_array($input['packages'] ?? null) ? $input['packages'] : [], ['title', 'text']);
    $content['projects'] = clean_list(is_array($input['projects'] ?? null) ? $input['projects'] : [], ['tag', 'title', 'context', 'role', 'result']);
    $content['process'] = clean_list(is_array($input['process'] ?? null) ? $input['process'] : [], ['title', 'text']);
    $content['proofs'] = array_values(array_filter(array_map(
        static fn ($item): string => trim((string) $item),
        is_array($input['proofs'] ?? null) ? $input['proofs'] : []
    )));

    return $content;
}

function validate_email(string $email): bool
{
    return (bool) filter_var($email, FILTER_VALIDATE_EMAIL);
}
