<?php

namespace App\Services\Chatbot;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use App\Models\Chat;
use App\Helpers\ChatHelper;
use App\Services\AIProvider\AIProviderInterface;
use App\Services\Incident\IncidentChartService;
use App\Services\Incident\IncidentService;

class ChatbotService
{
    protected $intentService;
    protected $dataService;
    protected $incidentChartService;
    protected $incidentService;
    protected $aiProvider;

    public function __construct(
        IntentService $intentService, 
        DataFetchService $dataService,
        IncidentChartService $incidentChartService,
        AIProviderInterface $aiProvider,
        IncidentService $incidentService
        )
    {
        $this->intentService = $intentService;
        $this->dataService = $dataService;
        $this->incidentChartService = $incidentChartService;
        $this->aiProvider = $aiProvider;
        $this->incidentService = $incidentService;
    }

    public function isLimitReached($userId, $limit = 100)
    {
        $todayCount = Chat::where('user_id', $userId)->whereDate('created_at', now())->count();
        return $todayCount >= $limit;
    }

    public function getHistory($userId, $limit = 20)
    {
        return Chat::where('user_id', $userId)
            ->latest()
            ->take($limit)
            ->get()
            ->reverse()
            ->values();
    }

    public function clearHistory($userId)
    {
        return Chat::where('user_id', $userId)->delete();
    }

