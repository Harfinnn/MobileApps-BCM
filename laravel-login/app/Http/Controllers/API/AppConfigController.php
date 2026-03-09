<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\MLabel;

class AppConfigController extends Controller
{
    private $basePath = 'https://lensasyariah.com/simple_app/api/storage/app/public/';

    public function index()
    {
        $config = MLabel::where('mla_status', 1)->first();

        if ($config) {
            if ($config->mla_logo) {
                $config->mla_logo = $this->basePath . $config->mla_logo;
            }

            if ($config->mla_logo_perusahaan) {
                $config->mla_logo_perusahaan = $this->basePath . $config->mla_logo_perusahaan;
            }
        }

        return response()->json([
            'success' => true,
            'data' => $config
        ]);
    }

    public function update(Request $request)
    {
        $user = auth()->user();

        if (!$user || $user->user_jabatan != 1) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $request->validate([
            'mla_logo' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'mla_logo_perusahaan' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'mla_nama_aplikasi' => 'nullable|string|max:100',
            'mla_keterangan' => 'nullable|string',
            'mla_fitur' => 'nullable|string',
            'mla_nama_perusahaan' => 'nullable|string|max:100',
            'mla_tahun' => 'nullable|string|max:4',
            'mla_sign' => 'nullable|string|max:100',
            'mla_versi' => 'nullable|string|max:20',
        ]);

        $config = MLabel::where('mla_status', 1)->first();

        if (!$config) {
            return response()->json([
                'success' => false,
                'message' => 'Config not found'
            ], 404);
        }

        /*
        |--------------------------------------------------------------------------
        | Update Logo Utama
        |--------------------------------------------------------------------------
        */
        if ($request->hasFile('mla_logo')) {

            if ($config->mla_logo &&
                Storage::disk('public')->exists($config->mla_logo)) {
                Storage::disk('public')->delete($config->mla_logo);
            }

            $path = $request->file('mla_logo')
                            ->store('logo', 'public');

            $config->mla_logo = $path;
        }

        /*
        |--------------------------------------------------------------------------
        | Update Logo Perusahaan
        |--------------------------------------------------------------------------
        */
        if ($request->hasFile('mla_logo_perusahaan')) {

            if ($config->mla_logo_perusahaan &&
                Storage::disk('public')->exists($config->mla_logo_perusahaan)) {
                Storage::disk('public')->delete($config->mla_logo_perusahaan);
            }

            $path = $request->file('mla_logo_perusahaan')
                            ->store('logoPerusahaan', 'public');

            $config->mla_logo_perusahaan = $path;
        }

        /*
        |--------------------------------------------------------------------------
        | Update Field Lain
        |--------------------------------------------------------------------------
        */
        $fields = [
            'mla_nama_aplikasi',
            'mla_keterangan',
            'mla_fitur',
            'mla_nama_perusahaan',
            'mla_tahun',
            'mla_sign',
            'mla_versi',
        ];

        foreach ($fields as $field) {
            if ($request->has($field)) {
                $config->$field = $request->input($field);
            }
        }

        $config->save();

        /*
        |--------------------------------------------------------------------------
        | Return Full URL (KONSISTEN)
        |--------------------------------------------------------------------------
        */
        if ($config->mla_logo) {
            $config->mla_logo = $this->basePath . $config->mla_logo;
        }

        if ($config->mla_logo_perusahaan) {
            $config->mla_logo_perusahaan = $this->basePath . $config->mla_logo_perusahaan;
        }

        return response()->json([
            'success' => true,
            'data' => $config
        ]);
    }
}