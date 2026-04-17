import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import ImageResizer from 'react-native-image-resizer';
import { Modal } from 'react-native';
import { useLayout } from '../../../contexts/LayoutContext';
import { useAppConfig } from '../../../contexts/AppConfigContext';
import { launchImageLibrary, Asset } from 'react-native-image-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styles from '../../../styles/profile/editAboutStyle';
import { useNavigation } from '@react-navigation/native';

const EditAboutScreen = () => {
  const insets = useSafeAreaInsets();
  const { setTitle, setHideNavbar, setShowBack, setShowSearch } = useLayout();
  const { config, updateConfig } = useAppConfig();

  const [logo, setLogo] = useState<any>(null);
  const [logoPerusahaan, setLogoPerusahaan] = useState<any>(null);
  const [nama, setNama] = useState('');
  const [versi, setVersi] = useState('');
  const [keterangan, setKeterangan] = useState('');
  const [fitur, setFitur] = useState('');
  const [perusahaan, setPerusahaan] = useState('');
  const [tahun, setTahun] = useState('');
  const [sign, setSign] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);

  const navigation = useNavigation<any>();

  useEffect(() => {
    setTitle('Edit Tentang Aplikasi');
    setHideNavbar(true);
    setShowBack(true);
    setShowSearch(false);

    return () => {
      setHideNavbar(false);
      setShowBack(false);
    };
  }, []);

  useEffect(() => {
    if (config) {
      setNama(config.mla_nama_aplikasi || '');
      setVersi(config.mla_versi || '');
      setKeterangan(config.mla_keterangan || '');
      setPerusahaan(config.mla_nama_perusahaan || '');
      setTahun(config.mla_tahun || '');
      setSign(config.mla_sign || '');
      setFitur(
        Array.isArray(config.mla_fitur)
          ? config.mla_fitur.join(', ')
          : config.mla_fitur || '',
      );
    }
  }, [config]);

  const pickLogo = async () => {
    setImageLoading(true);

    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 1,
      });

      if (result.didCancel) return;

      if (result.assets?.length) {
        const processed = await processImage(result.assets[0]);

        if (processed) {
          setLogo(processed);
        }
      }
    } catch (err) {
      Alert.alert('Error', 'Gagal memilih gambar');
    } finally {
      setImageLoading(false);
    }
  };

  const pickLogoPerusahaan = async () => {
    setImageLoading(true);

    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 1,
      });

      if (result.didCancel) return;

      if (result.assets?.length) {
        const processed = await processImage(result.assets[0]);

        if (processed) {
          setLogoPerusahaan(processed);
        }
      }
    } catch (err) {
      Alert.alert('Error', 'Gagal memilih gambar');
    } finally {
      setImageLoading(false);
    }
  };

  const processImage = async (asset: any) => {
    try {
      if (!asset?.uri) {
        Alert.alert('Error', 'URI gambar tidak ditemukan');
        return null;
      }

      const resized = await ImageResizer.createResizedImage(
        asset.uri,
        1200,
        1200,
        'PNG',
        100,
      );

      return {
        uri: resized.uri,
        name: `image_${Date.now()}.png`,
        type: 'image/png',
      };
    } catch (error) {
      Alert.alert('Error', 'Gagal memproses gambar');
      return null;
    }
  };

  const handleSave = async () => {
    if (loading) return;

    if (!nama.trim()) {
      Alert.alert('Validasi', 'Nama aplikasi tidak boleh kosong');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('mla_nama_aplikasi', nama);
      formData.append('mla_versi', versi);
      formData.append('mla_keterangan', keterangan);
      formData.append('mla_fitur', fitur);
      formData.append('mla_nama_perusahaan', perusahaan);
      formData.append('mla_sign', sign);
      formData.append('mla_tahun', tahun);

      if (logo) {
        formData.append('mla_logo', logo as any);
      }

      if (logoPerusahaan) {
        formData.append('mla_logo_perusahaan', logoPerusahaan as any);
      }

      const success = await updateConfig(formData);
      if (success) {
        setSuccessVisible(true);
      }
    } catch (err: any) {
      let message = 'Terjadi kesalahan';

      const errors = err?.response?.data?.errors;

      if (errors) {
        const key = Object.keys(errors)[0];
        message = errors[key][0];
      } else if (err?.response?.data?.message) {
        message = err.response.data.message;
      } else if (err?.message) {
        message = err.message;
      }

      Alert.alert('Error', message);
    }
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + 75,
            paddingBottom: 40 + insets.bottom,
          },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text style={styles.headerSubtitle}>Konfigurasi</Text>
          <Text style={styles.headerTitle}>Tentang Aplikasi</Text>
        </View>

        <View style={styles.logoRow}>
          {/* Logo Aplikasi */}
          <View style={styles.logoColumn}>
            <TouchableOpacity
              onPress={pickLogo}
              activeOpacity={0.9}
              disabled={imageLoading}
            >
              <View style={styles.logoWrapper}>
                <View style={styles.logoFrame}>
                  {logo ? (
                    <Image source={{ uri: logo.uri }} style={styles.logo} />
                  ) : config?.mla_logo ? (
                    <Image
                      source={{ uri: config.mla_logo }}
                      style={styles.logo}
                    />
                  ) : (
                    <View style={styles.logoPlaceholder}>
                      <Text style={styles.placeholderIcon}>🖼️</Text>
                    </View>
                  )}

                  {imageLoading && (
                    <View
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'rgba(255,255,255,0.6)',
                      }}
                    >
                      <ActivityIndicator size="small" color="#009B97" />
                    </View>
                  )}
                </View>
                <View style={styles.editBadge}>
                  <Text style={styles.editBadgeIcon}>✎</Text>
                </View>
              </View>
            </TouchableOpacity>
            <Text style={styles.logoLabel}>Logo Aplikasi</Text>
          </View>

          {/* Logo Perusahaan */}
          <View style={styles.logoColumn}>
            <TouchableOpacity
              onPress={pickLogoPerusahaan}
              activeOpacity={0.9}
              disabled={imageLoading}
            >
              <View style={styles.logoWrapper}>
                <View style={styles.logoFrame}>
                  {logoPerusahaan ? (
                    <Image
                      source={{ uri: logoPerusahaan.uri }}
                      style={styles.logo}
                    />
                  ) : config?.mla_logo_perusahaan ? (
                    <Image
                      source={{ uri: config.mla_logo_perusahaan }}
                      style={styles.logo}
                    />
                  ) : (
                    <View style={styles.logoPlaceholder}>
                      <Text style={styles.placeholderIcon}>🏢</Text>
                    </View>
                  )}

                  {imageLoading && (
                    <View
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'rgba(255,255,255,0.6)',
                      }}
                    >
                      <ActivityIndicator size="small" color="#009B97" />
                    </View>
                  )}
                </View>
                <View style={styles.editBadge}>
                  <Text style={styles.editBadgeIcon}>✎</Text>
                </View>
              </View>
            </TouchableOpacity>
            <Text style={styles.logoLabel}>Logo Perusahaan</Text>
          </View>
        </View>

        {/* Form Section */}
        <View style={styles.formContainer}>
          <Text style={styles.label}>Nama Aplikasi</Text>
          <TextInput
            style={styles.input}
            value={nama}
            onChangeText={setNama}
            placeholder="App Name"
          />

          <View style={styles.row}>
            <View style={{ flex: 1.5, marginRight: 12 }}>
              <Text style={styles.label}>Versi</Text>
              <TextInput
                style={styles.input}
                value={versi}
                onChangeText={setVersi}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Tahun</Text>
              <TextInput
                style={styles.input}
                value={tahun}
                onChangeText={setTahun}
                keyboardType="numeric"
              />
            </View>
          </View>

          <Text style={styles.label}>Nama Perusahaan</Text>
          <TextInput
            style={styles.input}
            value={perusahaan}
            onChangeText={setPerusahaan}
          />

          <Text style={styles.label}>Fitur Unggulan</Text>
          <TextInput
            style={styles.input}
            value={fitur}
            onChangeText={setFitur}
          />

          <Text style={styles.label}>Deskripsi</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={keterangan}
            onChangeText={setKeterangan}
            multiline
            numberOfLines={4}
          />

          <Text style={styles.label}>Pencipta / Developer</Text>
          <TextInput
            style={styles.input}
            value={sign}
            onChangeText={setSign}
            placeholder="Nama Developer"
          />
        </View>

        <TouchableOpacity
          style={[styles.saveButton, loading && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Simpan Perubahan</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
      <Modal visible={successVisible} transparent animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.4)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              width: 300,
              backgroundColor: '#fff',
              borderRadius: 16,
              padding: 24,
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 40 }}>✅</Text>

            <Text
              style={{
                fontSize: 18,
                fontWeight: '600',
                marginTop: 10,
              }}
            >
              Berhasil
            </Text>

            <Text
              style={{
                textAlign: 'center',
                marginTop: 6,
                color: '#666',
              }}
            >
              Data berhasil diperbarui
            </Text>

            <TouchableOpacity
              onPress={() => {
                setSuccessVisible(false);
                navigation.navigate('Profile');
              }}
              style={{
                marginTop: 20,
                backgroundColor: '#009B97',
                paddingVertical: 10,
                paddingHorizontal: 25,
                borderRadius: 8,
              }}
            >
              <Text style={{ color: '#fff', fontWeight: '600' }}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default EditAboutScreen;
