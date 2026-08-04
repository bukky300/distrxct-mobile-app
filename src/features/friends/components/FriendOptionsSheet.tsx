import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Share } from 'react-native';
import { Share2, UserMinus, Ban } from 'lucide-react-native';
import BottomSheet from '@components/ui/BottomSheet';
import ConfirmUnfriendOrBlockSheet from './ConfirmUnfriendOrBlockSheet';

interface Props {
  visible: boolean;
  onClose: () => void;
  friendId: string;
  friendName: string;
}

export default function FriendOptionsSheet({ visible, onClose, friendId, friendName }: Props) {
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [isBlock, setIsBlock] = useState(false);

  async function handleShare() {
    onClose();
    try {
      await Share.share({ message: `distrxct://friends/${friendId}` });
    } catch {
      // user cancelled the share sheet — nothing to do
    }
  }

  function openConfirm(block: boolean) {
    setIsBlock(block);
    onClose();
    setConfirmVisible(true);
  }

  return (
    <>
      <BottomSheet visible={visible} onClose={onClose}>
        <View style={styles.list}>
          <TouchableOpacity style={styles.item} onPress={handleShare} activeOpacity={0.65}>
            <Share2 size={18} color="#1A1A1A" strokeWidth={2} />
            <Text style={styles.itemText}>Share</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.item} onPress={() => openConfirm(false)} activeOpacity={0.65}>
            <UserMinus size={18} color="#1A1A1A" strokeWidth={2} />
            <Text style={styles.itemText}>Unfriend</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.item} onPress={() => openConfirm(true)} activeOpacity={0.65}>
            <Ban size={18} color="#DC2626" strokeWidth={2} />
            <Text style={[styles.itemText, styles.dangerText]}>Block</Text>
          </TouchableOpacity>
        </View>
      </BottomSheet>

      <ConfirmUnfriendOrBlockSheet
        visible={confirmVisible}
        onClose={() => setConfirmVisible(false)}
        friendName={friendName}
        isBlock={isBlock}
      />
    </>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  itemText: {
    fontSize: 15,
    fontFamily: 'Roboto_400Bold',
    color: '#1A1A1A',
  },
  dangerText: {
    color: '#DC2626',
  },
});
