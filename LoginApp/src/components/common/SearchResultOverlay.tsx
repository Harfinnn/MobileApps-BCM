import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../../styles/navigation/headerStyle';
import { SEARCH_ROUTES } from '../../constants/searchRoutes';

type Props = {
  visible: boolean;
  keyword: string;
  results: typeof SEARCH_ROUTES;
  onClose: () => void;
};

const SearchResultOverlay = React.memo(
  ({ visible, keyword, results, onClose }: Props) => {
    const navigation = useNavigation<any>();

    if (!visible || keyword.trim().length === 0) return null;

    return (
      <View style={styles.searchResultWrapper}>
        {results.length === 0 ? (
          <Text style={styles.noResult}>Halaman tidak ditemukan</Text>
        ) : (
          results.map(item => (
            <TouchableOpacity
              key={item.route}
              style={styles.searchItem}
              onPress={() => {
                onClose();
                navigation.navigate('Main', {
                  screen: item.route,
                  params: item.params,
                });
              }}
            >
              <Text style={styles.searchText}>{item.label}</Text>
            </TouchableOpacity>
          ))
        )}
      </View>
    );
  },
);

export default SearchResultOverlay;
