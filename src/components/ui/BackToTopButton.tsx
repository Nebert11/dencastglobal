import { useEffect, useState } from 'react';
import { ChevronUp } from 'lucide-react';

const SHOW_AFTER_SCROLL_Y = 320;

export default function BackToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > SHOW_AFTER_SCROLL_Y);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Back to top"
      className={[
        'fixed bottom-6 right-6 z-50 h-11 w-11 rounded-full',
        'bg-[#25408F] text-white shadow-lg shadow-black/20',
        'transition-all duration-300 hover:bg-[#004a8d] hover:-translate-y-0.5',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25408F] focus-visible:ring-offset-2',
        visible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
      ].join(' ')}
    >
      <ChevronUp size={20} className="mx-auto" />
    </button>
  );
}
