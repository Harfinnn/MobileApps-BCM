<?php

namespace App\Services\Parser\Rules;

class BomEomRule
{
    public function detect(string $message): ?array
    {
        $message = strtolower($message);

        // =====================================
        // CHART DETECTION
        // =====================================

        $isChartRequest =
            str_contains($message, 'grafik') ||
            str_contains($message, 'chart') ||
            str_contains($message, 'trend') ||
            str_contains($message, 'diagram') ||
            str_contains($message, 'visualisasi');

        // =====================================
        // BOM VS EOM
        // =====================================

        if (

            (
                (
                    str_contains($message, 'bom') ||
                    str_contains($message, 'awal bulan')
                )
                &&
                (
                    str_contains($message, 'eom') ||
                    str_contains($message, 'akhir bulan')
                )
            )

            ||

            str_contains($message, 'bandingkan awal dan akhir bulan') ||

            str_contains($message, 'perbandingan bom dan eom') ||

            str_contains($message, 'compare bom eom') ||

            str_contains($message, 'closing vs opening') ||

            str_contains($message, 'awal vs akhir bulan')

        ) {

            return [

                'intent' => 'data_cob',

                'confidence' => 0.97,

                'parameters' => [

                    'operasi_cob' => 'bom_vs_eom',

                    'jenis_chart' => $isChartRequest
                        ? 'umum'
                        : 'teks'
                ]
            ];
        }

        // =====================================
        // BOM
        // =====================================

        if (

            str_contains($message, 'bom') ||

            str_contains($message, 'beginning of month') ||

            str_contains($message, 'awal bulan') ||

            str_contains($message, 'opening month') ||

            str_contains($message, 'operasional awal bulan') ||

            str_contains($message, 'transaksi awal bulan') ||

            str_contains($message, 'aktivitas awal bulan')

        ) {

            return [

                'intent' => 'data_cob',

                'confidence' => 0.95,

                'parameters' => [

                    'operasi_cob' => 'bom',

                    'jenis_chart' => $isChartRequest
                        ? 'umum'
                        : null
                ]
            ];
        }

        // =====================================
        // EOM
        // =====================================

        if (

            str_contains($message, 'eom') ||

            str_contains($message, 'end of month') ||

            str_contains($message, 'akhir bulan') ||

            str_contains($message, 'closing month') ||

            str_contains($message, 'closing bulanan') ||

            str_contains($message, 'operasional akhir bulan') ||

            str_contains($message, 'transaksi akhir bulan') ||

            str_contains($message, 'closing transaksi')

        ) {

            return [

                'intent' => 'data_cob',

                'confidence' => 0.95,

                'parameters' => [

                    'operasi_cob' => 'eom',

                    'jenis_chart' => $isChartRequest
                        ? 'umum'
                        : null
                ]
            ];
        }

        return null;
    }
}