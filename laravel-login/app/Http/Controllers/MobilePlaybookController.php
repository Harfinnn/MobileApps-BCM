<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\MobilePlaybook;

class MobilePlaybookController extends Controller
{
    // ✅ GET LIST (UNTUK APP)
    public function index()
    {
        $data = MobilePlaybook::where('is_active', 1)
            ->orderBy('order_no')
            ->get();

        return response()->json([
            'status' => true,
            'data' => $data
        ]);
    }

    // ✅ GET DETAIL
    public function show($id)
    {
        $data = MobilePlaybook::find($id);

        if (!$data) {
            return response()->json([
                'status' => false,
                'message' => 'Data tidak ditemukan'
            ], 404);
        }

        return response()->json([
            'status' => true,
            'data' => $data
        ]);
    }

    // ✅ CREATE (ADMIN)
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required',
            'url' => 'required|url',
            'thumbnail' => 'nullable|url',
        ]);

        $data = MobilePlaybook::create([
            'title' => $request->title,
            'url' => $request->url,
            'thumbnail' => $request->thumbnail,
            'is_active' => $request->is_active ?? 1,
            'order_no' => $request->order_no ?? 0,
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Berhasil ditambahkan',
            'data' => $data
        ]);
    }

    // ✅ UPDATE (ADMIN)
    public function update(Request $request, $id)
    {
        $data = MobilePlaybook::find($id);

        if (!$data) {
            return response()->json([
                'status' => false,
                'message' => 'Data tidak ditemukan'
            ], 404);
        }

        $data->update([
            'title' => $request->title ?? $data->title,
            'url' => $request->url ?? $data->url,
            'thumbnail' => $request->thumbnail ?? $data->thumbnail,
            'is_active' => $request->is_active ?? $data->is_active,
            'order_no' => $request->order_no ?? $data->order_no,
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Berhasil diupdate',
            'data' => $data
        ]);
    }

    // ✅ DELETE
    public function destroy($id)
    {
        $data = MobilePlaybook::find($id);

        if (!$data) {
            return response()->json([
                'status' => false,
                'message' => 'Data tidak ditemukan'
            ], 404);
        }

        $data->delete();

        return response()->json([
            'status' => true,
            'message' => 'Berhasil dihapus'
        ]);
    }
}