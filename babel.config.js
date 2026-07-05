module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // NativeWind v4's className transform, added manually rather than via the
      // `nativewind/babel` preset — that preset also injects `react-native-worklets/plugin`,
      // which only exists for Reanimated 4+. This project is on Reanimated 3.10, which
      // ships its own `react-native-reanimated/plugin` below.
      require('react-native-css-interop/dist/babel-plugin').default,
      ['@babel/plugin-transform-react-jsx', { runtime: 'automatic', importSource: 'react-native-css-interop' }],
      [
        'module-resolver',
        {
          root: ['./src'],
          extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
          alias: {
            '@': './src',
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
