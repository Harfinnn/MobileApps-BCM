import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { normalize } from '../../utils/responsive'; // Pastikan path ini benar

interface CobChartProps {
  chartData: any;
}

const CobChart: React.FC<CobChartProps> = ({ chartData }) => {
  const screenWidth = Dimensions.get('window').width;

  if (!chartData || !chartData.datasets || chartData.datasets.length < 2) {
    return (
      <Text style={{ color: 'red', fontSize: normalize(12) }}>
        Data grafik tidak valid
      </Text>
    );
  }

  const formatMinutesToHHMM = (minutes: number) => {
    const h = Math.floor(minutes / 60)
      .toString()
      .padStart(2, '0');
    const m = Math.round(minutes % 60)
      .toString()
      .padStart(2, '0');
    return `${h}:${m}`;
  };

  const formatToJuta = (value: number) => {
    if (value <= 10) return Number(value.toFixed(2));
    return Number((value / 1000000).toFixed(2));
  };

  const maxTrx = Math.max(...chartData.datasets[1].data.map(formatToJuta));
  const maxDurasi = Math.max(...chartData.datasets[0].data);

  const chartMaxValue = Math.ceil(maxTrx) + 2;
  const scaleRatio = maxDurasi > 0 ? (chartMaxValue * 0.45) / maxDurasi : 1;

  const barData = chartData.labels.map((label: string, index: number) => {
    const rawValTrx = chartData.datasets[1].data[index];
    const valTrxJt = formatToJuta(rawValTrx);

    return {
      value: valTrxJt,
      label: label,
      frontColor: '#20A090',
      topLabelComponent: () => (
        <View
          style={{
            width: normalize(50),
            alignItems: 'center',
            marginLeft: normalize(-13),
            marginBottom: normalize(6),
          }}
        >
          <Text
            style={{
              color: '#fff',
              fontSize: normalize(10),
              fontWeight: 'bold',
            }}
          >
            {valTrxJt} Jt
          </Text>
        </View>
      ),
    };
  });

  const lineData = chartData.datasets[0].data.map((valDurasi: number) => {
    return {
      value: valDurasi * scaleRatio,

      customDataPoint: () => (
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
          }}
        >
          <Text
            style={{
              color: '#FFC107',
              fontSize: normalize(10),
              fontWeight: 'bold',
              position: 'absolute',
              top: normalize(12),
              width: normalize(50),
              textAlign: 'center',
            }}
          >
            {formatMinutesToHHMM(valDurasi)}
          </Text>

          <View
            style={{
              width: normalize(10),
              height: normalize(10),
              backgroundColor: '#FFC107',
              borderRadius: normalize(5),
              borderWidth: normalize(2),
              borderColor: '#fff',
            }}
          />
        </View>
      ),
    };
  });

  return (
    <View
      style={{
        marginTop: normalize(10),
        backgroundColor: '#0D1117',
        paddingTop: normalize(15),
        paddingBottom: normalize(15),
        paddingLeft: normalize(5),
        borderRadius: normalize(12),
        overflow: 'hidden',
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          marginBottom: normalize(25),
          gap: normalize(20),
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: normalize(6),
          }}
        >
          <View
            style={{
              width: normalize(12),
              height: normalize(12),
              backgroundColor: '#20A090',
              borderRadius: normalize(4),
            }}
          />
          <Text style={{ color: '#fff', fontSize: normalize(12) }}>
            Transaction
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: normalize(6),
          }}
        >
          <View
            style={{
              width: normalize(12),
              height: normalize(12),
              backgroundColor: '#7B61FF',
              borderRadius: normalize(6), // Bundar untuk penanda line
            }}
          />
          <Text style={{ color: '#fff', fontSize: normalize(12) }}>
            Duration
          </Text>
        </View>
      </View>

      <BarChart
        data={barData}
        width={screenWidth * 0.62} // Relatif ke layar tetap aman
        height={normalize(200)}
        barWidth={normalize(24)}
        spacing={normalize(20)}
        initialSpacing={normalize(15)}
        endSpacing={normalize(10)}
        noOfSections={4}
        maxValue={chartMaxValue}
        yAxisThickness={0}
        xAxisThickness={1}
        xAxisColor="#444"
        yAxisTextStyle={{ color: '#ccc', fontSize: normalize(10) }}
        xAxisLabelTextStyle={{
          color: '#ccc',
          fontSize: normalize(10),
          marginTop: normalize(5),
        }}
        rulesType="dashed"
        rulesColor="#333"
        showLine
        lineData={lineData}
        lineConfig={{
          color: '#7B61FF',
          thickness: normalize(2),
          curved: false,
          hideDataPoints: false,
        }}
      />
    </View>
  );
};

export default CobChart;
