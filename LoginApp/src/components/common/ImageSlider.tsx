import React, { useRef, useEffect } from 'react';
import {
  View,
  Dimensions,
  StyleSheet,
  FlatList,
  Image,
} from 'react-native';

import Slider1 from '../../assets/banners/poster.png';
import Slider2 from '../../assets/banners/poster2.png';
import Slider3 from '../../assets/banners/poster3.png';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BANNER_HEIGHT = 280;

const IMAGES = [
  { id: '1', src: Slider1 },
  { id: '2', src: Slider2 },
  { id: '3', src: Slider3 },
];

export default function ImageSlider() {
  const flatListRef = useRef<FlatList>(null);
  const currentIndex = useRef(0);

  /* ================= AUTO SLIDE ================= */
  useEffect(() => {
    if (IMAGES.length <= 1) return;

    const timer = setInterval(() => {
      currentIndex.current = (currentIndex.current + 1) % IMAGES.length;

      flatListRef.current?.scrollToIndex({
        index: currentIndex.current,
        animated: true,
      });
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  return (
    <View style={styles.wrapper}>
      <FlatList
        ref={flatListRef}
        data={IMAGES}
        keyExtractor={item => item.id}
        horizontal
        pagingEnabled
        snapToInterval={SCREEN_WIDTH}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <Image source={item.src} style={styles.image} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: SCREEN_WIDTH,
    height: BANNER_HEIGHT,
    backgroundColor: '#000',
  },

  slide: {
    width: SCREEN_WIDTH,
    height: '100%',
  },

  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});
