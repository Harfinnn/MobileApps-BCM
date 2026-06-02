<?php

namespace App\Helpers;

class ChatHelper
{
    // =====================================
    // GREETING
    // =====================================

    public static function isGreeting(string $message): bool
    {
        $message = self::normalize($message);

        $keywords = [

            'halo',
            'hai',
            'hi',
            'hello',

            'pagi',
            'selamat pagi',

            'siang',
            'selamat siang',

            'sore',
            'selamat sore',

            'malam',
            'selamat malam',

            'assalamualaikum',

            'test',
            'tes',
            'ping',
        ];

        return in_array($message, $keywords);
    }

    public static function greetingReply(): string
    {
        return 'Halo, ada yang bisa saya bantu terkait operasional BCM24 hari ini?';
    }

    // =====================================
    // THANKS
    // =====================================

    public static function isThanks(string $message): bool
    {
        $message = self::normalize($message);

        $keywords = [

            'makasih',
            'terima kasih',
            'thanks',
            'thank you',
            'sip',
            'mantap',
            'nice',
            'good',
            'ok makasih',
        ];

        return in_array($message, $keywords);
    }

    public static function thanksReply(): string
    {
        return 'Sama-sama. Jika ada kebutuhan analisa operasional atau monitoring lainnya, silakan tanyakan.';
    }

    // =====================================
    // CONFIRMATION
    // =====================================

    public static function isConfirmation(string $message): bool
    {
        $message = self::normalize($message);

        $keywords = [

            'oke',
            'ok',
            'siap',
            'baik',
            'iya',
            'ya',
            'y',
        ];

        return in_array($message, $keywords);
    }

    public static function confirmationReply(): string
    {
        return 'Baik.';
    }

    // =====================================
    // FAREWELL
    // =====================================

    public static function isFarewell(string $message): bool
    {
        $message = self::normalize($message);

        $keywords = [

            'bye',
            'dadah',
            'sampai jumpa',
            'selamat tinggal',
        ];

        return in_array($message, $keywords);
    }

    public static function farewellReply(): string
    {
        return 'Sampai jumpa.';
    }

    // =====================================
    // EMPTY
    // =====================================

    public static function isEmpty(?string $message): bool
    {
        return trim((string)$message) === '';
    }

    // =====================================
    // NORMALIZER
    // =====================================

    private static function normalize(string $message): string
    {
        return strtolower(trim($message));
    }
}