import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Modal,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Settings,
  Heart,
  Pencil,
  HelpCircle,
  LogOut,
  ArrowUpRight,
  Code,
} from 'lucide-react-native';
import { useUIStore } from '@features/ui/store/uiStore';
import { useAuthStore } from '@features/auth/store/authStore';
import { PLACEHOLDER_AVATAR } from '@features/friends/utils/placeholderAvatar';
import { fullName } from '@features/friends/utils/formatName';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const DRAWER_WIDTH = SCREEN_WIDTH * 0.78;

// ─── Menu items ───────────────────────────────────────────────────────────────
const PRIMARY_ITEMS = [
  { icon: Settings,  label: 'Settings',          key: 'settings' },
  { icon: Heart,     label: 'Collections',        key: 'collections' },
  { icon: Pencil,    label: 'Distrxct business',  key: 'business' },
] as const;

const SECONDARY_ITEMS = [
  { icon: HelpCircle, label: 'Help',        key: 'help' },
  { icon: Code,       label: 'Dev Preview', key: 'dev-preview' },
  { icon: LogOut,     label: 'Log out',     key: 'logout' },
] as const;

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  onNavigate?: (key: string) => void;
  onLogout?: () => void;
}

export default function ProfileDrawer({ onNavigate, onLogout }: Props) {
  const { profileDrawerOpen, closeProfileDrawer, openDevPreview } = useUIStore();
  const user = useAuthStore(s => s.user);
  const [mounted, setMounted] = useState(false);
  const insets = useSafeAreaInsets();

  const displayName = user ? fullName(user.firstName, user.lastName) || user.username : '';

  const translateX = useSharedValue(DRAWER_WIDTH);
  const backdropOpacity = useSharedValue(0);

  useEffect(() => {
    if (profileDrawerOpen) {
      setMounted(true);
      translateX.value = withSpring(0, { damping: 26, stiffness: 280, mass: 0.9 });
      backdropOpacity.value = withTiming(1, { duration: 220 });
    } else {
      backdropOpacity.value = withTiming(0, { duration: 200 });
      translateX.value = withTiming(
        DRAWER_WIDTH,
        { duration: 260, easing: Easing.in(Easing.ease) },
        finished => { if (finished) runOnJS(setMounted)(false); },
      );
    }
  }, [profileDrawerOpen]);

  const drawerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  if (!mounted) return null;

  return (
    <Modal visible transparent animationType="none" onRequestClose={closeProfileDrawer} statusBarTranslucent>
      <View style={StyleSheet.absoluteFill}>
        {/* Dimmed backdrop */}
        <Animated.View style={[StyleSheet.absoluteFill, backdropStyle, styles.backdrop]}>
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            onPress={closeProfileDrawer}
            activeOpacity={1}
          />
        </Animated.View>

        {/* Drawer panel */}
        <Animated.View
          style={[
            styles.drawer,
            drawerStyle,
            { paddingTop: insets.top, paddingBottom: insets.bottom + 16 },
          ]}
        >
          {/* User header */}
          <TouchableOpacity
            style={styles.userHeader}
            onPress={() => { closeProfileDrawer(); onNavigate?.('profile'); }}
            activeOpacity={0.85}
          >
            <Image
              source={user?.avatarUrl ? { uri: user.avatarUrl } : PLACEHOLDER_AVATAR}
              style={styles.avatar}
            />
            <View style={styles.userText}>
              <Text style={styles.userName}>{displayName}</Text>
              <Text style={styles.userEmail} numberOfLines={1}>{user?.email}</Text>
            </View>
          </TouchableOpacity>

          {/* Primary nav */}
          <View style={styles.section}>
            {PRIMARY_ITEMS.map(({ icon: Icon, label, key }) => (
              <TouchableOpacity
                key={key}
                style={styles.menuItem}
                onPress={() => { closeProfileDrawer(); onNavigate?.(key); }}
                activeOpacity={0.7}
              >
                <Icon size={20} color="#1A1A1A" strokeWidth={1.8} />
                <Text style={styles.menuLabel}>{label}</Text>
                <ArrowUpRight size={18} color="#2A5C40" strokeWidth={2} style={styles.arrow} />
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.divider} />

          {/* Secondary nav */}
          <View style={styles.section}>
            {SECONDARY_ITEMS.map(({ icon: Icon, label, key }) => (
              <TouchableOpacity
                key={key}
                style={styles.menuItem}
                onPress={() => {
                  closeProfileDrawer();
                  if (key === 'logout') onLogout?.();
                  else if (key === 'dev-preview') openDevPreview();
                  else onNavigate?.(key);
                }}
                activeOpacity={0.7}
              >
                <Icon size={20} color="#1A1A1A" strokeWidth={1.8} />
                <Text style={styles.menuLabel}>{label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  drawer: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: -4, height: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 20,
  },

  // User header
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#111111',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    padding: 16,
    borderRadius: 14,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  userText: {
    flex: 1,
    gap: 3,
  },
  userName: {
    fontSize: 16,
    fontWeight: '400',
    fontFamily: 'Roboto_400Bold',
    color: '#FFFFFF',
  },
  userEmail: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    fontFamily: 'Roboto_400Regular',
  },

  // Menu
  section: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 16,
    paddingVertical: 18,
  },
  menuLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '400',
    fontFamily: 'Roboto_400Regular',
    color: '#1A1A1A',
  },
  arrow: {
    marginLeft: 'auto',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 24,
    marginVertical: 4,
  },
});
