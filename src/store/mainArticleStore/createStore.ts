import { create } from 'zustand';

import { type mainArticleStoreState, mainArticleStoreInitialState } from './initialState';

interface mainArticleStoreAction {
  setOffsetHeight: (h: number) => void;
  resetOffsetHeight: () => void;
  setElement: (ele: HTMLElement) => void;
  resetElement: () => void;
}

export type mainArticleStore = mainArticleStoreState & mainArticleStoreAction;

export const useMainArticleStore = create<mainArticleStore>((set) => ({
  ...mainArticleStoreInitialState,
  setOffsetHeight: (h) => set(() => ({ offsetHeight: h })),
  resetOffsetHeight: () => set(() => ({ offsetHeight: 1000 })),
  setElement: (ele) => set(() => ({ Element: ele })),
  resetElement: () => set(() => ({ Element: null })),
}));
