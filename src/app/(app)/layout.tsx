'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Crown, LayoutDashboard, Users, Package, Sparkles, LogOut,
} from 'lucide-react';

const NAV = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'לוח בקרה',   short: 'בקרה'   },
  { href: '/clients',   icon: Users,           label: 'ספר לקוחות', short: 'לקוחות' },
  { href: '/inventory', icon: Package,          label: 'מוצרים',     short: 'מוצרים' },
];

const TITLES: Record<string, string> = {
  '/dashboard': 'לוח בקרה',
  '/clients':   'ספר לקוחות',
  '/inventory': 'מוצרים',
};

function NavItem({ href, icon: Icon, label, active }: { href: string; icon: typeof Users; label: string; active: boolean }) {
  return (
    <Link href={href}
      className={`relative w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-[15px] font-semibold transition-all duration-200 ${
        active
          ? 'text-white shadow-royal-sm bg-gradient-to-l from-blush-500 to-rosegold-500'
          : 'text-berry-700/65 hover:text-berry-800 hover:bg-blush-100/70'
      }`}
    >
      <Icon size={20} />
      <span>{label}</span>
      {active && <span className="absolute left-3 w-1.5 h-1.5 rounded-full bg-white/80" />}
    </Link>
  );
}

function Sidebar({ pathname, onLogout }: { pathname: string; onLogout: () => void }) {
  return (
    <aside className="hidden lg:flex flex-col w-72 flex-none p-5 gap-2 border-l border-blush-100 bg-white/55 backdrop-blur-md">
      <div className="flex items-center gap-3 px-2 py-3 mb-2">
        <span className="grid place-items-center w-12 h-12 rounded-2xl text-white shadow-royal bg-gradient-to-br from-blush-500 via-rosegold-500 to-gold-500 flex-none">
          <Crown size={24} />
        </span>
        <div className="leading-tight">
          <div className="font-display text-xl font-bold text-berry-800">נועה טל-אל</div>
          <div className="text-[12px] text-berry-700/45 font-medium">קוסמטיקה מתקדמת</div>
        </div>
      </div>

      <nav className="flex flex-col gap-1.5">
        {NAV.map(n => (
          <NavItem key={n.href} href={n.href} icon={n.icon} label={n.label} active={pathname === n.href} />
        ))}
      </nav>

      <div className="mt-auto flex flex-col gap-2">
        <div className="rounded-3xl p-5 bg-gradient-to-br from-blush-100 to-blush-50 border border-white text-center">
          <span className="grid place-items-center w-11 h-11 rounded-2xl bg-white text-blush-500 mx-auto shadow-royal-sm mb-3">
            <Sparkles size={20} />
          </span>
          <p className="text-[13px] font-semibold text-berry-800 leading-snug">ניהול קליניקה<br />בנגיעה מלכותית</p>
          <p className="text-[11px] text-berry-700/45 mt-1">גרסת הדגמה · 2025</p>
        </div>
        <button onClick={onLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-2xl text-[15px] font-semibold text-berry-700/60 hover:text-rose-600 hover:bg-rose-50 transition">
          <LogOut size={20} /> התנתקות
        </button>
      </div>
    </aside>
  );
}

function MobileNav({ pathname }: { pathname: string }) {
  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 flex justify-around items-center bg-white/90 backdrop-blur-md border-t border-blush-100 px-2 py-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
      {NAV.map(n => (
        <Link key={n.href} href={n.href}
          className={`flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl text-[11px] font-semibold transition ${pathname === n.href ? 'text-blush-600' : 'text-berry-700/45'}`}>
          <n.icon size={22} />
          {n.short}
        </Link>
      ))}
    </nav>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  }

  const title = TITLES[pathname] ?? '';

  return (
    <div className="min-h-screen flex overflow-x-hidden">
      <Sidebar pathname={pathname} onLogout={logout} />

      <main className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-20 flex items-center justify-between gap-4 px-5 sm:px-8 py-4 bg-white/70 backdrop-blur-md border-b border-blush-100">
          <div className="flex items-center gap-3">
            <span className="lg:hidden grid place-items-center w-10 h-10 rounded-2xl text-white bg-gradient-to-br from-blush-500 to-rosegold-500 shadow-royal-sm flex-none">
              <Crown size={20} />
            </span>
            <div className="flex items-center gap-2 text-sm text-berry-700/50">
              <Crown size={15} className="hidden sm:block text-gold-500" />
              <span className="hidden sm:inline">נועה. טל-אל קוסמטיקה</span>
              <span className="hidden sm:inline text-berry-700/25">/</span>
              <span className="font-semibold text-berry-800">{title}</span>
            </div>
          </div>
        </header>

        <div className="flex-1 px-4 sm:px-8 py-6 sm:py-8 pb-28 lg:pb-8 max-w-[1320px] w-full mx-auto">
          {children}
        </div>
      </main>

      <MobileNav pathname={pathname} />
    </div>
  );
}
