// ===== Shared UI primitives =====
const { useState, useEffect, useRef, useMemo } = React;

// ---- Icon (lucide wrapper) ----
function Icon({ name, size = 20, className = '', style = {} }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !window.lucide) return;
    el.innerHTML = `<i data-lucide="${name}"></i>`;
    window.lucide.createIcons();
  });
  return (
    <span
      ref={ref}
      className={'ic ' + className}
      style={{ width: size, height: size, ...style }}
      aria-hidden="true"
    />
  );
}

// ---- Avatar (monogram) ----
function Avatar({ name, size = 44 }) {
  const initials = (name || '?').trim().split(/\s+/).slice(0, 2).map(w => w[0]).join('');
  const hues = ['#e69cba', '#d8a799', '#c4a063', '#d97a9f', '#cf93b8'];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h + name.charCodeAt(i)) % hues.length;
  return (
    <span
      className="inline-flex items-center justify-center rounded-full text-white font-semibold shadow-royal-sm select-none"
      style={{
        width: size, height: size, fontSize: size * 0.36,
        background: `linear-gradient(135deg, ${hues[h]}, ${hues[(h + 2) % hues.length]})`,
      }}
    >
      {initials}
    </span>
  );
}

// ---- Button ----
function Button({ variant = 'primary', size = 'md', icon, children, className = '', ...rest }) {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-2xl transition-all duration-200 active:scale-[.97] focus:outline-none focus-visible:ring-4 focus-visible:ring-blush-200 disabled:opacity-50 disabled:pointer-events-none';
  const sizes = {
    sm: 'text-sm px-3.5 py-2',
    md: 'text-[15px] px-5 py-2.5',
    lg: 'text-base px-6 py-3',
  };
  const variants = {
    primary: 'text-white shadow-royal-sm hover:shadow-royal bg-gradient-to-br from-blush-500 to-rosegold-500 hover:from-blush-600 hover:to-rosegold-600',
    soft: 'bg-blush-100 text-berry-700 hover:bg-blush-200',
    ghost: 'text-berry-700/70 hover:text-berry-800 hover:bg-blush-100',
    outline: 'border border-blush-200 text-berry-700 bg-white/70 hover:bg-blush-50 hover:border-blush-300',
    danger: 'bg-rose-50 text-rose-600 hover:bg-rose-100',
  };
  const iconSize = size === 'sm' ? 16 : size === 'lg' ? 20 : 18;
  return (
    <button className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...rest}>
      {icon && <Icon name={icon} size={iconSize} />}
      {children}
    </button>
  );
}

