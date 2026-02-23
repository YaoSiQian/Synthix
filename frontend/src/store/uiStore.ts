import { create } from 'zustand';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
}

interface UIState {
  // Notifications
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: number) => void;
  clearNotifications: () => void;
  
  // Sidebar state (mobile)
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  
  // Loading states
  globalLoading: boolean;
  setGlobalLoading: (loading: boolean) => void;
  
  // Modal states
  activeModal: string | null;
  modalData: unknown;
  openModal: (modalId: string, data?: unknown) => void;
  closeModal: () => void;
}

let notificationId = 0;

export const useUIStore = create<UIState>((set, get) => ({
  // Initial state
  notifications: [],
  sidebarOpen: false,
  globalLoading: false,
  activeModal: null,
  modalData: null,
  
  // Notification actions
  addNotification: (notification) => {
    const id = ++notificationId;
    set((state) => ({
      notifications: [...state.notifications, { ...notification, id }],
    }));
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      get().removeNotification(id);
    }, 5000);
  },
  
  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
  },
  
  clearNotifications: () => {
    set({ notifications: [] });
  },
  
  // Sidebar actions
  setSidebarOpen: (open) => {
    set({ sidebarOpen: open });
  },
  
  toggleSidebar: () => {
    set((state) => ({ sidebarOpen: !state.sidebarOpen }));
  },
  
  // Loading actions
  setGlobalLoading: (loading) => {
    set({ globalLoading: loading });
  },
  
  // Modal actions
  openModal: (modalId, data) => {
    set({ activeModal: modalId, modalData: data });
  },
  
  closeModal: () => {
    set({ activeModal: null, modalData: null });
  },
}));
