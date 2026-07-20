import React, { useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  ListRenderItemInfo,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { PANDUAN_ICON_MAP } from '../../utils/panduanIconMap';
import styles from '../../styles/dashboard/smallBannerStyle';

const DEFAULT_ICON = require('../../assets/iconsPanduan/alert_4944314.png');

type PanduanItem = {
  mbe_id: string | number;
  mbe_nama: string;
};

// PANDUAN_ICON_MAP's key type may only accept string or only number keys.
// Since mbe_id can be either at runtime, look it up through an explicit
// string-keyed record so TS doesn't complain about an implicit `any` index.
const ICON_MAP: Record<string, any> = PANDUAN_ICON_MAP as Record<string, any>;

function getPanduanIcon(id: string | number) {
  return ICON_MAP[String(id)] ?? DEFAULT_ICON;
}

type Props = {
  panduan: PanduanItem[];
};

// --- Extracted, memoized action card -----------------------------------
type ActionCardProps = {
  item: PanduanItem;
  onPress: (item: PanduanItem) => void;
};

const ActionCard = React.memo(
  function ActionCard({ item, onPress }: ActionCardProps) {
    const handlePress = useCallback(() => onPress(item), [onPress, item]);

    return (
      <TouchableOpacity style={styles.actionCard} onPress={handlePress}>
        <View style={styles.iconBox}>
          <Image
            source={getPanduanIcon(item.mbe_id)}
            style={styles.miniIcon}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.actionLabel} numberOfLines={1}>
          {item.mbe_nama}
        </Text>
      </TouchableOpacity>
    );
  },
  (prev, next) =>
    prev.item.mbe_id === next.item.mbe_id &&
    prev.item.mbe_nama === next.item.mbe_nama &&
    prev.onPress === next.onPress,
);

// --- Main component -------------------------------------------------------
function SmallBannerComponent({ panduan }: Props) {
  const navigation = useNavigation<any>();

  // Hooks must run unconditionally — compute derived data safely even if
  // `panduan` is empty, and bail out in the render only.
  const hero = panduan?.[0];
  const quickActions = useMemo(
    () => (panduan ? panduan.slice(1, 13) : []),
    [panduan],
  );

  const goToDetail = useCallback(
    (item: PanduanItem) => {
      navigation.navigate('PanduanDetailScreen', {
        id: item.mbe_id,
        title: item.mbe_nama,
      });
    },
    [navigation],
  );

  const goToHero = useCallback(() => {
    if (hero) goToDetail(hero);
  }, [hero, goToDetail]);

  const goToAll = useCallback(() => {
    navigation.navigate('PanduanBencana');
  }, [navigation]);

  const keyExtractor = useCallback(
    (item: PanduanItem) => String(item.mbe_id),
    [],
  );

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<PanduanItem>) => (
      <ActionCard item={item} onPress={goToDetail} />
    ),
    [goToDetail],
  );

  if (!panduan || panduan.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Edukasi Siaga</Text>
          <Text style={styles.subtitle}>Panduan resmi penyelamatan</Text>
        </View>

        <TouchableOpacity onPress={goToAll}>
          <Text style={styles.more}>Lihat Semua</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.heroCard}
        activeOpacity={0.9}
        onPress={goToHero}
      >
        <View style={styles.heroLeft}>
          <Text style={styles.heroTitle}>{hero.mbe_nama}</Text>
          <View style={styles.heroBtn}>
            <Text style={styles.heroBtnText}>Baca Sekarang</Text>
          </View>
        </View>

        <View style={styles.heroRight}>
          <Image
            source={getPanduanIcon(hero.mbe_id)}
            style={styles.heroIcon}
            resizeMode="contain"
          />
        </View>
      </TouchableOpacity>

      <FlatList
        data={quickActions}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scroll}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        removeClippedSubviews
        initialNumToRender={6}
        maxToRenderPerBatch={6}
        windowSize={3}
        // Uncomment & adjust if actionCard has a fixed width/height in styles,
        // to skip on-the-fly layout measurement entirely:
        // getItemLayout={(_, index) => ({
        //   length: ITEM_WIDTH,
        //   offset: ITEM_WIDTH * index,
        //   index,
        // })}
      />
    </View>
  );
}

export default React.memo(SmallBannerComponent);
