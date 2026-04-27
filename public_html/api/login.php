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
$passwordHash = (string) ($config['admin_password_hash'] ?? '');

if ($passwordHash === '') {
    json_response(['ok' => false, 'message' => 'Admin chưa được cấu hình mật khẩu. Hãy đặt KIMTHAM_ADMIN_PASSWORD_HASH trên hosting.'], 503);
}

if ($username === $config['admin_username'] && password_verify($password, $passwordHash)) {
    session_regenerate_id(true);
    $_SESSION['admin_logged_in'] = true;
    $_SESSION['admin_username'] = $username;

    json_response(['ok' => true, 'username' => $username, 'csrfToken' => csrf_token()]);
}

json_response(['ok' => false, 'message' => 'Sai tài khoản hoặc mật khẩu.'], 401);
