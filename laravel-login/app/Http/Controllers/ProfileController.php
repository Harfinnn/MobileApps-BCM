<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
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
        ]);

        // 🔥 HANDLE FOTO
        if ($request->hasFile('user_foto')) {

            // hapus foto lama jika ada
            if ($user->user_foto) {
                Storage::disk('public')->delete($user->user_foto);
            }

            // simpan foto baru
            $path = $request->file('user_foto')->store('profile', 'public');
            $user->user_foto = $path;
        }

        // 🔥 UPDATE DATA
        $user->update([
            'user_nama' => $request->user_nama,
            'user_hp' => $request->user_hp,
        ]);

        return response()->json([
            'message' => 'Profile berhasil diperbarui',
            'user' => [
                'user_id' => $user->user_id,
                'user_nama' => $user->user_nama,
                'user_hp' => $user->user_hp,
                'user_foto' => $user->user_foto
                    ? asset('storage/' . $user->user_foto)
                    : null,
            ],
        ]);
    }

}
