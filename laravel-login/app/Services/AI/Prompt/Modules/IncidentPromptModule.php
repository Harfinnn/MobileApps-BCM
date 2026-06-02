<?php

namespace App\Services\AI\Prompt\Modules;

class IncidentPromptModule
{
    public function build(): string
    {
        return '

1. INTENT INSIDEN IT

Gunakan intent "insiden_it" jika user membahas:

GENERAL:
- insiden
- incident
- gangguan
- downtime
- error
- kendala
- masalah sistem
- issue aplikasi
- problem layanan

SYSTEM ISSUE:
- byond down
- aplikasi down
- server down
- sistem down
- service unavailable
- timeout aplikasi
- response time lambat
- slow response
- lemot
- hang
- freeze
- crash
- blank
- muter terus

BUSINESS IMPACT:
- gagal transaksi
- gagal login
- mobile banking error
- atm offline
- transfer gagal
- bi fast off

RCA:
- RCA
- root cause
- penyebab gangguan
- recovery
- failover

Gunakan parameter tanggal dari backend.

Jika user menyebut:
- tahun -> isi parameter "tahun"
- aplikasi -> isi parameter "kategori"

VISUALISASI:
Jika user meminta:
- grafik
- chart
- trend
- diagram
- visualisasi

maka:
jenis_chart = incident

MAPPING OPERASI:

- total downtime -> operasi_cob: total_downtime
- aplikasi paling sering gangguan -> operasi_cob: top_recurring
- recurring incident -> operasi_cob: top_recurring
- trend downtime -> operasi_cob: downtime_trend
- insiden terlama -> operasi_cob: insiden_terlama
- root cause -> operasi_cob: rca_analysis
- penyebab gangguan -> operasi_cob: rca_analysis
- ringkas insiden -> operasi_cob: incident_summary
- summary incident -> operasi_cob: incident_summary
- dashboard incident -> operasi_cob: incident_dashboard

CONTOH:

- grafik recurring incident bulan ini
- trend downtime byond
- ringkas insiden minggu ini
- analisa rca byond
- dashboard incident nasional
';
    }
}