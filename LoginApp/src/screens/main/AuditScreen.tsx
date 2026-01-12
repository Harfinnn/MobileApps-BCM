import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLayout } from '../../contexts/LayoutContext';

const AuditScreen = () => {
  const { setTitle, setHideNavbar, setShowBack } = useLayout();

  useEffect(() => {
    setTitle('Audit');
    setHideNavbar(true);
    setShowBack(true);

    return () => {
      setHideNavbar(false);
      setShowBack(false);
    };
  }, [setTitle, setHideNavbar, setShowBack]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Audit</Text>
      <Text style={styles.subtitle}>
        Halaman Audit berhasil dibuka
      </Text>
    </View>
  );
};

export default AuditScreen;

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
