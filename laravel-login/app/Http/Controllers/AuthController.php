<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Helpers\PasswordHelper;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        Log::info('Login attempt', [
            'username' => $request->username
        ]);

        $request->validate([
            'username' => 'required',
            'password' => 'required',
            'human_verified' => 'required|boolean',
        ]);

        if (!$request->boolean('human_verified')) {
            Log::warning('Human verification failed');

            return response()->json([
                'message' => 'Verifikasi manusia gagal'
            ], 422);
        }

        $user = User::where('user_uname', $request->username)->first();

        if (!$user) {
            Log::warning('User not found', [
                'username' => $request->username
            ]);

            return response()->json([
                'message' => 'Username atau password salah'
            ], 401);
        }

        Log::info('User found', [
            'user_id' => $user->user_id,
            'status' => $user->user_status
        ]);

        // STATUS 2 → wajib ganti password
        if ((int) $user->user_status === 2) {

            Log::info('User must change password', [
                'user_id' => $user->user_id
            ]);

            return response()->json([
                'message' => 'Harus ganti password',
                'force_change_password' => true,
                'user_id' => $user->user_id
            ], 200);
        }

        // STATUS 0 → akun tidak aktif
        if ((int) $user->user_status === 0) {

            Log::warning('User inactive', [
                'user_id' => $user->user_id
            ]);

            return response()->json([
                'message' => 'Akun Anda tidak aktif.'
            ], 403);
        }

        if ($user->isLocked()) {
            Log::warning('User locked', [
                'user_id' => $user->user_id
            ]);

            return response()->json([
                'message' => 'Akun terkunci sementara.'
            ], 423);
        }

        $hashedInput = PasswordHelper::encrypt($request->password);

        if ($hashedInput !== $user->user_pswd) {

            Log::warning('Wrong password', [
                'user_id' => $user->user_id
            ]);

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

        Log::info('Login success', [
            'user_id' => $user->user_id
        ]);

        $user->update([
            'user_salah' => 0,
            'user_salah_wkt' => null,
            'user_last_login' => now()->format('Y-m-d'),
        ]);

        $token = $user->createToken('mobile-token')->plainTextToken;

        Log::info('Token created', [
            'user_id' => $user->user_id
        ]);

        $user->load('jabatan', 'selindo');

        return response()->json([
            'user' => $user,
            'token' => $token,
        ]);
    }

    public function me(Request $request)
    {
        $user = $request->user();

        Log::info('ME endpoint called', [
            'user_id' => $user?->user_id,
            'status' => $user?->user_status
        ]);

        if (!$user) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 401);
        }

        if ((int) $user->user_status !== 1) {

            Log::warning('User disabled during session', [
                'user_id' => $user->user_id
            ]);

            if ($user->currentAccessToken()) {
                $user->currentAccessToken()->delete();
            }

            return response()->json([
                'message' => 'Akun tidak aktif'
            ], 403);
        }

        $user->load('jabatan', 'selindo');

        return response()->json([
            'user' => $user
        ]);
    }

    public function firstChangePassword(Request $request)
    {
        $request->validate([
            'user_id' => 'required',
            'old_password' => 'required',
            'password' => [
                'required',
                'min:8',
                'confirmed',
                'regex:/[A-Z]/',      
                'regex:/[a-z]/',      
                'regex:/[0-9]/',      
                'regex:/[@$!%*#?&]/'  
            ]
        ], [
            'password.min' => 'Password minimal 8 karakter',
            'password.regex' => 'Password harus mengandung huruf besar, huruf kecil, angka, dan karakter spesial'
        ]);

        $user = User::find($request->user_id);

        if (!$user) {
            return response()->json([
                'message' => 'User tidak ditemukan'
            ], 404);
        }

        // cek password lama
        $oldPassword = PasswordHelper::encrypt($request->old_password);

        if ($oldPassword !== $user->user_pswd) {
            return response()->json([
                'message' => 'Password lama salah'
            ], 422);
        }

        if ($request->old_password === $request->password) {
            return response()->json([
                'message' => 'Password baru tidak boleh sama dengan password lama'
            ], 422);
        }

        // update password
        $user->user_pswd = PasswordHelper::encrypt($request->password);
        $user->user_status = 1;
        $user->save();

        return response()->json([
            'message' => 'Password berhasil diganti'
        ]);
    }
}