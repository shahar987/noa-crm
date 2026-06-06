'use client';

import { useState } from 'react';
import { Plus, Flower2, Pencil, Trash2, Search, Check, AlertCircle, Package } from 'lucide-react';
import {
  Button, Card, EmptyState, Field, Modal, ModalHeader, TextInput, Spinner, inputCls,
} from './ui';
import type { Client, Product } from '@/types';

function clientsUsing(productName: string, clients: Client[]) {
  return clients.filter(c => c.creams.includes(productName)).length;
}

// ── Product form modal ────────────────────────────────────────────────────────
function ProductForm({ initial, products, onClose, onSave }: {
  initial?: Product; products: Product[]; onClose: () => void; onSave: (p: Product) => void;
}) {
  const editing = !!initial;
  const [name, setName] = useState(initial?.name ?? '');
  const [err, setErr] = useState('');

  function submit() {
    const v = name.trim();
    if (!v) { setErr('נא להזין שם מוצר'); return; }
    if (products.some(p => p.name === v && p.id !== initial?.id)) { setErr('מוצר בשם זה כבר קיים'); return; }
    onSave({ id: initial?.id ?? 'p' + Date.now(), name: v });
  }

  return (
    <Modal open onClose={onClose} max="max-w-md">
      <ModalHeader Icon={editing ? Pencil : Plus}
        title={editing ? 'עריכת מוצר' : 'הוספת מוצר חדש'}
        subtitle={editing ? 'עדכון שם המוצר' : 'הוספת קרם חדש לקטלוג'}
        onClose={onClose} />
      <div className="p-4 sm:p-7 flex flex-col gap-4 sm:gap-5">
        <Field label="שם המוצר">
          <TextInput autoFocus value={name}
            onChange={e => { setName(e.target.value); setErr(''); }}
            onKeyDown={e => { if (e.key === 'Enter') submit(); }}
            placeholder="לדוגמה: סרום ויטמין C" />
        </Field>
        {err && <div className="text-sm text-rose-600 font-medium flex items-center gap-1.5"><AlertCircle size={15} /> {err}</div>}
      </div>
      <div className="flex-none flex items-center justify-end gap-2.5 px-4 sm:px-7 py-4 sm:py-5 border-t border-blush-100 bg-blush-50/40">
        <Button variant="ghost" onClick={onClose}>ביטול</Button>
        <Button variant="primary" Icon={Check} onClick={submit}>{editing ? 'שמירת שינויים' : 'הוספת מוצר'}</Button>
      </div>
    </Modal>
  );
}

// ── Product card ──────────────────────────────────────────────────────────────
function ProductCard({ p, usage, onEdit, onDelete }: {
  p: Product; usage: number; onEdit: (p: Product) => void; onDelete: (p: Product) => void;
}) {
  return (
    <Card className="group p-5 flex items-center gap-4 hover:shadow-royal hover:-translate-y-0.5 transition-all duration-300 anim-fade-up">
      <span className="grid place-items-center w-12 h-12 rounded-2xl flex-none text-white shadow-royal-sm bg-gradient-to-br from-blush-400 to-rosegold-400">
        <Flower2 size={22} />
      </span>
      <div className="flex-1 min-w-0">
        <div className="font-display text-lg font-bold text-berry-800 leading-tight">{p.name}</div>
        <div className="text-[13px] text-berry-700/50 mt-0.5">
          {usage > 0 ? `${usage} לקוחות משתמשות` : 'לא בשימוש עדיין'}
        </div>
      </div>
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 sm:opacity-100 transition flex-none">
        <button onClick={() => onEdit(p)} className="grid place-items-center w-9 h-9 rounded-xl text-berry-700/50 hover:text-berry-800 hover:bg-blush-100 transition"><Pencil size={16} /></button>
        <button onClick={() => onDelete(p)} className="grid place-items-center w-9 h-9 rounded-xl text-berry-700/50 hover:text-rose-500 hover:bg-rose-50 transition"><Trash2 size={16} /></button>
      </div>
    </Card>
  );
}

// ── Main Inventory view ───────────────────────────────────────────────────────
export function Inventory({ products: init, clients, onProductsChange }: {
  products: Product[]; clients: Client[]; onProductsChange: (fn: (ps: Product[]) => Product[]) => void;
}) {
  const [form, setForm] = useState<Product | null | undefined>(undefined);
  const [confirmDel, setConfirmDel] = useState<Product | null>(null);
  const [search, setSearch] = useState('');

  const q = search.trim().toLowerCase();
  const shown = init.filter(p => !q || p.name.toLowerCase().includes(q));

  async function saveProduct(data: Product) {
    onProductsChange(ps => {
      const exists = ps.some(p => p.id === data.id);
      return exists ? ps.map(p => p.id === data.id ? data : p) : [data, ...ps];
    });
    setForm(undefined);
    try { await fetch('/api/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }); }
    catch { /* optimistic */ }
  }

  async function deleteProduct(p: Product) {
    onProductsChange(ps => ps.filter(x => x.id !== p.id));
    setConfirmDel(null);
    try { await fetch('/api/products', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: p.id }) }); }
    catch { /* optimistic */ }
  }

  return (
    <div data-tab-enter className="flex flex-col gap-6">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-berry-800">מוצרים</h1>
          <p className="text-berry-700/55 mt-1">{init.length} מוצרים בקטלוג · ניהול הקרמים של הקליניקה</p>
        </div>
        <Button variant="primary" Icon={Plus} onClick={() => setForm(null)}>הוספת מוצר</Button>
      </div>

      <Card className="p-4">
        <div className="relative">
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-berry-700/35"><Search size={18} /></span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="חיפוש מוצר…" className={inputCls + ' pr-11'} />
        </div>
      </Card>

      {shown.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {shown.map(p => (
            <ProductCard key={p.id} p={p} usage={clientsUsing(p.name, clients)} onEdit={setForm} onDelete={setConfirmDel} />
          ))}
        </div>
      ) : (
        <Card><EmptyState icon={Package} title="לא נמצאו מוצרים" sub="נסי חיפוש אחר, או הוסיפי מוצר חדש לקטלוג." /></Card>
      )}

      {form !== undefined && (
        <ProductForm initial={form ?? undefined} products={init} onClose={() => setForm(undefined)} onSave={saveProduct} />
      )}

      {confirmDel && (
        <Modal open onClose={() => setConfirmDel(null)} max="max-w-md">
          <div className="flex-1 p-5 sm:p-7 text-center">
            <span className="grid place-items-center w-14 h-14 rounded-2xl bg-rose-50 text-rose-500 mx-auto mb-4"><Trash2 size={26} /></span>
            <h2 className="font-display text-2xl font-bold text-berry-800">מחיקת מוצר</h2>
            <p className="text-berry-700/60 mt-2">האם למחוק את <strong className="text-berry-800">{confirmDel.name}</strong> מהקטלוג?</p>
            <div className="flex gap-2.5 justify-center mt-6">
              <Button variant="ghost" onClick={() => setConfirmDel(null)}>ביטול</Button>
              <Button variant="danger" Icon={Trash2} onClick={() => deleteProduct(confirmDel)}>כן, מחקי</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
