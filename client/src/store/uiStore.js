import { create } from 'zustand';

export const useUiStore = create((set) => ({
  sidebarOpen: true,
  viewMode: localStorage.getItem('viewMode') || 'grid', // 'grid' | 'list'
  theme: localStorage.getItem('theme') || 'light', // 'light' | 'dark'

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  
  setViewMode: (mode) => {
    localStorage.setItem('viewMode', mode);
    set({ viewMode: mode });
  },

  toggleTheme: () => set((state) => {
    const nextTheme = state.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', nextTheme);
    return { theme: nextTheme };
  }),
}));
