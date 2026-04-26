<?php

declare(strict_types=1);

require __DIR__ . '/common.php';

json_response([
    'ok' => true,
    'authenticated' => !empty($_SESSION['admin_logged_in']),
    'username' => $_SESSION['admin_username'] ?? null,
]);
