<?php

namespace App\Services\Incident;

use App\Services\Chatbot\DataFetchService;
use App\Services\Operational\OperationalCorrelationService;
use App\Services\Operational\OperationalInsightService;
use App\Services\Operational\OperationalRiskService;

class IncidentService
{
    protected $dataService;

    protected $chartService;
    
    protected $correlationService;

    protected $insightService;
    
    protected $riskService;

    public function __construct(
        DataFetchService $dataService,
        IncidentChartService $chartService,
        OperationalCorrelationService $correlationService,
        OperationalInsightService $insightService,
        OperationalRiskService $riskService
    ) {

        $this->dataService = $dataService;
        $this->chartService = $chartService;
        $this->correlationService = $correlationService;
        $this->insightService  = $insightService;
        $this->riskService = $riskService;
    }

    // =====================================
    // MAIN HANDLER
    // =====================================

    public function handle(
        array $params,
        string $message
    ) {

        // =====================================
        // DAILY INCIDENT
        // =====================================

        if (
            ($params['operasi_cob'] ?? null)
            ===
            'daily_incident'
        ) {

            return $this
                ->handleDailyIncident($params);
        }

        // =====================================
        // MONTHLY INCIDENT
        // =====================================

        if (
            ($params['operasi_cob'] ?? null)
            ===
            'monthly_incident'
        ) {

            return $this
                ->handleMonthlyIncident($params);
        }
        
        // =====================================
        // INCIDENT COB CORRELATION
        // =====================================
        
        if (
            ($params['operasi_cob'] ?? null)
            ===
            'incident_cob_correlation'
        ) {
        
            return $this
                ->handleIncidentCorrelation($params, $message);
        }

        return null;
    }

    // =====================================
    // DAILY INCIDENT
    // =====================================

    private function handleDailyIncident(
        array $params
    ) {

        return $this->dataService
            ->getDailyIncident($params);
    }

    // =====================================
    // MONTHLY INCIDENT
    // =====================================

    private function handleMonthlyIncident(
        array $params
    ) {

        return $this->dataService
            ->getMonthlyIncident($params);
    }
    
    // =====================================
    // INCIDENT COB CORRELATION
    // =====================================
    
    private function handleIncidentCorrelation(
        array $params,
        string $message
    ) {
    
        // =====================================
        // INCIDENT DATA
        // =====================================
    
        $incidentData = \DB::table('insiden_itdata');
    
        if (!empty($params['tahun'])) {
    
            $incidentData->where(
                'iid_tahun',
                $params['tahun']
            );
        }
    
        if (!empty($params['bulan'])) {
    
            $incidentData->where(
                'iid_tgl_mulai_kejadian',
                'like',
                $params['bulan'] . '%'
            );
        }
    
        $incidentData = $incidentData
            ->get()
            ->all();
    
        // =====================================
        // COB DATA
        // =====================================
    
        $cobData = \DB::table('cob_data');
    
        if (!empty($params['tahun'])) {
    
            $cobData->where(
                'cod_tgl',
                'like',
                $params['tahun'] . '%'
            );
        }
    
        if (!empty($params['bulan'])) {
    
            $cobData->where(
                'cod_tgl',
                'like',
                $params['bulan'] . '%'
            );
        }
    
        $cobData = $cobData
            ->get()
            ->toArray();
    
        // =====================================
        // CORRELATION ENGINE
        // =====================================
    
        $correlationResult =
            $this->correlationService
                ->correlateIncidentWithCob(
    
                    $incidentData,
    
                    json_decode(
                        json_encode($cobData),
                        true
                    )
                );
    
        // =====================================
        // SUMMARY ENGINE
        // =====================================
    
        $summary =
            $this->insightService
                ->buildCorrelationSummary(
                    $correlationResult
                );
    
        return [

            'type' => 'incident_correlation',
        
            'question' => $message,
        
            'summary' => $summary,
        
            'data' => $correlationResult
        ];
    }
}