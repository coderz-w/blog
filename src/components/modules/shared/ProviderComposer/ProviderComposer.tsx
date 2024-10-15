import React from 'react';
import type { ReactElement, ReactNode } from 'react';

interface ProviderComposerProps {
  contexts: ReactElement[];
  children: React.ReactNode;
}

const ProviderComposer: React.FC<ProviderComposerProps> = ({ contexts, children }) => {
  return contexts.reduceRight((kids: ReactNode, parent: ReactElement) => {
    return React.cloneElement(parent, { children: kids });
  }, children);
};

export default ProviderComposer;
