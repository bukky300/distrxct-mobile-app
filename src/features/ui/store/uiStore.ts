import { create } from 'zustand';

interface UIState {
  profileDrawerOpen: boolean;
  postSheetOpen: boolean;
  devPreviewOpen: boolean;
  openProfileDrawer: () => void;
  closeProfileDrawer: () => void;
  openPostSheet: () => void;
  closePostSheet: () => void;
  openDevPreview: () => void;
  closeDevPreview: () => void;
}

export const useUIStore = create<UIState>(set => ({
  profileDrawerOpen: false,
  postSheetOpen: false,
  devPreviewOpen: false,
  openProfileDrawer: () => set({ profileDrawerOpen: true }),
  closeProfileDrawer: () => set({ profileDrawerOpen: false }),
  openPostSheet: () => set({ postSheetOpen: true }),
  closePostSheet: () => set({ postSheetOpen: false }),
  openDevPreview: () => set({ devPreviewOpen: true }),
  closeDevPreview: () => set({ devPreviewOpen: false }),
}));
