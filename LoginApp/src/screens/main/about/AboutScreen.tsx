import React, { useEffect } from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import { useLayout } from '../../../contexts/LayoutContext';
import { useAppConfig } from '../../../contexts/AppConfigContext';
import styles from '../../../styles/profile/aboutStyle';

const AboutScreen = () => {
  const { setTitle, setHideNavbar, setShowBack, setShowSearch } = useLayout();
  const { config } = useAppConfig();

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

  // 🔥 Realtime derive fitur (tanpa useMemo)
  const fiturList: string[] = Array.isArray(config?.mla_fitur)
    ? (config.mla_fitur as string[])
    : typeof config?.mla_fitur === 'string'
    ? config.mla_fitur.split(',').map((item: string) => item.trim())
    : [];

  return (
    <ScrollView
      style={[
        styles.screen,
        { backgroundColor: config?.mla_warna || '#F8F9FA' },
      ]}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* LOGO SECTION */}
      <View style={styles.logoContainer}>
        {config?.mla_logo ? (
          <Image
            source={{ uri: config.mla_logo }}
            style={{ width: 180, height: 180, borderRadius: 24 }}
            resizeMode="contain"
          />
        ) : (
          <View style={styles.logoPlaceholder}>
            <Text style={styles.logoText}>
              {config?.mla_nama_aplikasi?.substring(0, 3) || 'APP'}
            </Text>
          </View>
        )}

        <Text style={styles.appName}>
          {config?.mla_nama_aplikasi || 'Loading...'}
        </Text>

        <View style={styles.versionBadge}>
          <Text style={styles.versionText}>
            v{config?.mla_versi || '1.0.0'}
          </Text>
        </View>
      </View>

      {/* DESCRIPTION */}
      <View style={styles.card}>
        <Text style={styles.description}>{config?.mla_keterangan || '-'}</Text>
      </View>

      {/* FEATURES */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Fitur Utama</Text>

        <View style={styles.featureGrid}>
          {fiturList.length > 0 ? (
            fiturList.map((feature: string, index: number) => (
              <View key={index} style={styles.featureItem}>
                <View
                  style={[
                    styles.dot,
                    { backgroundColor: config?.mla_warna || '#1A73E8' },
                  ]}
                />
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.featureText}>-</Text>
          )}
        </View>
      </View>

      {/* INFO */}
      <View style={styles.infoList}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Perusahaan</Text>
          <Text style={styles.infoValue}>
            {config?.mla_nama_perusahaan || '-'}
          </Text>
        </View>

        <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
          <Text style={styles.infoLabel}>Tahun Rilis</Text>
          <Text style={styles.infoValue}>{config?.mla_tahun || '-'}</Text>
        </View>
      </View>

      {/* FOOTER */}
      <View style={styles.footerContainer}>
        <Text style={styles.footer}>
          © {new Date().getFullYear()} {config?.mla_nama_perusahaan}
        </Text>

        {config?.mla_sign && (
          <Text style={styles.footerSub}>Created by {config.mla_sign}</Text>
        )}

        <Text style={styles.footerSub}>All rights reserved.</Text>
      </View>
    </ScrollView>
  );
};

export default AboutScreen;
