import React from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

const POSTERS = [
  {
    id: '1',
    title: 'Siaga Banjir',
    image:
      'https://i.imgur.com/8QfZQJH.jpg',
  },
  {
    id: '2',
    title: 'Mitigasi Gempa',
    image:
      'https://i.imgur.com/1TnQZ9p.jpg',
  },
  {
    id: '3',
    title: 'Evakuasi Tsunami',
    image:
      'https://i.imgur.com/Y6YpX5A.jpg',
  },
  {
    id: '4',
    title: 'Kebakaran Hutan',
    image:
      'https://i.imgur.com/LyZJcQF.jpg',
  },
];

export default function PosterGallery() {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>Informasi & Edukasi</Text>

      <FlatList
        data={POSTERS}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 18 }}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} activeOpacity={0.85}>
            <Image
              source={{ uri: item.image }}
              style={styles.image}
              resizeMode="cover"
            />
            <Text style={styles.cardTitle}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 18,
  },
  title: {
    marginHorizontal: 18,
    marginBottom: 10,
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  card: {
    width: 170,
    marginRight: 14,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 115,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  cardTitle: {
    padding: 10,
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
});
