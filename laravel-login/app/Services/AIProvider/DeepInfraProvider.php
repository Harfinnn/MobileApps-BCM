<?php

namespace App\Services\AIProvider;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class DeepInfraProvider implements AIProviderInterface
{
    // =====================================
    // JSON MODE
    // =====================================

    public function chatJson(array $messages): ?string
    {
        try {

            $response = Http::timeout(120)
                ->withHeaders([
                    'Authorization' => 'Bearer ' . env('DEEPINFRA_API_KEY'),
                    'Content-Type' => 'application/json',
                ])
                ->post(
                    'https://api.deepinfra.com/v1/openai/chat/completions',
                    [

                        'model' => env(
                            'DEEPINFRA_MODEL',
                            'openai/gpt-oss-120b'
                        ),

                        'response_format' => [
                            'type' => 'json_object'
                        ],

                        'temperature' => 0.1,

                        'messages' => $messages
                    ]
                );

            // =====================================
            // DEBUG LOG
            // =====================================

            Log::info('DEEPINFRA JSON RESPONSE', [

                'status' => $response->status(),

                'body' => $response->json()
            ]);

            if (!$response->successful()) {

                Log::error('DEEPINFRA JSON FAILED', [

                    'status' => $response->status(),

                    'body' => $response->body()
                ]);

                return null;
            }

            return $response->json()['choices'][0]['message']['content']
                ?? null;

        } catch (\Exception $e) {

            Log::error('DEEPINFRA JSON ERROR', [

                'error' => $e->getMessage()
            ]);

            return null;
        }
    }

    // =====================================
    // TEXT MODE
    // =====================================

    public function chatText(array $messages): ?string
    {
        try {

            $response = Http::timeout(120)
                ->withHeaders([
                    'Authorization' => 'Bearer ' . env('DEEPINFRA_API_KEY'),
                    'Content-Type' => 'application/json',
                ])
                ->post(
                    'https://api.deepinfra.com/v1/openai/chat/completions',
                    [

                        'model' => env(
                            'DEEPINFRA_MODEL',
                            'openai/gpt-oss-120b'
                        ),

                        'temperature' => 0.3,

                        'messages' => $messages
                    ]
                );

            // =====================================
            // DEBUG LOG
            // =====================================

            Log::info('DEEPINFRA TEXT RESPONSE', [

                'status' => $response->status(),

                'body' => $response->json()
            ]);

            if (!$response->successful()) {

                Log::error('DEEPINFRA TEXT FAILED', [

                    'status' => $response->status(),

                    'body' => $response->body()
                ]);

                return null;
            }

            return $response->json()['choices'][0]['message']['content']
                ?? null;

        } catch (\Exception $e) {

            Log::error('DEEPINFRA TEXT ERROR', [

                'error' => $e->getMessage()
            ]);

            return null;
        }
    }
}