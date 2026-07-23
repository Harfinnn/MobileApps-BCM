import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { useLayout } from '../../../contexts/LayoutContext';
import {
  IncidentItem,
  formatTanggal,
  decodeHtmlText,
} from '../../../utils/incident';

const EMERALD = '#00A39D';
const NAVY = '#0F172A';
const AMBER = '#F59E0B';

type ParamList = { IncidentDetail: { incident: IncidentItem } };

export default function IncidentDetailScreen() {
  const route = useRoute<RouteProp<ParamList, 'IncidentDetail'>>();
  const navigation = useNavigation<any>();
  const { incident } = route.params;

  const {
    setTitle,
    setHideNavbar,
    setHideHeader,
    setShowBack,
    setOnBack,
    setShowSearch,
    setHideHeaderLeft,
  } = useLayout();

  useEffect(() => {
    setTitle('Detail Insiden');
    setHideNavbar(true);
    setHideHeader(false);
    setShowBack(true);
    setShowSearch(false);
    setHideHeaderLeft(false);
    setOnBack(() => () => {
      navigation.navigate('DashboardIT');
      return true;
    });

    return () => {
      setOnBack(undefined);
      setHideNavbar(false);
      setShowBack(false);
    };
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{incident.iid_insiden}</Text>
      </View>

      <View
        style={[
          styles.typeBadge,
          {
            backgroundColor:
              incident.iid_eksternal === 1 ? '#FEF3C7' : '#E6F7F6',
          },
        ]}
      >
        <Text
          style={[
            styles.typeBadgeText,
            { color: incident.iid_eksternal === 1 ? AMBER : EMERALD },
          ]}
        >
          {incident.iid_eksternal === 1 ? 'Eksternal' : 'Internal'}
        </Text>
      </View>

      {!!incident.iid_tgl_mulai_kejadian && (
        <>
          <Text style={styles.label}>Waktu Kejadian</Text>
          <Text style={styles.text}>
            {formatTanggal(incident.iid_tgl_mulai_kejadian)}
            {incident.iid_jam_mulai ? ` · ${incident.iid_jam_mulai}` : ''}
            {incident.iid_tgl_selesai_kejadian
              ? ` — ${formatTanggal(incident.iid_tgl_selesai_kejadian)}`
              : ''}
            {incident.iid_jam_selesai ? ` ${incident.iid_jam_selesai}` : ''}
          </Text>
        </>
      )}

      {!!incident.dbmak_nama && (
        <>
          <Text style={styles.label}>Kategori Aplikasi</Text>
          <Text style={styles.text}>{incident.dbmak_nama}</Text>
        </>
      )}

      {!!incident.iid_impact && (
        <>
          <Text style={styles.label}>Impact</Text>
          <View style={styles.impactTagRow}>
            {incident.iid_impact
              .split(',')
              .map(t => t.trim())
              .filter(Boolean)
              .map((tag, i) => (
                <View key={i} style={styles.impactTag}>
                  <Text style={styles.impactTagText}>{tag}</Text>
                </View>
              ))}
          </View>
        </>
      )}

      {!!incident.iid_kronologi && (
        <>
          <Text style={styles.label}>Kronologi</Text>
          <Text style={styles.text}>
            {decodeHtmlText(incident.iid_kronologi)}
          </Text>
        </>
      )}

      {!!incident.iid_rca && (
        <>
          <Text style={styles.label}>RCA</Text>
          <Text style={styles.text}>{decodeHtmlText(incident.iid_rca)}</Text>
        </>
      )}

      {!!incident.iid_keterangan_temporary && (
        <>
          <Text style={styles.label}>Solusi Sementara</Text>
          <Text style={styles.text}>
            {decodeHtmlText(incident.iid_keterangan_temporary)}
          </Text>
        </>
      )}

      {!!incident.iid_keterangan_permanent_solution && (
        <>
          <Text style={styles.label}>Solusi Permanen</Text>
          <Text style={styles.text}>
            {decodeHtmlText(incident.iid_keterangan_permanent_solution)}
          </Text>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { padding: 20, paddingBottom: 40 },
  headerRow: { marginBottom: 12 },
  title: { fontSize: 18, fontWeight: '800', color: NAVY },
  typeBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    marginBottom: 12,
  },
  typeBadgeText: { fontSize: 10, fontWeight: '700' },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    marginTop: 14,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  text: { fontSize: 13, color: NAVY, lineHeight: 19 },
  impactTagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 6,
    gap: 6,
  },
  impactTag: {
    backgroundColor: '#F1F5F9',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  impactTagText: { fontSize: 11, color: '#64748B', fontWeight: '600' },
});
