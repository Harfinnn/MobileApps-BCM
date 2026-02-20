import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Dimensions,
  BackHandler,
} from 'react-native';
import { useLayout } from '../../../contexts/LayoutContext';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const RTAScreen = () => {
  const navigation = useNavigation<any>();
  const { setTitle, setHideNavbar, setShowBack, setShowSearch } = useLayout();
  const [currentTime, setCurrentTime] = useState(new Date());

  useFocusEffect(
    useCallback(() => {
      const sub = BackHandler.addEventListener('hardwareBackPress', () => {
        navigation.navigate('Main', { screen: 'Home' });
        return true;
      });
      return () => sub.remove();
    }, [navigation]),
  );

  useEffect(() => {
    setTitle('RTA');
    setHideNavbar(true);
    setShowBack(true);
    setShowSearch(false);

    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => {
      setHideNavbar(false);
      setShowBack(false);
      clearInterval(timer);
    };
  }, [setTitle, setHideNavbar, setShowBack]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* SOFT GRADIENT ORB (Visual Decor) */}
      <View style={styles.softGlow} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* MINIMALIST HEADER */}
        <View style={styles.topHeader}>
          <View style={styles.liveTag}>
            <View style={styles.liveDot} />
            <Text style={styles.liveTagText}>SYSTEM ACTIVE</Text>
          </View>
          <Text style={styles.mainTitle}>Real-Time{'\n'}Access Center</Text>
        </View>

        {/* CLOCK SECTION */}
        <View style={styles.heroClock}>
          <Text style={styles.clockBig}>
            {currentTime.toLocaleTimeString('id-ID', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            })}
          </Text>
          <View style={styles.dateRow}>
            <Text style={styles.dateSmall}>
              {currentTime
                .toLocaleDateString('id-ID', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                })
                .toUpperCase()}
            </Text>
            <View style={styles.yearBadge}>
              <Text style={styles.yearText}>{currentTime.getFullYear()}</Text>
            </View>
          </View>
        </View>

        {/* METRICS (Clean Minimalist) */}
        <View style={styles.metricsWrapper}>
          <View style={styles.metricItem}>
            <Text style={styles.mLabel}>LATENCY</Text>
            <Text style={styles.mValue}>12ms</Text>
          </View>
          <View style={styles.mDivider} />
          <View style={styles.metricItem}>
            <Text style={styles.mLabel}>STABILITY</Text>
            <Text style={styles.mValue}>99%</Text>
          </View>
          <View style={styles.mDivider} />
          <View style={styles.metricItem}>
            <Text style={styles.mLabel}>NODES</Text>
            <Text style={styles.mValue}>ACTIVE</Text>
          </View>
        </View>

        {/* LOG SECTION (Clean Neumorphic touch) */}
        <View style={styles.logCard}>
          <View style={styles.logHeader}>
            <Text style={styles.logTitle}>System Protocol</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusBadgeText}>SECURE</Text>
            </View>
          </View>

          {[
            { t: '10:24', msg: 'Encrypted tunnel established' },
            { t: '10:25', msg: 'Seismic node #12 responded' },
            { t: '10:27', msg: 'Data packet synchronization' },
          ].map((item, i) => (
            <View key={i} style={styles.logLine}>
              <View style={styles.logTimeBox}>
                <Text style={styles.logTime}>{item.t}</Text>
              </View>
              <Text style={styles.logMsg}>{item.msg}</Text>
            </View>
          ))}
        </View>

        {/* MODERN ACTION BUTTON */}
        <TouchableOpacity style={styles.primaryButton} activeOpacity={0.8}>
          <Text style={styles.btnText}>REBOOT ACCESS</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RTAScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC', // Off-White
  },
  softGlow: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(14, 165, 233, 0.08)',
  },
  scrollContent: {
    paddingHorizontal: 28,
    paddingTop: 80,
    paddingBottom: 40,
  },
  topHeader: {
    marginBottom: 30,
  },
  liveTag: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
    marginRight: 8,
  },
  liveTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 1.5,
  },
  mainTitle: {
    fontSize: 36,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 42,
    letterSpacing: -1,
  },
  heroClock: {
    marginBottom: 45,
  },
  clockBig: {
    fontSize: 64,
    fontWeight: '200',
    color: '#0F172A',
    letterSpacing: -3,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  dateSmall: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 1,
  },
  yearBadge: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 10,
  },
  yearText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#475569',
  },
  metricsWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 25,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 30,
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
  },
  mDivider: {
    width: 1,
    height: 20,
    backgroundColor: '#E2E8F0',
  },
  mLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 1,
    marginBottom: 4,
  },
  mValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0EA5E9',
  },
  logCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  logTitle: {
    color: '#0F172A',
    fontWeight: '800',
    fontSize: 15,
  },
  statusBadge: {
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusBadgeText: {
    color: '#0EA5E9',
    fontSize: 10,
    fontWeight: '800',
  },
  logLine: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderTopWidth: 1,
    borderColor: '#F1F5F9',
  },
  logTimeBox: {
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 12,
  },
  logTime: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '700',
  },
  logMsg: {
    color: '#475569',
    fontSize: 13,
    flex: 1,
    fontWeight: '500',
  },
  primaryButton: {
    backgroundColor: '#0F172A',
    paddingVertical: 20,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  btnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1.5,
  },
});
