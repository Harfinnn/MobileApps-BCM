<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Notification;

class NotificationController extends Controller
{
    /**
     * Ambil notifikasi user login
     */
    public function index()
    {
        $user = auth()->user();

        if (!$user) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 401);
        }

        $notifications = Notification::where('receiver_id', $user->user_id)
            ->orderByDesc('created_at')
            ->limit(20)
            ->get([
                'id',
                'title',
                'message',
                'is_read',
                'type',
                'reference_id',
                'created_at'
            ]);

        return response()->json([
            'success' => true,
            'data' => $notifications
        ]);
    }

    /**
     * Tandai notifikasi sebagai belum dibaca
     */

    public function unreadCount()
    {
        $user = auth()->user();

        $count = Notification::where('receiver_id', $user->user_id)
            ->where('is_read', false)
            ->count();

        return response()->json([
            'success' => true,
            'count' => $count,
        ]);
    }


    /**
     * Tandai notifikasi sebagai dibaca
     */
    public function markAsRead($id)
    {
        $user = auth()->user();

        $notif = Notification::where('id', $id)
            ->where('receiver_id', $user->user_id)
            ->first();

        if (!$notif) {
            return response()->json([
                'message' => 'Notifikasi tidak ditemukan'
            ], 404);
        }

        $notif->update(['is_read' => true]);

        return response()->json([
            'success' => true
        ]);
    }

    /**
     * Tandai notifikasi sebagai dibaca semua
     */
    public function markAllAsRead()
    {
        $user = auth()->user();

        Notification::where('receiver_id', $user->user_id)
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return response()->json([
            'success' => true,
            'message' => 'Semua notifikasi ditandai sudah dibaca',
        ]);
    }

}
