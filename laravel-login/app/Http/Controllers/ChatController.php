<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\Chatbot\ChatbotService;
use App\Models\Chat;

class ChatController extends Controller
{
    protected $chatbotService;

    public function __construct(ChatbotService $chatbotService)
    {
        $this->chatbotService = $chatbotService;
    }

    // Endpoint: POST /chat
    public function ask(Request $request)
    {
        $request->validate(['message' => 'required|string']);
        
        // 1. Ambil data user dari Sanctum
        $authUser = auth('sanctum')->user();
        
        // Sesuaikan kolom primary key-nya (di gambar tertulis 'user_id' bukan 'id')
        $userId = request()->header('X-User-Id') ?? ($authUser ? $authUser->user_id : null);
        
        // Ambil user_jabatan dari authUser
        $userJabatan = $authUser ? $authUser->user_jabatan : null;

        // Jika menggunakan X-User-Id header (misal dipanggil dari service lain) dan tidak ada authUser, 
        // pastikan kamu melakukan query ke tabel user jika butuh jabatannya:
        if (!$userJabatan && $userId) {
            $dbUser = \Illuminate\Support\Facades\DB::table('user')->where('user_id', $userId)->first();
            $userJabatan = $dbUser ? $dbUser->user_jabatan : null;
        }

        // 2. Buat object $user dengan tambahan user_jabatan
        $user = (object) [
            'user_id' => $userId,
            'user_jabatan' => $userJabatan,
            'nama' => $authUser ? $authUser->user_nama : 'Karyawan'
        ];

        if ($this->chatbotService->isLimitReached($user->user_id)) {
            return response()->json(['message' => 'Batas chat harian Anda sudah habis.'], 403);
        }

        $response = $this->chatbotService->processMessage($user, $request->message);

        return response()->json($response);
    }

    // Endpoint: GET /chat/history
    public function history()
    {
        // 1. Ambil ID
        $userId = request()->header('X-User-Id') ?? auth('sanctum')->id();
        // 2. Buat object $user (INI YANG SEBELUMNYA HILANG)
        $user = (object) ['user_id' => $userId];
        
        // Ambil 20 riwayat terakhir untuk ditampilkan di UI frontend
        $chats = $this->chatbotService->getHistory($user->user_id, 20);

        return response()->json($chats);
    }

    // Endpoint: DELETE /chat/clear
    public function clearHistory()
    {
        // 1. Ambil ID
        $userId = request()->header('X-User-Id') ?? auth('sanctum')->id();
        // 2. Buat object $user (INI YANG SEBELUMNYA HILANG)
        $user = (object) ['user_id' => $userId];
        
        $this->chatbotService->clearHistory($user->user_id);

        return response()->json([
            'message' => 'Riwayat obrolan berhasil dihapus.'
        ]);
    }

    // Endpoint: GET /chat/remaining
    public function remaining()
    {
        // 1. Ambil ID
        $userId = request()->header('X-User-Id') ?? auth('sanctum')->id();
        // 2. Buat object $user (INI YANG SEBELUMNYA HILANG)
        $user = (object) ['user_id' => $userId];
        $limit = 100;
        
        $todayCount = Chat::where('user_id', $user->user_id)
            ->whereDate('created_at', now())
            ->count();

        return response()->json([
            'limit' => $limit,
            'used' => $todayCount,
            'remaining' => max($limit - $todayCount, 0)
        ]);
    }
}