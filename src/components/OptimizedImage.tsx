import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Image,
  ActivityIndicator,
  StyleSheet,
  ImageStyle,
  ViewStyle,
} from 'react-native';
import { Image as ExpoImage } from 'expo-image';

interface OptimizedImageProps {
  source: string | { uri: string };
  style?: ImageStyle;
  containerStyle?: ViewStyle;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'center' | 'repeat';
  placeholder?: string;
  fallback?: string;
  priority?: 'low' | 'normal' | 'high';
  onLoadStart?: () => void;
  onLoadEnd?: () => void;
  onError?: (error: any) => void;
  testID?: string;
}

export const OptimizedImage = React.memo(({
  source,
  style,
  containerStyle,
  resizeMode = 'cover',
  placeholder,
  fallback,
  priority = 'normal',
  onLoadStart,
  onLoadEnd,
  onError,
  testID,
}: OptimizedImageProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [currentSource, setCurrentSource] = useState(source);

  const uri = useMemo(() => {
    if (typeof source === 'string') return source;
    return source.uri;
  }, [source]);

  const handleLoadStart = useCallback(() => {
    setIsLoading(true);
    setHasError(false);
    onLoadStart?.();
  }, [onLoadStart]);

  const handleLoadEnd = useCallback(() => {
    setIsLoading(false);
    onLoadEnd?.();
  }, [onLoadEnd]);

  const handleError = useCallback((error: any) => {
    setIsLoading(false);
    setHasError(true);
    
    // Try fallback image if available
    if (fallback && currentSource !== fallback) {
      setCurrentSource(fallback);
      setHasError(false);
      return;
    }
    
    onError?.(error);
  }, [fallback, currentSource, onError]);

  const imageSource = useMemo(() => {
    if (typeof currentSource === 'string') {
      return { uri: currentSource };
    }
    return currentSource;
  }, [currentSource]);

  const contentFit = useMemo(() => {
    switch (resizeMode) {
      case 'cover': return 'cover';
      case 'contain': return 'contain';
      case 'stretch': return 'fill';
      case 'center': return 'center';
      case 'repeat': return 'repeat';
      default: return 'cover';
    }
  }, [resizeMode]);

  const transition = useMemo(() => ({
    duration: 300,
  }), []);

  if (hasError && !fallback) {
    return (
      <View style={[styles.errorContainer, containerStyle]}>
        <View style={[styles.errorPlaceholder, style]} />
      </View>
    );
  }

  return (
    <View style={[styles.container, containerStyle]}>
      <ExpoImage
        source={imageSource}
        style={[styles.image, style]}
        contentFit={contentFit}
        transition={transition}
        priority={priority}
        placeholder={placeholder}
        onLoadStart={handleLoadStart}
        onLoadEnd={handleLoadEnd}
        onError={handleError}
        testID={testID}
        cachePolicy="memory-disk"
      />
      {isLoading && (
        <View style={[styles.loadingOverlay, style]}>
          <ActivityIndicator size="small" color="#e74c3c" />
        </View>
      )}
    </View>
  );
});

OptimizedImage.displayName = 'OptimizedImage';

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorPlaceholder: {
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
});