<?php

namespace App\Services\Chatbot;

use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;

class DataFetchService
{
    // 1. Query Gempa (Filter dinamis + Fallback)
    public function getGempa($params)
    {
        $query = DB::table('mobile_gempa_events'); 
        
        if (empty($params['hari']) && empty($params['magnitudo']) && empty($params['lokasi'])) {
            return json_encode([
                'status' => 'general',
                'message' => 'Menampilkan data gempa terbaru saat ini:',
                'data' => $query->latest('tanggal')->take(5)->get()
            ]);
        }

        if (!empty($params['hari'])) {
            $targetHari = is_array($params['hari']) ? $params['hari'][0] : $params['hari'];
            $timestamp = strtotime($targetHari);

            if ($timestamp) {
                $d = date('d', $timestamp);
                $m = date('m', $timestamp);
                $M = date('M', $timestamp);
                $y = date('y', $timestamp);
                $Y = date('Y', $timestamp);

                $M_indo = str_replace(
                    ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                    ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
                    $M
                );

                $query->where(function($q) use ($d, $m, $M, $y, $Y, $M_indo, $timestamp) {
                    $q->whereDate('tanggal', date('Y-m-d', $timestamp))
                      ->orWhere('tanggal', 'like', "%{$d}%{$M}%{$Y}%")
                      ->orWhere('tanggal', 'like', "%{$d}%{$M}%{$y}%")
                      ->orWhere('tanggal', 'like', "%{$d}%{$m}%{$Y}%")
                      ->orWhere('tanggal', 'like', "%{$d}%{$m}%{$y}%")
                      ->orWhere('tanggal', 'like', "%{$d}%{$M_indo}%{$Y}%");
                });
            } else {
                $query->where('tanggal', 'like', '%' . $targetHari . '%');
            }
        }
        
        if (!empty($params['magnitudo'])) {
            $query->where('magnitude', '>=', $params['magnitudo']);
        }
        if (!empty($params['lokasi'])) {
            $query->where('wilayah', 'like', '%' . $params['lokasi'] . '%');
        }
        
        $result = $query->latest('tanggal')->take(5)->get();

        if ($result->isEmpty()) {
            $fallback = DB::table('mobile_gempa_events')
                ->latest('tanggal')
                ->take(3)
                ->get();

            return json_encode([
                'status' => 'not_found',
                'message' => 'Tidak ditemukan gempa spesifik sesuai tanggal/kriteria yang diminta. Namun, berikut adalah data gempa TERBARU sebagai referensi:',
                'data' => $fallback
            ]);
        }

        return json_encode([
            'status' => 'success',
            'data' => $result
        ]);
    }

