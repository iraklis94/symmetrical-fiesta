import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

interface SkeletonLoaderProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: any;
}

export const SkeletonLoader = React.memo(({ 
  width: skeletonWidth = '100%', 
  height = 20, 
  borderRadius = 4,
  style 
}: SkeletonLoaderProps) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();

    return () => animation.stop();
  }, [animatedValue]);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width: skeletonWidth,
          height,
          borderRadius,
          opacity,
        },
        style,
      ]}
    />
  );
});

SkeletonLoader.displayName = 'SkeletonLoader';

export const ProductCardSkeleton = React.memo(() => (
  <View style={styles.productCardSkeleton}>
    <SkeletonLoader width="100%" height={CARD_WIDTH * 0.8} borderRadius={12} />
    <View style={styles.productCardContent}>
      <SkeletonLoader width="60%" height={12} />
      <SkeletonLoader width="100%" height={16} style={{ marginTop: 8 }} />
      <SkeletonLoader width="40%" height={12} style={{ marginTop: 8 }} />
      <SkeletonLoader width="50%" height={16} style={{ marginTop: 8 }} />
    </View>
  </View>
));

ProductCardSkeleton.displayName = 'ProductCardSkeleton';

export const CategoryCardSkeleton = React.memo(() => (
  <View style={styles.categoryCardSkeleton}>
    <SkeletonLoader width={60} height={60} borderRadius={30} />
    <SkeletonLoader width="80%" height={12} style={{ marginTop: 8 }} />
    <SkeletonLoader width="60%" height={10} style={{ marginTop: 4 }} />
  </View>
));

CategoryCardSkeleton.displayName = 'CategoryCardSkeleton';

const CARD_WIDTH = width * 0.4;

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: '#e1e8ed',
  },
  productCardSkeleton: {
    width: CARD_WIDTH,
    backgroundColor: 'white',
    borderRadius: 12,
    marginRight: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  productCardContent: {
    padding: 12,
  },
  categoryCardSkeleton: {
    width: 100,
    height: 100,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    padding: 10,
    backgroundColor: 'white',
  },
});