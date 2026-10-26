<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ContentController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\VideoController;
use Illuminate\Support\Facades\Route;

// ─── PUBLIC ROUTES ────────────────────────────────────────────
Route::get('/services', [ServiceController::class, 'index']);
Route::get('/videos', [VideoController::class, 'index']);
Route::get('/reviews', [ReviewController::class, 'index']);
Route::post('/reviews', [ReviewController::class, 'store']);
Route::get('/site-data', [ContentController::class, 'siteData']);

// ─── AUTH ─────────────────────────────────────────────────────
Route::post('/admin/login', [AuthController::class, 'login']);

// ─── PROTECTED ADMIN ROUTES ───────────────────────────────────
Route::middleware(['auth:sanctum'])->prefix('admin')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Services
    Route::get('/services', [ServiceController::class, 'all']);
    Route::post('/services', [ServiceController::class, 'store']);
    Route::put('/services/{service}', [ServiceController::class, 'update']);
    Route::delete('/services/{service}', [ServiceController::class, 'destroy']);

    // Videos
    Route::get('/videos', [VideoController::class, 'all']);
    Route::post('/videos', [VideoController::class, 'store']);
    Route::post('/videos/{video}', [VideoController::class, 'update']); // POST for file upload
    Route::delete('/videos/{video}', [VideoController::class, 'destroy']);

    // Reviews
    Route::get('/reviews', [ReviewController::class, 'all']);
    Route::patch('/reviews/{review}/approve', [ReviewController::class, 'approve']);
    Route::patch('/reviews/{review}/reject', [ReviewController::class, 'reject']);
    Route::delete('/reviews/{review}', [ReviewController::class, 'destroy']);

    // Content
    Route::post('/hero', [ContentController::class, 'updateHero']);
    Route::post('/about', [ContentController::class, 'updateAbout']);
    Route::put('/settings', [ContentController::class, 'updateSettings']);
});
