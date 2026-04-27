<?php

declare(strict_types=1);

session_start();

const CONTENT_KEYS = [
    'heroEyebrow',
    'heroTitle',
    'heroLead',
    'profileName',
    'profileSummary',
    'aboutTitle',
    'aboutParagraph1',
    'aboutParagraph2',
    'email',
    'phone',
    'facebook',
    'linkedin',
];

function app_config(): array
{
    return require __DIR__ . '/../../config/config.php';
}

function content_file(): string
{
    return __DIR__ . '/../../storage/content.json';
}

function json_response(array $payload, int $status = 200): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
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

function require_admin(): void
{
    if (empty($_SESSION['admin_logged_in'])) {
        json_response(['ok' => false, 'message' => 'Bạn cần đăng nhập admin.'], 401);
    }
}

function load_content(): array
{
    $content = json_decode(file_get_contents(content_file()) ?: '{}', true);
    return is_array($content) ? $content : [];
}

function clean_content(array $input): array
{
    $content = [];

    foreach (CONTENT_KEYS as $key) {
        $content[$key] = trim((string) ($input[$key] ?? ''));
    }

    return $content;
}
