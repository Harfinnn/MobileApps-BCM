import React, { useEffect } from 'react';
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
  Users,
  Package,
  FileText,
  TrendingUp,
  Calendar,
  ArrowRight,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function DashboardNonITScreen() {
  const { setTitle, setHideNavbar, setShowBack } = useLayout();

  useEffect(() => {
    setTitle('Dashboard Non IT');
    setHideNavbar(true);
    setShowBack(true);

    return () => {
      setHideNavbar(false);
      setShowBack(false);
    };
  }, [setTitle, setHideNavbar, setShowBack]);

  const mainStats = [
    {
      label: 'Total Staff',
      value: '124',
      icon: <Users size={20} color="#6366F1" />,
      bg: '#EEF2FF',
    },
    {
      label: 'Inventory',
      value: '85%',
      icon: <Package size={20} color="#8B5CF6" />,
      bg: '#F5F3FF',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* HEADER AREA */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerSubtitle}>OPERATIONAL OVERVIEW</Text>
          <Text style={styles.headerTitle}>General Dashboard</Text>
        </View>
        <TouchableOpacity style={styles.dateBadge}>
          <Calendar size={14} color="#64748B" />
          <Text style={styles.dateText}>Feb 2026</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* SUMMARY CARDS */}
        <View style={styles.statsRow}>
          {mainStats.map((item, i) => (
            <View
              key={i}
              style={[styles.statCard, { backgroundColor: item.bg }]}
            >
              <View style={styles.iconCircle}>{item.icon}</View>
              <View>
                <Text style={styles.statLabel}>{item.label}</Text>
                <Text style={styles.statValue}>{item.value}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* PERFORMANCE BANNER */}
        <View style={styles.banner}>
          <View style={styles.bannerInfo}>
            <Text style={styles.bannerTitle}>Operational Growth</Text>
            <Text style={styles.bannerDesc}>
              Efisiensi meningkat 12% bulan ini.
            </Text>
          </View>
          <View style={styles.growthBadge}>
            <TrendingUp size={16} color="#10B981" />
            <Text style={styles.growthText}>+12.5%</Text>
          </View>
        </View>

        {/* QUICK ACTIONS SECTION */}
        <Text style={styles.sectionTitle}>Quick Access</Text>
        <View style={styles.actionGrid}>
          {[
            {
              name: 'Laporan Harian',
              desc: '12 Berkas baru',
              icon: <FileText size={22} color="#F59E0B" />,
            },
            {
              name: 'Data Logistik',
              desc: 'Update 2 jam lalu',
              icon: <Package size={22} color="#EC4899" />,
            },
          ].map((action, i) => (
            <TouchableOpacity key={i} style={styles.actionItem}>
              <View style={styles.actionIcon}>{action.icon}</View>
              <View style={styles.actionText}>
                <Text style={styles.actionName}>{action.name}</Text>
                <Text style={styles.actionDesc}>{action.desc}</Text>
              </View>
              <ArrowRight size={18} color="#CBD5E1" />
            </TouchableOpacity>
          ))}
        </View>

        {/* RECENT ACTIVITY LIST */}
        <Text style={[styles.sectionTitle, { marginTop: 30 }]}>
          Recent Activity
        </Text>
        <View style={styles.activityList}>
          <View style={styles.activityItem}>
            <View style={styles.activityPoint} />
            <Text style={styles.activityText}>
              Pengadaan barang rutin selesai dikirim
            </Text>
            <Text style={styles.activityTime}>09:00</Text>
          </View>
          <View style={styles.activityItem}>
            <View
              style={[styles.activityPoint, { backgroundColor: '#CBD5E1' }]}
            />
            <Text style={styles.activityText}>
              Meeting mingguan koordinasi operasional
            </Text>
            <Text style={styles.activityTime}>Kemarin</Text>
          </View>
        </View>
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
    paddingBottom: 20,
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
    fontSize: 26,
    fontWeight: '800',
    color: '#1E293B',
  },
  dateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  dateText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    marginLeft: 6,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },

  /* STATS CARDS */
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    width: (width - 60) / 2,
    padding: 20,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
  },

  /* BANNER */
  banner: {
    backgroundColor: '#F8FAFC',
    borderRadius: 24,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 30,
  },
  bannerInfo: {
    flex: 1,
  }, // <--- Ini yang tadi terlewat
  bannerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },
  bannerDesc: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  growthBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  growthText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#10B981',
    marginLeft: 4,
  },

  /* ACTIONS */
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 16,
  },
  actionGrid: {
    gap: 2,
  }, // Tambahkan ini jika dibutuhkan pembungkus
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: '#F1F5F9',
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionText: {
    flex: 1,
  },
  actionName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
  },
  actionDesc: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },

  /* ACTIVITY */
  activityList: {
    backgroundColor: '#F8FAFC',
    borderRadius: 24,
    padding: 20,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  activityPoint: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#6366F1',
    marginRight: 12,
  },
  activityText: {
    flex: 1,
    fontSize: 13,
    color: '#475569',
    fontWeight: '500',
  },
  activityTime: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
  },
});
