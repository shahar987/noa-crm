'use client';

import { useEffect, useRef } from 'react';
import type { LucideIcon } from 'lucide-react';

// ── Avatar ────────────────────────────────────────────────────────────────────
const HUES = ['#e69cba', '#d8a799', '#c4a063', '#d97a9f', '#cf93b8'];

export function Avatar({ name, size = 44 }: { name: string; size?: number }) {
  const initials = (name || '?').trim().split(/\s+/).slice(0, 2).map(w => w[0]).join('');
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h + name.charCodeAt(i)) % HUES.length;
  return (
    <span
      className="inline-flex items-center justify-center rounded-full text-white font-semibold shadow-royal-sm select-none flex-none"
      style={{
        width: size, height: size, fontSize: size * 0.36,
        background: `linear-gradient(135deg, ${HUES[h]}, ${HUES[(h + 2) % HUES.length]})`,
      }}
    >
      {initials}
    </span>
  );
}

// ── Button ────────────────────────────────────────────────────────────────────
const BASE = 'inline-flex items-center justify-center gap-2 font-semibold rounded-2xl transition-all duration-200 active:scale-[.97] focus:outline-none focus-visible:ring-4 focus-visible:ring-blush-200 disabled:opacity-50 disabled:pointer-events-none';
const SIZES = {
  sm: 'text-sm px-3.5 py-2',
  md: 'text-[15px] px-5 py-2.5',
  lg: 'text-base px-6 py-3',
};
const VARIANTS = {
  primary: 'text-white shadow-royal-sm hover:shadow-royal bg-gradient-to-br from-blush-500 to-rosegold-500 hover:from-blush-600 hover:to-rosegold-600',
  soft:    'bg-blush-100 text-berry-700 hover:bg-blush-200',
  ghost:   'text-berry-700/70 hover:text-berry-800 hover:bg-blush-100',
  outline: 'border border-blush-200 text-berry-700 bg-white/70 hover:bg-blush-50 hover:border-blush-300',
  danger:  'bg-rose-50 text-rose-600 hover:bg-rose-100',
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof VARIANTS;
  size?: keyof typeof SIZES;
  Icon?: LucideIcon;
  iconSize?: number;
}

export function Button({
  variant = 'primary', size = 'md', Icon: IconComp, iconSize, children, className = '', ...rest
}: ButtonProps) {
  const sz = iconSize ?? (size === 'sm' ? 16 : size === 'lg' ? 20 : 18);
  return (
    <button className={`${BASE} ${SIZES[size]} ${VARIANTS[variant]} ${className}`} {...rest}>
      {IconComp && <IconComp size={sz} />}
      {children}
    </button>
  );
}

// ── Badge ─────────────────────────────────────────────────────────────────────
const BADGE_TONES = {
  rose:    'bg-rose-50 text-rose-600 ring-rose-200',
  amber:   'bg-amber-50 text-amber-700 ring-amber-200',
  green:   'bg-emerald-50 text-emerald-700 ring-emerald-200',
  blush:   'bg-blush-100 text-berry-700 ring-blush-200',
  gold:    'bg-amber-50 text-gold-600 ring-gold-400/40',
};

