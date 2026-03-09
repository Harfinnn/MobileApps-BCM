<?php

namespace App\Services;

use Google\Client as GoogleClient;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use App\Models\User;

class FcmService
{
    /**
     * Ambil OAuth Access Token Firebase
     */
    protected static function getAccessToken()
    {
        $client = new GoogleClient();

        $client->setAuthConfig(
            base_path(config('services.firebase.credentials'))
        );

        $client->addScope(
            'https://www.googleapis.com/auth/firebase.messaging'
        );

        $token = $client->fetchAccessTokenWithAssertion();

        return $token['access_token'];
    }

    /**
     * Kirim Notifikasi ke 1 device
     */
    public static function send(
        string $fcmToken,
        string $title,
        string $body,
        array $data = []
    ) {
        try {

            $accessToken = self::getAccessToken();

            // 🔒 semua data harus string
            $safeData = [];

            foreach ($data as $key => $value) {
                $safeData[$key] = (string) $value;
            }

            $response = Http::withToken($accessToken)
                ->post(
                    'https://fcm.googleapis.com/v1/projects/' .
                    config('services.firebase.project_id') .
                    '/messages:send',
                    [
                        'message' => [

                            'token' => $fcmToken,

                            'data' => array_merge($safeData, [
                                'title' => $title,
                                'body' => $body,
                            ]),

                            'android' => [
                                'priority' => 'HIGH',
                            ],

                        ],
                    ]
                );

            if ($response->failed()) {

                Log::error('FCM FAILED', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);

                $bodyResponse = $response->json();

                // 🔥 token invalid
                if (
                    isset($bodyResponse['error']['details'][0]['errorCode']) &&
                    $bodyResponse['error']['details'][0]['errorCode'] === 'UNREGISTERED'
                ) {

                    User::where('fcm_token', $fcmToken)
                        ->update(['fcm_token' => null]);

                }
            }

        } catch (\Throwable $e) {

            Log::error('FCM ERROR', [
                'message' => $e->getMessage()
            ]);

        }
    }

    /**
     * Kirim ke user tertentu
     */
    public static function sendToUser(
        User $user,
        string $title,
        string $body,
        array $data = []
    ) {

        if (!$user->fcm_token) {
            return;
        }

        self::send(
            $user->fcm_token,
            $title,
            $body,
            $data
        );
    }

    /**
     * Kirim ke semua user
     */
    public static function sendToAll(
        string $title,
        string $body,
        array $data = []
    ) {

        $users = User::whereNotNull('fcm_token')->get();

        foreach ($users as $user) {

            self::send(
                $user->fcm_token,
                $title,
                $body,
                $data
            );

        }

    }
}