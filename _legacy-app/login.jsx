// ===== Login gate (email + password, forgot password — no registration) =====

const AUTH_KEY = 'noa_auth';

function isValidEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

function LoginScreen({ onAuth }) {
  const [mode, setMode] = useState('login'); // login | forgot | sent
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  function submitLogin(e) {
    e && e.preventDefault();
    setErr('');
    if (!isValidEmail(email)) { setErr('כתובת אימייל לא תקינה'); return; }
    if (password.trim().length < 4) { setErr('הסיסמה חייבת להכיל לפחות 4 תווים'); return; }
    setBusy(true);
    setTimeout(() => {
      try { localStorage.setItem(AUTH_KEY, email.trim()); } catch (_) {}
      setBusy(false);
      onAuth(email.trim());
    }, 650);
  }

  function submitForgot(e) {
    e && e.preventDefault();
    setErr('');
    if (!isValidEmail(email)) { setErr('נא להזין אימייל תקין לשליחת הקישור'); return; }
    setBusy(true);
    setTimeout(() => { setBusy(false); setMode('sent'); }, 700);
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-5">
      {/* decorative glows */}
      <div className="fixed -top-24 -right-24 w-96 h-96 rounded-full bg-blush-200/50 blur-3xl pointer-events-none" />
      <div className="fixed -bottom-32 -left-20 w-96 h-96 rounded-full bg-rosegold-300/40 blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md">
        {/* brand */}
        <div className="flex flex-col items-center text-center mb-7 anim-fade-up">
          <span className="grid place-items-center w-16 h-16 rounded-3xl text-white shadow-royal bg-gradient-to-br from-blush-500 via-rosegold-500 to-gold-500 mb-4">
            <Icon name="crown" size={30} />
          </span>
          <h1 className="font-display text-3xl font-bold text-berry-800">נועה טל-אל</h1>
          <p className="text-berry-700/50 text-sm mt-1">קוסמטיקה מתקדמת · מערכת ניהול</p>
        </div>

        <Card className="p-7 sm:p-8 anim-fade-up" style={{ animationDelay: '80ms' }}>
          {mode === 'login' && (
            <form onSubmit={submitLogin} className="flex flex-col gap-5">
              <div>
                <h2 className="font-display text-2xl font-bold text-berry-800">כניסה לחשבון</h2>
                <p className="text-sm text-berry-700/50 mt-1">היכנסי עם האימייל והסיסמה שלך</p>
              </div>

              <Field label="אימייל">
                <div className="relative">
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-berry-700/35"><Icon name="mail" size={18} /></span>
                  <input
                    type="email" dir="ltr" value={email}
                    onChange={e => { setEmail(e.target.value); setErr(''); }}
                    placeholder="name@example.com"
                    className={inputCls + ' pr-11 text-right'}
                    autoComplete="username"
                  />
                </div>
              </Field>

              <Field label="סיסמה">
                <div className="relative">
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-berry-700/35"><Icon name="lock" size={17} /></span>
                  <input
                    type={showPw ? 'text' : 'password'} dir="ltr" value={password}
                    onChange={e => { setPassword(e.target.value); setErr(''); }}
                    placeholder="••••••••"
                    className={inputCls + ' pr-11 pl-11 text-right'}
                    autoComplete="current-password"
                  />
                  <button type="button" onClick={() => setShowPw(s => !s)} className="absolute left-3 top-1/2 -translate-y-1/2 grid place-items-center w-8 h-8 rounded-lg text-berry-700/40 hover:text-berry-700 hover:bg-blush-50 transition">
                    <Icon name={showPw ? 'eye-off' : 'eye'} size={17} />
                  </button>
                </div>
              </Field>

              <div className="flex justify-start -mt-1">
                <button type="button" onClick={() => { setMode('forgot'); setErr(''); }} className="text-[13px] font-semibold text-blush-600 hover:text-berry-700 transition">
                  שכחת סיסמה?
                </button>
              </div>

              {err && <div className="text-sm text-rose-600 font-medium flex items-center gap-1.5"><Icon name="alert-circle" size={15} /> {err}</div>}

              <Button type="submit" variant="primary" size="lg" className="w-full" disabled={busy}>
                {busy ? 'מתחברת…' : 'כניסה'}
              </Button>
            </form>
          )}

          {mode === 'forgot' && (
            <form onSubmit={submitForgot} className="flex flex-col gap-5">
              <button type="button" onClick={() => { setMode('login'); setErr(''); }} className="self-start text-[13px] font-semibold text-berry-700/55 hover:text-berry-800 inline-flex items-center gap-1 transition">
                <Icon name="arrow-right" size={15} /> חזרה לכניסה
              </button>
              <div>
                <h2 className="font-display text-2xl font-bold text-berry-800">איפוס סיסמה</h2>
                <p className="text-sm text-berry-700/50 mt-1">נשלח אלייך קישור לאיפוס הסיסמה לאימייל</p>
              </div>

              <Field label="אימייל">
                <div className="relative">
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-berry-700/35"><Icon name="mail" size={18} /></span>
                  <input
                    type="email" dir="ltr" value={email}
                    onChange={e => { setEmail(e.target.value); setErr(''); }}
                    placeholder="name@example.com"
                    className={inputCls + ' pr-11 text-right'}
                  />
                </div>
              </Field>

              {err && <div className="text-sm text-rose-600 font-medium flex items-center gap-1.5"><Icon name="alert-circle" size={15} /> {err}</div>}

              <Button type="submit" variant="primary" size="lg" className="w-full" disabled={busy}>
                {busy ? 'שולחת…' : 'שליחת קישור לאיפוס'}
              </Button>
            </form>
          )}

          {mode === 'sent' && (
            <div className="flex flex-col items-center text-center gap-4 py-2">
              <span className="grid place-items-center w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-500"><Icon name="mail-check" size={30} /></span>
              <div>
                <h2 className="font-display text-2xl font-bold text-berry-800">הקישור נשלח!</h2>
                <p className="text-sm text-berry-700/55 mt-2 leading-relaxed">
                  שלחנו קישור לאיפוס הסיסמה אל<br />
                  <strong className="text-berry-800" dir="ltr">{email}</strong>.<br />
                  בדקי את תיבת הדואר שלך ועקבי אחר ההוראות.
                </p>
              </div>
              <Button variant="soft" size="lg" className="w-full" onClick={() => { setMode('login'); setErr(''); }}>
                חזרה לכניסה
              </Button>
            </div>
          )}
        </Card>

        <p className="text-center text-[12px] text-berry-700/40 mt-6">גרסת הדגמה · 2025 · נועה טל-אל קוסמטיקה</p>
      </div>
    </div>
  );
}

Object.assign(window, { LoginScreen, AUTH_KEY });
