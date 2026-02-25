<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Carbon\Carbon;

class FetchWeatherHourly extends Command
{
    protected $signature = 'app:fetch-weather-hourly';
    protected $description = 'Fetch 1 closest weather forecast per ADM4';

    public function handle()
    {
        \Log::info('CRON WEATHER RUN ' . now());

        $adm4List = \App\Models\UserAdm4History::select('adm4_id')
            ->distinct()
            ->pluck('adm4_id');

        foreach ($adm4List as $adm4Id) {

            $adm4 = \App\Models\Adm4::find($adm4Id);
            if (!$adm4)
                continue;

            $response = \Illuminate\Support\Facades\Http::get(
                "https://api.bmkg.go.id/publik/prakiraan-cuaca?adm4={$adm4->adm4}"
            );

            if (!$response->successful())
                continue;

            $data = $response->json();
            if (!isset($data['data']))
                continue;

            $now = Carbon::now();
            $allCuaca = [];

            // Gabungkan semua prakiraan dari semua hari
            foreach ($data['data'] as $lokasi) {
                foreach ($lokasi['cuaca'] ?? [] as $cuacaGroup) {
                    foreach ($cuacaGroup as $item) {
                        $allCuaca[] = $item;
                    }
                }
            }

            if (empty($allCuaca))
                continue;

            // Ambil waktu paling dekat dengan sekarang
            $closest = collect($allCuaca)->sortBy(function ($item) use ($now) {
                return abs(strtotime($item['local_datetime']) - $now->timestamp);
            })->first();

            if ($closest) {
                \App\Models\WeatherHourly::updateOrCreate(
                    [
                        'adm4_id' => $adm4Id,
                        'local_datetime' => $closest['local_datetime'],
                    ],
                    [
                        'temperature' => $closest['t'] ?? null,
                        'humidity' => $closest['hu'] ?? null,
                        'wind_speed' => $closest['ws'] ?? null,
                        'wind_direction' => $closest['wd'] ?? null,
                        'weather_code' => $closest['weather'] ?? null,
                        'weather_desc' => $closest['weather_desc'] ?? null,
                    ]
                );
            }
        }

        $this->info('Weather hourly fetched successfully.');
    }
}