import React, { useEffect, useRef, useState } from 'react';
import { Animated, Modal, StyleSheet, Text, View } from 'react-native';
import { CheckCircle2, XCircle } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useToastStore } from '@features/ui/store/toastStore';

const FADE_MS = 200;

export default function Toast() {
  const visible = useToastStore(s => s.visible);
  const message = useToastStore(s => s.message);
  const type = useToastStore(s => s.type);
  const insets = useSafeAreaInsets();
  const opacity = useRef(new Animated.Value(0)).current;
  // Stay mounted a beat past `visible=false` so the fade-out animation can actually play —
  // otherwise the Modal unmounts the instant the store flips, cutting the animation off.
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (visible) {
      setMounted(true);
      Animated.timing(opacity, { toValue: 1, duration: FADE_MS, useNativeDriver: true }).start();
    } else {
      Animated.timing(opacity, { toValue: 0, duration: FADE_MS, useNativeDriver: true }).start(({ finished }) => {
        if (finished) setMounted(false);
      });
    }
  }, [visible, opacity]);

  if (!mounted) return null;

  const isError = type === 'error';

  return (
    <Modal transparent visible={mounted} animationType="none" statusBarTranslucent onRequestClose={() => {}}>
      <View style={styles.host} pointerEvents="none">
        <Animated.View style={[styles.toast, { marginBottom: insets.bottom + 16, opacity }]}>
          {isError ? (
            <XCircle size={18} color="#DC2626" strokeWidth={2} />
          ) : (
            <CheckCircle2 size={18} color="#4ADE80" strokeWidth={2} />
          )}
          <Text style={styles.message} numberOfLines={3}>
            {message}
          </Text>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  host: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    maxWidth: '100%',
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  message: {
    flex: 1,
    fontSize: 14,
    color: '#FFFFFF',
    fontFamily: 'Roboto_400Regular',
  },
});
