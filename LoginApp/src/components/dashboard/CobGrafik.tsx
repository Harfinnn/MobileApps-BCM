import React, { useMemo, useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import Animated, {
  FadeInDown,
  FadeInRight,
  FadeOutUp,
  LinearTransition,
} from 'react-native-reanimated';
import { LineChart, BarChart } from 'react-native-gifted-charts';

// ============================================================
// Types
// ============================================================

type ChartPoint = { value: number; label?: string; [key: string]: any };

type TabKey = 'daily' | 'monthly' | 'stage' | 'bom' | 'boy' | 'eom' | 'eoy';

interface COBAnalyticsCardProps {
  cobTransactionData: ChartPoint[];
  cobDurationData: ChartPoint[];
  bomTransactionData: ChartPoint[];
  bomDurationData: ChartPoint[];
  bomKeterangan?: string[];
  eomDurationData: ChartPoint[];
  eomTransactionData: ChartPoint[];
  eomKeterangan?: string[];
  boyTransactionData: ChartPoint[];
  boyDurationData: ChartPoint[];
  eoyTransactionData: ChartPoint[];
  eoyDurationData: ChartPoint[];
  eoyKeterangan?: string[];
  boyKeterangan?: string[];
  dailyKeterangan?: string[];
  monthTransactionData: ChartPoint[];
  monthDurationData: ChartPoint[];
  monthlyKeterangan?: string[];
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
  { key: 'daily', label: 'COB' },
  { key: 'stage', label: 'Stage' },
  { key: 'bom', label: 'BOM' },
  { key: 'boy', label: 'BOY' },
  { key: 'eom', label: 'EOM' },
  { key: 'eoy', label: 'EOY' },
  // { key: 'monthly', label: 'Bulanan' },
];

// ============================================================
// Small subcomponents (Optimized with React.memo)
// ============================================================

const TrendArrow = React.memo(({ up }: { up: boolean | null }) => {
  if (up === null) return <Text style={styles.trendNeutral}>—</Text>;
  return (
    <Text style={[styles.trendArrow, up ? styles.trendUp : styles.trendDown]}>
      {up ? '▲' : '▼'}
    </Text>
  );
});

const SummaryStatCard = React.memo(
  ({
    label,
    value,
    color,
    suffix,
    diffLabel,
    trendUp,
  }: {
    label: string;
    value: number;
    color: string;
    suffix?: string;
    diffLabel?: string;
    trendUp?: boolean | null;
  }) => (
    <View style={styles.monthlyStatCard}>
      <View style={styles.monthlyStatHeader}>
        <View style={[styles.statDot, { backgroundColor: color }]} />
        <Text style={styles.monthlyStatLabel}>{label}</Text>
      </View>
      <Text style={styles.monthlyStatValue}>
        {value}
        {suffix ?? ''}
      </Text>
      {diffLabel !== undefined && (
        <View style={styles.monthlyStatDeltaRow}>
          <TrendArrow up={trendUp ?? null} />
          <Text
            style={[
              styles.monthlyStatDelta,
              trendUp === null
                ? styles.trendNeutral
                : trendUp
                ? styles.trendUp
                : styles.trendDown,
            ]}
          >
            {diffLabel}
          </Text>
        </View>
      )}
    </View>
  ),
);

const DarkLegendItem = React.memo(
  ({
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
  ),
);

const EmptyState = React.memo(({ dark }: { dark?: boolean } = {}) => (
  <View style={styles.emptyState}>
    <Text style={dark ? styles.emptyStateTextDark : styles.emptyStateText}>
      Belum ada data untuk ditampilkan
    </Text>
  </View>
));

// ============================================================
// TransactionDurationChart (Optimized calculations)
// ============================================================

const TransactionDurationChart = React.memo(function TransactionDurationChart({
  transactionData,
  durationData,
  keterangan,
  transactionLabel = 'Transaction',
  durationLabel = 'Duration',
  noteTitle = 'Catatan Operasional:',
}: {
  transactionData: ChartPoint[];
  durationData: ChartPoint[];
  keterangan?: string[];
  transactionLabel?: string;
  durationLabel?: string;
  noteTitle?: string;
}) {
  const { width: screenWidth } = useWindowDimensions();

  // Membungkus semua kalkulasi chart di dalam useMemo
  const chartData = useMemo(() => {
    const trxValues = transactionData.map(d => Number(d.value) || 0);
    const durationMinutes = durationData.map(d => (Number(d.value) || 0) * 60);

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

    const notesData = transactionData
      .map((item, i) => ({
        label: item.label ?? `${i + 1}`,
        ket: keterangan?.[i] ?? '',
      }))
      .filter(n => n.ket && n.ket.trim() !== '');

    const barData = transactionData.map((item, index) => {
      const val = Number(item.value) || 0;
      const ket = keterangan?.[index] ?? '';
      const hasKet = ket.trim().length > 0;

      return {
        value: val,
        label: item.label ?? `${index + 1}`,
        labelTextStyle: {
          color: hasKet ? '#FFC107' : '#9CA3AF',
          fontSize: 9,
          marginTop: 20,
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

    return {
      barData,
      lineData,
      leftYAxisLabels,
      rightYAxisLabels,
      chartMaxValue,
      notesData,
    };
  }, [transactionData, durationData, keterangan]);

  return (
    <View style={styles.darkCard}>
      <View style={styles.darkLegendRow}>
        <DarkLegendItem color="#20A090" label={transactionLabel} />
        <DarkLegendItem color="#7B61FF" label={durationLabel} circle />
      </View>

      <View style={styles.dualAxisWrap}>
        <View pointerEvents="none" style={styles.rightAxisDaily}>
          {chartData.rightYAxisLabels.map((l: string, i: number) => (
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
            data={chartData.barData}
            width={Math.max(screenWidth * 0.8, chartData.barData.length * 60)}
            height={200}
            isAnimated={false}
            barWidth={24}
            spacing={20}
            initialSpacing={30}
            endSpacing={30}
            noOfSections={4}
            maxValue={chartData.chartMaxValue}
            yAxisLabelTexts={chartData.leftYAxisLabels}
            yAxisThickness={0}
            xAxisColor="#374151"
            yAxisLabelWidth={35}
            xAxisLabelsHeight={40}
            xAxisLabelsVerticalShift={15}
            yAxisTextStyle={styles.darkAxisLabel}
            rulesType="dashed"
            rulesColor="#333"
            showLine
            lineData={chartData.lineData}
            lineConfig={{ color: '#7B61FF', thickness: 2, curved: true }}
          />
        </ScrollView>
      </View>

      {chartData.notesData.length > 0 && (
        <View style={styles.footnoteWrap}>
          <Text style={styles.footnoteTitle}>{noteTitle}</Text>
          {chartData.notesData.map((n, i) => (
            <Text key={i} style={styles.footnoteText}>
              <Text style={styles.footnoteLabel}>{n.label} * : </Text>
              {n.ket}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
});

// ============================================================
// StageProcessChart (Optimized calculations)
// ============================================================

const StageProcessChart = React.memo(function StageProcessChart({
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
  const { width: screenWidth } = useWindowDimensions();

  const chartData = useMemo(() => {
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

    const buildLineData = (data: ChartPoint[]) =>
      data.map(item => ({
        value: item.value,
      }));

    const barData: any[] = [];
    if (isBarChart) {
      datasets.forEach((dataset, stageIdx) => {
        dataset.data.forEach((item, dateIdx) => {
          const isLastGroup = dateIdx === numDays - 1;
          barData.push({
            value: item.value,
            frontColor: STAGE_COLORS[stageIdx],
            spacing: isLastGroup ? 20 : 6,
            label: stageIdx === 2 ? labels[dateIdx] : '',
            labelTextStyle: {
              color: '#9CA3AF',
              fontSize: 10,
              textAlign: 'center',
            },
          });
        });
      });
    }

    return {
      datasets,
      labels,
      isBarChart,
      maxValue,
      numDays,
      barData,
      buildLineData,
    };
  }, [applicationData, systemWideData, reportingData, sodData, onlineData]);

  // Pointer config dipisahkan agar referensi tidak terus menerus baru
  const stagePointerConfig = useMemo(
    () => ({
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
    }),
    [],
  );

  const formatLabelStr = useCallback(
    (label: string) => formatMinutesToHHMM(Number(label)),
    [],
  );

  return (
    <View style={styles.darkCard}>
      <View style={styles.darkLegendRow}>
        {chartData.datasets.map((item, idx) => (
          <DarkLegendItem
            key={idx}
            color={STAGE_COLORS[idx]}
            label={item.name}
            circle={!chartData.isBarChart}
          />
        ))}
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {chartData.isBarChart ? (
          <BarChart
            data={chartData.barData}
            barWidth={18}
            barBorderRadius={3}
            height={220}
            width={Math.max(screenWidth * 0.75, chartData.numDays * 150)}
            initialSpacing={15}
            endSpacing={40}
            maxValue={chartData.maxValue}
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
            formatYLabel={formatLabelStr}
            isAnimated={false}
          />
        ) : (
          <LineChart
            curved
            data={chartData.buildLineData(applicationData)}
            data2={chartData.buildLineData(systemWideData)}
            data3={chartData.buildLineData(reportingData)}
            data4={chartData.buildLineData(sodData)}
            data5={chartData.buildLineData(onlineData)}
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
            width={Math.max(screenWidth * 0.75, chartData.numDays * 60)}
            spacing={60}
            initialSpacing={20}
            endSpacing={40}
            adjustToWidth={false}
            focusEnabled
            maxValue={chartData.maxValue}
            noOfSections={5}
            xAxisLabelTexts={chartData.labels}
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
            formatYLabel={formatLabelStr}
            pointerConfig={stagePointerConfig}
            isAnimated={false}
          />
        )}
      </ScrollView>
    </View>
  );
});

// ============================================================
// Main component
// ============================================================

export default function COBAnalyticsCard({
  cobTransactionData,
  cobDurationData,
  bomTransactionData,
  bomDurationData,
  bomKeterangan,
  eomTransactionData,
  eomDurationData,
  eomKeterangan,
  boyTransactionData,
  boyDurationData,
  boyKeterangan,
  eoyTransactionData,
  eoyDurationData,
  eoyKeterangan,
  dailyKeterangan,
  monthTransactionData,
  monthDurationData,
  monthlyKeterangan,
  applicationData,
  systemWideData,
  reportingData,
  sodData,
  onlineData,
}: COBAnalyticsCardProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('daily');

  const handleTabChange = useCallback((tab: TabKey) => {
    setActiveTab(tab);
  }, []);

  const monthlyStats = useMemo(() => {
    const trx = summarize(monthTransactionData);
    const dur = summarize(monthDurationData);
    return { trx, dur };
  }, [monthTransactionData, monthDurationData]);

  // Memoize pengecekan kosong agar tidak diulang setiap render
  const {
    isDailyEmpty,
    isMonthlyEmpty,
    isStageEmpty,
    isBomEmpty,
    isBoyEmpty,
    isEomEmpty,
    isEoyEmpty,
  } = useMemo(
    () => ({
      isDailyEmpty: !cobTransactionData?.length && !cobDurationData?.length,
      isMonthlyEmpty:
        !monthTransactionData?.length && !monthDurationData?.length,
      isStageEmpty:
        !applicationData?.length &&
        !systemWideData?.length &&
        !reportingData?.length &&
        !sodData?.length &&
        !onlineData?.length,
      isBomEmpty: !bomTransactionData?.length && !bomDurationData?.length,
      isBoyEmpty: !boyTransactionData?.length && !boyDurationData?.length,
      isEomEmpty: !eomTransactionData?.length && !eomDurationData?.length,
      isEoyEmpty: !eoyTransactionData?.length && !eoyDurationData?.length,
    }),
    [
      cobTransactionData,
      cobDurationData,
      bomTransactionData,
      bomDurationData,
      eomTransactionData,
      eomDurationData,
      boyTransactionData,
      boyDurationData,
      eoyTransactionData,
      eoyDurationData,

      monthTransactionData,
      monthDurationData,
      applicationData,
      systemWideData,
      reportingData,
      sodData,
      onlineData,
    ],
  );

  return (
    <Animated.View style={styles.card} layout={LinearTransition.duration(250)}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Analitik COB</Text>
        <Text style={styles.subtitle}>
          Pantau harian, siklus tahunan, dan tahapan proses Close of Business
        </Text>
      </View>

      {/* Tab selector */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabBar}
      >
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
      </ScrollView>

      {/* ============= TAB: HARIAN ============= */}
      {activeTab === 'daily' && (
        <Animated.View
          entering={FadeInDown.duration(200)}
          exiting={FadeOutUp.duration(150)}
          style={styles.darkSection}
        >
          {isDailyEmpty ? (
            <EmptyState dark />
          ) : (
            <TransactionDurationChart
              transactionData={cobTransactionData}
              durationData={cobDurationData}
              keterangan={dailyKeterangan}
            />
          )}
        </Animated.View>
      )}

      {/* ============= TAB: BULANAN ============= */}
      {activeTab === 'monthly' && (
        <Animated.View
          entering={FadeInDown.duration(200)}
          exiting={FadeOutUp.duration(150)}
          style={styles.darkSection}
        >
          {isMonthlyEmpty ? (
            <EmptyState dark />
          ) : (
            <>
              <Text style={styles.monthlyCaptionDark}>
                Total transaksi & durasi COB per bulan. Perhatikan tren durasi
                makin pendek makin baik.
              </Text>

              <View style={styles.monthlyStatsRow}>
                <SummaryStatCard
                  label="Rata-rata Transaksi"
                  value={monthlyStats.trx.avg}
                  suffix=" Jt"
                  color="#20A090"
                />
                <SummaryStatCard
                  label="Rata-rata Durasi"
                  value={monthlyStats.dur.avg}
                  suffix=" jam"
                  color="#7B61FF"
                />
                <SummaryStatCard
                  label="Durasi Bulan Ini"
                  value={monthlyStats.dur.latest}
                  suffix=" jam"
                  color={monthlyStats.dur.trendUp ? '#F87171' : '#34D399'}
                  trendUp={monthlyStats.dur.trendUp}
                  diffLabel={
                    monthlyStats.dur.trendUp === null
                      ? 'Tidak berubah vs bulan lalu'
                      : 'vs bulan lalu'
                  }
                />
              </View>

              <TransactionDurationChart
                transactionData={monthTransactionData}
                durationData={monthDurationData}
                keterangan={monthlyKeterangan}
                noteTitle="Catatan Operasional Bulanan:"
              />
            </>
          )}
        </Animated.View>
      )}

      {/* ============= TAB: STAGE ============= */}
      {activeTab === 'stage' && (
        <Animated.View
          entering={FadeInDown.duration(200)}
          exiting={FadeOutUp.duration(150)}
          style={styles.darkSection}
        >
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
        </Animated.View>
      )}

      {activeTab === 'bom' && (
        <Animated.View
          entering={FadeInDown.duration(200)}
          exiting={FadeOutUp.duration(150)}
          style={styles.darkSection}
        >
          {isBomEmpty ? (
            <EmptyState dark />
          ) : (
            <TransactionDurationChart
              transactionData={bomTransactionData}
              durationData={bomDurationData}
              keterangan={bomKeterangan}
              transactionLabel="Beginning Transaction"
              durationLabel="Beginning Duration"
              noteTitle="Beginning of Month (BOM):"
            />
          )}
        </Animated.View>
      )}

      {activeTab === 'boy' && (
        <Animated.View
          entering={FadeInDown.duration(200)}
          exiting={FadeOutUp.duration(150)}
          style={styles.darkSection}
        >
          {isBoyEmpty ? (
            <EmptyState dark />
          ) : (
            <TransactionDurationChart
              transactionData={boyTransactionData}
              durationData={boyDurationData}
              keterangan={boyKeterangan}
              transactionLabel="Beginning Transaction"
              durationLabel="Beginning Duration"
              noteTitle="Beginning of Year (BOY):"
            />
          )}
        </Animated.View>
      )}

      {activeTab === 'eom' && (
        <Animated.View
          entering={FadeInDown.duration(200)}
          exiting={FadeOutUp.duration(150)}
          style={styles.darkSection}
        >
          {isEomEmpty ? (
            <EmptyState dark />
          ) : (
            <TransactionDurationChart
              transactionData={eomTransactionData}
              durationData={eomDurationData}
              keterangan={eomKeterangan}
              transactionLabel="End Transaction"
              durationLabel="End Duration"
              noteTitle="End of Month (EOM):"
            />
          )}
        </Animated.View>
      )}

      {activeTab === 'eoy' && (
        <Animated.View
          entering={FadeInDown.duration(200)}
          exiting={FadeOutUp.duration(150)}
          style={styles.darkSection}
        >
          {isEoyEmpty ? (
            <EmptyState dark />
          ) : (
            <TransactionDurationChart
              transactionData={eoyTransactionData}
              durationData={eoyDurationData}
              keterangan={eoyKeterangan}
              transactionLabel="Ending Transaction"
              durationLabel="Ending Duration"
              noteTitle="End of Year (EOY):"
            />
          )}
        </Animated.View>
      )}
    </Animated.View>
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
    marginBottom: 24,
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
    alignItems: 'center',
  },

  tabButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
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
  monthlyCaptionDark: {
    fontSize: 11,
    color: '#9CA3AF',
    marginBottom: 12,
    lineHeight: 16,
  },
  monthlyStatsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  monthlyStatCard: {
    flex: 1,
    backgroundColor: '#161B22',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  monthlyStatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  statDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  monthlyStatLabel: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  monthlyStatValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#F9FAFB',
  },
  monthlyStatDeltaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  monthlyStatDelta: {
    fontSize: 10,
    fontWeight: '600',
  },
  trendArrow: {
    fontSize: 10,
  },
  trendUp: {
    color: '#F87171',
  },
  trendDown: {
    color: '#34D399',
  },
  trendNeutral: {
    color: '#9CA3AF',
  },
});
