<?php

namespace App\Services\Parser\Rules;

class IncidentRule
{
    public function detect(string $message): ?array
    {
        $message = strtolower($message);

        // =====================================
        // GENERAL INCIDENT KEYWORDS
        // =====================================

        $keywords = [

            // GENERAL
            'insiden',
            'incident',
            'gangguan',
            'kendala',
            'masalah',
            'problem',
            'issue',
            'trouble',

            // DOWN / FAILURE
            'down',
            'system down',
            'sistem down',
            'aplikasi down',
            'server down',
            'service down',

            // ACCESS ISSUE
            'tidak bisa akses',
            'tidak bisa login',
            'gagal login',
            'gagal transaksi',
            'transfer gagal',

            // PERFORMANCE
            'timeout',
            'slow',
            'lemot',
            'hang',
            'freeze',
            'loading lama',

            // ERROR
            'error',
            'failed',
            'failure',
            'crash',
            'bug',
            'exception',

            // OPERASIONAL
            'downtime',
            'rca',
            'root cause',
            'recovery',
            'failover',

            // CHANNEL / BANKING
            'mobile banking error',
            'atm offline',
            'bi fast off',
            'byond error',
            'core banking error',

            // INSIDEN HARIAN
            'daily incident',
            'incident harian',
            'harian incident',
            'trend harian',

            // INSIDEN BULANAN
            'monthly incident',
            'incident bulanan',
            'trend bulanan',
            'grafik bulanan',
            
            // RECURRING
            'top recurring',
            'recurring incident',
            'incident recurring',
            'insiden berulang',
            'gangguan berulang',

            // CORRELATION
            'pengaruh cob',
            'dampak cob',
            'korelasi cob',
            'impact cob',
            'incident vs cob',
            'hubungan cob',
            'analisa cob',
            'cob melambat',
            'cob delay',

            // NATURAL LANGUAGE
            'pengaruh incident terhadap cob',
            'dampak incident terhadap cob',
            'pengaruh insiden terhadap cob',
            'dampak insiden terhadap cob',
            
            // RISK
            'operational risk',
            'risk operasional',
            'risk incident',
            'risk cob',
            'risk level',
            'severity incident',
            'severity system',
        ];

        $matched = false;

        foreach ($keywords as $keyword) {

            if (str_contains($message, $keyword)) {

                $matched = true;
                break;
            }
        }

        if (!$matched) {
            return null;
        }

        $parameters = [];

        // =====================================
        // DAILY INCIDENT
        // =====================================

        if (

            (
                str_contains($message, 'grafik') ||
                str_contains($message, 'chart') ||
                str_contains($message, 'trend')
            )

            &&

            (
                str_contains($message, 'harian') ||
                str_contains($message, 'daily')
            )

            &&

            (
                str_contains($message, 'incident') ||
                str_contains($message, 'insiden')
            )
        ) {

            $parameters['operasi_cob']
                = 'daily_incident';
        }

        // =====================================
        // MONTHLY INCIDENT
        // =====================================

        elseif (

            (
                str_contains($message, 'grafik') ||
                str_contains($message, 'chart') ||
                str_contains($message, 'trend')
            )

            &&

            (
                str_contains($message, 'bulanan') ||
                str_contains($message, 'monthly')
            )

            &&

            (
                str_contains($message, 'incident') ||
                str_contains($message, 'insiden')
            )
        ) {

            $parameters['operasi_cob']
                = 'monthly_incident';
        }

        // =====================================
        // GENERAL INCIDENT CHART
        // =====================================

        elseif (

            (
                str_contains($message, 'grafik') ||
                str_contains($message, 'chart') ||
                str_contains($message, 'trend')
            )

            &&

            (
                str_contains($message, 'incident') ||
                str_contains($message, 'insiden')
            )
        ) {

            $parameters['operasi_cob']
                = 'top_recurring';
        }
        
        // =====================================
        // INCIDENT COB CORRELATION
        // =====================================
        
        elseif (
        
            // =====================================
            // RELATION / IMPACT / SLOWDOWN QUERY
            // =====================================
        
            (
        
                (
                    str_contains($message, 'hubungan') ||
                    str_contains($message, 'korelasi') ||
                    str_contains($message, 'pengaruh') ||
                    str_contains($message, 'mempengaruhi') ||
                    str_contains($message, 'berpengaruh') ||
                    str_contains($message, 'dampak') ||
                    str_contains($message, 'berdampak') ||
                    str_contains($message, 'impact') ||
                    str_contains($message, 'terkait') ||
                    str_contains($message, 'relasi') ||
                    str_contains($message, 'pengaruhnya')
                )
        
                &&
        
                (
                    str_contains($message, 'incident') ||
                    str_contains($message, 'insiden') ||
                    str_contains($message, 'gangguan')
                )
        
                &&
        
                (
                    str_contains($message, 'cob') ||
                    str_contains($message, 'close of business')
                )
            )
        
            ||
        
            // =====================================
            // COB MELAMBAT KARENA INCIDENT
            // =====================================
        
            (
        
                str_contains($message, 'cob')
        
                &&
        
                (
                    str_contains($message, 'melambat') ||
                    str_contains($message, 'slowdown') ||
                    str_contains($message, 'delay') ||
                    str_contains($message, 'terlambat') ||
                    str_contains($message, 'bottleneck')
                )
        
                &&
        
                (
                    str_contains($message, 'incident') ||
                    str_contains($message, 'insiden') ||
                    str_contains($message, 'gangguan')
                )
            )
        
            ||
        
            // =====================================
            // IMPACT GANGGUAN KE COB
            // =====================================
        
            (
        
                (
                    str_contains($message, 'impact') ||
                    str_contains($message, 'dampak')
                )
        
                &&
        
                (
                    str_contains($message, 'gangguan') ||
                    str_contains($message, 'incident') ||
                    str_contains($message, 'insiden')
                )
        
                &&
        
                str_contains($message, 'cob')
            )
        )
        
        {
        
            // =====================================
            // IMPACT MODE
            // =====================================
        
            if (
        
                str_contains($message, 'dampak') ||
                str_contains($message, 'impact') ||
                str_contains($message, 'pengaruh')
        
            ) {
        
                $parameters['operasi_cob']
                    = 'incident_cob_impact';
            }
        
            // =====================================
            // SLOWDOWN MODE
            // =====================================
        
            elseif (
        
                str_contains($message, 'slowdown') ||
                str_contains($message, 'melambat') ||
                str_contains($message, 'delay') ||
                str_contains($message, 'terlambat') ||
                str_contains($message, 'bottleneck')
        
            ) {
        
                $parameters['operasi_cob']
                    = 'incident_cob_slowdown';
            }
        
            // =====================================
            // RELATIONSHIP MODE
            // =====================================
        
            elseif (
        
                str_contains($message, 'hubungan') ||
                str_contains($message, 'korelasi') ||
                str_contains($message, 'relasi')
        
            ) {
        
                $parameters['operasi_cob']
                    = 'incident_cob_relationship';
            }
        
            // =====================================
            // RECURRING MODE
            // =====================================
        
            elseif (
                str_contains($message, 'top recurring') ||
                str_contains($message, 'paling sering') ||
                str_contains($message, 'recurring') ||
                str_contains($message, 'sering gangguan') ||
                str_contains($message, 'insiden berulang')
            ) {
        
                $parameters['operasi_cob']
                    = 'incident_cob_recurring';
            }
        
            // =====================================
            // DEFAULT CORRELATION
            // =====================================
        
            else {
        
                $parameters['operasi_cob']
                    = 'incident_cob_correlation';
            }
        }

        // =====================================
        // INCIDENT DASHBOARD
        // =====================================

        elseif (
            str_contains($message, 'dashboard') ||
            str_contains($message, 'overview') ||
            str_contains($message, 'ringkasan lengkap')
        ) {

            $parameters['operasi_cob']
                = 'incident_dashboard';
        }

        // =====================================
        // INCIDENT SUMMARY
        // =====================================

        elseif (
            str_contains($message, 'ringkas') ||
            str_contains($message, 'summary') ||
            str_contains($message, 'executive summary')
        ) {

            $parameters['operasi_cob']
                = 'incident_summary';
        }

        // =====================================
        // DOWNTIME TREND
        // =====================================

        elseif (
            str_contains($message, 'downtime trend') ||
            str_contains($message, 'trend downtime') ||
            str_contains($message, 'grafik downtime')
        ) {

            $parameters['operasi_cob']
                = 'downtime_trend';
        }

        // =====================================
        // TOTAL DOWNTIME
        // =====================================

        elseif (
            str_contains($message, 'total downtime') ||
            str_contains($message, 'akumulasi gangguan') ||
            str_contains($message, 'berapa downtime')
        ) {

            $parameters['operasi_cob']
                = 'total_downtime';
        }

        // =====================================
        // TOP RECURRING
        // =====================================

        elseif (
            str_contains($message, 'paling sering') ||
            str_contains($message, 'recurring') ||
            str_contains($message, 'sering gangguan')
        ) {

            $parameters['operasi_cob']
                = 'top_recurring';
        }

        // =====================================
        // INSIDEN TERLAMA
        // =====================================

        elseif (
            str_contains($message, 'terlama') ||
            str_contains($message, 'downtime terbesar') ||
            str_contains($message, 'gangguan terlama')
        ) {

            $parameters['operasi_cob']
                = 'insiden_terlama';
        }
        
        // =====================================
        // OPERATIONAL RISK
        // =====================================
        
        elseif (
        
            str_contains($message, 'operational risk') ||
            str_contains($message, 'risk operasional') ||
            str_contains($message, 'risk incident') ||
            str_contains($message, 'risk cob') ||
            str_contains($message, 'risk level') ||
            str_contains($message, 'severity incident')
        
        ) {
        
            $parameters['operasi_cob']
                = 'operational_risk';
        }

        // =====================================
        // RCA
        // =====================================

        elseif (
            str_contains($message, 'rca') ||
            str_contains($message, 'root cause') ||
            str_contains($message, 'penyebab')
        ) {

            $parameters['operasi_cob']
                = 'rca_analysis';
        }

        // =====================================
        // APP / CHANNEL DETECTION
        // =====================================

        $apps = [

            'byond' => 'BYOND',
            'bsi mobile' => 'BSI MOBILE',
            'mobile banking' => 'BSI MOBILE',
            't24' => 'T24',
            'core banking' => 'T24',
            'ncms' => 'NCMS',
            'bi fast' => 'BI FAST',
            'atm' => 'ATM',
        ];

        foreach ($apps as $key => $value) {

            if (str_contains($message, $key)) {

                $parameters['kategori'] = $value;
                break;
            }
        }

        return [

            'intent' => 'insiden_it',

            'confidence' => 0.95,

            'parameters' => $parameters,
        ];
    }
}