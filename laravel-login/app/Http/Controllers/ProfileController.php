<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class ProfileController extends Controller
{
    public function me(Request $request)
    {
        $user = $request->user();

        return response()->json(
            $user->load('jabatan', 'selindo')
        );
    }

    public function update(Request $request)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 401);
        }

        $request->validate([
            'user_nama' => 'required|string|max:100',
            'user_hp' => 'required|string|max:15',
            'user_foto' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ],[
            'user_nama.required' => 'Nama wajib diisi',
            'user_hp.required' => 'No HP wajib diisi',
            'user_foto.image' => 'File harus berupa gambar',
            'user_foto.mimes' => 'Format gambar harus jpg, jpeg, atau png',
            'user_foto.max' => 'Ukuran foto maksimal 2MB',
        ]);

        // Upload Foto
        if ($request->hasFile('user_foto')) {

            $file = $request->file('user_foto');

            $filename = time().'_'.Str::random(10).'.'.$file->getClientOriginalExtension();

            $destinationPath = public_path('storage/profile');

            if (!file_exists($destinationPath)) {
                mkdir($destinationPath, 0755, true);
            }

            // Hapus foto lama
            if ($user->user_foto) {
                $oldPath = public_path('storage/'.$user->user_foto);

                if (file_exists($oldPath)) {
                    unlink($oldPath);
                }
            }

            $file->move($destinationPath, $filename);

            $user->user_foto = 'profile/'.$filename;
        }

        $user->user_nama = $request->user_nama;
        $user->user_hp = $request->user_hp;
        $user->save();

        return response()->json([
            'message' => 'Profile berhasil diperbarui',
            'user' => $user->load('jabatan','selindo')
        ]);
    }
}