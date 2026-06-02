<?php

namespace App\Services\Operational;

class OperationalRiskService
{
    // =====================================
    // CALCULATE RISK
    // =====================================

    public function calculateRisk(
        array $correlationData
    ): array {

        $score = 0;

        $reasons = [];

        // =====================================
        // TOTAL INCIDENT
        // =====================================

        $totalIncident = count($correlationData);

        if ($totalIncident >= 10) {

            $score += 30;

            $reasons[] =
                'Jumlah incident tinggi';
        }

        elseif ($totalIncident >= 5) {

            $score += 20;

            $reasons[] =
                'Jumlah incident menengah';
        }

        // =====================================
        // TOTAL DOWNTIME
        // =====================================

        $totalDowntime = 0;

        foreach ($correlationData as $row) {

            $totalDowntime +=
                $row['durasi_incident'];
        }

        if ($totalDowntime >= 1000) {

            $score += 30;

            $reasons[] =
                'Total downtime sangat tinggi';
        }

        elseif ($totalDowntime >= 500) {

            $score += 20;

            $reasons[] =
                'Total downtime tinggi';
        }

        // =====================================
        // COB IMPACT
        // =====================================

        $highCobImpact = 0;

        foreach ($correlationData as $row) {

            if ($row['durasi_cob'] >= 180) {

                $highCobImpact++;
            }
        }

        if ($highCobImpact >= 5) {

            $score += 25;

            $reasons[] =
                'Perlambatan COB signifikan';
        }

        // =====================================
        // CORE IMPACT
        // =====================================

        $coreImpact = 0;

        foreach ($correlationData as $row) {

            $impact =
                strtoupper($row['impact']);

            if (

                str_contains($impact, 'T24') ||

                str_contains($impact, 'BYOND')

            ) {

                $coreImpact++;
            }
        }

        if ($coreImpact >= 5) {

            $score += 25;

            $reasons[] =
                'Core system impacted repeatedly';
        }

        // =====================================
        // DETERMINE LEVEL
        // =====================================

        $level = 'LOW';

        if ($score >= 80) {

            $level = 'CRITICAL';
        }

        elseif ($score >= 60) {

            $level = 'HIGH';
        }

        elseif ($score >= 40) {

            $level = 'MEDIUM';
        }

        // =====================================
        // RESULT
        // =====================================

        return [

            'risk_level' => $level,

            'risk_score' => $score,

            'total_incident' => $totalIncident,

            'total_downtime' => $totalDowntime,

            'reasons' => $reasons,
        ];
    }
}