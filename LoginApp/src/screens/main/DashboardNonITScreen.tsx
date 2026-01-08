import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLayout } from '../../contexts/LayoutContext';

export default function DashboardNonITScreen() {
  const { setTitle, setHideNavbar, setShowBack } = useLayout();

  useEffect(() => {
    setTitle('Dashboard Non IT');
    setHideNavbar(true);
    setShowBack(true);

    return () => {
      setHideNavbar(false);
      setShowBack(false);
    };
  }, [setTitle, setHideNavbar, setShowBack]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard Non-IT</Text>
      <Text>Coming Soon 🚀</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
});
