<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PanduanController extends Controller
{
    // LIST PANDUAN (PanduanBencanaScreen)
    public function index()
    {
        $data = DB::table('m_bencana')
            ->where('mbe_bencana', 1)
            ->where('mbe_status', 1)
            ->orderBy('mbe_sort', 'asc')
            ->select(
                'mbe_id',
                'mbe_nama',
                'mbe_warna',
                'mbe_icon'
            )
            ->get();

        return response()->json([
            'status' => true,
            'total' => $data->count(),
            'data' => $data
        ]);
    }

    // DETAIL PANDUAN (PanduanDetailScreen)
    public function show($id)
    {
        if (!is_numeric($id)) {
            return response()->json([
                'status' => false,
                'message' => 'ID tidak valid'
            ], 400);
        }

        $images = DB::table('data_bencana as d')
            ->join('m_bencana as m', 'm.mbe_id', '=', 'd.dab_head_id')
            ->where('d.dab_head_id', $id)
            ->where('d.dab_status', 1)
            ->where('m.mbe_bencana', 1)
            ->orderBy('d.dab_sort', 'asc')
            ->select(
                'd.dab_id',
                DB::raw("CONCAT('https://simpel-bcm.com/img/bencana/', d.dab_gambar) AS image")
            )
            ->get();

        return response()->json([
            'status' => true,
            'total' => $images->count(),
            'data' => $images
        ]);
    }
}
