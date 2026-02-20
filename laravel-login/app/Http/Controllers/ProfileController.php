<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

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
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $request->validate([
            'user_nama' => 'required|string|max:100',
            'user_hp' => 'required|string|max:15',
            'user_foto' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        // FOTO
        if ($request->hasFile('user_foto')) {

            $file = $request->file('user_foto');

            $filename = time() . '_' . $file->getClientOriginalName();

            // pastikan folder ada
            $destinationPath = public_path('storage/profile');

            if (!file_exists($destinationPath)) {
                mkdir($destinationPath, 0755, true);
            }

            $file->move($destinationPath, $filename);

            // simpan path relatif ke DB
            $user->user_foto = 'profile/' . $filename;
        }

        $user->user_nama = $request->user_nama;
        $user->user_hp = $request->user_hp;
        $user->save();

        return response()->json([
            'message' => 'Profile berhasil diperbarui'
        ]);
    }

}
