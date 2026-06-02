<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use App\Services\FcmService;

class UserController extends Controller
{
    public function index()
    {
        return response()->json(User::all());
    }

    public function disable($id)
    {
        $user = User::findOrFail($id);

        $user->update([
            'user_status' => 0
        ]);

        FcmService::sendToUser(
            $user,
            'Sesi Berakhir',
            'Akun Anda telah dinonaktifkan oleh administrator.',
            [
                'type' => 'force_logout'
            ]
        );

        return response()->json([
            'success' => true,
            'message' => 'User berhasil dinonaktifkan'
        ]);
    }

    public function updateFcmToken(Request $request)
    {
        $request->validate([
            'fcm_token' => 'required|string',
        ]);

        $user = auth()->user();

        if (!$user) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 401);
        }

        $user->fcm_token = $request->fcm_token;
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'FCM token updated'
        ]);
    }


    public function store(Request $request)
    {
        $user = User::create($request->all());
        return response()->json($user, 201);
    }
}
