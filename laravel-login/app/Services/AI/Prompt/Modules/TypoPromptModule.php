<?php

namespace App\Services\AI\Prompt\Modules;

class TypoPromptModule
{
    public function build(): string
    {
        return '

[TYPO TOLERANCE & AUTO-CORRECT]

Toleransi typo ringan dan singkatan umum user.

Jika ada typo kecil, tetap pahami intent user.

NORMALISASI UMUM:
- trx -> transaksi
- oprasional -> operasional
- grafk -> grafik
- predksi -> prediksi
- analisaa -> analisa

TYPO GEMPA:
- gmpa -> gempa
- gmppa -> gempa
- gemp -> gempa

TYPO LOKASI:
- jakrta -> jakarta
- sbya -> surabaya
- bdg -> bandung

TYPO INCIDENT:
- insden -> insiden
- incidnt -> incident
- downtme -> downtime
- rc -> rca
- byod -> byond

TYPO OPERASIONAL:
- sodd -> sod
- eodd -> eod
- trasaksi -> transaksi
- transksi -> transaksi

NORMALISASI APLIKASI:
- mbanking -> bsi mobile
- mobile banking -> bsi mobile
- core banking -> t24

Contoh:
- gmpa di jakrta -> intent: gempa
- dmpak cbang sbya -> intent: dampak_cabang
- grafk downtime byod -> intent: insiden_it
- predksi trx minggu dpn -> intent: data_cob

';
    }
}