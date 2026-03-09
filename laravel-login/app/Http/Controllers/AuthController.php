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

        if ((int) $user->user_status !== 1) {
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
}