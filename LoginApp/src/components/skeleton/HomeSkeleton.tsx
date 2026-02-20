import React from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const HomeSkeleton = () => {
  return (
    <SkeletonPlaceholder borderRadius={12}>
      {/* SLIDER */}
      <SkeletonPlaceholder.Item
        width={width - 32}
        height={230}
        marginTop={70}
        marginHorizontal={16}
        borderRadius={16}
      />

      {/* MENU GRID */}
      <SkeletonPlaceholder.Item
        flexDirection="row"
        flexWrap="wrap"
        justifyContent="space-between"
        marginTop={30}
        marginHorizontal={16}
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonPlaceholder.Item
            key={i}
            width={width / 4 - 24}
            height={90}
            borderRadius={14}
            marginBottom={16}
          />
        ))}
      </SkeletonPlaceholder.Item>

      {/* SMALL BANNER */}
      <SkeletonPlaceholder.Item
        width={width - 32}
        height={100}
        marginHorizontal={16}
        marginTop={16}
        borderRadius={14}
      />

      {/* NEWS LIST */}
      {Array.from({ length: 3 }).map((_, i) => (
        <SkeletonPlaceholder.Item
          key={i}
          width={width - 32}
          height={120}
          marginHorizontal={16}
          marginTop={16}
          borderRadius={16}
        />
      ))}
    </SkeletonPlaceholder>
  );
};

export default HomeSkeleton;
