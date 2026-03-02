<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\MLabel;

class AppConfigController extends Controller
{
    public function index()
    {
        $config = MLabel::where('mla_status', 1)->first();

        if ($config && $config->mla_logo) {
            $config->mla_logo = url('storage/' . $config->mla_logo);
        }

        return response()->json([
            'success' => true,
            'data' => $config
        ]);
    }

    public function update(Request $request)
    {
        \Log::info('UPDATE ROUTE TERPANGGIL');
        $user = auth()->user();

        if ($user->user_jabatan != 1) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $request->validate([
            'mla_logo' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'mla_keterangan' => 'nullable|string',
            'mla_fitur' => 'nullable|string',
            'mla_nama_perusahaan' => 'nullable|string',
            'mla_tahun' => 'nullable|string|max:4',
            'mla_sign' => 'nullable|string',
            'mla_versi' => 'nullable|string|max:20',
        ]);

        $config = MLabel::where('mla_status', 1)->first();

        if (!$config) {
            return response()->json([
                'success' => false,
                'message' => 'Config not found'
            ], 404);
        }

        if ($request->hasFile('mla_logo')) {

            if ($config->mla_logo && Storage::disk('public')->exists($config->mla_logo)) {
                Storage::disk('public')->delete($config->mla_logo);
            }

            $path = $request->file('mla_logo')->store('logo', 'public');

            $config->mla_logo = $path;
        }

        $config->mla_keterangan = $request->input('mla_keterangan');
        $config->mla_fitur = $request->input('mla_fitur');
        $config->mla_nama_perusahaan = $request->input('mla_nama_perusahaan');
        $config->mla_tahun = $request->input('mla_tahun');
        $config->mla_sign = $request->input('mla_sign');
        $config->mla_versi = $request->input('mla_versi');

        $config->save();

        return response()->json([
            'success' => true,
            'data' => $config
        ]);
    }
}