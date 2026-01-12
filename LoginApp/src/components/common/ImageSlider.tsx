import React, { useRef, useEffect } from 'react';
import { View, Image, Dimensions, StyleSheet, Animated } from 'react-native';
import Slider1 from '../../assets/banners/newBanner1.jpg';
import Slider2 from '../../assets/banners/newBanner2.jpg';
import Slider3 from '../../assets/banners/newBanner3.jpg';

const { width } = Dimensions.get('window');
const IMAGES = [Slider1, Slider2, Slider3];

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
            <Image key={i} source={img} style={styles.image} />
          ))}
        </Animated.ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#2CCABC',
    height: 340,
    paddingTop: 65,
  },

  container: {
    borderRadius: 15, 
    marginTop: 9,
    marginHorizontal: 16,
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
