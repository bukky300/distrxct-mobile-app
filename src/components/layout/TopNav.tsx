import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { Bell, MessageSquare, Menu } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUIStore } from '@features/ui/store/uiStore';

interface Props {
  avatarUri?: string;
}

export default function TopNav({ avatarUri }: Props) {
  const insets = useSafeAreaInsets();
  const openProfileDrawer = useUIStore(s => s.openProfileDrawer);

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
      {/* Logo */}
      <View style={styles.logoRow}>
        <Image
          source={require('../../../assets/images/logo-icon.png')}
          style={styles.logoIcon}
          resizeMode="contain"
        />
        <Text style={styles.logoText}>Distrxct</Text>
      </View>

      {/* Right actions */}
      <View style={styles.actions}>
        {/* Bell with badge */}
        <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7}>
          <Bell size={22} color="#1A1A1A" strokeWidth={1.8} />
          <View style={styles.badge} />
        </TouchableOpacity>

        {/* Messages */}
        <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7}>
          <MessageSquare size={22} color="#1A1A1A" strokeWidth={1.8} />
        </TouchableOpacity>

        {/* Avatar */}
        <TouchableOpacity activeOpacity={0.8}>
          {avatarUri ? (
            <Image source={{ uri: avatarUri }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder} />
          )}
        </TouchableOpacity>

        {/* Hamburger */}
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={openProfileDrawer}
          activeOpacity={0.7}
        >
          <Menu size={22} color="#1A1A1A" strokeWidth={1.8} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  logoIcon: {
    width: 28,
    height: 28,
  },
  logoText: {
    fontSize: 18,
    fontWeight: '400',
    fontFamily: 'Roboto_400Bold',
    color: '#1A1A1A',
    letterSpacing: -0.3,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  iconBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#DC2626',
    borderWidth: 1,
    borderColor: '#fff',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  avatarPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#D1D5DB',
  },
});
