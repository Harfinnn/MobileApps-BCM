import React, { useRef, useMemo, useCallback } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import { Grid } from 'lucide-react-native';
import { MAIN_MENU, MORE_MENU } from '../../data/menu';
import { useLayout } from '../../contexts/LayoutContext';
import { styles } from '../../styles/menuStyle';

type MenuItemProps = {
  item: any;
  iconColor?: string;
  onPress?: () => void;
  boxed?: boolean;
};

const MenuItem = ({ item, iconColor, onPress, boxed }: MenuItemProps) => {
  const Icon = item.icon;

  return (
    <TouchableOpacity
      style={boxed ? styles.sheetItem : styles.menuItem}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={item.title}
    >
      {boxed ? (
        <View style={styles.iconBox}>
          <Icon size={24} color={iconColor} />
        </View>
      ) : (
        <Icon size={30} color={iconColor} />
      )}

      <Text style={styles.menuText}>{item.title}</Text>
    </TouchableOpacity>
  );
};

const HomeMenu = () => {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['70%', '80%'], []);
  const { setHideNavbar } = useLayout();

  const openMore = useCallback(() => {
    setHideNavbar(true);
    bottomSheetRef.current?.present();
  }, [setHideNavbar]);

  const closeMore = useCallback(() => {
    setHideNavbar(false);
  }, [setHideNavbar]);

  return (
    <>
      {/* HOME GRID */}
      <View style={styles.menuGrid}>
        {MAIN_MENU.map(item => (
          <MenuItem
            key={item.id}
            item={item}
            iconColor="#F8AD3C"
          />
        ))}

        <TouchableOpacity style={styles.menuItem} onPress={openMore}>
          <Grid size={30} color="#12CBEC" />
          <Text style={styles.menuText}>More</Text>
        </TouchableOpacity>
      </View>

      {/* BOTTOM SHEET */}
      <BottomSheetModal
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        enablePanDownToClose
        onDismiss={closeMore}
        handleIndicatorStyle={styles.handle}
        backdropComponent={props => (
          <BottomSheetBackdrop
            {...props}
            appearsOnIndex={0}
            disappearsOnIndex={-1}
          />
        )}
      >
        <View style={styles.sheetHeader}>
          <Text style={styles.sheetTitle}>All Features</Text>
        </View>

        <BottomSheetScrollView>
          <View style={styles.sheetGrid}>
            {[...MAIN_MENU, ...MORE_MENU].map(item => (
              <MenuItem
                key={item.id}
                item={item}
                iconColor="#F8AD3C"
                boxed
              />
            ))}
          </View>
        </BottomSheetScrollView>
      </BottomSheetModal>
    </>
  );
};

export default HomeMenu;