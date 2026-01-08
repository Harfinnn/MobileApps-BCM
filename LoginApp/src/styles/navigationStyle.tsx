import { StyleSheet } from 'react-native';

export const createStyles = (TAB_WIDTH: number, ACTIVE_WIDTH: number) =>
  StyleSheet.create({
    wrapper: {
      position: 'absolute',
      bottom: 20,
      width: '100%',
      alignItems: 'center',
      zIndex: 10, 
      elevation: 10,
    },

    navbar: {
      flexDirection: 'row',
      backgroundColor: '#2CCABC',
      borderRadius: 60,
      padding: 6,
    },

    tab: {
      width: TAB_WIDTH,
      height: 50,
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2,
    },

    activePill: {
      position: 'absolute',
      left: 6,
      top: 6,
      height: 50,
      width: ACTIVE_WIDTH,
      borderRadius: 40,
      backgroundColor: 'rgba(255, 255, 255, 1)',
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 18,
      borderWidth: 2,
      borderColor: '#F8AD3CFF',
      zIndex: 1,
    },

    activeLabel: {
      color: '#F8AD3CFF',
      fontWeight: '700',
      fontSize: 15,
      marginLeft: 8,
    },
  });
