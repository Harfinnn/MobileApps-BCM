import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
  Text,
} from 'react-native';
import axios from 'axios';
import API from '../../../services/api';
import { LineChart } from 'react-native-gifted-charts';

import { useLayout } from '../../../contexts/LayoutContext';
import { PieChart } from 'react-native-gifted-charts';

import ApplicationOverviewSection from '../../../components/dashboard/CardApp';
import AvailabilityGauge from '../../../components/dashboard/AvailabilityGauge';
import SystemOverviewDashboard from '../../../components/dashboard/NewComp';
import COBAnalyticsCard from '../../../components/dashboard/CobGrafik';

export default function DashboardITScreen() {
  const { setTitle, setHideNavbar, setShowBack } = useLayout();
  const [dashboard, setDashboard] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [cobMonthly, setCobMonthly] = useState<any>(null);
  const [cobStage, setCobStage] = useState<any[]>([]);
  const [rsdSummary, setRsdSummary] = useState<any>(null);
  const [rsdMonthly, setRsdMonthly] = useState<any[]>([]);
  const [rsdCategory, setRsdCategory] = useState<RsdCategory[]>([]);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const [dashboardRes, rsdSummaryRes, rsdMonthlyRes, rsdCategoryRes] =
        await Promise.all([
          API.get('/dashboard-it'),
          API.get('/dashboard-it/rsd-summary'),
          API.get('/dashboard-it/rsd-monthly'),
          API.get('/dashboard-it/rsd-category'),
        ]);

      setDashboard(dashboardRes.data);

      setRsdSummary(rsdSummaryRes.data);

      setRsdMonthly(rsdMonthlyRes.data);

      setRsdCategory(rsdCategoryRes.data);
    } catch (error) {
      console.log('Dashboard Error', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCobMonthly = async () => {
    try {
      const { data } = await API.get('/dashboard-it/cob-monthly');
      setCobMonthly(data);
    } catch (error) {
      console.log(error);
    }
  };

  const loadCobStage = async () => {
    try {
      const { data } = await API.get('/dashboard-it/cob-stage');
      setCobStage(data);
    } catch (error) {
      console.log('COB Stage Error', error);
    }
  };

  const applicationPieData =
    dashboard?.application?.chart?.map((item: any) => ({
      value: Number(item.total),
      color: item.dbmak_color || '#2563EB',
      text: String(item.total),
      label: item.dbmak_nama,
    })) ?? [];

  const cobTrendData =
    dashboard?.cob?.trend?.map((item: any) => ({
      value: Math.round(item.trx / 1000000),
      label: item.tanggal.substring(5),
    })) ?? [];

  const cobTransactionData =
    dashboard?.cob?.trend?.map((item: any) => ({
      value: Number((item.trx / 1000000).toFixed(2)),
      label: item.tanggal.substring(5),
    })) ?? [];

  const cobDurationData =
    dashboard?.cob?.trend?.map((item: any) => ({
      value: item.durasi_hour,
    })) ?? [];

  const monthStartData =
    cobMonthly?.month_start?.map((item: any) => ({
      value: Number((item.trx / 1000000).toFixed(2)),
      label: item.tanggal.substring(5, 7),
    })) ?? [];

  const monthEndData =
    cobMonthly?.month_end?.map((item: any) => ({
      value: Number((item.trx / 1000000).toFixed(2)),
    })) ?? [];

  const applicationData = (cobStage || []).map((item: any) => ({
    value: (Number(item.application) || 0) * 60,
    label: item.tanggal ? item.tanggal.substring(5) : '',
  }));

  const systemWideData = (cobStage || []).map((item: any) => ({
    value: (Number(item.system_wide) || 0) * 60,
  }));

  const reportingData = (cobStage || []).map((item: any) => ({
    value: (Number(item.reporting) || 0) * 60,
  }));

  const sodData = (cobStage || []).map((item: any) => ({
    value: (Number(item.sod) || 0) * 60,
  }));

  const onlineData = (cobStage || []).map((item: any) => ({
    value: (Number(item.online) || 0) * 60,
  }));

  interface RsdCategoryPoint {
    bulan: string;
    durasi_hour: number;
  }

  interface RsdCategory {
    category: string;
    data: RsdCategoryPoint[];
  }

  useEffect(() => {
    setTitle('Dashboard IT');
    setHideNavbar(true);
    setShowBack(true);

    loadDashboard();
    loadCobMonthly();
    loadCobStage();

    return () => {
      setHideNavbar(false);
      setShowBack(false);
    };
  }, [setTitle, setHideNavbar, setShowBack]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

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
          onLegendItemPress={item => console.log('Legend ditekan:', item.label)}
        />

        <COBAnalyticsCard
          cobTransactionData={cobTransactionData}
          cobDurationData={cobDurationData}
          monthStartData={monthStartData}
          monthEndData={monthEndData}
          applicationData={applicationData}
          systemWideData={systemWideData}
          reportingData={reportingData}
          sodData={sodData}
          onlineData={onlineData}
        />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DRP Summary</Text>

          <View style={styles.grid}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Total</Text>

              <Text style={styles.cardValue}>
                {dashboard?.drp?.summary?.total ?? 0}
              </Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Completed</Text>

              <Text style={styles.cardValue}>
                {dashboard?.drp?.summary?.completed ?? 0}
              </Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Outstanding</Text>

              <Text style={styles.cardValue}>
                {dashboard?.drp?.summary?.outstanding ?? 0}
              </Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>This Month</Text>

              <Text style={styles.cardValue}>
                {dashboard?.drp?.summary?.this_month ?? 0}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>RSD Summary</Text>

          <View style={styles.grid}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Month</Text>

              <Text style={styles.cardValue}>
                {rsdSummary?.total_month ?? 0}
              </Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Recovery Hour</Text>

              <Text style={styles.cardValue}>
                {rsdSummary?.total_hour ?? 0}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Monthly Recovery</Text>

          <View style={styles.chartCard}>
            {rsdMonthly.map(item => (
              <View key={item.bulan} style={styles.row}>
                <Text style={styles.rowTitle}>{item.bulan}</Text>

                <Text style={styles.rowValue}>{item.durasi_hour} h</Text>
              </View>
            ))}
          </View>
        </View>

        {rsdCategory.map(item => (
          <View key={item.category} style={styles.chartCard}>
            <Text style={styles.categoryTitle}>{item.category}</Text>

            {item.data.map(point => (
              <View key={point.bulan} style={styles.row}>
                <Text>{point.bulan}</Text>
                <Text>{point.durasi_hour} h</Text>
              </View>
            ))}
          </View>
        ))}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>History</Text>

          <View style={styles.placeholderCard}>
            <Text style={styles.placeholderText}>List History</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  content: {
    padding: 16,
    paddingBottom: 30,
  },

  header: {
    marginTop: 70,
    marginBottom: 20,
  },

  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#111827',
  },

  subtitle: {
    marginTop: 4,
    color: '#6B7280',
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  card: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 18,
    marginBottom: 14,
    elevation: 2,
  },

  cardTitle: {
    color: '#6B7280',
    fontSize: 13,
  },

  cardValue: {
    marginTop: 10,
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },

  cardFooter: {
    marginTop: 8,
    fontSize: 12,
    color: '#6B7280',
  },

  section: {
    marginTop: 24,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },

  placeholderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  placeholderText: {
    color: '#9CA3AF',
    textAlign: 'center',
  },

  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    elevation: 2,
  },

  chartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },

  colorDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 12,
  },

  chartLabel: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
  },

  chartValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },

  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  legendDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 10,
  },

  legendLabel: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
  },

  legendValue: {
    fontWeight: '700',
    fontSize: 15,
    color: '#111827',
  },

  availabilityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    elevation: 2,
  },

  availabilityValue: {
    fontSize: 42,
    fontWeight: '800',
    color: '#10B981',
    textAlign: 'center',
  },

  availabilityLabel: {
    textAlign: 'center',
    color: '#6B7280',
    marginTop: 4,
    marginBottom: 20,
  },

  rowStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  smallCard: {
    flex: 1,
    alignItems: 'center',
  },

  smallValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },

  smallLabel: {
    marginTop: 4,
    color: '#6B7280',
    fontSize: 12,
  },

  chartLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 18,
  },

  legendBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
  },

  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },

  stageLegend: {
    marginTop: 20,
  },

  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  legendText: {
    fontSize: 13,
    color: '#374151',
  },

  drpItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },

  drpTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },

  drpSubtitle: {
    marginTop: 4,
    fontSize: 12,
    color: '#6B7280',
  },

  drpDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },

  emptyText: {
    textAlign: 'center',
    color: '#9CA3AF',
    paddingVertical: 20,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },

  rowTitle: {
    fontSize: 14,
    color: '#111827',
  },

  rowValue: {
    fontWeight: '700',
    color: '#2563EB',
  },

  categoryTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },

  // --- STYLES BARU UNTUK APPLICATION OVERVIEW ---
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  badgePro: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeProText: {
    color: '#10B981',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  modernChartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(229, 231, 235, 0.5)', // Subtle border
    shadowColor: '#9CA3AF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  chartLayout: {
    flexDirection: 'row', // Side-by-side layout
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chartWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 0.45, // Mengambil 45% lebar card
  },
  centerLabelContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerLabelValue: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111827',
  },
  centerLabelText: {
    fontSize: 10,
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  legendWrapper: {
    flex: 0.55, // Mengambil 55% lebar card
    height: 160, // Membatasi tinggi agar rata dengan chart
    paddingLeft: 10,
  },
  legendScrollContent: {
    paddingRight: 5,
  },
  modernLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  legendLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  modernLegendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  modernLegendLabel: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '500',
    flexShrink: 1,
    paddingRight: 8,
  },
  modernLegendValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
});
