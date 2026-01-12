import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLayout } from '../../contexts/LayoutContext';

const RTAScreen = () => {
  const { setTitle, setHideNavbar, setShowBack } = useLayout();

  useEffect(() => {
    setTitle('RTA');
    setHideNavbar(true);
    setShowBack(true);

    return () => {
      setHideNavbar(false);
      setShowBack(false);
    };
  }, [setTitle, setHideNavbar, setShowBack]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>RTA</Text>
      <Text style={styles.subtitle}>
        Halaman RTA berhasil dibuka
      </Text>
    </View>
  );
};

export default RTAScreen;

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
