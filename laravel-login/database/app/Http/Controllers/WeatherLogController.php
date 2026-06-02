<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\WeatherLog;

class WeatherLogController extends Controller
{
    public function store(Request $request)
{
    $request->validate([
        'location_name' => 'required',
        'latitude' => 'required',
        'longitude' => 'required',
        'temperature' => 'required',
        'humidity' => 'required',
        'wind_speed' => 'required',
        'rain_probability' => 'nullable',
        'condition' => 'required',
    ]);

    
    $lat = round($request->latitude, 4);
    $lon = round($request->longitude, 4);

    
    $last = WeatherLog::where('latitude', $lat)
        ->where('longitude', $lon)
        ->latest()
        ->first();

    
    if (!$last) {
        WeatherLog::create([
            'location_name' => $request->location_name,
            'latitude' => $lat,
            'longitude' => $lon,
            'temperature' => $request->temperature,
            'humidity' => $request->humidity,
            'wind_speed' => $request->wind_speed,
            'rain_probability' => $request->rain_probability,
            'condition' => $request->condition,
            'weather_date' => now()->toDateString(),
        ]);

        return response()->json(['message' => 'First insert']);
    }

    
    if ($last->condition !== $request->condition) {
        WeatherLog::create([
            'location_name' => $request->location_name,
            'latitude' => $lat,
            'longitude' => $lon,
            'temperature' => $request->temperature,
            'humidity' => $request->humidity,
            'wind_speed' => $request->wind_speed,
            'rain_probability' => $request->rain_probability,
            'condition' => $request->condition,
            'weather_date' => now()->toDateString(),
        ]);

        return response()->json(['message' => 'Weather changed - inserted']);
    }

    return response()->json(['message' => 'No change detected']);
}
}
