<?php

namespace App\Services\AIProvider;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GroqProvider implements AIProviderInterface
{
    // =====================================
    // JSON MODE
    // UNTUK: INTENT / PARAMETER EXTRACTION
    // =====================================

    public function chatJson(array $messages): ?string
    {
        try {

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . env('GROQ_API_KEY'),
                'Content-Type' => 'application/json',
            ])->post(
                'https://api.groq.com/openai/v1/chat/completions',
                [
                    'model' => env(
                        'GROQ_MODEL',
                        'openai/gpt-oss-20b'
                    ),

                    'response_format' => [
                        'type' => 'json_object'
                    ],

                    'temperature' => 0.1,

                    'messages' => $messages
                ]
            );

            if (!$response->successful()) {

                Log::error('GROQ JSON FAILED', [
                    'status' => $response->status(),
                    'body' => $response->body()
                ]);

                return null;
            }

            return $response->json()['choices'][0]['message']['content'] ?? null;

        } catch (\Exception $e) {

            Log::error('GROQ JSON ERROR', [
                'error' => $e->getMessage()
            ]);

            return null;
        }
    }

    // =====================================
    // TEXT MODE
    // UNTUK: ANALISA / SUMMARY / CHAT
    // =====================================

    public function chatText(array $messages): ?string
    {
        try {

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . env('GROQ_API_KEY'),
                'Content-Type' => 'application/json',
            ])->post(
                'https://api.groq.com/openai/v1/chat/completions',
                [
                    'model' => env(
                        'GROQ_MODEL',
                        'openai/gpt-oss-20b'
                    ),

                    'temperature' => 0.4,

                    'messages' => $messages
                ]
            );

            if (!$response->successful()) {

                Log::error('GROQ TEXT FAILED', [
                    'status' => $response->status(),
                    'body' => $response->body()
                ]);

                return null;
            }

            return $response->json()['choices'][0]['message']['content'] ?? null;

        } catch (\Exception $e) {

            Log::error('GROQ TEXT ERROR', [
                'error' => $e->getMessage()
            ]);

            return null;
        }
    }
}