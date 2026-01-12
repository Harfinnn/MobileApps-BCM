import React, { useCallback, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  BackHandler,
} from 'react-native';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { NEWS_DUMMY, NewsItem } from '../../data/news';
import { useLayout } from '../../contexts/LayoutContext';
import { styles } from '../../styles/newsDetailStyle';

const NewsDetailScreen = () => {
  const route = useRoute<any>();
  const { id } = route.params as { id: number };
  const { setTitle, setHideNavbar, setShowBack, setOnBack } = useLayout();
  const navigation = useNavigation<any>();

  const news = useMemo<NewsItem | undefined>(
    () => NEWS_DUMMY.find(item => item.id === id),
    [id],
  );

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

    const goToBerita = () => {
      navigation.navigate('Main', { screen: 'Berita' });
      return true;
    };

    setOnBack(() => goToBerita);

    return () => {
      setOnBack(undefined);
      setHideNavbar(false);
      setShowBack(false);
    };
  }, [navigation, setTitle, setHideNavbar, setShowBack, setOnBack]);

  if (!news) {
    return (
      <View style={styles.center}>
        <Text>Berita tidak ditemukan</Text>
      </View>
    );
  }

  const paragraphs = news.content.split('\n\n');

  return (
    <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
      <Image source={news.image} style={styles.image} />

      <View style={styles.contentCard}>
        <Text style={styles.title}>{news.title}</Text>
        <Text style={styles.date}>{news.date}</Text>

        {paragraphs.map((text, index) => (
          <Text
            key={index}
            style={[
              styles.paragraph,
              index === 0 && styles.leadParagraph,
            ]}
          >
            {text}
          </Text>
        ))}
      </View>
    </ScrollView>
  );
};

export default NewsDetailScreen;
