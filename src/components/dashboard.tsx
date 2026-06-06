'use client';

import Link from 'next/link';
import { Users, Package, Images, Sparkles, Flower2, ArrowLeft, UserPlus } from 'lucide-react';
import { Card, StatCard, EmptyState, Avatar, Badge } from './ui';
import type { Client, Product } from '@/types';

function clientsUsing(productName: string, clients: Client[]) {
  return clients.filter(c => c.creams.includes(productName)).length;
}

function TopProductsWidget({ products, clients }: { products: Product[]; clients: Client[] }) {
  const ranked = products
    .map(p => ({ ...p, usage: clientsUsing(p.name, clients) }))
    .sort((a, b) => b.usage - a.usage)
    .slice(0, 5);
  const max = Math.max(1, ...ranked.map(p => p.usage));

  return (
    <Card className="p-6 anim-fade-up" style={{ animationDelay: '120ms' }}>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <span className="grid place-items-center w-10 h-10 rounded-2xl bg-blush-100 text-blush-600 flex-none">
            <Sparkles size={20} />
          </span>
          <div>
            <h3 className="font-display text-xl font-bold text-berry-800 leading-tight">המוצרים המבוקשים</h3>
            <p className="text-[13px] text-berry-700/50">לפי מספר הלקוחות שמשתמשות בהם</p>
          </div>
        </div>
        <Link href="/inventory" className="text-sm font-semibold text-blush-600 hover:text-berry-700 inline-flex items-center gap-1 transition-colors">
          לקטלוג <ArrowLeft size={15} />
        </Link>
      </div>

      {ranked.length === 0 ? (
        <EmptyState icon={Package} title="אין מוצרים בקטלוג" sub="הוסיפי מוצרים כדי לראות נתונים." />
      ) : (
        <ul className="flex flex-col gap-3">
          {ranked.map(p => (
            <li key={p.id} className="flex items-center gap-3">
              <span className="grid place-items-center w-9 h-9 rounded-xl flex-none bg-blush-50 text-rosegold-500">
                <Flower2 size={17} />
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-berry-800 truncate">{p.name}</span>
                  <span className="text-[13px] font-semibold tabular-nums text-berry-700/55 flex-none">{p.usage} לקוחות</span>
                </div>
                <div className="mt-1.5 h-1.5 rounded-full bg-blush-50 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-l from-blush-400 to-rosegold-400 transition-all"
                    style={{ width: `${Math.round((p.usage / max) * 100)}%` }}
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

export function Dashboard({ clients, products }: { clients: Client[]; products: Product[] }) {
  const totalPhotos = clients.reduce((s, c) => s + c.photos.length, 0);

  return (
    <div data-tab-enter className="flex flex-col gap-6">
      {/* Greeting banner */}
      <div className="relative overflow-hidden rounded-3xl p-7 sm:p-8 text-white shadow-royal bg-gradient-to-l from-blush-500 via-rosegold-500 to-blush-600 anim-fade-up">
        <div className="absolute -top-10 -left-10 w-52 h-52 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-16 right-10 w-60 h-60 rounded-full bg-white/10 blur-3xl" />
        <div className="relative flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 text-white/85 text-sm font-medium mb-1">
              <Sparkles size={16} /> בוקר טוב, נועה טל-אל
            </div>
            <h1 className="font-display text-3xl sm:text-[2.4rem] font-bold leading-tight">לוח הבקרה שלך</h1>
            <p className="text-white/80 mt-1.5 text-[15px]">סקירה מהירה של הקליניקה שלך להיום.</p>
          </div>
          <Link href="/clients"
            className="inline-flex items-center justify-center gap-2 font-semibold rounded-2xl text-[15px] px-5 py-2.5 transition-all duration-200 !bg-white/15 border border-white/30 text-white hover:bg-white/25">
            <UserPlus size={18} /> לקוחה חדשה
          </Link>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard icon={Users}   label="לקוחות פעילות"    value={clients.length}  sub="בספר הלקוחות שלך"     accent="blush"    delay={40}  />
        <StatCard icon={Package} label="מוצרים בקטלוג"    value={products.length} sub="קרמים זמינים לשיוך"   accent="gold"     delay={90}  />
        <StatCard icon={Images}  label="תמונות התקדמות"   value={totalPhotos}     sub="תיעוד טיפולים מצטבר"  accent="rosegold" delay={140} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <TopProductsWidget products={products} clients={clients} />
        </div>
        <div className="lg:col-span-2">
          <Card className="p-6 h-full anim-fade-up" style={{ animationDelay: '180ms' }}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display text-xl font-bold text-berry-800">לקוחות אחרונות</h3>
              <Link href="/clients" className="text-sm font-semibold text-blush-600 hover:text-berry-700 inline-flex items-center gap-1 transition-colors">
                לכולן <ArrowLeft size={15} />
              </Link>
            </div>
            <ul className="flex flex-col gap-1">
              {clients.slice(0, 4).map(c => (
                <li key={c.id}>
                  <Link href={`/clients?focus=${c.id}`}
                    className="w-full flex items-center gap-3 rounded-2xl px-2.5 py-2.5 hover:bg-blush-50 transition text-right">
                    <Avatar name={c.name} size={42} />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-berry-800 truncate">{c.name}</div>
                      <div className="text-xs text-berry-700/45">{c.phone}</div>
                    </div>
                    <Badge tone="blush">{c.creams.length} מוצרים</Badge>
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
