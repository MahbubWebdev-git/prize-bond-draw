<?php

use App\Http\Controllers\Api\Admin\UserController as AdminUserController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BulkSearchController;
use App\Http\Controllers\Api\DrawController;
use App\Http\Controllers\Api\SearchController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    Route::middleware('can.view.results')->group(function () {
        Route::post('/search', [SearchController::class, 'search']);
        Route::get('/draws', [DrawController::class, 'index']);
        Route::get('/draws/{draw}', [DrawController::class, 'show']);
        Route::post('/dashboard/search', [SearchController::class, 'search']);
        Route::get('/dashboard/draws', [DrawController::class, 'index']);
    });

    Route::middleware('can.import.data')->group(function () {
        Route::post('/dashboard/bulk-search', [BulkSearchController::class, 'search']);
    });

    Route::middleware('admin')->prefix('admin')->group(function () {
        Route::get('/users', [AdminUserController::class, 'index']);
        Route::patch('/users/{user}', [AdminUserController::class, 'update']);
        Route::delete('/users/{user}', [AdminUserController::class, 'destroy']);
        // Admin-only lottery data entry (manual insert + CSV/XLS bulk upload).
        Route::post('/draws', [DrawController::class, 'store']);
        Route::post('/draws/import', [DrawController::class, 'import']);
    });
});
