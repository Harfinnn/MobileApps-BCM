import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import { useLayout } from '../../../contexts/LayoutContext';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 56 - 20) / 2;
const BASE_URL = 'https://bsi-playbook.netlify.app/';

const PLAYBOOK_DATA = [
  { id: 'qris', title: 'QRIS', slug: 'qris/index' },
  { id: 'webform', title: 'Webform', slug: 'webform/index' },
  { id: 'open-banking', title: 'Open Banking', slug: 'open-banking/index' },
  { id: 'ikurma', title: 'iKurma', slug: 'ikurma/index' },
  {
    id: 'hasanah-card-debit',
    title: 'Hasanah & Debit Card',
    slug: 'hasanah-card-dan-debit-card/index',
  },
  { id: 'exa', title: 'EXA', slug: 'exa/index' },
  { id: 'cs-digital', title: 'CS Digital', slug: 'cs-digital/index' },
  { id: 'byond', title: 'BYOND', slug: 'byond/index' },
  {
    id: 'bsi-net-banking',
    title: 'BSI Net Banking',
    slug: 'bsi-net-banking/index',
  },
  { id: 'bsi-mobile', title: 'BSI Mobile', slug: 'bsi-mobile/index' },
  { id: 'bsi-agent', title: 'BSI Agent', slug: 'bsi-agent/index' },
  { id: 'bewize', title: 'Bewize', slug: 'bewize/index' },
  {
    id: 'bewize-trade',
    title: 'Bewize Trade Finance',
    slug: 'bewize-trade-new-trade-finance/index',
  },
  {
    id: 'bewize-dvc',
    title: 'Bewize Digital Value Chain',
    slug: 'bewize-digital-value-chain/index',
  },
  { id: 'bewize-cash', title: 'Bewize Cash', slug: 'bewize-cash/index' },
  { id: 'bams', title: 'BAMS', slug: 'bams/index' },
  { id: 'atm', title: 'ATM', slug: 'atm/index' },
  { id: 'atm-crm', title: 'ATM CRM', slug: 'atm-crm/index' },
];

const BookScreen = () => {
  const navigation = useNavigation<any>();
  const { setTitle, setHideNavbar, setShowBack, setShowSearch, setHideHeader } =
    useLayout();

  useEffect(() => {
    setTitle('BCP Playbooks');
    setShowSearch(true);
    setHideHeader(true);
    setShowBack(false);
    setHideNavbar(false);

    return () => {
      setHideHeader(false);
    };
  }, [setTitle, setHideHeader, setShowSearch, setShowBack, setHideNavbar]);

  const handleOpenPlaybook = (slug: string, title: string) => {
    navigation.navigate('BookView', {
      url: `${BASE_URL}${slug}`,
      title: title,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <View style={styles.softGlow} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topHeader}>
          <View style={styles.liveTag}>
            <View style={styles.liveDot} />
            <Text style={styles.liveTagText}>INTERNAL REPOSITORY</Text>
          </View>
          <Text style={styles.mainTitle}>BCP{'\n'}Playbooks</Text>
          <Text style={styles.subTitle}>
            Pilih modul panduan untuk protokol keberlanjutan bisnis.
          </Text>
        </View>

        <View style={styles.gridContainer}>
          {PLAYBOOK_DATA.map(book => {
            // Logika pengambilan gambar berdasarkan folder slug
            const folderName = book.slug.split('/')[0];
            const thumbUrl = `${BASE_URL}${folderName}/files/shot.png`;

            return (
              <TouchableOpacity
                key={book.id}
                style={styles.bookCard}
                activeOpacity={0.8}
                onPress={() => handleOpenPlaybook(book.slug, book.title)}
              >
                <View style={styles.iconWrapper}>
                  <Image
                    source={{ uri: thumbUrl }}
                    style={styles.bookImage}
                    resizeMode="cover"
                  />
                  <View style={styles.badgeBCP}>
                    <Text style={styles.badgeText}>BCP</Text>
                  </View>
                </View>
                <Text style={styles.bookTitle} numberOfLines={1}>
                  {book.title}
                </Text>
                <Text style={styles.bookAction}>Buka Panduan →</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default BookScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  softGlow: {
    position: 'absolute',
    top: -50,
    left: -50,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(14, 165, 233, 0.05)',
  },
  scrollContent: {
    paddingHorizontal: 28,
    paddingTop: 30,
    paddingBottom: 90,
  },
  topHeader: {
    marginBottom: 35,
  },
  liveTag: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#0EA5E9',
    marginRight: 8,
  },
  liveTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 1.2,
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 38,
    letterSpacing: -1,
  },
  subTitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 10,
    lineHeight: 20,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  bookCard: {
    width: COLUMN_WIDTH,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 3,
  },
  iconWrapper: {
    width: '100%',
    height: 120,
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
  },
  bookImage: {
    width: '100%',
    height: '100%',
  },
  badgeBCP: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 8,
    fontWeight: '800',
  },
  bookTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'center',
    paddingHorizontal: 4,
  },
  bookAction: {
    fontSize: 11,
    fontWeight: '600',
    color: '#0EA5E9',
    textAlign: 'center',
    marginTop: 6,
  },
});
