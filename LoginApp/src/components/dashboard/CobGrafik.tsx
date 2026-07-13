import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
  Dimensions,
  ScrollView,
} from 'react-native';
import { LineChart, BarChart } from 'react-native-gifted-charts';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// ============================================================
// Types
// ============================================================

type ChartPoint = { value: number; label?: string; [key: string]: any };

type TabKey = 'daily' | 'monthly' | 'stage';

interface COBAnalyticsCardProps {
  // COB Harian — Transaction (bar, dalam Jt) & Duration (line, dalam jam desimal)
  cobTransactionData: ChartPoint[];
  cobDurationData: ChartPoint[];
  // Catatan operasional opsional per titik harian (index harus sejajar
  // dengan cobTransactionData), contoh: ["", "Gangguan jaringan", ""]
  dailyKeterangan?: string[];
  // COB Monthly — Awal Bulan vs Akhir Bulan
  monthStartData: ChartPoint[];
  monthEndData: ChartPoint[];
  // COB Stage
  applicationData: ChartPoint[];
  systemWideData: ChartPoint[];
  reportingData: ChartPoint[];
  sodData: ChartPoint[];
  onlineData: ChartPoint[];
}

// ============================================================
// Helpers umum
// ============================================================

const round = (n: number) => Math.round(n * 10) / 10;

function summarize(data: ChartPoint[]) {
  if (!data || data.length === 0) {
    return { latest: 0, avg: 0, peak: 0, trendUp: null as boolean | null };
  }
  const values = data.map(d => Number(d.value) || 0);
  const latest = values[values.length - 1];
  const prev = values.length > 1 ? values[values.length - 2] : latest;
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  const peak = Math.max(...values);
  return {
    latest: round(latest),
    avg: round(avg),
    peak: round(peak),
    trendUp: latest === prev ? null : latest > prev,
  };
}

// Palet warna yang lebih modern & kontras untuk tema gelap
const STAGE_COLORS = ['#38BDF8', '#34D399', '#FBBF24', '#F87171', '#C084FC'];

const formatMinutesToHHMM = (minutes: number) => {
  if (isNaN(minutes)) return '00:00';

  const h = Math.floor(minutes / 60)
    .toString()
    .padStart(2, '0');

  const m = Math.round(minutes % 60)
    .toString()
    .padStart(2, '0');

  return `${h}:${m}`;
};

const TABS: { key: TabKey; label: string }[] = [
  { key: 'daily', label: 'Harian' },
  { key: 'monthly', label: 'Bulanan' },
  { key: 'stage', label: 'Tahapan' },
];

// ============================================================
// Small subcomponents (dipakai di tab Bulanan & Tahapan / tema terang)
// ============================================================

const StatBadge = ({
  label,
  value,
  color,
  suffix,
}: {
  label: string;
  value: number;
  color: string;
  suffix?: string;
}) => (
  <View style={styles.statBadge}>
    <View style={[styles.statDot, { backgroundColor: color }]} />
    <View>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>
        {value}
        {suffix ?? ''}
      </Text>
    </View>
  </View>
);

const LegendItem = ({ color, label }: { color: string; label: string }) => (
  <View style={styles.legendItem}>
    <View style={[styles.legendDot, { backgroundColor: color }]} />
    <Text style={styles.legendText}>{label}</Text>
  </View>
);

// Legend versi gelap (kotak = bar, lingkaran = line) — dipakai di tab Harian & Stage
const DarkLegendItem = ({
  color,
  label,
  circle,
}: {
  color: string;
  label: string;
  circle?: boolean;
}) => (
  <View style={styles.darkLegendItem}>
    <View
      style={[
        styles.darkLegendDot,
        { backgroundColor: color, borderRadius: circle ? 6 : 4 },
      ]}
    />
    <Text style={styles.darkLegendText}>{label}</Text>
  </View>
);

