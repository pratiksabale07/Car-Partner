import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Check } from 'lucide-react';

export default function CustomSelect({ value, onChange, options, className = '', placeholder = 'Select...' }) {
  const [open, setOpen] = useState(false);
  const [dropPos, setDropPos] = useState({ top: 0, left: 0, width: 160 });
  const triggerRef = useRef(null);
  const dropRef = useRef(null);

  const selected = options.find(o => o.value === value);

  // Close on outside click — must check both trigger and portal dropdown
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (
        triggerRef.current && !triggerRef.current.contains(e.target) &&
        dropRef.current && !dropRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const openDropdown = () => {
    if (triggerRef.current) {
      const r = triggerRef.current.getBoundingClientRect();
      const vw = window.innerWidth;
      const dropW = Math.max(r.width, 160);
      // Clamp so the dropdown never overflows the right edge of the viewport
      const left = r.left + dropW > vw ? Math.max(8, vw - dropW - 8) : r.left;
      setDropPos({ top: r.bottom + 6, left, width: dropW });
    }
    setOpen(true);
  };

  const handleSelect = (val) => {
    onChange(val);
    setOpen(false);
  };

  return (
    <div ref={triggerRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => (open ? setOpen(false) : openDropdown())}
        className="w-full flex items-center justify-between gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white hover:bg-white/8 transition-all duration-200 focus:outline-none focus:border-gold-500/50"
      >
        <span className={selected ? 'text-white' : 'text-slate-400'}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          size={14}
          className={`text-slate-400 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && createPortal(
        <div
          ref={dropRef}
          style={{
            position: 'fixed',
            top: dropPos.top,
            left: dropPos.left,
            width: dropPos.width,
            zIndex: 99999,
          }}
          className="bg-slate-900 border border-slate-700/60 rounded-xl shadow-glass overflow-hidden animate-fade-in"
        >
          <div className="max-h-60 overflow-y-auto py-1">
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleSelect(opt.value)}
                className={`w-full flex items-center justify-between px-4 py-2.5 text-sm text-left transition-all duration-150 ${
                  value === opt.value
                    ? 'bg-gold-500/15 text-gold-400'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                {opt.label}
                {value === opt.value && <Check size={13} className="text-gold-400 flex-shrink-0" />}
              </button>
            ))}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
