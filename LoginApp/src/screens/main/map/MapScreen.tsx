import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from 'react';
import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Platform,
  Alert,
  FlatList,
} from 'react-native';
import { WebView } from 'react-native-webview';
import {
  Building2,
  Plus,
  Minus,
  RotateCcw,
  Search,
  Home,
} from 'lucide-react-native';

import { useLayout } from '../../../contexts/LayoutContext';
import { useUser } from '../../../contexts/UserContext';
import API from '../../../services/api';
import { generateMapHTML } from '../../../utils/maps/generateMapHtml';
import styles from '../../../styles/map/mapStyle';

type UnitKerja = {
  mjs_id: number;
  mjs_nama: string;
  mjs_alamat: string;
  mjs_lat: string;
  mjs_long: string;
};

const MapScreen = () => {
  const { setTitle, setShowBack, setHideHeader } = useLayout();
  const { user } = useUser();
  const webViewRef = useRef<WebView>(null);

  const [units, setUnits] = useState<UnitKerja[]>([]);
  const [selectedUnitId, setSelectedUnitId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [mapReady, setMapReady] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  /* ================= INIT ================= */
  useEffect(() => {
    setTitle('Peta Unit Kerja');
    setShowBack(false);
    setHideHeader(true);
    fetchUnits();
  }, []);

  /* ================= FETCH API ================= */
  const fetchUnits = async () => {
    try {
      setLoading(true);

      const res = await API.get('/selindo', {
        params: { with_location: true },
      });

      if (res.data?.success) {
        setUnits(res.data.data);
      }
    } catch (err) {
      console.log('Gagal load unit kerja', err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= FILTER ================= */
  const filteredUnits = useMemo(() => {
    const query = searchQuery.toLowerCase();

    return units.filter(
      unit =>
        unit.mjs_nama.toLowerCase().includes(query) ||
        unit.mjs_alamat.toLowerCase().includes(query),
    );
  }, [units, searchQuery]);

  /* ================= SEND MARKERS (BATCH) ================= */
  useEffect(() => {
    if (!mapReady || filteredUnits.length === 0) return;

    const chunkSize = 200;

    for (let i = 0; i < filteredUnits.length; i += chunkSize) {
      const chunk = filteredUnits.slice(i, i + chunkSize);

      setTimeout(() => {
        webViewRef.current?.postMessage(
          JSON.stringify({
            type: 'ADD_MARKERS',
            payload: chunk,
          }),
        );
      }, i * 5);
    }
  }, [mapReady, filteredUnits]);

  /* ================= FOCUS UNIT ================= */
  const focusUnit = (unit: UnitKerja) => {
    if (!unit.mjs_lat || !unit.mjs_long) return;

    webViewRef.current?.postMessage(
      JSON.stringify({
        type: 'FOCUS',
        payload: {
          id: unit.mjs_id,
          lat: Number(unit.mjs_lat),
          lng: Number(unit.mjs_long),
        },
      }),
    );
  };

  /* ================= MY UNIT ================= */
  const goToMyUnit = () => {
    if (!user?.user_selindo) {
      Alert.alert('Info', 'Anda belum memiliki data unit kerja penugasan.');
      return;
    }

    const myUnitId = Number(user.user_selindo);
    const myUnit = units.find(u => u.mjs_id === myUnitId);

    if (myUnit) {
      setSearchQuery('');
      setSelectedUnitId(myUnit.mjs_id);
      focusUnit(myUnit);
    } else {
      Alert.alert('Info', 'Data unit kerja Anda tidak ditemukan di peta.');
    }
  };

  /* ================= RENDER ITEM ================= */
  const renderItem = useCallback(
    ({ item }: { item: UnitKerja }) => {
      const selected = selectedUnitId === item.mjs_id;

      return (
        <TouchableOpacity
          style={[styles.unitCard, selected && styles.selectedCard]}
          onPress={() => {
            setSelectedUnitId(item.mjs_id);
            focusUnit(item);
          }}
        >
          <View style={[styles.iconBox, selected && styles.selectedIconBox]}>
            <Building2 size={20} color={selected ? '#0F172A' : '#64748B'} />
          </View>

          <View style={styles.infoBox}>
            <Text style={[styles.unitName, selected && styles.whiteText]}>
              {item.mjs_nama}
            </Text>

            <Text
              numberOfLines={1}
              style={[styles.unitDist, selected && styles.lightText]}
            >
              {item.mjs_alamat}
            </Text>
          </View>
        </TouchableOpacity>
      );
    },
    [selectedUnitId],
  );

  /* ================= RENDER ================= */
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* SEARCH */}
      <View style={styles.searchContainer}>
        <Search color="#64748B" size={20} />
        <TextInput
          placeholder="Cari Unit Kerja atau Alamat..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
          placeholderTextColor="#94A3B8"
        />
      </View>

      {/* MAP */}
      <View style={styles.mapContainer}>
        <WebView
          ref={webViewRef}
          source={{ html: generateMapHTML() }}
          javaScriptEnabled
          originWhitelist={['*']}
          style={{ flex: 1 }}
          onMessage={event => {
            try {
              const msg = JSON.parse(event.nativeEvent.data);

              if (msg.type === 'MAP_READY') {
                setMapReady(true);
              }

              if (msg.type === 'MARKER_CLICK') {
                setSelectedUnitId(msg.payload);
              }
            } catch {}
          }}
        />

        {/* FLOATING BUTTONS */}
        <View style={styles.floatingActions}>
          <TouchableOpacity
            style={[
              styles.circleBtn,
              { marginBottom: 15, backgroundColor: '#0F172A' },
            ]}
            onPress={goToMyUnit}
          >
            <Home size={20} color="#FFF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.circleBtn}
            onPress={() =>
              webViewRef.current?.postMessage(
                JSON.stringify({ type: 'ZOOM_IN' }),
              )
            }
          >
            <Plus size={22} color="#0F172A" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.circleBtn, { marginTop: 10 }]}
            onPress={() =>
              webViewRef.current?.postMessage(
                JSON.stringify({ type: 'ZOOM_OUT' }),
              )
            }
          >
            <Minus size={22} color="#0F172A" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.circleBtn, { marginTop: 10 }]}
            onPress={() =>
              webViewRef.current?.postMessage(JSON.stringify({ type: 'RESET' }))
            }
          >
            <RotateCcw size={20} color="#2563EB" />
          </TouchableOpacity>
        </View>
      </View>

      {/* LIST */}
      <View style={styles.bottomSheet}>
        <View style={styles.sheetHandle} />

        <View style={styles.sheetHeader}>
          <Text style={styles.sheetTitle}>Unit Terdekat</Text>
          <Text style={styles.unitCount}>{filteredUnits.length} Lokasi</Text>
        </View>

        {loading ? (
          <ActivityIndicator style={{ marginTop: 20 }} color="#0F172A" />
        ) : (
          <FlatList
            data={filteredUnits}
            keyExtractor={item => item.mjs_id.toString()}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollPadding}
            initialNumToRender={10}
            maxToRenderPerBatch={12}
            windowSize={10}
            removeClippedSubviews
          />
        )}
      </View>
    </View>
  );
};

export default MapScreen;
