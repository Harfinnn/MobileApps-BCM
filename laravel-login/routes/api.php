<?php

use App\Http\Controllers\Adm4Controller;
use App\Http\Controllers\BeritaController;
use App\Http\Controllers\MobilePlaybookController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\DashboardBencanaController;
use App\Http\Controllers\LaporBencanaController;
use App\Http\Controllers\MJaringanSelindoController;
use App\Http\Controllers\BencanaController;
use App\Http\Controllers\GempaRadiusController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PanduanController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\WeatherController;
use App\Http\Controllers\API\AppConfigController;

use App\Services\Operational\OperationalCorrelationService;
use App\Services\Operational\OperationalInsightService;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
use Barryvdh\DomPDF\Facade\Pdf;

Route::get('/cek-kendala-cob', function () {
    $data = \Illuminate\Support\Facades\DB::table('cob_data')
        ->whereNotNull('cod_ket')
        ->where('cod_ket', '!=', '')
        ->select('cod_tgl', 'cod_ket')
        ->orderByDesc('cod_tgl')
        ->get();

    return response()->json([
        'total_kendala' => $data->count(),
        'data' => $data
    ]);
});

Route::get('/pdf-test', function () {
    $dummyText = "Laporan Operasional COB - 25 hingga 29 April 2026\n\nProses End-of-Day (EOD) dan Start-of-Day (SOD) berjalan dengan rata-rata durasi 3 jam 15 menit per hari.\nTotal transaksi yang diproses selama periode ini mencapai 25.120.300 transaksi.\n\nBerdasarkan pantauan sistem, seluruh stage Application dan System Wide berjalan dalam kondisi stabil tanpa kendala berarti.";

    // Buat dimensi kustom 16:9 (misal: 960 x 540 point)
    $customPaper = array(0, 0, 960, 540);

    $pdf = Pdf::loadView('pdf.cob_report', [
        'laporan_text' => $dummyText
    ])->setPaper($customPaper); // <-- TAMBAHKAN KODE INI

    return $pdf->stream('test-laporan-cob-ppt.pdf');
});


Route::get('/test-pdf', function () {
    $pdf = Pdf::loadHTML('<h1>PDF OK dari local</h1>');
    return $pdf->stream();
});


Route::get('/debug-token', function () {
    return \App\Models\User::select('user_id', 'fcm_token')->get();
});

// AUTH (PUBLIC)
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/first-change-password', [AuthController::class, 'firstChangePassword']);

// CHATBOT
Route::get('/chat/remaining', [ChatController::class, 'remaining']);
Route::post('/chat', [ChatController::class, 'ask'])->middleware('throttle:chat_api');
Route::get('/chat/history', [ChatController::class, 'history']);
Route::delete('/chat/clear', [ChatController::class, 'clearHistory']);

// TEST
Route::get('/test-date', function () {

    $parser = new \App\Services\Parser\DateParser();

    return $parser->parse(
        request('q')
    );
});

Route::get('/test-compare', function () {

    $parser = new \App\Services\Parser\CompareParser();

    return $parser->parse(
        request('q')
    );
});

Route::get('/test-correlation', function (

    OperationalCorrelationService $service,

    OperationalInsightService $insightService

) {

    // =====================================
    // INCIDENT DATA
    // =====================================

    $incidentData = DB::table('insiden_itdata')
        ->where('iid_tahun', '2026')
        ->get()
        ->all();

    // =====================================
    // COB DATA
    // =====================================

    $cobData = DB::table('cob_data')
        ->where('cod_tgl', 'like', '2026%')
        ->get()
        ->toArray();

    // =====================================
    // CORRELATION
    // =====================================

    $result = $service
        ->correlateIncidentWithCob(

            $incidentData,

            json_decode(
                json_encode($cobData),
                true
            )
        );

    // =====================================
    // SUMMARY
    // =====================================

    $summary = $insightService
        ->buildCorrelationSummary($result);

    // =====================================
    // RESPONSE
    // =====================================

    return response()->json([

        'summary' => $summary,

        'correlation_data' => $result,
    ]);
});

