import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { Building2, Plus, Minus, RotateCcw } from 'lucide-react-native';
import { useLayout } from '../../../contexts/LayoutContext';
import API from '../../../services/api';
import styles from '../../../styles/map/mapStyle';
import { generateMapHTML } from '../../../utils/maps/generateMapHtml';

type UnitKerja = {
  mjs_id: number;
  mjs_nama: string;
  mjs_alamat: string;
  mjs_lat: string;
  mjs_long: string;
};

const MapScreen = () => {
  const { setTitle, setShowBack } = useLayout();
  const webViewRef = useRef<WebView>(null);

  const [units, setUnits] = useState<UnitKerja[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [mapReady, setMapReady] = useState(false);

  /* ================= INIT ================= */
  useEffect(() => {
    setTitle('Peta Unit Kerja');
    setShowBack(false);
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

  /* ================= SEND TO MAP ================= */
  useEffect(() => {
    if (mapReady && units.length > 0) {
      webViewRef.current?.postMessage(
        JSON.stringify({ type: 'SET_MARKERS', payload: units }),
      );
    }
  }, [mapReady, units]);

  const focusUnit = (unit: UnitKerja) => {
    if (!unit.mjs_lat || !unit.mjs_long) return;

    webViewRef.current?.postMessage(
      JSON.stringify({
        type: 'FOCUS',
        payload: {
          lat: Number(unit.mjs_lat),
          lng: Number(unit.mjs_long),
        },
      }),
    );
  };

  /* ================= RENDER ================= */
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* MAP */}
      <View style={styles.mapContainer}>
        <WebView
          ref={webViewRef}
          source={{ html: generateMapHTML() }}
          javaScriptEnabled
          originWhitelist={['*']}
          onMessage={event => {
            try {
              const msg = JSON.parse(event.nativeEvent.data);
              if (msg.type === 'MAP_READY') setMapReady(true);
            } catch {}
          }}
          style={{ flex: 1 }}
        />

        {/* ZOOM CONTROLS */}
        <View style={styles.floatingActions}>
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
          <Text style={styles.unitCount}>{units.length} Lokasi</Text>
        </View>

        {loading ? (
          <ActivityIndicator style={{ marginTop: 20 }} />
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[styles.scrollPadding]}
          >
            {units.map((unit, index) => (
              <TouchableOpacity
                key={unit.mjs_id}
                style={[
                  styles.unitCard,
                  selectedUnit === index && styles.selectedCard,
                ]}
                onPress={() => {
                  setSelectedUnit(index);
                  focusUnit(unit);
                }}
              >
                <View
                  style={[
                    styles.iconBox,
                    selectedUnit === index && styles.selectedIconBox,
                  ]}
                >
                  <Building2
                    size={20}
                    color={selectedUnit === index ? '#0F172A' : '#64748B'}
                  />
                </View>

                <View style={styles.infoBox}>
                  <Text
                    style={[
                      styles.unitName,
                      selectedUnit === index && styles.whiteText,
                    ]}
                  >
                    {unit.mjs_nama}
                  </Text>
                  <Text
                    numberOfLines={1}
                    style={[
                      styles.unitDist,
                      selectedUnit === index && styles.lightText,
                    ]}
                  >
                    {unit.mjs_alamat}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>
    </View>
  );
};

export default MapScreen;
