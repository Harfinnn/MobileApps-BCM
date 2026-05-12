import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Dimensions,
  ActivityIndicator,
  InteractionManager,
  ScrollView,
} from 'react-native';
import { LineChart, BarChart } from 'react-native-gifted-charts';

interface StageChartProps {
  chartData: any;
}

const StageChart: React.FC<StageChartProps> = ({ chartData }) => {
  const screenWidth = Dimensions.get('window').width;
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const task = InteractionManager.runAfterInteractions(() => {
      if (isMounted) setIsReady(true);
    });
    const fallbackTimer = setTimeout(() => {
      if (isMounted) setIsReady(true);
    }, 1000);

    return () => {
      isMounted = false;
      task.cancel();
      clearTimeout(fallbackTimer);
    };
  }, []);

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
        <ActivityIndicator size="small" color="#3498DB" />
      </View>
    );
  }

  if (!chartData || !chartData.datasets || chartData.datasets.length === 0) {
    return (
      <Text style={{ color: 'red', fontSize: 12 }}>
        Data grafik stage tidak valid
      </Text>
    );
  }

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

  let maxDurasi = 0;
  chartData.datasets.forEach((dataset: any) => {
    const maxInDataset = Math.max(...dataset.data);
    if (maxInDataset > maxDurasi) maxDurasi = maxInDataset;
  });
  const chartMaxValue = Math.ceil(maxDurasi / 30) * 30 + 30;

  const colors = ['#E74C3C', '#3498DB', '#2ECC71', '#E67E22', '#9B59B6'];

  const numDays = chartData.labels?.length || 1;
  const isStageChart = chartData.datasets.length === 5;

  const isBarChart =
    (isStageChart && numDays <= 3) || chartData.datasets[0]?.type === 'bar';

  const buildLineData = (dataArray: number[], colorIndex: number) => {
    return dataArray.map((val: number) => ({
      value: val,
      customDataPoint: () => (
        <View
          style={{
            width: 8,
            height: 8,
            backgroundColor: colors[colorIndex],
            borderRadius: 4,
            borderWidth: 1,
            borderColor: '#fff',
            zIndex: 1,
          }}
        />
      ),
    }));
  };

  const buildGroupedBarData = () => {
    const barData: any[] = [];

    chartData.datasets.forEach((dataset: any, stageIdx: number) => {
      const stageName = dataset.name;

      chartData.labels.forEach((dateLabel: string, dateIdx: number) => {
        const isLastInGroup = dateIdx === numDays - 1;
        const val = dataset.data[dateIdx] || 0;

        let currentSpacing = 8;
        if (numDays === 1) {
          currentSpacing = 20;
        } else if (isLastInGroup) {
          currentSpacing = 20;
        }

        barData.push({
          value: val,
          frontColor: colors[stageIdx % colors.length],
          spacing: currentSpacing,

          label:
            numDays > 1 && dateIdx === Math.floor(numDays / 2) ? stageName : '',
          labelTextStyle: {
            color: '#ccc',
            fontSize: 10,
            width: 90,
            textAlign: 'center',
            marginLeft: numDays === 2 ? -25 : -35,
          },

          topLabelComponent: () => (
            <View
              style={{
                alignItems: 'center',
                width: 44,
                marginLeft: 3,
                paddingBottom: 5,
              }}
            >
              <Text style={{ color: '#fff', fontSize: 10, fontWeight: 'bold' }}>
                {formatMinutesToHHMM(val)}
              </Text>
              {numDays > 1 && (
                <Text style={{ color: '#aaa', fontSize: 8, marginTop: 1 }}>
                  {dateLabel.substring(0, 6)}
                </Text>
              )}
            </View>
          ),
        });
      });
    });
    return barData;
  };

  const chartViewportWidth = screenWidth * 0.75;

  const dynamicWidth = Math.max(
    chartViewportWidth,
    chartData.labels.length * 70,
  );

  return (
    <View
      style={{
        marginTop: 10,
        backgroundColor: '#0D1117',
        paddingVertical: 15, // Samakan dengan CobChart
        paddingLeft: 5, // Samakan dengan CobChart
        borderRadius: 12,
        overflow: 'hidden',
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'center',
          marginBottom: 20,
          paddingHorizontal: 10,
          gap: 10,
        }}
      >
        {chartData.datasets.map((ds: any, idx: number) => (
          <View
            key={idx}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <View
              style={{
                width: 10,
                height: isBarChart ? 10 : 3,
                borderRadius: isBarChart ? 2 : 0,
                backgroundColor: colors[idx % colors.length],
              }}
            />
            <Text style={{ color: '#fff', fontSize: 10 }}>{ds.name}</Text>
          </View>
        ))}
      </View>

      <View
        style={{
          paddingRight: 15,
          width: '100%',
        }}
      >
        {isBarChart ? (
          <BarChart
            data={buildGroupedBarData()}
            barWidth={30}
            barBorderRadius={4}
            height={220}
            width={chartViewportWidth}
            initialSpacing={15}
            endSpacing={40}
            maxValue={chartMaxValue}
            noOfSections={5}
            yAxisLabelWidth={40}
            yAxisTextStyle={{ color: '#ccc', fontSize: 10 }}
            xAxisThickness={1}
            yAxisThickness={0}
            xAxisColor="#444"
            rulesType="dashed"
            rulesColor="#333"
            isAnimated={false}
          />
        ) : (
          <LineChart
            data={
              chartData.datasets[0]
                ? buildLineData(chartData.datasets[0].data, 0)
                : []
            }
            data2={
              chartData.datasets[1]
                ? buildLineData(chartData.datasets[1].data, 1)
                : []
            }
            data3={
              chartData.datasets[2]
                ? buildLineData(chartData.datasets[2].data, 2)
                : []
            }
            data4={
              chartData.datasets[3]
                ? buildLineData(chartData.datasets[3].data, 3)
                : []
            }
            data5={
              chartData.datasets[4]
                ? buildLineData(chartData.datasets[4].data, 4)
                : []
            }
            color1={colors[0]}
            color2={colors[1]}
            color3={colors[2]}
            color4={colors[3]}
            color5={colors[4]}
            thickness={2}
            height={220}
            width={chartViewportWidth}
            spacing={60}
            initialSpacing={20}
            endSpacing={40}
            adjustToWidth={false}
            disableScroll={false}
            focusEnabled
            maxValue={chartMaxValue}
            noOfSections={5}
            xAxisLabelTexts={chartData.labels}
            xAxisLabelTextStyle={{
              color: '#ccc',
              fontSize: 10,
              rotation: -45,
              marginTop: 5,
              width: 60,
            }}
            yAxisLabelWidth={40}
            yAxisTextStyle={{ color: '#ccc', fontSize: 10 }}
            xAxisThickness={1}
            yAxisThickness={0}
            xAxisColor="#444"
            rulesType="dashed"
            rulesColor="#333"
            formatYLabel={(label: string) => formatMinutesToHHMM(Number(label))}
            isAnimated={false}
          />
        )}
      </View>
    </View>
  );
};

export default StageChart;
