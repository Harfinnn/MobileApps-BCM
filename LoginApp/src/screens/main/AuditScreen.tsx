import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity,
  FlatList,
  StatusBar
} from 'react-native';
import { useLayout } from '../../contexts/LayoutContext';
import styles from '../../styles/audit/auditStyle'; 

const AuditScreen = () => {
  const { setTitle, setHideNavbar, setShowBack } = useLayout();

  useEffect(() => {
    setTitle('Audit Intern');
    setHideNavbar(true);
    setShowBack(true);

    return () => {
      setHideNavbar(false);
      setShowBack(false);
    };
  }, [setTitle, setHideNavbar, setShowBack]);

  const auditData = [
    { id: '1', title: 'Audit Keselamatan Kerja', date: '12 Feb 2026', status: 'Selesai', score: '95%', color: '#6366F1' },
    { id: '2', title: 'Audit Fasilitas Gedung', date: '20 Feb 2026', status: 'In Progress', score: '-', color: '#F59E0B' },
    { id: '3', title: 'Pemeriksaan Alat Berat', date: '05 Mar 2026', status: 'Terjadwal', score: '-', color: '#10B981' },
  ];

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.upperTitle}>STATISTIK AUDIT</Text>
      <View style={styles.titleRow}>
        <Text style={styles.mainTitle}>Overview</Text>
      </View>

      <View style={styles.heroCard}>
        <View style={styles.heroTop}>
          <View>
            <Text style={styles.heroLabel}>Total Compliance</Text>
            <Text style={styles.heroValue}>82.4%</Text>
          </View>
          <View style={styles.percentageBadge}>
            <Text style={styles.percentageText}>+2.1%</Text>
          </View>
        </View>
        
        <View style={styles.chartContainer}>
          {[30, 50, 45, 80, 60, 90, 75].map((h, i) => (
            <View key={i} style={styles.barGroup}>
              <View style={[styles.barBack]}>
                <View style={[styles.barFront, { height: h }]} />
              </View>
              <Text style={styles.barLabel}>{['M', 'S', 'S', 'R', 'K', 'J', 'S'][i]}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNum}>24</Text>
          <Text style={styles.statDesc}>Audit Selesai</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statNum, { color: '#F59E0B' }]}>07</Text>
          <Text style={styles.statDesc}>Perlu Revisi</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Aktivitas Terbaru</Text>
    </View>
  );

  return (
    <View style={styles.mainWrapper}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />
      <FlatList
        data={auditData}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.itemCard} activeOpacity={0.8}>
            <View style={[styles.colorIndicator, { backgroundColor: item.color }]} />
            <View style={styles.itemMain}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemSub}>{item.date}  •  {item.status}</Text>
            </View>
            {item.score !== '-' && (
              <View style={styles.scoreContainer}>
                <Text style={[styles.scoreText, { color: item.color }]}>{item.score}</Text>
              </View>
            )}
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default AuditScreen;