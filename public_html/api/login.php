<?php

declare(strict_types=1);

require __DIR__ . '/common.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(['ok' => false, 'message' => 'Phương thức không được hỗ trợ.'], 405);
}

$data = request_json();
$config = app_config();
$username = trim((string) ($data['username'] ?? ''));
$password = (string) ($data['password'] ?? '');

if ($username === $config['admin_username'] && hash_equals($config['admin_password'], $password)) {
    session_regenerate_id(true);
    $_SESSION['admin_logged_in'] = true;
    $_SESSION['admin_username'] = $username;

    json_response(['ok' => true, 'username' => $username]);
}

json_response(['ok' => false, 'message' => 'Sai tài khoản hoặc mật khẩu.'], 401);
