import { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const sizes = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl' };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ visibility: isOpen ? 'visible' : 'hidden', pointerEvents: isOpen ? 'auto' : 'none' }}
    >
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        style={{ opacity: isOpen ? 1 : 0, transition: 'opacity 0.2s ease' }}
        onClick={onClose}
      />
      <div
        className={`relative bg-white rounded-2xl shadow-xl w-full ${sizes[size]}`}
        style={{
          opacity: isOpen ? 1 : 0,
          transform: isOpen ? 'translateY(0)' : 'translateY(16px)',
          transition: 'opacity 0.25s ease, transform 0.25s ease',
        }}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-900 font-display">{title}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}