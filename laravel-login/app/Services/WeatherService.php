<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;

class WeatherService
{
    public function getCurrentWeather($lat, $lon)
{
    $lat = round($lat, 3);
    $lon = round($lon, 3);

    $cacheKey = "current_{$lat}_{$lon}";
    $lastKey  = "current_last_{$lat}_{$lon}";

    // 1️⃣ Ambil dari cache utama
    $cached = Cache::get($cacheKey);
    if ($cached) {
        return $cached;
    }

    try {

        // 2️⃣ Hit API live
        $res = Http::timeout(5)->get(
            'https://api.open-meteo.com/v1/forecast',
            [
                'latitude' => $lat,
                'longitude' => $lon,
                'current' =>
                    'temperature_2m,relative_humidity_2m,precipitation,weather_code,cloud_cover,wind_speed_10m',
                'timezone' => 'Asia/Jakarta',
            ]
        );

        if ($res->successful()) {

            $data = $res->json()['current'] ?? null;

            if ($data) {
                // Simpan cache normal (10 menit)
                Cache::put($cacheKey, $data, now()->addMinutes(10));

                // Simpan last known data (1 jam)
                Cache::put($lastKey, $data, now()->addHour());

                return $data;
            }
        }

    } catch (\Exception $e) {
        // diam saja, lanjut fallback
    }

    // 3️⃣ Fallback ke last known data
    $last = Cache::get($lastKey);
    if ($last) {
        $last['stale'] = true;
        return $last;
    }

    // 4️⃣ Final fallback
    return [
        'temperature_2m' => 0,
        'wind_speed_10m' => 0,
        'relative_humidity_2m' => 0,
        'stale' => true
    ];
}

    public function getForecastBMKG($adm4)
    {
        return Cache::remember(
            "forecast_{$adm4}",
            now()->addMinutes(30),
            function () use ($adm4) {

                $res = Http::timeout(5)->get(
                    'https://api.bmkg.go.id/publik/prakiraan-cuaca',
                    ['adm4' => $adm4]
                );

                if (!$res->successful()) {
                    return null;
                }

                return $res->json();
            }
        );
    }
}