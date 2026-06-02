<?php

namespace App\Services\Parser\Rules;

class GempaRule
{
    // =====================================
    // GENERAL GEMPA KEYWORDS
    // =====================================

    private $gempaKeywords = [

        // GENERAL
        'gempa',
        'earthquake',
        'seismic',
        'getaran',
        'guncangan',

        // BMKG
        'bmkg',
        'info gempa',
        'update gempa',

        // BENCANA
        'gempa bumi',
        'gempa terbaru',
        'gempa terkini',

        // DAMPAK
        'tsunami',
        'retakan',
        'aftershock',
        'gempa susulan',

        // OPERASIONAL
        'cabang terdampak',
        'dampak gempa',
        'radius gempa',

        // USER NATURAL
        'bumi goyang',
        'terasa gempa',
        'ada getaran',
    ];

    // =====================================
    // CABANG IMPACT
    // =====================================

    private $dampakKeywords = [

        'dampak',
        'terdampak',
        'radius',
        'cabang terdampak',
        'lokasi terdampak',
        'area terdampak',
    ];

    // =====================================
    // MAGNITUDE FILTER
    // =====================================

    private $magnitudeKeywords = [

        'magnitudo',
        'magnitude',
        'skala richter',
        'sr',
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
                $this->gempaKeywords
            )
        ) {

            return null;
        }

        $parameters = [];

        // =====================================
        // DAMPAK CABANG
        // =====================================

        if (
            $this->containsKeyword(
                $message,
                $this->dampakKeywords
            )
        ) {

            $parameters['mode']
                = 'dampak_cabang';
        }

        // =====================================
        // MAGNITUDE DETECTION
        // =====================================

        if (
            preg_match(
                '/(\d+(\.\d+)?)\s?(sr|magnitudo|magnitude)/',
                $message,
                $matches
            )
        ) {

            $parameters['magnitudo']
                = (float) $matches[1];
        }

        // =====================================
        // LOCATION DETECTION
        // =====================================

        $locations = [

            'jakarta',
            'bandung',
            'surabaya',
            'aceh',
            'padang',
            'banten',
            'yogyakarta',
            'jogja',
            'malang',
            'papua',
            'ambon',
            'bali',
            'lombok',
            'palu',
            'garut',
            'tasik',
            'sumbar',
            'sumut',
        ];

        foreach ($locations as $location) {

            if (str_contains($message, $location)) {

                $parameters['lokasi']
                    = ucfirst($location);

                break;
            }
        }

        return [

            'intent' => 'gempa',

            'confidence' => 0.95,

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