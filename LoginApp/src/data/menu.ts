import { LucideIcon } from 'lucide-react-native';
import { ImageSourcePropType } from 'react-native';

export type MenuItemType = {
  id: number;
  title: string;

  icon?: LucideIcon;
  image?: ImageSourcePropType;

  type?: 'dashboard';
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
    image: require('../assets/gambar_icon/lapor_bencana.png'),
    route: 'LaporBencana',
    iconWidth: 110,
    iconHeight: 85,
    offsetBottom: -25,
    offsetRight: -35,
  },
  {
    id: 2,
    title: 'Info Gempa bumi',
    image: require('../assets/gambar_icon/info-gempa.png'),
    route: 'InfoGempaBumi',
    iconWidth: 140,
    iconHeight: 130,
    offsetBottom: -45,
    offsetRight: -50,
  },
  {
    id: 3,
    title: 'RTA',
    image: require('../assets/gambar_icon/rta2.png'),
    route: 'RTA',
    iconWidth: 110,
    iconHeight: 85,
    offsetBottom: -25,
    offsetRight: -35,
  },
  {
    id: 4,
    title: 'Audit',
    image: require('../assets/gambar_icon/audit.png'),
    route: 'Audit',
    iconWidth: 100,
    iconHeight: 85,
    offsetBottom: -25,
    offsetRight: -30,
  },
  {
    id: 5,
    title: 'Dashboard',
    image: require('../assets/gambar_icon/dashboard_it .png'),
    type: 'dashboard',
    hideInMore: true,
    iconWidth: 110,
    iconHeight: 85,
    offsetBottom: -25,
    offsetRight: -35,
  },
  {
    id: 6,
    title: 'Panduan Bencana',
    image: require('../assets/gambar_icon/bencana1.png'),
    route: 'PanduanBencana',
    iconWidth: 100,
    iconHeight: 85,
    offsetBottom: -25,
    offsetRight: -35,
  },
  {
    id: 7,
    title: 'Berita',
    image: require('../assets/gambar_icon/berita.png'),
    route: 'Berita',
    iconWidth: 110,
    iconHeight: 85,
    offsetBottom: -25,
    offsetRight: -35,
  },
];

export const MORE_MENU: MenuItemType[] = [
  {
    id: 8,
    title: 'Dashboard IT',
    image: require('../assets/gambar_icon/dashboard_it .png'),
    route: 'DashboardIT',
    iconWidth: 100,
    iconHeight: 85,
    offsetBottom: -25,
    offsetRight: -35,
  },
  {
    id: 9,
    title: 'Dashboard Non-IT',
    image: require('../assets/gambar_icon/dashboard_non_it.png'),
    route: 'DashboardNonIT',
    iconWidth: 100,
    iconHeight: 85,
    offsetBottom: -25,
    offsetRight: -35,
  },
];
