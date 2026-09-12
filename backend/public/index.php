<?php

use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

// LiteSpeed Subfolder Routing fix: Request URI থেকে extra path ট্রিম করা
if (isset($_SERVER['REQUEST_URI'])) {
    $_SERVER['REQUEST_URI'] = preg_replace('#^/prizebond_draw/backend#', '', $_SERVER['REQUEST_URI']);
}

// Determine if the application is in maintenance mode...
if (file_exists($maintenance = __DIR__.'/../storage/framework/maintenance.php')) {
    require $maintenance;
}

// Register the Auto Loader...
require __DIR__.'/../vendor/autoload.php';

// Bootstrap Laravel and handle the request...
(require_once __DIR__.'/../bootstrap/app.php')
    ->handleRequest(Request::capture());