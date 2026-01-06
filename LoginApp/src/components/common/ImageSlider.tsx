import React, { useRef, useEffect } from 'react';
import { View, Image, Dimensions, StyleSheet, Animated } from 'react-native';

const { width } = Dimensions.get('window');

const IMAGES = [
  'https://picsum.photos/id/1011/800/400',
  'https://picsum.photos/id/1015/800/400',
  'https://picsum.photos/id/1025/800/400',
];

export default function ImageSlider() {
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef<Animated.ScrollView>(null);
  let index = 0;

  useEffect(() => {
    const interval = setInterval(() => {
      index = (index + 1) % IMAGES.length;
      scrollRef.current?.scrollTo({
        x: index * width,
        animated: true,
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <Animated.ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false },
          )}
          scrollEventThrottle={16}
        >
          {IMAGES.map((img, i) => (
            <Image key={i} source={{ uri: img }} style={styles.image} />
          ))}
        </Animated.ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 16,
    marginTop: 12,
  },

  container: {
    borderRadius: 15, 
    overflow: 'hidden', 
    borderWidth: 1, 
    borderColor: 'rgba(255,255,255,0.2)', 
  },

  image: {
    width,
    aspectRatio: 16 / 9,
    resizeMode: 'cover',
  },
});
