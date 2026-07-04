import { create } from "zustand";

type DebugStore = {
  rawMessages: string[];
  addRawMessage: (message: string) => void;
  addRawMessages: (messages: string[], limit?: number) => void;
  clearRawMessages: () => void;
};

export const useDebugStore = create<DebugStore>((set) => ({
  rawMessages: [],

  addRawMessage: (message) =>
    set((state) => ({
      rawMessages: [message, ...state.rawMessages].slice(0, 100),
    })),

  addRawMessages: (messages, limit = 100) =>
    set((state) => ({
      rawMessages: [...messages, ...state.rawMessages].slice(0, limit),
    })),

  clearRawMessages: () =>
    set({
      rawMessages: [],
    }),
}));