// ---- Badge ----
function Badge({ tone = 'rose', children, dot = false, className = '' }) {
  const tones = {
    rose:  'bg-rose-50 text-rose-600 ring-rose-200',
    amber: 'bg-amber-50 text-amber-700 ring-amber-200',
    green: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    blush: 'bg-blush-100 text-berry-700 ring-blush-200',
    gold:  'bg-amber-50 text-gold-600 ring-gold-400/40',
  };
  const dotColor = { rose: '#e11d48', amber: '#d97706', green: '#059669', blush: '#c25c84', gold: '#a8853f' };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ring-1 ring-inset ${tones[tone]} ${className}`}>
      {dot && <span className="w-1.5 h-1.5 rounded-full" style={{ background: dotColor[tone] }} />}
      {children}
    </span>
  );
}

// ---- Tag (cream pill) ----
function Tag({ children, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[13px] font-medium bg-blush-50 text-berry-700 ring-1 ring-inset ring-blush-200">
      <span className="w-1.5 h-1.5 rounded-full bg-rosegold-400" />
      {children}
      {onRemove && (
        <button onClick={onRemove} className="text-berry-700/40 hover:text-rose-500 transition-colors -ml-1">
          <Icon name="x" size={13} />
        </button>
      )}
    </span>
  );
}

// ---- Card ----
function Card({ children, className = '', ...rest }) {
  return (
    <div className={`bg-white/85 backdrop-blur-sm rounded-3xl border border-white shadow-royal-sm ${className}`} {...rest}>
      {children}
    </div>
  );
}

// ---- Modal ----
function Modal({ open, onClose, children, max = 'max-w-2xl' }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="fixed inset-0 bg-berry-900/30 backdrop-blur-sm anim-fade-in" onClick={onClose} />
      <div className={`relative w-full ${max} my-8 anim-scale-in`}>
        <Card className="overflow-hidden">
          {children}
        </Card>
      </div>
    </div>
  );
}

function ModalHeader({ title, subtitle, onClose, icon }) {
  return (
    <div className="flex items-start gap-4 px-7 pt-7 pb-5 border-b border-blush-100 bg-gradient-to-l from-blush-50/60 to-transparent">
      {icon && (
        <span className="grid place-items-center w-11 h-11 rounded-2xl bg-gradient-to-br from-blush-400 to-rosegold-400 text-white shadow-royal-sm">
          <Icon name={icon} size={20} />
        </span>
      )}
      <div className="flex-1 min-w-0">
        <h2 className="font-display text-2xl font-bold text-berry-800 leading-tight">{title}</h2>
        {subtitle && <p className="text-sm text-berry-700/55 mt-0.5">{subtitle}</p>}
      </div>
      <button onClick={onClose} className="grid place-items-center w-9 h-9 rounded-xl text-berry-700/50 hover:text-berry-800 hover:bg-blush-100 transition-colors">
        <Icon name="x" size={20} />
      </button>
    </div>
  );
}

// ---- Field ----
function Field({ label, children, hint }) {
  return (
    <label className="block">
      <span className="block text-[13px] font-semibold text-berry-700/70 mb-1.5">{label}</span>
      {children}
      {hint && <span className="block text-xs text-berry-700/40 mt-1">{hint}</span>}
    </label>
  );
}

const inputCls = 'w-full rounded-2xl border border-blush-200 bg-white px-4 py-2.5 text-[15px] text-berry-800 placeholder:text-berry-700/30 focus:outline-none focus:border-blush-400 focus:ring-4 focus:ring-blush-100 transition';

function TextInput(props) { return <input {...props} className={inputCls + ' ' + (props.className || '')} />; }
function TextArea(props) { return <textarea {...props} className={inputCls + ' resize-none leading-relaxed ' + (props.className || '')} />; }

// ---- StatCard ----
function StatCard({ icon, label, value, sub, accent = 'blush', delay = 0 }) {
  const accents = {
    blush:    'from-blush-400 to-rosegold-400',
    gold:     'from-gold-400 to-rosegold-400',
    rosegold: 'from-rosegold-400 to-blush-500',
  };
  return (
    <Card className="p-6 anim-fade-up hover:shadow-royal hover:-translate-y-0.5 transition-all duration-300" style={{ animationDelay: delay + 'ms' }}>
      <div className="flex items-center justify-between">
        <span className={`grid place-items-center w-12 h-12 rounded-2xl text-white shadow-royal-sm bg-gradient-to-br ${accents[accent]}`}>
          <Icon name={icon} size={22} />
        </span>
      </div>
      <div className="mt-5">
        <div className="font-display text-[2.1rem] font-bold text-berry-800 leading-none tabular-nums">{value}</div>
        <div className="text-[15px] font-semibold text-berry-700/80 mt-2">{label}</div>
        {sub && <div className="text-[13px] text-berry-700/45 mt-1">{sub}</div>}
      </div>
    </Card>
  );
}

// ---- Empty state ----
function EmptyState({ icon, title, sub }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      <span className="grid place-items-center w-16 h-16 rounded-3xl bg-blush-100 text-blush-500 mb-4">
        <Icon name={icon} size={28} />
      </span>
      <h3 className="font-display text-xl font-bold text-berry-800">{title}</h3>
      {sub && <p className="text-sm text-berry-700/50 mt-1 max-w-xs">{sub}</p>}
    </div>
  );
}

Object.assign(window, {
  Icon, Avatar, Button, Badge, Tag, Card, Modal, ModalHeader,
  Field, TextInput, TextArea, StatCard, EmptyState, inputCls,
});
