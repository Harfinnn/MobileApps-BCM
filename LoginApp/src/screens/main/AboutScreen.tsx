import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLayout } from '../../contexts/LayoutContext';

const AboutScreen = () => {
  const { setTitle, setHideNavbar, setShowBack } = useLayout();

  useEffect(() => {
    setTitle('About');
    setHideNavbar(true);
    setShowBack(true);

    return () => {
      setHideNavbar(false);
      setShowBack(false);
    };
  }, [setTitle, setHideNavbar, setShowBack]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* APP NAME */}
      <Text style={styles.appName}>Aplikasi Manajemen & Informasi</Text>

      {/* DESCRIPTION */}
      <Text style={styles.description}>
        Aplikasi ini dikembangkan untuk membantu pengguna dalam mengakses
        informasi, melakukan pelaporan, serta mengelola data dengan lebih mudah,
        cepat, dan efisien. Kami berkomitmen untuk memberikan pengalaman
        penggunaan yang sederhana, aman, dan nyaman.
      </Text>

      {/* SECTION */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Fitur Utama</Text>
        <Text style={styles.listItem}>• Dashboard & Monitoring</Text>
        <Text style={styles.listItem}>• Pelaporan & Manajemen Data</Text>
        <Text style={styles.listItem}>• Informasi & Berita Terkini</Text>
        <Text style={styles.listItem}>• Manajemen Profil Pengguna</Text>
      </View>

      {/* SECTION */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Versi Aplikasi</Text>
        <Text style={styles.text}>v1.0.0</Text>
      </View>

      {/* SECTION */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pengembang</Text>
        <Text style={styles.text}>
          Tim Pengembang Internal
        </Text>
      </View>

      {/* FOOTER */}
      <Text style={styles.footer}>
        © {new Date().getFullYear()} Aplikasi Manajemen. All rights reserved.
      </Text>
    </ScrollView>
  );
};

export default AboutScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
    padding: 24,
    paddingTop: 100,
    alignItems: 'center',
  },

  appName: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
    color: '#111827',
    textAlign: 'center',
  },

  description: {
    fontSize: 14,
    color: '#4B5563',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },

  section: {
    width: '100%',
    marginBottom: 20,
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 6,
  },

  text: {
    fontSize: 14,
    color: '#374151',
  },

  listItem: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
  },

  footer: {
    marginTop: 32,
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});
