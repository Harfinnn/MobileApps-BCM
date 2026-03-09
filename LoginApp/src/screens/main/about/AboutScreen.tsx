import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StatusBar,
  SafeAreaView,
  Linking,
  TouchableOpacity,
} from 'react-native';
import { useLayout } from '../../../contexts/LayoutContext';
import { useAppConfig } from '../../../contexts/AppConfigContext';
import styles from '../../../styles/profile/aboutStyle';
import LogoPartner from '../../../assets/BMKG.png';
import LogoPartner2 from '../../../assets/newfavicon.png';

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

  const fiturList: string[] = Array.isArray(config?.mla_fitur)
    ? (config.mla_fitur as string[])
    : typeof config?.mla_fitur === 'string'
    ? config.mla_fitur.split(',').map((item: string) => item.trim())
    : [];

  return (
    <SafeAreaView
      style={[
        styles.screen,
        { backgroundColor: config?.mla_warna || '#F8F9FA' },
      ]}
    >
      <StatusBar barStyle="dark-content" backgroundColor="transparent" />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* ================= HERO SECTION ================= */}
        <View style={styles.heroSection}>
          <View style={styles.mainLogoWrapper}>
            {config?.mla_logo ? (
              <Image
                source={{ uri: config.mla_logo }}
                style={styles.mainLogo}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.logoPlaceholder}>
                <Text style={styles.logoText}>
                  {config?.mla_nama_aplikasi?.substring(0, 3).toUpperCase() ||
                    'APP'}
                </Text>
              </View>
            )}
          </View>

          <Text style={styles.appName}>
            {config?.mla_nama_aplikasi || 'Loading...'}
          </Text>

          <View style={styles.versionBadge}>
            <Text style={styles.versionText}>
              v{config?.mla_versi || '1.0.0'}
            </Text>
          </View>
        </View>

        {/* ================= CONTENT CARD ================= */}
        <View style={styles.card}>
          <Text style={styles.description}>
            {config?.mla_keterangan || '-'}
          </Text>
        </View>

        {/* ================= FEATURES SECTION ================= */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fitur Utama</Text>
          <View style={styles.featureGrid}>
            {fiturList.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <View
                  style={[
                    styles.dot,
                    { backgroundColor: config?.mla_warna || '#1A73E8' },
                  ]}
                />
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ================= INFO LIST ================= */}
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

        {/* ================= COMPANY SECTION ================= */}
        <View style={styles.companySection}>
          <Text style={styles.companyTitle}>Didukung Oleh</Text>

          <View style={styles.companyLogoRow}>
            {/* Logo Perusahaan (lebih besar) */}
            {config?.mla_logo_perusahaan && (
              <View style={styles.logo1}>
                <Image
                  source={{ uri: config.mla_logo_perusahaan }}
                  style={styles.logoImage}
                  resizeMode="contain"
                />
              </View>
            )}

            {/* Logo Partner (lebih kecil) */}
            <View style={styles.logo2}>
              <Image
                source={LogoPartner}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>

            <View style={styles.logo3}>
              <Image
                source={LogoPartner2}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>

          </View>
        </View>
        
        {/* ================= FOOTER & SIGN ================= */}
        <View style={styles.footerContainer}>
          {config?.mla_sign && (
            <View style={styles.signSection}>
              <View style={styles.lineDivider} />
              <Text style={styles.signLabel}>
                HANDCRAFTED BY{' '}
                <Text style={styles.signName}>
                  {config.mla_sign.toUpperCase()}
                </Text>
              </Text>
            </View>
          )}

          <Text style={styles.footerCopyright}>
            © {new Date().getFullYear()} {config?.mla_nama_perusahaan}
          </Text>
          <Text style={styles.footerRights}>All rights reserved.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AboutScreen;