const EmptyState = ({ dark }: { dark?: boolean } = {}) => (
  <View style={styles.emptyState}>
    <Text style={dark ? styles.emptyStateTextDark : styles.emptyStateText}>
      Belum ada data untuk ditampilkan
    </Text>
  </View>
);

// Shared pointer/tooltip config untuk grafik tema terang (Monthly)
const pointerConfig = {
  pointerStripHeight: 120,
  pointerStripColor: '#94A3B8',
  pointerStripWidth: 1,
  pointerColor: '#1E293B',
  radius: 5,
  pointerLabelWidth: 90,
  pointerLabelHeight: 40,
  activatePointersOnLongPress: false,
  autoAdjustPointerLabelPosition: true,
  pointerLabelComponent: (items: any[]) => (
    <View style={styles.tooltip}>
      {items.map((item, idx) => (
        <Text key={idx} style={styles.tooltipText}>
          {item.value}
        </Text>
      ))}
    </View>
  ),
};

// ============================================================
// DailyCOBChart — bar (Transaction, Jt) + line (Duration, HH:MM)
// ============================================================

function DailyCOBChart({
  cobTransactionData,
  cobDurationData,
  dailyKeterangan,
}: {
  cobTransactionData: ChartPoint[];
  cobDurationData: ChartPoint[];
  dailyKeterangan?: string[];
}) {
  const screenWidth = Dimensions.get('window').width;

  const trxValues = cobTransactionData.map(d => Number(d.value) || 0);
  const durationMinutes = cobDurationData.map(d => (Number(d.value) || 0) * 60);

  const maxTrx = trxValues.length > 0 ? Math.max(...trxValues) : 0;
  let leftStep = Math.ceil(maxTrx / 3.5);
  if (leftStep < 1) leftStep = 1;
  const chartMaxValue = leftStep * 4;

  const leftYAxisLabels = [
    '0',
    `${leftStep} Jt`,
    `${leftStep * 2} Jt`,
    `${leftStep * 3} Jt`,
    `${chartMaxValue} Jt`,
  ];

  const safeDurationMinutes =
    durationMinutes.length > 0 ? durationMinutes : [0];
  const maxLineMinutes = Math.max(...safeDurationMinutes);
  const minLineMinutes = Math.min(...safeDurationMinutes);

  const baseOffset = Math.max(0, Math.floor((minLineMinutes - 30) / 30) * 30);
  let spread = maxLineMinutes - baseOffset;
  if (spread <= 0) spread = 60;
  const virtualTotalRange = spread / 0.6;

  let niceInterval = Math.ceil(virtualTotalRange / 4 / 30) * 30;
  if (niceInterval < 30) niceInterval = 30;
  const virtualMaxLine = baseOffset + niceInterval * 4;
  const scaleRatio = chartMaxValue / (virtualMaxLine - baseOffset);

  const rightYAxisLabels = [
    formatMinutesToHHMM(baseOffset),
    formatMinutesToHHMM(baseOffset + niceInterval),
    formatMinutesToHHMM(baseOffset + niceInterval * 2),
    formatMinutesToHHMM(baseOffset + niceInterval * 3),
    formatMinutesToHHMM(virtualMaxLine),
  ];

  const notesData = cobTransactionData
    .map((item, i) => ({
      label: item.label ?? `${i + 1}`,
      ket: dailyKeterangan?.[i] ?? '',
    }))
    .filter(n => n.ket && n.ket.trim() !== '');

  const barData = cobTransactionData.map((item, index) => {
    const val = Number(item.value) || 0;
    const ket = dailyKeterangan?.[index] ?? '';
    const hasKet = ket.trim().length > 0;

    return {
      value: val,
      label: item.label ?? `${index + 1}`,
      labelTextStyle: {
        color: hasKet ? '#FFC107' : '#9CA3AF',
        fontSize: 9,
      },
      frontColor: '#20A090',
      topLabelComponent: () => (
        <Text style={styles.dailyBarTopLabel}>
          {round(val)} Jt{hasKet ? '*' : ''}
        </Text>
      ),
    };
  });

  const lineData = durationMinutes.map(minutes => ({
    value: Math.max(0, (minutes - baseOffset) * scaleRatio),
    customDataPoint: () => (
      <View style={styles.customPointWrap}>
        <View style={styles.customPointDot} />
        <Text style={styles.customPointLabel}>
          {formatMinutesToHHMM(minutes)}
        </Text>
      </View>
    ),
  }));

  return (
    <View style={styles.darkCard}>
      <View style={styles.darkLegendRow}>
        <DarkLegendItem color="#20A090" label="Transaction" />
        <DarkLegendItem color="#7B61FF" label="Duration" circle />
      </View>

      <View style={styles.dualAxisWrap}>
        <View pointerEvents="none" style={styles.rightAxisDaily}>
          {rightYAxisLabels.map((l: string, i: number) => (
            <Text
              key={i}
              style={[styles.rightAxisLabel, { top: 200 - (i / 4) * 200 - 7 }]}
            >
              {l}
            </Text>
          ))}
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <BarChart
            data={barData}
            width={Math.max(screenWidth * 0.8, barData.length * 60)}
            height={200}
            isAnimated={false}
            barWidth={24}
            spacing={20}
            initialSpacing={30}
            endSpacing={30}
            noOfSections={4}
            maxValue={chartMaxValue}
            yAxisLabelTexts={leftYAxisLabels}
            yAxisThickness={0}
            xAxisColor="#374151"
            yAxisLabelWidth={35}
            xAxisLabelsHeight={30}
            yAxisTextStyle={styles.darkAxisLabel}
            rulesType="dashed"
            rulesColor="#333"
            showLine
            lineData={lineData}
            lineConfig={{ color: '#7B61FF', thickness: 2, curved: true }}
          />
        </ScrollView>
      </View>

      {notesData.length > 0 && (
        <View style={styles.footnoteWrap}>
          <Text style={styles.footnoteTitle}>Catatan Operasional:</Text>
          {notesData.map((n, i) => (
            <Text key={i} style={styles.footnoteText}>
              <Text style={styles.footnoteLabel}>{n.label} * : </Text>
              {n.ket}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
}

// ============================================================
// StageProcessChart — Diperbarui (Lebih Rapi & Modern)
// ============================================================

function StageProcessChart({
  applicationData,
  systemWideData,
  reportingData,
  sodData,
  onlineData,
}: {
  applicationData: ChartPoint[];
  systemWideData: ChartPoint[];
  reportingData: ChartPoint[];
  sodData: ChartPoint[];
  onlineData: ChartPoint[];
}) {
  const screenWidth = Dimensions.get('window').width;

  const datasets = [
    { name: 'App', data: applicationData },
    { name: 'Sys', data: systemWideData },
    { name: 'Rep', data: reportingData },
    { name: 'SOD', data: sodData },
    { name: 'Onl', data: onlineData },
  ];

  const labels = applicationData.map(d => d.label ?? '');
  const numDays = labels.length;
  const isBarChart = numDays <= 3;

  let maxValue = 0;
  datasets.forEach(ds => {
    ds.data.forEach(x => {
      if (x.value > maxValue) maxValue = x.value;
    });
  });
  maxValue = Math.ceil(maxValue / 30) * 30 + 30;

  // Pointer config sleek untuk multiple lines
  const stagePointerConfig = {
    pointerStripHeight: 200,
    pointerStripColor: '#64748B',
    pointerStripWidth: 1,
    pointerColor: '#FFFFFF',
    radius: 4,
    pointerLabelWidth: 80,
    pointerLabelHeight: 110,
    activatePointersOnLongPress: false,
    autoAdjustPointerLabelPosition: true,
    pointerLabelComponent: (items: any[]) => {
      return (
        <View style={styles.stageTooltip}>
          {items.map((item, idx) => (
            <View key={idx} style={styles.stageTooltipRow}>
              <View
                style={[
                  styles.stageTooltipDot,
                  { backgroundColor: STAGE_COLORS[idx] },
                ]}
              />
              <Text style={styles.stageTooltipText}>
                {formatMinutesToHHMM(item.value)}
              </Text>
            </View>
          ))}
        </View>
      );
    },
  };

  const buildLineData = (data: ChartPoint[]) =>
    data.map(item => ({
      value: item.value,
    }));

  const buildGroupedBarData = () => {
    const barData: any[] = [];
    datasets.forEach((dataset, stageIdx) => {
      dataset.data.forEach((item, dateIdx) => {
        const isLastGroup = dateIdx === numDays - 1;
        barData.push({
          value: item.value,
          frontColor: STAGE_COLORS[stageIdx],
          // Beri jarak antar grup harian
          spacing: isLastGroup ? 20 : 6,
          // Label hanya muncul di bar tengah setiap grup untuk mewakili tanggal
          label: stageIdx === 2 ? labels[dateIdx] : '',
          labelTextStyle: {
            color: '#9CA3AF',
            fontSize: 10,
            textAlign: 'center',
          },
        });
      });
    });
    return barData;
  };

  return (
    <View style={styles.darkCard}>
      <View style={styles.darkLegendRow}>
        {datasets.map((item, idx) => (
          <DarkLegendItem
            key={idx}
            color={STAGE_COLORS[idx]}
            label={item.name}
            circle={!isBarChart}
          />
        ))}
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {isBarChart ? (
          <BarChart
            data={buildGroupedBarData()}
            barWidth={18}
            barBorderRadius={3}
            height={220}
            width={Math.max(screenWidth * 0.75, numDays * 150)}
            initialSpacing={15}
            endSpacing={40}
            maxValue={maxValue}
            noOfSections={5}
            yAxisThickness={0}
            xAxisColor="#374151"
            rulesType="dashed"
            rulesColor="#333"
            yAxisLabelWidth={45}
            yAxisTextStyle={{
              color: '#9CA3AF',
              fontSize: 10,
            }}
            formatYLabel={label => formatMinutesToHHMM(Number(label))}
            isAnimated={false}
          />
        ) : (
          <LineChart
            curved
            data={buildLineData(applicationData)}
            data2={buildLineData(systemWideData)}
            data3={buildLineData(reportingData)}
            data4={buildLineData(sodData)}
            data5={buildLineData(onlineData)}
            color1={STAGE_COLORS[0]}
            color2={STAGE_COLORS[1]}
            color3={STAGE_COLORS[2]}
            color4={STAGE_COLORS[3]}
            color5={STAGE_COLORS[4]}
            dataPointsColor1={STAGE_COLORS[0]}
            dataPointsColor2={STAGE_COLORS[1]}
            dataPointsColor3={STAGE_COLORS[2]}
            dataPointsColor4={STAGE_COLORS[3]}
            dataPointsColor5={STAGE_COLORS[4]}
            dataPointsRadius1={3}
            dataPointsRadius2={3}
            dataPointsRadius3={3}
            dataPointsRadius4={3}
            dataPointsRadius5={3}
            thickness={3}
            height={220}
            width={Math.max(screenWidth * 0.75, numDays * 60)}
            spacing={60}
            initialSpacing={20}
            endSpacing={40}
            adjustToWidth={false}
            focusEnabled
            maxValue={maxValue}
            noOfSections={5}
            xAxisLabelTexts={labels}
            xAxisLabelTextStyle={{
              color: '#9CA3AF',
              fontSize: 10,
              rotation: -30,
              marginTop: 10,
              width: 60,
            }}
            yAxisLabelWidth={45}
            yAxisTextStyle={{
              color: '#9CA3AF',
              fontSize: 10,
            }}
            yAxisThickness={0}
            xAxisThickness={1}
            xAxisLabelsHeight={30}
            xAxisColor="#374151"
            rulesType="dashed"
            rulesColor="#333"
            formatYLabel={label => formatMinutesToHHMM(Number(label))}
            pointerConfig={stagePointerConfig}
            isAnimated={false}
          />
        )}
      </ScrollView>
    </View>
  );
}

// ============================================================
// Main component
// ============================================================

export default function COBAnalyticsCard({
  cobTransactionData,
  cobDurationData,
  dailyKeterangan,
  monthStartData,
  monthEndData,
  applicationData,
  systemWideData,
  reportingData,
  sodData,
  onlineData,
}: COBAnalyticsCardProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('daily');

  const handleTabChange = (tab: TabKey) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setActiveTab(tab);
  };

  const monthlyStats = useMemo(
    () => ({
      start: summarize(monthStartData),
      end: summarize(monthEndData),
    }),
    [monthStartData, monthEndData],
  );

  const isDailyEmpty =
    (!cobTransactionData || cobTransactionData.length === 0) &&
    (!cobDurationData || cobDurationData.length === 0);
  const isMonthlyEmpty =
    (!monthStartData || monthStartData.length === 0) &&
    (!monthEndData || monthEndData.length === 0);
  const isStageEmpty =
    !applicationData?.length &&
    !systemWideData?.length &&
    !reportingData?.length &&
    !sodData?.length &&
    !onlineData?.length;

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Analitik COB</Text>
        <Text style={styles.subtitle}>
          Pantau harian, siklus bulanan, dan tahapan proses Close of Business
        </Text>
      </View>

      {/* Tab selector */}
      <View style={styles.tabBar}>
        {TABS.map(tab => {
          const isActive = tab.key === activeTab;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tabButton, isActive && styles.tabButtonActive]}
              onPress={() => handleTabChange(tab.key)}
              activeOpacity={0.8}
            >
              <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ============= TAB: HARIAN ============= */}
      {activeTab === 'daily' && (
        <View style={styles.darkSection}>
          {isDailyEmpty ? (
            <EmptyState dark />
          ) : (
            <DailyCOBChart
              cobTransactionData={cobTransactionData}
              cobDurationData={cobDurationData}
              dailyKeterangan={dailyKeterangan}
            />
          )}
        </View>
      )}

      {/* ============= TAB: MONTHLY ============= */}
      {activeTab === 'monthly' && (
        <View style={styles.section}>
          {isMonthlyEmpty ? (
            <EmptyState />
          ) : (
            <>
              <View style={styles.statsRow}>
                <StatBadge
                  label="Awal bulan (avg)"
                  value={monthlyStats.start.avg}
                  color="#F59E0B"
                />
                <StatBadge
                  label="Akhir bulan (avg)"
                  value={monthlyStats.end.avg}
                  color="#EF4444"
                />
                <StatBadge
                  label="Selisih terakhir"
                  value={round(
                    monthlyStats.end.latest - monthlyStats.start.latest,
                  )}
                  color={
                    monthlyStats.end.latest - monthlyStats.start.latest >= 0
                      ? '#10B981'
                      : '#EF4444'
                  }
                />
              </View>

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
                  startOpacity={0.3}
                  endOpacity={0}
                  thickness1={3}
                  thickness2={3}
                  hideDataPoints={false}
                  dataPointsRadius1={4}
                  dataPointsRadius2={4}
                  dataPointsColor1="#F59E0B"
                  dataPointsColor2="#EF4444"
                  hideRules
                  rulesType="dashed"
                  rulesColor="#F1F5F9"
                  hideYAxisText
                  yAxisThickness={0}
                  xAxisThickness={0.5}
                  xAxisColor="#E2E8F0"
                  spacing={45}
                  initialSpacing={10}
                  pointerConfig={pointerConfig}
                  isAnimated
                  animationDuration={600}
                />
              </View>

              <View style={styles.chartLegend}>
                <LegendItem color="#F59E0B" label="Awal Bulan" />
                <LegendItem color="#EF4444" label="Akhir Bulan" />
              </View>
            </>
          )}
        </View>
      )}

      {/* ============= TAB: STAGE ============= */}
      {activeTab === 'stage' && (
        <View style={styles.darkSection}>
          {isStageEmpty ? (
            <EmptyState dark />
          ) : (
            <StageProcessChart
              applicationData={applicationData}
              systemWideData={systemWideData}
              reportingData={reportingData}
              sodData={sodData}
              onlineData={onlineData}
            />
          )}
        </View>
      )}
    </View>
  );
}

// ============================================================
// Styles
// ============================================================

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#0F172A',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  header: {
    marginBottom: 14,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 9,
    alignItems: 'center',
  },
  tabButtonActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#0F172A',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  tabTextActive: {
    color: '#0F172A',
  },
  section: {
    width: '100%',
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 14,
  },
  statBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 10,
    gap: 8,
    minWidth: '30%',
  },
  statDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statLabel: {
    fontSize: 10,
    color: '#94A3B8',
  },
  statValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  chartCard: {
    borderRadius: 12,
    paddingVertical: 8,
  },
  chartLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
    color: '#475569',
  },
  emptyState: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    fontSize: 13,
    color: '#94A3B8',
  },
  emptyStateTextDark: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  tooltip: {
    backgroundColor: '#1E293B',
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  tooltipText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  // ---- Gaya gelap untuk tab Harian & Stage ----
  darkSection: {
    width: '100%',
  },
  darkCard: {
    marginTop: 4,
    paddingTop: 15,
    paddingBottom: 10,
    backgroundColor: '#0D1117',
    paddingLeft: 5,
    paddingRight: 10,
    borderRadius: 12,
    overflow: 'hidden',
  },
  darkLegendRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 15,
  },
  darkLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  darkLegendDot: {
    width: 10,
    height: 10,
  },
  darkLegendText: {
    color: '#FFFFFF',
    fontSize: 11,
  },
  dualAxisWrap: {
    position: 'relative',
    paddingRight: 55,
  },
  rightAxisDaily: {
    position: 'absolute',
    right: 0,
    top: 10,
    backgroundColor: '#0D1117',
    height: 230,
    width: 40,
    zIndex: 1,
  },
  rightAxisLabel: {
    position: 'absolute',
    right: 5,
    color: '#ccc',
    fontSize: 10,
    textAlign: 'right',
  },
  darkAxisLabel: {
    color: '#9CA3AF',
    fontSize: 10,
  },
  dailyBarTopLabel: {
    color: '#fff',
    fontSize: 9,
    fontWeight: 'bold',
    width: 50,
    textAlign: 'center',
    marginLeft: -13,
    marginBottom: 4,
  },
  customPointWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  customPointDot: {
    width: 8,
    height: 8,
    backgroundColor: '#FFC107',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#0D1117',
    zIndex: 10,
  },
  customPointLabel: {
    color: '#FFC107',
    fontSize: 9,
    fontWeight: 'bold',
    position: 'absolute',
    top: 12,
    width: 50,
    textAlign: 'center',
    zIndex: 10,
  },
  footnoteWrap: {
    marginTop: 20,
    paddingTop: 15,
    paddingRight: 15,
    borderTopWidth: 1,
    borderColor: '#1F2937',
  },
  footnoteTitle: {
    color: '#F9FAFB',
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  footnoteText: {
    color: '#9CA3AF',
    fontSize: 9,
    marginBottom: 4,
    lineHeight: 13,
  },
  footnoteLabel: {
    color: '#FFC107',
    fontWeight: 'bold',
  },
  stageTooltip: {
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 4,
  },
  stageTooltipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stageTooltipDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  stageTooltipText: {
    color: '#F8FAFC',
    fontSize: 11,
    fontWeight: '600',
  },
});
