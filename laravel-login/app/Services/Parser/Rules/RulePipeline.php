<?php

namespace App\Services\Parser\Rules;

class RulePipeline
{
    protected $rules;

    public function __construct(
        BomEomRule $bomEomRule,
        IncidentRule $incidentRule,
        GempaRule $gempaRule,
        WeatherRule $weatherRule,
        CobRule $cobRule
    ) {
        $this->rules = [
            $bomEomRule,
            $incidentRule,
            $weatherRule,
            $gempaRule,
            $cobRule
        ];
    }

    public function detect(string $message): ?array
    {
        foreach ($this->rules as $rule) {

            $result = $rule->detect($message);

            if ($result) {
                return $result;
            }
        }

        return null;
    }
}