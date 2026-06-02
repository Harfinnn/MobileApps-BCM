<?php

namespace App\DTO;

class IntentResultDTO
{
    public $intent;

    public $parameters;

    public function __construct($intent, ParameterDTO $parameters)
    {
        $this->intent = $intent;
        $this->parameters = $parameters;
    }

    public function toArray()
    {
        return [
            'intent' => $this->intent,
            'parameters' => $this->parameters->toArray(),
        ];
    }
}