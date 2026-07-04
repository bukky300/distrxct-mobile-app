import { create } from 'zustand';

interface UIState {
  profileDrawerOpen: boolean;
  postSheetOpen: boolean;
  openProfileDrawer: () => void;
  closeProfileDrawer: () => void;
  openPostSheet: () => void;
  closePostSheet: () => void;
}

export const useUIStore = create<UIState>(set => ({
  profileDrawerOpen: false,
  postSheetOpen: false,
  openProfileDrawer: () => set({ profileDrawerOpen: true }),
  closeProfileDrawer: () => set({ profileDrawerOpen: false }),
  openPostSheet: () => set({ postSheetOpen: true }),
  closePostSheet: () => set({ postSheetOpen: false }),
}));
