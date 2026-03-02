<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\WeatherService;

class WeatherController extends Controller
{
    protected $weather;

    public function __construct(WeatherService $weather)
    {
        $this->weather = $weather;
    }

    public function index(Request $request)
    {
        $lat = $request->lat;
        $lon = $request->lon;
        $adm4 = $request->adm4;

        if (!$lat || !$lon || !$adm4) {
            return response()->json([
                'success' => false,
                'message' => 'lat, lon, adm4 required'
            ], 400);
        }

        $current = $this->weather->getCurrentWeather($lat, $lon);
        $forecast = $this->weather->getForecastBMKG($adm4);

        return response()->json([
            'success' => true,
            'data' => [
                'current' => $current,
                'forecast' => $forecast,
            ]
        ]);
    }
}