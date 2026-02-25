<?php

namespace App\Helpers;

use App\Models\User;

class NotificationHelper
{
    public static function getReceivers(User $sender): array
    {
        // ❌ Jika pengirim adalah Super Admin → tidak kirim notif
        if ((int) $sender->user_jabatan === 1) {
            return [];
        }

        // ✅ Kirim ke semua Super Admin aktif
        return User::where('user_status', 1)   // akun aktif
            ->where('user_jabatan', 1)        // Super Admin
            ->pluck('user_id')
            ->toArray();
    }
}