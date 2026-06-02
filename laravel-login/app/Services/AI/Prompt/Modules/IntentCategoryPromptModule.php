<?php

namespace App\Services\AI\Prompt\Modules;

class IntentCategoryPromptModule
{
    public function build(): string
    {
        return '
[PEMAHAMAN INTENT & KATA KUNCI]

Kategori intent:
- gempa
- dampak_cabang
- cari_user
- data_cob
- insiden_it
- info_aplikasi
- cuaca
- umum
';
    }
}