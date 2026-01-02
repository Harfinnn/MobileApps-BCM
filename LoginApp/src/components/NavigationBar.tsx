import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Star, MapPin, Home, FileArchive } from 'lucide-react-native';
import { createStyles } from '../styles/navigationStyle';

const TABS = [
  { icon: FileArchive, label: 'File', color: '#F8AD3CFF' },
  { icon: Star, label: 'Favs', color: '#F8AD3CFF' },
  { icon: MapPin, label: 'Maps', color: '#F8AD3CFF' },
  { icon: Home, label: 'Home', color: '#F8AD3CFF' },
];

const TAB_WIDTH = 90;
const ACTIVE_WIDTH = 110;
const EXTRA = 10;

const styles = createStyles(TAB_WIDTH, ACTIVE_WIDTH);

const TIMING = {
  duration: 220,
  easing: Easing.out(Easing.cubic),
};

function IconTab({
  icon: Icon,
  index,
  activeIndex,
  onPress,
}: {
  icon: any;
  index: number;
  activeIndex: number;
  onPress: () => void;
}) {
  const style = useAnimatedStyle(() => {
    let offset = 0;
    if (index < activeIndex) offset = -EXTRA;
    if (index > activeIndex) offset = EXTRA;

    return {
      transform: [
        {
          translateX: withTiming(offset, TIMING),
        },
      ],
    };
  });

  return (
    <Animated.View style={style}>
      <TouchableOpacity
        onPress={onPress}
        style={styles.tab}
        activeOpacity={0.8}
      >
        <Icon size={22} color="#A99BC0" />
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function FloatingNavbar() {
  const [activeIndex, setActiveIndex] = useState(2);

  const translateX = useSharedValue(activeIndex * TAB_WIDTH);
  const labelProgress = useSharedValue(1);

  const onPressTab = (i: number) => {
    setActiveIndex(i);

    const maxTranslate =
      TAB_WIDTH * (TABS.length - 1) - (ACTIVE_WIDTH - TAB_WIDTH);

    const targetX = Math.min(i * TAB_WIDTH, maxTranslate);

    translateX.value = withTiming(targetX, TIMING);

    labelProgress.value = 0;
    labelProgress.value = withTiming(1, {
      duration: 180,
      easing: Easing.out(Easing.cubic),
    });
  };

  const pillStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const labelStyle = useAnimatedStyle(() => ({
    opacity: labelProgress.value,
    transform: [
      {
        translateX: (1 - labelProgress.value) * -6,
      },
    ],
  }));

  const ActiveIcon = TABS[activeIndex].icon;
  const ActiveLabel = TABS[activeIndex].label;

  return (
    <View style={styles.wrapper}>
      <View style={styles.navbar}>
        {/* ACTIVE PILL */}
        <Animated.View style={[styles.activePill, pillStyle]}>
          <ActiveIcon
            size={22}
            color={TABS[activeIndex].color}
            strokeWidth={2.4}
          />
          <Animated.Text style={[styles.activeLabel, labelStyle]}>
            {ActiveLabel}
          </Animated.Text>
        </Animated.View>

        {/* ICON TABS */}
        {TABS.map((tab, i) => (
          <IconTab
            key={i}
            icon={tab.icon}
            index={i}
            activeIndex={activeIndex}
            onPress={() => onPressTab(i)}
          />
        ))}
      </View>
    </View>
  );
}