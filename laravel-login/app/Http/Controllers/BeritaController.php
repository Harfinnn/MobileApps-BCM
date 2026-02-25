<?php

namespace App\Http\Controllers;

use App\Models\DataBerita;

class BeritaController extends Controller
{
    // ✅ Ambil semua berita untuk list
    public function index()
    {
        return response()->json(
            DataBerita::where('dbe_status', 1)
                ->orderBy('dbe_id', 'desc')
                ->limit(5)
                ->get([
                    'dbe_id',
                    'dbe_judul',
                    'dbe_gambar',
                    'dbe_tgl'
                ])
        );
    }

    // ✅ Ambil detail berdasarkan ID
    public function show($id)
    {
        $berita = DataBerita::where('dbe_status', 1)
            ->where('dbe_id', $id)
            ->first();

        if (!$berita) {
            return response()->json([
                'message' => 'Data tidak ditemukan'
            ], 404);
        }

        return response()->json($berita);
    }
}
