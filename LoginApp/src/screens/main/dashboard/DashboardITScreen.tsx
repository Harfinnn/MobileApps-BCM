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

export default function DashboardITScreen() {
  const { setTitle, setHideNavbar, setShowBack } = useLayout();
  const [dashboard, setDashboard] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [cobMonthly, setCobMonthly] = useState<any>(null);
  const [cobStage, setCobStage] = useState<any[]>([]);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const { data } = await API.get('/dashboard-it');

      setDashboard(data);
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
      value: item.total,
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

  const applicationData = cobStage.map((item: any) => ({
    value: item.application,
    label: item.tanggal.substring(5),
  }));

  const systemWideData = cobStage.map((item: any) => ({
    value: item.system_wide,
  }));

  const reportingData = cobStage.map((item: any) => ({
    value: item.reporting,
  }));

  const sodData = cobStage.map((item: any) => ({
    value: item.sod,
  }));

  const onlineData = cobStage.map((item: any) => ({
    value: item.online,
  }));

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

        <View style={styles.grid}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Application</Text>

            <Text style={styles.cardValue}>
              {dashboard?.application?.total ?? 0}
            </Text>

            <Text style={styles.cardFooter}>Total Application</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Availability</Text>

            <Text style={styles.cardValue}>
              {dashboard?.availability?.percentage ?? 0}%
            </Text>

            <Text style={styles.cardFooter}>Current Availability</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>DRP</Text>

            <Text style={styles.cardValue}>
              {dashboard?.drp?.summary?.completed ?? 0}
            </Text>

            <Text style={styles.cardFooter}>Completed DRP</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>COB</Text>

            <Text style={styles.cardValue}>
              {dashboard?.cob?.trend?.length ?? 0}
            </Text>

            <Text style={styles.cardFooter}>Latest COB</Text>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Application Overview</Text>

          <View style={styles.chartCard}>
            <PieChart
              data={applicationPieData}
              donut
              radius={90}
              innerRadius={45}
              showText
              textColor="white"
              textSize={12}
              focusOnPress
            />

            <View style={{ marginTop: 20 }}>
              {applicationPieData.map((item: any, index: number) => (
                <View key={index} style={styles.legendItem}>
                  <View
                    style={[
                      styles.legendDot,
                      {
                        backgroundColor: item.color,
                      },
                    ]}
                  />

                  <Text style={styles.legendLabel}>{item.label}</Text>

                  <Text style={styles.legendValue}>{item.value}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Availability</Text>

          <View style={styles.availabilityCard}>
            <Text style={styles.availabilityValue}>
              {dashboard?.availability?.percentage ?? 0}%
            </Text>

            <Text style={styles.availabilityLabel}>System Availability</Text>

            <View style={styles.rowStats}>
              <View style={styles.smallCard}>
                <Text style={styles.smallValue}>
                  {dashboard?.availability?.downtime_hour ?? 0}
                </Text>

                <Text style={styles.smallLabel}>Downtime</Text>
              </View>

              <View style={styles.smallCard}>
                <Text style={styles.smallValue}>
                  {dashboard?.availability?.incident ?? 0}
                </Text>

                <Text style={styles.smallLabel}>Incident</Text>
              </View>

              <View style={styles.smallCard}>
                <Text style={styles.smallValue}>
                  {dashboard?.availability?.tat_hour ?? 0}
                </Text>

                <Text style={styles.smallLabel}>Avg TAT</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>COB Trend</Text>

          <View style={styles.chartCard}>
            <LineChart
              areaChart
              curved
              data={cobTransactionData}
              data2={cobDurationData}
              color1="#2563EB"
              color2="#10B981"
              startFillColor1="#93C5FD"
              endFillColor1="#FFFFFF"
              startOpacity={0.25}
              endOpacity={0}
              thickness1={3}
              thickness2={3}
              hideDataPoints={false}
              spacing={45}
              initialSpacing={10}
              yAxisThickness={0}
              xAxisThickness={0}
              hideRules
              hideYAxisText
            />
          </View>
          <View style={styles.chartLegend}>
            <View style={styles.legendBox}>
              <View
                style={[styles.legendColor, { backgroundColor: '#2563EB' }]}
              />

              <Text>Transaction</Text>
            </View>

            <View style={styles.legendBox}>
              <View
                style={[styles.legendColor, { backgroundColor: '#10B981' }]}
              />

              <Text>Duration</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>COB Monthly</Text>

          <View style={styles.chartCard}>
            <LineChart
              curved
              areaChart
              data={monthStartData}
              data2={monthEndData}
              color1="#F59E0B"
              color2="#EF4444"
              startFillColor1="#FDE68A"
              startFillColor2="#FCA5A5"
              endFillColor1="#FFFFFF"
              endFillColor2="#FFFFFF"
              thickness1={3}
              thickness2={3}
              hideRules
              hideYAxisText
              yAxisThickness={0}
              xAxisThickness={0}
            />

            <View style={styles.chartLegend}>
              <View style={styles.legendBox}>
                <View
                  style={[
                    styles.legendColor,
                    {
                      backgroundColor: '#F59E0B',
                    },
                  ]}
                />
                <Text>Beginning</Text>
              </View>

              <View style={styles.legendBox}>
                <View
                  style={[
                    styles.legendColor,
                    {
                      backgroundColor: '#EF4444',
                    },
                  ]}
                />
                <Text>End</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>COB Stage</Text>

          <View style={styles.chartCard}>
            <LineChart
              data={applicationData}
              data2={systemWideData}
              data3={reportingData}
              data4={sodData}
              data5={onlineData}
              curved
              color1="#2563EB"
              color2="#10B981"
              color3="#F59E0B"
              color4="#EF4444"
              color5="#8B5CF6"
              thickness1={3}
              thickness2={3}
              thickness3={3}
              thickness4={3}
              thickness5={3}
              hideDataPoints={false}
              hideRules
              yAxisThickness={0}
              xAxisThickness={0}
              hideYAxisText
              spacing={38}
              initialSpacing={10}
            />

            <View style={styles.stageLegend}>
              <View style={styles.legendRow}>
                <View
                  style={[styles.legendColor, { backgroundColor: '#2563EB' }]}
                />
                <Text style={styles.legendText}>Application</Text>
              </View>

              <View style={styles.legendRow}>
                <View
                  style={[styles.legendColor, { backgroundColor: '#10B981' }]}
                />
                <Text style={styles.legendText}>System Wide</Text>
              </View>

              <View style={styles.legendRow}>
                <View
                  style={[styles.legendColor, { backgroundColor: '#F59E0B' }]}
                />
                <Text style={styles.legendText}>Reporting</Text>
              </View>

              <View style={styles.legendRow}>
                <View
                  style={[styles.legendColor, { backgroundColor: '#EF4444' }]}
                />
                <Text style={styles.legendText}>SOD</Text>
              </View>

              <View style={styles.legendRow}>
                <View
                  style={[styles.legendColor, { backgroundColor: '#8B5CF6' }]}
                />
                <Text style={styles.legendText}>Online</Text>
              </View>
            </View>
          </View>
        </View>

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
          <Text style={styles.sectionTitle}>Outstanding DRP</Text>

          <View style={styles.chartCard}>
            {dashboard?.drp?.outstanding_list?.length ? (
              dashboard.drp.outstanding_list.map((item: any) => (
                <View key={item.dr_id} style={styles.drpItem}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.drpTitle}>{item.dbma_nama}</Text>

                    <Text style={styles.drpSubtitle}>
                      {item.target_dc} → {item.target_drc}
                    </Text>
                  </View>

                  <Text style={styles.drpDate}>{item.dr_tgl_new_propose}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>Tidak ada Outstanding DRP</Text>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>RSD</Text>

          <View style={styles.placeholderCard}>
            <Text style={styles.placeholderText}>RSD Summary & Monthly</Text>
          </View>
        </View>

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
});
