<?php

namespace App\Helpers;

use App\Models\User;

class NotificationHelper
{
    public static function getReceivers(User $sender): array
    {
        // user_status:
        // 1 = Super Administrator
        // 3 = Viewer
        // 4 = Unit Kerja
        // 5 = Pengelola Gedung


        // Pastikan akun pengirim aktif
        if ((int) $sender->user_status !== 1) {
            return [];
        }

        // Role yang BOLEH mengirim notif
        $allowedSenderJabatan = [3, 4, 5]; // Viewer, Unit Kerja, Pengelola Gedung

        if (!in_array((int) $sender->user_jabatan, $allowedSenderJabatan, true)) {
            return [];
        }

        // Semua notif dikirim ke Super Administrator
        return User::where('user_status', 1)          // akun aktif
            ->where('user_jabatan', 1)               // Super Administrator
            ->pluck('user_id')
            ->toArray();
    }
}
