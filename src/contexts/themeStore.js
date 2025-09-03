import { create } from 'zustand';

export const useThemeStore = create((set) => ({
  theme: 'light',
  themes: ['light', 'dark', 'blue', 'green', 'purple'],
  setTheme: (theme) => set({ theme }),
  nextTheme: () => set((state) => {
    const idx = state.themes.indexOf(state.theme);
    return { theme: state.themes[(idx + 1) % state.themes.length] };
  }),
}));
