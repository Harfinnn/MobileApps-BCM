<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

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
}