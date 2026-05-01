<?php

declare(strict_types=1);

require __DIR__ . '/common.php';

require_admin();

$imagesDir = realpath(__DIR__ . '/../images');

if ($imagesDir === false) {
    mkdir(__DIR__ . '/../images/uploads', 0755, true);
    $imagesDir = realpath(__DIR__ . '/../images');
}

if ($imagesDir === false) {
    json_response(['ok' => false, 'message' => 'Khong the mo thu muc images.'], 500);
}

$allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'svg', 'gif'];

function media_relative_path(string $baseDir, string $path): string
{
    $relative = substr($path, strlen($baseDir) + 1);
    return str_replace(DIRECTORY_SEPARATOR, '/', $relative);
}

function media_item(string $baseDir, SplFileInfo $file): array
{
    $path = $file->getRealPath() ?: $file->getPathname();
    $relative = media_relative_path($baseDir, $path);
    $info = @getimagesize($path);

    return [
        'filename' => $relative,
        'name' => basename($relative),
        'url' => 'images/' . $relative,
        'size' => $file->getSize(),
        'width' => is_array($info) ? ($info[0] ?? null) : null,
        'height' => is_array($info) ? ($info[1] ?? null) : null,
        'modified' => date('Y-m-d H:i', $file->getMTime()),
        'deletable' => strpos($relative, 'uploads/') === 0,
    ];
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $items = [];
    $iterator = new RecursiveIteratorIterator(
        new RecursiveDirectoryIterator($imagesDir, FilesystemIterator::SKIP_DOTS)
    );

    foreach ($iterator as $file) {
        if (!$file instanceof SplFileInfo || !$file->isFile()) {
            continue;
        }

        if (!in_array(strtolower($file->getExtension()), $allowedExtensions, true)) {
            continue;
        }

        $items[] = media_item($imagesDir, $file);
    }

    usort($items, static fn (array $a, array $b): int => strcmp($b['modified'], $a['modified']));
    json_response(['ok' => true, 'items' => $items, 'csrfToken' => csrf_token()]);
}

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    require_csrf();

    $data = request_json();
    $filename = str_replace('\\', '/', trim((string) ($data['filename'] ?? '')));

    if ($filename === '' || strpos($filename, '..') !== false || strpos($filename, 'uploads/') !== 0) {
        json_response(['ok' => false, 'message' => 'Chi co the xoa anh trong thu muc uploads.'], 400);
    }

    $target = realpath($imagesDir . DIRECTORY_SEPARATOR . str_replace('/', DIRECTORY_SEPARATOR, $filename));
    $uploadsDir = realpath($imagesDir . DIRECTORY_SEPARATOR . 'uploads');

    if ($target === false || $uploadsDir === false || strpos($target, $uploadsDir) !== 0 || !is_file($target)) {
        json_response(['ok' => false, 'message' => 'Khong tim thay anh can xoa.'], 404);
    }

    if (!unlink($target)) {
        json_response(['ok' => false, 'message' => 'Khong the xoa anh.'], 500);
    }

    json_response(['ok' => true, 'csrfToken' => csrf_token()]);
}

json_response(['ok' => false, 'message' => 'Phuong thuc khong duoc ho tro.'], 405);