    // 2. Query Cabang Terdampak (Dengan Radius Dinamis)
    public function getDampakCabang($params)
    {
        $query = DB::table('mobile_gempa_events');
        
        if (!empty($params['hari'])) {
            $targetHari = is_array($params['hari']) ? $params['hari'][0] : $params['hari'];
            $timestamp = strtotime($targetHari);

            if ($timestamp) {
                $d = date('d', $timestamp);
                $m = date('m', $timestamp);
                $M = date('M', $timestamp);
                $y = date('y', $timestamp);
                $Y = date('Y', $timestamp);

                $M_indo = str_replace(
                    ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                    ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
                    $M
                );

                $query->where(function($q) use ($d, $m, $M, $y, $Y, $M_indo, $timestamp) {
                    $q->whereDate('tanggal', date('Y-m-d', $timestamp))
                      ->orWhere('tanggal', 'like', "%{$d}%{$M}%{$Y}%")
                      ->orWhere('tanggal', 'like', "%{$d}%{$M}%{$y}%")
                      ->orWhere('tanggal', 'like', "%{$d}%{$m}%{$Y}%")
                      ->orWhere('tanggal', 'like', "%{$d}%{$m}%{$y}%")
                      ->orWhere('tanggal', 'like', "%{$d}%{$M_indo}%{$Y}%");
                });
            } else {
                $query->where('tanggal', 'like', '%' . $targetHari . '%');
            }
        }
        
        $gempa = $query->latest('tanggal')->first();
        $isFallback = false;
            
        if (!$gempa) {
            $gempa = DB::table('mobile_gempa_events')->latest('tanggal')->first();
            $isFallback = true;
            
            if (!$gempa) {
                return "Database gempa saat ini benar-benar kosong.";
            }
        }

        if (empty($gempa->coordinates)) {
            return "Gempa ditemukan di {$gempa->wilayah}, tetapi tidak ada data koordinat lat/lng untuk dihitung.";
        }

        $rules = DB::table('view_gempa')->get();
        $mag = (float) $gempa->magnitude; 
        $radiusKm = 50; 

        if ($rules->isNotEmpty()) {
            if ($mag >= 4 && $mag <= 4.9) {
                $match = $rules->first(function($r) { return str_contains($r->vig_keterangan, '4'); });
                $radiusKm = $match ? $match->vig_radius : 50;
            } elseif ($mag >= 5 && $mag <= 5.9) {
                $match = $rules->first(function($r) { return str_contains($r->vig_keterangan, '5'); });
                $radiusKm = $match ? $match->vig_radius : 100;
            } elseif ($mag >= 6 && $mag <= 6.9) {
                $match = $rules->first(function($r) { return str_contains($r->vig_keterangan, '6'); });
                $radiusKm = $match ? $match->vig_radius : 150;
            } elseif ($mag >= 7) {
                $match = $rules->first(function($r) { return str_contains($r->vig_keterangan, '>'); });
                $radiusKm = $match ? $match->vig_radius : 200;
            }
        }

        $coords = explode(',', $gempa->coordinates);
        if (count($coords) < 2) {
            return "Format koordinat gempa tidak valid di database.";
        }
        
        $latGempa = (float) trim($coords[0]);
        $lngGempa = (float) trim($coords[1]);

        $cabang = DB::select("
            SELECT mjs_nama AS nama_cabang, 
            ( 6371 * acos( cos( radians(?) ) * cos( radians( mjs_lat ) ) * cos( radians( mjs_long ) - radians(?) ) + sin( radians(?) ) * sin( radians( mjs_lat ) ) ) ) AS distance 
            FROM m_jaringan_selindo 
            HAVING distance < ? 
            ORDER BY distance LIMIT 10
        ", [$latGempa, $lngGempa, $latGempa, $radiusKm]);

        $prefix = $isFallback 
            ? "TIDAK DITEMUKAN gempa pada tanggal yang diminta. Menampilkan analisis untuk GEMPA TERBARU di {$gempa->wilayah} ({$gempa->magnitude} SR):\n" 
            : "Pusat gempa di {$gempa->wilayah} ({$gempa->magnitude} SR).\n";

        $infoRadius = "Radius Analisis: {$radiusKm} km\n";

        if (empty($cabang)) {
            return $prefix . $infoRadius . "\nJaringan Selindo AMAN, tidak ada cabang BSI dalam radius {$radiusKm} km.";
        }

        $result = $prefix . $infoRadius . "\nBerikut cabang BSI yang berpotensi terdampak dalam radius {$radiusKm} km:\n";
        foreach ($cabang as $c) {
            $jarak = round($c->distance, 2); 
            $result .= "- {$c->nama_cabang} (Jarak: {$jarak} km)\n";
        }
        
        return $result;
    }
    
    // 3. Query Cari User
    public function cariUser($nama)
    {
        $query = User::leftJoin('m_jabatan', 'user.user_jabatan', '=', 'm_jabatan.jab_id')
            ->leftJoin('m_jaringan_selindo', 'user.user_selindo', '=', 'm_jaringan_selindo.mjs_id');

        $keywords = explode(' ', trim($nama));
        
        foreach ($keywords as $keyword) {
            if (strlen($keyword) > 2) { 
                $query->where('user.user_nama', 'LIKE', '%' . $keyword . '%');
            }
        }

        return $query->select(
                'user.user_nama', 
                'user.user_uname', 
                'm_jabatan.jab_nama', 
                'm_jaringan_selindo.mjs_nama'
            )
            ->take(3)
            ->get()
            ->toJson();
    }

    // 4. Query Data Analyst COB 
    public function getCobData($params)
    {
        $query = DB::table('cob_data');
        $targetDate = $params['hari'] ?? null;
        
        $hariBanding = $params['hari_banding'] ?? null;
        $isCompare = $params['is_compare'] ?? false;
        
        $hariMulai = $params['hari_mulai'] ?? null;
        $hariAkhir = $params['hari_akhir'] ?? null;
        
        $operasi = $params['operasi_cob'] ?? 'spesifik';
        $target = $params['target_cob'] ?? 'transaksi';
        
        if ($isCompare && $targetDate && $hariBanding) {
            $data = DB::table('cob_data')
                ->whereIn('cod_tgl', [$targetDate, $hariBanding])
                ->orderBy('cod_tgl', 'asc')
                ->get();

            if ($data->isEmpty()) {
                return json_encode([
                    'status' => 'not_found', 
                    'message' => "Data untuk tanggal perbandingan tidak ditemukan."
                ]);
            }

            return json_encode([
                'status' => 'success', 
                'data' => $data 
            ]);
        }

        if ($operasi === 'prediksi') {
            $data = DB::table('cob_data')
                        ->orderByDesc('cod_tgl')
                        ->take(30)
                        ->get()
                        ->reverse();
            
            if ($data->isEmpty()) return "Data tidak cukup untuk melakukan prediksi.";

            $jmlHariPrediksi = isset($params['jumlah_hari_prediksi']) ? (int) $params['jumlah_hari_prediksi'] : 7;
            $waktuDiminta = $params['hari'] ?? 'besok'; 
            
            if ($waktuDiminta === 'besok' || $waktuDiminta === date('Y-m-d')) {
                $targetPrediksi = "ESOK HARI (" . date('d F Y', strtotime('+1 day')) . ")";
            } else {
                $targetPrediksi = "RENTANG WAKTU: " . strtoupper($waktuDiminta);
            }
            
            $kalenderInfo = "\n[REFERENSI KALENDER (SANGAT PENTING)]\nAI WAJIB menggunakan referensi ini agar tidak salah menyebutkan nama hari untuk prediksi ke depan:\n";
            $hariIndo = ['Sunday' => 'Minggu', 'Monday' => 'Senin', 'Tuesday' => 'Selasa', 'Wednesday' => 'Rabu', 'Thursday' => 'Kamis', 'Friday' => 'Jumat', 'Saturday' => 'Sabtu'];
            
            for ($i = 0; $i < $jmlHariPrediksi; $i++) {
                $timestamp = strtotime("+".($i + 1)." days");
                $tgl = date('d F Y', $timestamp);
                $hariEn = date('l', $timestamp);
                $hariId = $hariIndo[$hariEn];
                $kalenderInfo .= "- Tanggal $tgl adalah HARI $hariId.\n";
            }

            $historicalData = "TUGAS AI: Lakukan Analisis Prediktif operasional COB untuk {$targetPrediksi}.\n";
            $historicalData .= $kalenderInfo;
            $historicalData .= "CATATAN PENTING UNTUK PREDIKSI MULTI-HARI: Jika user meminta prediksi lebih dari 1 hari (misal 1 minggu/7 hari ke depan), kamu WAJIB memberikan:\n";
            $historicalData .= "1. Estimasi rata-rata durasi harian selama rentang waktu tersebut.\n";
            $historicalData .= "2. Prediksi volume transaksi rata-rata.\n";
            $historicalData .= "3. Titik Rawan: Sebutkan hari apa (misal Senin/Jumat/Awal Bulan) yang paling berisiko mengalami lonjakan atau bottleneck berdasarkan pola dari data historis di bawah ini.\n\n";
            $historicalData .= "Berikut adalah rekam jejak data COB selama 30 HARI TERAKHIR sebagai acuan analisismu:\n\n";
            
            foreach ($data as $row) {
                $hariEnHist = date('l', strtotime($row->cod_tgl));
                $hariIdHist = $hariIndo[$hariEnHist] ?? '';
                $historicalData .= "[{$row->cod_tgl} - Hari {$hariIdHist}] Durasi: {$row->cod_durasi} | Trx: {$row->cod_trx} | Ket: {$row->cod_ket}\n";
            }
            return $historicalData;
        }

        if ($targetDate && empty($hariMulai)) {
            if (is_array($targetDate)) {
                $data = DB::table('cob_data')
                            ->whereIn('cod_tgl', $targetDate)
                            ->orderBy('cod_tgl', 'asc')
                            ->get();

                if ($data->isEmpty()) {
                    return json_encode([
                        'status' => 'not_found', 
                        'message' => "Data operasional untuk tanggal-tanggal yang diminta tidak tersedia di sistem."
                    ]);
                }

                foreach ($data as $item) {
                    $rawKet = $item->cod_ket ?? '';
                    $cleanKet = strip_tags(str_ireplace(['<br>', '<br />', '<br/>', '</p>'], "\n", $rawKet));
                    $item->cod_ket = empty(trim($cleanKet)) ? 'Normal (Tidak ada kendala)' : trim(html_entity_decode($cleanKet));
                }

                return json_encode([
                    'status' => 'success', 
                    'data' => $data
                ]);
            } 
            else {
                $data = DB::table('cob_data')->where('cod_tgl', $targetDate)->first();

                if (!$data) {
                    $lastSuccess = DB::table('cob_data')
                        ->where('cod_tgl', '<', $targetDate)
                        ->orderByDesc('cod_tgl')
                        ->first();

                    if ($lastSuccess) {
                        $rawKet = $lastSuccess->cod_ket ?? '';
                        $cleanKet = strip_tags(str_ireplace(['<br>', '<br />', '<br/>', '</p>'], "\n", $rawKet));
                        $lastSuccess->cod_ket = empty(trim($cleanKet)) ? 'Normal (Tidak ada kendala)' : trim(html_entity_decode($cleanKet));

                        return json_encode([
                            'status' => 'fallback',
                            'requested_date' => $targetDate,
                            'fallback_date' => $lastSuccess->cod_tgl,
                            'data' => $lastSuccess
                        ]);
                    }

                    return json_encode([
                        'status' => 'not_found', 
                        'message' => "Data operasional untuk tanggal {$targetDate} tidak tersedia di sistem."
                    ]);
                }

                $rawKet = $data->cod_ket ?? '';
                $cleanKet = strip_tags(str_ireplace(['<br>', '<br />', '<br/>', '</p>'], "\n", $rawKet));
                $data->cod_ket = empty(trim($cleanKet)) ? 'Normal (Tidak ada kendala)' : trim(html_entity_decode($cleanKet));

                return json_encode([
                    'status' => 'success', 
                    'data' => $data
                ]);
            }
        }

        if ($hariMulai && $hariAkhir) {
            $query->whereBetween('cod_tgl', [$hariMulai, $hariAkhir]);
            $waktuLabel = "rentang tanggal " . $hariMulai . " s.d " . $hariAkhir;
        } elseif (!empty($params['bulan'])) {
            $query->where('cod_tgl', 'like', $params['bulan'] . '-%');
            $waktuLabel = "bulan " . $params['bulan'];
        } elseif (!empty($params['tahun'])) {
            $query->where('cod_tgl', 'like', $params['tahun'] . '-%');
            $waktuLabel = "tahun " . $params['tahun'];
        } else {
            $waktuLabel = "keseluruhan waktu yang tercatat";
        }

        if ($operasi === 'spesifik') {
            if ($hariMulai && $hariAkhir) {
                $data = $query->orderBy('cod_tgl', 'asc')->take(31)->get();
            } else {
                $data = $query->latest('cod_tgl')->take(5)->get();
            }

            if ($data->isEmpty()) return "Tidak ada data COB untuk " . $waktuLabel . ".";

            $ringkasanData = 
                "TUGAS AI:
                
                WAJIB membuat Executive Summary profesional dalam 2-3 paragraf.
                
                JANGAN hanya menampilkan ulang data mentah.
                
                WAJIB menganalisa:
                - tren durasi operasional
                - tren transaksi
                - stabilitas sistem
                - kendala operasional
                - anomaly transaksi
                - potensi bottleneck
                - insight performa COB
                
                Jika ditemukan:
                - transaksi 0
                - locking
                - delay
                - retry
                - downtime
                - kendala stage
                - junk character
                - keterlambatan proses
                
                maka WAJIB dijelaskan dampak operasionalnya.
                
                Gunakan gaya bahasa executive monitoring / operational analyst.
                
                Hindari format list mentah.
                
                Data Operasional:
                
                ";
            foreach ($data as $row) {
                $ringkasanData .= "Tanggal: {$row->cod_tgl}\nDurasi: {$row->cod_durasi}\nTransaksi: {$row->cod_trx}\nCatatan: {$row->cod_ket}\n\n";
            }
            return $ringkasanData;
        }
        
        // ========================================================
        // BLOK PENCARIAN KENDALA (DIPINDAH KE SINI AGAR TIDAK DI-SKIP)
        // ========================================================
        if ($operasi === 'cari_kendala') {
               $keyword = $params['kata_kunci_kendala'] ?? '';
               
               if (empty($keyword)) {
                   return "Maaf, kata kunci kendala yang dicari tidak spesifik. Mohon sebutkan kendala apa yang ingin dicari (contoh: error database).";
               }

               $data = $query->where('cod_ket', 'like', '%' . $keyword . '%')
                             ->orderByDesc('cod_tgl')
                             ->take(5) 
                             ->get();

               if ($data->isEmpty()) {
                   return "Hasil Pencarian: Sistem AMAN. Tidak ditemukan catatan operasional yang mengandung kendala '{$keyword}' pada {$waktuLabel}.";
               }

               $ringkasanData = "TUGAS AI: Buat laporan eksekutif bahwa ditemukan data operasional dengan catatan kendala '{$keyword}' pada {$waktuLabel}. Rangkum detail berikut tanpa memakai format pipa ( | ):\n\n";
               foreach ($data as $row) {
                   $cleanKet = strip_tags(str_ireplace(['<br>', '<br />', '</p>'], " ", $row->cod_ket ?? ''));
                   $ringkasanData .= "Tanggal: {$row->cod_tgl} | Durasi: {$row->cod_durasi} | Trx: {$row->cod_trx} | Detail Kendala: {$cleanKet}\n";
               }
               return $ringkasanData;
        }

        if ($target === 'transaksi') {
            if ($operasi === 'tertinggi') {
                $data = $query->orderByDesc('cod_trx')->first();
                return $data ? "Transaksi TERTINGGI pada {$waktuLabel} adalah " . number_format($data->cod_trx, 0, ',', '.') . " trx (Terjadi pada {$data->cod_tgl})." : "Data kosong.";
            } elseif ($operasi === 'terendah' || $operasi === 'tercepat') {
                $data = $query->orderBy('cod_trx', 'asc')->first();
                return $data ? "Transaksi TERENDAH pada {$waktuLabel} adalah " . number_format($data->cod_trx, 0, ',', '.') . " trx (Terjadi pada {$data->cod_tgl})." : "Data kosong.";
            } elseif ($operasi === 'rata_rata') {
                $avg = $query->avg('cod_trx');
                return $avg ? "RATA-RATA transaksi pada {$waktuLabel} adalah " . number_format(round($avg), 0, ',', '.') . " trx per hari." : "Data kosong.";
            }
        } elseif ($target === 'durasi') {
            if ($operasi === 'tertinggi') {
                $data = $query->orderByDesc('cod_durasi')->first();
                return $data ? "Durasi TERLAMA (tertinggi) pada {$waktuLabel} adalah {$data->cod_durasi} (Terjadi pada {$data->cod_tgl})." : "Data kosong.";
            } elseif ($operasi === 'terendah' || $operasi === 'tercepat') {
                $data = $query->orderBy('cod_durasi', 'asc')->first();
                return $data ? "Durasi TERCEPAT pada {$waktuLabel} adalah {$data->cod_durasi} (Terjadi pada {$data->cod_tgl})." : "Data kosong.";
            } elseif ($operasi === 'rata_rata') {
                $avgData = $query->selectRaw("SEC_TO_TIME(AVG(TIME_TO_SEC(CONCAT(cod_durasi, ':00')))) as avg_durasi")->first();
                return ($avgData && $avgData->avg_durasi) ? "RATA-RATA durasi pada {$waktuLabel} adalah " . $avgData->avg_durasi . "." : "Data kosong.";
            }
        } 

        return "Format analisa tidak dikenali untuk tabel COB.";
    }

    // =========================================================================
    // MAIN ROUTER: GRAFIK COB
    // =========================================================================
    public function getCobChartData($params)
    {
        $cacheKey = 'cob_chart_' . md5(json_encode($params));
    
        return \Illuminate\Support\Facades\Cache::remember($cacheKey, 43200, function () use ($params) {
            
            $operasi = isset($params['operasi_cob']) ? strtolower(trim((string)$params['operasi_cob'])) : null;
            $isCompare = $params['is_compare'] ?? false;
            $jenisChart = isset($params['jenis_chart']) ? strtolower(trim((string)$params['jenis_chart'])) : 'umum';
            
            $hari1 = $params['hari'] ?? null;
            $hari2 = $params['hari_banding'] ?? null;

            if ($isCompare && $hari1 && $hari2 && $jenisChart === 'stage') {
                $params['is_compare'] = false;
                $params['hari'] = [$hari1, $hari2];
                $params['hari_banding'] = null;
                return $this->generateStandardChart($params);
            }

            if ($operasi === 'bom') return $this->generateBomChart($params);
            if ($operasi === 'eom') return $this->generateEomChart($params);
            if ($operasi === 'bom_vs_eom') return $this->generateBomVsEomChart($params);
            if ($isCompare) return $this->generateCompareChart($params);
            if ($operasi === 'prediksi') return $this->generatePredictionChart($params);
            
            return $this->generateStandardChart($params);
        });
    }
    
    // =========================================================================
    // MAIN ROUTER: GRAFIK INSIDEN
    // =========================================================================
    public function getIncidentChartData($params)
    {
        $chartType = $params['jenis_chart'] ?? 'recurring';
    
        if ($chartType === 'recurring') {
            return $this->generateRecurringIncidentChart($params);
        }
    
        return [
            'type' => 'text',
            'message' => 'Jenis chart insiden tidak dikenali.'
        ];
    }

    // =========================================================================
    // PRIVATE METHODS: HELPER & CHART GENERATORS
    // =========================================================================

    private function timeToMinutes($timeStr)
    {
        if (!$timeStr) return 0;
        if (is_numeric($timeStr)) return (int)$timeStr;
        if (str_contains($timeStr, ':')) {
            $parts = explode(':', $timeStr);
            if (count($parts) === 2) return ((int)$parts[0] * 60) + (int)$parts[1];
            if (count($parts) === 3) return ((int)$parts[0] * 60) + (int)$parts[1] + round($parts[2] / 60);
        }
        return 0;
    }

    private function generateBomChart($params)
    {
        $jenisChart = isset($params['jenis_chart']) ? strtolower(trim((string)$params['jenis_chart'])) : 'umum';
        $bulan1 = $params['bulan'] ?? null;
        $bulan2 = $params['bulan_banding'] ?? null;
        $tahun = $params['tahun'] ?? null;
        $jmlDikirim = $params['jumlah_bulan_bom'] ?? $params['jumlah_bulan'] ?? null;
        
        $monthsToQuery = [];

        if (is_array($bulan1)) {
            $monthsToQuery = $bulan1;
        } elseif (is_string($bulan1) && is_string($bulan2)) {
            $monthsToQuery = [$bulan1, $bulan2];
        } elseif (is_string($bulan1)) {
            $monthsToQuery = [$bulan1];
        } elseif ($jmlDikirim) {
            $jmlBulan = (int) preg_replace('/[^0-9]/', '', (string)$jmlDikirim);
            if ($jmlBulan < 1) $jmlBulan = 3;
            $startMonth = date('Y-m'); 
            for ($i = $jmlBulan - 1; $i >= 0; $i--) {
                $monthsToQuery[] = date('Y-m', strtotime("-$i months", strtotime($startMonth . '-01')));
            }
        } elseif ($tahun) {
            for ($m = 1; $m <= 12; $m++) {
                $monthsToQuery[] = $tahun . '-' . str_pad($m, 2, '0', STR_PAD_LEFT);
            }
        } else {
            $startMonth = date('Y-m'); 
            for ($i = 2; $i >= 0; $i--) {
                $monthsToQuery[] = date('Y-m', strtotime("-$i months", strtotime($startMonth . '-01')));
            }
        }

        $labels = []; $durasi = []; $trx = [];

        foreach ($monthsToQuery as $month) {
            $firstDay = \Illuminate\Support\Facades\DB::table('cob_data')
                ->where('cod_tgl', 'like', $month . '-%')
                ->orderBy('cod_tgl', 'asc') 
                ->first();
                
            if ($firstDay) {
                $labels[] = date('d M Y', strtotime($firstDay->cod_tgl)); 
                $durasi[] = $this->timeToMinutes($firstDay->cod_durasi ?? '00:00');
                $trx[] = (float)$firstDay->cod_trx;
            }
        }

        if (empty($labels)) {
            return ["type" => "text", "message" => "Mohon maaf, data operasional awal bulan (BOM) untuk periode tersebut belum tersedia di sistem."];
        }

        if ($jenisChart === 'teks') {
            $pesanTeks = "Berikut adalah rangkuman data operasional Beginning of Month (BOM):\n\n";
            for ($i = 0; $i < count($labels); $i++) {
                $pesanTeks .= "- *" . $labels[$i] . "*\n";
                $pesanTeks .= "   - Total Transaksi: *" . number_format($trx[$i], 0, ',', '.') . "*\n";
                $pesanTeks .= "   - Durasi Proses: *" . $durasi[$i] . " Menit*\n\n";
            }
            return [ "type" => "text", "message" => trim($pesanTeks) ];
        }

        return [
            "type" => "chart",
            "message" => "Berikut adalah grafik tren operasional Beginning of Month (BOM):",
            "data" => [
                "title" => "Tren Awal Bulan (BOM)",
                "labels" => array_map(function($lbl) { return substr($lbl, 0, 6); }, $labels), 
                "datasets" => [
                    ["name" => "Durasi (Menit)", "type" => "line", "data" => $durasi],
                    ["name" => "Transaksi", "type" => "bar", "data" => $trx]
                ]
            ]
        ];
    }

    private function generateEomChart($params)
    {
        $jenisChart = isset($params['jenis_chart']) ? strtolower(trim((string)$params['jenis_chart'])) : 'umum';
        $bulan1 = $params['bulan'] ?? null;
        $bulan2 = $params['bulan_banding'] ?? null;
        $tahun = $params['tahun'] ?? null;
        $jmlDikirim = $params['jumlah_bulan_eom'] ?? $params['jumlah_bulan_bom'] ?? $params['jumlah_bulan'] ?? null; 
        
        $monthsToQuery = [];

        if (is_array($bulan1)) {
            $monthsToQuery = $bulan1;
        } elseif (is_string($bulan1) && is_string($bulan2)) {
            $monthsToQuery = [$bulan1, $bulan2];
        } elseif (is_string($bulan1)) {
            $monthsToQuery = [$bulan1];
        } elseif ($jmlDikirim) {
            $jmlBulan = (int) preg_replace('/[^0-9]/', '', (string)$jmlDikirim);
            if ($jmlBulan < 1) $jmlBulan = 3;
            $startMonth = date('Y-m', strtotime('-1 month')); 
            for ($i = $jmlBulan - 1; $i >= 0; $i--) {
                $monthsToQuery[] = date('Y-m', strtotime("-$i months", strtotime($startMonth . '-01')));
            }
        } elseif ($tahun) {
            for ($m = 1; $m <= 12; $m++) {
                $monthsToQuery[] = $tahun . '-' . str_pad($m, 2, '0', STR_PAD_LEFT);
            }
        } else {
            $startMonth = date('Y-m', strtotime('-1 month')); 
            for ($i = 2; $i >= 0; $i--) {
                $monthsToQuery[] = date('Y-m', strtotime("-$i months", strtotime($startMonth . '-01')));
            }
        }

        $labels = []; $durasi = []; $trx = [];

        foreach ($monthsToQuery as $month) {
            $lastDay = \Illuminate\Support\Facades\DB::table('cob_data')
                ->where('cod_tgl', 'like', $month . '-%')
                ->orderBy('cod_tgl', 'desc') 
                ->first();
                
            if ($lastDay) {
                $labels[] = date('d M Y', strtotime($lastDay->cod_tgl)); 
                $durasi[] = $this->timeToMinutes($lastDay->cod_durasi ?? '00:00');
                $trx[] = (float)$lastDay->cod_trx;
            }
        }

        if (empty($labels)) {
            return ["type" => "text", "message" => "Mohon maaf, data operasional akhir bulan (EOM) untuk periode tersebut belum tersedia di sistem."];
        }

        if ($jenisChart === 'teks') {
            $pesanTeks = "Berikut adalah rangkuman data operasional End of Month (EOM):\n\n";
            for ($i = 0; $i < count($labels); $i++) {
                $pesanTeks .= "- *" . $labels[$i] . "*\n";
                $pesanTeks .= "   - Total Transaksi: *" . number_format($trx[$i], 0, ',', '.') . "*\n";
                $pesanTeks .= "   - Durasi Proses: *" . $durasi[$i] . " Menit*\n\n";
            }
            return [ "type" => "text", "message" => trim($pesanTeks) ];
        } 

        return [
            "type" => "chart",
            "message" => "Berikut adalah grafik tren operasional End of Month (EOM):",
            "data" => [
                "title" => "Tren Akhir Bulan (EOM)",
                "labels" => array_map(function($lbl) { return substr($lbl, 0, 6); }, $labels), 
                "datasets" => [
                    ["name" => "Durasi (Menit)", "type" => "line", "data" => $durasi],
                    ["name" => "Transaksi", "type" => "bar", "data" => $trx]
                ]
            ]
        ];
    }

    private function generateBomVsEomChart($params)
    {
        $bulan1 = $params['bulan'] ?? null;
        $tahun = $params['tahun'] ?? null;
        $jmlDikirim = $params['jumlah_bulan_bom'] ?? $params['jumlah_bulan_eom'] ?? $params['jumlah_bulan'] ?? null; 
        
        $monthsToQuery = [];

        if (is_array($bulan1)) {
            $monthsToQuery = $bulan1;
        } elseif ($jmlDikirim) {
            $jmlBulan = (int) preg_replace('/[^0-9]/', '', (string)$jmlDikirim);
            if ($jmlBulan < 1) $jmlBulan = 3;
            $startMonth = date('Y-m', strtotime('-1 month')); 
            for ($i = $jmlBulan - 1; $i >= 0; $i--) {
                $monthsToQuery[] = date('Y-m', strtotime("-$i months", strtotime($startMonth . '-01')));
            }
        } elseif ($tahun) {
            for ($m = 1; $m <= 12; $m++) {
                $monthsToQuery[] = $tahun . '-' . str_pad($m, 2, '0', STR_PAD_LEFT);
            }
        } elseif (is_string($bulan1)) {
            $monthsToQuery = [$bulan1];
        } else {
            $jmlBulan = 3;
            $startMonth = date('Y-m', strtotime('-1 month')); 
            for ($i = $jmlBulan - 1; $i >= 0; $i--) {
                $monthsToQuery[] = date('Y-m', strtotime("-$i months", strtotime($startMonth . '-01')));
            }
        }

        $labels = []; $durasi = []; $trx = [];

        foreach ($monthsToQuery as $month) {
            $dataBom = \Illuminate\Support\Facades\DB::table('cob_data')
                ->where('cod_tgl', 'like', $month . '-%')
                ->orderBy('cod_tgl', 'asc') 
                ->first();
            
            $dataEom = \Illuminate\Support\Facades\DB::table('cob_data')
                ->where('cod_tgl', 'like', $month . '-%')
                ->orderBy('cod_tgl', 'desc') 
                ->first();

            $namaBulanPendek = date('M', strtotime($month . '-01')); 

            if ($dataBom) {
                $labels[] = "BOM " . $namaBulanPendek;
                $durasi[] = $this->timeToMinutes($dataBom->cod_durasi ?? '00:00');
                $trx[] = (float)$dataBom->cod_trx;
            }

            if ($dataEom && (!$dataBom || $dataEom->cod_tgl !== $dataBom->cod_tgl)) {
                $labels[] = "EOM " . $namaBulanPendek;
                $durasi[] = $this->timeToMinutes($dataEom->cod_durasi ?? '00:00');
                $trx[] = (float)$dataEom->cod_trx;
            }
        }

        if (empty($labels)) {
            return ["type" => "text", "message" => "Mohon maaf, data operasional untuk Awal dan Akhir bulan tidak ditemukan."];
        }

        $jenisChart = $params['jenis_chart'] ?? 'umum';

        if ($jenisChart === 'teks') {
            $pesanTeks = "Berikut adalah perbandingan operasional BOM vs EOM:\n\n";
            for ($i = 0; $i < count($labels); $i++) {
                $pesanTeks .= "- *" . $labels[$i] . "*\n";
                $pesanTeks .= "   - Total Transaksi: *" . number_format($trx[$i], 0, ',', '.') . "*\n";
                $pesanTeks .= "   - Durasi Proses: *" . $durasi[$i] . " Menit*\n\n";
            }
            return ["type" => "text", "message" => trim($pesanTeks)];
        } 
        
        return [
            "type" => "chart",
            "message" => "Berikut adalah grafik perbandingan Beginning of Month (BOM) vs End of Month (EOM):",
            "data" => [
                "title" => "Tren BOM vs EOM",
                "labels" => $labels,
                "datasets" => [
                    ["name" => "Durasi (Menit)", "type" => "line", "data" => $durasi],
                    ["name" => "Transaksi", "type" => "bar", "data" => $trx]
                ]
            ]
        ];
    }

    private function generateCompareChart($params)
    {
        $bulan1 = $params['bulan'] ?? null;
        $bulan2 = $params['bulan_banding'] ?? null;
        $hari1 = $params['hari'] ?? null;
        $hari2 = $params['hari_banding'] ?? null;

        if ($bulan1 && $bulan2) {
            $data1 = \Illuminate\Support\Facades\DB::table('cob_data')->where('cod_tgl', 'like', $bulan1 . '-%')->orderBy('cod_tgl', 'asc')->get();
            $data2 = \Illuminate\Support\Facades\DB::table('cob_data')->where('cod_tgl', 'like', $bulan2 . '-%')->orderBy('cod_tgl', 'asc')->get();

            $buildChart = function($data, $labelBulan) {
                $labels = []; $durasi = []; $trx = [];
                foreach ($data as $row) {
                    $labels[] = date('d M', strtotime($row->cod_tgl));
                    $durasi[] = $this->timeToMinutes($row->cod_durasi ?? '00:00');
                    $trx[] = (float)$row->cod_trx; 
                }
                return [
                    "title" => "Grafik " . date('F Y', strtotime($labelBulan . '-01')),
                    "labels" => array_values($labels),
                    "datasets" => [
                        ["name" => "Durasi (Menit)", "type" => "line", "data" => array_values($durasi)],
                        ["name" => "Transaksi", "type" => "bar", "data" => array_values($trx)]
                    ]
                ];
            };

            return [
                "type" => "compare_chart", 
                "message" => "Berikut adalah perbandingan grafik operasional untuk " . date('F Y', strtotime($bulan1 . '-01')) . " vs " . date('F Y', strtotime($bulan2 . '-01')) . ":",
                "data" => [
                    $buildChart($data1, $bulan1),
                    $buildChart($data2, $bulan2)
                ]
            ];
        }

        if ($hari1 && $hari2) {
            $data1 = \Illuminate\Support\Facades\DB::table('cob_data')->where('cod_tgl', $hari1)->first();
            $data2 = \Illuminate\Support\Facades\DB::table('cob_data')->where('cod_tgl', $hari2)->first();

            $labels = []; $durasi = []; $trx = [];

            if ($data1) {
                $labels[] = date('d M', strtotime($data1->cod_tgl));
                $durasi[] = $this->timeToMinutes($data1->cod_durasi ?? '00:00');
                $trx[] = (float)$data1->cod_trx;
            }
            if ($data2) {
                $labels[] = date('d M', strtotime($data2->cod_tgl));
                $durasi[] = $this->timeToMinutes($data2->cod_durasi ?? '00:00');
                $trx[] = (float)$data2->cod_trx;
            }

            if (empty($labels)) {
                return [
                    "type" => "text",
                    "message" => "Data tidak ditemukan untuk kedua tanggal tersebut di sistem kami."
                ];
            }

            return [
                "type" => "chart", 
                "message" => "Berikut adalah grafik perbandingan operasional antara tanggal " . date('d M Y', strtotime($hari1)) . " dan " . date('d M Y', strtotime($hari2)) . ":",
                "data" => [
                    "title" => "Perbandingan Tanggal Spesifik",
                    "labels" => $labels,
                    "datasets" => [
                        ["name" => "Durasi (Menit)", "type" => "line", "data" => $durasi],
                        ["name" => "Transaksi", "type" => "bar", "data" => $trx]
                    ]
                ]
            ];
        }

        return ["type" => "text", "message" => "Parameter perbandingan tidak valid."];
    }

    private function generatePredictionChart($params)
    {
        $limitRealisasi = 7;
        $dataRealisasi = \Illuminate\Support\Facades\DB::table('cob_data')
            ->orderByDesc('cod_tgl')
            ->take($limitRealisasi)
            ->get()
            ->reverse();

        $data30 = \Illuminate\Support\Facades\DB::table('cob_data')
            ->orderByDesc('cod_tgl')
            ->take(30)
            ->get();

        if ($dataRealisasi->isEmpty()) {
            return [
                "type" => "text",
                "message" => "Data historis tidak cukup untuk membentuk grafik Realisasi dan Forecasting."
            ];
        }

        $labels = []; $durasi = []; $trx = [];

        foreach ($dataRealisasi as $row) {
            $labels[] = date('d M', strtotime($row->cod_tgl)); 
            $durasi[] = $this->timeToMinutes($row->cod_durasi ?? '00:00');
            $trx[] = (float)$row->cod_trx; 
        }

        $sumTrx = 0; $sumDurasi = 0; $count = 0;
        foreach ($data30 as $row) {
            $sumTrx += (float)$row->cod_trx;
            $sumDurasi += $this->timeToMinutes($row->cod_durasi ?? '00:00');
            $count++;
        }
        
        $avgTrx = $count > 0 ? ($sumTrx / $count) : 0;
        $avgDurasi = $count > 0 ? ($sumDurasi / $count) : 0;

        $jmlHariPrediksi = isset($params['jumlah_hari_prediksi']) ? (int) $params['jumlah_hari_prediksi'] : 7;
        if ($jmlHariPrediksi < 1) $jmlHariPrediksi = 7; 

        $lastDate = $dataRealisasi->last()->cod_tgl;

        for ($i = 1; $i <= $jmlHariPrediksi; $i++) {
            $futureDate = date('Y-m-d', strtotime($lastDate . " +$i days"));
            
            $labels[] = date('d M', strtotime($futureDate)) . "\n(Est)"; 
            $prediksiTrx = $avgTrx * (1 + (rand(-3, 3) / 100));
            $prediksiDurasi = $avgDurasi * (1 + (rand(-2, 2) / 100));

            $trx[] = round($prediksiTrx);
            $durasi[] = round($prediksiDurasi);
        }

        return [
            "type" => "chart",
            "message" => "Berikut adalah grafik gabungan Realisasi (Historis) dan Forecasting (Prediksi) untuk {$jmlHariPrediksi} hari ke depan:",
            "data" => [
                "title" => "Realisasi & Forecasting",
                "labels" => $labels,
                "datasets" => [
                    ["name" => "Forecast Duration", "type" => "line", "data" => $durasi],
                    ["name" => "Forecast Transaction", "type" => "bar", "data" => $trx]
                ]
            ]
        ];
    }

    private function generateStandardChart($params)
    {
        $query = \Illuminate\Support\Facades\DB::table('cob_data');
        $limit = 7; 
        $labelWaktu = "7 hari operasional terakhir";
        
        if (!empty($params['hari_mulai']) && !empty($params['hari_akhir'])) {
            $query->whereBetween('cod_tgl', [$params['hari_mulai'], $params['hari_akhir']]);
            $limit = 31; 
            $labelWaktu = "rentang " . date('d M Y', strtotime($params['hari_mulai'])) . " s.d " . date('d M Y', strtotime($params['hari_akhir']));
        } elseif (!empty($params['hari'])) {
            if (is_array($params['hari'])) {
                $query->whereIn('cod_tgl', $params['hari']);
                $limit = count($params['hari']);
                $labelWaktu = "tanggal pilihan Anda";
            } else {
                $query->where('cod_tgl', $params['hari']);
                $limit = 1;
                $labelWaktu = "tanggal " . date('d M Y', strtotime($params['hari']));
            }
        } elseif (!empty($params['bulan'])) {
            $query->where('cod_tgl', 'like', $params['bulan'] . '-%');
            $limit = 31; 
            $labelWaktu = "bulan " . $params['bulan'];
        } elseif (!empty($params['tahun'])) {
            $query->where('cod_tgl', 'like', $params['tahun'] . '-%');
            $limit = 30; 
            $labelWaktu = "tahun " . $params['tahun'];
        }

        $data = $query->orderByDesc('cod_tgl')->take($limit)->get()->reverse();

        if ($data->isEmpty()) {
            return ["type" => "text", "message" => "Data tidak ditemukan untuk periode waktu tersebut."];
        }

        $labels = [];
        $visualType = ($data->count() == 1) ? "bar" : "line";
        $jenisChart = isset($params['jenis_chart']) ? strtolower(trim((string)$params['jenis_chart'])) : 'umum';

        if ($jenisChart === 'stage') {
            $app = []; $sys = []; $rep = []; $sod = []; $onl = [];
            foreach ($data as $row) {
                $labels[] = date('d M', strtotime($row->cod_tgl));
                $app[] = $this->timeToMinutes($row->cod_durasi_app ?? '00:00'); 
                $sys[] = $this->timeToMinutes($row->cod_sistemwide_app ?? '00:00');
                $rep[] = $this->timeToMinutes($row->cod_reporting_app ?? '00:00');
                $sod[] = $this->timeToMinutes($row->cod_sod_app ?? '00:00');
                $onl[] = $this->timeToMinutes($row->cod_online_app ?? '00:00');
            }
            return [
                "type" => "chart",
                "message" => "Berikut adalah grafik durasi per-stage operasional untuk {$labelWaktu}:",
                "data" => [
                    "labels" => array_values($labels),
                    "datasets" => [
                        ["name" => "Application", "type" => $visualType, "data" => array_values($app)],
                        ["name" => "System Wide", "type" => $visualType, "data" => array_values($sys)],
                        ["name" => "Reporting",   "type" => $visualType, "data" => array_values($rep)],
                        ["name" => "Start of Day","type" => $visualType, "data" => array_values($sod)],
                        ["name" => "Online",      "type" => $visualType, "data" => array_values($onl)],
                    ]
                ]
            ];
        }

        $durasi = []; $trx = [];
        foreach ($data as $row) {
            $labels[] = date('d M', strtotime($row->cod_tgl));
            $durasi[] = $this->timeToMinutes($row->cod_durasi ?? '00:00');
            $trx[] = (float)$row->cod_trx; 
        }

        return [
            "type" => "chart",
            "message" => "Berikut adalah grafik trend performa operasional untuk {$labelWaktu}:",
            "data" => [
                "labels" => array_values($labels),
                "datasets" => [
                    ["name" => "Durasi (Menit)", "type" => $visualType,  "data" => array_values($durasi)],
                    ["name" => "Transaksi", "type" => "bar", "data" => array_values($trx)]
                ]
            ]
        ];
    }
    
    
    public function getCuaca($params)
    {
       $lokasiAsli = $params['lokasi'] ?? 'Jakarta'; 
       
       // Cek tanggal: Apakah hari ini, masa lalu, atau masa depan?
       $hariIni = date('Y-m-d');
       $targetHari = is_array($params['hari']) ? $params['hari'][0] : ($params['hari'] ?? $hariIni);
       
       $isHariIni = ($targetHari === $hariIni);

       // Pembersihan string nama kota untuk parameter pencarian
       $lokasiQuery = strtolower(trim($lokasiAsli));
       $lokasiQuery = str_replace(['kota ', 'kabupaten ', 'kab ', 'kecamatan ', 'kec '], '', $lokasiQuery);

       // =========================================================================
       // LOGIKA CACHING: 
       // Jika hari ini = Cache 30 Menit (1800 detik) agar tetap update
       // Jika masa lalu/depan = Cache 12 Jam (43200 detik) karena data jarang berubah
       // =========================================================================
       $cacheTtl = $isHariIni ? 1800 : 43200;
       $cacheKey = 'cuaca_bcm_' . md5($lokasiQuery . '_' . $targetHari);

       return \Illuminate\Support\Facades\Cache::remember($cacheKey, $cacheTtl, function () use ($lokasiAsli, $lokasiQuery, $targetHari, $isHariIni, $hariIni) {
           
           $weatherApiKey = env('OPENWEATHER_API_KEY'); 
           $supabaseUrl = env('SUPABASE_URL');
           $supabaseKey = env('SUPABASE_ANON_KEY');

           if (!$weatherApiKey || !$supabaseUrl) {
               return json_encode([
                   'status' => 'error',
                   'message' => 'API Key Cuaca atau Supabase belum dikonfigurasi di server.'
               ]);
           }

           try {
               // LANGKAH 1: CARI KOORDINAT DI SUPABASE VIA REST API
               $endpointSupabase = "{$supabaseUrl}/rest/v1/districts"; 
               
               $resSupabase = \Illuminate\Support\Facades\Http::withHeaders([
                   'apikey' => $supabaseKey,
                   'Authorization' => "Bearer {$supabaseKey}"
               ])->get($endpointSupabase, [
                   'or' => "(city.ilike.%{$lokasiQuery}%,district.ilike.%{$lokasiQuery}%)",
                   'select' => 'latitude,longitude,city,district',
                   'limit' => 1
               ]);

               // Default ke Monas, Jakarta jika lokasi tidak ada di DB
               $lat = -6.1751; 
               $lon = 106.8272; 
               $namaKotaPasti = ucwords($lokasiAsli);
               $lokasiDitemukanDb = false;

               if ($resSupabase->successful() && count($resSupabase->json()) > 0) {
                   $daerah = $resSupabase->json()[0];
                   $lat = $daerah['latitude']; 
                   $lon = $daerah['longitude'];
                   
                   $dist = ucwords($daerah['district'] ?? '');
                   $city = ucwords($daerah['city'] ?? '');
                   
                   $namaKotaPasti = (!empty($dist) && !empty($city) && $dist !== $city) 
                       ? "{$dist}, {$city}" 
                       : ($city ?: $dist);
                   
                   $lokasiDitemukanDb = true;
               }

               // LANGKAH 2: EKSEKUSI API BERDASARKAN WAKTU (HYBRID)
               if ($isHariIni) {
                   // A. OPENWEATHERMAP (Sangat Akurat untuk Real-time)
                   if ($lokasiDitemukanDb) {
                       $response = \Illuminate\Support\Facades\Http::timeout(10)->get("https://api.openweathermap.org/data/2.5/weather", [
                           'lat' => $lat, 'lon' => $lon, 'appid' => $weatherApiKey, 'units' => 'metric', 'lang' => 'id'
                       ]);
                   } else {
                       $response = \Illuminate\Support\Facades\Http::timeout(10)->get("https://api.openweathermap.org/data/2.5/weather", [
                           'q' => $lokasiQuery . ', ID', 'appid' => $weatherApiKey, 'units' => 'metric', 'lang' => 'id'
                       ]);
                   }

                   if ($response->successful()) {
                       $current = $response->json();
                       
                       $suhu = floor($current['main']['temp']);
                       $kelembaban = $current['main']['humidity'];
                       $anginKmph = floor(($current['wind']['speed'] ?? 0) * 3.6);
                       $kondisi = ucfirst($current['weather'][0]['description'] ?? 'Tidak diketahui');
                       $weatherId = $current['weather'][0]['id'] ?? 0;
                       $namaKotaAkhir = $lokasiDitemukanDb ? $namaKotaPasti : ($current['name'] ?? $namaKotaPasti);

                       // Logika Warning BCM24 (OpenWeather)
                       $warningType = 'safe'; $warningTitle = 'Aman Terkendali'; $warningDesc = 'Kondisi cuaca normal.';
                       if ($anginKmph >= 50) { $warningType = 'alert'; $warningTitle = 'Angin Kencang'; $warningDesc = 'Angin sangat kuat.'; } 
                       elseif ($weatherId >= 200 && $weatherId < 300) { $warningType = 'alert'; $warningTitle = 'Badai Petir'; $warningDesc = 'Potensi badai dan petir.'; } 
                       elseif (in_array($weatherId, [502, 503, 504])) { $warningType = 'alert'; $warningTitle = 'Hujan Lebat'; $warningDesc = 'Curah hujan tinggi.'; } 
                       elseif ($weatherId >= 500 && $weatherId < 502) { $warningType = 'warning'; $warningTitle = 'Hujan Sedang'; $warningDesc = 'Hujan intensitas sedang.'; } 
                       elseif (in_array($weatherId, [701, 741])) { $warningType = 'warning'; $warningTitle = 'Kabut Tebal'; $warningDesc = 'Jarak pandang berkurang.'; }

                       return json_encode([
                           'status' => 'success',
                           'sumber_data' => 'Satelit Real-Time (OpenWeather)',
                           'lokasi' => $namaKotaAkhir,
                           'tanggal_data' => $targetHari,
                           'suhu' => "{$suhu}°C",
                           'kondisi' => $kondisi,
                           'detail_angin' => "{$anginKmph} km/h",
                           'kelembaban' => "{$kelembaban}%",
                           'peringatan_dini' => ['level' => strtoupper($warningType), 'judul' => $warningTitle, 'deskripsi' => $warningDesc]
                       ]);
                   }

               } else {
                   // B. OPEN-METEO (Arsip & Prediksi)
                   $response = \Illuminate\Support\Facades\Http::timeout(10)->get("https://api.open-meteo.com/v1/forecast", [
                       'latitude' => $lat,
                       'longitude' => $lon,
                       'daily' => 'weathercode,temperature_2m_max,windspeed_10m_max',
                       'timezone' => 'Asia/Jakarta',
                       'start_date' => $targetHari,
                       'end_date' => $targetHari
                   ]);

                   if ($response->successful()) {
                       $data = $response->json();
                       
                       if (empty($data['daily']['time'])) {
                           return json_encode(['status' => 'not_found', 'message' => "Data historis/prediksi untuk tanggal {$targetHari} tidak ditemukan."]);
                       }

                       $suhuMaks = $data['daily']['temperature_2m_max'][0] ?? 0;
                       $anginKmph = floor($data['daily']['windspeed_10m_max'][0] ?? 0);
                       $wmoCode = $data['daily']['weathercode'][0] ?? 0;

                       $kondisi = 'Cerah Berawan'; $warningType = 'safe'; $warningTitle = 'Aman Terkendali'; $warningDesc = 'Kondisi cuaca normal.';
                       
                       if (in_array($wmoCode, [45, 48])) { $kondisi = 'Kabut'; $warningType = 'warning'; $warningTitle = 'Jarak Pandang Terbatas'; } 
                       elseif (in_array($wmoCode, [51, 53, 55, 56, 57])) { $kondisi = 'Gerimis'; } 
                       elseif (in_array($wmoCode, [61, 63, 65, 66, 67])) { $kondisi = 'Hujan'; $warningType = 'warning'; $warningTitle = 'Hujan Sedang'; $warningDesc = 'Hujan intensitas sedang.'; } 
                       elseif (in_array($wmoCode, [80, 81, 82])) { $kondisi = 'Hujan Lebat'; $warningType = 'alert'; $warningTitle = 'Hujan Deras'; $warningDesc = 'Curah hujan tinggi.'; } 
                       elseif (in_array($wmoCode, [95, 96, 99])) { $kondisi = 'Badai Petir'; $warningType = 'alert'; $warningTitle = 'Cuaca Ekstrem'; $warningDesc = 'Potensi badai dan petir.'; }

                       if ($anginKmph >= 50) { $warningType = 'alert'; $warningTitle = 'Angin Kencang'; $warningDesc = 'Angin sangat kuat.'; }

                       return json_encode([
                           'status' => 'success',
                           'sumber_data' => $targetHari < $hariIni ? 'Arsip Satelit (Open-Meteo)' : 'Prediksi Satelit (Open-Meteo)',
                           'lokasi' => $namaKotaPasti,
                           'tanggal_data' => $targetHari,
                           'suhu' => "{$suhuMaks}°C (Maks)",
                           'kondisi' => $kondisi,
                           'detail_angin' => "{$anginKmph} km/h",
                           'kelembaban' => "Data kelembaban tidak diukur untuk arsip/prediksi harian",
                           'peringatan_dini' => ['level' => strtoupper($warningType), 'judul' => $warningTitle, 'deskripsi' => $warningDesc]
                       ]);
                   }
               }

               return json_encode([
                   'status' => 'not_found',
                   'message' => "Maaf, data cuaca untuk wilayah '{$lokasiAsli}' saat ini tidak dapat diakses dari satelit."
               ]);

           } catch (\Exception $e) {
               \Illuminate\Support\Facades\Log::error('API Cuaca Error (Laravel): ' . $e->getMessage());
               return json_encode([
                   'status' => 'error',
                   'message' => 'Terjadi gangguan jaringan internal saat memproses data wilayah.'
               ]);
           }
       });
   }
   
    public function getInsidenIT($params = [])
    {
        $query = DB::table('insiden_itdata');
    
        // FILTER TAHUN
        if (!empty($params['tahun'])) {
            $query->where('iid_tahun', $params['tahun']);
        }
        
        // FILTER HARI SPESIFIK
        if (!empty($params['hari'])) {
        
            $query->where('iid_tgl_mulai_kejadian', $params['hari']);
        }
        
        // FILTER RENTANG TANGGAL
        if (!empty($params['hari_mulai']) && !empty($params['hari_akhir'])) {
        
            $query->whereBetween('iid_tgl_mulai_kejadian', [
                $params['hari_mulai'],
                $params['hari_akhir']
            ]);
        }
        
        // FILTER BULAN
        if (!empty($params['bulan'])) {
        
            $query->where('iid_tgl_mulai_kejadian', 'like', $params['bulan'] . '%');
        }
    
        // FILTER KATEGORI
        if (!empty($params['kategori'])) {
        
            $query->where(function ($q) use ($params) {
        
                $q->where(
                    'iid_cat',
                    'LIKE',
                    '%' . $params['kategori'] . '%'
                )
        
                ->orWhere(
                    'iid_impact',
                    'LIKE',
                    '%' . $params['kategori'] . '%'
                )
        
                ->orWhere(
                    'iid_insiden',
                    'LIKE',
                    '%' . $params['kategori'] . '%'
                );
            });
        }
    
        // FILTER STATUS
        if (isset($params['status'])) {
            $query->where('iid_status', $params['status']);
        }
    
        // AMBIL DATA TERBARU
        $data = $query
            ->orderByDesc('iid_id')
            ->limit(10)
            ->get();
    
        // JIKA TIDAK ADA DATA
       if ($data->isEmpty()) {

            if (!empty($params['hari'])) {
                return "NOT_FOUND_HARI";
            }
            
             if (!empty($params['hari_mulai']) && !empty($params['hari_akhir'])) { return "NOT_FOUND_RANGE";
            }
                
            if (!empty($params['bulan'])) {
                return "NOT_FOUND_BULAN";
            }
        
            return "NOT_FOUND";
        }
    
        // PADATKAN CONTEXT UNTUK AI
        $result = "";

        foreach ($data as $row) {
        
            $tanggal = \Carbon\Carbon::parse(
                $row->iid_tgl_mulai_kejadian
            )->translatedFormat('d F Y');
        
            $impact =
                !empty($row->iid_impact)
                    ? $row->iid_impact
                    : 'Tidak diketahui';
        
            $kategori =
                !empty($row->iid_cat)
                    ? $row->iid_cat
                    : 'Umum';
        
            $durasi =
                !empty($row->iid_durasi_insiden)
                    ? $row->iid_durasi_insiden
                    : '00:00';
        
            $pic =
                !empty($row->iid_pic_group)
                    ? $row->iid_pic_group
                    : 'Belum diketahui';
        
            $rca =
                !empty(trim($row->iid_rca))
                    ? trim($row->iid_rca)
                    : 'RCA belum tersedia';
        
            $result .=
                "[{$tanggal}]\n" .
                "{$row->iid_insiden} menyebabkan gangguan pada {$impact} " .
                "dengan durasi {$durasi}. " .
                "Kategori insiden: {$kategori}. " .
                "Penanganan dilakukan oleh {$pic}. " .
                "RCA: {$rca}.\n\n";
        }
    
        return $result;
    }
    
    public function getTotalDowntimeInsiden($params = [])
    {
        $query = DB::table('insiden_itdata');
    
        // FILTER KATEGORI
        if (!empty($params['kategori'])) {
    
            $query->where(function ($q) use ($params) {
    
                $q->where('iid_impact', 'LIKE', '%' . $params['kategori'] . '%')
                  ->orWhere('iid_insiden', 'LIKE', '%' . $params['kategori'] . '%');
            });
        }
        
        // FILTER HARI
        if (!empty($params['hari'])) {
        
            $query->where('iid_tgl_mulai_kejadian', $params['hari']);
        }
        
        // FILTER BULAN
        if (!empty($params['bulan'])) {
        
            $query->where(
                'iid_tgl_mulai_kejadian',
                'like',
                $params['bulan'] . '%'
            );
        }
    
        $data = $query->get();
    
        if ($data->isEmpty()) {
            return null;
        }
    
        $totalMenit = 0;
    
        foreach ($data as $row) {
    
            $durasi = $row->iid_durasi_insiden;
    
            if (str_contains($durasi, ':')) {
    
                [$jam, $menit] = explode(':', $durasi);
    
                $totalMenit += ((int)$jam * 60) + (int)$menit;
            }
        }
    
        return [
            'total_menit' => $totalMenit,
            'jumlah_insiden' => $data->count()
        ];
    }
    
    public function getTopRecurringIncident($params = [])
    {
        $query = DB::table('insiden_itdata');
    
        // FILTER BULAN
        if (!empty($params['bulan'])) {
    
            $query->where(
                'iid_tgl_mulai_kejadian',
                'like',
                $params['bulan'] . '%'
            );
        }
    
        // FILTER TAHUN
        if (!empty($params['tahun'])) {
    
            $query->where('iid_tahun', $params['tahun']);
        }
    
        $data = $query->get();
    
        if ($data->isEmpty()) {
            return null;
        }
    
        $counter = [];
    
        foreach ($data as $row) {
    
            // SPLIT MULTI IMPACT
            $impacts = explode(',', $row->iid_impact);
    
            foreach ($impacts as $impact) {
    
                $impact = trim($impact);
    
                if ($impact === '') {
                    continue;
                }
    
                if (!isset($counter[$impact])) {
                    $counter[$impact] = 0;
                }
    
                $counter[$impact]++;
            }
        }
    
        arsort($counter);
    
        return array_slice($counter, 0, 5, true);
    }
    
    public function getInsidenTerlama($params = [])
    {
        $query = DB::table('insiden_itdata');
    
        // FILTER BULAN
        if (!empty($params['bulan'])) {
    
            $query->where(
                'iid_tgl_mulai_kejadian',
                'like',
                $params['bulan'] . '%'
            );
        }
    
        // FILTER TAHUN
        if (!empty($params['tahun'])) {
    
            $query->where('iid_tahun', $params['tahun']);
        }
    
        $data = $query->get();
    
        if ($data->isEmpty()) {
            return null;
        }
    
        $maxMenit = 0;
        $topIncident = null;
    
        foreach ($data as $row) {
    
            $durasi = $row->iid_durasi_insiden;
    
            if (!str_contains($durasi, ':')) {
                continue;
            }
    
            [$jam, $menit] = explode(':', $durasi);
    
            $totalMenit = ((int)$jam * 60) + (int)$menit;
    
            if ($totalMenit > $maxMenit) {
    
                $maxMenit = $totalMenit;
                $topIncident = $row;
            }
        }
    
        if (!$topIncident) {
            return null;
        }
    
        return [
            'tanggal' => $topIncident->iid_tgl_mulai_kejadian,
            'insiden' => $topIncident->iid_insiden,
            'impact' => $topIncident->iid_impact,
            'durasi_menit' => $maxMenit
        ];
    }
    
    public function getRcaAnalysis($params = [])
    {
        $query = DB::table('insiden_itdata');
    
        // FILTER KATEGORI
        if (!empty($params['kategori'])) {
    
            $query->where(function ($q) use ($params) {
    
                $q->where(
                    'iid_impact',
                    'LIKE',
                    '%' . $params['kategori'] . '%'
                )
                ->orWhere(
                    'iid_insiden',
                    'LIKE',
                    '%' . $params['kategori'] . '%'
                );
            });
        }
    
        // FILTER BULAN
        if (!empty($params['bulan'])) {
    
            $query->where(
                'iid_tgl_mulai_kejadian',
                'like',
                $params['bulan'] . '%'
            );
        }
    
        $data = $query
            ->select(
                'iid_tgl_mulai_kejadian',
                'iid_insiden',
                'iid_rca',
                'iid_impact'
            )
            ->latest('iid_tgl_mulai_kejadian')
            ->limit(5)
            ->get();
    
        if ($data->isEmpty()) {
            return null;
        }
    
        return $data;
    }
    
    private function generateRecurringIncidentChart($params)
    {
        $data = $this->getTopRecurringIncident($params);
    
        if (!$data || empty($data)) {
            return [
                'type' => 'text',
                'message' => 'Data recurring incident tidak ditemukan.'
            ];
        }
    
        $labels = [];
        $values = [];
    
        foreach ($data as $impact => $count) {
            $labels[] = $impact;
            $values[] = $count;
        }
    
        return [
            'type' => 'chart',
            'message' => 'Berikut adalah grafik Top Recurring Incident:',
            'data' => [
                'chart_category' => 'incident',
                'chart_mode' => 'top_recurring',
                'title' => 'Top Recurring Incident',
                'labels' => $labels,
                'datasets' => [
                    [
                        'name' => 'Jumlah Incident',
                        'type' => 'bar',
                        'data' => $values
                    ]
                ]
            ]
        ];
    }
    
    public function getDowntimeTrend($params = [])
    {
        $query = DB::table('insiden_itdata');
    
        // FILTER BULAN
        if (!empty($params['bulan'])) {
    
            $query->where(
                'iid_tgl_mulai_kejadian',
                'like',
                $params['bulan'] . '%'
            );
        }
    
        // FILTER TAHUN
        if (!empty($params['tahun'])) {
    
            $query->whereYear(
                'iid_tgl_mulai_kejadian',
                $params['tahun']
            );
        }
    
        $data = $query
            ->select(
                'iid_tgl_mulai_kejadian',
                'iid_durasi_insiden'
            )
            ->get();
    
        $result = [];
    
        foreach ($data as $row) {
    
            $durasi = 0;
    
            if (str_contains($row->iid_durasi_insiden, ':')) {
    
                [$jam, $menit] = explode(
                    ':',
                    $row->iid_durasi_insiden
                );
    
                $durasi = ((int)$jam * 60) + (int)$menit;
            }
    
            $tanggal = $row->iid_tgl_mulai_kejadian;
    
            if (!isset($result[$tanggal])) {
                $result[$tanggal] = 0;
            }
    
            $result[$tanggal] += $durasi;
        }
    
        $final = [];
    
        foreach ($result as $tgl => $total) {
    
            $final[] = [
                'tanggal' => $tgl,
                'total_downtime' => $total
            ];
        }
    
        return $final;
    }
    
    public function getDailyIncident($params = [])
    {
        $query = DB::table('insiden_itdata');
    
        if (!empty($params['bulan'])) {
    
            $query->where(
                'iid_tgl_mulai_kejadian',
                'like',
                $params['bulan'] . '%'
            );
        }
    
        $rows = $query
            ->select(
                'iid_tgl_mulai_kejadian',
                'iid_durasi_insiden'
            )
            ->orderBy('iid_tgl_mulai_kejadian')
            ->get();
    
        $daily = [];
    
        foreach ($rows as $row) {
    
            $tgl = $row->iid_tgl_mulai_kejadian;
    
            if (!isset($daily[$tgl])) {
    
                $daily[$tgl] = [
                    'total_incident' => 0,
                    'total_duration' => 0
                ];
            }
    
            $daily[$tgl]['total_incident']++;
    
            // HH:MM -> MENIT
            if (
                $row->iid_durasi_insiden &&
                str_contains($row->iid_durasi_insiden, ':')
            ) {
    
                [$jam, $menit] = explode(
                    ':',
                    $row->iid_durasi_insiden
                );
    
                $totalMenit =
                    ((int)$jam * 60) +
                    (int)$menit;
    
                $daily[$tgl]['total_duration'] += $totalMenit;
            }
        }
    
        $labels = [];
    
        $incidentData = [];
    
        $durationData = [];
        
        foreach ($daily as $tgl => $item) {
    
            $labels[] = $tgl;
    
            $incidentData[] =
                $item['total_incident'];
    
            $durationData[] =
                $item['total_duration'];
        }
    
        return [
            'type' => 'chart',
    
            'data' => [
    
                'chart_category' => 'incident',
    
                'chart_mode' => 'daily_incident',
    
                'title' => 'Daily Incident Trend',
    
                'labels' => $labels,
    
                'datasets' => [
    
                    [
                        'name' => 'Number of Incidents',
    
                        'type' => 'bar',
    
                        'data' => $incidentData
                    ],
    
                    [
                        'name' => 'Duration',
    
                        'type' => 'line',
    
                        'data' => $durationData
                    ]
                ]
            ]
        ];
    }
    
    public function getMonthlyIncident($params = [])
    {
        \Log::info(
            'MONTHLY PARAMS',
            $params
        );

        
        $query = DB::table('insiden_itdata');
    
        if (!empty($params['tahun'])) {
        
            $query->whereYear(
                'iid_tgl_mulai_kejadian',
                $params['tahun']
            );
        }
    
        $data = $query
            ->select(
                DB::raw("
                    DATE_FORMAT(
                        iid_tgl_mulai_kejadian,
                        '%Y-%m'
                    ) as bulan
                "),
    
                DB::raw('COUNT(*) as total'),
    
                DB::raw("
                    SUM(
                        TIME_TO_SEC(
                            CONCAT(iid_durasi_insiden, ':00')
                        ) / 60
                    ) as total_duration
                ")
            )
            ->groupBy('bulan')
            ->orderBy('bulan')
            ->get();
    
        return [

            'type' => 'chart',
        
            'data' => [
        
                'chart_category' => 'incident',
        
                'chart_mode' => 'monthly_incident',
        
                'title' => 'Monthly Incident Trend',
        
                'labels' => $data->pluck('bulan'),
        
                'datasets' => [
        
                    [
                        'name' => 'Number of Incidents',
        
                        'type' => 'bar',
        
                        'data' => $data->pluck('total')
                    ],
        
                    [
                        'name' => 'Duration',
        
                        'type' => 'line',
        
                        'data' => $data->pluck('total_duration')
                    ]
                ]
            ]
        ];
    }
    
}