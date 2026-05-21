import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Dimensions,
  ActivityIndicator,
  InteractionManager,
  ScrollView,
} from 'react-native';

import { BarChart, LineChart } from 'react-native-gifted-charts';

interface IncidentChartProps {
  chartData: any;
}

const IncidentChart: React.FC<IncidentChartProps> = ({ chartData }) => {
  const screenWidth = Dimensions.get('window').width;

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    const task = InteractionManager.runAfterInteractions(() => {
      if (mounted) {
        setIsReady(true);
      }
    });

    return () => {
      mounted = false;
      task.cancel();
    };
  }, []);

  // =====================================================
  // LOADING
  // =====================================================

  if (!isReady) {
    return (
      <View
        style={{
          height: 260,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#0D1117',
          borderRadius: 12,
          marginTop: 10,
        }}
      >
        <ActivityIndicator size="small" color="#3498DB" />
      </View>
    );
  }

  // =====================================================
  // INVALID DATA
  // =====================================================

  if (
    !chartData ||
    !chartData.labels ||
    !chartData.datasets ||
    chartData.datasets.length === 0
  ) {
    return (
      <Text
        style={{
          color: 'red',
          fontSize: 12,
        }}
      >
        Data grafik insiden tidak valid
      </Text>
    );
  }

  const labels = chartData.labels;
  const datasets = chartData.datasets;

  const colors = ['#E74C3C', '#3498DB', '#2ECC71', '#F1C40F', '#9B59B6'];

  // =====================================================
  // CHART MODE
  // =====================================================

  const chartMode = chartData.chart_mode || 'top_recurring';

  const isBarChart =
    chartMode === 'top_recurring' || chartMode === 'top_application';

  // =====================================================
  // BAR DATA
  // =====================================================

  const buildBarData = () => {
    return labels.map((label: string, index: number) => ({
      value: datasets[0].data[index] || 0,

      frontColor: colors[index % colors.length],

      labelComponent: () => {
        const words = label.split(' ');

        return (
          <Text
            style={{
              color: '#ccc',
              fontSize: 9,
              width: 70,
              textAlign: 'center',
              marginLeft: -15,
            }}
          >
            {words.join('\n')}
          </Text>
        );
      },

      topLabelComponent: () => (
        <Text
          style={{
            color: '#fff',
            fontSize: 10,
            marginBottom: 4,
          }}
        >
          {datasets[0].data[index] || 0}
        </Text>
      ),
    }));
  };

  // =====================================================
  // LINE DATA
  // =====================================================

  const buildLineData = (dataArray: number[], colorIndex: number) => {
    return dataArray.map((val: number) => ({
      value: val,

      customDataPoint: () => (
        <View
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: colors[colorIndex],
            borderWidth: 1,
            borderColor: '#fff',
          }}
        />
      ),
    }));
  };

  // =====================================================
  // MAX VALUE
  // =====================================================

  let maxValue = 0;

  datasets.forEach((ds: any) => {
    const maxDataset = Math.max(...ds.data);

    if (maxDataset > maxValue) {
      maxValue = maxDataset;
    }
  });

  const chartMaxValue = Math.ceil(maxValue / 5) * 5 + 5;

  // =====================================================
  // DYNAMIC WIDTH
  // =====================================================

  const dynamicWidth = Math.max(screenWidth * 0.72, labels.length * 70);

  return (
    <View
      style={{
        marginTop: 10,
        backgroundColor: '#0D1117',
        borderRadius: 12,
        paddingVertical: 15,
        paddingHorizontal: 10,
      }}
    >
      {/* ========================================= */}
      {/* TITLE */}
      {/* ========================================= */}

      {chartData.title && (
        <Text
          style={{
            color: '#fff',
            fontSize: 14,
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: 20,
          }}
        >
          {chartData.title}
        </Text>
      )}

      {/* ========================================= */}
      {/* LEGEND */}
      {/* ========================================= */}

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: 12,
          marginBottom: 15,
        }}
      >
        {datasets.map((ds: any, idx: number) => (
          <View
            key={idx}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <View
              style={{
                width: 10,
                height: 10,
                borderRadius: 2,
                backgroundColor: colors[idx % colors.length],
                marginRight: 5,
              }}
            />

            <Text
              style={{
                color: '#ccc',
                fontSize: 10,
              }}
            >
              {ds.name}
            </Text>
          </View>
        ))}
      </View>

      {/* ========================================= */}
      {/* CHART */}
      {/* ========================================= */}

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {isBarChart ? (
          <BarChart
            data={buildBarData()}
            height={220}
            width={dynamicWidth}
            barWidth={22}
            spacing={18}
            xAxisLabelsHeight={20}
            roundedTop
            hideRules={false}
            xAxisThickness={1}
            yAxisThickness={0}
            xAxisColor="#444"
            rulesColor="#333"
            yAxisTextStyle={{
              color: '#ccc',
              fontSize: 10,
            }}
            noOfSections={5}
            maxValue={chartMaxValue}
            isAnimated
          />
        ) : (
          <LineChart
            data={datasets[0] ? buildLineData(datasets[0].data, 0) : []}
            data2={datasets[1] ? buildLineData(datasets[1].data, 1) : []}
            color1={colors[0]}
            color2={colors[1]}
            thickness={2}
            height={220}
            width={dynamicWidth}
            spacing={55}
            initialSpacing={15}
            endSpacing={20}
            xAxisLabelTexts={labels.map((lbl: string) => {
              const parts = lbl.split('-');

              return `${parts[2]}/${parts[1]}`;
            })}
            xAxisLabelTextStyle={{
              color: '#ccc',
              fontSize: 10,
            }}
            yAxisTextStyle={{
              color: '#ccc',
              fontSize: 10,
            }}
            xAxisThickness={1}
            yAxisThickness={0}
            xAxisColor="#444"
            rulesColor="#333"
            noOfSections={5}
            maxValue={chartMaxValue}
            focusEnabled
            isAnimated
          />
        )}
      </ScrollView>
    </View>
  );
};

export default IncidentChart;
