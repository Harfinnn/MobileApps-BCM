<?php

namespace App\Services\AIProvider;

interface AIProviderInterface
{
    public function chatJson(array $messages): ?string;

    public function chatText(array $messages): ?string;
}