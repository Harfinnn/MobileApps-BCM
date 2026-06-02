<?php

namespace App\Services\Parser\Rules;

class WeatherRule
{
    // =====================================
    // GENERAL WEATHER KEYWORDS
    // =====================================

    private $weatherKeywords = [

        // GENERAL
        'cuaca',
        'weather',
        'prakiraan',
        'forecast',

        // CONDITION
        'hujan',
        'gerimis',
        'mendung',
        'cerah',
        'panas',
        'berawan',
        'kabut',

        // EXTREME
        'banjir',
        'petir',
        'badai',
        'angin kencang',
        'puting beliung',
        'longsor',

        // TEMPERATURE
        'suhu',
        'temperatur',
        'dingin',
        'kelembaban',

        // WIND
        'angin',
        'kecepatan angin',

        // BCM / OPERASIONAL
        'cuaca ekstrem',
        'warning cuaca',
        'peringatan dini',
        'iklim',
        'storm',
    ];

    // =====================================
    // FORECAST KEYWORDS
    // =====================================

    private $forecastKeywords = [

        'prakiraan',
        'forecast',
        'prediksi cuaca',
        'cuaca besok',
        'cuaca minggu ini',
    ];

    // =====================================
    // EXTREME WEATHER KEYWORDS
    // =====================================

    private $extremeKeywords = [

        'banjir',
        'badai',
        'petir',
        'angin kencang',
        'cuaca ekstrem',
        'puting beliung',
        'longsor',
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
                $this->weatherKeywords
            )
        ) {

            return null;
        }

        $parameters = [];

        // =====================================
        // FORECAST
        // =====================================

        if (
            $this->containsKeyword(
                $message,
                $this->forecastKeywords
            )
        ) {

            $parameters['mode']
                = 'forecast';
        }

        // =====================================
        // EXTREME WEATHER
        // =====================================

        if (
            $this->containsKeyword(
                $message,
                $this->extremeKeywords
            )
        ) {

            $parameters['mode']
                = 'extreme';
        }

        return [

            'intent' => 'cuaca',

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