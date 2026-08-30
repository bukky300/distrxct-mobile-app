import React from 'react';
import { View, Text, Image } from 'react-native';
import BusinessCardHeader from './BusinessCardHeader';
import type { MediaItem } from '../types';

interface Props {
  images: MediaItem[];
  onEdit: () => void;
}

export default function GalleryCard({ images, onEdit }: Props) {
  return (
    <View className="mb-4 rounded-2xl border border-hairline bg-white p-4">
      <BusinessCardHeader title="Business Gallery" onEdit={onEdit} />
      <Text className="mb-3 font-roboto text-sm text-muted-light">
        Businesses with more than 5 images stand out more
      </Text>

      {images.length > 0 ? (
        <View className="flex-row flex-wrap gap-3">
          {images.map((image, i) => (
            <Image
              key={image.original ?? i}
              source={{ uri: image.medium ?? image.original ?? undefined }}
              className="aspect-square w-[47%] rounded-xl"
            />
          ))}
        </View>
      ) : (
        <Text className="font-roboto text-base text-muted-light">No images yet.</Text>
      )}
    </View>
  );
}
