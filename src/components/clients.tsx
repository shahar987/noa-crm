'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Image from 'next/image';
import {
  Phone, CalendarClock, Images, Flower2, NotebookPen, Search, Filter,
  ChevronDown, ChevronUp, Check, UserPlus, UserSearch, ArrowLeft,
  Pencil, Trash2, Upload, ImagePlus, X, AlertCircle, Info,
} from 'lucide-react';
import {
  Avatar, Badge, Button, Card, EmptyState, Field, Modal, ModalHeader,
  StatCard, Tag, TextArea, TextInput, Spinner, inputCls,
} from './ui';
import type { Client, Product, ProgressPhoto } from '@/types';

// ── WhatsApp ──────────────────────────────────────────────────────────────────
function waLink(phone: string) {
  let d = (phone || '').replace(/\D/g, '');
  if (!d) return null;
  if (d.startsWith('0')) d = '972' + d.slice(1);
  else if (!d.startsWith('972')) d = '972' + d;
  return `https://wa.me/${d}`;
}

function WhatsAppGlyph({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
    </svg>
  );
}

function WhatsAppButton({ phone, size = 36 }: { phone: string; size?: number }) {
  return (
    <button
      onClick={e => { e.stopPropagation(); const url = waLink(phone); if (url) window.open(url, '_blank', 'noopener'); }}
      title="פתיחת וואטסאפ" aria-label="פתיחת וואטסאפ"
      className="grid place-items-center rounded-full flex-none text-white shadow-royal-sm hover:shadow-royal hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
      style={{ width: size, height: size, background: 'linear-gradient(135deg, #f0a6c5, #d97a9f)' }}
    >
      <WhatsAppGlyph size={size * 0.52} />
    </button>
  );
}

// ── Appointment picker ────────────────────────────────────────────────────────
const HE_DAYS = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];

function formatAppt(v: string) {
  const d = new Date(v);
  if (isNaN(d.getTime())) return '';
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const mn = String(d.getMinutes()).padStart(2, '0');
  return `יום ${HE_DAYS[d.getDay()]} · ${dd}.${mm} · ${hh}:${mn}`;
}

