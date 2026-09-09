<?php

use App\Http\Controllers\Api\Admin\UserController as AdminUserController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BulkSearchController;
use App\Http\Controllers\Api\DrawController;
use App\Http\Controllers\Api\SearchController;
use Illuminate\Support\Facades\Route;

// শুধু auth endpoints public — draw/search data আর public না
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // সব draw/search data — login + admin-approved permission লাগবে
    Route::middleware('can.view.results')->group(function () {
        Route::post('/search', [SearchController::class, 'search']);
        Route::get('/draws', [DrawController::class, 'index']);
        Route::get('/draws/{draw}', [DrawController::class, 'show']);

        Route::post('/dashboard/search', [SearchController::class, 'search']);
        Route::post('/dashboard/bulk-search', [BulkSearchController::class, 'search']);
        Route::get('/dashboard/draws', [DrawController::class, 'index']);
    });

    // শুধু admin
    Route::middleware('admin')->prefix('admin')->group(function () {
        Route::get('/users', [AdminUserController::class, 'index']);
        Route::patch('/users/{user}', [AdminUserController::class, 'update']);
    });
});
