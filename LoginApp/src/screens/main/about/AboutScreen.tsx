import React, { useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useLayout } from '../../../contexts/LayoutContext';
import styles from '../../../styles/profile/aboutStyle';

const AboutScreen = () => {
  const { setTitle, setHideNavbar, setShowBack, setShowSearch } = useLayout();

  useEffect(() => {
    setTitle('Tentang Aplikasi');
    setHideNavbar(true);
    setShowBack(true);
    setShowSearch(false);

    return () => {
      setHideNavbar(false);
      setShowBack(false);
    };
  }, [setTitle, setHideNavbar, setShowBack, setShowSearch]);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* LOGO SECTION */}
      <View style={styles.logoContainer}>
        <View style={styles.logoPlaceholder}>
          <Text style={styles.logoText}>BCM</Text>
        </View>
        <Text style={styles.appName}>Aplikasi Manajemen & Informasi</Text>
        <View style={styles.versionBadge}>
          <Text style={styles.versionText}>v1.0.0</Text>
        </View>
      </View>

      {/* DESCRIPTION */}
      <View style={styles.card}>
        <Text style={styles.description}>
          Aplikasi ini dikembangkan untuk membantu pengguna dalam mengakses
          informasi, melakukan pelaporan, serta mengelola data dengan lebih
          mudah, cepat, dan efisien.
        </Text>
      </View>

      {/* FEATURES */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Fitur Utama</Text>
        <View style={styles.featureGrid}>
          {[
            'Dashboard & Monitoring',
            'Pelaporan & Manajemen Data',
            'Informasi & Berita Terkini',
            'Manajemen Profil Pengguna',
          ].map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <View style={styles.dot} />
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* INFO */}
      <View style={styles.infoList}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Pengembang</Text>
          <Text style={styles.infoValue}>Tim Internal</Text>
        </View>
        <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
          <Text style={styles.infoLabel}>Tahun Rilis</Text>
          <Text style={styles.infoValue}>2024</Text>
        </View>
      </View>

      {/* FOOTER */}
      <View style={styles.footerContainer}>
        <Text style={styles.footer}>
          © {new Date().getFullYear()} Simple BCM.
        </Text>
        <Text style={styles.footerSub}>All rights reserved.</Text>
      </View>
    </ScrollView>
  );
};

export default AboutScreen;
