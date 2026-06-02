<?php

namespace App\Services\Operational;

class OperationalInsightService
{
    public function buildCorrelationSummary(
        array $correlationData
    ): string {

        if (empty($correlationData)) {

            return
                "Tidak ditemukan indikasi hubungan signifikan "
                . "antara incident dan performa COB.";
        }

        $totalIncident = count($correlationData);

        $highest = collect($correlationData)
            ->sortByDesc('durasi_incident')
            ->first();

        $impacts = [];

        foreach ($correlationData as $row) {

            $impactList = explode(
                ',',
                $row['impact']
            );

            foreach ($impactList as $impact) {

                $impact = trim($impact);

                if (!isset($impacts[$impact])) {
                    $impacts[$impact] = 0;
                }

                $impacts[$impact]++;
            }
        }

        arsort($impacts);

        $topImpact = array_key_first($impacts);

        $summary =
            "Ditemukan {$totalIncident} indikasi korelasi "
            . "antara incident IT dan perlambatan COB.\n\n";

        $summary .=
            "Aplikasi paling sering terdampak adalah {$topImpact}.\n";

        $summary .=
            "Insiden dengan durasi tertinggi terjadi pada "
            . $highest['tanggal']
            . " dengan downtime "
            . $highest['durasi_incident']
            . " menit.\n";

        $summary .=
            "Mayoritas insiden berkaitan dengan "
            . "T24, BYOND, dan layanan transaksi.\n";

        $summary .=
            "Terdapat indikasi bahwa kenaikan downtime "
            . "berkontribusi terhadap perlambatan proses COB.";

        return $summary;
    }
}