import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ChevronDown, ChevronUp } from 'lucide-react-native';

interface Props {
  question: string;
  answer: string;
}

export default function FAQAccordionItem({ question, answer }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <View className="border-b border-hairline">
      <TouchableOpacity
        onPress={() => setOpen(v => !v)}
        activeOpacity={0.7}
        className="flex-row items-center justify-between py-4"
      >
        <Text className="mr-3 flex-1 font-roboto text-base text-brand">{question}</Text>
        {open ? (
          <ChevronUp size={20} color="#1A1A1A" strokeWidth={2} />
        ) : (
          <ChevronDown size={20} color="#1A1A1A" strokeWidth={2} />
        )}
      </TouchableOpacity>

      {open && (
        <Text className="pb-4 font-roboto text-sm leading-6 text-muted">{answer}</Text>
      )}
    </View>
  );
}
