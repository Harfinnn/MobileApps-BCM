<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\MJaringanSelindo;
use Illuminate\Http\Request;

class MJaringanSelindoController extends Controller
{
    /**
     * GET /api/selindo
     * list data selindo
     */
    public function index(Request $request)
    {
        $jenis = $request->query('jenis'); // contoh: ?jenis[]=1&jenis[]=2
        $withLocation = $request->boolean('with_location', false);

        $query = MJaringanSelindo::active()
            ->jenis($jenis);

        if ($withLocation) {
            $query->withLocation();
        }

        return response()->json([
            'success' => true,
            'data' => $query
                ->orderBy('mjs_nama')
                ->get(),
        ]);
    }

    /**
     * GET /api/selindo/{id}
     * detail satu lokasi
     */
    public function show($id)
    {
        $data = MJaringanSelindo::active()
            ->where('mjs_id', $id)
            ->first();

        if (!$data) {
            return response()->json([
                'success' => false,
                'message' => 'Data tidak ditemukan',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $data,
        ]);
    }

    /**
     * GET /api/selindo/search?q=
     * pencarian cepat (dropdown)
     */
    public function search(Request $request)
    {
        $q = $request->query('q');

        if (!$q) {
            return response()->json([
                'success' => true,
                'data' => [],
            ]);
        }

        return response()->json([
            'success' => true,
            'data' => MJaringanSelindo::active()
                ->where('mjs_nama', 'like', "%{$q}%")
                ->orderBy('mjs_nama')
                ->limit(20)
                ->get(),
        ]);
    }
}
