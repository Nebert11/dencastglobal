import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

interface PageTransitionProps {
  children: React.ReactNode;
  /** Override the animation key (defaults to current pathname). */
  pageKey?: string;
}

const variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
};

/**
 * Wrap a page component with this to get smooth fade-in transitions.
 *
 * Usage:
 * ```tsx
 * <PageTransition>
 *   <YourPageContent />
 * </PageTransition>
 * ```
 */
const PageTransition: React.FC<PageTransitionProps> = ({ children, pageKey }) => {
  const location = useLocation();
  const key = pageKey ?? location.pathname;

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={key}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="will-change-[opacity,transform]"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default PageTransition;
