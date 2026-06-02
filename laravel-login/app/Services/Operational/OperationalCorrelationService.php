<?php

namespace App\Services\Operational;

class OperationalCorrelationService
{
    // =====================================
    // MAIN CORRELATION
    // =====================================

    public function correlateIncidentWithCob(
        array $incidentData,
        array $cobData
    ): array {

        $incidents = $this->normalizeIncidentData(
            $incidentData
        );

        $cobs = $this->normalizeCobData(
            $cobData
        );

        $results = [];

        foreach ($incidents as $incident) {

            foreach ($cobs as $cob) {

                // =====================================
                // SAME DATE
                // =====================================

                if (
                    $incident['tanggal']
                    !==
                    $cob['tanggal']
                ) {
                    continue;
                }

                // =====================================
                // SIMPLE IMPACT RULE
                // =====================================

                $isHighDowntime =
                    $incident['durasi_menit'] >= 30;

                $isCoreImpact =
                    str_contains(
                        strtoupper($incident['impact']),
                        'T24'
                    ) ||

                    str_contains(
                        strtoupper($incident['impact']),
                        'BYOND'
                    );

                $hasCobDelay =
                    $cob['durasi_cob'] >= 120;

                // =====================================
                // IMPACT DETECTED
                // =====================================

                if (
                    $isHighDowntime &&
                    $isCoreImpact &&
                    $hasCobDelay
                ) {

                    $results[] = [

                        'tanggal' =>
                            $incident['tanggal'],

                        'incident' =>
                            $incident['incident'],

                        'impact' =>
                            $incident['impact'],

                        'durasi_incident' =>
                            $incident['durasi_menit'],

                        'durasi_cob' =>
                            $cob['durasi_cob'],

                        'indikasi_cob_impact' =>
                            true,

                        'impact_level' =>
                            'high',
                    ];
                }
            }
        }

        return $results;
    }

    // =====================================
    // NORMALIZE INCIDENT
    // =====================================

    private function normalizeIncidentData(
        array $incidentData
    ): array {

        $results = [];

        foreach ($incidentData as $row) {

            $durasiMenit = 0;

            if (
                !empty($row->iid_durasi_insiden)
                &&
                str_contains(
                    $row->iid_durasi_insiden,
                    ':'
                )
            ) {

                [$jam, $menit] = explode(
                    ':',
                    $row->iid_durasi_insiden
                );

                $durasiMenit =
                    ((int) $jam * 60)
                    +
                    (int) $menit;
            }

            $results[] = [

                'tanggal' =>
                    $row->iid_tgl_mulai_kejadian,

                'incident' =>
                    $row->iid_insiden,

                'impact' =>
                    $row->iid_impact,

                'durasi_menit' =>
                    $durasiMenit,
            ];
        }

        return $results;
    }

    // =====================================
    // NORMALIZE COB
    // =====================================

    private function normalizeCobData(
        array $cobData
    ): array {

        $results = [];

        foreach ($cobData as $row) {

            $durasiCob = 0;

            if (
                !empty($row['cod_durasi'])
                &&
                str_contains(
                    $row['cod_durasi'],
                    ':'
                )
            ) {

                [$jam, $menit] = explode(
                    ':',
                    $row['cod_durasi']
                );

                $durasiCob =
                    ((int) $jam * 60)
                    +
                    (int) $menit;
            }

            $results[] = [

                'tanggal' =>
                    $row['cod_tgl'],

                'durasi_cob' =>
                    $durasiCob,

                'trx' =>
                    $row['cod_trx'] ?? 0,
            ];
        }

        return $results;
    }
}