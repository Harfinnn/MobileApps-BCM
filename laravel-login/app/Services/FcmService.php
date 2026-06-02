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
        $client->setAuthConfig(base_path(config('services.firebase.credentials')));
        $client->addScope('https://www.googleapis.com/auth/firebase.messaging');

        $token = $client->fetchAccessTokenWithAssertion();

        return $token['access_token'];
    }

    /**
     * Kirim Notifikasi ke 1 FCM Token
     */
    public static function send(
    string $fcmToken,
    string $title,
    string $body,
    array $data = [],
    $userId = null 
) {
        
        $accessToken = self::getAccessToken();
        Log::info('SEND FCM', [
            'user_id' => $userId,
            'token' => $fcmToken,
            'title' => $title,
        ]);

        // ðŸ”’ FCM WAJIB DATA STRING
        $safeData = [];
        foreach ($data as $key => $value) {
            $safeData[$key] = (string) $value;
        }

        $response = null;

        for ($i = 0; $i < 3; $i++) {
            try {
                $response = Http::timeout(5)->retry(1, 100)
                    ->withToken($accessToken)
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
                                    'type' => $safeData['type'] ?? 'unknown',
                                ]),
                                'android' => [
                                    'priority' => 'HIGH',
                                ],
                            ],
                        ]
                    );
        
                if ($response->successful()) break;
        
            } catch (\Exception $e) {
                Log::error('FCM EXCEPTION', [
                    'error' => $e->getMessage(),
                ]);
            }
        
            sleep(1);
        }
        
        if (!$response) {
            Log::error('FCM NO RESPONSE', [
                'user_id' => $userId,
                'token' => $fcmToken,
            ]);
            return;
        }
        
        Log::info('FCM RESPONSE', [
            'status' => $response->status(),
            'body' => $response->body(),
        ]);
        
        if ($response->successful()) {
            Log::info('FCM SUCCESS', [
                'user_id' => $userId,
                'token' => $fcmToken,
            ]);
        }


        if ($response->failed()) {
            $bodyResponse = $response->json();
        
            if (isset($bodyResponse['error']['details'][0]['errorCode'])) {
        
                $errorCode = $bodyResponse['error']['details'][0]['errorCode'];
        
                if ($errorCode === 'UNREGISTERED' || $errorCode === 'INVALID_ARGUMENT') {
                    User::where('fcm_token', $fcmToken)
                        ->update(['fcm_token' => null]);
                }
            }
        
            Log::error('FCM FAILED', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);
        }
    }

    /**
     * Kirim Notifikasi ke User Tertentu
     */
    public static function sendToUser(
        User $user,
        string $title,
        string $body,
        array $data = []
    ) {
        if (!$user->fcm_token)
            return;

        self::send($user->fcm_token, $title, $body, $data);
    }

    /**
     * Kirim Notifikasi ke Role/Jabatan Tertentu
     */
    public static function sendToRole(
        int $jabatan,
        string $title,
        string $body,
        array $data = []
    ) {
        $users = User::where('user_jabatan', $jabatan)
            ->whereNotNull('fcm_token')
            ->get();

        foreach ($users as $user) {
            self::send($user->fcm_token, $title, $body, $data);
        }
    }

    /**
     * Kirim Notifikasi ke Semua User
     */
    public static function sendToAll(
        string $title,
        string $body,
        array $data = []
    ) {
        $users = User::whereNotNull('fcm_token')
    ->where('fcm_token', '!=', '')
    ->get();

        foreach ($users as $user) {
            self::send($user->fcm_token, $title, $body, $data);
        }
    }
    
        public static function sendToTopic(
        string $topic,
        string $title,
        string $body,
        array $data = []
    ) {
        $accessToken = self::getAccessToken();
    
        $safeData = [];
        foreach ($data as $key => $value) {
            $safeData[$key] = (string) $value;
        }
    
        $response = null;

        for ($i = 0; $i < 3; $i++) {
            try {
                $response = Http::timeout(5)->retry(1, 100)
                    ->withToken($accessToken)
                    ->post(
                        'https://fcm.googleapis.com/v1/projects/' .
                        config('services.firebase.project_id') .
                        '/messages:send',
                        [
                            'message' => [
                                'topic' => $topic, // ✅ FIX
                                'data' => array_merge($safeData, [
                                    'title' => $title,
                                    'body' => $body,
                                    'type' => $safeData['type'] ?? 'unknown',
                                ]),
                                'android' => [
                                    'priority' => 'HIGH',
                                ],
                            ],
                        ]
                    );
        
                if ($response->successful()) break;
        
            } catch (\Exception $e) {
                Log::error('FCM TOPIC EXCEPTION', [
                    'error' => $e->getMessage(),
                ]);
            }
        
            sleep(1);
        }
        
        if (!$response) {
            Log::error('FCM TOPIC NO RESPONSE', [
                'topic' => $topic,
            ]);
            return;
        }
        
        if ($response->successful()) {
            Log::info('FCM TOPIC SUCCESS', [
                'topic' => $topic,
                'title' => $title,
            ]);
        }
        
        Log::info('FCM TOPIC RESPONSE', [
            'topic' => $topic,
            'status' => $response->status(),
            'body' => $response->body(),
        ]);
        
    }
}