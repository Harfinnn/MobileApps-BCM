<?php

namespace App\Services\Chatbot\Validator;

use App\DTO\IntentResultDTO;

class IntentValidator
{
    public function validate(IntentResultDTO $dto): IntentResultDTO
    {
        $intent = $dto->intent;
        $params = $dto->parameters;

        // =====================================================
        // DEFAULT BULAN BOM VS EOM
        // =====================================================

        if (
            $intent === 'data_cob' &&
            $params->operasi_cob === 'bom_vs_eom'
        ) {

            if (empty($params->bulan)) {
                $params->bulan = date('Y-m');
            }
        }

        // =====================================================
        // DEFAULT CHART BOM
        // =====================================================

        if (
            $params->operasi_cob === 'bom' &&
            empty($params->jenis_chart)
        ) {
            $params->jenis_chart = 'umum';
        }

        // =====================================================
        // DEFAULT CHART EOM
        // =====================================================

        if (
            $params->operasi_cob === 'eom' &&
            empty($params->jenis_chart)
        ) {
            $params->jenis_chart = 'umum';
        }

        // =====================================================
        // VALIDASI OPERASI BOM/EOM HARUS data_cob
        // =====================================================

        if (
            in_array($params->operasi_cob, [
                'bom',
                'eom',
                'bom_vs_eom',
                'prediksi',
                'filter_sla',
                'cari_kendala',
            ])
        ) {
            $dto->intent = 'data_cob';
        }

        // =====================================================
        // VALIDASI RCA
        // =====================================================

        if (
            $intent === 'insiden_it' &&
            str_contains(
                strtolower($params->operasi_cob ?? ''),
                'rca'
            )
        ) {
            $params->operasi_cob = 'rca_analysis';
        }

        return $dto;
    }
}