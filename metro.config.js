const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add any custom configurations here
config.resolver.assetExts.push('db');

// Optimize bundle size and performance
config.transformer = {
  ...config.transformer,
  minifierConfig: {
    keep_fnames: true,
    mangle: {
      keep_fnames: true,
    },
  },
  getTransformOptions: async () => ({
    transform: {
      experimentalImportSupport: false,
      inlineRequires: true,
    },
  }),
};

// Optimize resolver for better tree shaking
config.resolver = {
  ...config.resolver,
  alias: {
    // Add any module aliases here for better tree shaking
  },
  platforms: ['ios', 'android', 'native', 'web'],
  resolverMainFields: ['react-native', 'browser', 'main'],
};

// Optimize serializer for better bundle output
config.serializer = {
  ...config.serializer,
  getPolyfills: () => [],
};

module.exports = config; 