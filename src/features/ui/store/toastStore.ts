import { create } from 'zustand';

export type ToastType = 'success' | 'error';

interface ToastState {
  visible: boolean;
  message: string;
  type: ToastType;
  showToast: (message: string, type?: ToastType) => void;
  hideToast: () => void;
}

const TOAST_DURATION_MS = 3000;

let hideTimer: ReturnType<typeof setTimeout> | null = null;

export const useToastStore = create<ToastState>(set => ({
  visible: false,
  message: '',
  type: 'success',

  showToast: (message, type = 'success') => {
    if (hideTimer) clearTimeout(hideTimer);
    set({ visible: true, message, type });
    hideTimer = setTimeout(() => set({ visible: false }), TOAST_DURATION_MS);
  },

  hideToast: () => {
    if (hideTimer) clearTimeout(hideTimer);
    set({ visible: false });
  },
}));
