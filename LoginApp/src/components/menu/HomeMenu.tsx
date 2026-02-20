import React, { useRef, useCallback, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, FlatList } from 'react-native';
import {
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import { MAIN_MENU, MORE_MENU, MenuItemType } from '../../data/menu';
import { styles } from '../../styles/menu/menuStyle';
import { useNavigation } from '@react-navigation/native';
import { LayoutGrid } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';

type Props = {
  onDashboardPress: () => void;
};

/* =======================
   MENU ITEM
======================= */
const MenuItem = React.memo(
  ({
    item,
    onPress,
    boxed,
    index = 0,
  }: {
    item: MenuItemType;
    onPress?: () => void;
    boxed?: boolean;
    index?: number;
  }) => {
    const scale = useSharedValue(0.8);
    const opacity = useSharedValue(0);
    const translateY = useSharedValue(12);

    useEffect(() => {
      const delay = index * 60;

      scale.value = withDelay(
        delay,
        withTiming(1, {
          duration: 400,
          easing: Easing.out(Easing.exp),
        }),
      );

      opacity.value = withDelay(delay, withTiming(1, { duration: 300 }));

      translateY.value = withDelay(delay, withTiming(0, { duration: 400 }));
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
      opacity: opacity.value,
      transform: [{ scale: scale.value }, { translateY: translateY.value }],
    }));

    if (item.type === 'more') {
      return (
        <Animated.View style={animatedStyle}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={onPress}
            activeOpacity={0.85}
          >
            <View style={[styles.iconBox, { backgroundColor: '#2CCABC' }]}>
              <LayoutGrid size={30} color="#fff" />
            </View>
            <Text style={styles.menuText}>More</Text>
          </TouchableOpacity>
        </Animated.View>
      );
    }

    return (
      <Animated.View style={animatedStyle}>
        <TouchableOpacity
          style={boxed ? styles.sheetItem : styles.menuItem}
          onPress={onPress}
          activeOpacity={0.85}
        >
          <View style={{ alignItems: 'center' }}>
            <View style={styles.iconWrapper}>
              <View style={styles.iconShadowBase} />
              <View
                style={[
                  styles.iconFrame,
                  { backgroundColor: item.color || '#E9EBF7' },
                ]}
              />
              <View style={styles.frameHighlight} />

              {item.image && (
                <Image
                  source={item.image}
                  style={[
                    styles.floatingIcon,
                    {
                      width: item.iconWidth || 85,
                      height: item.iconHeight || 85,
                      bottom: item.offsetBottom ?? -30,
                      right: item.offsetRight ?? -30,
                    },
                  ]}
                  resizeMode="contain"
                />
              )}
            </View>

            <Text style={styles.menuText} numberOfLines={2}>
              {item.title}
            </Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  },
);

/* =======================
   HOME MENU
======================= */
export default function HomeMenu({ onDashboardPress }: Props) {
  const navigation = useNavigation<any>();
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [moreReady, setMoreReady] = useState(false);

  const openMore = useCallback(() => {
    setMoreReady(true);
    bottomSheetRef.current?.present();
  }, []);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.4}
        pressBehavior="close"
      />
    ),
    [],
  );

  return (
    <>
      <FlatList
        data={MAIN_MENU}
        keyExtractor={item => item.id.toString()}
        numColumns={4}
        scrollEnabled={false}
        contentContainerStyle={styles.menuGrid}
        renderItem={({ item, index }) => (
          <MenuItem
            item={item}
            index={index}
            onPress={() => {
              if (item.type === 'more') {
                openMore();
                return;
              }
              if (item.type === 'dashboard') {
                onDashboardPress();
                return;
              }
              if (item.route) {
                navigation.navigate(item.route);
              }
            }}
          />
        )}
      />

      {moreReady && (
        <BottomSheetModal
          ref={bottomSheetRef}
          snapPoints={['45%', '75%']}
          index={1}
          animateOnMount
          enablePanDownToClose
          backdropComponent={renderBackdrop}
        >
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>All Features</Text>
          </View>

          <BottomSheetScrollView>
            <View style={styles.sheetGrid}>
              {[
                ...MAIN_MENU.filter(i => !i.hideInMore && i.type !== 'more'),
                ...MORE_MENU,
              ].map((item, index) => (
                <MenuItem
                  key={item.id}
                  item={item}
                  index={index}
                  boxed
                  onPress={() => {
                    if (item.route) {
                      bottomSheetRef.current?.dismiss();
                      navigation.navigate(item.route);
                    }
                  }}
                />
              ))}
            </View>
          </BottomSheetScrollView>
        </BottomSheetModal>
      )}
    </>
  );
}
