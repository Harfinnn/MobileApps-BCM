<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\MBencana;

class BencanaController extends Controller
{
    public function index()
    {
        $data = MBencana::where('mbe_status', 1)
            ->where('mbe_bencana', 1)
            ->orderBy('mbe_sort')
            ->get([
                'mbe_id',
                'mbe_nama',
                'mbe_warna',
                'mbe_icon'
            ]);

        return response()->json([
            'success' => true,
            'data' => $data
        ]);
    }
}
