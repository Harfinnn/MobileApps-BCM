import React, { useEffect, useState, useMemo } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  View,
  Text,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import API from '../../../services/api';

import { useLayout } from '../../../contexts/LayoutContext';

import SystemOverviewDashboard from '../../../components/dashboard/NewComp';
import COBAnalyticsCard from '../../../components/dashboard/CobGrafik';
import DRPRSDSummaryCard from '../../../components/dashboard/DrpRsdSummary';
import IncidentSummaryCard from '../../../components/dashboard/IncidentSummaryCard';
import IncidentImpactSection from '../../../components/dashboard/IncidentImpactSection';

// Import file styles yang sudah dipisahkan
import { styles } from '../../../styles/dashboard/DashboardITStyle';

interface RsdCategoryPoint {
  bulan: string;
  durasi_hour: number;
}

interface RsdCategory {
  category: string;
  data: RsdCategoryPoint[];
}

export default function DashboardITScreen() {
  const { setTitle, setHideNavbar, setShowBack } = useLayout();

  const [dashboard, setDashboard] = useState<any>(null);
  const [loadingCore, setLoadingCore] = useState(true);

  const [cobMonthly, setCobMonthly] = useState<any>(null);
  const [cobStage, setCobStage] = useState<any[]>([]);

  const [cobBom, setCobBom] = useState<any>(null);

  const [cobBoy, setCobBoy] = useState<any>(null);

  const [cobEom, setCobEom] = useState<any>(null);

  const [cobEoy, setCobEoy] = useState<any>(null);

  const [incidentSummary, setIncidentSummary] = useState<any>(null);

  const [incidentImpact, setIncidentImpact] = useState([]);

  const [rsdSummary, setRsdSummary] = useState<any>(null);
  const [rsdLoading, setRsdLoading] = useState(true); // khusus DRPRSDSummaryCard

  const [rsdMonthly, setRsdMonthly] = useState<any[]>([]);
  const [rsdCategory, setRsdCategory] = useState<RsdCategory[]>([]);

  useEffect(() => {
    setTitle('Dashboard IT');
    setHideNavbar(true);
    setShowBack(true);

    // 1. Data utama — render layar begitu ini datang, tidak nunggu yang lain
    API.get('/dashboard-it')
      .then(res => setDashboard(res.data))
      .catch(err => console.log('Dashboard core error', err))
      .finally(() => setLoadingCore(false));

    // 2. RSD summary — dipakai bareng dashboard.drp.summary di DRPRSDSummaryCard,
    //    jadi punya loading flag sendiri
    API.get('/dashboard-it/rsd-summary')
      .then(res => setRsdSummary(res.data))
      .catch(err => console.log('RSD summary error', err))
      .finally(() => setRsdLoading(false));

    // 3. Data pendukung lain — paralel, tidak nge-block apa pun
    API.get('/dashboard-it/rsd-monthly')
      .then(res => setRsdMonthly(res.data))
      .catch(err => console.log('RSD monthly error', err));

    API.get('/dashboard-it/rsd-category')
      .then(res => setRsdCategory(res.data))
      .catch(err => console.log('RSD category error', err));

    API.get('/dashboard-it/cob-monthly')
      .then(res => setCobMonthly(res.data))
      .catch(err => console.log('COB monthly error', err));

    API.get('/dashboard-it/cob-bom')
      .then(res => setCobBom(res.data))
      .catch(err => console.log('COB BOM error', err));

    API.get('/dashboard-it/cob-eom')
      .then(res => setCobEom(res.data))
      .catch(err => console.log('COB EOM error', err));

    API.get('/dashboard-it/cob-boy')
      .then(res => setCobBoy(res.data))
      .catch(err => console.log('COB BOY error', err));

    API.get('/dashboard-it/cob-eoy')
      .then(res => setCobEoy(res.data))
      .catch(err => console.log('COB EOY error', err));

    API.get('/dashboard-it/cob-stage')
      .then(res => setCobStage(res.data))
      .catch(err => console.log('COB stage error', err));

    API.get('/dashboard-it/incidents/summary')
      .then(res => setIncidentSummary(res.data))
      .catch(err => console.log('Incident Summary error', err));

    API.get('/dashboard-it/incidents/impact', {
      params: {
        tahun: new Date().getFullYear(),
      },
    })
      .then(res => setIncidentImpact(res.data.impact))
      .catch(err => console.log(err));

    return () => {
      setHideNavbar(false);
      setShowBack(false);
    };
  }, [setTitle, setHideNavbar, setShowBack]);

  // 2. Optimasi Render: Gunakan useMemo untuk mencegah kalkulasi berulang
  const applicationPieData = useMemo(
    () =>
      dashboard?.application?.chart?.map((item: any) => ({
        value: Number(item.total),
        color: item.dbmak_color || '#2563EB',
        text: String(item.total),
        label: item.dbmak_nama,
      })) ?? [],
    [dashboard],
  );

  const cobTransactionData = useMemo(
    () =>
      dashboard?.cob?.trend?.map((item: any) => ({
        value: Number((item.trx / 1000000).toFixed(2)),
        label: item.tanggal.substring(5),
      })) ?? [],
    [dashboard],
  );

  const cobDurationData = useMemo(
    () =>
      dashboard?.cob?.trend?.map((item: any) => ({
        value: item.durasi_hour,
      })) ?? [],
    [dashboard],
  );

  const monthTransactionData = useMemo(
    () =>
      cobMonthly?.monthly?.map((item: any) => ({
        value: Number((item.trx / 1000000).toFixed(2)),
        label: item.bulan,
      })) ?? [],
    [cobMonthly],
  );

  const monthDurationData = useMemo(
    () =>
      cobMonthly?.monthly?.map((item: any) => ({
        value: Number(item.durasi_hour) || 0,
      })) ?? [],
    [cobMonthly],
  );

  const bomTransactionData = useMemo(
    () =>
      (
        cobBom?.bom?.map((item: any) => ({
          value: Number((item.trx / 1000000).toFixed(2)),
          label: item.bulan,
        })) ?? []
      )
        .slice()
        .reverse(),
    [cobBom],
  );

  const bomDurationData = useMemo(
    () =>
      (
        cobBom?.bom?.map((item: any) => ({
          value: Number(item.durasi_hour) || 0,
        })) ?? []
      )
        .slice()
        .reverse(),
    [cobBom],
  );

  const eomTransactionData = useMemo(
    () =>
      (
        cobEom?.eom?.map((item: any) => ({
          value: Number((item.trx / 1000000).toFixed(2)),
          label: item.bulan,
        })) ?? []
      )
        .slice()
        .reverse(),
    [cobEom],
  );

  const eomDurationData = useMemo(
    () =>
      (
        cobEom?.eom?.map((item: any) => ({
          value: Number(item.durasi_hour),
        })) ?? []
      )
        .slice()
        .reverse(),
    [cobEom],
  );

  const boyTransactionData = useMemo(
    () =>
      cobBoy?.boy?.map((item: any) => ({
        value: Number((item.trx / 1000000).toFixed(2)),
        label: item.tahun.toString(),
      })) ?? [],
    [cobBoy],
  );

  const boyDurationData = useMemo(
    () =>
      cobBoy?.boy?.map((item: any) => ({
        value: Number(item.durasi_hour),
      })) ?? [],
    [cobBoy],
  );

  const eoyTransactionData = useMemo(
    () =>
      cobEoy?.eoy?.map((item: any) => ({
        value: Number((item.trx / 1000000).toFixed(2)),
        label: item.tahun.toString(),
      })) ?? [],
    [cobEoy],
  );

  const eoyDurationData = useMemo(
    () =>
      cobEoy?.eoy?.map((item: any) => ({
        value: Number(item.durasi_hour),
      })) ?? [],
    [cobEoy],
  );

  const monthlyKeterangan = useMemo(
    () => cobMonthly?.monthly?.map((item: any) => item.keterangan ?? '') ?? [],
    [cobMonthly],
  );

  const applicationData = useMemo(
    () =>
      (cobStage || []).map((item: any) => ({
        value: (Number(item.application) || 0) * 60,
        label: item.tanggal ? item.tanggal.substring(5) : '',
      })),
    [cobStage],
  );

  const systemWideData = useMemo(
    () =>
      (cobStage || []).map((item: any) => ({
        value: (Number(item.system_wide) || 0) * 60,
      })),
    [cobStage],
  );

  const reportingData = useMemo(
    () =>
      (cobStage || []).map((item: any) => ({
        value: (Number(item.reporting) || 0) * 60,
      })),
    [cobStage],
  );

  const sodData = useMemo(
    () =>
      (cobStage || []).map((item: any) => ({
        value: (Number(item.sod) || 0) * 60,
      })),
    [cobStage],
  );

  const onlineData = useMemo(
    () =>
      (cobStage || []).map((item: any) => ({
        value: (Number(item.online) || 0) * 60,
      })),
    [cobStage],
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {loadingCore ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={styles.loadingText}>Memuat Dashboard...</Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Dashboard IT</Text>
            <Text style={styles.subtitle}>Business Continuity Monitoring</Text>
          </View>

          <SystemOverviewDashboard
            percentage={dashboard?.availability?.percentage ?? 0}
            downtime={dashboard?.availability?.downtime_hour ?? 0}
            tat={dashboard?.availability?.tat_hour ?? 0}
            applicationPieData={applicationPieData}
            onLegendItemPress={(item: any) =>
              console.log('Legend ditekan:', item.label)
            }
          />

          {rsdLoading ? (
            <View style={styles.placeholderCard}>
              <ActivityIndicator size="small" color="#2563EB" />
            </View>
          ) : (
            <DRPRSDSummaryCard drpSummary={dashboard?.drp?.summary} />
          )}

          <IncidentSummaryCard data={incidentSummary} />

          <COBAnalyticsCard
            cobTransactionData={cobTransactionData}
            cobDurationData={cobDurationData}
            monthTransactionData={monthTransactionData}
            monthDurationData={monthDurationData}
            bomTransactionData={bomTransactionData}
            bomDurationData={bomDurationData}
            eomDurationData={eomDurationData}
            eomTransactionData={eomTransactionData}
            boyTransactionData={boyTransactionData}
            boyDurationData={boyDurationData}
            eoyTransactionData={eoyTransactionData}
            eoyDurationData={eoyDurationData}
            monthlyKeterangan={monthlyKeterangan}
            applicationData={applicationData}
            systemWideData={systemWideData}
            reportingData={reportingData}
            sodData={sodData}
            onlineData={onlineData}
          />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
