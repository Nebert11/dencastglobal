import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface LightboxImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  caption?: string;
  /** Extra classes applied to the button wrapper (e.g. "w-full h-full") */
  wrapperClassName?: string;
}

const LightboxImage: React.FC<LightboxImageProps> = ({
  caption,
  wrapperClassName = '',
  className = '',
  ...imgProps
}) => {
  const [open, setOpen] = useState(false);
  const label = caption ?? (typeof imgProps.alt === 'string' ? imgProps.alt : 'Image');

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`block cursor-zoom-in ${wrapperClassName}`}
        aria-label={`View ${label} fullscreen`}
      >
        <img {...imgProps} className={className} />
      </button>

      {open && createPortal(
        <div
          className="fixed inset-0 z-[200] bg-black/55 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={label}
        >
          <div
            className="relative w-full max-w-[1400px] h-[72vh] sm:w-[80vw] sm:h-[80vh] rounded-3xl overflow-hidden bg-black shadow-2xl shadow-black/60 border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between gap-4 p-4 sm:p-6 bg-gradient-to-b from-black/75 via-black/30 to-transparent text-white/80">
              <p className="text-sm sm:text-base font-semibold">{label}</p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                aria-label="Close image viewer"
              >
                <X size={18} />
              </button>
            </div>
            <div className="relative w-full h-full bg-black">
              <img
                src={imgProps.src}
                alt={typeof imgProps.alt === 'string' ? imgProps.alt : ''}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>,
        document.body,
      )}
    </>
  );
};

export default LightboxImage;
