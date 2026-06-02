<?php

namespace App\Services\Incident;

class IncidentChartService
{
    // =====================================
    // TOP RECURRING
    // =====================================

    public function buildTopRecurringChart(
        array $topRecurring
    ): array {

        $labels = array_keys($topRecurring);

        $values = array_values($topRecurring);

        return [

            'type' => 'chart',

            'data' => [

                'chart_category' => 'incident',

                'chart_mode' => 'top_recurring',

                'title' => 'Top Recurring Incident',

                'labels' => $labels,

                'datasets' => [
                    [
                        'name' => 'Jumlah Incident',

                        'type' => 'bar',

                        'data' => $values
                    ]
                ]
            ]
        ];
    }

    // =====================================
    // DAILY INCIDENT
    // =====================================

    public function buildDailyIncidentChart(array $dailyData): array
    {
        $labels = [];
    
        $values = [];
    
        foreach ($dailyData as $item) {
    
            $labels[] = $item['iid_tgl_mulai_kejadian'];
    
            $values[] = (int) $item['total'];
        }
    
        return [
    
            'type' => 'chart',
    
            'data' => [
    
                'chart_category' => 'incident',
    
                'chart_mode' => 'daily_incident',
    
                'title' => 'Daily Incident Trend',
    
                'labels' => $labels,
    
                'datasets' => [
                    [
                        'name' => 'Number of Incidents',
    
                        'type' => 'bar',
    
                        'data' => $values
                    ]
                ]
            ]
        ];
    }

    // =====================================
    // MONTHLY INCIDENT
    // =====================================

    public function buildMonthlyIncidentChart(
        array $monthlyData
    ): array {
    
        $labels = [];
    
        $incidentValues = [];
    
        $durationValues = [];
    
        foreach ($monthlyData as $item) {
    
            $labels[] = $item->bulan;
    
            $incidentValues[] =
                (int) $item->total;
    
            $durationValues[] =
                (int) $item->total_duration;
        }
    
        return [
    
            'type' => 'chart',
    
            'data' => [
    
                'chart_category' => 'incident',
    
                'chart_mode' => 'monthly_incident',
    
                'title' => 'Monthly Incident Trend',
    
                'labels' => $labels,
    
                'datasets' => [
    
                    [
                        'name' => 'Number of Incidents',
    
                        'type' => 'bar',
    
                        'data' => $incidentValues
                    ],
    
                    [
                        'name' => 'Duration',
    
                        'type' => 'line',
    
                        'data' => $durationValues
                    ]
                ]
            ]
        ];
    }
    
    // =====================================
    // DOWNTIME TREND
    // =====================================
    
    public function buildDowntimeTrendChart(
        array $downtimeData
    ): array {
    
        $labels = [];
    
        $durationValues = [];
    
        foreach ($downtimeData as $item) {
    
            $labels[] = $item['tanggal'];
    
            $durationValues[] =
                (int) $item['total_downtime'];
        }
    
        return [
    
            'type' => 'chart',
    
            'data' => [
    
                'chart_category' => 'incident',
    
                'chart_mode' => 'downtime_trend',
    
                'title' => 'Downtime Trend',
    
                'labels' => $labels,
    
                'datasets' => [
    
                    [
                        'name' => 'Downtime Duration',
    
                        'type' => 'line',
    
                        'data' => $durationValues
                    ]
                ]
            ]
        ];
    }
}