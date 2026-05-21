import React from 'react';

import { View, Text, Dimensions, ScrollView } from 'react-native';

import { BarChart } from 'react-native-gifted-charts';

interface Props {
  data: any;
}

const MonthlyIncidentChart: React.FC<Props> = ({ data }) => {
  const screenWidth = Dimensions.get('window').width;

  const labels = data.labels || [];

  const incidentData = data?.datasets?.[0]?.data || [];

  const durationData = data?.datasets?.[1]?.data || [];

  // =====================================
  // FORMAT HH:MM
  // =====================================

  const formatDuration = (minutes: number) => {
    if (!minutes || isNaN(minutes)) return '00:00';

    const h = Math.floor(minutes / 60)
      .toString()
      .padStart(2, '0');

    const m = Math.round(minutes % 60)
      .toString()
      .padStart(2, '0');

    return `${h}:${m}`;
  };

  // =====================================
  // FORMAT BULAN
  // =====================================

  const formatMonth = (label: string) => {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'Mei',
      'Jun',
      'Jul',
      'Agu',
      'Sep',
      'Okt',
      'Nov',
      'Des',
    ];

    const month = Number(label.split('-')[1]) - 1;

    return months[month] || label;
  };

  // =====================================
  // INCIDENT SCALE
  // =====================================

  const maxIncident = Math.max(...incidentData, 1);

  let chartMax = 1;

  let leftStep = 0.25;

  if (maxIncident <= 1) {
    chartMax = 1;

    leftStep = 0.25;
  } else {
    chartMax = Math.ceil(maxIncident);

    leftStep = Math.ceil(chartMax / 4);

    if (leftStep < 1) {
      leftStep = 1;
    }
  }

  // =====================================
  // DURATION SCALE
  // =====================================

  const lineValues =
    durationData.length > 0 ? durationData.map((v: any) => Number(v)) : [0];

  const maxLineMinutes = Math.max(...lineValues);

  const minLineMinutes = Math.min(...lineValues);

  const baseOffset = Math.max(0, Math.floor((minLineMinutes - 10) / 10) * 10);

  let spread = maxLineMinutes - baseOffset;

  if (spread <= 0) spread = 10;

  const virtualTotalRange = spread / 0.6;

  let niceInterval = Math.ceil(virtualTotalRange / 4 / 10) * 10;

  if (niceInterval < 10) niceInterval = 10;

  const virtualMaxLine = baseOffset + niceInterval * 4;

  const visualLineMax = chartMax * 0.9;

  const scaleRatio = visualLineMax / (virtualMaxLine - baseOffset);

  // =====================================
  // RIGHT AXIS
  // =====================================

  const rightStep = (virtualMaxLine - baseOffset) / 4;

  const rightYAxisLabels = [
    formatDuration(baseOffset),

    formatDuration(baseOffset + rightStep),

    formatDuration(baseOffset + rightStep * 2),

    formatDuration(baseOffset + rightStep * 3),

    formatDuration(virtualMaxLine),
  ];

  // =====================================
  // BAR DATA
  // =====================================

  const barData = labels.map((label: string, index: number) => ({
    value: incidentData[index] || 0,

    label: formatMonth(label),

    frontColor: '#8B5CF6',

    topLabelComponent: () => (
      <Text
        style={{
          color: '#FFFFFF',
          fontSize: 10,
          fontWeight: 'bold',
          marginBottom: 4,
        }}
      >
        {incidentData[index]}
      </Text>
    ),
  }));

  // =====================================
  // LINE DATA
  // =====================================

  const lineData = lineValues.map((val: number) => ({
    value: Math.max(0, (val - baseOffset) * scaleRatio),

    customDataPoint: () => (
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <View
          style={{
            width: 8,
            height: 8,
            backgroundColor: '#F59E0B',
            borderRadius: 4,
            borderWidth: 1,
            borderColor: '#101827',
            zIndex: 10,
          }}
        />

        <Text
          style={{
            color: '#F59E0B',
            fontSize: 10,
            fontWeight: 'bold',
            position: 'absolute',
            top: -18,
            width: 55,
            textAlign: 'center',
            zIndex: 10,
          }}
        >
          {formatDuration(val)}
        </Text>
      </View>
    ),
  }));

  return (
    <View
      style={{
        marginTop: 10,
        backgroundColor: '#101827',
        borderRadius: 18,
        paddingVertical: 18,
        paddingHorizontal: 10,
      }}
    >
      {/* TITLE */}

      <Text
        style={{
          color: '#FFFFFF',
          fontSize: 24,
          fontWeight: 'bold',
          textAlign: 'center',
        }}
      >
        Monthly Incident Trend
      </Text>

      <Text
        style={{
          color: '#D1D5DB',
          fontSize: 14,
          textAlign: 'center',
          marginBottom: 20,
        }}
      >
        Critical Applications
      </Text>

      {/* LEGEND */}

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          gap: 20,
          marginBottom: 20,
        }}
      >
        <Legend color="#8B5CF6" label="Incidents" />

        <Legend color="#F59E0B" label="Duration" circle />
      </View>

      {/* CHART */}

      <View
        style={{
          position: 'relative',
          paddingRight: 50,
        }}
      >
        {/* RIGHT SCALE */}

        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            right: 0,
            top: 10,
            height: 220,
            width: 45,
            zIndex: 99,
          }}
        >
          {rightYAxisLabels.map((l: string, i: number) => (
            <Text
              key={i}
              style={{
                position: 'absolute',
                top: 200 - (i / 4) * 200 - 8,
                right: 0,
                color: '#FFFFFF',
                fontSize: 10,
                textAlign: 'right',
              }}
            >
              {l}
            </Text>
          ))}
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <BarChart
            data={barData}
            width={Math.max(screenWidth * 0.8, labels.length * 70)}
            height={220}
            barWidth={28}
            spacing={24}
            initialSpacing={20}
            endSpacing={20}
            noOfSections={4}
            maxValue={chartMax}
            stepValue={chartMax / 4}
            yAxisLabelTexts={
              maxIncident <= 1
                ? ['0', '0.25', '0.5', '0.75', '1']
                : [
                    '0',
                    `${leftStep}`,
                    `${leftStep * 2}`,
                    `${leftStep * 3}`,
                    `${chartMax}`,
                  ]
            }
            yAxisThickness={0}
            xAxisColor="#374151"
            xAxisLabelTextStyle={{
              color: '#9CA3AF',
              fontSize: 10,
              fontWeight: '600',
            }}
            yAxisTextStyle={{
              color: '#FFFFFF',
              fontSize: 10,
            }}
            rulesColor="#374151"
            rulesType="solid"
            showLine
            lineData={lineData}
            lineConfig={{
              color: '#F59E0B',
              thickness: 3,
              curved: true,
            }}
          />
        </ScrollView>
      </View>
    </View>
  );
};

const Legend = ({ color, label, circle }: any) => (
  <View
    style={{
      flexDirection: 'row',
      alignItems: 'center',
    }}
  >
    <View
      style={{
        width: 10,
        height: 10,
        borderRadius: circle ? 5 : 2,
        backgroundColor: color,
        marginRight: 6,
      }}
    />

    <Text
      style={{
        color: '#FFFFFF',
        fontSize: 11,
      }}
    >
      {label}
    </Text>
  </View>
);

export default MonthlyIncidentChart;