export function Badge({
  tone = 'blush', dot = false, children, className = '',
}: { tone?: keyof typeof BADGE_TONES; dot?: boolean; children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ring-1 ring-inset ${BADGE_TONES[tone]} ${className}`}>
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />}
      {children}
    </span>
  );
}

// ── Tag (cream pill) ──────────────────────────────────────────────────────────
export function Tag({ children, onRemove }: { children: React.ReactNode; onRemove?: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[13px] font-medium bg-blush-50 text-berry-700 ring-1 ring-inset ring-blush-200">
      <span className="w-1.5 h-1.5 rounded-full bg-rosegold-400 flex-none" />
      {children}
      {onRemove && (
        <button onClick={onRemove} className="text-berry-700/40 hover:text-rose-500 transition-colors -ml-1">
          <XIcon size={13} />
        </button>
      )}
    </span>
  );
}

// ── Card ──────────────────────────────────────────────────────────────────────
export function Card({ children, className = '', ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`bg-white/85 backdrop-blur-sm rounded-3xl border border-white shadow-royal-sm ${className}`} {...rest}>
      {children}
    </div>
  );
}

// ── Modal ─────────────────────────────────────────────────────────────────────
export function Modal({
  open, onClose, children, max = 'max-w-2xl',
}: { open: boolean; onClose: () => void; children: React.ReactNode; max?: string }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    /*
      Outer layer: fills the viewport and scrolls.
      This means the modal can be any height — it's never clipped.
      Scroll up to reach the header, scroll down to reach the footer.
    */
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop — fixed so it doesn't scroll away */}
      <div
        className="fixed inset-0 bg-berry-900/30 backdrop-blur-sm anim-fade-in"
        onClick={onClose}
      />

      {/*
        Positioning shell:
        • mobile  → items-start  : modal anchors near the top (p-4 safe gap)
        • desktop → items-center : modal centers vertically
        min-h-full ensures the flex container is at least the viewport height
        so items-center works correctly on desktop.
      */}
      <div className="flex min-h-full items-start sm:items-center justify-center p-4 sm:p-6">
        {/*
          Modal card:
          • flex flex-col + max-h-[90vh] → card never taller than 90% of viewport
          • overflow-hidden → clips children at rounded corners
          Children must declare their own flex roles:
            header/footer → flex-none   (always visible)
            body          → flex-1 min-h-0 overflow-y-auto   (scrolls)
        */}
        <div
          className={`
            relative w-full ${max}
            my-4 sm:my-8 anim-scale-in
            flex flex-col
            max-h-[90vh]
            bg-white/90 backdrop-blur-sm
            rounded-3xl border border-white shadow-royal-lg
            overflow-hidden
          `}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export function ModalHeader({
  title, subtitle, onClose, Icon: IconComp,
}: { title: string; subtitle?: string; onClose: () => void; Icon?: LucideIcon }) {
  return (
    <div className="flex-none flex items-start gap-4 px-4 sm:px-7 pt-5 sm:pt-7 pb-4 sm:pb-5 border-b border-blush-100 bg-gradient-to-l from-blush-50/60 to-transparent">
      {IconComp && (
        <span className="grid place-items-center w-11 h-11 rounded-2xl bg-gradient-to-br from-blush-400 to-rosegold-400 text-white shadow-royal-sm flex-none">
          <IconComp size={20} />
        </span>
      )}
      <div className="flex-1 min-w-0">
        <h2 className="font-display text-2xl font-bold text-berry-800 leading-tight">{title}</h2>
        {subtitle && <p className="text-sm text-berry-700/55 mt-0.5">{subtitle}</p>}
      </div>
      <button onClick={onClose} className="grid place-items-center w-9 h-9 rounded-xl text-berry-700/50 hover:text-berry-800 hover:bg-blush-100 transition-colors flex-none">
        <XIcon size={20} />
      </button>
    </div>
  );
}

// ── Field ─────────────────────────────────────────────────────────────────────
export function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="block text-[13px] font-semibold text-berry-700/70 mb-1.5">{label}</span>
      {children}
      {hint && <span className="block text-xs text-berry-700/40 mt-1">{hint}</span>}
    </label>
  );
}

// ── Inputs ────────────────────────────────────────────────────────────────────
export const inputCls = 'w-full rounded-2xl border border-blush-200 bg-white px-4 py-2.5 text-[15px] text-berry-800 placeholder:text-berry-700/30 focus:outline-none focus:border-blush-400 focus:ring-4 focus:ring-blush-100 transition';

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputCls} ${props.className ?? ''}`} />;
}
export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${inputCls} resize-none leading-relaxed ${props.className ?? ''}`} />;
}

// ── StatCard ──────────────────────────────────────────────────────────────────
const ACCENTS = {
  blush:    'from-blush-400 to-rosegold-400',
  gold:     'from-gold-400 to-rosegold-400',
  rosegold: 'from-rosegold-400 to-blush-500',
};

export function StatCard({
  icon: IconComp, label, value, sub, accent = 'blush', delay = 0,
}: { icon: LucideIcon; label: string; value: number; sub?: string; accent?: keyof typeof ACCENTS; delay?: number }) {
  return (
    <Card className="p-6 anim-fade-up hover:shadow-royal hover:-translate-y-0.5 transition-all duration-300" style={{ animationDelay: `${delay}ms` }}>
      <span className={`grid place-items-center w-12 h-12 rounded-2xl text-white shadow-royal-sm bg-gradient-to-br ${ACCENTS[accent]}`}>
        <IconComp size={22} />
      </span>
      <div className="mt-5">
        <div className="font-display text-[2.1rem] font-bold text-berry-800 leading-none tabular-nums">{value}</div>
        <div className="text-[15px] font-semibold text-berry-700/80 mt-2">{label}</div>
        {sub && <div className="text-[13px] text-berry-700/45 mt-1">{sub}</div>}
      </div>
    </Card>
  );
}

// ── EmptyState ────────────────────────────────────────────────────────────────
export function EmptyState({ icon: IconComp, title, sub }: { icon: LucideIcon; title: string; sub?: string }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      <span className="grid place-items-center w-16 h-16 rounded-3xl bg-blush-100 text-blush-500 mb-4">
        <IconComp size={28} />
      </span>
      <h3 className="font-display text-xl font-bold text-berry-800">{title}</h3>
      {sub && <p className="text-sm text-berry-700/50 mt-1 max-w-xs">{sub}</p>}
    </div>
  );
}

// ── Internal X icon (avoid circular import) ───────────────────────────────────
function XIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

// ── Spinner ───────────────────────────────────────────────────────────────────
export function Spinner({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className="animate-spin" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  );
}

// Re-export useRef/useEffect for convenience in other client components
export { useRef, useEffect };
