// ===== App shell: right sidebar + routing + state =====

function NavItem({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`relative w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-[15px] font-semibold transition-all duration-200 ${active ?
      'text-white shadow-royal-sm bg-gradient-to-l from-blush-500 to-rosegold-500' :
      'text-berry-700/65 hover:text-berry-800 hover:bg-blush-100/70'}`}>
      
      <Icon name={icon} size={20} />
      <span>{label}</span>
      {active && <span className="absolute left-3 w-1.5 h-1.5 rounded-full bg-white/80" />}
    </button>);

}

function Sidebar({ tab, goTo, onLogout }) {
  const nav = [
  { key: 'dashboard', icon: 'layout-dashboard', label: 'לוח בקרה' },
  { key: 'clients', icon: 'users', label: 'ספר לקוחות' },
  { key: 'inventory', icon: 'package', label: 'מוצרים' }];

  return (
    <aside className="hidden lg:flex flex-col w-72 flex-none p-5 gap-2 border-l border-blush-100 bg-white/55 backdrop-blur-md">
      {/* brand */}
      <div className="flex items-center gap-3 px-2 py-3 mb-2">
        <span className="grid place-items-center w-12 h-12 rounded-2xl text-white shadow-royal bg-gradient-to-br from-blush-500 via-rosegold-500 to-gold-500">
          <Icon name="crown" size={24} />
        </span>
        <div className="leading-tight">
          <div className="font-display text-xl font-bold text-berry-800">נועה טל-אל</div>
          <div className="text-[12px] text-berry-700/45 font-medium">קוסמטיקה מתקדמת</div>
        </div>
      </div>

      <nav className="flex flex-col gap-1.5">
        {nav.map((n) =>
        <div key={n.key} className="relative">
            <NavItem icon={n.icon} label={n.label} active={tab === n.key} onClick={() => goTo(n.key)} />
          </div>
        )}
      </nav>

      <div className="mt-auto flex flex-col gap-2">
        <div className="rounded-3xl p-5 bg-gradient-to-br from-blush-100 to-blush-50 border border-white text-center">
          <span className="grid place-items-center w-11 h-11 rounded-2xl bg-white text-blush-500 mx-auto shadow-royal-sm mb-3"><Icon name="sparkles" size={20} /></span>
          <p className="text-[13px] font-semibold text-berry-800 leading-snug">ניהול קליניקה<br />בנגיעה מלכותית</p>
          <p className="text-[11px] text-berry-700/45 mt-1">גרסת הדגמה · 2025</p>
        </div>
        <button onClick={onLogout} className="flex items-center gap-3 px-4 py-3 rounded-2xl text-[15px] font-semibold text-berry-700/60 hover:text-rose-600 hover:bg-rose-50 transition">
          <Icon name="log-out" size={20} /> התנתקות
        </button>
      </div>
    </aside>);

}

function MobileNav({ tab, goTo }) {
  const nav = [
  { key: 'dashboard', icon: 'layout-dashboard', label: 'בקרה' },
  { key: 'clients', icon: 'users', label: 'לקוחות' },
  { key: 'inventory', icon: 'package', label: 'מוצרים' }];

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 flex justify-around items-center bg-white/90 backdrop-blur-md border-t border-blush-100 px-2 py-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
      {nav.map((n) =>
      <button key={n.key} onClick={() => goTo(n.key)} className={`flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl text-[11px] font-semibold transition ${tab === n.key ? 'text-blush-600' : 'text-berry-700/45'}`}>
          <Icon name={n.icon} size={22} />
          {n.label}
        </button>
      )}
    </nav>);

}

function App() {
  const [user, setUser] = useState(() => {
    try { return localStorage.getItem(window.AUTH_KEY) || null; } catch (_) { return null; }
  });
  const [tab, setTab] = useState('dashboard');
  const [focusId, setFocusId] = useState(null);
  const [clients, setClients] = useState(window.CLIENTS_SEED);
  const [products, setProducts] = useState(window.PRODUCTS_SEED);

  function logout() {
    try { localStorage.removeItem(window.AUTH_KEY); } catch (_) {}
    setUser(null);
    setTab('dashboard');
  }

  function goTo(t, clientId) {
    setTab(t);
    if (clientId) setFocusId(clientId);
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const titles = {
    dashboard: 'לוח בקרה',
    clients: 'ספר לקוחות',
    inventory: 'מוצרים'
  };

  if (!user) {
    return <LoginScreen onAuth={setUser} />;
  }

  return (
    <div className="min-h-screen flex">
      <Sidebar tab={tab} goTo={goTo} onLogout={logout} />

      <main className="flex-1 min-w-0 flex flex-col">
        {/* topbar */}
        <header className="sticky top-0 z-20 flex items-center justify-between gap-4 px-5 sm:px-8 py-4 bg-white/70 backdrop-blur-md border-b border-blush-100">
          <div className="flex items-center gap-3">
            <span className="lg:hidden grid place-items-center w-10 h-10 rounded-2xl text-white bg-gradient-to-br from-blush-500 to-rosegold-500 shadow-royal-sm"><Icon name="crown" size={20} /></span>
            <div className="flex items-center gap-2 text-sm text-berry-700/50">
              <Icon name="crown" size={15} className="hidden sm:block text-gold-500" />
              <span className="hidden sm:inline">נועה. טל-אל קוסמטיקה</span>
              <span className="hidden sm:inline text-berry-700/25">/</span>
              <span className="font-semibold text-berry-800">{titles[tab]}</span>
            </div>
          </div>
        </header>

        {/* content */}
        <div className="flex-1 px-5 sm:px-8 py-6 sm:py-8 pb-28 lg:pb-8 max-w-[1320px] w-full mx-auto">
          {tab === 'dashboard' && <Dashboard clients={clients} products={products} goTo={goTo} />}
          {tab === 'clients' && <Clients clients={clients} products={products} setClients={setClients} focusId={focusId} clearFocus={() => setFocusId(null)} />}
          {tab === 'inventory' && <Inventory products={products} setProducts={setProducts} clients={clients} />}
        </div>
      </main>

      <MobileNav tab={tab} goTo={goTo} />
    </div>);

}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);