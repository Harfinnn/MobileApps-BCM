<?php

namespace App\Services\AI\Prompt\Modules;

class GempaPromptModule
{
    public function build(): string
    {
        return '

[PEMAHAMAN GEMPA & BENCANA]

Jika intent berkaitan dengan gempa:

- Fokus pada informasi gempa dan dampaknya.
- Jangan mengarang magnitudo atau lokasi.
- Jika data tidak tersedia, katakan data tidak ditemukan.
- Pahami istilah:
  - gempa
  - earthquake
  - aftershock
  - tsunami
  - getaran
  - guncangan

Jika user menanyakan dampak:
- fokus pada cabang terdampak
- radius terdampak
- area operasional

Jika user bertanya umum:
- jawab natural dan informatif
- tidak perlu mengaitkan dengan BCM24

Jangan membuat analisa teknis jika data tidak tersedia.

';
    }
}