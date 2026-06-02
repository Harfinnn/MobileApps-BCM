<?php

namespace App\Services\AI\Prompt\Modules;

class CobPromptModule
{
    public function build(): string
    {
        return '

2. INTENT DATA COB

Gunakan intent "data_cob" jika user membahas:

GENERAL:
- trx
- transaksi
- transaksi harian
- operasional
- performa operasional
- performa sistem
- kinerja
- laporan
- summary
- rekap
- durasi cob
- proses cob
- batch process
- settlement
- closing harian

PROCESS:
- sod
- eod
- start of day
- end of day
- online
- reporting
- system wide
- application

PERFORMANCE ISSUE:
- operasional lambat
- delay
- bottleneck
- trx lambat
- cob lama

VISUALISASI:
Jika user meminta:
- grafik
- chart
- diagram
- visualisasi
- trend

maka:
intent = data_cob

JENIS CHART:
Jika user menyebut:
- stage
- per stage
- application
- system wide
- reporting
- online

maka:
jenis_chart = stage

Selain itu:
jenis_chart = umum

PREDIKSI:
Jika user meminta:
- prediksi
- forecast
- proyeksi

maka:
operasi_cob = prediksi

BOM:
- awal bulan
- beginning of month
- BOM

maka:
operasi_cob = bom

EOM:
- akhir bulan
- end of month
- EOM

maka:
operasi_cob = eom

BOM VS EOM:
- bom vs eom
- perbandingan bom eom
- compare bom eom

maka:
operasi_cob = bom_vs_eom

COMPARE:
Jika user meminta:
- compare
- bandingkan
- versus
- vs

maka:
is_compare = true

FILTER SLA:
- sla
- breach
- lewat sla

maka:
operasi_cob = filter_sla

CARI KENDALA:
- kendala
- error
- issue
- masalah
- gangguan

maka:
operasi_cob = cari_kendala

CONTOH:

- grafik transaksi bulan ini
- bom vs eom mei
- prediksi trx minggu depan
- stage operasional hari ini
- compare trx januari vs februari
- cari kendala database
- trend transaksi harian
';
    }
}