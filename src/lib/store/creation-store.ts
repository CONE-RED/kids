"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CreationState {
  childName: string;
  childAge: number;
  parentName: string;
  childAppearance: string; // New: description of child's appearance
  artStyle: string;
  topic: string;
  customTopic: string;
  isCustomTopic: boolean;

  setChildName: (name: string) => void;
  setChildAge: (age: number) => void;
  setParentName: (name: string) => void;
  setChildAppearance: (appearance: string) => void;
  setArtStyle: (style: string) => void;
  setTopic: (topic: string, isCustom?: boolean) => void;
  setCustomTopic: (topic: string) => void;
  reset: () => void;
}

const initialState = {
  childName: "",
  childAge: 6,
  parentName: "",
  childAppearance: "",
  artStyle: "",
  topic: "",
  customTopic: "",
  isCustomTopic: false,
};

export const useCreationStore = create<CreationState>()(
  persist(
    (set) => ({
      ...initialState,

      setChildName: (name) => set({ childName: name }),
      setChildAge: (age) => set({ childAge: age }),
      setParentName: (name) => set({ parentName: name }),
      setChildAppearance: (appearance) => set({ childAppearance: appearance }),
      setArtStyle: (style) => set({ artStyle: style }),
      setTopic: (topic, isCustom = false) =>
        set({ topic, isCustomTopic: isCustom, customTopic: isCustom ? topic : "" }),
      setCustomTopic: (topic) =>
        set({ customTopic: topic, topic: topic, isCustomTopic: true }),
      reset: () => set(initialState),
    }),
    {
      name: "storyforge-creation",
    }
  )
);
