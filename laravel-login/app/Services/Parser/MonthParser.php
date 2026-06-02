<?php

namespace App\Services\Parser;

class MonthParser
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

        foreach ($this->bulanMap as $namaBulan => $nomorBulan) {

            // contoh:
            // desember 2025
            if (
                preg_match(
                    '/\b' . $namaBulan . '\s+(\d{4})\b/i',
                    $message,
                    $match
                )
            ) {

                return [
                    'bulan' => $match[1] . '-' . $nomorBulan,
                    'tahun' => $match[1]
                ];
            }

            // contoh:
            // desember
            if (
                preg_match(
                    '/\b' . $namaBulan . '\b/i',
                    $message
                )
            ) {

                $tahun = date('Y');

                return [
                    'bulan' => $tahun . '-' . $nomorBulan,
                    'tahun' => $tahun
                ];
            }
        }

        return [];
    }
}