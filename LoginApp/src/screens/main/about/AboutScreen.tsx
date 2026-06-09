import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { useLayout } from '../../../contexts/LayoutContext';
import { useAppConfig } from '../../../contexts/AppConfigContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styles from '../../../styles/profile/aboutStyle';
import LogoPartner from '../../../assets/BMKG.png';
import LogoPartner2 from '../../../assets/newfavicon.png';

const AboutScreen = () => {
  const insets = useSafeAreaInsets();
  const { setTitle, setHideNavbar, setShowBack, setShowSearch } = useLayout();
  const { config } = useAppConfig();

  const accentColor = config?.mla_warna || '#2563EB';

  useEffect(() => {
    setTitle('');
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
    <View style={styles.screen}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />

      <View style={[styles.glowOrb, { backgroundColor: accentColor }]} />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={[
            styles.container,
            {
              paddingTop: insets.top + 70,
              paddingBottom: 80 + insets.bottom,
            },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* ================= HEADER ASIMETRIS ================= */}
          <View style={styles.headerSection}>
            <Text style={styles.hugeTitle}>INFO</Text>
            <Text style={[styles.hugeTitle, { color: accentColor }]}>
              PANEL
            </Text>
          </View>

          {/* ================= PROFIL APLIKASI (CLEAN CARD) ================= */}
          <View style={styles.cleanCard}>
            <View style={styles.appProfileRow}>
              <View style={styles.logoWrapper}>
                {config?.mla_logo ? (
                  <Image
                    source={{ uri: config.mla_logo }}
                    style={styles.mainLogo}
                    resizeMode="cover"
                  />
                ) : (
                  <View
                    style={[
                      styles.logoPlaceholder,
                      { borderColor: accentColor },
                    ]}
                  >
                    <Text style={[styles.logoText, { color: accentColor }]}>
                      {config?.mla_nama_aplikasi
                        ?.substring(0, 2)
                        .toUpperCase() || 'SYS'}
                    </Text>
                  </View>
                )}
              </View>
              <View style={styles.appMeta}>
                <Text style={styles.appName}>
                  {config?.mla_nama_aplikasi || 'UNKNOWN_APP'}
                </Text>
                <Text style={styles.versionText}>
                  BUILD v.{config?.mla_versi || '1.0.0'}
                </Text>
              </View>
            </View>

            <View style={styles.separator} />

            <Text style={styles.description}>
              {config?.mla_keterangan ||
                'Data deskripsi modul tidak ditemukan dalam sistem.'}
            </Text>
          </View>

          {/* ================= FITUR: FLOATING CHIPS ================= */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>// CORE_FEATURES</Text>
            <View style={styles.chipsContainer}>
              {fiturList.map((feature, index) => (
                <View
                  key={index}
                  style={[
                    styles.chip,
                    {
                      borderLeftColor:
                        index % 2 === 0 ? accentColor : '#94A3B8',
                    },
                  ]}
                >
                  <Text style={styles.chipText}>{feature}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* ================= DATA SISTEM (BLUEPRINT TERMINAL) ================= */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>// SYSTEM_DATA</Text>
            <View style={styles.terminalBox}>
              <View style={styles.terminalRow}>
                <Text style={styles.terminalKey}>PROVIDER</Text>
                <Text style={styles.terminalValue}>
                  {config?.mla_nama_perusahaan || 'N/A'}
                </Text>
              </View>
              <View style={styles.terminalRow}>
                <Text style={styles.terminalKey}>DEPLOY_YEAR</Text>
                <Text style={styles.terminalValue}>
                  {config?.mla_tahun || 'N/A'}
                </Text>
              </View>
            </View>
          </View>

          {/* ================= INTEGRATION PARTNERS ================= */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>// INTEGRATIONS</Text>
            <View style={styles.partnerContainer}>
              {config?.mla_logo_perusahaan && (
                <Image
                  source={{ uri: config.mla_logo_perusahaan }}
                  style={styles.logo1}
                  resizeMode="contain"
                />
              )}

              <Image
                source={LogoPartner}
                style={styles.logo2}
                resizeMode="contain"
              />

              <Image
                source={LogoPartner2}
                style={styles.logo3}
                resizeMode="contain"
              />
            </View>
          </View>

          {/* ================= FOOTER ================= */}
          <View style={styles.footer}>
            {config?.mla_sign && (
              <Text style={styles.signText}>
                ENGINEERED BY{' '}
                <Text style={{ color: '#0F172A', fontWeight: '800' }}>
                  {config.mla_sign}
                </Text>
              </Text>
            )}
            <Text style={styles.copyrightText}>
              © {new Date().getFullYear()} {config?.mla_nama_perusahaan}
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default AboutScreen;
