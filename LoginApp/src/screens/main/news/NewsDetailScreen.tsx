import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  BackHandler,
  StatusBar,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import RenderHTML from 'react-native-render-html';
import { useLayout } from '../../../contexts/LayoutContext';
import { styles } from '../../../styles/news/newsDetailStyle';
import API from '../../../services/api';

const BASE_IMAGE_URL = 'https://simpel-bcm.com/img/berita/';

const NewsDetailScreen = () => {
  const route = useRoute<any>();
  const { id } = route.params as { id: number };
  const { width } = useWindowDimensions();

  const { setTitle, setHideNavbar, setShowBack, setOnBack, setShowSearch } =
    useLayout();
  const navigation = useNavigation<any>();

  const [news, setNews] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        () => {
          navigation.navigate('Main', { screen: 'Berita' });
          return true;
        },
      );
      return () => subscription.remove();
    }, [navigation]),
  );

  useEffect(() => {
    setTitle('Detail Berita');
    setHideNavbar(true);
    setShowBack(true);
    setShowSearch(false);

    fetchDetail();

    return () => {
      setOnBack(undefined);
      setHideNavbar(false);
      setShowBack(false);
    };
  }, []);

  const fetchDetail = async () => {
    try {
      const res = await API.get(`/berita/${id}`);
      setNews(res.data);
    } catch (error) {
      console.log('Error fetch detail:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

  if (!news) {
    return (
      <View style={styles.center}>
        <Text>Berita tidak ditemukan</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.headerInfo}>
          <Text style={styles.title}>{news.dbe_judul}</Text>
          <Text style={styles.date}>
            {news.dbe_tgl} • {news.dbe_jam}
          </Text>
        </View>

        {/* Gambar */}
        <View style={styles.imageWrapper}>
          <Image
            source={{ uri: `${BASE_IMAGE_URL}${news.dbe_gambar}` }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>

        {/* Konten HTML dari TinyMCE */}
        <View style={styles.body}>
          <RenderHTML
            contentWidth={width}
            source={{ html: news.dbe_isi }}
            tagsStyles={{
              p: {
                fontSize: 16,
                lineHeight: 26,
                marginBottom: 12,
              },
              strong: { fontWeight: 'bold' },
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default NewsDetailScreen;
