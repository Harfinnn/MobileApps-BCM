<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\LaporBencana;

class DashboardBencanaController extends Controller
{

    public function index(Request $request)
    {
        $query = LaporBencana::with('bencana')
            ->orderByDesc('created_at');

        $data = $query->paginate(10);

        return response()->json([
            'success' => true,
            'data' => [
                'data' => $data->map(fn($item) => [
                    'id' => $item->id,

                    // 🔥 FIX UTAMA DI SINI
                    'jenis_bencana' =>
                        $item->bencana?->mbe_nama
                        ?? $item->jenis_bencana
                        ?? 'Tidak Diketahui',

                    'unit_kerja' => $item->unit_kerja_nama,
                    'lokasi' => $item->lokasi,
                    'created_at' => optional($item->created_at)->format('Y-m-d H:i:s'),
                    'terdampak' => (bool) $item->terdampak,
                    'ada_kerusakan' => (bool) $item->ada_kerusakan,
                ]),
                'current_page' => $data->currentPage(),
                'last_page' => $data->lastPage(),
            ],
        ]);
    }


    public function summary()
    {
        return response()->json([
            'success' => true,
            'data' => [
                'hari_ini' => LaporBencana::whereDate('created_at', today())->count(),
                'aktif' => 0,
                'selesai' => 0,
                'darurat' => LaporBencana::where('ada_kerusakan', true)->count(),
            ],
        ]);
    }

    public function show($id)
    {
        $data = LaporBencana::with(['bencana', 'user'])
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $data->id,
                'jenis_bencana' =>
                    $data->bencana?->mbe_nama
                    ?? $data->jenis_bencana
                    ?? 'Tidak Diketahui',
                'unit_kerja' => $data->unit_kerja_nama,
                'lokasi' => $data->lokasi,
                'created_at' => optional($data->created_at)->format('Y-m-d H:i:s'),
                'terdampak' => (bool) $data->terdampak,
                'ada_kerusakan' => (bool) $data->ada_kerusakan,
                'pelapor' => $data->user?->user_nama,
                'foto' => $data->foto
                    ? asset('storage/' . $data->foto)
                    : null,
            ],
        ]);
    }
}
