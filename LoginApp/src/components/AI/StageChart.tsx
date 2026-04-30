import React from 'react';
import { View, Text, Dimensions, ScrollView } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { normalize } from '../../utils/responsive'; // Pastikan path ini benar sesuai struktur folder Anda

interface StageChartProps {
  chartData: any;
}

const StageChart: React.FC<StageChartProps> = ({ chartData }) => {
  const screenWidth = Dimensions.get('window').width;

  if (!chartData || !chartData.datasets || chartData.datasets.length === 0) {
    return (
      <Text style={{ color: 'red', fontSize: normalize(12) }}>
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

  const buildLineData = (dataArray: number[], colorIndex: number) => {
    return dataArray.map((val: number) => ({
      value: val,
      customDataPoint: () => (
        <View
          style={{
            width: normalize(8),
            height: normalize(8),
            backgroundColor: colors[colorIndex],
            borderRadius: normalize(4),
            borderWidth: 1,
            borderColor: '#fff',
            zIndex: 1,
          }}
        />
      ),
    }));
  };

  // Dinamis width juga harus dinormalisasi agar spacing-nya akurat di tablet
  const chartDynamicWidth = Math.max(
    screenWidth * 0.8,
    chartData.labels.length * normalize(60) + normalize(60),
  );

  return (
    <View
      style={{
        marginTop: normalize(10),
        backgroundColor: '#0D1117',
        paddingTop: normalize(15),
        paddingBottom: normalize(35), // Disesuaikan agar teks bawah aman dari potongan
        borderRadius: normalize(12),
        overflow: 'hidden',
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'center',
          marginBottom: normalize(20),
          paddingHorizontal: normalize(10),
          gap: normalize(10),
        }}
      >
        {chartData.datasets.map((ds: any, idx: number) => (
          <View
            key={idx}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: normalize(4),
            }}
          >
            <View
              style={{
                width: normalize(10),
                height: normalize(3),
                backgroundColor: colors[idx % colors.length],
              }}
            />
            <Text style={{ color: '#fff', fontSize: normalize(10) }}>
              {ds.name}
            </Text>
          </View>
        ))}
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={{ paddingLeft: normalize(10) }}>
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
            thickness={normalize(2)}
            height={normalize(220)}
            width={chartDynamicWidth}
            spacing={normalize(60)}
            initialSpacing={normalize(20)}
            maxValue={chartMaxValue}
            noOfSections={5}
            xAxisLabelTexts={chartData.labels}
            xAxisLabelTextStyle={{
              color: '#ccc',
              fontSize: normalize(10),
              rotation: -45,
              marginTop: normalize(5),
              width: normalize(60),
            }}
            yAxisTextStyle={{ color: '#ccc', fontSize: normalize(10) }}
            xAxisThickness={1}
            yAxisThickness={0}
            xAxisColor="#444"
            rulesType="dashed"
            rulesColor="#333"
            formatYLabel={(label: string) => formatMinutesToHHMM(Number(label))}
            pointerConfig={{
              pointerStripHeight: normalize(220),
              pointerStripColor: 'rgba(255,255,255,0.3)',
              pointerStripWidth: normalize(2),
              radius: 0,

              pointerLabelWidth: normalize(140),
              pointerLabelHeight: normalize(120),
              activatePointersOnLongPress: false,

              autoAdjustPointerLabelPosition: true,

              shiftPointerLabelY: normalize(30),

              pointerLabelComponent: (items: any) => {
                if (!items || items.length === 0) return null;

                return (
                  <View
                    style={{
                      width: normalize(140),
                      backgroundColor: '#1E2229',
                      padding: normalize(10),
                      borderRadius: normalize(8),
                      borderWidth: 1,
                      borderColor: '#555',
                      zIndex: 100,
                    }}
                  >
                    <Text
                      style={{
                        color: '#ccc',
                        fontSize: normalize(11),
                        marginBottom: normalize(8),
                        textAlign: 'center',
                        fontWeight: 'bold',
                      }}
                    >
                      {chartData.labels[items[0].index]}
                    </Text>
                    {items.map((item: any, idx: number) => (
                      <View
                        key={idx}
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          marginBottom: normalize(6),
                        }}
                      >
                        <Text
                          style={{
                            color: colors[idx],
                            fontSize: normalize(10),
                          }}
                        >
                          {chartData.datasets[idx].name}
                        </Text>
                        <Text
                          style={{
                            color: '#fff',
                            fontSize: normalize(10),
                            fontWeight: 'bold',
                          }}
                        >
                          {formatMinutesToHHMM(item.value)}
                        </Text>
                      </View>
                    ))}
                  </View>
                );
              },
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default StageChart;
