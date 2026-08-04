import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { ArrowRight, X } from 'lucide-react-native';
import BottomSheet from '@components/ui/BottomSheet';

interface Props {
  visible: boolean;
  onClose: () => void;
  recipientName: string;
}

// UI-only, matching the web app: there is no send mutation wired up on the backend yet.
export default function MessageComposeSheet({ visible, onClose, recipientName }: Props) {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  function handleClose() {
    setMessage('');
    setError('');
    onClose();
  }

  function handleSend() {
    if (message.trim().length < 1) {
      setError('Please write a message before sending');
      return;
    }
    handleClose();
  }

  return (
    <BottomSheet visible={visible} onClose={handleClose}>
      <View style={styles.header}>
        <Text style={styles.title}>New Message</Text>
        <TouchableOpacity onPress={handleClose} style={styles.closeBtn} activeOpacity={0.7}>
          <X size={18} color="#1A1A1A" strokeWidth={2} />
        </TouchableOpacity>
      </View>

      <Text style={styles.subtitle}>
        Send a message to <Text style={styles.recipientName}>{recipientName}</Text>
      </Text>

      <View style={styles.body}>
        <TextInput
          style={styles.textarea}
          placeholder="Write your message..."
          placeholderTextColor="#9CA3AF"
          value={message}
          onChangeText={text => {
            setMessage(text);
            setError('');
          }}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
        {error.length > 0 && <Text style={styles.error}>{error}</Text>}

        <TouchableOpacity style={styles.sendBtn} onPress={handleSend} activeOpacity={0.8}>
          <Text style={styles.sendText}>Send</Text>
          <ArrowRight size={16} color="#FFFFFF" strokeWidth={2} />
        </TouchableOpacity>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Roboto_700Bold',
    color: '#1A1A1A',
  },
  closeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitle: {
    paddingHorizontal: 20,
    fontSize: 14,
    color: '#4B5563',
    fontFamily: 'Roboto_400Regular',
    marginBottom: 12,
  },
  recipientName: {
    fontFamily: 'Roboto_700Bold',
    color: '#1A1A1A',
  },
  body: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    gap: 10,
  },
  textarea: {
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 12,
    fontSize: 15,
    color: '#1A1A1A',
    minHeight: 100,
  },
  error: {
    fontSize: 13,
    color: '#DC2626',
    fontFamily: 'Roboto_400Regular',
  },
  sendBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#2A5C40',
  },
  sendText: {
    fontSize: 15,
    fontFamily: 'Roboto_400Bold',
    color: '#FFFFFF',
  },
});
