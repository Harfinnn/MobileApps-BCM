<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Http;
use Illuminate\Http\Request;
use App\Models\Chat;

class ChatController extends Controller
{
    public function ask(Request $request)
{
    $user = auth()->user();
    $message = $request->message;
    $limit = 100;

    // ðŸ”¥ HITUNG CHAT HARI INI
    $todayCount = Chat::where('user_id', $user->user_id)
        ->whereDate('created_at', now())
        ->count();

    if ($todayCount >= $limit) {
        return response()->json([
            'message' => 'Batas chat hari ini sudah habis.',
            'remaining' => 0,
            'limit' => $limit,
            'used' => $todayCount
        ], 403);
    }

    // ðŸ”¥ AMBIL 5 CHAT TERAKHIR UNTUK MEMORY
    $recentChats = Chat::where('user_id', $user->user_id)
        ->latest()
        ->take(5)
        ->get()
        ->reverse();

    $messages = [
        [
            'role' => 'system',
            'content' => '
Kamu adalah BCM-Assistant, asisten digital resmi di aplikasi ini.

Karakter:
- Ramah, profesional, dan membantu.
- Gunakan Bahasa Indonesia secara default.
- Sesuaikan bahasa dengan bahasa pengguna.
- Boleh menggunakan emoji seperlunya.

Kemampuan:
- Menjawab pertanyaan umum.
- Memberikan informasi cuaca jika diminta.
- Membantu memahami fitur aplikasi.

Aturan:
- Jawaban harus jelas dan mudah dipahami.
- Jangan menyebutkan bahwa kamu adalah model dari pihak ketiga.
- Jika tidak tahu jawaban pasti, jelaskan secara umum tanpa mengarang.
'
        ]
    ];

    // ðŸ”¥ MASUKKAN HISTORY KE CONTEXT
    foreach ($recentChats as $chat) {
        $messages[] = [
            'role' => 'user',
            'content' => $chat->message
        ];

        $messages[] = [
            'role' => 'assistant',
            'content' => $chat->reply
        ];
    }

    // ðŸ”¥ TAMBAHKAN PESAN TERBARU
    $messages[] = [
        'role' => 'user',
        'content' => $message
    ];

    // ðŸ”¥ REQUEST KE GROQ
    $response = Http::withHeaders([
        'Authorization' => 'Bearer ' . env('GROQ_API_KEY'),
        'Content-Type' => 'application/json',
    ])->post('https://api.groq.com/openai/v1/chat/completions', [
        'model' => 'llama-3.1-8b-instant',
        'messages' => $messages,
    ]);

    if (!$response->successful()) {
        return response()->json([
            'message' => 'AI sedang mengalami gangguan.'
        ], 500);
    }

    $reply = $response->json()['choices'][0]['message']['content']
        ?? 'Maaf terjadi kesalahan.';

    // ðŸ”¥ SIMPAN CHAT
    Chat::create([
        'user_id' => $user->user_id,
        'message' => $message,
        'reply' => $reply,
    ]);

    // ðŸ”¥ HITUNG ULANG SETELAH INSERT
    $newTodayCount = $todayCount + 1;
    $remaining = max($limit - $newTodayCount, 0);

    return response()->json([
        'reply' => $reply,
        'limit' => $limit,
        'used' => $newTodayCount,
        'remaining' => $remaining
    ]);
}
public function history()
{
    $user = auth()->user();

    $chats = Chat::where('user_id', $user->user_id)
        ->latest()
        ->take(20)
        ->get()
        ->reverse()
        ->values();

    return response()->json($chats);
}
public function clearHistory()
{
    $user = auth()->user();

    Chat::where('user_id', $user->user_id)->delete();

    return response()->json([
        'message' => 'Riwayat berhasil dihapus.'
    ]);
}

public function remaining()
{
    $user = auth()->user();

    $todayCount = Chat::where('user_id', $user->user_id)
        ->whereDate('created_at', now())
        ->count();

    $limit = 100;
    $remaining = max($limit - $todayCount, 0);

    return response()->json([
        'limit' => $limit,
        'used' => $todayCount,
        'remaining' => $remaining
    ]);
}
}