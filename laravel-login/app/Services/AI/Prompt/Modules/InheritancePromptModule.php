<?php

namespace App\Services\AI\Prompt\Modules;

class InheritancePromptModule
{
    public function build(): string
    {
        return '
[ATURAN WARISAN KONTEKS (PENTING!)]
1. Baca konteks percakapan sebelumnya.
Jika user TIDAK menyebutkan lokasi, tanggal, bulan, atau tahun,
gunakan parameter dari percakapan sebelumnya.
';
    }
}