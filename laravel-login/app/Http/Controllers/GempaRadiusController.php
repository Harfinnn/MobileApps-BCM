<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class GempaRadiusController extends Controller
{
    public function index()
    {
        try {
            Log::info('GET /gempa-radius dipanggil');
            
            $data = DB::table('view_gempa')
                ->where('vig_status', 1)
                ->orderBy('vig_id', 'asc')
                ->get();
            
            Log::info('Data radius gempa:', $data->toArray());    

            return response()->json([
                'success' => true,
                'message' => 'Data radius gempa berhasil diambil',
                'data' => $data
            ], 200);

        } catch (\Exception $e) {
            Log::error('Error ambil radius gempa: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}