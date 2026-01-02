<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Helpers\PasswordHelper;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        // 1️⃣ VALIDASI INPUT + HUMAN NONCE
        $request->validate([
            'username' => 'required',
            'password' => 'required',
            'human_nonce' => 'required|numeric', // ⬅️ BARU
        ]);

        // 2️⃣ HUMAN CHECK (ANTI BOT)
        // Frontend menunggu ±2 detik sebelum submit
        $elapsedSeconds = time() - intval($request->human_nonce / 1000);

        if ($elapsedSeconds < 2) {
            return response()->json([
                'message' => 'Verifikasi manusia gagal'
            ], 422);
        }

        // 3️⃣ CARI USER
        $user = User::where('user_uname', $request->username)->first();

        if (!$user) {
            return response()->json([
                'message' => 'Username atau password salah'
            ], 401);
        }

        // 4️⃣ CEK PASSWORD (LEGACY AMAN)
        $hashedInput = PasswordHelper::encrypt($request->password);

        if ($hashedInput !== $user->user_pswd) {
            return response()->json([
                'message' => 'Username atau password salah'
            ], 401);
        }

        // 5️⃣ CEK STATUS USER
        if ($user->user_status != 1) {
            return response()->json([
                'message' => 'Akun tidak aktif'
            ], 403);
        }

        // 6️⃣ BUAT TOKEN
        $token = $user->createToken('mobile-token')->plainTextToken;

        // 7️⃣ UPDATE LAST LOGIN
        $user->update([
            'user_last_login' => now()->format('Y-m-d')
        ]);

        return response()->json([
            'user' => $user,
            'token' => $token
        ]);
    }

    // REGISTER TIDAK PERLU HUMAN CHECK
    public function register(Request $request)
    {
        $request->validate([
            'nama' => 'required|string|max:100',
            'username' => 'required|string|max:100|unique:user,user_uname',
            'password' => 'required|min:6',
            'hp' => 'required|string|max:15',
        ]);

        $user = User::create([
            'user_nama' => $request->nama,
            'user_uname' => $request->username,
            'user_pswd' => PasswordHelper::encrypt($request->password),
            'user_hp' => $request->hp,

            'user_status' => 1,
            'user_jabatan' => 0,
            'user_salah' => 0,
            'user_salah_wkt' => '',
            'user_last_login' => '',
            'user_foto' => '',
            'user_selindo' => 0,
            'user_rta' => 0,
            'user_bia' => 0,
            'user_drp' => 0,
            'user_kegiatan' => 0,
            'user_insiden' => 0,
        ]);

        return response()->json([
            'message' => 'Registrasi berhasil',
            'user' => $user
        ], 201);
    }
}
