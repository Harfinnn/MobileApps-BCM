import React, { useEffect, useState, useMemo } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
  TextInput,
} from 'react-native';
import { useLayout } from '../../../contexts/LayoutContext';
import { useNavigation } from '@react-navigation/native';
import { Search } from 'lucide-react-native';
import API from '../../../services/api';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 56 - 20) / 2;

const BookScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { setTitle, setHideNavbar, setShowBack, setShowSearch, setHideHeader } =
    useLayout();
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const filteredBooks = useMemo(() => {
    const query = searchQuery.toLowerCase();

    return books.filter(book => book.title?.toLowerCase().includes(query));
  }, [books, searchQuery]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await API.get('/mobile-playbooks');

        if (res.data?.status) {
          setBooks(res.data.data);
        }
      } catch (err) {
        console.log('Error fetch playbooks:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

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

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Text style={{ textAlign: 'center' }}>Loading playbooks...</Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
        },
      ]}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <View style={styles.softGlow} />
      <View style={[styles.searchContainer, { marginTop: 10 }]}>
        <Search color="#64748B" size={20} />
        <TextInput
          placeholder="Cari Playbook..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
          placeholderTextColor="#94A3B8"
        />
      </View>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 90 },
        ]}
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
          {filteredBooks.map(book => {
            // Logika pengambilan gambar berdasarkan folder slug
            const thumbUrl = book.thumbnail;

            return (
              <TouchableOpacity
                key={book.book_id}
                style={styles.bookCard}
                activeOpacity={0.8}
                onPress={() =>
                  navigation.navigate('BookView', {
                    url: book.url,
                    title: book.title,
                  })
                }
              >
                <View style={styles.iconWrapper}>
                  <Image
                    source={{
                      uri:
                        thumbUrl ||
                        'https://via.placeholder.com/300x200?text=No+Image',
                    }}
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
        {filteredBooks.length === 0 && (
          <Text
            style={{ textAlign: 'center', marginTop: 20, color: '#64748B' }}
          >
            Playbook tidak ditemukan
          </Text>
        )}
      </ScrollView>
    </View>
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 28,
    marginBottom: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: '#0F172A',
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
