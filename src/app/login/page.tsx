'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Crown, Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight, MailCheck, Sparkles,
} from 'lucide-react';

type Mode = 'login' | 'forgot' | 'sent';

function isValidEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  async function submitLogin(e: React.FormEvent) {
    e.preventDefault();
    setErr('');
    if (!isValidEmail(email)) { setErr('כתובת אימייל לא תקינה'); return; }
    if (password.trim().length < 4) { setErr('הסיסמה חייבת להכיל לפחות 4 תווים'); return; }

    setBusy(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await res.json();
      if (!res.ok) { setErr(data.error ?? 'שגיאה בכניסה'); return; }
      router.push('/dashboard');
      router.refresh();
    } catch {
      setErr('שגיאת רשת — נסי שוב');
    } finally {
      setBusy(false);
    }
  }

  function submitForgot(e: React.FormEvent) {
    e.preventDefault();
    setErr('');
    if (!isValidEmail(email)) { setErr('נא להזין אימייל תקין לשליחת הקישור'); return; }
    setBusy(true);
    setTimeout(() => { setBusy(false); setMode('sent'); }, 700);
  }

  const inputCls = 'w-full rounded-2xl border border-blush-200 bg-white px-4 py-2.5 text-[15px] text-berry-800 placeholder:text-berry-700/30 focus:outline-none focus:border-blush-400 focus:ring-4 focus:ring-blush-100 transition';

  return (
    <div className="min-h-screen flex items-center justify-center p-5">
      <div className="fixed -top-24 -right-24 w-96 h-96 rounded-full bg-blush-200/50 blur-3xl pointer-events-none" />
      <div className="fixed -bottom-32 -left-20 w-96 h-96 rounded-full bg-rosegold-300/40 blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md">
        <div className="flex flex-col items-center text-center mb-7 anim-fade-up">
          <span className="grid place-items-center w-16 h-16 rounded-3xl text-white shadow-royal bg-gradient-to-br from-blush-500 via-rosegold-500 to-gold-500 mb-4">
            <Crown size={30} />
          </span>
          <h1 className="font-display text-3xl font-bold text-berry-800">נועה טל-אל</h1>
          <p className="text-berry-700/50 text-sm mt-1">קוסמטיקה מתקדמת · מערכת ניהול</p>
        </div>

        <div className="bg-white/85 backdrop-blur-sm rounded-3xl border border-white shadow-royal-sm p-7 sm:p-8 anim-fade-up" style={{ animationDelay: '80ms' }}>
          {mode === 'login' && (
            <form onSubmit={submitLogin} className="flex flex-col gap-5">
              <div>
                <h2 className="font-display text-2xl font-bold text-berry-800">כניסה לחשבון</h2>
                <p className="text-sm text-berry-700/50 mt-1">היכנסי עם האימייל והסיסמה שלך</p>
              </div>

              <label className="block">
                <span className="block text-[13px] font-semibold text-berry-700/70 mb-1.5">אימייל</span>
                <div className="relative">
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-berry-700/35"><Mail size={18} /></span>
                  <input
                    type="email" dir="ltr" value={email}
                    onChange={e => { setEmail(e.target.value); setErr(''); }}
                    placeholder="name@example.com"
                    className={inputCls + ' pr-11 text-right'}
                    autoComplete="username"
                  />
                </div>
              </label>

              <label className="block">
                <span className="block text-[13px] font-semibold text-berry-700/70 mb-1.5">סיסמה</span>
                <div className="relative">
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-berry-700/35"><Lock size={17} /></span>
                  <input
                    type={showPw ? 'text' : 'password'} dir="ltr" value={password}
                    onChange={e => { setPassword(e.target.value); setErr(''); }}
                    placeholder="••••••••"
                    className={inputCls + ' pr-11 pl-11 text-right'}
                    autoComplete="current-password"
                  />
                  <button type="button" onClick={() => setShowPw(s => !s)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 grid place-items-center w-8 h-8 rounded-lg text-berry-700/40 hover:text-berry-700 hover:bg-blush-50 transition">
                    {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </label>

              <div className="flex justify-start -mt-1">
                <button type="button" onClick={() => { setMode('forgot'); setErr(''); }}
                  className="text-[13px] font-semibold text-blush-600 hover:text-berry-700 transition">
                  שכחת סיסמה?
                </button>
              </div>

              {err && (
                <div className="text-sm text-rose-600 font-medium flex items-center gap-1.5">
                  <AlertCircle size={15} /> {err}
                </div>
              )}

              <button type="submit" disabled={busy}
                className="inline-flex items-center justify-center gap-2 font-semibold rounded-2xl transition-all duration-200 active:scale-[.97] focus:outline-none focus-visible:ring-4 focus-visible:ring-blush-200 disabled:opacity-50 disabled:pointer-events-none text-base px-6 py-3 w-full text-white shadow-royal-sm hover:shadow-royal bg-gradient-to-br from-blush-500 to-rosegold-500 hover:from-blush-600 hover:to-rosegold-600">
                {busy ? 'מתחברת…' : 'כניסה'}
              </button>
            </form>
          )}

          {mode === 'forgot' && (
            <form onSubmit={submitForgot} className="flex flex-col gap-5">
              <button type="button" onClick={() => { setMode('login'); setErr(''); }}
                className="self-start text-[13px] font-semibold text-berry-700/55 hover:text-berry-800 inline-flex items-center gap-1 transition">
                <ArrowRight size={15} /> חזרה לכניסה
              </button>
              <div>
                <h2 className="font-display text-2xl font-bold text-berry-800">איפוס סיסמה</h2>
                <p className="text-sm text-berry-700/50 mt-1">נשלח אלייך קישור לאיפוס הסיסמה לאימייל</p>
              </div>
              <label className="block">
                <span className="block text-[13px] font-semibold text-berry-700/70 mb-1.5">אימייל</span>
                <div className="relative">
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-berry-700/35"><Mail size={18} /></span>
                  <input type="email" dir="ltr" value={email}
                    onChange={e => { setEmail(e.target.value); setErr(''); }}
                    placeholder="name@example.com"
                    className={inputCls + ' pr-11 text-right'} />
                </div>
              </label>
              {err && <div className="text-sm text-rose-600 font-medium flex items-center gap-1.5"><AlertCircle size={15} /> {err}</div>}
              <button type="submit" disabled={busy}
                className="inline-flex items-center justify-center gap-2 font-semibold rounded-2xl transition-all duration-200 active:scale-[.97] disabled:opacity-50 disabled:pointer-events-none text-base px-6 py-3 w-full text-white shadow-royal-sm bg-gradient-to-br from-blush-500 to-rosegold-500 hover:from-blush-600 hover:to-rosegold-600">
                {busy ? 'שולחת…' : 'שליחת קישור לאיפוס'}
              </button>
            </form>
          )}

          {mode === 'sent' && (
            <div className="flex flex-col items-center text-center gap-4 py-2">
              <span className="grid place-items-center w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-500">
                <MailCheck size={30} />
              </span>
              <div>
                <h2 className="font-display text-2xl font-bold text-berry-800">הקישור נשלח!</h2>
                <p className="text-sm text-berry-700/55 mt-2 leading-relaxed">
                  שלחנו קישור לאיפוס הסיסמה אל<br />
                  <strong className="text-berry-800" dir="ltr">{email}</strong>.<br />
                  בדקי את תיבת הדואר שלך ועקבי אחר ההוראות.
                </p>
              </div>
              <button onClick={() => { setMode('login'); setErr(''); }}
                className="inline-flex items-center justify-center gap-2 font-semibold rounded-2xl transition-all duration-200 text-base px-6 py-3 w-full bg-blush-100 text-berry-700 hover:bg-blush-200">
                חזרה לכניסה
              </button>
            </div>
          )}
        </div>

        <p className="text-center text-[12px] text-berry-700/40 mt-6">
          <Sparkles size={11} className="inline ml-1" />
          גרסת הדגמה · 2025 · נועה טל-אל קוסמטיקה
        </p>
      </div>
    </div>
  );
}
