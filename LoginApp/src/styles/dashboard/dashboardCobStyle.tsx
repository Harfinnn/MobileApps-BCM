import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width } = Dimensions.get('window');

export const getThemeColors = (isDark: boolean) => ({
  background: isDark ? '#090D16' : '#F8FAFC',
  card: isDark ? '#111827' : '#FFFFFF',
  border: isDark ? '#1F2937' : '#E2E8F0',
  textMain: isDark ? '#FFFFFF' : '#0F172A',
  textSub: isDark ? '#94A3B8' : '#475569',
  textMuted: isDark ? '#475569' : '#94A3B8',
  chartEndFill: isDark ? '#121826' : '#EEF2FF',
  insightCardBg: isDark ? '#0F172A' : '#EFF6FF',
  insightCardBorder: isDark ? 'rgba(59, 130, 246, 0.15)' : '#BFDBFE',
  statusBannerBg: isDark ? '#111827' : '#FFFFFF',
});

export const getStyles = (
  theme: ReturnType<typeof getThemeColors>,
  isDark: boolean,
) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      paddingHorizontal: 0, // Diubah ke 0 karena sudah dibungkus scrollContent yang punya padding 20
      paddingTop: 70,
      paddingBottom: 16,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    headerBadgeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 6,
    },
    pulseDot: {
      width: 7,
      height: 7,
      borderRadius: 4,
      marginLeft: 6,
    },
    headerSubtitle: {
      fontSize: 10,
      fontWeight: '800',
      color: theme.textMuted,
      letterSpacing: 1.5,
    },
    headerTitle: {
      fontSize: 26,
      fontWeight: '900',
      color: theme.textMain,
      letterSpacing: -0.5,
    },
    dateBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.card,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: theme.border,
    },
    dateText: {
      fontSize: 12,
      fontWeight: '600',
      color: theme.textSub,
      marginLeft: 6,
    },
    scrollContent: {
      paddingHorizontal: 20,
      paddingBottom: 40,
    },

    /* STATUS BANNER */
    banner: {
      borderRadius: 14,
      padding: 16,
      marginBottom: 20,
      borderWidth: 1,
      backgroundColor: theme.statusBannerBg,
    },
    bannerNormal: {
      borderColor: isDark ? 'rgba(16, 185, 129, 0.25)' : '#A7F3D0',
    },
    bannerWarning: {
      borderColor: isDark ? 'rgba(245, 158, 11, 0.25)' : '#FDE68A',
    },
    bannerHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    bannerTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    bannerTitle: {
      fontSize: 13,
      fontWeight: '800',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    statusTagText: {
      fontSize: 10,
      fontWeight: '900',
      letterSpacing: 0.5,
    },
    bannerDesc: {
      fontSize: 13,
      lineHeight: 19,
      color: theme.textSub,
    },

    /* METRIC CARDS */
    statsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 20,
    },
    statCard: {
      width: (width - 52) / 2,
      padding: 16,
      borderRadius: 16,
      backgroundColor: theme.card,
      borderWidth: 1,
    },
    primaryAccentBorder: {
      borderColor: isDark ? 'rgba(99, 102, 241, 0.25)' : '#E0E7FF',
    },
    secondaryAccentBorder: {
      borderColor: isDark ? 'rgba(139, 92, 246, 0.25)' : '#EDE9FE',
    },
    iconCircle: {
      width: 36,
      height: 36,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 12,
    },
    statLabel: {
      fontSize: 10,
      fontWeight: '700',
      color: theme.textMuted,
      letterSpacing: 0.8,
      marginBottom: 4,
    },
    statValue: {
      fontSize: 22,
      fontWeight: '900',
      color: theme.textMain,
    },
    statUnit: {
      fontSize: 13,
      fontWeight: '600',
      color: theme.textMuted,
    },

    /* HEADERS SECTION */
    sectionHeaderContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 12,
      marginTop: 8,
    },
    sectionTitle: {
      fontSize: 12,
      fontWeight: '800',
      color: theme.textSub,
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    miniSectionTitle: {
      fontSize: 11,
      fontWeight: '800',
      color: theme.textMuted,
      letterSpacing: 1.5,
      marginBottom: 12,
      marginTop: 8,
    },

    /* PIPELINE TRACK STAGE */
    stageTrackContainer: {
      backgroundColor: theme.card,
      borderRadius: 16,
      padding: 16,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: theme.border,
    },
    trackItem: {
      flexDirection: 'row',
      height: 58,
    },
    timelineVisual: {
      alignItems: 'center',
      width: 38,
      marginRight: 12,
    },
    timelineNode: {
      width: 36,
      height: 22,
      borderRadius: 6,
      backgroundColor: isDark ? '#1F2937' : '#F1F5F9',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.border,
    },
    nodeTagText: {
      fontSize: 9,
      fontWeight: '900',
      color: theme.textSub,
    },
    timelineLinkLine: {
      width: 2,
      flex: 1,
      backgroundColor: theme.border,
      marginVertical: 4,
    },
    trackContent: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      paddingTop: 2,
    },
    trackLabel: {
      fontSize: 13,
      color: theme.textSub,
      fontWeight: '600',
      maxWidth: width * 0.5,
    },
    trackValue: {
      fontSize: 13,
      color: theme.textMain,
      fontWeight: '700',
      fontVariant: ['tabular-nums'],
    },

    /* GRID TWO COLUMNS */
    gridTwoColumn: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 20,
    },
    columnCard: {
      width: '48%',
      backgroundColor: theme.card,
      borderRadius: 14,
      padding: 14,
      borderWidth: 1,
      borderColor: theme.border,
    },
    columnTitle: {
      fontSize: 11,
      fontWeight: '700',
      color: theme.textMuted,
      marginBottom: 6,
    },
    kpiValueRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    kpiValue: {
      fontSize: 20,
      fontWeight: '900',
    },
    kpiSub: {
      fontSize: 10,
      color: theme.textMuted,
      marginTop: 4,
    },

    /* ANALYTICAL INSIGHTS */
    insightCard: {
      backgroundColor: theme.insightCardBg,
      borderRadius: 16,
      padding: 16,
      marginBottom: 24,
      borderWidth: 1,
      borderColor: theme.insightCardBorder,
    },
    insightHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    insightHeaderTitle: {
      fontSize: 12,
      fontWeight: '800',
      color: '#3B82F6',
      marginLeft: 6,
      letterSpacing: 0.5,
    },
    insightRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: 10,
    },
    insightIndexText: {
      fontSize: 12,
      color: '#3B82F6',
      fontWeight: '700',
      marginRight: 6,
      fontVariant: ['tabular-nums'],
    },
    insightText: {
      flex: 1,
      fontSize: 13,
      color: theme.textSub,
      lineHeight: 19,
    },

    /* HISTORICAL PEAKS */
    performanceContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 24,
    },
    performanceCard: {
      width: '48%',
      backgroundColor: theme.card,
      borderRadius: 14,
      padding: 14,
      borderWidth: 1,
      borderColor: theme.border,
    },
    perfIcon: {
      marginBottom: 8,
    },
    performanceTitle: {
      fontSize: 11,
      color: theme.textMuted,
      fontWeight: '700',
    },
    performanceValue: {
      fontSize: 18,
      fontWeight: '900',
      color: theme.textMain,
      marginTop: 2,
    },
    performanceDate: {
      marginTop: 4,
      fontSize: 10,
      color: theme.textMuted,
    },

    /* SUMMARY CARDS */
    summaryContainer: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 16,
    },
    summaryCard: {
      flex: 1,
      backgroundColor: theme.card,
      borderRadius: 14,
      padding: 16,
      borderWidth: 1,
      borderColor: theme.border,
    },
    summaryCardFull: {
      backgroundColor: theme.card,
      borderRadius: 14,
      padding: 16,
      borderWidth: 1,
      borderColor: theme.border,
      marginBottom: 20,
    },
    summaryLabel: {
      fontSize: 10,
      fontWeight: '700',
      color: theme.textSub,
      textTransform: 'uppercase',
      letterSpacing: 0.8,
      marginBottom: 6,
    },
    summaryValue: {
      fontSize: 24,
      fontWeight: '800',
      color: theme.textMain,
    },
    summaryText: {
      fontSize: 13,
      lineHeight: 20,
      color: theme.textSub,
    },
  });
