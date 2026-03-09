<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class CheckUserStatus
{
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();

        Log::info('CheckUserStatus middleware triggered', [
            'user_id' => $user?->user_id,
            'user_status' => $user?->user_status
        ]);

        if ($user && $user->user_status != 1) {

            Log::warning('User status not active', [
                'user_id' => $user->user_id,
                'status' => $user->user_status
            ]);

            if ($user->currentAccessToken()) {
                Log::info('Deleting current access token', [
                    'token_id' => $user->currentAccessToken()->id
                ]);

                $user->currentAccessToken()->delete();
            }

            return response()->json([
                'message' => 'Akun tidak aktif'
            ], 403);
        }

        return $next($request);
    }
}