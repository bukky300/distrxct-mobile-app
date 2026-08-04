import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { UserMinus } from 'lucide-react-native';
import BottomSheet from '@components/ui/BottomSheet';

interface Props {
  visible: boolean;
  onClose: () => void;
  friendName: string;
  isBlock: boolean;
}

// UI-only, matching the web app: Unfriend/Block has no backend mutation wired up yet.
export default function ConfirmUnfriendOrBlockSheet({ visible, onClose, friendName, isBlock }: Props) {
  const actionLabel = isBlock ? 'Block' : 'Unfriend';

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View style={styles.iconWrap}>
        <View style={styles.iconCircleOuter}>
          <View style={styles.iconCircleInner}>
            <UserMinus size={24} color="#DC2626" strokeWidth={2} />
          </View>
        </View>
      </View>

      <Text style={styles.title}>{isBlock ? 'Block' : 'Remove'} Friend?</Text>
      <Text style={styles.description}>
        Are you sure you want to {isBlock ? 'block' : 'remove'} <Text style={styles.name}>{friendName}</Text>?
      </Text>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.confirmBtn} onPress={onClose} activeOpacity={0.85}>
          <Text style={styles.confirmText}>{actionLabel}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelBtn} onPress={onClose} activeOpacity={0.7}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  iconWrap: {
    alignItems: 'center',
    paddingTop: 8,
    marginBottom: 16,
  },
  iconCircleOuter: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircleInner: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FECACA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontFamily: 'Roboto_700Bold',
    color: '#1A1A1A',
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: '#4B5563',
    fontFamily: 'Roboto_400Regular',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 24,
  },
  name: {
    fontFamily: 'Roboto_700Bold',
    color: '#1A1A1A',
  },
  actions: {
    paddingHorizontal: 20,
    marginTop: 24,
    gap: 12,
  },
  confirmBtn: {
    height: 50,
    borderRadius: 12,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmText: {
    fontSize: 15,
    fontFamily: 'Roboto_400Bold',
    color: '#FFFFFF',
  },
  cancelBtn: {
    height: 50,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: {
    fontSize: 15,
    fontFamily: 'Roboto_400Bold',
    color: '#1A1A1A',
  },
});
