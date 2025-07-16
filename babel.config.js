module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'expo-router/babel',
      'react-native-reanimated/plugin',
      'nativewind/babel',
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@': ['./src'],
            '@components': ['./src/components'],
            '@hooks': ['./src/hooks'],
            '@utils': ['./src/utils'],
            '@stores': ['./src/stores'],
            '@services': ['./src/services'],
            '@constants': ['./src/constants'],
            '@convex': ['./convex'],
          },
        },
      ],
    ],
  };
}; 