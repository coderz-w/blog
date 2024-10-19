'use client';

import type { HTMLMotionProps } from 'framer-motion';
import { motion } from 'framer-motion';
import { forwardRef } from 'react';

export const MotionButtonBase = forwardRef<HTMLButtonElement, HTMLMotionProps<'button'>>(
  ({ children, ...rest }, ref) => {
    return (
      <motion.button
        initial={true}
        whileFocus={{ scale: 1.02 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.95 }}
        {...rest}
        ref={ref}
      >
        {children}
      </motion.button>
    );
  },
);

MotionButtonBase.displayName = 'MotionButtonBase';
