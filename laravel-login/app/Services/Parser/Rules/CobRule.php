<?php

namespace App\Services\Parser\Rules;

class CobRule
{
    // =====================================
    // GENERAL COB KEYWORDS
    // =====================================
    
    private $generalKeywords = [
    
        // COB
        'cob',
        'close of business',
        'operasional',
    
        // TRANSACTION
        'transaksi',
        'trx',
        'volume transaksi',
    
        // PERFORMANCE
        'performa',
        'performance',
        'monitoring',
        'overview',
        'summary',
    
        // DURATION
        'durasi',
        'lama proses',
        'processing time',
    
        // BOM / EOM
        'bom',
        'eom',
        'awal bulan',
        'akhir bulan',
    
        // STAGE
        'stage',
        'application',
        'system wide',
        'reporting',
        'start of day',
        'online',
    
        // FORECAST
        'forecast',
        'prediksi',
        'estimasi',
    
        // ISSUE
        'kendala',
        'problem',
        'error',
        'slow',
        'lemot',
    ];

    // =====================================
    // CHART KEYWORDS
    // =====================================

    private $chartKeywords = [

        'grafik',
        'chart',
        'trend',
        'diagram',
        'visualisasi',
    ];

    // =====================================
    // STAGE KEYWORDS
    // =====================================

    private $stageKeywords = [

        'stage',
        'application',
        'system wide',
        'reporting',
        'start of day',
        'online',
    ];

    // =====================================
    // FORECAST KEYWORDS
    // =====================================

    private $forecastKeywords = [

        'forecast',
        'prediksi',
        'estimasi',
        'perkiraan',
    ];

    // =====================================
    // COMPARE KEYWORDS
    // =====================================

    private $compareKeywords = [

        'bandingkan',
        'compare',
        'vs',
        'versus',
        'perbandingan',
    ];

    // =====================================
    // MAIN DETECTOR
    // =====================================

    public function detect(string $message): ?array
    {
        $message = strtolower($message);

        // =====================================
        // GENERAL MATCH
        // =====================================

        if (
            !$this->containsKeyword(
                $message,
                $this->generalKeywords
            )
        ) {

            return null;
        }

        $parameters = [];

        // =====================================
        // DEFAULT INTENT
        // =====================================

        $intent = 'data_cob';

        // =====================================
        // CHART DETECTION
        // =====================================

        if (
            $this->containsKeyword(
                $message,
                $this->chartKeywords
            )
        ) {

            $parameters['jenis_chart']
                = 'umum';
        }

        // =====================================
        // STAGE CHART
        // =====================================

        if (
            $this->containsKeyword(
                $message,
                $this->stageKeywords
            )
        ) {

            $parameters['jenis_chart']
                = 'stage';
        }

        // =====================================
        // FORECAST
        // =====================================

        if (
            $this->containsKeyword(
                $message,
                $this->forecastKeywords
            )
        ) {

            $parameters['operasi_cob']
                = 'prediksi';
        }

        // =====================================
        // COMPARE
        // =====================================

        if (
            $this->containsKeyword(
                $message,
                $this->compareKeywords
            )
        ) {

            $parameters['is_compare']
                = true;
        }

        return [

            'intent' => $intent,

            'confidence' => 0.90,

            'parameters' => $parameters,
        ];
    }

    // =====================================
    // HELPER
    // =====================================

    private function containsKeyword(
        string $message,
        array $keywords
    ): bool {

        foreach ($keywords as $keyword) {

            if (str_contains($message, $keyword)) {

                return true;
            }
        }

        return false;
    }
}