import { create } from 'zustand';

export type CreateSheetMode = 'choice' | 'post' | 'review';

interface UIState {
  profileDrawerOpen: boolean;
  createSheetOpen: boolean;
  createSheetMode: CreateSheetMode;
  devPreviewOpen: boolean;
  openProfileDrawer: () => void;
  closeProfileDrawer: () => void;
  openCreateSheet: (mode?: CreateSheetMode) => void;
  closeCreateSheet: () => void;
  openDevPreview: () => void;
  closeDevPreview: () => void;
}

export const useUIStore = create<UIState>(set => ({
  profileDrawerOpen: false,
  createSheetOpen: false,
  createSheetMode: 'choice',
  devPreviewOpen: false,
  openProfileDrawer: () => set({ profileDrawerOpen: true }),
  closeProfileDrawer: () => set({ profileDrawerOpen: false }),
  openCreateSheet: (mode = 'choice') => set({ createSheetOpen: true, createSheetMode: mode }),
  closeCreateSheet: () => set({ createSheetOpen: false }),
  openDevPreview: () => set({ devPreviewOpen: true }),
  closeDevPreview: () => set({ devPreviewOpen: false }),
}));
