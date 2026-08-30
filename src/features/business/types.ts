export interface MediaItem {
  original: string | null;
  thumbnail: string | null;
  medium: string | null;
}

export interface StoreCategoryOption {
  id: string;
  name: string;
}

export interface StoreTypeOption {
  id: string;
  name: string;
  categories: StoreCategoryOption[];
}

/** A picked leaf category, plus its parent type — everything a submit needs. */
export interface BusinessTypeSelection {
  storeTypeId: string;
  storeTypeName: string;
  categoryId: string;
  categoryName: string;
}

export interface Business {
  id: string;
  name: string;
  description: string | null;
  instagram_url: string | null;
  tictok_url: string | null;
  whatsapp_number: string | null;
  email: string | null;
  timezone: string | null;
  open_hour: string | null;
  close_hour: string | null;
  owner_id: string;
  logo: MediaItem | null;
  media_url: MediaItem[] | null;
  location: { id: string; formattedAddress: string | null } | null;
  store_type: { id: string; name: string } | null;
  store_categories: StoreCategoryOption[];
}
