import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { BASE_URL } from '../../config/env';
import { PANDUAN_ICON_MAP } from '../../utils/panduanIconMap';

export default function SmallBanner() {
  const navigation = useNavigation<any>();
  const [panduan, setPanduan] = useState<any[]>([]);

  /* ===== FETCH PANDUAN (PUBLIC API) ===== */
  useEffect(() => {
    const fetchPanduan = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/panduan`);
        if (res.data?.status) {
          setPanduan(res.data.data);
        }
      } catch (error) {
        console.log('Gagal ambil data panduan (SmallBanner)', error);
      }
    };

    fetchPanduan();
  }, []);

  // Guard: data belum siap
  if (!panduan.length) {
    return null;
  }

  // Hero & Quick Actions
  const hero = panduan[0];
  const quickActions = panduan.slice(1, 13);

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Edukasi Siaga</Text>
          <Text style={styles.subtitle}>Panduan resmi penyelamatan</Text>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('PanduanBencana')}>
          <Text style={styles.more}>Lihat Semua</Text>
        </TouchableOpacity>
      </View>

      {/* HERO CARD */}
      <TouchableOpacity
        style={styles.heroCard}
        activeOpacity={0.9}
        onPress={() =>
          navigation.navigate('PanduanDetailScreen', {
            id: hero.mbe_id,
            title: hero.mbe_nama,
          })
        }
      >
        <View style={styles.heroLeft}>
          <Text style={styles.heroTitle}>{hero.mbe_nama}</Text>
          <View style={styles.heroBtn}>
            <Text style={styles.heroBtnText}>Baca Sekarang</Text>
          </View>
        </View>

        <View style={styles.heroRight}>
          <Image
            source={
              PANDUAN_ICON_MAP[hero.mbe_id] ??
              require('../../assets/iconsPanduan/alert_4944314.png')
            }
            style={styles.heroIcon}
            resizeMode="contain"
          />
        </View>
      </TouchableOpacity>

      {/* QUICK ACTIONS */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scroll}
      >
        {quickActions.map(item => (
          <TouchableOpacity
            key={item.mbe_id}
            style={styles.actionCard}
            onPress={() =>
              navigation.navigate('PanduanDetailScreen', {
                id: item.mbe_id,
                title: item.mbe_nama,
              })
            }
          >
            <View style={styles.iconBox}>
              <Image
                source={
                  PANDUAN_ICON_MAP[item.mbe_id] ??
                  require('../../assets/iconsPanduan/alert_4944314.png')
                }
                style={styles.miniIcon}
                resizeMode="contain"
              />
            </View>

            <Text style={styles.actionLabel} numberOfLines={1}>
              {item.mbe_nama}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
  },
  subtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  more: {
    fontSize: 14,
    color: '#F8AD3C', // Warna aksen brand Anda
    fontWeight: '700',
  },

  /* HERO CARD - Menggunakan Dark Theme agar elegan */
  heroCard: {
    marginHorizontal: 20,
    backgroundColor: '#1F2937', // Warna gelap solid (tidak butuh data color)
    borderRadius: 24,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  heroLeft: {
    flex: 1.5,
  },
  heroTag: {
    color: '#F8AD3C',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 6,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  heroBtn: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  heroBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  heroRight: {
    flex: 1,
    alignItems: 'center',
  },
  heroIcon: {
    width: 85,
    height: 85,
  },

  /* QUICK ACTIONS - Minimalist Border */
  scroll: {
    marginTop: 20,
    paddingLeft: 20,
  },
  actionCard: {
    width: 90,
    marginRight: 16,
    alignItems: 'center',
  },
  iconBox: {
    width: 70,
    height: 70,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#F3F4F6', // Border tipis abu-abu sangat muda
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  miniIcon: {
    width: 35,
    height: 35,
  },
  actionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4B5563',
    textAlign: 'center',
  },
});
