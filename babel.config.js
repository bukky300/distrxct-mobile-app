module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
          alias: {
            '@': './src',
            '@apollo': './src/apollo',
            '@components': './src/components',
            '@config': './src/config',
            '@features': './src/features',
            '@graphql': './src/graphql',
            '@hooks': './src/hooks',
            '@navigation': './src/navigation',
            '@screens': './src/screens',
            '@utils': './src/utils',
          },
        },
      ],
      'react-native-reanimated/plugin', // must be last
    ],
  };
};
