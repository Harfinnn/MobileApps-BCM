import React, { useRef, useEffect, useState } from 'react';
import { View, Dimensions, StyleSheet, FlatList, Image } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BANNER_HEIGHT = 280;

import Img1 from '../../assets/banners/tumb_1.png';
import Img2 from '../../assets/banners/tumb_2.png';
import Img3 from '../../assets/banners/tumb_3.png';

const DATA = [
  { id: '1', src: Img1 },
  { id: '2', src: Img2 },
  { id: '3', src: Img3 },
  { id: '1-clone', src: Img1 }, // loop halus
];

export default function ImageSlider() {
  const flatListRef = useRef<FlatList>(null);
  const currentIndex = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const timerRef = useRef<any>(null);
  const isUserInteracting = useRef(false);

  /* ================= AUTO SLIDE ================= */
  const startAutoSlide = () => {
    stopAutoSlide();

    timerRef.current = setInterval(() => {
      if (isUserInteracting.current) return;

      const nextIndex = currentIndex.current + 1;

      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });

      currentIndex.current = nextIndex;
      setActiveIndex(nextIndex);
    }, 7000);
  };

  const stopAutoSlide = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  useEffect(() => {
    startAutoSlide();
    return () => stopAutoSlide();
  }, []);

  return (
    <View style={styles.wrapper}>
      <FlatList
        ref={flatListRef}
        data={DATA}
        keyExtractor={item => item.id}
        horizontal
        pagingEnabled
        snapToInterval={SCREEN_WIDTH}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        initialNumToRender={1}
        maxToRenderPerBatch={2}
        windowSize={3}
        removeClippedSubviews
        getItemLayout={(_, index) => ({
          length: SCREEN_WIDTH,
          offset: SCREEN_WIDTH * index,
          index,
        })}
        onScrollBeginDrag={() => {
          isUserInteracting.current = true;
          stopAutoSlide();
        }}
        onScrollEndDrag={() => {
          isUserInteracting.current = false;
          startAutoSlide();
        }}
        onMomentumScrollEnd={e => {
          let index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);

          if (index === DATA.length - 1) {
            flatListRef.current?.scrollToIndex({
              index: 0,
              animated: false,
            });
            index = 0;
          }

          setActiveIndex(index);
          currentIndex.current = index;
        }}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <Image source={item.src} style={styles.image} resizeMode="cover" />
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
  },
  slide: {
    width: SCREEN_WIDTH,
    height: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
