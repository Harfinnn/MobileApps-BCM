<?php

use App\Http\Controllers\Adm4Controller;
use App\Http\Controllers\BeritaController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\DashboardBencanaController;
use App\Http\Controllers\LaporBencanaController;
use App\Http\Controllers\MJaringanSelindoController;
use App\Http\Controllers\BencanaController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PanduanController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\WeatherController;
use App\Http\Controllers\API\AppConfigController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// AUTH (PUBLIC)
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// ADMIN ACTION
Route::post('/users/{id}/disable', [UserController::class, 'disable']);

// PANDUAN BENCANA
Route::get('/panduan', [PanduanController::class, 'index']);
Route::get('/panduan/{id}', [PanduanController::class, 'show']);

Route::get('/app-config', [AppConfigController::class, 'index']);

// BERITA (PUBLIC)
Route::get('/berita', [BeritaController::class, 'index']);
Route::get('/berita/{id}', [BeritaController::class, 'show']);

// LOCATION (PUBLIC)
Route::get('/adm4/nearest', [Adm4Controller::class, 'nearest']);

// WEATHER
Route::get('/weather', [WeatherController::class, 'index']);

// AUTHENTICATED APIs
Route::middleware(['auth:sanctum','check.user.status'])->group(function () {

    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/update-fcm-token', [UserController::class, 'updateFcmToken']);

    // PROFILE
    Route::get('/profile', [ProfileController::class, 'me']);
    Route::post('/profile/update', [ProfileController::class, 'update']);

    // INFO SETTINGS
    Route::put('/app-config', [AppConfigController::class, 'update']);

    // CHATBOT
    Route::get('/chat/remaining', [ChatController::class, 'remaining']);
    Route::post('/chat', [ChatController::class, 'ask']);
    Route::get('/chat/history', [ChatController::class, 'history']);
    Route::delete('/chat/clear', [ChatController::class, 'clearHistory']);

    // MASTER DATA
    Route::get('/bencana', [BencanaController::class, 'index']);
    Route::get('/selindo', [MJaringanSelindoController::class, 'index']);
    Route::get('/selindo/search', [MJaringanSelindoController::class, 'search']);
    Route::get('/selindo/{id}', [MJaringanSelindoController::class, 'show']);

    // LAPOR BENCANA (KIRIM NOTIF)
    Route::post('/lapor-bencana', [LaporBencanaController::class, 'store']);

    // NOTIFICATIONS
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

    Route::post('/user-location', function (Request $request) {

        $request->validate([
            'adm4_id' => 'required|exists:adm4,id'
        ]);

        $user = $request->user();

        \App\Models\UserAdm4History::updateOrCreate(
            [
                'user_id' => $user->user_id,
                'adm4_id' => $request->adm4_id
            ],
            [
                'last_accessed_at' => now()
            ]
        );

        return response()->json(['success' => true]);
    });

});
