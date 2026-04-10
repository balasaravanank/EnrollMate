import { create } from "zustand";

export const useThemeStore = create((set) => ({
  isDarkMode: (() => {
    const saved = localStorage.getItem("enrollmate-theme");
    if (saved) return saved === "dark";
    // Check system preference if no saved theme
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  })(),

  toggleTheme: () => set((state) => {
    const newTheme = !state.isDarkMode;
    localStorage.setItem("enrollmate-theme", newTheme ? "dark" : "light");
    if (newTheme) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    return { isDarkMode: newTheme };
  }),

  initTheme: () => {
    const isDark = useThemeStore.getState().isDarkMode;
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }
}));
