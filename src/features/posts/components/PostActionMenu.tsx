import React, { useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { Flag, Trash2 } from 'lucide-react-native';

interface Props {
  visible: boolean;
  onClose: () => void;
  onReport: () => void;
  onDelete?: () => void;
  /** Whether the current user owns this post (shows Delete option) */
  isOwner?: boolean;
  /** Screen-space coordinates to anchor the menu near the trigger */
  anchor?: { top: number; right: number };
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const MENU_WIDTH = 148;

export default function PostActionMenu({
  visible,
  onClose,
  onReport,
  onDelete,
  isOwner = false,
  anchor,
}: Props) {
  const scale = useSharedValue(0.85);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      scale.value = withSpring(1, { damping: 20, stiffness: 350 });
      opacity.value = withTiming(1, { duration: 150 });
    } else {
      scale.value = withTiming(0.88, { duration: 120, easing: Easing.in(Easing.ease) });
      opacity.value = withTiming(0, { duration: 120 });
    }
  }, [visible]);

  const menuStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const top = anchor?.top ?? 120;
  const right = anchor?.right ?? 16;

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <TouchableOpacity
        style={StyleSheet.absoluteFill}
        onPress={onClose}
        activeOpacity={1}
      />
      <Animated.View
        style={[
          styles.menu,
          menuStyle,
          { top, right: Math.min(right, SCREEN_WIDTH - MENU_WIDTH - 8) },
        ]}
      >
        <TouchableOpacity
          style={styles.item}
          onPress={() => { onClose(); onReport(); }}
          activeOpacity={0.65}
        >
          <Flag size={17} color="#1A1A1A" strokeWidth={1.8} />
          <Text style={styles.itemText}>Report</Text>
        </TouchableOpacity>

        {isOwner && (
          <>
            <View style={styles.divider} />
            <TouchableOpacity
              style={styles.item}
              onPress={() => { onClose(); onDelete?.(); }}
              activeOpacity={0.65}
            >
              <Trash2 size={17} color="#CC0000" strokeWidth={1.8} />
              <Text style={[styles.itemText, styles.deleteText]}>Delete</Text>
            </TouchableOpacity>
          </>
        )}
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  menu: {
    position: 'absolute',
    width: MENU_WIDTH,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.14,
    shadowRadius: 12,
    elevation: 10,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  itemText: {
    fontSize: 15,
    fontWeight: '400',
    fontFamily: 'Roboto_400Bold',
    color: '#1A1A1A',
  },
  deleteText: {
    color: '#CC0000',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#E5E5EA',
    marginHorizontal: 12,
  },
});