    public function processMessage($user, $message)
    {
        
        $messageLower = strtolower(trim($message));

        if (ChatHelper::isEmpty($message)) {

            return [
                'reply' => 'Silakan masukkan pertanyaan.',
            ];
        }
        
        if (ChatHelper::isGreeting($message)) {
        
            return [
                'reply' => ChatHelper::greetingReply(),
            ];
        }
        
        if (ChatHelper::isThanks($message)) {
        
            return [
                'reply' => ChatHelper::thanksReply(),
            ];
        }
        
        if (ChatHelper::isConfirmation($message)) {
        
            return [
                'reply' => ChatHelper::confirmationReply(),
            ];
        }
        
        if (ChatHelper::isFarewell($message)) {
        
            return [
                'reply' => ChatHelper::farewellReply(),
            ];
        }
        
        $recentChats = $this->getHistory($user->user_id, 6);

        $historyString = "";
        
        foreach ($recentChats as $chat) {
        
            // Skip kalau intent kosong
            if (!$chat->intent) {
                continue;
            }
        
            $aiReplyLog = $chat->reply;
        
            // Hindari payload chart/json masuk ke context AI
            if (
                str_starts_with(trim($aiReplyLog), '{')
                || strlen($aiReplyLog) > 300
            ) {
        
                $aiReplyLog =
                    "[AI merespons dengan visualisasi data grafik]";
            }
        
            $historyString .=
        
                "Intent: "
                . ($chat->intent ?? 'umum')
        
                . "\nOperation: "
                . ($chat->operation ?? '-')
        
                . "\nUser: "
                . $chat->message
        
                . "\nAI: "
                . $aiReplyLog
        
                . "\n";
        }
        
        Log::info('HISTORY BUILT', [
            'history' => $historyString
        ]);

       $parsed = $this->intentService->detectIntent(
            $message,
            $historyString
        );
        
        // =====================================
        // ANTI HALLUCINATION UNTUK INTENT UMUM
        // =====================================
        
        if (($parsed['intent'] ?? null) === 'umum') {
        
            foreach ($parsed['parameters'] as $key => $value) {
        
                if ($key === 'is_compare') {
        
                    $parsed['parameters'][$key] = false;
        
                } else {
        
                    $parsed['parameters'][$key] = null;
                }
            }
        }
        
        $intent = $parsed['intent'] ?? 'umum';
        $params = $parsed['parameters'] ?? [];
        
        // =====================================
        // DEFAULT CONTEXT
        // =====================================
        
        $contextData =
            "Tidak ada data internal tambahan.";
        
        // =====================================
        // GENERAL CHAT MODE
        // =====================================
        
        if ($intent === 'umum') {
        
            $contextData =
                "Pertanyaan umum user. "
                . "Jawab secara natural, santai, membantu, "
                . "dan jangan selalu mengaitkan dengan BCM24 "
                . "atau keterbatasan data internal.";
        }
        
        try {
            if ($intent === 'gempa') {

                $gempaData =
                    $this->dataService
                        ->getGempa($params);
            
                $impactData =
                    $this->dataService
                        ->getDampakCabang($params);
            
                $contextData =
                    "DATA GEMPA\n"
                    . $gempaData
            
                    . "\n\n"
            
                    . "DATA DAMPAK CABANG\n"
                    . $impactData;
            } elseif ($intent === 'cari_user') {
                $contextData = "Data Karyawan: " . $this->dataService->cariUser($params['nama_user']);
            } elseif ($intent === 'cuaca') {
                $contextData = "Data Cuaca: " . $this->dataService->getCuaca($params);
            } elseif ($intent === 'insiden_it') {
    
               $incidentResult =
                    $this->incidentService
                        ->handle(
                            $params,
                            $message
                        );
                
                if ($incidentResult !== null) {

                    Chat::create([
                
                        'user_id' => $user->user_id,
                
                        'message' => $message,
                
                        'reply' => is_array($incidentResult)
                            ? json_encode($incidentResult)
                            : (string) $incidentResult,
                
                        'intent' => $intent,
                
                        'operation' =>
                            $params['operasi_cob'] ?? null,
                    ]);
                
                    return $incidentResult;
                }
                
                if (($params['operasi_cob'] ?? null) === 'incident_dashboard') {

                    // =====================================
                    // SUMMARY
                    // =====================================
                
                    $summaryData = $this->dataService
                        ->getInsidenIT($params);
                
                    // =====================================
                    // TOP RECURRING
                    // =====================================
                
                    $topRecurring = $this->dataService
                        ->getTopRecurringIncident($params);
                
                    // =====================================
                    // DOWNTIME TREND
                    // =====================================
                
                    $downtimeTrend = $this->dataService
                        ->getDowntimeTrend($params);
                        
                    // =====================================
                    // MONTHLY INCIDENT
                    // =====================================
                        
                    $monthlyIncident = $this->dataService
                        ->getMonthlyIncident($params);
                
                    return [
                        'type' => 'incident_dashboard',
                
                        'summary_context' => $summaryData,
                
                        'charts' => [
                
                            $this->incidentChartService
                                ->buildTopRecurringChart($topRecurring),
                
                            $this->incidentChartService
                                ->buildDowntimeTrendChart($downtimeTrend),
                                
                            $monthlyIncident,  
                        ]
                    ];
                }
                
                $messageLower = strtolower($message);

                $isIncidentChartRequest =
                    !empty($params['jenis_chart']) ||
                    str_contains($messageLower, 'grafik') ||
                    str_contains($messageLower, 'chart') ||
                    str_contains($messageLower, 'trend');
                
                if (($params['operasi_cob'] ?? null) === 'total_downtime') {

                    $downtime = $this->dataService->getTotalDowntimeInsiden($params);
                
                    if (!$downtime) {
                
                        return [
                            'reply' => 'Data downtime tidak ditemukan.'
                        ];
                    }
                
                    $jam = floor($downtime['total_menit'] / 60);
                    $menit = $downtime['total_menit'] % 60;
                
                    return [
                        'reply' =>
                            "Total downtime tercatat {$jam} jam {$menit} menit dari {$downtime['jumlah_insiden']} insiden."
                    ];
                }
                
                if (($params['operasi_cob'] ?? null) === 'top_recurring') {

                    $topRecurring = $this->dataService
                        ->getTopRecurringIncident($params);
                
                    if (!$topRecurring) {
                
                        return [
                            'reply' => 'Data recurring incident tidak ditemukan.'
                        ];
                    }
                
                    // =====================================
                    // CHART MODE
                    // =====================================
                
                    if ($isIncidentChartRequest) {
                
                        $chartResponse = $this->incidentChartService
                            ->buildTopRecurringChart($topRecurring);
                
                        \App\Models\Chat::create([
                            'user_id' => $user->user_id,
                            'message' => $message,
                            'reply'   => json_encode($chartResponse),
                            'intent' => $intent,
                            'operation' => $params['operasi_cob'] ?? null,
                        ]);
                
                        $todayCount = \App\Models\Chat::where(
                            'user_id',
                            $user->user_id
                        )->whereDate('created_at', now())->count();
                
                        $chartResponse['limit'] = 100;
                        $chartResponse['used'] = $todayCount;
                        $chartResponse['remaining'] = max(100 - $todayCount, 0);
                
                        Log::info('INCIDENT CHART RESPONSE', $chartResponse);
                        
                        return $chartResponse;
                    }
                
                    // =====================================
                    // TEXT MODE
                    // =====================================
                
                    $text = "Aplikasi yang paling sering mengalami gangguan:\n\n";
                
                    foreach ($topRecurring as $impact => $total) {
                
                        $text .= "- {$impact}: {$total} insiden\n";
                    }
                
                    return [
                        'reply' => trim($text)
                    ];
                }
                
                if (($params['operasi_cob'] ?? null) === 'insiden_terlama') {

                    $topIncident = $this->dataService->getInsidenTerlama($params);
                
                    if (!$topIncident) {
                
                        return [
                            'reply' => 'Data insiden tidak ditemukan.'
                        ];
                    }
                
                    $jam = floor($topIncident['durasi_menit'] / 60);
                    $menit = $topIncident['durasi_menit'] % 60;
                
                    return [
                        'reply' =>
                            "Insiden dengan durasi terlama terjadi pada "
                            . \Carbon\Carbon::parse($topIncident['tanggal'])
                                ->translatedFormat('d F Y')
                            . " terkait "
                            . $topIncident['insiden']
                            . " dengan total downtime "
                            . "{$jam} jam {$menit} menit."
                    ];
                }
                
                if (($params['operasi_cob'] ?? null) === 'downtime_trend') {

                    $trendData = $this->dataService
                        ->getDowntimeTrend($params);
                
                    if (!$trendData) {
                
                        return [
                            'reply' => 'Data downtime trend tidak ditemukan.'
                        ];
                    }
                
                    return $this->incidentChartService
                        ->buildDowntimeTrendChart($trendData);
                }
                
                // =====================================
                // OPERATIONAL RISK
                // =====================================
                
                if (
                    ($params['operasi_cob'] ?? null)
                    ===
                    'operational_risk'
                ) {
                    
                    Log::info('OPERATIONAL RISK BLOCK MASUK');
                
                    // =====================================
                    // INCIDENT DATA
                    // =====================================
                
                    $incidentData = DB::table('insiden_itdata');
                
                    if (!empty($params['tahun'])) {
                
                        $incidentData->where(
                            'iid_tahun',
                            $params['tahun']
                        );
                    }
                
                    if (!empty($params['bulan'])) {
                
                        $incidentData->where(
                            'iid_tgl_mulai_kejadian',
                            'like',
                            $params['bulan'] . '%'
                        );
                    }
                
                    $incidentData = $incidentData
                        ->get()
                        ->all();
                
                    // =====================================
                    // COB DATA
                    // =====================================
                
                    $cobData = DB::table('cob_data');
                
                    if (!empty($params['tahun'])) {
                
                        $cobData->where(
                            'cod_tgl',
                            'like',
                            $params['tahun'] . '%'
                        );
                    }
                
                    if (!empty($params['bulan'])) {
                
                        $cobData->where(
                            'cod_tgl',
                            'like',
                            $params['bulan'] . '%'
                        );
                    }
                
                    $cobData = $cobData
                        ->get()
                        ->toArray();
                
                    // =====================================
                    // CORRELATION ENGINE
                    // =====================================
                
                    $correlationService = app(
                        \App\Services\Operational\OperationalCorrelationService::class
                    );
                
                    $correlationResult =
                        $correlationService
                            ->correlateIncidentWithCob(
                
                                $incidentData,
                
                                json_decode(
                                    json_encode($cobData),
                                    true
                                )
                            );
                
                    // =====================================
                    // RISK ENGINE
                    // =====================================
                
                    $riskService = app(
                        \App\Services\Operational\OperationalRiskService::class
                    );
                
                    $risk =
                        $riskService
                            ->calculateRisk(
                                $correlationResult
                            );
                
                    Log::info('RISK RESULT', $risk);
                
                    // =====================================
                    // CARD RESPONSE
                    // =====================================
                
                    return [
                
                        'type' => 'operational_risk',
                
                        'data' => [
                
                            'risk_level' =>
                                $risk['risk_level'],
                
                            'risk_score' =>
                                $risk['risk_score'],
                
                            'total_incident' =>
                                $risk['total_incident'],
                
                            'total_downtime' =>
                                $risk['total_downtime'],
                
                            'reasons' =>
                                $risk['reasons'],
                        ]
                    ];
                }
                
                if (($params['operasi_cob'] ?? null) === 'rca_analysis') {

                    $rcaData = $this->dataService->getRcaAnalysis($params);
            
                    if (!$rcaData) {
                
                        return [
                            'reply' => 'Data RCA tidak ditemukan.'
                        ];
                    }
                    
                    $rcaContext = "";
                
                    foreach ($rcaData as $item) {
                
                        $rca = trim($item->iid_rca);
                
                        if ($rca === '') {
                            $rca = 'RCA belum tersedia';
                        }
                
                        $rcaContext .=
                            "Tanggal: {$item->iid_tgl_mulai_kejadian}\n" .
                            "Impact: {$item->iid_impact}\n" .
                            "Insiden: {$item->iid_insiden}\n" .
                            "RCA: {$rca}\n\n";
                    }
                
                    $contextData =
                        "Analisa histori RCA insiden:\n\n"
                    . $rcaContext;
                }    
                
                if (($params['operasi_cob'] ?? null) === 'incident_summary') {

                    $summaryData = $this->dataService
                        ->getInsidenIT($params);
                
                    $contextData =
                        "Analisa Executive Summary Incident:\n\n"
                        . $summaryData;
                }
                
                if (in_array(($params['operasi_cob'] ?? null), [
                
                    'incident_cob_impact',
                    'incident_cob_relationship',
                    'incident_cob_slowdown',
                    'incident_cob_recurring'
                
                ])) {
                
                    $incidentData = $this->dataService
                        ->getInsidenIT($params);
                
                    $cobData = $this->dataService
                        ->getCobData([
                            'operasi_cob' => 'spesifik'
                        ]);
                
                    $contextData =
                        "ANALISA KORELASI INCIDENT DAN COB\n\n"
                
                        . "[DATA INCIDENT]\n"
                        . $incidentData
                
                        . "\n\n[DATA COB]\n"
                        . $cobData
                
                        . "\n\nTUGAS AI:\n";
                
                    // =====================================
                    // DYNAMIC TASK
                    // =====================================
                
                    switch ($params['operasi_cob']) {
                
                        case 'incident_cob_impact':
                
                            $contextData .=
                                "- Analisa dampak incident terhadap performa COB.\n"
                                . "- Jelaskan stage COB yang paling terdampak.\n"
                                . "- Fokus pada downtime dan delay.\n";
                
                            break;
                
                        case 'incident_cob_relationship':
                
                            $contextData .=
                                "- Analisa hubungan antara incident dan perlambatan COB.\n"
                                . "- Cari pola recurring incident.\n"
                                . "- Jelaskan pengaruh ke operasional.\n";
                
                            break;
                
                        case 'incident_cob_slowdown':
                
                            $contextData .=
                                "- Fokus analisa penyebab COB melambat.\n"
                                . "- Jelaskan aplikasi paling berkontribusi terhadap slowdown.\n"
                                . "- Jelaskan bottleneck operasional.\n";
                
                            break;
                
                        case 'incident_cob_recurring':
                
                            $contextData .=
                                "- Identifikasi recurring incident paling berdampak ke COB.\n"
                                . "- Jelaskan recurring issue dominan.\n"
                                . "- Jelaskan impact terhadap closing harian.\n";
                
                            break;
                    }
                }
            
                if (empty($params['operasi_cob'])) {
            
                    // =========================
                    // DEFAULT SUMMARY INSIDEN
                    // =========================
                    $insidenResponse = $this->dataService->getInsidenIT($params);
                
                    if ($insidenResponse === 'NOT_FOUND_HARI') {
                
                        return [
                            'reply' => 'Tidak ditemukan insiden IT pada tanggal tersebut.'
                        ];
                    }
                
                    if ($insidenResponse === 'NOT_FOUND_RANGE') {
                
                        return [
                            'reply' => 'Tidak ditemukan insiden IT pada periode tersebut.'
                        ];
                    }
                
                    if ($insidenResponse === 'NOT_FOUND_BULAN') {
                
                        return [
                            'reply' => 'Tidak ditemukan insiden IT pada periode bulan tersebut.'
                        ];
                    }
                
                    if ($insidenResponse === 'NOT_FOUND') {
                
                        return [
                            'reply' => 'Data insiden IT tidak ditemukan.'
                        ];
                    }
                
                    $contextData = "Data Insiden IT:\n" . $insidenResponse;
                }
            
                
            } elseif ($intent === 'data_cob') {

                $messageLower = strtolower($message);
            
                $jenisChart = $params['jenis_chart'] ?? null;
                
                $aiMenawarkanGrafik = str_contains(strtolower($historyString), 'grafik trend performanya');
                $userSetuju = preg_match('/\b(boleh|ya|iya|mau|tampilkan|oke|ok|butuh)\b/i', $messageLower);

                $isChartRequest =
                    $jenisChart !== null ||
                    ($aiMenawarkanGrafik && $userSetuju) ||
                    str_contains($messageLower, 'chart') ||
                    str_contains($messageLower, 'grafik') ||
                    str_contains($messageLower, 'trend') ||
                    str_contains($messageLower, 'diagram') ||
                    str_contains($messageLower, 'visualisasi');
            
                if ($user->user_jabatan == 1) {
                    
                    $pendingChartResponse = null;
                    
                    // 1. AMBIL DAN BERSIHKAN DATA LEBIH DULU
                    // Agar jika nanti butuh AI (pada kasus stage 1 hari), context-nya sudah bersih
                    $cobResponse = $this->dataService->getCobData($params);
                    $decodedCob = json_decode($cobResponse, true);

                    // ======================================================================
                    // PRE-PROCESSING TAHAP 2: PEMADATAN KONTEKS (ANTI-HALUSINASI & HEMAT TOKEN)
                    // ======================================================================
                    if (is_array($decodedCob)) {
                        // Ambil target array datanya (bisa di dalam key 'data' atau flat array)
                        $dataList = isset($decodedCob['data']) ? $decodedCob['data'] : $decodedCob;
                        
                        // Jika ternyata single object, bungkus jadi array agar bisa di-loop
                        if (!isset($dataList[0]) && isset($dataList['cod_tgl'])) {
                            $dataList = [$dataList];
                        }

                        // Buat Header Format Pipa
                        $compressedContext = "Format Data: Tgl | Durasi | Trx | App | SysWide | Report | SOD | Online | Catatan\n";
                        
                        foreach ($dataList as $item) {
                            if (is_array($item) && isset($item['cod_tgl'])) {
                                $tgl = $item['cod_tgl'];
                                $durasi = $item['cod_durasi'] ?? '00:00';
                                $trx = $item['cod_trx'] ?? '0';
                                $app = $item['cod_durasi_app'] ?? '00:00';
                                $sys = $item['cod_sistemwide_app'] ?? '00:00';
                                $rep = $item['cod_reporting_app'] ?? '00:00';
                                $sod = $item['cod_sod_app'] ?? '00:00';
                                $onl = $item['cod_online_app'] ?? '00:00';
                                
                                // Sanitasi catatan (Hanya kirim inti pesannya atau nyatakan lancar)
                                $rawKet = isset($item['cod_ket']) ? trim(strip_tags((string)$item['cod_ket'])) : '';
                                if ($rawKet === '' || $rawKet === '-' || strtolower($rawKet) === 'normal') {
                                    $ket = 'Lancar';
                                } else {
                                    // Hilangkan enter/newline agar format pipa tidak rusak
                                    $ket = str_replace(["\r", "\n"], " ", $rawKet); 
                                }

                                // Rangkai menjadi satu baris string padat
                                $compressedContext .= "{$tgl} | {$durasi} | {$trx} | {$app} | {$sys} | {$rep} | {$sod} | {$onl} | {$ket}\n";
                            }
                        }

                        // Ganti response array berat dengan string padat kita
                        $cobResponse = $compressedContext;
                    }

                    if (isset($decodedCob['status'])) {
                        $contextData = "Hasil Pencarian COB:\n" . $cobResponse;
                    } else {
                        $contextData = $cobResponse; 
                    }

                    if ($isChartRequest) {
                        $chartResponse = $this->dataService->getCobChartData($params);
                        
                        $isStageChart = (isset($params['jenis_chart']) && $params['jenis_chart'] === 'stage');
                        
                        $jmlHari = isset($chartResponse['data']['labels']) ? count($chartResponse['data']['labels']) : 1;

                        if ($isStageChart && $jmlHari <= 3) {

                        if (is_array($params['hari'] ?? null)) {
                    
                            $summary = "Grafik stage COB berhasil ditampilkan untuk "
                                . count($params['hari'])
                                . " tanggal yang dipilih. "
                                . "Visualisasi menunjukkan perbandingan durasi tiap tahapan "
                                . "Aplikasi, Sistemwide, Reporting, SOD, dan Online.";
                    
                            $pendingChartResponse = $chartResponse;
                            $pendingChartResponse['summary_text'] = $summary;
                    
                        } else {
                    
                            $pendingChartResponse = $chartResponse;
                        }
                    } else {

                            \App\Models\Chat::create([
                                'user_id' => $user->user_id,
                                'message' => $message,
                                'reply'   => json_encode($chartResponse), 
                                'intent' => $intent,
                                'operation' => $params['operasi_cob'] ?? null,
                            ]);
                        
                            $todayCount = \App\Models\Chat::where('user_id', $user->user_id)->whereDate('created_at', now())->count();
                            
                            $chartResponse['limit'] = 100;
                            $chartResponse['used'] = $todayCount;
                            $chartResponse['remaining'] = max(100 - $todayCount, 0);
                        
                            return $chartResponse;
                        }
                    }
            
                } else {
                    $contextData = "Akses ditolak.";
                }
            }
        
        } catch (\Exception $e) {
            Log::error('DB Query Error in Chatbot: ' . $e->getMessage());
        }
        
        Log::info("DEBUG CHATBOT - Intent: {$intent}", [
            'Params' => $params,
            'Context_Sent_To_AI' => $contextData
        ]);
        
        $tanggalHariIniChat = date('d F Y');

        $systemPrompt = "Kamu adalah Akbar-AI, asisten cerdas pusat komando BCM24.
            Waktu sistem: {$tanggalHariIniChat}. Data di [CONTEXT DATA] adalah TEPAT sesuai permintaan user, JANGAN anggap salah/tidak sinkron.
            
            [ATURAN DASAR]
            - Bahasa Indonesia profesional, percaya diri, luwes.
            - DILARANG KERAS pakai emoji/simbol dan format tabel markdown (layar sempit).
            - Data Gempa & Karyawan: WAJIB pakai Bullet Points.
            
            [ATURAN VALIDASI DATA]
            - DILARANG mengarang angka estimasi.
            - DILARANG membuat asumsi numerik tanpa data eksplisit.
            - Jika data tidak tersedia, katakan 'tidak terdapat data numerik pendukung'.
            - Jangan menyebut persentase, penambahan menit, rata-rata throughput, atau estimasi impact jika tidak ada pada CONTEXT DATA.
            - Semua analisa wajib berbasis data internal yang tersedia.
            
            [FORMAT LAPORAN COB (EXECUTIVE SUMMARY)]
            Tugasmu adalah merangkum data mentah [CONTEXT DATA] menjadi 2-3 paragraf laporan eksekutif. Patuhi template dan panduan berikut:
            
            1. PANDUAN FORMAT:
               - Durasi: Ubah format HH:MM ke format jam dan menit, TAPI ANGKA WAJIB DITULIS SEBAGAI ANGKA DIGIT. (Contoh: '03:38' WAJIB ditulis '3 jam 38 menit'. DILARANG KERAS mengeja angka menjadi huruf/kata seperti 'tiga jam' atau 'lima puluh empat'). JANGAN gunakan kata 'pukul' atau 'WIB' pada angka durasi.
               - Angka Transaksi: Gunakan titik sebagai pemisah ribuan (contoh: 5658787 menjadi 5.658.787).
               
               2. TEMPLATE PARAGRAF:
                  - Paragraf 1 (Pembuka): Mulai dengan sapaan 'Assalamualaikum...' (jika ada di data catatan). Sebutkan tanggal laporan, total durasi, dan total transaksi keseluruhan.
                  - Paragraf 2 (Rincian Stage): Jabarkan durasi masing-masing tahapan secara berurutan: Aplikasi, Sistemwide, Reporting, Start of Day (SOD), lalu Online.
                  - Paragraf 3 (Insiden & Rekap): Jika data normal, sebutkan operasional lancar. JIKA ADA RINCIAN PANJANG (seperti daftar bank/payroll), ABAIKAN rincian satu per satu. Cukup sebutkan insiden utamanya (misal: 'Sempat terjadi locking stage... namun berhasil diatasi') dan langsung sebutkan angka Grand Total yang berhasil terealisasi.
                  - Penutup: Berikan satu kalimat kesimpulan singkat.
            3. CATATAN OPERASIONAL: 
               - Jika 'cod_ket' berisi 'Normal', '-', atau kosong: DILARANG KERAS menyebutkan nama kolom 'cod_ket' atau simbol '-'. Cukup buat narasi luwes bahwa operasional berjalan lancar tanpa kendala.
               - Jika berisi rincian panjang: Rangkum intisarinya saja (insiden & Grand Total). CATATAN: Singkatan 'M' berarti 'Miliar', bukan 'Juta'.
               - Jika ada sapaan (cth: Assalamualaikum), WAJIB jadikan itu sebagai bagian dari kalimat laporan. Pisahkan dengan SATU BARIS KOSONG (Enter 2x).
               - DILARANG tambah label buatan.
            4. PENUTUP: Beri satu kalimat kesimpulan proses stabil/selesai.
            
            [ATURAN GRAFIK]
            Jika user minta grafik/chart: DILARANG gambar manual pakai teks/ASCII. Jadilah Data Analyst: beri paragraf summary/insight dari angka [CONTEXT DATA]. Terjemahan durasi tetap berlaku.
            
            [FORMAT LAPORAN INSIDEN IT]
            1. Jika [CONTEXT DATA] berisi Data Insiden IT:
               - JANGAN hanya copy ulang data mentah.
               - WAJIB membuat ringkasan operasional IT yang natural, ringkas, dan langsung ke inti.
               - Gunakan gaya bahasa analyst operasional internal BCM, bukan gaya consultant report.
               - Hindari bahasa terlalu formal, terlalu korporat, atau terlalu generik.
               - Jangan membuat asumsi yang tidak ada pada data.
               - Jangan menggunakan kalimat seperti:
                 * sistem tetap stabil
                 * operasional berjalan baik
                 * ketahanan sistem baik
                 * perlu perhatian khusus
                 * menunjukkan kebutuhan peningkatan
               - Sebutkan pola insiden dominan jika memang terlihat pada data.
               - Sebutkan aplikasi/sistem yang paling sering terdampak.
               - Sebutkan total jumlah insiden.
               - Highlight insiden dengan durasi terlama.
               - Jika RCA kosong, cukup abaikan dan jangan dijadikan pembahasan utama.
               - Gunakan format narasi profesional tanpa markdown tebal (**).
               - DILARANG menampilkan ulang seluruh data satu per satu kecuali user meminta detail lengkap.
               - Jika data sedikit:
                 * jangan memaksa membuat analisa panjang
                 * cukup buat summary singkat dan insight utama
               - Jika pola belum cukup kuat:
                 * jangan mengarang tren jangka panjang
               - Fokus pada:
                 * kategori insiden
                 * impact layanan
                 * durasi gangguan
                 * recurring issue
                 * aplikasi terdampak
                 * insight operasional singkat
            
            2. Jika user meminta detail:
               - Baru tampilkan daftar insiden per tanggal.
               
            [FORMAT ANALISA KORELASI INCIDENT & COB]

            Jika [CONTEXT DATA] berisi type incident_correlation:
            
            - Fokus jawaban HARUS mengikuti maksud pertanyaan user.
            - Jangan selalu memberikan summary generik yang sama.
            - Analisa harus dinamis berdasarkan pertanyaan.
            
            ATURAN ANALISA:
            
            1. Jika user menanyakan:
               - pengaruh
               - dampak
               - impact
               - slowdown
               - perlambatan
            
               Maka fokuskan jawaban pada:
               - dampak operasional terhadap proses COB
               - keterlambatan durasi
               - downtime
               - bottleneck proses
            
            2. Jika user menanyakan:
               - hubungan
               - korelasi
               - relasi
               - keterkaitan
            
               Maka fokuskan jawaban pada:
               - pola recurring incident
               - hubungan antara kenaikan incident dan performa COB
               - pola aplikasi yang paling sering terdampak
            
            3. Jika user menanyakan:
               - aplikasi terdampak
               - recurring
               - gangguan terbanyak
            
               Maka fokus pada:
               - ranking aplikasi
               - frekuensi incident
               - recurring issue
            
            4. Jangan mengulang kalimat generik yang sama setiap pertanyaan.
            
            5. Gunakan data correlation sebagai dasar insight.
            
            6. Jika data periode kecil:
               - jangan memaksa membuat analisa besar.   
               
            [FORMAT ANALISA RCA INSIDEN]
            Jika [CONTEXT DATA] berisi analisa RCA insiden:
            - Jangan hanya mengulang data mentah.
            - Identifikasi pola gangguan yang paling sering muncul.
            - Rangkum akar masalah dominan secara profesional.
            - Sebutkan jika RCA formal belum tersedia.
            - Fokus pada recurring issue dan impact operasional.
            - Gunakan format bullet point singkat dan executive summary.   
            
            [FORMAT LAPORAN MITIGASI BENCANA]
            1. INFO GEMPA & CABANG TERDAMPAK: 
               - WAJIB gunakan Bullet Points. 
               - Jika di [CONTEXT DATA] terdapat informasi 'Radius Analisis', kamu WAJIB menyebutkan angka radius pencarian tersebut untuk validasi data! (Contoh: 'Berdasarkan pemindaian otomatis dalam radius 50 km dari pusat gempa...').
               - Jika tidak ada cabang terdampak, JANGAN gunakan kalimat ragu seperti 'tidak ada catatan'. Tegaskan dengan wibawa: 'Status Jaringan Selindo: AMAN. Tidak ada cabang BSI yang masuk dalam radius terdampak.'
            2. INFO CUACA:
               - Jabarkan status cuaca, suhu, kecepatan angin, dan lokasi dengan jelas.
               - Jika ada peringatan dini (WARNING/ALERT), WAJIB berikan instruksi mitigasi/himbauan kewaspadaan singkat untuk operasional cabang BSI di wilayah tersebut.
            
            [SMART FALLBACK COB]
            1. Jika \"status\": \"fallback\":
               - JANGAN bilang sukses.
               - WAJIB respons: \"Saya tidak menemukan data operasional untuk tanggal [requested_date]. Namun, saya memiliki catatan terakhir pada [fallback_date].\"
               - Berikan laporannya.
               - Akhiri dengan tawaran: \"Apakah Anda ingin saya menampilkan grafik trend performanya?\"
            2. Jika \"status\": \"not_found\": Sampaikan mohon maaf data operasional tanggal tersebut belum tersedia.
            
            [CONTEXT DATA]
            {$contextData}";

        $messages = [
            ['role' => 'system', 'content' => $systemPrompt]
        ];

        $recentChats = $this->getHistory($user->user_id, 6);
        foreach ($recentChats as $chat) {
            $messages[] = ['role' => 'user', 'content' => $chat->message];
            
            // FIX: Cegah Payload JSON Grafik masuk ke LLM Token
            $aiContent = $chat->reply;
            if (str_starts_with(trim($aiContent), '{') || strlen($aiContent) > 500) {
                $aiContent = "Berikut adalah grafik visualisasi yang Anda minta.";
            }
            $messages[] = ['role' => 'assistant', 'content' => $aiContent];
        }

        $messages[] = ['role' => 'user', 'content' => $message];

        try {
        
            $reply = $this->aiProvider->chatText($messages);
        
            Log::info('DEBUG - GROQ RAW REPLY: ', [
                'content' => $reply
            ]);
        
            if (!$reply || trim($reply) === '') {
        
                $reply =
                    'Maaf, sistem AI tidak dapat merangkum data pada tanggal tersebut.';
            }
        
        } catch (\Exception $e) {
        
            Log::error('Groq Exception: ' . $e->getMessage());
        
            return [
                'reply' => 'Maaf, gagal terhubung ke server AI.'
            ];
        } catch (\Exception $e) {
            Log::error('Groq Exception: ' . $e->getMessage());
            return ['reply' => 'Maaf, gagal terhubung ke server AI.'];
        }

        $cleanReply = preg_replace('/[\x{1F600}-\x{1F64F}\x{1F300}-\x{1F5FF}\x{1F680}-\x{1F6FF}\x{2600}-\x{26FF}]/u', '', $reply);
        $reply = $cleanReply !== null ? $cleanReply : $reply;

        if (isset($pendingChartResponse) && $pendingChartResponse !== null) {
            
            // Masukkan hasil ketikan AI yang sudah rapi ke dalam summary_text
            $pendingChartResponse['summary_text'] = trim($reply);
            
            Chat::create([
                'user_id' => $user->user_id,
                'message' => $message,
                'reply'   => json_encode($pendingChartResponse),
                'intent'  => $intent,
                'operation' => $params['operasi_cob'] ?? null,
            ]);

            $todayCount = Chat::where('user_id', $user->user_id)->whereDate('created_at', now())->count();

            $pendingChartResponse['limit'] = 100;
            $pendingChartResponse['used'] = $todayCount;
            $pendingChartResponse['remaining'] = max(100 - $todayCount, 0);

            return $pendingChartResponse;
        }
        
        Chat::create([
            'user_id' => $user->user_id,
            'message' => $message,
            'reply'   => $reply,
            'intent'  => $intent,
            'operation' => $params['operasi_cob'] ?? null,
        ]);

        $todayCount = Chat::where('user_id', $user->user_id)->whereDate('created_at', now())->count();

        return [
            'reply' => $reply,
            'limit' => 100,
            'used' => $todayCount,
            'remaining' => max(100 - $todayCount, 0)
        ];
    }
}