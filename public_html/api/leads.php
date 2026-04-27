<?php

declare(strict_types=1);

require __DIR__ . '/common.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    json_response(['ok' => false, 'message' => 'Phương thức không được hỗ trợ.'], 405);
}

require_admin();

$leads = array_reverse(load_json_file(leads_file(), []));

json_response(['ok' => true, 'leads' => $leads, 'csrfToken' => csrf_token()]);
