import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import { Droplets, Wind } from 'lucide-react-native';
import styles from '../../styles/forecast/f3dStyle';

type Props = {
  humidity: number;
  wind: number;
  getHumidityStatus: (val: number) => string;
  getWindStatus: (val: number) => string;
};

export default function AnalyticsCard({
  humidity,
  wind,
  getHumidityStatus,
  getWindStatus,
}: Props) {
  const [showDetailInfo, setShowDetailInfo] = React.useState(false);

  const floatAnim = useRef(new Animated.Value(0)).current;
  const windShakeAnim = useRef(new Animated.Value(0)).current;
  const humidityAnim = useRef(new Animated.Value(0)).current;
  const windAnim = useRef(new Animated.Value(0)).current;

  /* ================= FLOAT + WIND LOOP ================= */
  useEffect(() => {
    Animated.parallel([
      Animated.loop(
        Animated.sequence([
          Animated.timing(floatAnim, {
            toValue: 1,
            duration: 1500,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(floatAnim, {
            toValue: 0,
            duration: 1500,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
      ),
      Animated.loop(
        Animated.sequence([
          Animated.timing(windShakeAnim, {
            toValue: 1,
            duration: 1200,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(windShakeAnim, {
            toValue: -1,
            duration: 1200,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
      ),
    ]).start();
  }, []);

  /* ================= TOGGLE DETAIL ================= */
  const toggleDetail = () => {
    const toValue = showDetailInfo ? 0 : 1;

    Animated.stagger(100, [
      Animated.timing(humidityAnim, {
        toValue,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(windAnim, {
        toValue,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    setShowDetailInfo(!showDetailInfo);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={toggleDetail}
      style={styles.analyticsCard}
    >
      <View style={styles.analyticsHeader}>
        <Text style={styles.analyticsTitle}>Detail Kondisi</Text>
      </View>

      <View style={styles.statsGrid}>
        {/* HUMIDITY */}
        <View style={styles.statBox}>
          <View
            style={[
              styles.iconCircle,
              { backgroundColor: '#eff6ff' },
            ]}
          >
            <Animated.View
              style={{
                transform: [
                  {
                    translateY: floatAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -4],
                    }),
                  },
                ],
              }}
            >
              <Droplets size={20} color="#3b82f6" strokeWidth={2.5} />
            </Animated.View>
          </View>

          <View>
            <Text style={styles.statLabel}>Kelembaban</Text>
            <Text style={styles.statValue}>{humidity}%</Text>
          </View>
        </View>

        {/* WIND */}
        <View style={styles.statBox}>
          <View
            style={[
              styles.iconCircle,
              { backgroundColor: '#f0fdf4' },
            ]}
          >
            <Animated.View
              style={{
                transform: [
                  {
                    translateX: windShakeAnim.interpolate({
                      inputRange: [-1, 1],
                      outputRange: [-5, 5],
                    }),
                  },
                  {
                    skewX: windShakeAnim.interpolate({
                      inputRange: [-1, 1],
                      outputRange: ['-5deg', '5deg'],
                    }),
                  },
                ],
              }}
            >
              <Wind size={20} color="#22c55e" strokeWidth={2.5} />
            </Animated.View>
          </View>

          <View>
            <Text style={styles.statLabel}>Angin</Text>
            <Text style={styles.statValue}>
              {wind} <Text style={styles.unitText}>km/h</Text>
            </Text>
          </View>
        </View>
      </View>

      {/* DROPDOWN */}
      {showDetailInfo && (
        <View style={styles.detailDropdown}>
          <Animated.View
            style={[
              styles.insightBox,
              {
                opacity: humidityAnim,
                transform: [
                  {
                    translateY: humidityAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [10, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <View
              style={[
                styles.statusIndicator,
                { backgroundColor: '#3b82f6' },
              ]}
            />
            <View style={styles.insightContent}>
              <Text style={styles.detailLabel}>
                Analisis Kelembaban
              </Text>
              <Text style={styles.detailValue}>
                {getHumidityStatus(humidity)}
              </Text>
            </View>
          </Animated.View>

          <Animated.View
            style={[
              styles.insightBox,
              {
                opacity: windAnim,
                transform: [
                  {
                    translateY: windAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [10, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <View
              style={[
                styles.statusIndicator,
                { backgroundColor: '#22c55e' },
              ]}
            />
            <View style={styles.insightContent}>
              <Text style={styles.detailLabel}>Kondisi Angin</Text>
              <Text style={styles.detailValue}>
                {getWindStatus(wind)}
              </Text>
            </View>
          </Animated.View>
        </View>
      )}
    </TouchableOpacity>
  );
}