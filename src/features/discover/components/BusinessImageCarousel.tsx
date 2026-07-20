import React, { useRef, useState } from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  FlatList,
  Dimensions,
  StyleSheet,
  type ImageSourcePropType,
  type NativeSyntheticEvent,
  type NativeScrollEvent,
} from 'react-native';
import { ChevronLeft, ChevronRight, Image as ImageIcon, ArrowUpRight } from 'lucide-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IMAGE_HEIGHT = 280;

interface Props {
  images: ImageSourcePropType[];
  totalCount?: number;
  onViewAll?: () => void;
}

export default function BusinessImageCarousel({ images, totalCount, onViewAll }: Props) {
  const [index, setIndex] = useState(0);
  const listRef = useRef<FlatList<ImageSourcePropType>>(null);

  function goTo(next: number) {
    const clamped = Math.max(0, Math.min(images.length - 1, next));
    listRef.current?.scrollToIndex({ index: clamped, animated: true });
    setIndex(clamped);
  }

  function handleMomentumEnd(e: NativeSyntheticEvent<NativeScrollEvent>) {
    const newIndex = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setIndex(newIndex);
  }

  return (
    <View style={styles.wrapper}>
      <FlatList
        ref={listRef}
        data={images}
        keyExtractor={(_, i) => String(i)}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleMomentumEnd}
        renderItem={({ item }) => (
          <Image source={item} style={styles.image} resizeMode="cover" />
        )}
      />

      {images.length > 1 && (
        <>
          <TouchableOpacity
            style={[styles.arrowBtn, styles.arrowLeft]}
            onPress={() => goTo(index - 1)}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Previous photo"
          >
            <ChevronLeft size={18} color="#1A1A1A" strokeWidth={2.2} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.arrowBtn, styles.arrowRight]}
            onPress={() => goTo(index + 1)}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Next photo"
          >
            <ChevronRight size={18} color="#1A1A1A" strokeWidth={2.2} />
          </TouchableOpacity>

          <View style={styles.dots}>
            {images.map((_, i) => (
              <View key={i} style={[styles.dot, i === index && styles.dotActive]} />
            ))}
          </View>
        </>
      )}

      <TouchableOpacity style={styles.viewAllPill} onPress={onViewAll} activeOpacity={0.8}>
        <ImageIcon size={13} color="#1A1A1A" strokeWidth={2} />
        <Text style={styles.viewAllText}>View all image ({totalCount ?? images.length})</Text>
        <ArrowUpRight size={13} color="#1A1A1A" strokeWidth={2} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    height: IMAGE_HEIGHT,
  },
  image: {
    width: SCREEN_WIDTH,
    height: IMAGE_HEIGHT,
  },
  arrowBtn: {
    position: 'absolute',
    top: IMAGE_HEIGHT / 2 - 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowLeft: { left: 12 },
  arrowRight: { right: 12 },
  dots: {
    position: 'absolute',
    bottom: 14,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 5,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  dotActive: {
    width: 14,
    backgroundColor: '#FFFFFF',
  },
  viewAllPill: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,255,255,0.92)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
  },
  viewAllText: {
    fontSize: 12,
    fontFamily: 'Roboto_400Bold',
    color: '#1A1A1A',
  },
});
