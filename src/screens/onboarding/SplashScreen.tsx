import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

// logo.png is 64×86px — icon occupies top 62px, "Distrxct" text is bottom 24px.
// We clip to icon-only using overflow:hidden with proportional height.
const ICON_DISPLAY_SIZE = 104;
const ICON_RATIO = 86 / 64;               // full image aspect ratio
const ICON_CLIP_RATIO = 62 / 86;          // fraction we want to show

const imageFullHeight = ICON_DISPLAY_SIZE * ICON_RATIO;   // ~139.75
const clippedHeight = imageFullHeight * ICON_CLIP_RATIO;  // ~100.6

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <View style={[styles.clip, { width: ICON_DISPLAY_SIZE, height: clippedHeight }]}>
        <Image
          source={require('../../../assets/images/logo.png')}
          style={{ width: ICON_DISPLAY_SIZE, height: imageFullHeight }}
          resizeMode="stretch"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clip: {
    overflow: 'hidden',
  },
});
