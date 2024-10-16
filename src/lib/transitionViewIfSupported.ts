const transitionViewIfSupported = (updateCb: () => any) => {
  if (window.matchMedia(`(prefers-reduced-motion: reduce)`).matches) {
    updateCb();

    return;
  }

  if (document.startViewTransition) {
    document.startViewTransition(updateCb);
  } else {
    updateCb();
  }
};

export default transitionViewIfSupported;

declare global {
  interface Document {
    startViewTransition: (cb: any) => void;
  }
}
