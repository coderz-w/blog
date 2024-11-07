export interface mainArticleStoreState {
  offsetHeight: number;
  Element: HTMLElement | null;
}

export const mainArticleStoreInitialState: mainArticleStoreState = {
  offsetHeight: 1000,
  Element: null,
};
