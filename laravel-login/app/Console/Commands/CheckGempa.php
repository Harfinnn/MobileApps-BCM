<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use App\Services\FcmService;
use Illuminate\Support\Facades\Log; // Tambahkan Log

class CheckGempa extends Command
{
    protected $signature = 'gempa:check';
    protected $description = 'Check gempa BMKG dan kirim notif';

    public function handle()
    {
        // 1️⃣ TAMBAHAN: Minta server agar tidak melimit waktu eksekusi (meskipun di shared hosting kadang diabaikan, tapi sangat membantu)
        set_time_limit(0); 
        ini_set('memory_limit', '512M'); 

        $this->info('CRON 1 MENIT JALAN ✅');
        $this->checkGempa();
    }
    
    private function checkGempa()
    {
        Log::info('GEMPA CHECK JALAN');
        $this->info('COMMAND JALAN'); 

        // 1. AMBIL DATA BMKG DULU 
        $res = Http::timeout(10)->get('https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json'); // Tambahkan timeout 10 detik agar tidak hang
        if (!$res->ok()) {
            $this->error('Gagal ambil data BMKG');
            return;
        }

        $data = $res->json();
        $gempa = $data['Infogempa']['gempa'];
        
        $uniqueId = $gempa['Tanggal'] . '-' . $gempa['Jam'];
        
        // 2. CEK KE DATABASE
        $exists = \DB::table('mobile_gempa_events')
            ->where('gempa_ref', $uniqueId)
            ->exists();

        if ($exists) {
            $this->info('Gempa sudah pernah diproses, skip notif');
            return;
        }
        
        if ((float) $gempa['Magnitude'] < 4.0) {
            $this->info('Magnitude kecil, skip');
            return;
        }

        // 3. AMBIL KOORDINAT GEMPA
        $coords = explode(',', $gempa['Coordinates']);
        $gempaLat = (float) $coords[0];
        $gempaLng = (float) $coords[1];

        // 4. INSERT DATA GEMPA DULUAN
        // Pindahkan insert ke atas sebelum select user, agar kalau di tengah jalan script mati, gempa tidak diulang-ulang.
        \DB::table('mobile_gempa_events')->insert([
            'gempa_ref' => $uniqueId,
            'tanggal' => $gempa['Tanggal'],
            'jam' => $gempa['Jam'],
            'magnitude' => $gempa['Magnitude'],
            'wilayah' => $gempa['Wilayah'],
            'kedalaman' => $gempa['Kedalaman'],
            'coordinates' => $gempa['Coordinates'],
            'created_at' => now()
        ]);

        // 5. AMBIL USER
        $users = \DB::table('user')
            ->join('m_jaringan_selindo', 'user.user_selindo', '=', 'm_jaringan_selindo.mjs_id')
            ->whereNotNull('user.fcm_token')
            ->where('user.user_jabatan', '!=', 1)
            ->select(
                'user.user_id',
                'user.user_jabatan',
                'user.fcm_token',
                'm_jaringan_selindo.mjs_lat',
                'm_jaringan_selindo.mjs_long'
            )
            ->get();
            
            
            // 🚀 KIRIM KE SUPERADMIN (TOPIC)
            FcmService::sendToTopic(
                'gempa_superadmin',
                "🚨 GEMPA {$gempa['Magnitude']} SR",
                "{$gempa['Wilayah']} {$gempa['Tanggal']} {$gempa['Jam']}",
                [
                    'type' => 'gempa',
                    'wilayah' => $gempa['Wilayah'],
                    'magnitude' => $gempa['Magnitude'],
                    'tanggal' => $gempa['Tanggal'],
                    'jam' => $gempa['Jam'],
                    'kedalaman' => $gempa['Kedalaman'],
                    'coordinates' => $gempa['Coordinates'] ?? '',
                    'dirasakan' => $gempa['Dirasakan'] ?? '',
                    'potensi' => $gempa['Potensi'] ?? '',
                    'shakemap' => $gempa['Shakemap'] ?? '',
                    'user_jabatan' => '1',
                    
                ]
            );

        // 6. LOOP + FILTER
        foreach ($users as $user) {
            try {
                // USER BIASA
                if (!$user->mjs_lat || !$user->mjs_long) continue;

                $distance = $this->haversine(
                    $gempaLat,
                    $gempaLng,
                    (float) $user->mjs_lat,
                    (float) $user->mjs_long
                );

                $radius = $this->getRadius($gempa['Magnitude']);

                if ($distance <= $radius){
                    $distanceText = number_format($distance, 1);
                    
                    Log::info("✅ USER MASUK RADIUS GEMPA", [
                        'user_id'     => $user->user_id,
                        'jarak_km'    => $distanceText,
                    ]);

                    FcmService::send(
                        $user->fcm_token,
                        "🚨 GEMPA {$gempa['Magnitude']} SR ({$distanceText} km dari Anda)",
                        "{$gempa['Wilayah']}  {$gempa['Tanggal']} {$gempa['Jam']}",
                        [
                            'type' => 'gempa',
                            'wilayah' => $gempa['Wilayah'],
                            'magnitude' => $gempa['Magnitude'],
                            'tanggal' => $gempa['Tanggal'],
                            'jam' => $gempa['Jam'],
                            'kedalaman' => $gempa['Kedalaman'],
                            'coordinates' => $gempa['Coordinates'] ?? '',
                            'dirasakan' => $gempa['Dirasakan'] ?? '',
                            'potensi' => $gempa['Potensi'] ?? '',
                            'shakemap' => $gempa['Shakemap'] ?? '',
                            'distance' => (string) $distanceText,
                            'user_jabatan' => (string) $user->user_jabatan,
                        ],
                        $user->user_id
                    );
                    
                    \DB::table('mobile_gempa_user_status')->updateOrInsert(
                        [
                            'user_id' => $user->user_id,
                            'gempa_ref' => $uniqueId
                        ],
                        [
                            'status' => 'pending',
                            'notified_at' => now(),
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]
                    );
                }

            } catch (\Exception $e) {
                // 2️⃣ TAMBAHAN: Kalau 1 user gagal kirim FCM, jangan hentikan proses untuk user lain!
                Log::error("Gagal kirim FCM Gempa ke User ID {$user->user_id}: " . $e->getMessage());
                continue; 
            }
        }

        $this->info('Notif gempa dikirim!');
    }
    
    private function getRadius($magnitude)
    {
        if ($magnitude >= 6) return 150;
        if ($magnitude >= 5) return 100;
        if ($magnitude >= 4) return 50;
        return 0;
    }

    private function haversine($lat1, $lon1, $lat2, $lon2)
    {
        $R = 6371;
        $dLat = deg2rad($lat2 - $lat1);
        $dLon = deg2rad($lon2 - $lon1);
        $a = sin($dLat / 2) * sin($dLat / 2) +
            cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
            sin($dLon / 2) * sin($dLon / 2);
        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));
        return $R * $c;
    }
}