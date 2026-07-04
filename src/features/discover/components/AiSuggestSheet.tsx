import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Globe, X, Send } from 'lucide-react-native';
import BottomSheet from '@components/ui/BottomSheet';

const MAX_LENGTH = 3000;

interface Props {
  visible: boolean;
  onClose: () => void;
  onSubmit: (prompt: string) => void;
}

export default function AiSuggestSheet({ visible, onClose, onSubmit }: Props) {
  const [prompt, setPrompt] = useState('');

  function handleClose() {
    setPrompt('');
    onClose();
  }

  function handleGo() {
    if (!prompt.trim()) return;
    onSubmit(prompt.trim());
    setPrompt('');
  }

  return (
    <BottomSheet visible={visible} onClose={handleClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Globe size={18} color="#7C7212" strokeWidth={2} />
          <Text style={styles.title}>I can assist you, what are looking for ?</Text>
          <TouchableOpacity onPress={handleClose} style={styles.closeBtn} activeOpacity={0.7}>
            <X size={16} color="#1A1A1A" strokeWidth={2} />
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.textarea}
          placeholder="Write here"
          placeholderTextColor="#9CA3AF"
          value={prompt}
          onChangeText={text => setPrompt(text.slice(0, MAX_LENGTH))}
          multiline
          numberOfLines={6}
          textAlignVertical="top"
          maxLength={MAX_LENGTH}
        />

        <Text style={styles.counter}>{prompt.length} / {MAX_LENGTH}</Text>

        <TouchableOpacity
          style={[styles.goBtn, !prompt.trim() && styles.goBtnDisabled]}
          onPress={handleGo}
          activeOpacity={0.8}
          disabled={!prompt.trim()}
        >
          <Text style={styles.goText}>Go</Text>
          <Send size={14} color="#7C7212" strokeWidth={2} />
        </TouchableOpacity>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    gap: 14,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  title: {
    flex: 1,
    fontSize: 15,
    fontWeight: '400',
    fontFamily: 'Roboto_400Bold',
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
  textarea: {
    backgroundColor: '#F9FAFB',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#1A1A1A',
    fontFamily: 'Roboto_400Regular',
    minHeight: 140,
  },
  counter: {
    alignSelf: 'flex-end',
    fontSize: 12,
    color: '#9CA3AF',
    fontFamily: 'Roboto_400Regular',
    marginTop: -8,
  },
  goBtn: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FBF3D5',
    paddingHorizontal: 22,
    paddingVertical: 11,
    borderRadius: 24,
  },
  goBtnDisabled: {
    opacity: 0.5,
  },
  goText: {
    fontSize: 15,
    fontWeight: '400',
    fontFamily: 'Roboto_400Bold',
    color: '#7C7212',
  },
});
