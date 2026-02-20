import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';

type Props = {
  uri?: string | null;
  initial: string;
  size?: number;
  editable?: boolean;
  onPress?: () => void;
};

export default function Avatar({
  uri,
  initial,
  size = 56,
  editable = false,
  onPress,
}: Props) {
  const Wrapper = editable ? TouchableOpacity : View;

  return (
    <Wrapper
      onPress={editable ? onPress : undefined}
      activeOpacity={0.85}
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#E5E7EB',
      }}
    >
      {uri ? (
        <FastImage
          style={{ width: size, height: size }}
          source={{
            uri,
            priority: FastImage.priority.high,
            cache: FastImage.cacheControl.immutable,
          }}
          resizeMode={FastImage.resizeMode.cover}
        />
      ) : (
        <Text
          style={{
            fontSize: size / 2,
            fontWeight: '700',
            color: '#6B7280',
          }}
        >
          {initial}
        </Text>
      )}
    </Wrapper>
  );
}
