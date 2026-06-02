<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Services\FcmService;

class GempaReminder extends Command
{
    protected $signature = 'gempa:reminder';
    protected $description = 'Kirim reminder hanya untuk gempa terbaru yang belum dilaporkan';

    public function handle()
    {
        \Log::info('⏰ CRON REMINDER DIMULAI');

        // 1. Ambil gempa yang paling baru masuk ke sistem (hanya 1)
        $latestGempa = DB::table('mobile_gempa_events')
            ->orderByDesc('created_at')
            ->first();

        // Jika tidak ada data gempa sama sekali, hentikan proses
        if (!$latestGempa) {
            $this->info('Tidak ada data gempa untuk diproses.');
            return;
        }

        $this->info("Memproses reminder untuk Gempa Ref: {$latestGempa->gempa_ref}");

        // 2. Ambil user yang PENDING hanya untuk gempa terbaru tersebut
        // Syarat: Status pending DAN sudah lewat 5 menit sejak notifikasi terakhir (notified_at)
        $usersToRemind = DB::table('mobile_gempa_user_status')
            ->where('gempa_ref', $latestGempa->gempa_ref)
            ->where('status', 'pending')
            ->where('notified_at', '<=', now()->subMinutes(5)) // Ubah ke 5 menit
            ->get();

        if ($usersToRemind->isEmpty()) {
            $this->info('Semua user sudah lapor atau belum waktunya reminder.');
            return;
        }

        foreach ($usersToRemind as $item) {
            $user = User::where('user_id', $item->user_id)
                ->whereNotNull('fcm_token')
                ->first();

            if (!$user) continue;

            // 3. Kirim FCM Reminder
            FcmService::send(
                $user->fcm_token,
                '⏰ Reminder: Wajib Lapor Gempa',
                'Anda belum melaporkan kondisi unit di area terdampak. Klik di sini untuk mengirim laporan sekarang.',
                [
                    'type' => 'gempa_reminder',
                    'gempa_ref' => $latestGempa->gempa_ref,
                ]
            );

            // 4. Update 'notified_at' agar tidak kena spam di cycle cron berikutnya
            // Cycle berikutnya baru akan mengirim lagi 5 menit kemudian jika tetap pending
            DB::table('mobile_gempa_user_status')
                ->where('user_id', $item->user_id)
                ->where('gempa_ref', $latestGempa->gempa_ref)
                ->update([
                    'notified_at' => now(),
                    'updated_at' => now(),
                ]);
        }

        $this->info('✅ Reminder gempa terbaru selesai dikirim.');
    }
}