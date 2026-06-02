<?php

namespace App\Services\AI;

use App\Services\AIProvider\AIProviderInterface;

class IntentAIService
{
    protected $aiProvider;

    public function __construct(
        AIProviderInterface $aiProvider
    ) {
        $this->aiProvider = $aiProvider;
    }

    public function extract(
        string $systemPrompt,
        string $message
    ): ?array {

        $content = $this->aiProvider->chatJson([
            [
                'role' => 'system',
                'content' => $systemPrompt
            ],
            [
                'role' => 'user',
                'content' => $message
            ]
        ]);

        if (!$content) {
            return null;
        }

        $decoded = json_decode($content, true);

        if (!is_array($decoded)) {
            return null;
        }
        
        // =====================================
        // SANITIZER INTENT UMUM
        // =====================================
        
        if (($decoded['intent'] ?? null) === 'umum') {
        
            $decoded['parameters'] = [
        
                'is_compare' => false,
        
                'hari' => null,
                'hari_banding' => null,
        
                'hari_mulai' => null,
                'hari_akhir' => null,
        
                'bulan' => null,
                'bulan_banding' => null,
        
                'tahun' => null,
        
                'magnitudo' => null,
        
                'lokasi' => null,
                'nama_user' => null,
        
                'target_cob' => null,
                'operasi_cob' => null,
        
                'filter_kondisi' => null,
                'filter_nilai' => null,
        
                'kata_kunci_kendala' => null,
        
                'jenis_chart' => null,
        
                'jumlah_hari_prediksi' => null,
        
                'jumlah_bulan_bom' => null,
                'jumlah_bulan_eom' => null,
                'jumlah_bulan' => null,
        
                'kategori' => null
            ];
        }
        
        return $decoded;
    }
}