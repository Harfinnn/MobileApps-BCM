import React, { useCallback, useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  BackHandler,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Modal,
  Image,
  Dimensions,
  LayoutAnimation,
  Platform,
  UIManager,
  Animated,
  Easing,
} from 'react-native';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { useLayout } from '../../../contexts/LayoutContext';
import styles from '../../../styles/bencana/gempaDetailStyle';
import API from '../../../services/api';
import { getUnitsInRadius, UnitWithDistance } from '../../../utils/gempa';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const GempaDetailScreen = () => {
  const route = useRoute<any>();
  const { gempa } = route.params;
  const navigation = useNavigation<any>();
  const {
    setTitle,
    setHideNavbar,
    setOnBack,
    setHideHeader,
    setShowBack,
    setShowSearch,
    setHideHeaderLeft,
  } = useLayout();

  const [isMapVisible, setIsMapVisible] = useState(false);
  const [affectedUnits, setAffectedUnits] = useState<UnitWithDistance[]>([]);
  const [showRadius, setShowRadius] = useState(false);

  const scrollRef = useRef<ScrollView>(null);

  // Animation refs
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Enable LayoutAnimation Android
  useEffect(() => {
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental?.(true);
    }
  }, []);

  // Back handler
  useFocusEffect(
    useCallback(() => {
      const sub = BackHandler.addEventListener('hardwareBackPress', () => {
        navigation.navigate('Main', { screen: 'InfoGempaBumi' });
        return true;
      });
      return () => sub.remove();
    }, [navigation]),
  );

  // Load radius data
  useEffect(() => {
    const loadImpact = async () => {
      try {
        const res = await API.get('/selindo', {
          params: { with_location: true },
        });

        if (res.data?.success && gempa?.Coordinates) {
          const [lat, lng] = gempa.Coordinates.split(',').map(Number);
          const impacted = getUnitsInRadius(lat, lng, res.data.data, 50);
          setAffectedUnits(impacted);
        }
      } catch (err) {
        console.log(err);
      }
    };

    loadImpact();
  }, [gempa]);

  useEffect(() => {
    setTitle('Detail Gempa');
    setHideNavbar(true);
    setHideHeader(true);

    return () => {
      setShowSearch(true);
      setHideNavbar(false);
      setShowBack(true);
    };
  }, [navigation]);

  const isStrong = Number(gempa.Magnitude) >= 5.0;
  const mapUrl = `https://data.bmkg.go.id/DataMKG/TEWS/${gempa.Shakemap}`;

  // Rotate animation
  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  // Toggle radius
  const toggleRadius = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    const toValue = showRadius ? 0 : 1;

    Animated.timing(rotateAnim, {
      toValue,
      duration: 250,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    setShowRadius(!showRadius);

    if (!showRadius) {
      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      }, 200);
    }
  };

  const getImpactLevel = (distance: number) => {
    if (distance < 10) return { label: 'RISIKO TINGGI', color: '#E11D48' };
    if (distance < 30) return { label: 'WASPADA', color: '#F59E0B' };
    return { label: 'AMAN', color: '#10B981' };
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false}>
        {/* HEADER */}
        <View style={styles.topSection}>
          <Text style={styles.dateHeader}>
            {gempa.Tanggal} • {gempa.Jam}
          </Text>
          <View style={styles.magRow}>
            <Text
              style={[
                styles.magNumber,
                { color: isStrong ? '#E11D48' : '#0F172A' },
              ]}
            >
              {gempa.Magnitude}
            </Text>
            <Text style={styles.srText}>Magnitude</Text>
          </View>
        </View>

        {/* TITLE */}
        <View style={styles.titleSection}>
          <View style={styles.divider} />
          <Text style={styles.wilayahText}>{gempa.Wilayah}</Text>
          <View style={styles.potensiBadge}>
            <Text style={styles.potensiText}>
              {gempa.Potensi || 'Tidak Berpotensi Tsunami'}
            </Text>
          </View>
        </View>

        {/* MAP BUTTON */}
        {gempa.Shakemap && (
          <View style={{ paddingHorizontal: 24, marginBottom: 30 }}>
            <TouchableOpacity
              style={styles.mapTrigger}
              onPress={() => setIsMapVisible(true)}
              activeOpacity={0.8}
            >
              <Text style={styles.mapTriggerIcon}>🗺️</Text>
              <View>
                <Text style={styles.mapTriggerTitle}>Buka Peta Guncangan</Text>
                <Text style={styles.mapTriggerSub}>
                  Lihat persebaran dampak (ShakeMap)
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* DATA */}
        <View style={styles.dataGrid}>
          <View style={styles.dataRow}>
            <View style={styles.dataItem}>
              <Text style={styles.label}>KEDALAMAN</Text>
              <Text style={styles.value}>{gempa.Kedalaman}</Text>
            </View>
            <View style={styles.dataItem}>
              <Text style={styles.label}>KOORDINAT</Text>
              <Text style={styles.value}>{gempa.Coordinates || '-'}</Text>
            </View>
          </View>

          <View style={styles.fullDataItem}>
            <Text style={styles.label}>WILAYAH DIRASAKAN (MMI)</Text>
            <Text style={styles.mmiValue}>
              {gempa.Dirasakan || 'Data tidak dilaporkan'}
            </Text>
          </View>
        </View>

        {/* RADIUS SECTION */}
        <View
          style={{ paddingHorizontal: 24, marginTop: 32, marginBottom: 20 }}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              marginBottom: 12,
            }}
          >
            <View>
              <Text style={styles.sectionLabel}>ANALISIS DAMPAK</Text>
              <Text style={styles.sectionTitle}>Unit Terdekat (50km)</Text>
            </View>
            <TouchableOpacity
              onPress={toggleRadius}
              activeOpacity={0.7}
              style={styles.expandButton}
            >
              <TouchableOpacity
                onPress={toggleRadius}
                activeOpacity={0.7}
                style={styles.expandButton}
              >
                <View style={styles.iconContainer}>
                  {/* Garis Horizontal Minimalis */}
                  <Animated.View
                    style={[
                      styles.iconBar,
                      {
                        transform: [
                          { translateY: 2 },
                          {
                            rotate: rotateAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: ['0deg', '45deg'],
                            }),
                          },
                        ],
                      },
                    ]}
                  />
                  <Animated.View
                    style={[
                      styles.iconBar,
                      {
                        transform: [
                          { translateY: -2 },
                          {
                            rotate: rotateAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: ['0deg', '-45deg'],
                            }),
                          },
                        ],
                      },
                    ]}
                  />
                </View>
              </TouchableOpacity>
            </TouchableOpacity>
          </View>

          {/* LIST DENGAN ANIMASI */}
          {showRadius && (
            <View>
              {affectedUnits.length === 0 ? (
                <Text
                  style={{
                    textAlign: 'center',
                    marginTop: 10,
                    color: '#64748B',
                  }}
                >
                  Tidak ada unit dalam radius 50 km dari lokasi gempa
                </Text>
              ) : (
                affectedUnits.map((unit, index) => {
                  const impact = getImpactLevel(unit.distance);

                  return (
                    <Animated.View
                      key={index}
                      style={[
                        styles.unitCard,
                        { transform: [{ scale: scaleAnim }] },
                      ]}
                    >
                      <View style={styles.unitInfo}>
                        <View>
                          <Text style={styles.unitName}>{unit.mjs_nama}</Text>

                          <View style={styles.distanceBadge}>
                            <Text style={styles.distanceText}>
                              {unit.distance.toFixed(1)} km dari episenter
                            </Text>
                          </View>

                          <Text
                            style={{
                              marginTop: 10,
                              fontSize: 11,
                              fontWeight: '700',
                              color: impact.color,
                            }}
                          >
                            ● {impact.label}
                          </Text>
                        </View>

                        {index === 0 && (
                          <View style={styles.priorityBadge}>
                            <Text style={styles.priorityText}>PRIORITAS</Text>
                          </View>
                        )}
                      </View>

                      <View style={styles.distanceTrack}>
                        <View
                          style={[
                            styles.distanceFill,
                            {
                              width: `${Math.max(
                                10,
                                100 - unit.distance * 2,
                              )}%`,
                            },
                          ]}
                        />
                      </View>
                    </Animated.View>
                  );
                })
              )}
            </View>
          )}
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() =>
              navigation.navigate('Main', { screen: 'InfoGempaBumi' })
            }
          >
            <Text style={styles.closeButtonText}>Kembali ke Daftar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* MODAL MAP */}
      <Modal visible={isMapVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <SafeAreaView style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => setIsMapVisible(false)}
              style={styles.modalCloseBtn}
            >
              <Text style={styles.modalCloseText}>Tutup Peta</Text>
            </TouchableOpacity>
          </SafeAreaView>

          <ScrollView
            maximumZoomScale={4}
            minimumZoomScale={1}
            centerContent
            contentContainerStyle={styles.modalScroll}
          >
            <Image
              source={{ uri: mapUrl }}
              style={styles.fullMapImage}
              resizeMode="contain"
            />
          </ScrollView>

          <View style={styles.modalFooter}>
            <Text style={styles.zoomHint}>
              Gunakan dua jari untuk memperbesar peta
            </Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default GempaDetailScreen;
