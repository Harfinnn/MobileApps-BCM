<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProfileController;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::middleware('auth:sanctum')->group(function () {

    // ambil profile (opsional, kamu sudah pakai AsyncStorage)
    Route::get('/profile', function (Request $request) {
        return $request->user();
    });

    // 🔥 UPDATE PROFILE
    Route::post('/profile/update', [ProfileController::class, 'update']);
});
