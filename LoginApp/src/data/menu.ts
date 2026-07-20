import { LucideIcon } from 'lucide-react-native';
import { ImageSourcePropType } from 'react-native';

export type MenuItemType = {
  id: string | number;
  title: string;
  icon?: LucideIcon;
  image?: ImageSourcePropType;
  type?: 'dashboard' | 'more';
  hideInMore?: boolean;
  route?: string;

  color?: string;
  iconWidth?: number;
  iconHeight?: number;
  offsetBottom?: number;
  offsetRight?: number;
};

export const MAIN_MENU: MenuItemType[] = [
  {
    id: 1,
    title: 'Lapor Bencana',
    image: require('../assets/Icon/laporBencana.webp'),
    route: 'LaporBencana',
    color: 'rgba(44, 202, 188, 0.25)',
    iconWidth: 65,
    iconHeight: 65,
    offsetBottom: -5,
    offsetRight: -5,
  },
  {
    id: 2,
    title: 'Gempa Bumi',
    image: require('../assets/Icon/infoGempa.webp'),
    route: 'InfoGempaBumi',
    iconWidth: 65,
    iconHeight: 65,
    offsetBottom: -5,
    offsetRight: -5,
  },
  {
    id: 3,
    title: 'RTA',
    image: require('../assets/Icon/rta.webp'),
    route: 'RTA',
    iconWidth: 70,
    iconHeight: 70,
    offsetBottom: -10,
    offsetRight: -10,
  },
  {
    id: 4,
    title: 'Cuaca',
    image: require('../assets/Icon/weather.webp'),
    route: 'F3d',
    iconWidth: 65,
    iconHeight: 65,
    offsetBottom: -5,
    offsetRight: -5,
  },
  {
    id: 5,
    title: 'Dashboard',
    image: require('../assets/Icon/dashboard.webp'),
    type: 'dashboard',
    hideInMore: true,
    iconWidth: 65,
    iconHeight: 65,
    offsetBottom: -5,
    offsetRight: -5,
  },
  {
    id: 6,
    title: 'Panduan Bencana',
    image: require('../assets/Icon/panduan.webp'),
    route: 'PanduanBencana',
    iconWidth: 65,
    iconHeight: 65,
    offsetBottom: -5,
    offsetRight: -5,
  },
  {
    id: 7,
    title: 'Berita',
    image: require('../assets/Icon/news.webp'),
    route: 'Berita',
    iconWidth: 65,
    iconHeight: 65,
    offsetBottom: -5,
    offsetRight: -5,
  },

  {
    id: 'more',
    title: 'More',
    type: 'more',
  },
];

export const MORE_MENU: MenuItemType[] = [
  {
    id: 8,
    title: 'Tsunami',
    image: require('../assets/Icon/tsunami.webp'),
    route: 'TsunamiHistory',
    iconWidth: 80,
    iconHeight: 80,
    offsetBottom: -13,
    offsetRight: -15,
  },
  {
    id: 9,
    title: 'Dashboard IT',
    image: require('../assets/Icon/dashboard1.webp'),
    route: 'DashboardIT',
    iconWidth: 120,
    iconHeight: 120,
    offsetBottom: -35,
    offsetRight: -32,
  },
  {
    id: 10,
    title: 'Dashboard Non-IT',
    image: require('../assets/Icon/dashboard_2.webp'),
    route: 'DashboardNonIT',
    color: 'rgba(0, 163, 157, 0.22)',
    iconWidth: 130,
    iconHeight: 130,
    offsetBottom: -40,
    offsetRight: -35,
  },

];
