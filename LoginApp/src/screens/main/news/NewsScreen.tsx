import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  BackHandler,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useLayout } from '../../../contexts/LayoutContext';
import { styles } from '../../../styles/news/newsStyle';
import API from '../../../services/api';

const NewsScreen = () => {
  const navigation = useNavigation<any>();
  const { setTitle, setHideNavbar, setShowBack, setOnBack, setShowSearch } =
    useLayout();

  const [newsData, setNewsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const sub = BackHandler.addEventListener('hardwareBackPress', () => {
        navigation.navigate('Main', { screen: 'Home' });
        return true;
      });
      return () => sub.remove();
    }, [navigation]),
  );

  useEffect(() => {
    setTitle('Berita');
    setHideNavbar(true);
    setShowBack(true);
    setShowSearch(false);

    fetchNews();

    return () => {
      setOnBack(undefined);
      setHideNavbar(false);
      setShowBack(false);
    };
  }, []);

  const fetchNews = async () => {
    try {
      const res = await API.get('/berita');
      setNewsData(res.data);
    } catch (error) {
      console.log('Error fetch berita:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.95}
      onPress={() => navigation.navigate('DetailBerita', { id: item.dbe_id })}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri: `https://simpel-bcm.com/img/berita/${item.dbe_gambar}`,
          }}
          style={styles.thumbnail}
          resizeMode="cover"
        />
      </View>

      <View style={styles.cardContent}>
        <Text style={styles.category}>Berita Terkini</Text>
        <Text style={styles.title} numberOfLines={2}>
          {item.dbe_judul}
        </Text>
        <Text style={styles.summary} numberOfLines={2}>
          {item.dbe_isi_cuplikan}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

  return (
    <View style={styles.screen}>
      <FlatList
        data={newsData}
        keyExtractor={item => item.dbe_id.toString()}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

export default NewsScreen;
