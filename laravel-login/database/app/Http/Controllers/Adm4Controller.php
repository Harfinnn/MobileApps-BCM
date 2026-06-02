<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class Adm4Controller extends Controller
{
    public function nearest(Request $request)
{
    $request->validate([
        'lat' => 'required|numeric',
        'lon' => 'required|numeric',
    ]);

    $lat = (float) $request->lat;
    $lon = (float) $request->lon;
    $range = 0.3;

    $query = "
        adm4,
        kecamatan,
        kelurahan,
        kotkab,
        provinsi,
        lat,
        lon,
        (
            6371 * acos(
                LEAST(1,
                    GREATEST(-1,
                        cos(radians(?)) *
                        cos(radians(lat)) *
                        cos(radians(lon) - radians(?)) +
                        sin(radians(?)) *
                        sin(radians(lat))
                    )
                )
            )
        ) AS distance
    ";

    $nearest = DB::table('adm4')
        ->whereBetween('lat', [$lat - $range, $lat + $range])
        ->whereBetween('lon', [$lon - $range, $lon + $range])
        ->selectRaw($query, [$lat, $lon, $lat])
        ->orderBy('distance')
        ->first();

    if (!$nearest) {
        $nearest = DB::table('adm4')
            ->selectRaw($query, [$lat, $lon, $lat])
            ->orderBy('distance')
            ->first();
    }

    return response()->json([
        'success' => true,
        'data' => $nearest
    ]);
}
}