import React from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import styles from '../../styles/news/newsSectionStyle';

const BASE_IMAGE_URL = 'https://simpel-bcm.com/img/berita/';

type NewsItem = {
  dbe_id: number;
  dbe_judul: string;
  dbe_gambar: string;
  dbe_tgl: string;
};

type Props = {
  data: NewsItem[];
  onItemPress?: (item: NewsItem) => void;
  onPressAll?: () => void;
};

const NewsSection = ({ data, onItemPress, onPressAll }: Props) => {
  if (!data || data.length === 0) return null;

  const featuredNews = data[0];
  const otherNews = data.slice(1, 5);

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>Berita Terkini</Text>

        <TouchableOpacity onPress={onPressAll} activeOpacity={0.7}>
          <Text style={styles.seeAllText}>Lihat Semua</Text>
        </TouchableOpacity>
      </View>

      {/* FEATURED HERO CARD */}
      <TouchableOpacity
        style={styles.heroCard}
        onPress={() => onItemPress?.(featuredNews)}
        activeOpacity={0.9}
      >
        <Image
          source={{
            uri: `${BASE_IMAGE_URL}${featuredNews.dbe_gambar?.trim()}`,
          }}
          style={styles.heroImage}
        />

        <View style={styles.heroOverlay}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Terbaru</Text>
          </View>

          <Text style={styles.heroTitle} numberOfLines={2}>
            {featuredNews.dbe_judul}
          </Text>

          <Text style={styles.heroDate}>{featuredNews.dbe_tgl}</Text>
        </View>
      </TouchableOpacity>

      {/* HORIZONTAL MINI CARDS */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {otherNews.map(item => (
          <TouchableOpacity
            key={item.dbe_id}
            style={styles.miniCard}
            onPress={() => onItemPress?.(item)}
            activeOpacity={0.8}
          >
            <Image
              source={{
                uri: `${BASE_IMAGE_URL}${item.dbe_gambar?.trim()}`,
              }}
              style={styles.miniThumbnail}
            />

            <View style={styles.miniContent}>
              <Text style={styles.miniTitle} numberOfLines={2}>
                {item.dbe_judul}
              </Text>

              <Text style={styles.miniDate}>{item.dbe_tgl}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default NewsSection;
