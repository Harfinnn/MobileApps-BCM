import React, { useCallback, useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  BackHandler,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {
  useFocusEffect,
  useRoute,
  useNavigation,
} from '@react-navigation/native';
import API from '../../../services/api';
import { useLayout } from '../../../contexts/LayoutContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const PanduanDetailScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { id } = route.params;

  const { setHideNavbar, setShowBack, setOnBack, setShowSearch } = useLayout();

  const [images, setImages] = useState<string[]>([]);
  const [ratios, setRatios] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState<boolean>(true);

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isZoomVisible, setIsZoomVisible] = useState<boolean>(false);

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
      setHideNavbar(false);
      setShowBack(false);
    };
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      const sub = BackHandler.addEventListener('hardwareBackPress', () => {
        if (isZoomVisible) {
          setIsZoomVisible(false);
          return true;
        }
        navigation.goBack();
        return true;
      });
      return () => sub.remove();
    }, [navigation, isZoomVisible]),
  );

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      try {
        const res = await API.get(`/panduan/${id}`);

        if (res.data?.status) {
          const imgs = res.data.data.map((item: any) => item.image);
          setImages(imgs);

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

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const renderItem = ({ item, index }: { item: string; index: number }) => {
    const ratio = ratios[index] ?? 1.4;

    return (
      <View style={styles.slideContainer}>
        <View style={[styles.imageCard, styles.shadowProps]}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => setIsZoomVisible(true)}
            style={styles.touchableWrapper}
          >
            <Image
              source={{ uri: item }}
              style={[styles.image, { aspectRatio: 1 / ratio }]}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#2CCABC" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAFBFC" />

      <FlatList
        data={images}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        bounces={false}
      />

      <View style={styles.footer}>
        <Text style={styles.pageText}>
          Halaman {currentIndex + 1} dari {images.length}
        </Text>

        <View style={styles.dotsContainer}>
          {images.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                currentIndex === index ? styles.dotActive : styles.dotInactive,
              ]}
            />
          ))}
        </View>
      </View>

      <Modal visible={isZoomVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <SafeAreaView style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => setIsZoomVisible(false)}
              style={styles.modalCloseBtn}
            >
              <Text style={styles.modalCloseText}>✕ Tutup</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Halaman {currentIndex + 1}</Text>
            <View style={styles.spacer} />
          </SafeAreaView>

          <ScrollView
            maximumZoomScale={4}
            minimumZoomScale={1}
            centerContent
            contentContainerStyle={styles.modalScroll}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
          >
            {images.length > 0 ? (
              <Image
                source={{ uri: images[currentIndex] }}
                style={styles.fullMapImage}
                resizeMode="contain"
              />
            ) : null}
          </ScrollView>
          <View style={styles.modalFooterText}>
            <Text style={styles.zoomHintText}>
              Gunakan dua jari untuk memperbesar
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default PanduanDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFBFC',
    paddingTop: 80,
  },
  slideContainer: {
    width: SCREEN_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 60,
  },
  imageCard: {
    width: '100%',
    backgroundColor: '#002B49',
    borderRadius: 16,
    overflow: 'hidden',
    maxHeight: '100%',
  },
  touchableWrapper: {
    width: '100%',
  },
  image: {
    width: '100%',
    height: undefined,
  },
  shadowProps: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 8,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    width: '100%',
    alignItems: 'center',
  },
  pageText: {
    fontSize: 13,
    color: '#334155',
    fontWeight: '700',
    marginBottom: 10,
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: '#2CCABC',
    width: 20,
  },
  dotInactive: {
    backgroundColor: '#CBD5E1',
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAFBFC',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalCloseBtn: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
  },
  modalCloseText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  modalTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  spacer: {
    width: 60,
  },
  modalScroll: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullMapImage: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height * 0.8,
  },
  modalFooterText: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    alignItems: 'center',
    pointerEvents: 'none',
  },
  zoomHintText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    overflow: 'hidden',
  },
});
