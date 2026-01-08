import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLayout } from '../../contexts/LayoutContext';

const LaporBencanaScreen = () => {
  const { setTitle, setHideNavbar, setShowBack } = useLayout();

  useEffect(() => {
    // Samakan dengan ProfileScreen
    setTitle('Lapor Bencana');
    setHideNavbar(true);
    setShowBack(true);

    return () => {
      // Restore saat keluar halaman
      setHideNavbar(false);
      setShowBack(false);
    };
  }, [setTitle, setHideNavbar, setShowBack]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lapor Bencana</Text>
      <Text style={styles.subtitle}>
        Halaman Lapor Bencana berhasil dibuka
      </Text>
    </View>
  );
};

export default LaporBencanaScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});
