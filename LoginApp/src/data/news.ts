import { ImageSourcePropType } from 'react-native';

export type NewsItem = {
  id: number;
  title: string;
  summary: string;
  date: string;
  image: ImageSourcePropType;
};

export const NEWS_DUMMY: NewsItem[] = [
  {
    id: 1,
    title: 'Gempa bumi M5.2 mengguncang wilayah selatan',
    summary:
      'BMKG melaporkan gempa terjadi pada pukul 08.12 WIB dan dirasakan hingga beberapa daerah.',
    date: 'Hari ini',
    image: require('../assets/image/Gempa.jpg'),
  },
  {
    id: 2,
    title: 'Banjir melanda beberapa titik pemukiman',
    summary:
      'Hujan deras sejak malam menyebabkan genangan di sejumlah wilayah pemukiman warga.',
    date: 'Kemarin',
    image: require('../assets/image/Banjir.png'),
  },
  {
    id: 3,
    title: 'Status siaga bencana dinaikkan',
    summary:
      'Pemerintah daerah resmi menaikkan status siaga bencana untuk mengantisipasi dampak lanjutan.',
    date: '2 hari lalu',
    image: require('../assets/image/Bencana.jpg'),
  },
];
