import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLayout } from '../../contexts/LayoutContext';

const PanduanBencanaScreen = () => {
  const { setTitle, setHideNavbar, setShowBack } = useLayout();

  useEffect(() => {
    setTitle('Panduan Bencana');
    setHideNavbar(true);
    setShowBack(true);

    return () => {
      setHideNavbar(false);
      setShowBack(false);
    };
  }, [setTitle, setHideNavbar, setShowBack]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Panduan Bencana</Text>
      <Text style={styles.subtitle}>
        Halaman Panduan Bencana berhasil dibuka
      </Text>
    </View>
  );
};

export default PanduanBencanaScreen;

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
