/// <reference types="nativewind/types" />

import 'react-native';

export {};

declare module 'react-native' {
  export interface ViewProps {
    className?: string;
  }
  export interface TextProps {
    className?: string;
  }
  export interface ImageProps {
    className?: string;
  }
  export interface ScrollViewProps {
    className?: string;
  }
  export interface TextInputProps {
    className?: string;
  }
  export interface TouchableOpacityProps {
    className?: string;
  }
}