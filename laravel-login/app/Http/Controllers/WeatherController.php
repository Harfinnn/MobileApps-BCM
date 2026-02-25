<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;

class WeatherController extends Controller
{
    public function forecast(Request $request)
    {
        $adm4 = $request->adm4;

        if (!$adm4) {
            return response()->json([
                'success' => false,
                'message' => 'ADM4 is required'
            ], 400);
        }

        try {
            $response = Http::timeout(10)->get(
                'https://api.bmkg.go.id/publik/prakiraan-cuaca',
                ['adm4' => $adm4]
            );

            if (!$response->successful()) {
                return response()->json([
                    'success' => false,
                    'message' => 'BMKG API error'
                ], 500);
            }

            return response()->json([
                'success' => true,
                'data' => $response->json()
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Connection failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function byLocation(Request $request)
    {
        $request->validate([
            'lat' => 'required|numeric',
            'lon' => 'required|numeric',
        ]);

        $lat = $request->lat;
        $lon = $request->lon;
        $range = 0.3;

        $nearest = DB::table('adm4')
            ->whereBetween('lat', [$lat - $range, $lat + $range])
            ->whereBetween('lon', [$lon - $range, $lon + $range])
            ->selectRaw("
            adm4,
            kecamatan,
            kelurahan,
            kotkab,
            provinsi,
            lat,
            lon,
            (
                6371 * acos(
                    cos(radians(?)) *
                    cos(radians(lat)) *
                    cos(radians(lon) - radians(?)) +
                    sin(radians(?)) *
                    sin(radians(lat))
                )
            ) AS distance
        ", [$lat, $lon, $lat])
            ->orderBy('distance')
            ->first();

        if (!$nearest) {
            return response()->json([
                'success' => false,
                'message' => 'Location not found'
            ], 404);
        }

        $cacheKey = 'weather_' . $nearest->adm4;

        $cached = Cache::get($cacheKey);

        if ($cached) {
            return response()->json([
                'success' => true,
                'adm4' => $nearest->adm4,
                'location' => $nearest,
                'data' => $cached
            ]);
        }

        try {
            $response = Http::timeout(4)
                ->connectTimeout(2)
                ->get(
                    'https://api.bmkg.go.id/publik/prakiraan-cuaca',
                    ['adm4' => $nearest->adm4]
                );

            if (!$response->successful()) {
                return response()->json([
                    'success' => false,
                    'message' => 'BMKG API error'
                ], 500);
            }

            $weather = $response->json();

            Cache::put($cacheKey, $weather, now()->addMinutes(10));

            return response()->json([
                'success' => true,
                'adm4' => $nearest->adm4,
                'location' => $nearest,
                'data' => $weather
            ]);

        } catch (\Exception $e) {

            return response()->json([
                'success' => false,
                'message' => 'BMKG timeout'
            ], 500);
        }
    }
}