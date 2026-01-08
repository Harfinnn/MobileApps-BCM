import React from 'react';
import {
  View,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';

import Banner1 from '../../assets/banners/rescue1.jpg';
import Banner2 from '../../assets/banners/rescue2.jpg';
import Banner3 from '../../assets/banners/rescue3.jpg';

const BANNERS = [
  { id: '1', image: Banner1 },
  { id: '2', image: Banner2 },
  { id: '3', image: Banner3 },
];

export default function SmallBanner() {
  return (
    <View style={styles.wrapper}>
      
      <Text style={styles.title}>Edukasi</Text>
      
      <FlatList
        data={BANNERS}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 18 }}
        renderItem={({ item }) => (
          <TouchableOpacity activeOpacity={0.9}>
            <Image
              source={item.image}
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
    marginTop: 10,
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
