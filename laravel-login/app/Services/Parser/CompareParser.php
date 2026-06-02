<?php

namespace App\Services\Parser;

use Carbon\Carbon;

class CompareParser
{
    protected $bulanMap = [
        'januari' => '01',
        'februari' => '02',
        'maret' => '03',
        'april' => '04',
        'mei' => '05',
        'juni' => '06',
        'juli' => '07',
        'agustus' => '08',
        'september' => '09',
        'oktober' => '10',
        'november' => '11',
        'desember' => '12',
    ];

    public function parse(string $message): array
    {
        $message = strtolower($message);

        $result = [
            'is_compare' => false,
            'hari' => null,
            'hari_banding' => null,
            'bulan' => null,
            'bulan_banding' => null,
        ];

        // =========================================
        // DETEKSI KATA COMPARE
        // =========================================
        $isCompare = (
            str_contains($message, 'vs') ||
            str_contains($message, 'bandingkan') ||
            str_contains($message, 'perbandingan') ||
            str_contains($message, 'dibanding')
        );

        if (!$isCompare) {
            return $result;
        }

        // =========================================
        // FORMAT:
        // 1 mei dan 5 mei
        // =========================================
        if (
            preg_match(
                '/(\d{1,2})\s+([a-z]+)\s+(dan|vs)\s+(\d{1,2})\s+([a-z]+)/i',
                $message,
                $match
            )
        ) {

            $hari1 = $match[1];
            $bulan1 = $this->bulanMap[$match[2]] ?? null;

            $hari2 = $match[4];
            $bulan2 = $this->bulanMap[$match[5]] ?? null;

            $tahun = Carbon::now()->format('Y');

            if ($bulan1 && $bulan2) {

                $result['is_compare'] = true;

                $result['hari'] =
                    "{$tahun}-{$bulan1}-" .
                    str_pad($hari1, 2, '0', STR_PAD_LEFT);

                $result['hari_banding'] =
                    "{$tahun}-{$bulan2}-" .
                    str_pad($hari2, 2, '0', STR_PAD_LEFT);
            }
        }

        // =========================================
        // FORMAT:
        // mei vs juni
        // =========================================
        elseif (
            preg_match(
                '/([a-z]+)\s+(vs|dan)\s+([a-z]+)/i',
                $message,
                $match
            )
        ) {

            $bulan1 = $this->bulanMap[$match[1]] ?? null;
            $bulan2 = $this->bulanMap[$match[3]] ?? null;

            $tahun = Carbon::now()->format('Y');

            if ($bulan1 && $bulan2) {

                $result['is_compare'] = true;

                $result['bulan'] = "{$tahun}-{$bulan1}";
                $result['bulan_banding'] = "{$tahun}-{$bulan2}";
            }
        }

        return $result;
    }
}