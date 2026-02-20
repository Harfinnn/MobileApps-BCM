import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  Image,
  BackHandler,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import {
  useFocusEffect,
  useRoute,
  useNavigation,
} from '@react-navigation/native';
import API from '../../../services/api';
import { useLayout } from '../../../contexts/LayoutContext';

const screenWidth = Dimensions.get('window').width;

const PanduanDetailScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { id } = route.params;

  const { setHideNavbar, setShowBack, setOnBack, setShowSearch } = useLayout();

  const [images, setImages] = useState<string[]>([]);
  const [ratios, setRatios] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState<boolean>(true);

  /* ===== LAYOUT ===== */
  useEffect(() => {
    setHideNavbar(true);
    setShowBack(true);
    setShowSearch(false);

    setOnBack(() => () => {
      navigation.goBack();
      return true;
    });

    return () => {
      setOnBack(undefined);
      setHideNavbar(true);
      setShowBack(true);
    };
  }, [navigation]);

  /* ===== HARDWARE BACK ===== */
  useFocusEffect(
    useCallback(() => {
      const sub = BackHandler.addEventListener('hardwareBackPress', () => {
        navigation.goBack();
        return true;
      });
      return () => sub.remove();
    }, [navigation]),
  );

  /* ===== FETCH IMAGE ===== */
  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      try {
        const res = await API.get(`/panduan/${id}`);

        if (res.data?.status) {
          const imgs = res.data.data.map((item: any) => item.image);
          setImages(imgs);

          // hitung rasio tiap gambar
          imgs.forEach((uri: string, index: number) => {
            Image.getSize(uri, (w, h) => {
              setRatios(prev => ({
                ...prev,
                [index]: h / w,
              }));
            });
          });
        }
      } catch (e) {
        console.log('Gagal ambil gambar panduan', e);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [id]);

  /* ===== LOADING ===== */
  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#0F172A" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {images.map((img, index) => {
          const ratio = ratios[index] ?? 1.4; // fallback aman

          return (
            <View key={index} style={styles.imageSection}>
              <Image
                source={{ uri: img }}
                style={[styles.image, { height: screenWidth * ratio }]}
                resizeMode="contain"
              />
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default PanduanDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  scrollContent: {
    paddingTop: 70,
    paddingBottom: 24,
  },

  imageSection: {
    width: '100%',
  },

  image: {
    width: '100%',
  },

  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
});
