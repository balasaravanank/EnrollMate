import { create } from "zustand";
import { persist } from "zustand/middleware";

// Tracks the first-time guided tour state.
// `completed` persists so the tour only auto-runs once per browser.
export const useTourStore = create(
  persist(
    (set) => ({
      isActive: false,
      stepIndex: 0,
      completed: false,

      startTour: () => set({ isActive: true, stepIndex: 0 }),
      nextStep: () => set((s) => ({ stepIndex: s.stepIndex + 1 })),
      prevStep: () =>
        set((s) => ({ stepIndex: Math.max(0, s.stepIndex - 1) })),
      goToStep: (i) => set({ stepIndex: i }),
      endTour: () => set({ isActive: false, completed: true, stepIndex: 0 }),

      // Lets users replay the tour from a help button.
      resetTour: () => set({ isActive: true, completed: false, stepIndex: 0 }),
    }),
    {
      name: "enrollmate-tour",
      partialize: (state) => ({ completed: state.completed }),
    }
  )
);
