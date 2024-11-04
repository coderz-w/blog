import { create } from 'zustand';

import { type postLayoutRightSideState, postLayoutRightSideInitialState } from './initialState';

interface postLayoutRightStoreAction {
  setElement: (element: HTMLDivElement) => void;
  resetElement: () => void;
}

export type postLayoutRightStore = postLayoutRightSideState & postLayoutRightStoreAction;

export const usePostLayoutRightStore = create<postLayoutRightStore>((set) => ({
  ...postLayoutRightSideInitialState,
  setElement: (element) => set(() => ({ Element: element })),
  resetElement: () => set(() => ({ Element: null })),
}));
