<?php

namespace App\Helpers;

class PasswordHelper
{
    public static function encrypt($password)
    {
        $kunci = sha1(md5(md5(md5(htmlspecialchars($password)))));
        return md5(md5($kunci) . md5('!2@kj30$%l0!hD&@#k0.\|d)&^.,;"&'));
    }
}
