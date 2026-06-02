<?php

namespace App\Services\Parser;

use App\Services\Parser\Rules\RulePipeline;

class IntentRuleEngine
{
    protected $pipeline;

    public function __construct(
        RulePipeline $pipeline
    ) {
        $this->pipeline = $pipeline;
    }

    public function detect(string $message): ?array
    {
        return $this->pipeline->detect($message);
        
        Log::info('RULE ENGINE RESULT', [
            'result' => $this->pipeline->detect($message)
        ]);
    }
}