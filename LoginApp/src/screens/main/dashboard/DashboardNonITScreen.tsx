import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  StatusBar,
  useColorScheme,
} from 'react-native';
import { useLayout } from '../../../contexts/LayoutContext';
import {
  Calendar,
  Zap,
  Activity,
  Award,
  Lightbulb,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Layers,
  TrendingUp,
} from 'lucide-react-native';
import api from '../../../services/api';

import {
  getThemeColors,
  getStyles,
} from '../../../styles/dashboard/dashboardCobStyle';

type DashboardCob = {
  cod_tgl: string;
  cod_trx: string;
  cod_durasi: string;
  cod_ket: string;
  cod_durasi_app: string;
  cod_sistemwide_app: string;
  cod_reporting_app: string;
  cod_sod_app: string;
  cod_online_app: string;
};

type DashboardKpi = {
  trxTrend: number;
  durationTrend: number;
};

export default function DashboardNonITScreen() {
  const { setTitle, setHideNavbar, setShowBack, setShowSearch, setHideHeaderLeft, setHideHeader } = useLayout();

  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = getThemeColors(isDark);
  const styles = useMemo(() => getStyles(theme, isDark), [isDark, theme]);

  const [dashboard, setDashboard] = useState<DashboardCob | null>(null);
  const [kpi, setKpi] = useState<DashboardKpi | null>(null);
  const [topPerformance, setTopPerformance] = useState<any>(null);
  const [insight, setInsight] = useState<string[]>([]);
  const [chart30Days, setChart30Days] = useState<any[]>([]);

  const loadDashboard = async () => {
    try {
      const response = await api.get('/dashboard-cob');
      const resData = response.data.data;
      setDashboard(resData.latest);
      setKpi(resData.kpi);
      setInsight(resData.insight);
      setTopPerformance(resData.topPerformance);
      setChart30Days(resData.chart30Days || []);
    } catch (error) {
      console.log('Error loading dashboard data:', error);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  useEffect(() => {
    setTitle('Dashboard Operasional');
    setHideNavbar(true);
    setShowBack(true);
    setShowSearch(false);
    setHideHeaderLeft(false);
    setHideHeader(false);
    return () => {
      setHideNavbar(false);
      setShowBack(false);
    };
  }, [setTitle, setHideNavbar, setShowBack]);

  useEffect(() => {
    const interval = setInterval(() => loadDashboard(), 300000);
    return () => clearInterval(interval);
  }, []);

  const isWarning = dashboard?.cod_ket?.trim();

  const averageTransaction = useMemo(() => {
    if (!chart30Days || chart30Days.length === 0) return '0.0';
    const total = chart30Days.reduce(
      (sum, item) => sum + Number(item.cod_trx || 0),
      0,
    );
    return (total / chart30Days.length / 1000000).toFixed(1);
  }, [chart30Days]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.background}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* HEADER SEKARANG DI DALAM SCROLLVIEW AGAR BISA DI-SCROLL */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Ringkasan Kerja</Text>
          </View>
          <View style={styles.dateBadge}>
            <Calendar size={13} color={theme.textSub} />
            <Text style={styles.dateText}>{dashboard?.cod_tgl ?? '-'}</Text>
          </View>
        </View>

        {/* BANNER STATUS SISTEM */}
        <View
          style={[
            styles.banner,
            isWarning ? styles.bannerWarning : styles.bannerNormal,
          ]}
        >
          <View style={styles.bannerHeader}>
            <View style={styles.bannerTitleRow}>
              {isWarning ? (
                <AlertTriangle size={18} color="#F59E0B" />
              ) : (
                <ShieldCheck size={18} color="#10B981" />
              )}
              <Text
                style={[
                  styles.bannerTitle,
                  { color: isWarning ? '#F59E0B' : '#10B981' },
                ]}
              >
                Kondisi Sistem Saat Ini
              </Text>
            </View>
            <Text
              style={[
                styles.statusTagText,
                { color: isWarning ? '#F59E0B' : '#10B981' },
              ]}
            >
              {isWarning ? '• ADA KENDALA' : '• NORMAL / LANCAR'}
            </Text>
          </View>
          <Text style={styles.bannerDesc}>
            {isWarning
              ? dashboard?.cod_ket
              : 'Semua jalur data berjalan sinkron. Tidak ada keterlambatan pengiriman data harian.'}
          </Text>
        </View>

        {/* RINGKASAN ANGKA UTAMA */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, styles.primaryAccentBorder]}>
            <View
              style={[
                styles.iconCircle,
                { backgroundColor: 'rgba(99, 102, 241, 0.15)' },
              ]}
            >
              <Zap size={18} color="#6366F1" />
            </View>
            <Text style={styles.statLabel}>TOTAL TRANSAKSI</Text>
            <Text style={styles.statValue}>
              {dashboard
                ? `${(Number(dashboard.cod_trx) / 1000000).toFixed(2)}`
                : '-'}
              <Text style={styles.statUnit}> Juta</Text>
            </Text>
          </View>

          <View style={[styles.statCard, styles.secondaryAccentBorder]}>
            <View
              style={[
                styles.iconCircle,
                { backgroundColor: 'rgba(139, 92, 246, 0.15)' },
              ]}
            >
              <Clock size={18} color="#8B5CF6" />
            </View>
            <Text style={styles.statLabel}>TOTAL DURASI PROSES</Text>
            <Text style={styles.statValue}>
              {dashboard?.cod_durasi?.split(':')[0] || '00'}
              <Text style={styles.statUnit}>jam </Text>
              {dashboard?.cod_durasi?.split(':')[1] || '00'}
              <Text style={styles.statUnit}>menit</Text>
            </Text>
          </View>
        </View>

        {/* SECTION METRIK 30 HARI */}
        <Text style={styles.miniSectionTitle}>RINGKASAN 30 HARI TERAKHIR</Text>
        <View style={styles.summaryContainer}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Total Hari COB</Text>
            <Text style={styles.summaryValue}>{chart30Days.length}</Text>
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Rata-rata Transaksi</Text>
            <Text style={styles.summaryValue}>{averageTransaction} Jt</Text>
          </View>
        </View>

        <View style={styles.summaryCardFull}>
          <Text style={styles.summaryLabel}>Performa Pergerakan 30 Hari</Text>
          <Text style={styles.summaryText}>
            Volume transaksi tertinggi terjadi pada{' '}
            <Text style={{ fontWeight: '700', color: theme.textMain }}>
              {topPerformance?.highestTransaction?.cod_tgl || '-'}
            </Text>{' '}
            dengan pencapaian total{' '}
            <Text style={{ fontWeight: '700', color: theme.textMain }}>
              {(
                Number(topPerformance?.highestTransaction?.cod_trx || 0) /
                1000000
              ).toFixed(1)}{' '}
              juta
            </Text>{' '}
            transaksi.
          </Text>
        </View>

        {/* DETAIL DURASI TIAP TAHAPAN */}
        <View style={styles.sectionHeaderContainer}>
          <Layers size={14} color="#6366F1" />
          <Text style={styles.sectionTitle}>Rincian Waktu Per Proses</Text>
        </View>

        <View style={styles.stageTrackContainer}>
          {[
            {
              tag: 'APK',
              label: 'Proses Sistem Aplikasi',
              value: dashboard?.cod_durasi_app,
            },
            {
              tag: 'SYS',
              label: 'Pengecekan Konsistensi Data',
              value: dashboard?.cod_sistemwide_app,
            },
            {
              tag: 'LAP',
              label: 'Penyusunan Laporan & Pembukuan',
              value: dashboard?.cod_reporting_app,
            },
            {
              tag: 'SOD',
              label: 'Persiapan Awal Hari Baru (SOD)',
              value: dashboard?.cod_sod_app,
            },
            {
              tag: 'NET',
              label: 'Pengecekan Jaringan Jual-Beli',
              value: dashboard?.cod_online_app,
            },
          ].map((item, index, arr) => (
            <View key={index} style={styles.trackItem}>
              <View style={styles.timelineVisual}>
                <View style={styles.timelineNode}>
                  <Text style={styles.nodeTagText}>{item.tag}</Text>
                </View>
                {index !== arr.length - 1 && (
                  <View style={styles.timelineLinkLine} />
                )}
              </View>
              <View style={styles.trackContent}>
                <Text style={styles.trackLabel} numberOfLines={1}>
                  {item.label}
                </Text>
                <Text style={styles.trackValue}>
                  {item.value || '00:00:00'}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* PERBANDINGAN DENGAN HARI SEBELUMNYA */}
        <View style={styles.gridTwoColumn}>
          <View style={styles.columnCard}>
            <Text style={styles.columnTitle}>Tren Jumlah Transaksi</Text>
            <View style={styles.kpiValueRow}>
              <Text
                style={[
                  styles.kpiValue,
                  { color: (kpi?.trxTrend ?? 0) >= 0 ? '#10B981' : '#EF4444' },
                ]}
              >
                {(kpi?.trxTrend ?? 0) >= 0 ? '+' : ''}
                {kpi?.trxTrend ?? 0}%
              </Text>
              <TrendingUp
                size={16}
                color={(kpi?.trxTrend ?? 0) >= 0 ? '#10B981' : '#EF4444'}
              />
            </View>
            <Text style={styles.kpiSub}>Dibandingkan rata-rata harian</Text>
          </View>

          <View style={styles.columnCard}>
            <Text style={styles.columnTitle}>Perubahan Kecepatan</Text>
            <View style={styles.kpiValueRow}>
              <Text
                style={[
                  styles.kpiValue,
                  {
                    color:
                      (kpi?.durationTrend ?? 0) <= 0 ? '#10B981' : '#EF4444',
                  },
                ]}
              >
                {kpi?.durationTrend ?? 0}m
              </Text>
              <Activity
                size={16}
                color={(kpi?.durationTrend ?? 0) <= 0 ? '#10B981' : '#EF4444'}
              />
            </View>
            <Text style={styles.kpiSub}>Selisih durasi penyelesaian</Text>
          </View>
        </View>

        {/* KARTU REKOMENDASI & DIAGNOSTIK */}
        <View style={styles.insightCard}>
          <View style={styles.insightHeader}>
            <Lightbulb size={16} color="#3B82F6" />
            <Text style={styles.insightHeaderTitle}>
              Analisis & Saran Sistem
            </Text>
          </View>
          {insight && insight.length > 0 ? (
            insight.map((item, index) => (
              <View key={index} style={styles.insightRow}>
                <Text style={styles.insightIndexText}>[{index + 1}]</Text>
                <Text style={styles.insightText}>{item}</Text>
              </View>
            ))
          ) : (
            <Text style={[styles.insightText, { fontStyle: 'italic' }]}>
              Belum ada rekomendasi baru untuk hari ini.
            </Text>
          )}
        </View>

        {/* REKOR HISTORIS */}
        <Text style={styles.miniSectionTitle}>REKOR TERTINGGI SISTEM</Text>
        <View style={styles.performanceContainer}>
          <View style={styles.performanceCard}>
            <Award size={14} color="#6366F1" style={styles.perfIcon} />
            <Text style={styles.performanceTitle}>Transaksi Terbanyak</Text>
            <Text style={styles.performanceValue}>
              {(
                Number(topPerformance?.highestTransaction?.cod_trx || 0) /
                1000000
              ).toFixed(1)}
              M
            </Text>
            <Text style={styles.performanceDate} numberOfLines={1}>
              Tercapai: {topPerformance?.highestTransaction?.cod_tgl || '-'}
            </Text>
          </View>

          <View style={styles.performanceCard}>
            <Zap size={14} color="#8B5CF6" style={styles.perfIcon} />
            <Text style={styles.performanceTitle}>Waktu Tercepat</Text>
            <Text style={styles.performanceValue}>
              {topPerformance?.fastestCob?.duration || '-'}
            </Text>
            <Text style={styles.performanceDate} numberOfLines={1}>
              Tercapai: {topPerformance?.fastestCob?.date || '-'}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
