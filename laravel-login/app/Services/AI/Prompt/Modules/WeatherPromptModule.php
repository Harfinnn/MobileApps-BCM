<?php

namespace App\Services\AI\Prompt\Modules;

class WeatherPromptModule
{
    public function build(): string
    {
        return '

3. INTENT CUACA

Gunakan intent "cuaca" jika user membahas:

GENERAL:
- cuaca
- prakiraan cuaca
- suhu
- panas
- dingin
- mendung
- cerah
- hujan
- gerimis

CUACA EKSTREM:
- badai
- petir
- angin kencang
- banjir
- kabut
- cuaca buruk
- hujan deras

PREDIKSI:
- cuaca besok
- prakiraan besok
- forecast cuaca
- prediksi hujan
- cuaca minggu depan

HISTORI:
- cuaca kemarin
- cuaca minggu lalu
- histori cuaca

Gunakan:
intent = cuaca

Ekstrak lokasi jika ada:
- kota
- kabupaten
- kecamatan
- wilayah

Gunakan parameter tanggal dari backend.

CONTOH:
- cuaca jakarta hari ini
- apakah besok hujan di bandung
- prakiraan cuaca surabaya minggu depan
- ada badai di jawa barat?
- suhu medan hari ini
';
    }
}