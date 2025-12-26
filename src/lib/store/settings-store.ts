"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface SettingsState {
  apiKey: string | null;
  isKeyValidated: boolean;

  setApiKey: (key: string) => void;
  setKeyValidated: (validated: boolean) => void;
  clearApiKey: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      apiKey: null,
      isKeyValidated: false,

      setApiKey: (key) => set({ apiKey: key }),
      setKeyValidated: (validated) => set({ isKeyValidated: validated }),
      clearApiKey: () => set({ apiKey: null, isKeyValidated: false }),
    }),
    {
      name: "storyforge-settings",
    }
  )
);
