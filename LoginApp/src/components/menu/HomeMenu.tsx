import React, { useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import {
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import { MAIN_MENU, MORE_MENU } from '../../data/menu';
import { styles } from '../../styles/menuStyle';
import { useNavigation } from '@react-navigation/native';
import { LayoutGrid } from 'lucide-react-native';

type Props = {
  onDashboardPress: () => void;
};

type MenuItemProps = {
  item: any;
  iconColor?: string;
  onPress?: () => void;
  boxed?: boolean;
};

const MenuItem = ({ item, onPress, boxed }: MenuItemProps) => {
  return (
    <TouchableOpacity
      style={boxed ? styles.sheetItem : styles.menuItem}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={{ alignItems: 'center' }}>
        <View style={styles.iconWrapper}>
          {/* Background frame */}
          <View
            style={[
              styles.iconFrame,
              { backgroundColor: item.color || '#E9EBF7' },
            ]}
          />

          {/* Floating image */}
          <Image
            source={item.image}
            style={[
              styles.floatingIcon,
              {
                width: item.iconWidth || 85,
                height: item.iconHeight || 85,
                bottom: item.offsetBottom || -30,
                right: item.offsetRight || -30,
              },
            ]}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.menuText} numberOfLines={2}>
          {item.title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

function hasRoute(item: { route?: string }): item is { route: string } {
  return typeof item.route === 'string';
}

export default function HomeMenu({ onDashboardPress }: Props) {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const navigation = useNavigation<any>();

  const openMore = useCallback(() => {
    bottomSheetRef.current?.present();
  }, []);

  const closeMore = useCallback(() => {
    bottomSheetRef.current?.dismiss();
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
      {/* HOME GRID */}
      <View style={styles.menuGrid}>
        {MAIN_MENU.map(item => (
          <MenuItem
            key={item.id}
            item={item}
            iconColor="#F8AD3C"
            onPress={() => {
              if (item.type === 'dashboard') {
                onDashboardPress();
                return;
              }

              if (hasRoute(item)) {
                navigation.navigate(item.route);
              }
            }}
          />
        ))}

        <TouchableOpacity style={styles.menuItem} onPress={openMore}>
          <View style={[styles.iconBox, { backgroundColor: '#2CCABC' }]}>
            <LayoutGrid size={30} color="#F8AD3CFF" />
          </View>

          <Text style={styles.menuText}>More</Text>
        </TouchableOpacity>
      </View>

      {/* MORE POPUP */}
      <BottomSheetModal
        ref={bottomSheetRef}
        snapPoints={['70%', '80%']}
        enablePanDownToClose
        onDismiss={closeMore}
        backdropComponent={renderBackdrop}
      >
        <View style={styles.sheetHeader}>
          <Text style={styles.sheetTitle}>All Features</Text>
        </View>

        <BottomSheetScrollView>
          <View style={styles.sheetGrid}>
            {[...MAIN_MENU.filter(item => !item.hideInMore), ...MORE_MENU].map(
              item => (
                <MenuItem
                  key={item.id}
                  item={item}
                  iconColor="#F8AD3C"
                  boxed
                  onPress={() => {
                    if (hasRoute(item)) {
                      bottomSheetRef.current?.dismiss();
                      navigation.navigate(item.route);
                    }
                  }}
                />
              ),
            )}
          </View>
        </BottomSheetScrollView>
      </BottomSheetModal>
    </>
  );
}
