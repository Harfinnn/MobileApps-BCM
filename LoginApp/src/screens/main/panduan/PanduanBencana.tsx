import React, { useCallback, useEffect, useState } from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  Image,
  BackHandler,
  FlatList,
  StatusBar,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import API from '../../../services/api';
import { useLayout } from '../../../contexts/LayoutContext';
import { styles } from '../../../styles/bencana/panduanBencanaStyle';
import { PANDUAN_ICON_MAP } from '../../../utils/panduanIconMap';

const PanduanBencanaScreen = () => {
  const navigation = useNavigation<any>();
  const { setTitle, setHideNavbar, setShowBack, setOnBack, setShowSearch } =
    useLayout();

  const [panduan, setPanduan] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  /* ===== BACK HANDLER ===== */
  useFocusEffect(
    useCallback(() => {
      const sub = BackHandler.addEventListener('hardwareBackPress', () => {
        navigation.navigate('Main', { screen: 'Home' });
        return true;
      });
      return () => sub.remove();
    }, [navigation]),
  );

  /* ===== LAYOUT ===== */
  useEffect(() => {
    setTitle('Panduan');
    setHideNavbar(true);
    setShowBack(true);
    setShowSearch(false);

    setOnBack(() => () => {
      navigation.navigate('Main', { screen: 'Home' });
      return true;
    });

    return () => {
      setOnBack(undefined);
      setHideNavbar(false);
      setShowBack(false);
    };
  }, [navigation]);

  /* ===== FETCH DATA ===== */
  useEffect(() => {
    const fetchPanduan = async () => {
      setLoading(true);
      try {
        const res = await API.get('/panduan');

        if (res.data?.status) {
          setPanduan(res.data.data);
        }
      } catch (error) {
        console.log('Gagal ambil data panduan', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPanduan();
  }, []);

  /* ===== RENDER ITEM ===== */
  const renderItem = ({ item, index }: { item: any; index: number }) => {
    const isEven = index % 2 === 0;

    return (
      <View style={styles.card}>
        <View
          style={[styles.cardInner, isEven ? styles.row : styles.rowReverse]}
        >
          <View style={styles.textInfo}>
            <Text style={styles.stepCount}>
              PANDUAN {String(index + 1).padStart(2, '0')}
            </Text>

            <Text style={styles.cardTitle}>{item.mbe_nama}</Text>

            <TouchableOpacity
              style={styles.actionButton}
              activeOpacity={0.7}
              onPress={() =>
                navigation.navigate('PanduanDetailScreen', {
                  id: item.mbe_id,
                  title: item.mbe_nama,
                })
              }
            >
              <Text style={styles.actionText}>Mulai Pelajari</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.imageContainer}>
            <View style={[styles.blobShadow, { backgroundColor: '#FDE68A' }]} />
            <Image
              source={
                PANDUAN_ICON_MAP[item.mbe_id] ??
                require('../../../assets/iconsPanduan/alert_4944314.png')
              }
              style={styles.mainIcon}
              resizeMode="contain"
            />
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.wrapper}>
      <StatusBar barStyle="dark-content" />

      <FlatList
        data={panduan}
        keyExtractor={item => item.mbe_id.toString()}
        renderItem={renderItem}
        ListHeaderComponent={() => (
          <View style={styles.headerArea}>
            <Text style={styles.overTitle}>LIBRARY</Text>
            <Text style={styles.hugeTitle}>Prosedur{'\n'}Siaga</Text>
            <View style={styles.divider} />
          </View>
        )}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default PanduanBencanaScreen;
