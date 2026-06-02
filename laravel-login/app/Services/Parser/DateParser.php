<?php

namespace App\Services\Parser;

use Carbon\Carbon;

class DateParser
{
    public function parse(string $message): array
    {
        $message = strtolower($message);

        $result = [
            'hari' => null,
            'hari_mulai' => null,
            'hari_akhir' => null,
            'bulan' => null,
            'tahun' => null,
        ];
        
        // =====================================
        // MULTI TANGGAL
        // contoh:
        // 10, 11, 12 mei 2026
        // =====================================
        
        if (
            preg_match(
                '/((?:\d{1,2}(?:\s*(?:,|dan|&)?\s*)?)+)\s+(januari|februari|maret|april|mei|juni|juli|agustus|september|oktober|november|desember)\s+(\d{4})/i',
                $message,
                $match
            )
        ) {
        
            $months = [
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
        
            $daysString = $match[1];

            $daysString = str_replace(
                ['dan', '&'],
                ',',
                $daysString
            );
            
            $daysRaw = preg_split(
                '/[\s,]+/',
                $daysString
            );
        
            $month = $months[strtolower($match[2])];
        
            $year = $match[3];
        
            $dates = [];
        
            foreach ($daysRaw as $day) {
        
                $day = trim($day);
        
                if (!$day) {
                    continue;
                }
        
                $dates[] =
                    $year . '-' .
                    $month . '-' .
                    str_pad($day, 2, '0', STR_PAD_LEFT);
            }
        
            $result['hari'] = $dates;
        
            return $result;
        }

        // =====================================
        // FORMAT TANGGAL INDONESIA
        // contoh:
        // 12 mei 2026
        // 1 januari 2025
        // =====================================

        $months = [
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

        if (
            preg_match(
                '/(\d{1,2})\s+(januari|februari|maret|april|mei|juni|juli|agustus|september|oktober|november|desember)\s+(\d{4})/i',
                $message,
                $match
            )
        ) {

            $day = str_pad($match[1], 2, '0', STR_PAD_LEFT);

            $month = $months[$match[2]];

            $year = $match[3];

            $result['hari'] = "{$year}-{$month}-{$day}";

            return $result;
        }

        // =====================================
        // HARI INI
        // =====================================

        if (str_contains($message, 'hari ini')) {

            $result['hari']
                = Carbon::today()->format('Y-m-d');
        }

        // =====================================
        // BESOK
        // =====================================

        elseif (str_contains($message, 'besok')) {

            $result['hari']
                = Carbon::tomorrow()->format('Y-m-d');
        }

        // =====================================
        // KEMARIN
        // =====================================

        elseif (str_contains($message, 'kemarin')) {

            $result['hari']
                = Carbon::yesterday()->format('Y-m-d');
        }

        // =====================================
        // X HARI LALU
        // =====================================

        elseif (
            preg_match(
                '/(\d+)\s+hari\s+lalu/',
                $message,
                $match
            )
        ) {

            $jumlahHari = (int) $match[1];

            $result['hari']
                = Carbon::now()
                    ->subDays($jumlahHari)
                    ->format('Y-m-d');
        }

        // =====================================
        // BULAN INI
        // =====================================

        elseif (str_contains($message, 'bulan ini')) {

            $result['bulan']
                = Carbon::now()->format('Y-m');
        }

        // =====================================
        // TAHUN INI
        // =====================================

        elseif (str_contains($message, 'tahun ini')) {

            $result['tahun']
                = Carbon::now()->format('Y');
        }

        // =====================================
        // MINGGU INI
        // =====================================

        elseif (str_contains($message, 'minggu ini')) {

            $result['hari_mulai']
                = Carbon::now()
                    ->startOfWeek(Carbon::MONDAY)
                    ->format('Y-m-d');

            $result['hari_akhir']
                = Carbon::now()
                    ->endOfWeek(Carbon::SUNDAY)
                    ->format('Y-m-d');
        }
        
        // =====================================
        // FORMAT TAHUN
        // contoh:
        // 2026
        // =====================================
        
        elseif (
            preg_match(
                '/\b(20\d{2})\b/',
                $message,
                $match
            )
        ) {
        
            $result['tahun'] = $match[1];
        }

        return $result;
    }
}