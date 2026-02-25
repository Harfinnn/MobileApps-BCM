<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\LaporBencana;
use App\Models\Notification;
use App\Models\User;
use App\Services\FcmService;
use App\Helpers\NotificationHelper;
use Illuminate\Support\Facades\Log;

class LaporBencanaController extends Controller
{
    public function store(Request $request)
    {
        Log::info('LAPOR BENCANA MASUK');

        $sender = auth()->user();

        if (!$sender) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        /* ================= VALIDASI ================= */
        $request->validate([
            'unit_kerja_id' => 'required|integer',
            'unit_kerja_nama' => 'required|string',
            'mbe_id' => 'required|integer',
            'lokasi' => 'nullable|string',
            'terdampak' => 'required|boolean',
            'ada_kerusakan' => 'required|boolean',
            'foto' => 'nullable|image|mimes:jpg,jpeg,png|max:5120',
        ]);

        /* ================= SIMPAN FOTO ================= */
        $fotoPath = null;

        if ($request->hasFile('foto')) {

            $file = $request->file('foto');

            $filename = time() . '_' . $file->getClientOriginalName();

            $destinationPath = public_path('storage/lapor-bencana');

            if (!file_exists($destinationPath)) {
                mkdir($destinationPath, 0755, true);
            }

            $file->move($destinationPath, $filename);

            $fotoPath = 'lapor-bencana/' . $filename;
        }


        /* ================= SIMPAN LAPORAN ================= */
        $laporan = LaporBencana::create([
            'user_id' => $sender->user_id,
            'unit_kerja_id' => $request->unit_kerja_id,
            'unit_kerja_nama' => $request->unit_kerja_nama,
            'mbe_id' => $request->mbe_id,
            'lokasi' => $request->lokasi,
            'terdampak' => $request->terdampak,
            'ada_kerusakan' => $request->ada_kerusakan,
            'foto' => $fotoPath,
        ]);

        /* ================= NOTIFIKASI ================= */

        $receivers = NotificationHelper::getReceivers($sender) ?? [];

        foreach ($receivers as $receiverId) {

            try {

                // 1️⃣ Simpan notifikasi ke database
                Notification::create([
                    'sender_id' => $sender->user_id,
                    'receiver_id' => $receiverId,
                    'type' => 'bencana',
                    'reference_id' => $laporan->id,
                    'title' => $request->unit_kerja_nama,
                    'message' => optional($laporan->bencana)->mbe_nama ?? 'Laporan Bencana',
                ]);

                // 2️⃣ Ambil user penerima
                $receiver = User::where('user_id', $receiverId)
                    ->whereNotNull('fcm_token')
                    ->first();

                if ($receiver && $receiver->fcm_token) {
                    FcmService::send(
                        $receiver->fcm_token,
                        '🚨 Laporan Bencana Baru',
                        $request->unit_kerja_nama,
                        [
                            'type' => 'bencana',
                            'lapor_id' => (string) $laporan->id,
                            'sender_id' => (string) $sender->user_id,
                        ]
                    );
                }

            } catch (\Exception $e) {

                Log::error('NOTIFIKASI ERROR', [
                    'receiver_id' => $receiverId,
                    'error' => $e->getMessage(),
                ]);

                // Jangan return apa-apa di sini!
                // Supaya laporan tetap sukses walaupun notif gagal
            }
        }

        /* ================= RESPONSE ================= */
        return response()->json([
            'success' => true,
            'message' => 'Laporan berhasil dikirim',
            'data' => [
                'id' => $laporan->id,
                'foto' => $fotoPath ? asset('storage/' . $fotoPath) : null,
            ],
        ]);
    }
}
