import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import styles from '../../styles/forecast/f3dStyle';
import { getWeatherIcon } from '../../utils/weatherHelper';

type Props = {
  item: any;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
};

export default function ForecastItem({
  item,
  index,
  isOpen,
  onToggle,
}: Props) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const expandAnim = useRef(new Animated.Value(isOpen ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(expandAnim, {
      toValue: isOpen ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isOpen]);

  const firstFiveHours = item.hourly.slice(0, 5);
  const temps = firstFiveHours.map((h: any) => h.temp);

  const minTemp =
    temps.length > 0 ? Math.min(...temps) : item.summary.temp;

  const maxTemp =
    temps.length > 0 ? Math.max(...temps) : item.summary.temp;

  return (
    <Animated.View
      style={[
        styles.forecastCard,
        isOpen && styles.forecastCardActive,
        { transform: [{ scale: scaleAnim }] },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPressIn={() => {
          Animated.spring(scaleAnim, {
            toValue: 0.97,
            useNativeDriver: true,
          }).start();
        }}
        onPressOut={() => {
          Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
          }).start();
        }}
        onPress={onToggle}
      >
        <View style={styles.forecastSummaryRow}>
          <View style={styles.forecastLeft}>
            <View style={styles.forecastIconBg}>
              {getWeatherIcon(item.summary.condition, 24)}
            </View>
            <View>
              <Text style={styles.forecastDay}>
                {index === 0 ? 'Hari Ini' : item.day}
              </Text>
              <Text style={styles.forecastConditionText}>
                {item.summary.condition}
              </Text>
            </View>
          </View>

          <View style={styles.tempWrapper}>
            <View style={styles.minMaxRow}>
              <Text style={styles.minTempText}>{minTemp}° /</Text>
              <Text style={styles.maxTempText}>{maxTemp}°</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>

      <Animated.View
        style={{
          height: expandAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 95],
          }),
          opacity: expandAnim,
          overflow: 'hidden',
        }}
      >
        <View style={styles.hourlyList}>
          {firstFiveHours.map((hour: any, i: number) => (
            <View key={i} style={styles.hourlyItem}>
              <Text style={styles.hourlyTimeText}>{hour.time}</Text>
              {getWeatherIcon(hour.condition, 18)}
              <Text style={styles.hourlyTempText}>{hour.temp}°</Text>
            </View>
          ))}
        </View>
      </Animated.View>
    </Animated.View>
  );
}