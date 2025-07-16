module.exports = function (api) {
  const isTest = api.env('test');
  api.cache(!isTest);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      !isTest && 'expo-router/babel',
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
    ].filter(Boolean),
  };
}; 