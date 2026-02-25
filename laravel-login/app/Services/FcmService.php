<?php

namespace App\Services;

use Google\Client as GoogleClient;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use App\Models\User;

class FcmService
{
    protected static function getAccessToken()
    {
        try {
            $client = new GoogleClient();
            $client->setAuthConfig(
                base_path(config('services.firebase.credentials'))
            );
            $client->addScope(
                'https://www.googleapis.com/auth/firebase.messaging'
            );

            $token = $client->fetchAccessTokenWithAssertion();

            return $token['access_token'] ?? null;

        } catch (\Exception $e) {

            Log::error('FCM TOKEN ERROR', [
                'error' => $e->getMessage()
            ]);

            return null;
        }
    }

    public static function send(
        string $fcmToken,
        string $title,
        string $body,
        array $data = []
    ) {
        try {

            $accessToken = self::getAccessToken();

            if (!$accessToken) {
                Log::error('FCM ACCESS TOKEN NULL');
                return;
            }

            // Semua data harus string
            $safeData = [];
            foreach ($data as $key => $value) {
                $safeData[$key] = (string) $value;
            }

            Log::info('FCM REQUEST', [
                'project_id' => config('services.firebase.project_id'),
                'token' => $fcmToken,
            ]);

            $response = Http::withToken($accessToken)->post(
                'https://fcm.googleapis.com/v1/projects/' .
                config('services.firebase.project_id') .
                '/messages:send',
                [
                    'message' => [
                        'token' => $fcmToken,

                        // 🔥 WAJIB ADA NOTIFICATION
                        'notification' => [
                            'title' => $title,
                            'body' => $body,
                        ],

                        // Data tambahan
                        'data' => $safeData,

                        'android' => [
                            'priority' => 'HIGH',
                            'notification' => [
                                'sound' => 'default',
                                'channel_id' => 'default',
                            ],
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

                // Token expired / logout
                if (
                    isset($bodyResponse['error']['details'][0]['errorCode']) &&
                    $bodyResponse['error']['details'][0]['errorCode'] === 'UNREGISTERED'
                ) {
                    User::where('fcm_token', $fcmToken)
                        ->update(['fcm_token' => null]);
                }

            } else {

                Log::info('FCM SUCCESS', [
                    'status' => $response->status(),
                ]);
            }

        } catch (\Exception $e) {

            Log::error('FCM EXCEPTION', [
                'error' => $e->getMessage(),
            ]);
        }
    }
}