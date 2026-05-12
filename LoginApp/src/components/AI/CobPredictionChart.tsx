import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Dimensions,
  ActivityIndicator,
  InteractionManager,
} from 'react-native'; // <-- Tambahkan InteractionManager
import { BarChart } from 'react-native-gifted-charts';

interface CobPredictionChartProps {
  chartData: any;
}

const CobPredictionChart: React.FC<CobPredictionChartProps> = ({
  chartData,
}) => {
  const screenWidth = Dimensions.get('window').width;

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    // 1. Tunggu sampai FlatList benar-benar selesai bergeser/animasi
    const task = InteractionManager.runAfterInteractions(() => {
      if (isMounted) setIsReady(true);
    });

    // 2. Fallback aman maksimal 1 detik jika HP pengguna sedang berat/freeze
    const fallbackTimer = setTimeout(() => {
      if (isMounted) setIsReady(true);
    }, 1000);

    return () => {
      isMounted = false;
      task.cancel();
      clearTimeout(fallbackTimer);
    };
  }, []);

  // --- TAMPILKAN LOADING SAAT DELAY UNTUK MENCEGAH NODE ERROR ---
  if (!isReady) {
    return (
      <View
        style={{
          height: 250,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#0D1117',
          borderRadius: 12,
          marginTop: 10,
        }}
      >
        <ActivityIndicator size="small" color="#FFC107" />
      </View>
    );
  }

  if (!chartData || !chartData.datasets || chartData.datasets.length < 1) {
    return <Text style={{ color: 'red' }}>Data prediksi tidak valid</Text>;
  }

  // --- HELPERS PEMBERSIH ANGKA ---
  const cleanNumber = (val: any) => {
    if (val === null || val === undefined || val === '') return 0;
    if (typeof val === 'number') return val;
    if (typeof val === 'string') {
      const cleanStr = val.replace(/[^0-9.-]+/g, '');
      return Number(cleanStr) || 0;
    }
    return 0;
  };

  const formatMinutesToHHMM = (minutes: number) => {
    if (!minutes || isNaN(minutes)) return '00:00';
    const h = Math.floor(minutes / 60)
      .toString()
      .padStart(2, '0');
    const m = Math.round(minutes % 60)
      .toString()
      .padStart(2, '0');
    return `${h}:${m}`;
  };

  const formatToJuta = (val: any) => {
    const num = cleanNumber(val);
    if (num === 0) return 0;
    if (num <= 1000) return Number(num.toFixed(2));
    return Number((num / 1000000).toFixed(2));
  };

  const normalizeDuration = (val: any) => {
    if (!val) return 0;
    if (typeof val === 'string' && val.includes(':')) {
      const parts = val.split(':').map(Number);
      return parts.length === 2
        ? parts[0] * 60 + parts[1]
        : parts[0] * 60 + parts[1] + Math.round((parts[2] || 0) / 60);
    }
    const num = cleanNumber(val);
    if (num > 0) {
      if (num > 100000) return Math.round(num / 60000);
      if (num > 1440) return Math.round(num / 60);
      return num;
    }
    return 0;
  };

  // --- PENCARIAN DATASET SPESIFIK FORECAST ---
  let barDataset = chartData.datasets.find((ds: any) => {
    const name = (ds.name || '').toLowerCase();
    return (
      (name.includes('forecast') || name.includes('prediksi')) &&
      !name.includes('duration') &&
      !name.includes('durasi')
    );
  });

  let lineDataset = chartData.datasets.find((ds: any) => {
    const name = (ds.name || '').toLowerCase();
    return (
      (name.includes('forecast') || name.includes('prediksi')) &&
      (name.includes('duration') || name.includes('durasi'))
    );
  });

  if (!barDataset) barDataset = chartData.datasets[0] || { data: [] };
  if (!lineDataset)
    lineDataset =
      chartData.datasets.length > 1 ? chartData.datasets[1] : { data: [] };

  // =========================================================
  // FILTERING EKSTREM (BUANG TANGGAL YANG NILAINYA 0)
  // =========================================================
  const rawLabels = chartData.labels || [];
  const rawBarData = barDataset.data || [];
  const rawLineData = lineDataset.data || [];

  const finalLabels: string[] = [];
  const finalBarData: any[] = [];
  const finalLineData: any[] = [];

  for (let i = 0; i < rawLabels.length; i++) {
    const bVal = rawBarData[i];
    const lVal = rawLineData[i];

    const bNum = cleanNumber(bVal);
    let lNum = 0;
    if (typeof lVal === 'string' && lVal.includes(':')) {
      const parts = lVal.split(':').map(Number);
      lNum = parts.length >= 2 ? parts[0] * 60 + parts[1] : 0;
    } else {
      lNum = cleanNumber(lVal);
    }

    if (bNum > 0 || lNum > 0) {
      finalLabels.push(rawLabels[i]);
      finalBarData.push(bVal);
      finalLineData.push(lVal);
    }
  }

  if (finalLabels.length === 0) {
    finalLabels.push(...rawLabels);
    finalBarData.push(...rawBarData);
    finalLineData.push(...rawLineData);
  }

  // =========================================================================
  // 1. SKALA KIRI (BATANG PREDIKSI) - "SMART CEILING" ALGORITHM
  // =========================================================================
  const maxTrx =
    finalBarData.length > 0 ? Math.max(...finalBarData.map(formatToJuta)) : 0;

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

  // =========================================================================
  // 2. SKALA KANAN (GARIS PREDIKSI) - DYNAMIC BASE OFFSET
  // =========================================================================
  const lineValues =
    finalLineData.length > 0 ? finalLineData.map(normalizeDuration) : [0];
  const maxLineMinutes = Math.max(...lineValues);
  const minLineMinutes = Math.min(...lineValues);

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

  // --- MAPPING DATA BARCHART (KUNING PREDIKSI) ---
  const barData = finalLabels.map((label: string, index: number) => {
    const rawVal = finalBarData[index];
    const valJt = formatToJuta(rawVal);

    const isPrediction = label.includes('Est');

    return {
      value: valJt,
      label: label,
     frontColor: isPrediction ? '#FFC107' : '#20A090',
      topLabelComponent: () =>
        valJt > 0 ? (
          <Text
            style={{
              color: '#fff',
              fontSize: 9,
              fontWeight: 'bold',
              width: 50,
              textAlign: 'center',
              marginLeft: -13,
              marginBottom: 4,
              textShadowColor: 'rgba(0,0,0,0.8)',
              textShadowOffset: { width: 1, height: 1 },
              textShadowRadius: 2,
            }}
          >
            {valJt} Jt
          </Text>
        ) : null,
    };
  });

  // --- MAPPING DATA LINECHART (PUTIH PREDIKSI) ---
  const lineData = finalLineData.map((val: any) => {
    const fixedVal = normalizeDuration(val);
    const lineValue = Math.max(0, (fixedVal - baseOffset) * scaleRatio);

    return {
      value: lineValue,
      customDataPoint: () =>
        fixedVal > 0 ? (
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <View
              style={{
                width: 8,
                height: 8,
                backgroundColor: '#FFFFFF',
                borderRadius: 4,
                borderWidth: 1,
                borderColor: '#0D1117',
                zIndex: 10,
              }}
            />
            <Text
              style={{
                color: '#FFFFFF',
                fontSize: 9,
                fontWeight: 'bold',
                position: 'absolute',
                top: 12,
                width: 50,
                textAlign: 'center',
                zIndex: 10,
                textShadowColor: 'rgba(0,0,0,0.9)',
                textShadowOffset: { width: 1, height: 1 },
                textShadowRadius: 3,
              }}
            >
              {formatMinutesToHHMM(fixedVal)}
            </Text>
          </View>
        ) : (
          <View />
        ),
    };
  });

  return (
    <View
      style={{
        marginTop: 10,
        backgroundColor: '#0D1117',
        paddingVertical: 15,
        paddingLeft: 5,
        borderRadius: 12,
        overflow: 'hidden',
      }}
    >
      {/* Legend */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          marginBottom: 25,
          gap: 15,
        }}
      >
        <LegendItem color="#FFC107" label="Forecast Transaction" />
        <LegendItem color="#7B61FF" label="Forecast Duration" isCircle />
      </View>

      {/* Area Chart Utama */}
      <View style={{ position: 'relative' }}>
        {/* Sumbu Kanan: Diberi Background Solid agar grafik di baliknya tertutup */}
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            right: 0,
            top: 10,
            backgroundColor: '#0D1117',
            height: 230,
            width: 40,
            zIndex: 1,
          }}
        >
          {rightYAxisLabels.map((l: string, i: number) => (
            <Text
              key={i}
              style={{
                position: 'absolute',
                top: 200 - (i / 4) * 200 - 7,
                right: 5,
                color: '#ccc',
                fontSize: 10,
                textAlign: 'right',
              }}
            >
              {l}
            </Text>
          ))}
        </View>

        <BarChart
          data={barData}
          width={screenWidth * 0.75} // Lebarkan agar masuk ke bawah sumbu kanan
          height={200}
          isAnimated={false}
          barWidth={24}
          spacing={20}
          initialSpacing={40}
          endSpacing={40}
          noOfSections={4}
          maxValue={chartMaxValue}
          yAxisLabelTexts={leftYAxisLabels}
          yAxisThickness={0}
          xAxisColor="#444"
          yAxisLabelWidth={35}
          yAxisTextStyle={{ color: '#ccc', fontSize: 10 }}
          xAxisLabelTextStyle={{
            color: '#ccc',
            fontSize: 9,
            marginTop: 5,
          }}
          rulesType="dashed"
          rulesColor="#333"
          showLine
          lineData={lineData}
          lineConfig={{ color: '#7B61FF', thickness: 2 }}
        />
      </View>
    </View>
  );
};

const LegendItem = ({ color, label, isCircle }: any) => (
  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
    <View
      style={{
        width: 12,
        height: 12,
        backgroundColor: color,
        borderRadius: isCircle ? 6 : 4,
      }}
    />
    <Text style={{ color: '#fff', fontSize: 11 }}>{label}</Text>
  </View>
);

export default CobPredictionChart;
