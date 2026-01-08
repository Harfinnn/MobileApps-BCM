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

type Props = {
  onDashboardPress: () => void;
};

type MenuItemProps = {
  item: any;
  iconColor?: string;
  onPress?: () => void;
  boxed?: boolean;
};

const MenuItem = ({ item, iconColor, onPress, boxed }: MenuItemProps) => {
  const Icon = item.icon;
  const isImage = !!item.image;
  const isSheet = !!boxed;

  const titleStyle = [
    styles.menuText,
    isImage && styles.menuTextImage,
    isSheet && styles.menuTextSheet,
  ];

  // IMAGE
  if (item.image) {
    return (
      <TouchableOpacity
        style={isSheet ? styles.sheetItem : styles.menuItem}
        onPress={onPress}
      >
        <Image source={item.image} style={styles.imageIcon} />
        <Text style={titleStyle}>{item.title}</Text>
      </TouchableOpacity>
    );
  }

  // ICON
  if (Icon) {
    return (
      <TouchableOpacity
        style={isSheet ? styles.sheetItem : styles.menuItem}
        onPress={onPress}
      >
        {boxed ? (
          <View style={styles.iconBox}>
            <Icon size={22} color={iconColor} />
          </View>
        ) : (
          <Icon size={30} color={iconColor} />
        )}
        <Text style={titleStyle}>{item.title}</Text>
      </TouchableOpacity>
    );
  }

  return null;
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
        opacity={0.4} // ⬅️ efek blur palsu
        pressBehavior="close" // klik luar = close
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
          <Image
            source={require('../../assets/icons/More2.png')}
            style={styles.moreImageIcon}
          />
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
