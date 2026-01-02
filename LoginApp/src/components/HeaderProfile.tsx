import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Bell, User } from 'lucide-react-native';

type Props = {
  title?: string;
};

export default function DashboardHeader({ title = 'Dashboard' }: Props) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.pill}>
        {/* LEFT */}
        <Text style={styles.title}>{title}</Text>

        {/* RIGHT */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7}>
            <Bell size={20} color="#F8AD3CFF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7}>
            <User size={20} color="#F8AD3CFF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 16,
    alignItems: 'center',
  },

  pill: {
    width: '93%',
    height: 52,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    paddingHorizontal: 18,

    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderRadius: 999,

    borderWidth: 2,
    borderColor: 'rgba(18, 203, 236, 1)',
  },

  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000ff',
  },

  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconBtn: {
    marginLeft: 12,
    width: 32,
    height: 32,
    borderRadius: 16,

    alignItems: 'center',
    justifyContent: 'center',  },
});
