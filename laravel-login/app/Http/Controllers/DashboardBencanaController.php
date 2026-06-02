<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\LaporBencana;

class DashboardBencanaController extends Controller
{

    public function index(Request $request)
    {
        $query = LaporBencana::with('bencana')->orderByDesc('created_at');

        // 1. FILTER WAKTU
        $timeFilter = $request->input('time', 'Hari Ini');
        if ($timeFilter === 'Hari Ini') {
            $query->whereDate('created_at', today());
        } elseif ($timeFilter === '7 Hari') {
            $query->where('created_at', '>=', now()->subDays(6)->startOfDay());
        } elseif ($timeFilter === '30 Hari') {
            $query->where('created_at', '>=', now()->subDays(29)->startOfDay());
        }

        // 2. FILTER STATUS
        $statusFilter = $request->input('status', 'Semua');
        if ($statusFilter === 'Bahaya') {
            $query->where('ada_kerusakan', true);
        } elseif ($statusFilter === 'Waspada') {
            // Terdampak = true, tapi tidak ada kerusakan parah
            $query->where('terdampak', true)->where('ada_kerusakan', false);
        } elseif ($statusFilter === 'Aman') {
            // Tidak terdampak dan tidak ada kerusakan
            $query->where('terdampak', false)->where('ada_kerusakan', false);
        }

        $data = $query->paginate(10);

        return response()->json([
            'success' => true,
            'data' => [
                'data' => $data->map(fn($item) => [
                    'id' => $item->id,
                    'jenis_bencana' => $item->bencana?->mbe_nama ?? $item->jenis_bencana ?? 'Tidak Diketahui',
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


    public function summary(Request $request)
    {
        $timeFilter = $request->input('time', 'Hari Ini');
        $query = LaporBencana::query();

        // Terapkan filter waktu yang sama agar angka ringkasan sesuai dengan list
        if ($timeFilter === 'Hari Ini') {
            $query->whereDate('created_at', today());
        } elseif ($timeFilter === '7 Hari') {
            $query->where('created_at', '>=', now()->subDays(6)->startOfDay());
        } elseif ($timeFilter === '30 Hari') {
            $query->where('created_at', '>=', now()->subDays(29)->startOfDay());
        }

        // Hitung masing-masing kategori
        $total = (clone $query)->count();
        $bahaya = (clone $query)->where('ada_kerusakan', true)->count();
        $waspada = (clone $query)->where('terdampak', true)->where('ada_kerusakan', false)->count();
        $aman = (clone $query)->where('terdampak', false)->where('ada_kerusakan', false)->count();

        return response()->json([
            'success' => true,
            'data' => [
                'total' => $total,
                'aman' => $aman,
                'waspada' => $waspada,
                'bahaya' => $bahaya,
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
                'no_hp' => $data->user?->user_hp,
                'foto' => $data->foto
                    ? asset('storage/' . $data->foto)
                    : null,
            ],
        ]);
    }
}
