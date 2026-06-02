<?php

namespace App\Services\Chatbot;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;
use App\Services\Parser\DateParser;
use App\Services\Parser\CompareParser;
use App\Services\Parser\IntentRuleEngine;
use App\Services\Parser\TypoNormalizer;
use App\Services\AI\IntentAIService;
use App\Services\AI\Prompt\IntentPromptBuilder;
use App\Services\Chatbot\Validator\IntentValidator;
use App\Services\Parser\MonthParser;
use App\DTO\ParameterDTO;
use App\DTO\IntentResultDTO;



class IntentService
{
    protected $dateParser;
    protected $compareParser;
    protected $intentRuleEngine;
    protected $typoNormalizer;
    protected $intentAIService;
    protected $monthParser;
    protected $promptBuilder;
    protected $intentValidator;

    public function __construct(
        DateParser $dateParser,
        CompareParser $compareParser,
        IntentRuleEngine $intentRuleEngine,
        TypoNormalizer $typoNormalizer,
        IntentAIService $intentAIService,
        MonthParser $monthParser,
        IntentPromptBuilder $promptBuilder,
        IntentValidator $intentValidator
    ) {
        $this->dateParser = $dateParser;
        $this->compareParser = $compareParser;
        $this->intentRuleEngine = $intentRuleEngine;
        $this->typoNormalizer = $typoNormalizer;
        $this->intentAIService = $intentAIService;
        $this->monthParser = $monthParser;
        $this->promptBuilder = $promptBuilder;
        $this->intentValidator = $intentValidator;
    }
    
    private function finalize(IntentResultDTO $result): array
    {
        return $this->intentValidator
            ->validate($result)
            ->toArray();
    }
    
    private function removeNull(array $data): array
    {
        return array_filter($data, function ($v) {
            return $v !== null;
        });
    }

