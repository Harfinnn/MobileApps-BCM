<?php

use App\Http\Controllers\Adm4Controller;
use App\Http\Controllers\BeritaController;
use App\Http\Controllers\DashboardBencanaController;
use App\Http\Controllers\LaporBencanaController;
use App\Http\Controllers\MJaringanSelindoController;
use App\Http\Controllers\BencanaController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PanduanController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\WeatherController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// AUTH (PUBLIC)
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// PANDUAN BENCANA
Route::get('/panduan', [PanduanController::class, 'index']);
Route::get('/panduan/{id}', [PanduanController::class, 'show']);

// BERITA (PUBLIC)
Route::get('/berita', [BeritaController::class, 'index']);
Route::get('/berita/{id}', [BeritaController::class, 'show']);

// LOCATION (PUBLIC)
Route::get('/adm4/nearest', [Adm4Controller::class, 'nearest']);

// WEATHER
Route::get('/weather', [WeatherController::class, 'forecast']);

// AUTHENTICATED APIs
Route::middleware('auth:sanctum')->group(function () {

    Route::get('/me', [AuthController::class, 'me']);

    // PROFILE
    Route::get('/profile', [ProfileController::class, 'me']);
    Route::post('/profile/update', [ProfileController::class, 'update']);

    // MASTER DATA
    Route::get('/bencana', [BencanaController::class, 'index']);
    Route::get('/selindo', [MJaringanSelindoController::class, 'index']);
    Route::get('/selindo/search', [MJaringanSelindoController::class, 'search']);
    Route::get('/selindo/{id}', [MJaringanSelindoController::class, 'show']);

    // 🔔 LAPOR BENCANA (KIRIM NOTIF)
    Route::post('/lapor-bencana', [LaporBencanaController::class, 'store']);

    // 🔔 NOTIFICATIONS
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::get('/notifications/unread-count', [NotificationController::class, 'unreadCount']);
    Route::patch('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    Route::patch('/notifications/read-all', [NotificationController::class, 'markAllAsRead']);

    // DASHBOARD LAPORAN BENCANA
    Route::get('/dashboard/bencana', [DashboardBencanaController::class, 'index']);
    Route::get('/dashboard/bencana/summary', [DashboardBencanaController::class, 'summary']);
    Route::get('/dashboard/bencana/{id}', [DashboardBencanaController::class, 'show']);

    Route::post('/save-fcm-token', function (Request $request) {
        $request->validate([
            'fcm_token' => 'required|string',
        ]);

        $request->user()->update([
            'fcm_token' => $request->fcm_token,
        ]);

        return response()->json(['success' => true]);
    });


});
