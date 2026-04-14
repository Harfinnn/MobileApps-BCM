import React, { useRef, useEffect, useCallback, useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  BackHandler,
  StatusBar,
} from 'react-native';
import { WebView } from 'react-native-webview';
import {
  useRoute,
  useNavigation,
  useFocusEffect,
} from '@react-navigation/native';
import { useLayout } from '../../../contexts/LayoutContext';

const INJECTED_JAVASCRIPT = `
  const meta = document.createElement('meta');
  meta.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0');
  meta.setAttribute('name', 'viewport');
  document.getElementsByTagName('head')[0].appendChild(meta);
  true; 
`;

const BookViewScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const webViewRef = useRef<WebView>(null);
  const [canGoBackWeb, setCanGoBackWeb] = useState(false);

  const { url, title } = route.params || {};
  const { setHideNavbar, setHideHeader, setTitle, setShowBack } = useLayout();

  useEffect(() => {
    // Sembunyikan elemen UI Global, tapi biarkan header jika ingin judul tetap tampil
    // Di sini saya asumsikan ingin benar-benar full screen
    setHideNavbar(true);
    setHideHeader(true);

    return () => {
      setHideNavbar(false);
      setHideHeader(true);
    };
  }, []);

  // Handle tombol Back Fisik
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (canGoBackWeb && webViewRef.current) {
          webViewRef.current.goBack();
          return true;
        }
        navigation.goBack();
        return true;
      };

      // Simpan return value dari addEventListener ke dalam variabel
      const backHandlerSubscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      // Gunakan .remove() pada variabel tersebut di fungsi cleanup
      return () => backHandlerSubscription.remove();
    }, [canGoBackWeb, navigation]), // Pastikan navigation masuk dependency jika digunakan
  );

  const renderLoading = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#0EA5E9" />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      {url ? (
        <WebView
          ref={webViewRef}
          source={{ uri: url }}
          style={styles.webview}
          startInLoadingState={true}
          renderLoading={renderLoading}
          onNavigationStateChange={navState =>
            setCanGoBackWeb(navState.canGoBack)
          }
          injectedJavaScript={INJECTED_JAVASCRIPT}
          scalesPageToFit={false}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.errorContainer}>
          <ActivityIndicator size="small" color="#94A3B8" />
        </View>
      )}
    </SafeAreaView>
  );
};

export default BookViewScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  webview: { flex: 1 },
  loadingContainer: {
    position: 'absolute',
    inset: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    zIndex: 10,
  },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
