import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { NewsItem } from '../../data/news';
import styles from '../../styles/newsSectionStyle';

type Props = {
  data: NewsItem[];
  onItemPress?: (item: NewsItem) => void;
};

const NewsSection = ({ data, onItemPress }: Props) => {
  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>Berita Terkini</Text>
      </View>

      {/* NEWS LIST */}
      {data.slice(0, 3).map(item => (
        <TouchableOpacity
          key={item.id}
          style={styles.card}
          onPress={() => onItemPress?.(item)}
          activeOpacity={0.85}
        >
          <Image source={item.image} style={styles.thumbnail} />

          <View style={styles.content}>
            <Text style={styles.cardTitle} numberOfLines={2}>
              {item.title}
            </Text>

            <Text style={styles.summary} numberOfLines={2}>
              {item.summary}
            </Text>

            <Text style={styles.date}>{item.date}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default NewsSection;
