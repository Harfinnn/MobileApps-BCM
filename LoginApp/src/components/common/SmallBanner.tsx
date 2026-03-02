import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { PANDUAN_ICON_MAP } from '../../utils/panduanIconMap';
import styles from '../../styles/dashboard/smallBannerStyle';

type Props = {
  panduan: any[];
};

function SmallBannerComponent({ panduan }: Props) {
  const navigation = useNavigation<any>();

  if (!panduan || panduan.length === 0) return null;

  const hero = panduan[0];
  const quickActions = panduan.slice(1, 13);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Edukasi Siaga</Text>
          <Text style={styles.subtitle}>Panduan resmi penyelamatan</Text>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('PanduanBencana')}>
          <Text style={styles.more}>Lihat Semua</Text>
        </TouchableOpacity>
      </View>

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

export default React.memo(SmallBannerComponent);