function AppointmentPicker({ value, onChange }: { value?: string; onChange: (v: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const has = !!value;
  const past = has && new Date(value!).getTime() < Date.now();

  const tone = !has
    ? 'border-dashed border-blush-300 text-berry-700/55 bg-white hover:border-blush-400 hover:text-blush-600 hover:bg-blush-50'
    : past
      ? 'border-amber-200 text-amber-700 bg-amber-50'
      : 'border-transparent text-white bg-gradient-to-l from-blush-500 to-rosegold-500 shadow-royal-sm';

  function openPicker(e: React.MouseEvent) {
    e.stopPropagation();
    const el = inputRef.current;
    if (!el) return;
    if (typeof (el as HTMLInputElement & { showPicker?: () => void }).showPicker === 'function') {
      try { (el as HTMLInputElement & { showPicker: () => void }).showPicker(); return; } catch { /* fall through */ }
    }
    el.focus(); el.click();
  }

  return (
    <div className="relative inline-flex items-center gap-1" onClick={e => e.stopPropagation()}>
      <button type="button" onClick={openPicker}
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[13px] font-semibold border transition ${tone}`}>
        <CalendarClock size={15} />
        {has ? formatAppt(value!) : 'קביעת תור הבא'}
        {has && <ChevronDown size={13} className="opacity-70" />}
      </button>
      {has && (
        <button type="button" onClick={e => { e.stopPropagation(); onChange(''); }} title="ביטול התור"
          className="grid place-items-center w-6 h-6 rounded-full text-berry-700/40 hover:text-rose-500 hover:bg-rose-50 transition">
          <X size={14} />
        </button>
      )}
      <input ref={inputRef} type="datetime-local" value={value || ''} onChange={e => onChange(e.target.value)}
        onClick={e => e.stopPropagation()} className="absolute opacity-0 w-0 h-0 pointer-events-none" tabIndex={-1} aria-hidden="true" />
    </div>
  );
}

// ── Lightbox ──────────────────────────────────────────────────────────────────
function Lightbox({ photo, onClose }: { photo: ProgressPhoto; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/92 flex items-center justify-center anim-fade-in"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 left-4 grid place-items-center w-11 h-11 rounded-full bg-white/10 text-white hover:bg-white/25 transition z-10"
        aria-label="סגירה"
      >
        <X size={22} />
      </button>

      {/* Label + date */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        <span className={`px-3 py-1 rounded-full text-[13px] font-bold text-white shadow ${LABEL_TONE[photo.label] ?? 'bg-blush-500'}`}>
          {photo.label}
        </span>
        <span className="text-white/60 text-[13px]">{photo.date}</span>
      </div>

      {/* Image — stopPropagation so clicking the image doesn't close */}
      <div
        className="relative w-full h-full flex items-center justify-center p-16 sm:p-20"
        onClick={e => e.stopPropagation()}
      >
        {photo.url ? (
          <Image
            src={photo.url}
            alt={photo.label}
            fill
            className="object-contain"
            unoptimized
            sizes="100vw"
          />
        ) : (
          <div className="stripe-ph w-64 h-64 rounded-3xl grid place-items-center">
            <span className="text-berry-700/40 text-sm">אין תמונה</span>
          </div>
        )}
      </div>

      {/* Hint */}
      <p className="absolute bottom-5 inset-x-0 text-center text-white/35 text-xs select-none">
        לחצי על הרקע או על ESC לסגירה
      </p>
    </div>
  );
}

// ── Progress photo card ───────────────────────────────────────────────────────
const LABEL_TONE: Record<string, string> = {
  'לפני': 'bg-rosegold-400', 'אחרי': 'bg-emerald-500', 'ביניים': 'bg-gold-500',
};

function ProgressPhoto({
  photo, onRemove, onOpen,
}: { photo: ProgressPhoto; onRemove?: () => void; onOpen?: () => void }) {
  // Double-tap detection for mobile
  const lastTap = useRef<number>(0);

  function handleTouchEnd(e: React.TouchEvent) {
    const now = Date.now();
    if (now - lastTap.current < 300) {
      e.preventDefault(); // always prevent double-tap zoom on photo tiles
      if (photo.url && onOpen) onOpen();
    }
    lastTap.current = now;
  }

  return (
    <div
      className="group relative rounded-2xl overflow-hidden ring-1 ring-blush-100 anim-scale-in cursor-pointer select-none"
      onDoubleClick={() => photo.url && onOpen?.()}
      onTouchEnd={handleTouchEnd}
      title="לחצי פעמיים לתצוגה מלאה"
    >
      {photo.url ? (
        <div className="aspect-square relative">
          <Image src={photo.url} alt={photo.label} fill className="object-cover" unoptimized />
        </div>
      ) : (
        <div className="stripe-ph aspect-square grid place-items-center">
          <span className="font-mono text-[10px] text-berry-700/35 tracking-wide">progress photo</span>
        </div>
      )}

      {/* Hover hint overlay — only on photos that have a URL */}
      {photo.url && (
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition flex items-center justify-center pointer-events-none">
          <span className="opacity-0 group-hover:opacity-100 transition text-white text-xs font-semibold bg-black/50 px-2 py-1 rounded-full">
            לחץ פעמיים
          </span>
        </div>
      )}

      <div className="absolute top-2 right-2">
        <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold text-white shadow-sm ${LABEL_TONE[photo.label] ?? 'bg-blush-500'}`}>
          {photo.label}
        </span>
      </div>
      <div className="absolute inset-x-0 bottom-0 px-2.5 py-1.5 bg-gradient-to-t from-berry-900/70 to-transparent">
        <span className="text-[11px] font-medium text-white/90">{photo.date}</span>
      </div>
      {onRemove && (
        <button
          onClick={e => { e.stopPropagation(); onRemove(); }}
          className="absolute top-2 left-2 grid place-items-center w-6 h-6 rounded-lg bg-white/85 text-rose-500 opacity-0 group-hover:opacity-100 transition hover:bg-white"
        >
          <Trash2 size={13} />
        </button>
      )}
    </div>
  );
}

// ── Cream multi-select ────────────────────────────────────────────────────────
function CreamSelect({ products, value, onChange }: { products: Product[]; value: string[]; onChange: (v: string[]) => void }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const boxRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) { if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false); }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);
  useEffect(() => { if (open && searchRef.current) searchRef.current.focus(); }, [open]);

  function toggle(name: string) {
    onChange(value.includes(name) ? value.filter(c => c !== name) : [...value, name]);
  }

  const filtered = products.filter(p => p.name.toLowerCase().includes(query.trim().toLowerCase()));

  return (
    <div ref={boxRef} className="relative">
      <div onClick={() => setOpen(o => !o)}
        className={`min-h-[48px] w-full rounded-2xl border bg-white px-3 py-2 flex items-center flex-wrap gap-1.5 cursor-pointer transition ${open ? 'border-blush-400 ring-4 ring-blush-100' : 'border-blush-200 hover:border-blush-300'}`}>
        {value.length === 0 && <span className="text-berry-700/35 text-[15px] px-1">בחרי מוצרים מהרשימה…</span>}
        {value.map(name => (
          <span key={name} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[13px] font-medium bg-blush-50 text-berry-700 ring-1 ring-inset ring-blush-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rosegold-400" />
            {name}
            <span role="button" onClick={e => { e.stopPropagation(); toggle(name); }} className="text-berry-700/40 hover:text-rose-500 transition-colors -ml-0.5 cursor-pointer">
              <X size={13} />
            </span>
          </span>
        ))}
        <span className="mr-auto text-berry-700/35 pl-1 pointer-events-none">
          {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </span>
      </div>

      {open && (
        <div className="absolute z-20 mt-2 w-full rounded-2xl bg-white border border-blush-100 shadow-royal anim-scale-in overflow-hidden">
          <div className="p-2.5 border-b border-blush-50">
            <div className="relative">
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-berry-700/35"><Search size={16} /></span>
              <input ref={searchRef} value={query} onChange={e => setQuery(e.target.value)} placeholder="חיפוש מוצר…"
                className="w-full rounded-xl border border-blush-200 bg-white pr-9 pl-3 py-2 text-[14px] text-berry-800 placeholder:text-berry-700/30 focus:outline-none focus:border-blush-400 focus:ring-4 focus:ring-blush-100 transition" />
            </div>
          </div>
          <ul className="max-h-56 overflow-y-auto py-1.5">
            {filtered.length === 0 && <li className="px-4 py-6 text-center text-sm text-berry-700/40">לא נמצאו מוצרים תואמים</li>}
            {filtered.map(p => {
              const on = value.includes(p.name);
              return (
                <li key={p.id}>
                  <button type="button" onClick={() => toggle(p.name)}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-right transition ${on ? 'bg-blush-50' : 'hover:bg-blush-50/60'}`}>
                    <span className={`grid place-items-center w-5 h-5 rounded-md flex-none ring-1 ring-inset transition ${on ? 'bg-gradient-to-br from-blush-500 to-rosegold-500 ring-transparent text-white' : 'bg-white ring-blush-200'}`}>
                      {on && <Check size={13} />}
                    </span>
                    <span className="flex-1 min-w-0 text-[14px] font-medium text-berry-800 truncate">{p.name}</span>
                  </button>
                </li>
              );
            })}
          </ul>
          {value.length > 0 && (
            <div className="flex items-center justify-between px-3 py-2 border-t border-blush-50 bg-blush-50/40">
              <span className="text-xs text-berry-700/50">{value.length} מוצרים נבחרו</span>
              <button type="button" onClick={() => onChange([])} className="text-xs font-semibold text-blush-600 hover:text-berry-700 transition">ניקוי הכל</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Client profile modal ──────────────────────────────────────────────────────
function ClientProfile({
  client, products, onClose, onEdit, onAddPhoto, onRemovePhoto, onSetAppt,
}: {
  client: Client; products: Product[]; onClose: () => void;
  onEdit: (c: Client) => void; onAddPhoto: (cid: string, photo: ProgressPhoto) => void;
  onRemovePhoto: (cid: string, pid: string) => void; onSetAppt: (cid: string, v: string) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const labels = ['לפני', 'ביניים', 'אחרי'];
  const [uploading, setUploading] = useState(false);
  const [lightbox, setLightbox] = useState<ProgressPhoto | null>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      const today = new Date().toLocaleDateString('he-IL').replaceAll('/', '.');
      const nextLabel = labels[Math.min(client.photos.length, labels.length - 1)];
      onAddPhoto(client.id, { id: 'ph' + Date.now(), date: today, label: nextLabel, driveFileId: data.fileId, url: data.url });
    } catch { /* silent */ } finally {
      setUploading(false);
      e.target.value = '';
    }
  }

  return (
    <Modal open onClose={onClose} max="max-w-3xl">
      {/* Header — flex-none so it never shrinks. Close button is a flex sibling
          (not absolute) so it can never overlap the name in RTL. */}
      <div className="flex-none px-4 sm:px-6 pt-5 sm:pt-6 pb-4 sm:pb-5 bg-gradient-to-l from-blush-100 via-blush-50 to-white border-b border-blush-100">
        <div className="flex items-center gap-3">
          <Avatar name={client.name} size={52} />
          <div className="flex-1 min-w-0">
            <h2 className="font-display text-xl sm:text-2xl font-bold text-berry-800 leading-tight truncate">
              {client.name}
            </h2>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-sm text-berry-700/60">
              <span className="inline-flex items-center gap-1.5"><Phone size={13} /> {client.phone}</span>
              <span className="inline-flex items-center gap-1.5"><Flower2 size={13} /> {client.since}</span>
            </div>
          </div>
          {/* Close button is the last flex item — always to the left in RTL, never overlaps text */}
          <button
            onClick={onClose}
            className="flex-none grid place-items-center w-9 h-9 rounded-xl text-berry-700/50 hover:text-berry-800 hover:bg-white/70 transition"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Body — flex-1 min-h-0 overflow-y-auto: takes all remaining card height and scrolls */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 flex flex-col gap-5 sm:gap-6">
        <section>
          <h3 className="text-[13px] font-bold uppercase tracking-wide text-berry-700/45 mb-3 flex items-center gap-2">
            <CalendarClock size={15} /> תור הבא
          </h3>
          <AppointmentPicker value={client.nextAppt} onChange={v => onSetAppt(client.id, v)} />
        </section>

        <section>
          <h3 className="text-[13px] font-bold uppercase tracking-wide text-berry-700/45 mb-3 flex items-center gap-2">
            <Flower2 size={15} /> מוצרים בשימוש
          </h3>
          <div className="flex flex-wrap gap-2">
            {client.creams.length ? client.creams.map(c => <Tag key={c}>{c}</Tag>)
              : <span className="text-sm text-berry-700/40">אין מוצרים משויכים עדיין</span>}
          </div>
        </section>

        <section>
          <h3 className="text-[13px] font-bold uppercase tracking-wide text-berry-700/45 mb-3 flex items-center gap-2">
            <NotebookPen size={15} /> הערות ורגישויות
          </h3>
          <div className="rounded-2xl bg-blush-50/70 border border-blush-100 px-5 py-4 text-[15px] leading-relaxed text-berry-800">
            {client.notes || <span className="text-berry-700/40">לא הוזנו הערות.</span>}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[13px] font-bold uppercase tracking-wide text-berry-700/45 flex items-center gap-2">
              <Images size={15} /> תמונות התקדמות
              <span className="text-berry-700/30">· {client.photos.length}</span>
            </h3>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
            <Button variant="soft" size="sm" Icon={Upload} disabled={uploading}
              onClick={() => fileRef.current?.click()}>
              {uploading ? 'מעלה…' : 'העלאת תמונה'}
            </Button>
          </div>
          {client.photos.length ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {client.photos.map(ph => (
                <ProgressPhoto
                  key={ph.id}
                  photo={ph}
                  onRemove={() => onRemovePhoto(client.id, ph.id)}
                  onOpen={() => setLightbox(ph)}
                />
              ))}
              <button onClick={() => fileRef.current?.click()} disabled={uploading}
                className="aspect-square rounded-2xl border-2 border-dashed border-blush-200 text-blush-400 grid place-items-center hover:border-blush-400 hover:text-blush-500 hover:bg-blush-50 transition disabled:opacity-50">
                <span className="flex flex-col items-center gap-1">
                  <ImagePlus size={22} />
                  <span className="text-[11px] font-semibold">הוספה</span>
                </span>
              </button>
            </div>
          ) : (
            <button onClick={() => fileRef.current?.click()} disabled={uploading}
              className="w-full rounded-2xl border-2 border-dashed border-blush-200 text-berry-700/50 grid place-items-center py-10 hover:border-blush-400 hover:bg-blush-50 transition disabled:opacity-50">
              <span className="flex flex-col items-center gap-2">
                <ImagePlus size={28} className="text-blush-400" />
                <span className="text-sm font-medium">לחצי כאן להעלאת תמונת לפני/אחרי ראשונה</span>
              </span>
            </button>
          )}
        </section>
      </div>

      <div className="flex-none flex items-center justify-end gap-2.5 px-4 sm:px-7 py-4 sm:py-5 border-t border-blush-100 bg-blush-50/40">
        <Button variant="outline" Icon={Pencil} onClick={() => onEdit(client)}>עריכת פרטים</Button>
        <button
          onClick={() => { const url = waLink(client.phone); if (url) window.open(url, '_blank', 'noopener'); }}
          className="inline-flex items-center justify-center gap-2 font-semibold rounded-2xl text-[15px] px-5 py-2.5 transition-all duration-200 text-white shadow-royal-sm"
          style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)' }}>
          <WhatsAppGlyph size={18} /> שליחת וואטסאפ
        </button>
      </div>

      {/* Lightbox — z-[9999] so it sits above the modal */}
      {lightbox && <Lightbox photo={lightbox} onClose={() => setLightbox(null)} />}
    </Modal>
  );
}

// ── Client form modal ─────────────────────────────────────────────────────────
function ClientForm({ initial, products, onClose, onSave }: {
  initial?: Client; products: Product[]; onClose: () => void; onSave: (c: Client) => void;
}) {
  const editing = !!initial;
  const [name, setName] = useState(initial?.name ?? '');
  const [phone, setPhone] = useState(initial?.phone ?? '');
  const [notes, setNotes] = useState(initial?.notes ?? '');
  const [creams, setCreams] = useState<string[]>(initial?.creams ?? []);
  const [err, setErr] = useState('');

  function submit() {
    if (!name.trim()) { setErr('נא להזין שם מלא'); return; }
    onSave({
      id: initial?.id ?? 'c' + Date.now(),
      name: name.trim(),
      phone: phone.trim() || '—',
      since: initial?.since ?? `לקוחה מאז ${new Date().getFullYear()}`,
      creams,
      notes: notes.trim(),
      nextAppt: initial?.nextAppt,
      photos: initial?.photos ?? [],
    });
  }

  return (
    <Modal open onClose={onClose}>
      <ModalHeader Icon={editing ? Pencil : UserPlus} title={editing ? 'עריכת לקוחה' : 'הוספת לקוחה חדשה'}
        subtitle={editing ? 'עדכון פרטי הלקוחה' : 'מילוי כרטיס לקוחה חדש בספר'} onClose={onClose} />
      <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-7 flex flex-col gap-4 sm:gap-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          <Field label="שם מלא">
            <TextInput value={name} onChange={e => { setName(e.target.value); setErr(''); }} placeholder="לדוגמה: נועה לוי" />
          </Field>
          <Field label="מספר טלפון">
            <TextInput value={phone} onChange={e => setPhone(e.target.value)} placeholder="050-0000000" dir="ltr" className="text-right" />
          </Field>
        </div>
        <Field label="מוצרים משויכים" hint="חפשי ובחרי קרמים שהלקוחה משתמשת בהם">
          <CreamSelect products={products} value={creams} onChange={setCreams} />
        </Field>
        <Field label="הערות ורגישויות" hint="לדוגמה: רגישות לרטינול, עור יבש">
          <TextArea rows={3} value={notes} onChange={e => setNotes(e.target.value)} placeholder="תיעוד רגישויות, סוג עור, העדפות והנחיות טיפול…" />
        </Field>
        {err && <div className="text-sm text-rose-600 font-medium flex items-center gap-1.5"><AlertCircle size={15} /> {err}</div>}
      </div>
      <div className="flex-none flex items-center justify-end gap-2.5 px-4 sm:px-7 py-4 sm:py-5 border-t border-blush-100 bg-blush-50/40">
        <Button variant="ghost" onClick={onClose}>ביטול</Button>
        <Button variant="primary" Icon={Check} onClick={submit}>{editing ? 'שמירת שינויים' : 'הוספת לקוחה'}</Button>
      </div>
    </Modal>
  );
}

// ── Client card ───────────────────────────────────────────────────────────────
function ClientCard({ client, onOpen, onEdit, onDelete, onSetAppt }: {
  client: Client; onOpen: (c: Client) => void; onEdit: (c: Client) => void;
  onDelete: (c: Client) => void; onSetAppt: (cid: string, v: string) => void;
}) {
  return (
    <Card className="group p-5 hover:shadow-royal hover:-translate-y-0.5 transition-all duration-300 flex flex-col anim-fade-up">
      <div className="flex items-start gap-3.5">
        <Avatar name={client.name} size={52} />
        <div className="flex-1 min-w-0">
          <button onClick={() => onOpen(client)} className="font-display text-lg font-bold text-berry-800 hover:text-blush-600 transition text-right leading-tight block w-full">
            {client.name}
          </button>
          <div className="text-[13px] text-berry-700/50 flex items-center gap-1 mt-0.5" dir="ltr" style={{ justifyContent: 'flex-end' }}>
            {client.phone} <Phone size={12} />
          </div>
        </div>
        <div className="flex items-center gap-1 flex-none">
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 sm:flex sm:opacity-100 transition">
            <button onClick={() => onEdit(client)} className="grid place-items-center w-8 h-8 rounded-xl text-berry-700/50 hover:text-berry-800 hover:bg-blush-100 transition"><Pencil size={15} /></button>
            <button onClick={() => onDelete(client)} className="grid place-items-center w-8 h-8 rounded-xl text-berry-700/50 hover:text-rose-500 hover:bg-rose-50 transition"><Trash2 size={15} /></button>
          </div>
          <WhatsAppButton phone={client.phone} size={34} />
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mt-4 min-h-[28px]">
        {client.creams.slice(0, 2).map(c => <Tag key={c}>{c}</Tag>)}
        {client.creams.length > 2 && (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[13px] font-medium bg-blush-50 text-berry-700/60 ring-1 ring-inset ring-blush-200">+{client.creams.length - 2}</span>
        )}
        {client.creams.length === 0 && <span className="text-[13px] text-berry-700/35">אין מוצרים משויכים</span>}
      </div>

      {client.notes && (
        <p className="mt-3 text-[13px] leading-relaxed text-berry-700/55 line-clamp-2 bg-blush-50/50 rounded-xl px-3 py-2 border border-blush-100">
          {client.notes}
        </p>
      )}

      <div className="mt-3.5 flex items-center gap-2 flex-wrap">
        <span className="text-[12px] font-semibold text-berry-700/45 flex-none">תור הבא:</span>
        <AppointmentPicker value={client.nextAppt} onChange={v => onSetAppt(client.id, v)} />
      </div>

      <div className="flex items-center justify-between mt-4 pt-3.5 border-t border-blush-100">
        <span className="text-xs text-berry-700/45 inline-flex items-center gap-1.5">
          <Images size={13} /> {client.photos.length} תמונות התקדמות
        </span>
        <button onClick={() => onOpen(client)} className="text-sm font-semibold text-blush-600 hover:text-berry-700 inline-flex items-center gap-1 transition">
          לכרטיס <ArrowLeft size={14} />
        </button>
      </div>
    </Card>
  );
}

// ── Main Clients view ─────────────────────────────────────────────────────────
export function Clients({
  clients: init, products, onClientsChange, focusId,
}: { clients: Client[]; products: Product[]; onClientsChange: (fn: (cs: Client[]) => Client[]) => void; focusId?: string }) {
  const [search, setSearch] = useState('');
  const [creamFilter, setCreamFilter] = useState('');
  const [openClient, setOpenClient] = useState<Client | null>(null);
  const [formClient, setFormClient] = useState<Client | null | undefined>(undefined);
  const [confirmDel, setConfirmDel] = useState<Client | null>(null);
  const [saving, setSaving] = useState(false);
  const [apiErr, setApiErr] = useState('');

  function showErr(msg: string) {
    setApiErr(msg);
    setTimeout(() => setApiErr(''), 4000);
  }

  useEffect(() => {
    if (focusId) {
      const c = init.find(c => c.id === focusId);
      if (c) setOpenClient(c);
    }
  }, [focusId, init]);

  const liveOpen = openClient ? init.find(c => c.id === openClient.id) ?? null : null;

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return init.filter(c => {
      const matchQ = !q || c.name.toLowerCase().includes(q) || c.phone.includes(q);
      const matchCream = !creamFilter || c.creams.includes(creamFilter);
      return matchQ && matchCream;
    });
  }, [init, search, creamFilter]);

  async function saveClient(data: Client) {
    setSaving(true);
    onClientsChange(cs => {
      const exists = cs.some(c => c.id === data.id);
      return exists ? cs.map(c => c.id === data.id ? data : c) : [data, ...cs];
    });
    setFormClient(undefined);
    try { await fetch('/api/clients', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }); }
    catch { showErr('שגיאה בשמירה — נסי שוב'); }
    finally { setSaving(false); }
  }

  async function deleteClient(c: Client) {
    onClientsChange(cs => cs.filter(x => x.id !== c.id));
    setConfirmDel(null);
    if (openClient?.id === c.id) setOpenClient(null);
    try { await fetch('/api/clients', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: c.id }) }); }
    catch { showErr('שגיאה במחיקה — נסי שוב'); }
  }

  async function addPhoto(clientId: string, photo: ProgressPhoto) {
    onClientsChange(cs => cs.map(c => c.id === clientId ? { ...c, photos: [...c.photos, photo] } : c));
    const updated = init.find(c => c.id === clientId);
    if (updated) {
      const newClient = { ...updated, photos: [...updated.photos, photo] };
      try { await fetch('/api/clients', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newClient) }); }
      catch { /* optimistic */ }
    }
  }

  async function removePhoto(clientId: string, photoId: string) {
    let removedFileId: string | undefined;
    onClientsChange(cs => cs.map(c => {
      if (c.id !== clientId) return c;
      const ph = c.photos.find(p => p.id === photoId);
      removedFileId = ph?.driveFileId;
      return { ...c, photos: c.photos.filter(p => p.id !== photoId) };
    }));
    const updated = init.find(c => c.id === clientId);
    if (updated) {
      const newClient = { ...updated, photos: updated.photos.filter(p => p.id !== photoId) };
      try {
        await fetch('/api/clients', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newClient) });
        if (removedFileId) await fetch('/api/upload', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ fileId: removedFileId }) });
      } catch { /* optimistic */ }
    }
  }

  async function setAppointment(clientId: string, value: string) {
    onClientsChange(cs => cs.map(c => c.id === clientId ? { ...c, nextAppt: value || undefined } : c));
    const updated = init.find(c => c.id === clientId);
    if (updated) {
      const newClient = { ...updated, nextAppt: value || undefined };
      try { await fetch('/api/clients', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newClient) }); }
      catch { /* optimistic */ }
    }
  }

  return (
    <div data-tab-enter className="flex flex-col gap-6">
      {apiErr && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-medium">
          <AlertCircle size={16} /> {apiErr}
        </div>
      )}
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-berry-800">ספר לקוחות</h1>
          <p className="text-berry-700/55 mt-1">{init.length} לקוחות בקליניקה · {filtered.length} מוצגות</p>
        </div>
        <Button variant="primary" Icon={UserPlus} onClick={() => setFormClient(null)}>הוספת לקוחה</Button>
      </div>

      <Card className="p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-berry-700/35"><Search size={18} /></span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="חיפוש לפי שם או טלפון…" className={inputCls + ' pr-11'} />
        </div>
        <div className="relative sm:w-72">
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-berry-700/35"><Filter size={17} /></span>
          <select value={creamFilter} onChange={e => setCreamFilter(e.target.value)} className={inputCls + ' pr-11 appearance-none cursor-pointer'}>
            <option value="">סינון לפי קרם — הכל</option>
            {products.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
          </select>
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-berry-700/35 pointer-events-none"><ChevronDown size={16} /></span>
        </div>
        {(search || creamFilter) && (
          <Button variant="ghost" Icon={X} onClick={() => { setSearch(''); setCreamFilter(''); }}>נקה</Button>
        )}
      </Card>

      {creamFilter && (
        <div className="-mt-2 flex items-center gap-2 text-sm text-berry-700/60">
          <Info size={15} />
          מציג לקוחות שמשתמשות ב־<strong className="text-berry-800">{creamFilter}</strong>
        </div>
      )}

      {filtered.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map(c => (
            <ClientCard key={c.id} client={c} onOpen={setOpenClient} onEdit={setFormClient} onDelete={setConfirmDel} onSetAppt={setAppointment} />
          ))}
        </div>
      ) : (
        <Card><EmptyState icon={UserSearch} title="לא נמצאו לקוחות" sub="נסי לשנות את החיפוש או הסינון, או הוסיפי לקוחה חדשה." /></Card>
      )}

      {liveOpen && (
        <ClientProfile client={liveOpen} products={products} onClose={() => setOpenClient(null)}
          onEdit={c => { setOpenClient(null); setFormClient(c); }}
          onAddPhoto={addPhoto} onRemovePhoto={removePhoto} onSetAppt={setAppointment} />
      )}

      {formClient !== undefined && (
        <ClientForm initial={formClient ?? undefined} products={products} onClose={() => setFormClient(undefined)} onSave={saveClient} />
      )}

      {confirmDel && (
        <Modal open onClose={() => setConfirmDel(null)} max="max-w-md">
          <div className="flex-1 p-5 sm:p-7 text-center">
            <span className="grid place-items-center w-14 h-14 rounded-2xl bg-rose-50 text-rose-500 mx-auto mb-4"><Trash2 size={26} /></span>
            <h2 className="font-display text-2xl font-bold text-berry-800">מחיקת לקוחה</h2>
            <p className="text-berry-700/60 mt-2">האם למחוק את <strong className="text-berry-800">{confirmDel.name}</strong> לצמיתות? פעולה זו אינה הפיכה.</p>
            <div className="flex gap-2.5 justify-center mt-6">
              <Button variant="ghost" onClick={() => setConfirmDel(null)}>ביטול</Button>
              <Button variant="danger" Icon={Trash2} onClick={() => deleteClient(confirmDel)}>כן, מחקי</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
