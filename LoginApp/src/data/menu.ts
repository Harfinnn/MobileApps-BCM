import {
  HeartPulse,
  Shield,
  FileText,
  BarChart,
  Map,
  Phone,
  LucideIcon,
} from 'lucide-react-native';
import { ImageSourcePropType } from 'react-native';


export type MenuItemType = {
  id: number;
  title: string;

  icon?: LucideIcon;
  image?: ImageSourcePropType;

  type?: 'dashboard';
  hideInMore?: boolean;
  route?: string;
};

export const MAIN_MENU: MenuItemType[] = [
  { id: 1, title: 'Lapor Bencana', image: require('../assets/icons/LaporBencana.png'), route:'LaporBencana' },
  { id: 2, title: 'Info Gempa bumi', image: require('../assets/icons/InfoGempaBumi2.png') },
  { id: 3, title: 'RTA', image: require('../assets/icons/RTA.png') },
  { id: 4, title: 'Audit', image: require('../assets/icons/Audit.png') },
  { id: 5, title: 'Dashboard', image: require('../assets/icons/Dashboard.png'), type: 'dashboard', hideInMore: true, },
  { id: 6, title: 'Panduan Bencana', image: require('../assets/icons/Panduan Bencana.png') },
  { id: 7, title: 'Berita', image: require('../assets/icons/Berita.png') },
];

export const MORE_MENU: MenuItemType[] = [
  { id: 8, title: 'Dashboard IT', image: require('../assets/icons/DashboardIT.png'), route: 'DashboardIT' },
  { id: 9, title: 'Dashboard Non-IT', image: require('../assets/icons/DashboardNonIT.png'), route: 'DashboardNonIT' },
  { id: 10, title: 'Security', icon: Shield },
  { id: 11, title: 'Documents', icon: FileText },
  { id: 12, title: 'Medis', icon: HeartPulse },
  { id: 13, title: 'Location', icon: Map },
  { id: 14, title: 'Contact', icon: Phone },
];
