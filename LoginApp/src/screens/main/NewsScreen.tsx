import React, { useCallback, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  BackHandler,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NEWS_DUMMY, NewsItem } from '../../data/news';
import { useLayout } from '../../contexts/LayoutContext';
import { styles } from '../../styles/newsStyle';

const NewsScreen = () => {
  const navigation = useNavigation<any>();
  const { setTitle, setHideNavbar, setShowBack, setOnBack } = useLayout();

  useFocusEffect(
    useCallback(() => {
      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        () => {
          navigation.navigate('Main', { screen: 'Home' });
          return true;
        },
      );

      return () => subscription.remove();
    }, [navigation]),
  );

  useEffect(() => {
    setTitle('Berita');
    setHideNavbar(true);
    setShowBack(true);

    const goToBerita = () => {
      navigation.navigate('Main', { screen: 'Home' });
      return true;
    };

    setOnBack(() => goToBerita);

    return () => {
      setOnBack(undefined);
      setHideNavbar(false);
      setShowBack(false);
    };
  }, [navigation, setTitle, setHideNavbar, setShowBack, setOnBack]);

  const renderItem = ({ item }: { item: NewsItem }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.9}
      onPress={() => navigation.navigate('DetailBerita', { id: item.id })}
    >
      <Image source={item.image} style={styles.thumbnail} />

      <View style={styles.cardContent}>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>

        <Text style={styles.summary} numberOfLines={3}>
          {item.summary}
        </Text>

        <Text style={styles.date}>{item.date}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.screen}>
      <View style={styles.pageContainer}>
        <View style={styles.listContainer}>
          <FlatList
            data={NEWS_DUMMY}
            keyExtractor={item => item.id.toString()}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
        </View>
      </View>
    </View>
  );
};

export default NewsScreen;
