import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useLayout } from '../../../contexts/LayoutContext';
import {
  Server,
  Cpu,
  Database,
  Activity,
  HardDrive,
  CheckCircle2,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function DashboardITScreen() {
  const { setTitle, setHideNavbar, setShowBack } = useLayout();
  const [uptime, setUptime] = useState('99.98%');

  useEffect(() => {
    setTitle('Dashboard IT');
    setHideNavbar(true);
    setShowBack(true);

    return () => {
      setHideNavbar(false);
      setShowBack(false);
    };
  }, [setTitle, setHideNavbar, setShowBack]);

  const stats = [
    {
      label: 'CPU Load',
      value: '24%',
      icon: <Cpu size={20} color="#3B82F6" />,
      color: '#EFF6FF',
    },
    {
      label: 'RAM Usage',
      value: '4.2GB',
      icon: <Activity size={20} color="#10B981" />,
      color: '#ECFDF5',
    },
    {
      label: 'Storage',
      value: '1.2TB',
      icon: <HardDrive size={20} color="#F59E0B" />,
      color: '#FFFBEB',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.header}>
        <View>
          <Text style={styles.headerSubtitle}>INFRASTRUCTURE OVERVIEW</Text>
          <Text style={styles.headerTitle}>IT Dashboard</Text>
        </View>
        <TouchableOpacity style={styles.refreshBtn}>
          <Text style={styles.refreshText}>Live</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Main Health Card */}
        <View style={styles.healthCard}>
          <View style={styles.healthInfo}>
            <CheckCircle2 size={32} color="#10B981" />
            <View style={styles.healthTextContainer}>
              <Text style={styles.healthStatus}>All Systems Operational</Text>
              <Text style={styles.healthDesc}>
                Uptime: {uptime} (Last 30 days)
              </Text>
            </View>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.grid}>
          {stats.map((item, index) => (
            <View
              key={index}
              style={[styles.statBox, { backgroundColor: item.color }]}
            >
              <View style={styles.iconCircle}>{item.icon}</View>
              <Text style={styles.statValue}>{item.value}</Text>
              <Text style={styles.statLabel}>{item.label}</Text>
            </View>
          ))}
        </View>

        {/* Server List Section */}
        <Text style={styles.sectionTitle}>Active Nodes</Text>

        {[
          {
            name: 'Primary DB Cluster',
            status: 'Online',
            ip: '192.168.1.10',
            load: '12%',
          },
          {
            name: 'Main API Gateway',
            status: 'Online',
            ip: '192.168.1.12',
            load: '45%',
          },
          {
            name: 'Backup Storage S3',
            status: 'Online',
            ip: '10.0.0.5',
            load: '05%',
          },
        ].map((server, i) => (
          <View key={i} style={styles.serverItem}>
            <View style={styles.serverIcon}>
              <Server size={22} color="#64748B" />
            </View>
            <View style={styles.serverInfo}>
              <Text style={styles.serverName}>{server.name}</Text>
              <Text style={styles.serverIp}>{server.ip}</Text>
            </View>
            <View style={styles.serverMeta}>
              <Text style={styles.loadText}>{server.load}</Text>
              <View style={styles.onlineIndicator} />
            </View>
          </View>
        ))}

        {/* Bottom Action */}
        <TouchableOpacity style={styles.primaryAction}>
          <Database size={20} color="#FFF" style={{ marginRight: 10 }} />
          <Text style={styles.primaryActionText}>View Database Logs</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerSubtitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 1.5,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
  },
  refreshBtn: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#10B981',
  },
  refreshText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#10B981',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 40,
  },
  healthCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 24,
  },
  healthInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  healthTextContainer: {
    marginLeft: 16,
  },
  healthStatus: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  healthDesc: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  statBox: {
    width: (width - 48) / 3 - 8,
    padding: 16,
    borderRadius: 24,
    alignItems: 'flex-start',
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 16,
  },
  serverItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: '#F1F5F9',
  },
  serverIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  serverInfo: {
    flex: 1,
  },
  serverName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
  },
  serverIp: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  serverMeta: {
    alignItems: 'flex-end',
  },
  loadText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  onlineIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
    marginTop: 6,
  },
  primaryAction: {
    backgroundColor: '#0F172A',
    flexDirection: 'row',
    paddingVertical: 18,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  primaryActionText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
});