// ADMIN ACTION
Route::post('/users/{id}/disable', [UserController::class, 'disable']);

// PANDUAN BENCANA
Route::get('/panduan', [PanduanController::class, 'index']);
Route::get('/panduan/{id}', [PanduanController::class, 'show']);

Route::get('/app-config', [AppConfigController::class, 'index']);

// BERITA (PUBLIC)
Route::get('/berita', [BeritaController::class, 'index']);
Route::get('/berita/{id}', [BeritaController::class, 'show']);

// PLAYBOOK (PUBLIC)
Route::get('/mobile-playbooks', [MobilePlaybookController::class, 'index']);
Route::get('/mobile-playbooks/{id}', [MobilePlaybookController::class, 'show']);

// LOCATION (PUBLIC)
Route::get('/adm4/nearest', [Adm4Controller::class, 'nearest']);

// WEATHER
Route::get('/weather', [WeatherController::class, 'index']);

/* ==============================================
   CRON JOB & WEBHOOKS (Ditembak dari luar)
============================================== */
Route::get('/cron/run-schedule', function (Request $request) {
    // 1. Password/token rahasia kamu
    $secretToken = 'bcm-it-resilience-aman'; 

    // 2. Cek apakah token cocok
    if ($request->query('token') !== $secretToken) {
        return response()->json(['error' => 'Akses ditolak.'], 401);
    }

    try {
        // 3. Panggil komando master schedule Laravel
        // Ini akan otomatis menjalankan gempa (tiap menit) & cuaca (tiap jam)
        \Illuminate\Support\Facades\Artisan::call('schedule:run');

        return response()->json([
            'status' => 'success',
            'message' => 'Laravel Scheduler berhasil dijalankan.'
        ]);
    } catch (\Exception $e) {
        \Illuminate\Support\Facades\Log::error('Cron External Error: ' . $e->getMessage());
        return response()->json([
            'status' => 'error',
            'message' => $e->getMessage()
        ], 500);
    }
});

// AUTHENTICATED APIs
Route::middleware(['auth:sanctum', 'check.user.status'])->group(function () {

    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/update-fcm-token', [UserController::class, 'updateFcmToken']);

    // PROFILE
    Route::get('/profile', [ProfileController::class, 'me']);
    Route::post('/profile/update', [ProfileController::class, 'update']);

    // INFO SETTINGS
    Route::put('/app-config', [AppConfigController::class, 'update']);

    // MASTER DATA
    Route::get('/bencana', [BencanaController::class, 'index']);
    Route::get('/selindo', [MJaringanSelindoController::class, 'index']);
    Route::get('/selindo/search', [MJaringanSelindoController::class, 'search']);
    Route::get('/selindo/{id}', [MJaringanSelindoController::class, 'show']);

    // LAPOR BENCANA (KIRIM NOTIF)
    Route::post('/lapor-bencana', [LaporBencanaController::class, 'store']);
    Route::get('/gempa/{ref}/unit-status', [LaporBencanaController::class, 'unitStatus']);
    Route::get('/gempa-radius', [GempaRadiusController::class, 'index']);

    // NOTIFICATIONS
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::get('/notifications/unread-count', [NotificationController::class, 'unreadCount']);
    Route::patch('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    Route::patch('/notifications/read-all', [NotificationController::class, 'markAllAsRead']);

    // DASHBOARD LAPORAN BENCANA
    Route::get('/dashboard/bencana', [DashboardBencanaController::class, 'index']);
    Route::get('/dashboard/bencana/summary', [DashboardBencanaController::class, 'summary']);
    Route::get('/dashboard/bencana/{id}', [LaporBencanaController::class, 'show']);

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
        'adm4_id' => 'required|exists:mobile_adm4,id'
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