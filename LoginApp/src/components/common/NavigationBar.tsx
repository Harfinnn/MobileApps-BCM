import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Star, MapPin, Home, FileArchive } from 'lucide-react-native';
import { createStyles } from '../../styles/navigationStyle';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import { useLayout } from '../../contexts/LayoutContext';

const TABS = [
  { icon: FileArchive, label: 'File', route: 'File', color: '#F8AD3CFF' },
  { icon: Star, label: 'Favs', route: 'Favs', color: '#F8AD3CFF' },
  { icon: MapPin, label: 'Maps', route: 'Maps', color: '#F8AD3CFF' },
  { icon: Home, label: 'Home', route: 'Home', color: '#F8AD3CFF' },
];

const TAB_WIDTH = 90;
const ACTIVE_WIDTH = 110;
const EXTRA = 10;

const styles = createStyles(TAB_WIDTH, ACTIVE_WIDTH);

const TIMING = {
  duration: 220,
  easing: Easing.out(Easing.cubic),
};

/**
 * ICON TAB
 */
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

/**
 * NAVIGATION BAR (FINAL & STABLE)
 */
export default function NavigationBar() {
  const navigation = useNavigation<any>();

  /**
   * 🔥 Ambil ACTIVE ROUTE dari MAIN STACK
   * BUKAN dari useRoute()
   */
  const activeRouteName = useNavigationState(state => {
    const mainRoute = state.routes.find(r => r.name === 'Main');

    if (!mainRoute || !mainRoute.state) {
      return 'Home';
    }

    const routes = mainRoute.state.routes;
    return routes[routes.length - 1].name;
  });

  const [activeIndex, setActiveIndex] = useState(0);

  const translateX = useSharedValue(0);
  const labelProgress = useSharedValue(1);

  /**
   * 🔥 SYNC ANIMATION DENGAN ROUTE AKTIF
   */
  useEffect(() => {
    const index = TABS.findIndex(tab => tab.route === activeRouteName);

    if (index !== -1) {
      setActiveIndex(index);

      const maxTranslate =
        TAB_WIDTH * (TABS.length - 1) - (ACTIVE_WIDTH - TAB_WIDTH);

      const targetX = Math.min(index * TAB_WIDTH, maxTranslate);

      translateX.value = withTiming(targetX, TIMING);

      labelProgress.value = 0;
      labelProgress.value = withTiming(1, {
        duration: 180,
        easing: Easing.out(Easing.cubic),
      });
    }
  }, [activeRouteName, translateX, labelProgress]);

  const onPressTab = (i: number) => {
    navigation.navigate('Main', {
      screen: TABS[i].route,
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

  const { hideNavbar } = useLayout();

  if (hideNavbar) return null; //

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
            key={tab.route}
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
