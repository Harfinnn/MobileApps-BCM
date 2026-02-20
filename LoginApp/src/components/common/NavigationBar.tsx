import React, { useEffect, useCallback, useState, useMemo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { CloudSun, Map, Home, FileArchive } from 'lucide-react-native';
import { createStyles } from '../../styles/navigation/navigationStyle';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import { useLayout } from '../../contexts/LayoutContext';

/* =======================
   CONFIG
======================= */
const TABS = [
  { icon: FileArchive, label: 'File', route: 'File', color: '#F8AD3CFF' },
  { icon: CloudSun, label: 'F3D', route: 'F3d', color: '#F8AD3CFF', size: 25 },
  { icon: Map, label: 'Maps', route: 'Maps', color: '#F8AD3CFF' },
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

/* =======================
   HELPERS
======================= */
const getTabIndexByRoute = (routeName: string) => {
  const index = TABS.findIndex(tab => tab.route === routeName);
  return index === -1 ? TABS.length - 1 : index;
};

/* =======================
   ICON TAB (MEMO)
======================= */
const IconTab = React.memo(
  ({
    icon: Icon,
    index,
    activeIndexShared,
    onPress,
  }: {
    icon: any;
    index: number;
    activeIndexShared: any;
    onPress: () => void;
  }) => {
    const style = useAnimatedStyle(() => {
      let offset = 0;
      if (index < activeIndexShared.value) offset = -EXTRA;
      if (index > activeIndexShared.value) offset = EXTRA;

      return {
        transform: [{ translateX: withTiming(offset, TIMING) }],
      };
    });

    return (
      <Animated.View style={style}>
        <TouchableOpacity
          onPress={onPress}
          style={styles.tab}
          activeOpacity={0.8}
        >
          <Icon size={TABS[index].size ?? 22} color="#ffffff" />
        </TouchableOpacity>
      </Animated.View>
    );
  },
);

/* =======================
   NAVIGATION BAR (FINAL)
======================= */
function NavigationBar() {
  const navigation = useNavigation<any>();
  const { hideNavbar } = useLayout();

  /* === ACTIVE ROUTE === */
  const activeRouteName = useNavigationState(state => {
    const main = state.routes.find(r => r.name === 'Main');
    if (!main || !main.state) return 'Home';
    const routes = main.state.routes;
    return routes[routes.length - 1].name;
  });

  /* === INITIAL INDEX === */
  const initialIndex = getTabIndexByRoute(activeRouteName);

  /* === REACT STATE (RENDER) === */
  const [activeIndexState, setActiveIndexState] = useState(initialIndex);

  /* === SHARED VALUES (ANIMATION ONLY) === */
  const activeIndexShared = useSharedValue(initialIndex);

  const maxTranslate =
    TAB_WIDTH * (TABS.length - 1) - (ACTIVE_WIDTH - TAB_WIDTH);

  const translateX = useSharedValue(
    Math.min(initialIndex * TAB_WIDTH, maxTranslate),
  );

  const labelProgress = useSharedValue(1);

  /* === UPDATE ON ROUTE CHANGE === */
  useEffect(() => {
    const index = getTabIndexByRoute(activeRouteName);

    // React render
    setActiveIndexState(index);

    // Animation
    activeIndexShared.value = index;

    translateX.value = withTiming(
      Math.min(index * TAB_WIDTH, maxTranslate),
      TIMING,
    );

    labelProgress.value = 0;
    labelProgress.value = withTiming(1, {
      duration: 180,
      easing: Easing.out(Easing.cubic),
    });
  }, [
    activeRouteName,
    activeIndexShared,
    translateX,
    labelProgress,
    maxTranslate,
  ]);

  const onPressTab = useCallback(
    (index: number) => {
      navigation.navigate('Main', {
        screen: TABS[index].route,
      });
    },
    [navigation],
  );

  /* === ANIMATED STYLES === */
  const pillStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const labelStyle = useAnimatedStyle(() => ({
    opacity: labelProgress.value,
    transform: [{ translateX: (1 - labelProgress.value) * -6 }],
  }));

  const ActiveIcon = useMemo(
    () => TABS[activeIndexState].icon,
    [activeIndexState],
  );

  const ActiveLabel = useMemo(
    () => TABS[activeIndexState].label,
    [activeIndexState],
  );

  if (hideNavbar) return null;

  return (
    <View style={styles.wrapper}>
      <View style={styles.navbar}>
        {/* ACTIVE PILL */}
        <Animated.View style={[styles.activePill, pillStyle]}>
          <ActiveIcon
            size={TABS[activeIndexState].size ?? 22}
            color={TABS[activeIndexState].color}
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
            activeIndexShared={activeIndexShared}
            onPress={() => onPressTab(i)}
          />
        ))}
      </View>
    </View>
  );
}

export default React.memo(NavigationBar);
