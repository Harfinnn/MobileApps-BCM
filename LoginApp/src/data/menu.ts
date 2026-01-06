// data/menu.ts
import {
  Mail,
  AlertTriangle,
  Package,
  HeartPulse,
  Siren,
  History,
  CreditCard,
  Shield,
  FileText,
  Calendar,
  Map,
  Phone,
} from 'lucide-react-native';

export const MAIN_MENU = [
  { id: 1, title: 'Inbox', icon: Mail },
  { id: 2, title: 'History', icon: History },
  { id: 3, title: 'Payment', icon: CreditCard },
  { id: 4, title: 'Peringatan', icon: AlertTriangle },
  { id: 5, title: 'Logistik', icon: Package },
  { id: 6, title: 'Medis', icon: HeartPulse },
  { id: 7, title: 'Status Darurat', icon: Siren },
];

export const MORE_MENU = [
  { id: 8, title: 'Security', icon: Shield },
  { id: 9, title: 'Documents', icon: FileText },
  { id: 10, title: 'Schedule', icon: Calendar },
  { id: 11, title: 'Location', icon: Map },
  { id: 12, title: 'Contact', icon: Phone },
];
