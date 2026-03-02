<?php

namespace App\Helpers;

use App\Models\User;

class NotificationHelper
{
    public static function getReceivers(User $sender): array
{
    if ((int) $sender->user_status !== 1) {
        return [];
    }

    return User::where('user_status', 1)
        ->where('user_jabatan', 1)
        ->pluck('user_id')
        ->toArray();
}
}