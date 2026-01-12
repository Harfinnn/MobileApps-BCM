import { ImageSourcePropType } from 'react-native';

export type NewsItem = {
  id: number;
  title: string;
  summary: string;
  content: string;
  date: string;
  image: ImageSourcePropType;
};

export const NEWS_DUMMY: NewsItem[] = [
  {
    id: 1,
    title: 'Gempa bumi M5.2 mengguncang wilayah selatan',
    summary:
      'Gempa bermagnitudo 5.2 terjadi pada pagi hari dan dirasakan hingga beberapa wilayah sekitar.',
    content:
      'Gempa bumi berkekuatan magnitudo 5.2 mengguncang wilayah selatan pada pukul 08.12 WIB.\n\n' +
      'Badan Meteorologi, Klimatologi, dan Geofisika (BMKG) melaporkan pusat gempa berada di laut dengan kedalaman 10 kilometer. Getaran dirasakan hingga beberapa daerah sekitar namun tidak berpotensi tsunami.\n\n' +
      'Warga sempat panik dan berhamburan keluar rumah. Hingga saat ini belum ada laporan kerusakan berat maupun korban jiwa. Petugas terus melakukan pemantauan dan mengimbau masyarakat tetap tenang namun waspada terhadap kemungkinan gempa susulan.',
    date: 'Hari ini',
    image: require('../assets/image/Gempa.jpg'),
  },

  {
    id: 2,
    title: 'Banjir melanda beberapa titik pemukiman',
    summary:
      'Hujan deras sejak malam hari menyebabkan banjir di sejumlah kawasan pemukiman.',
    content:
      'Hujan deras yang mengguyur sejak malam hari menyebabkan banjir di beberapa kawasan pemukiman warga.\n\n' +
      'Ketinggian air bervariasi antara 30 hingga 50 sentimeter, sehingga aktivitas warga terganggu. Sejumlah kendaraan tidak dapat melintas di jalan utama.\n\n' +
      'Badan Penanggulangan Bencana Daerah (BPBD) telah menerjunkan personel untuk membantu evakuasi dan mendistribusikan bantuan logistik kepada warga terdampak.',
    date: 'Kemarin',
    image: require('../assets/image/Banjir.png'),
  },

  {
    id: 3,
    title: 'Status siaga bencana dinaikkan',
    summary:
      'Pemerintah daerah menaikkan status siaga guna mengantisipasi cuaca ekstrem.',
    content:
      'Pemerintah daerah resmi menaikkan status siaga bencana sebagai langkah antisipasi terhadap potensi bencana hidrometeorologi.\n\n' +
      'Langkah ini diambil menyusul meningkatnya curah hujan dan potensi angin kencang di sejumlah wilayah.\n\n' +
      'Masyarakat diimbau untuk tetap waspada, mengikuti informasi resmi, serta segera melapor jika terjadi kondisi darurat.',
    date: '2 hari lalu',
    image: require('../assets/image/Bencana.jpg'),
  },
  {
    id: 4,
    title: 'Tanah longsor menutup akses jalan desa',
    summary:
      'Longsor terjadi akibat hujan lebat dan menutup akses utama penghubung antar desa.',
    content:
      'Hujan lebat menyebabkan tanah longsor yang menutup akses utama penghubung antar desa. Alat berat telah diterjunkan untuk membuka kembali jalur transportasi.',
    date: '3 hari lalu',
    image: require('../assets/image/Longsor.jpg'),
  },
  {
    id: 5,
    title: 'Angin kencang rusak puluhan rumah warga',
    summary:
      'Angin kencang disertai hujan merusak atap rumah warga di beberapa wilayah.',
    content:
      'Angin kencang disertai hujan deras menyebabkan kerusakan pada puluhan rumah warga. Pemerintah daerah mengimbau masyarakat tetap waspada terhadap cuaca ekstrem.',
    date: '4 hari lalu',
    image: require('../assets/image/Angin.jpg'),
  },
  {
    id: 6,
    title: 'BPBD siapkan posko darurat bencana',
    summary: 'Posko darurat disiapkan untuk membantu warga terdampak bencana.',
    content:
      'BPBD menyiapkan posko darurat sebagai pusat koordinasi dan distribusi bantuan logistik bagi warga terdampak bencana.',
    date: '5 hari lalu',
    image: require('../assets/image/Posko.jpeg'),
  },
];
