import React from 'react';
import {
  View,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';

const BANNERS = [
  {
    id: '1',
    image: 'https://i.imgur.com/V8Z8FQe.jpg',
  },
  {
    id: '2',
    image: 'https://i.imgur.com/6LZ9QkK.jpg',
  },
  {
    id: '3',
    image: 'https://i.imgur.com/0Yk9FhT.jpg',
  },
];

export default function SmallBanner() {
  return (
    <View style={styles.wrapper}>
      
      <Text style={styles.title}>Informasi & Edukasi</Text>
      
      <FlatList
        data={BANNERS}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 18 }}
        renderItem={({ item }) => (
          <TouchableOpacity activeOpacity={0.9}>
            <Image
              source={{ uri: item.image }}
              style={styles.image}
              resizeMode="cover"
            />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 20,
  },
  image: {
    width: 260,
    height: 90,
    marginRight: 14,
    borderRadius: 12,
  },
  title: {
    marginHorizontal: 18,
    marginBottom: 10,
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
});