    public function detectIntent($message, $recentHistory = "")
    {
        // 1. Bersihkan pesan untuk membuat Kunci Cache (hilangkan spasi ganda & jadikan huruf kecil)
        $message = $this->typoNormalizer->normalize($message);
        $cleanMessage = strtolower(trim(preg_replace('/\s+/', ' ', $message)));
        
        // 2. Buat Kunci Cache unik berdasarkan pesan user dan riwayat percakapan
        $cacheKey = 'intent_detect_' . date('Ymd') . '_' . md5($cleanMessage . $recentHistory);
        
        $compareResult = $this->compareParser->parse($message);

        $dateResult = $this->dateParser->parse($message);
        
        $monthResult = $this->monthParser->parse($message);

        Log::info('MONTH PARSER RESULT', $monthResult);
        
        $ruleIntent = $this->intentRuleEngine->detect($message);
        
        Log::info('RULE ENGINE RESULT', [
            'result' => $ruleIntent
        ]);
        
        $isGenericChartOnly =

            ($ruleIntent['intent'] ?? null) === 'data_cob'
        
            &&
        
            empty($ruleIntent['parameters']['operasi_cob'])
        
            &&
        
            (
                ($ruleIntent['parameters']['jenis_chart'] ?? null)
                ===
                'umum'
            );
        
        if (
        
            $ruleIntent
        
            &&
        
            $ruleIntent['confidence'] >= 0.90
        
            &&
        
            !$isGenericChartOnly
        
        ) {
        
            $onlyGenericChart =
                ($ruleIntent['intent'] === 'data_cob')
                &&
                (
                    ($ruleIntent['parameters']['jenis_chart'] ?? null)
                    ===
                    'umum'
                );
        
            // =====================================
            // BIARKAN AI CONTEXT RESOLVER JALAN
            // =====================================
        
            if (!$onlyGenericChart) {
        
                $result = new IntentResultDTO(
        
                    $ruleIntent['intent'],
        
                    ParameterDTO::fromArray(
        
                        array_merge(
        
                            $ruleIntent['parameters'] ?? [],
        
                            $this->removeNull($dateResult),
                            $this->removeNull($monthResult),
                            $this->removeNull($compareResult)
                        )
                    )
                );
        
                return $this->finalize($result);
            }
        }

        // 3. Simpan pemahaman AI (Intent) ini ke dalam Cache
        return Cache::remember($cacheKey, 21600, function () use (
            $message, 
            $recentHistory, 
            $dateResult, 
            $monthResult, 
            $compareResult,
            $ruleIntent
            
            ) {
            
            $tanggalHariIni = date('Y-m-d');
            $namaHariIni = date('l'); 
            $bulanIni = date('Y-m');
            $tahunIni = date('Y');

            $detectedIntentHint = $ruleIntent['intent'] ?? null;
            
            Log::info('RECENT HISTORY DEBUG', [
                'history' => $recentHistory
            ]);

            $systemPrompt = $this->promptBuilder->build(
                $recentHistory,
                $tanggalHariIni,
                $namaHariIni,
                $bulanIni,
                $tahunIni,
                $detectedIntentHint
            );
            
            Log::info($systemPrompt);

            try {
                
               $decoded = $this->intentAIService->extract(
                    $systemPrompt,
                    $message
                );

                if ($decoded) {
            
                // =====================================
                // MERGE HASIL PARSER BACKEND
                // =====================================
                $decoded['parameters'] = array_merge(
            
                    $decoded['parameters'] ?? [],
            
                    $this->removeNull($dateResult),
                    $this->removeNull($monthResult),
                    $this->removeNull($compareResult)
                );
            
                Log::info('DATE PARSER RESULT', $dateResult);
            
                Log::info('AI INTENT FETCHED FROM API: ', $decoded);
                
                if (
                    ($decoded['intent'] ?? 'umum') === 'umum'
                    &&
                    !empty($recentHistory)
                ) {
                
                    $historyLower =
                        strtolower($recentHistory);
                
                    $messageLower =
                        strtolower($message);
                
                    // =====================================
                    // FOLLOW UP CHART DETECTOR
                    // =====================================
                
                    $isChartFollowUp =
                        str_contains($messageLower, 'grafik')
                        ||
                        str_contains($messageLower, 'chart')
                        ||
                        str_contains($messageLower, 'trend')
                        ||
                        str_contains($messageLower, 'visualisasi')
                        ||
                        str_contains($messageLower, 'buat grafik')
                        ||
                        str_contains($messageLower, 'grafiknya')
                        ||
                        str_contains($messageLower, 'tampilkan grafik');
                
                    // =====================================
                    // FOLLOW UP CHART RESOLVER
                    // =====================================
                
                    if (
                        $isChartFollowUp
                        &&
                        ($decoded['intent'] ?? 'umum')
                            ===
                            'umum'
                    ) {
                
                        // =====================================
                        // TOP RECURRING
                        // =====================================
                
                        if (
                            str_contains(
                                $historyLower,
                                'operation: top_recurring'
                            )
                        ) {
                
                            $decoded['intent']
                                = 'insiden_it';
                
                            $decoded['parameters']['operasi_cob']
                                = 'top_recurring';
                
                            $decoded['parameters']['jenis_chart']
                                = 'trend';
                
                            Log::info(
                                'FOLLOW UP CHART DETECTED',
                                $decoded
                            );
                        }
                
                        // =====================================
                        // DOWNTIME TREND
                        // =====================================
                
                        elseif (
                            str_contains(
                                $historyLower,
                                'operation: downtime_trend'
                            )
                        ) {
                
                            $decoded['intent']
                                = 'insiden_it';
                
                            $decoded['parameters']['operasi_cob']
                                = 'downtime_trend';
                
                            $decoded['parameters']['jenis_chart']
                                = 'trend';
                
                            Log::info(
                                'FOLLOW UP CHART DETECTED',
                                $decoded
                            );
                        }
                    }
                
                    // =====================================
                    // INTENT INHERITANCE
                    // =====================================
                
                    if (
                        str_contains(
                            $historyLower,
                            'intent: insiden_it'
                        )
                    ) {
                
                        $decoded['intent']
                            = 'insiden_it';
                    }
                
                    elseif (
                        str_contains(
                            $historyLower,
                            'intent: gempa'
                        )
                    ) {
                
                        $decoded['intent']
                            = 'gempa';
                    }
                
                    elseif (
                        str_contains(
                            $historyLower,
                            'intent: data_cob'
                        )
                    ) {
                
                        $decoded['intent']
                            = 'data_cob';
                    }
                }
            
                if (
                    !empty($decoded['parameters']['hari']) &&
                    $decoded['parameters']['hari'] > $tanggalHariIni &&
                    $decoded['intent'] == 'gempa'
                ) {
                    $decoded['parameters']['hari'] = null;
                }
            
                $result = new IntentResultDTO(

                    $decoded['intent'],
                
                    ParameterDTO::fromArray(
                        $decoded['parameters']
                    )
                );
                
                return $this->finalize($result);
            }

            } catch (\Exception $e) {

                Log::error('AI Intent Exception: ' . $e->getMessage());
            
                $fallbackIntent = $this->intentRuleEngine->detect($message);
            
                if ($fallbackIntent) {
            
                    $result = new IntentResultDTO(

                    $fallbackIntent['intent'],
                
                    ParameterDTO::fromArray(
                        array_merge(
                            
                            $fallbackIntent['parameters'] ?? [],
                            
                            $this->removeNull($dateResult),
                            $this->removeNull($monthResult),
                            $this->removeNull($compareResult)
                        )
                    )
                );
                
                return $this->finalize($result);
                }
            }

            $result = new IntentResultDTO(

                'umum',
            
                ParameterDTO::fromArray([])
            
            );
            
            return $this->finalize($result);
            
        });
    }
}