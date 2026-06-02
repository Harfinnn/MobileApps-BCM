<?php

namespace App\Services\Parser;

class TypoNormalizer
{
    protected $dictionary = [

        /*
        |--------------------------------------------------------------------------
        | GEMPA
        |--------------------------------------------------------------------------
        */
        'gmpa' => 'gempa',
        'gmppa' => 'gempa',
        'gempaa' => 'gempa',
        'gampa' => 'gempa',
        'gempha' => 'gempa',
        'earth quake' => 'earthquake',

        /*
        |--------------------------------------------------------------------------
        | KOTA / LOKASI
        |--------------------------------------------------------------------------
        */
        'jkrta' => 'jakarta',
        'jakrta' => 'jakarta',
        'jakartaa' => 'jakarta',

        'sby' => 'surabaya',
        'srbya' => 'surabaya',
        'sbya' => 'surabaya',

        'bdg' => 'bandung',
        'bndung' => 'bandung',

        'jogjaa' => 'jogja',
        'yk' => 'yogyakarta',

        /*
        |--------------------------------------------------------------------------
        | BYOND / APLIKASI
        |--------------------------------------------------------------------------
        */
        'byon' => 'byond',
        'biyond' => 'byond',
        'beyond' => 'byond',
        'bynd' => 'byond',

        't 24' => 't24',
        'tee24' => 't24',

        'bifast' => 'bi fast',
        'bi-fast' => 'bi fast',
        'bifst' => 'bi fast',

        'ncsm' => 'ncms',

        /*
        |--------------------------------------------------------------------------
        | TRANSAKSI / COB
        |--------------------------------------------------------------------------
        */
        'trx' => 'transaksi',
        'trxnya' => 'transaksi',
        'trnsksi' => 'transaksi',
        'transkasi' => 'transaksi',
        'traksaksi' => 'transaksi',

        'oprasional' => 'operasional',
        'opersional' => 'operasional',

        'dursi' => 'durasi',
        'drasi' => 'durasi',

        'soddd' => 'sod',
        'eodd' => 'eod',

        /*
        |--------------------------------------------------------------------------
        | GRAFIK / VISUAL
        |--------------------------------------------------------------------------
        */
        'grafk' => 'grafik',
        'grpik' => 'grafik',
        'garfik' => 'grafik',
        'grafiik' => 'grafik',

        'char' => 'chart',
        'cartt' => 'chart',

        'visulisasi' => 'visualisasi',
        'visualsasi' => 'visualisasi',
        
        'diagaram' => 'diagram',
        'diagam' => 'diagram',
        
        'plott' => 'plot',
        
        'visual' => 'visualisasi',
        'vizualisasi' => 'visualisasi',
        
        'grph' => 'grafik',
        'grfk' => 'grafik',

        /*
        |--------------------------------------------------------------------------
        | INSIDEN
        |--------------------------------------------------------------------------
        */
        'insden' => 'insiden',
        'insdent' => 'insiden',
        'incdent' => 'incident',
        'inciden' => 'incident',

        'downtimee' => 'downtime',
        'dwntime' => 'downtime',

        'ganguan' => 'gangguan',
        'ganguaan' => 'gangguan',

        'rcaa' => 'rca',

        /*
        |--------------------------------------------------------------------------
        | CUACA
        |--------------------------------------------------------------------------
        */
        'cuacaa' => 'cuaca',
        'hujann' => 'hujan',
        'mendunng' => 'mendung',
        'prakiraaan' => 'prakiraan',

        /*
        |--------------------------------------------------------------------------
        | BOM / EOM
        |--------------------------------------------------------------------------
        */
        'awla bulan' => 'awal bulan',
        'akir bulan' => 'akhir bulan',

        'bommm' => 'bom',
        'eomm' => 'eom',

        /*
        |--------------------------------------------------------------------------
        | PREDIKSI
        |--------------------------------------------------------------------------
        */
        'predks' => 'prediksi',
        'forcast' => 'forecast',
        'ramallan' => 'ramalan',
        
        'predksi' => 'prediksi',
        'predikssi' => 'prediksi',
        
        'forecastt' => 'forecast',
        'forcase' => 'forecast',
        
        'proyeksii' => 'proyeksi',
        
        'trendd' => 'trend',
        'trennd' => 'trend',

        /*
        |--------------------------------------------------------------------------
        | FILTER
        |--------------------------------------------------------------------------
        */
        'diats' => 'di atas',
        'di ats' => 'di atas',
        
        'dbawah' => 'di bawah',
        'di bwah' => 'di bawah',
        
        'maksimall' => 'maksimal',
        'minimalll' => 'minimal',
        
        'lebih dr' => 'lebih dari',
        'kurang dr' => 'kurang dari',
        'lebih dri' => 'lebih dari',
        'kurang dri' => 'kurang dari',

        /*
        |--------------------------------------------------------------------------
        | UMUM
        |--------------------------------------------------------------------------
        */
        'aplkasi' => 'aplikasi',
        'sistm' => 'sistem',
        'jaringn' => 'jaringan',
        'kendla' => 'kendala',
        'maslah' => 'masalah',
        
        /*
        |--------------------------------------------------------------------------
        | OPERASIONAL
        |--------------------------------------------------------------------------
        */
        
        'laporann' => 'laporan',
        'laprn' => 'laporan',
        
        'statistikk' => 'statistik',
        'statisik' => 'statistik',
        
        'performaa' => 'performa',
        'perfoma' => 'performa',
        
        'analitic' => 'analytics',
        'analitycs' => 'analytics',
        
        'summaryy' => 'summary',
        'summry' => 'summary',
        
        
        /*
        |--------------------------------------------------------------------------
        | WAKTU DAN TANGGAL
        |--------------------------------------------------------------------------
        */
        'hr ini' => 'hari ini',
        'hrni' => 'hari ini',
        
        'kmrn' => 'kemarin',
        'kmaren' => 'kemarin',
        
        'bsok' => 'besok',
        'besokk' => 'besok',
        
        'mnggu ini' => 'minggu ini',
        'mingu ini' => 'minggu ini',
        
        'bln ini' => 'bulan ini',
        'bulan ni' => 'bulan ini',
        
        'thn ini' => 'tahun ini',
        'tahun ni' => 'tahun ini',
        
        /*
        |--------------------------------------------------------------------------
        | INFRASTRUKTUR / IT
        |--------------------------------------------------------------------------
        */
        'serverr' => 'server',
        'sevver' => 'server',
        
        'databasee' => 'database',
        'databse' => 'database',
        
        'memoryy' => 'memory',
        'memorii' => 'memori',
        
        'network' => 'jaringan',
        'netwrk' => 'jaringan',
        
        'latencii' => 'latency',
        'latncy' => 'latency',
        
        /*
        |--------------------------------------------------------------------------
        | SYSTEM ERROR
        |--------------------------------------------------------------------------
        */
        'errorr' => 'error',
        'eror' => 'error',
        
        'time out' => 'timeout',
        'tmeout' => 'timeout',
        
        'downn' => 'down',
        'dowwn' => 'down',
        
        'intermitent' => 'intermitten',
        'intermitantt' => 'intermitten',
        
        /*
        |--------------------------------------------------------------------------
        | CABANG / BISNIS
        |--------------------------------------------------------------------------
        */
        'cbang' => 'cabang',
        'cabng' => 'cabang',
        
        'kc' => 'kantor cabang',
        'kcp' => 'kantor cabang pembantu',
        
        'nasabahh' => 'nasabah',
        'nsbh' => 'nasabah',
        
        /*
        |--------------------------------------------------------------------------
        | USER
        |--------------------------------------------------------------------------
        */
        'gmn' => 'gimana',
        'bgmn' => 'bagaimana',
        
        'knp' => 'kenapa',
        
        'adaa' => 'ada',
        
        'apkh' => 'apakah',
        
        'tolongg' => 'tolong',
        'pls' => 'tolong',
        
    ];

    public function normalize(string $message): string
    {
        $message = strtolower(trim($message));

        foreach ($this->dictionary as $wrong => $correct) {

            $message = preg_replace(
                '/\b' . preg_quote($wrong, '/') . '\b/ui',
                $correct,
                $message
            );
        }

        // rapikan spasi ganda
        $message = preg_replace('/\s+/', ' ', $message);

        return trim($message);
    }
    
    
}