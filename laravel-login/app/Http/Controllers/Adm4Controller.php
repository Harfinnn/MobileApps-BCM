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

        return response()->json($nearest);
    }
}