export type SearchRoute = {
  label: string;
  route: string;
  params?: any;
};

export const SEARCH_ROUTES: SearchRoute[] = [

  { label: 'Dashboard IT', route: 'DashboardIT' },
  { label: 'Dashboard Non IT', route: 'DashboardNonIT' },

  { label: 'Lapor Bencana', route: 'LaporBencana' },
  { label: 'Info Gempa Bumi', route: 'InfoGempaBumi' },
  { label: 'Audit', route: 'Audit' },
  { label: 'RTA', route: 'RTA' },

  { label: 'Panduan Bencana', route: 'PanduanBencana' },
  { label: 'Berita', route: 'Berita' },
  { label: 'Tentang Aplikasi', route: 'About' },
  { label: 'Profil', route: 'Profile' },
];
