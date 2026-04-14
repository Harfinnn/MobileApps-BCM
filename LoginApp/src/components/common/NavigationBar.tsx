import React, {
  useEffect,
  useCallback,
  useState,
  useMemo,
  useRef,
} from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Map, Home, Bot, Ban, SwatchBook } from 'lucide-react-native';
import { createStyles } from '../../styles/navigation/navigationStyle';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import { useLayout } from '../../contexts/LayoutContext';
import LottieView from 'lottie-react-native';

import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';

/* =======================
   CONFIG
======================= */
const TABS = [
  { icon: Home, label: 'Home', route: 'Home', color: '#F8AD3CFF' },
  { icon: Map, label: 'KCP', route: 'Maps', color: '#F8AD3CFF' },
  { icon: SwatchBook, label: 'Book', route: 'Book', color: '#F8AD3CFF', size: 25 },
  { icon: Bot, label: 'AI', route: 'File', color: '#F8AD3CFF' },
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
   ICON TAB
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
   NAVIGATION BAR
======================= */
function NavigationBar() {
  const navigation = useNavigation<any>();
  const { hideNavbar } = useLayout();

  /* BottomSheet */
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['45%'], []);

  const openBottomSheet = useCallback(() => {
    bottomSheetRef.current?.present();
  }, []);

  const closeBottomSheet = () => {
    bottomSheetRef.current?.dismiss();
  };

  /* ACTIVE ROUTE */
  const activeRouteName = useNavigationState(state => {
    const main = state.routes.find(r => r.name === 'Main');
    if (!main || !main.state) return 'Home';
    const routes = main.state.routes;
    return routes[routes.length - 1].name;
  });

  const initialIndex = getTabIndexByRoute(activeRouteName);

  const [activeIndexState, setActiveIndexState] = useState(initialIndex);

  const activeIndexShared = useSharedValue(initialIndex);

  const maxTranslate =
    TAB_WIDTH * (TABS.length - 1) - (ACTIVE_WIDTH - TAB_WIDTH);

  const translateX = useSharedValue(
    Math.min(initialIndex * TAB_WIDTH, maxTranslate),
  );

  const labelProgress = useSharedValue(1);

  /* ROUTE CHANGE */
  useEffect(() => {
    const index = getTabIndexByRoute(activeRouteName);

    setActiveIndexState(index);
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
  }, [activeRouteName]);

  /* TAB PRESS */
  const onPressTab = useCallback(
    (index: number) => {
      if (TABS[index].route === '#') {
        openBottomSheet();
        return;
      }

      navigation.navigate('Main', {
        screen: TABS[index].route,
      });
    },
    [navigation, openBottomSheet],
  );

  /* ANIMATIONS */
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
    <>
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

      {/* BOTTOM SHEET */}
      <BottomSheetModal
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        backdropComponent={props => (
          <BottomSheetBackdrop
            {...props}
            appearsOnIndex={0}
            disappearsOnIndex={-1}
          />
        )}
      >
        <BottomSheetView
          style={{
            padding: 25,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <LottieView
            source={require('../../assets/Web.json')}
            autoPlay
            loop
            style={{ width: 160, height: 160 }}
          />

          <Text
            style={{
              fontSize: 18,
              fontWeight: '700',
              marginTop: 10,
              color: '#333',
            }}
          >
            Fitur Dalam Pengembangan
          </Text>

          <Text
            style={{
              textAlign: 'center',
              marginTop: 8,
              color: '#666',
              lineHeight: 20,
            }}
          >
            Kami sedang menyiapkan fitur ini. Silakan cek kembali pada update
            berikutnya.
          </Text>

          <TouchableOpacity
            onPress={closeBottomSheet}
            style={{
              marginTop: 20,
              backgroundColor: '#F8AD3C',
              paddingVertical: 12,
              paddingHorizontal: 30,
              borderRadius: 8,
            }}
          >
            <Text style={{ color: 'white', fontWeight: '600' }}>Tutup</Text>
          </TouchableOpacity>
        </BottomSheetView>
      </BottomSheetModal>
    </>
  );
}

export default React.memo(NavigationBar);
