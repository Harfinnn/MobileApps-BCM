<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Helpers\PasswordHelper;
use Carbon\Carbon;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required',
            'password' => 'required',
            'human_verified' => 'required|boolean',
        ]);

        if (!$request->boolean('human_verified')) {
            return response()->json([
                'message' => 'Verifikasi manusia gagal'
            ], 422);
        }

        // ✅ CARI USER
        $user = User::where('user_uname', $request->username)->first();

        if (!$user) {
            return response()->json([
                'message' => 'Username atau password salah'
            ], 401);
        }

        if ((int) $user->user_status !== 1) {
            return response()->json([
                'message' => 'Akun Anda tidak aktif.'
            ], 403);
        }

        if ($user->isLocked()) {
            return response()->json([
                'message' => 'Akun terkunci sementara.'
            ], 423);
        }

        // CEK PASSWORD
        $hashedInput = PasswordHelper::encrypt($request->password);

        if ($hashedInput !== $user->user_pswd) {
            $user->increment('user_salah');
            $user->refresh();

            if ($user->user_salah >= 5) {
                $user->update(['user_salah_wkt' => Carbon::now()]);
                return response()->json([
                    'message' => 'Akun dikunci sementara.'
                ], 423);
            }

            return response()->json([
                'message' => 'Username atau password salah'
            ], 401);
        }

        // RESET SALAH LOGIN
        $user->update([
            'user_salah' => 0,
            'user_salah_wkt' => null,
            'user_last_login' => now()->format('Y-m-d'),
        ]);

        // BUAT TOKEN
        $token = $user->createToken('mobile-token')->plainTextToken;

        // 🔥 LOAD RELATION SETELAH USER PASTI ADA
        $user->load('jabatan', 'selindo');

        return response()->json([
            'user' => $user,
            'token' => $token,
        ]);
    }

    /**
     * GET CURRENT USER (SAFE)
     */
    public function me(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 401);
        }

        $user->load('jabatan', 'selindo');

        return response()->json([
            'user' => $user
        ]);
    }
}
