// ===== Client Directory (ספר לקוחות) =====

// ---- WhatsApp helpers ----
// Build a wa.me link from an Israeli phone number (leading 0 -> 972).
function waLink(phone) {
  let d = (phone || '').replace(/\D/g, '');
  if (!d) return null;
  if (d.startsWith('0')) d = '972' + d.slice(1);
  else if (!d.startsWith('972')) d = '972' + d;
  return 'https://wa.me/' + d;
}

function openWhatsApp(phone, e) {
  if (e) e.stopPropagation();
  const url = waLink(phone);
  if (url) window.open(url, '_blank', 'noopener');
}

function WhatsAppGlyph({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
    </svg>
  );
}

// round pink WhatsApp button — opens chat to the client's number
function WhatsAppButton({ phone, size = 36 }) {
  return (
    <button
      onClick={(e) => openWhatsApp(phone, e)}
      title="פתיחת וואטסאפ"
      aria-label="פתיחת וואטסאפ"
      className="grid place-items-center rounded-full flex-none text-white shadow-royal-sm hover:shadow-royal hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
      style={{ width: size, height: size, background: 'linear-gradient(135deg, #f0a6c5, #d97a9f)' }}
    >
      <WhatsAppGlyph size={size * 0.52} />
    </button>
  );
}

// ---- Inline next-appointment picker (no edit mode) ----
const HE_DAYS = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];

function formatAppt(v) {
  const d = new Date(v);
  if (isNaN(d.getTime())) return '';
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const mn = String(d.getMinutes()).padStart(2, '0');
  return `יום ${HE_DAYS[d.getDay()]} · ${dd}.${mm} · ${hh}:${mn}`;
}

function isPast(v) {
  const d = new Date(v);
  return !isNaN(d.getTime()) && d.getTime() < Date.now();
}

function AppointmentPicker({ value, onChange }) {
  const inputRef = useRef(null);
  const has = !!value;
  const past = has && isPast(value);

  function openPicker(e) {
    e.stopPropagation();
    const el = inputRef.current;
    if (!el) return;
    if (typeof el.showPicker === 'function') { try { el.showPicker(); return; } catch (_) {} }
    el.focus();
    el.click();
  }

  const tone = !has
    ? 'border-dashed border-blush-300 text-berry-700/55 bg-white hover:border-blush-400 hover:text-blush-600 hover:bg-blush-50'
    : past
      ? 'border-amber-200 text-amber-700 bg-amber-50'
      : 'border-transparent text-white bg-gradient-to-l from-blush-500 to-rosegold-500 shadow-royal-sm';

  return (
    <div className="relative inline-flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        onClick={openPicker}
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[13px] font-semibold border transition ${tone}`}
      >
        <Icon name="calendar-clock" size={15} />
        {has ? formatAppt(value) : 'קביעת תור הבא'}
        {has && <Icon name="chevron-down" size={13} className="opacity-70" />}
      </button>

      {has && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onChange(''); }}
          title="ביטול התור"
          className="grid place-items-center w-6 h-6 rounded-full text-berry-700/40 hover:text-rose-500 hover:bg-rose-50 transition"
        >
          <Icon name="x" size={14} />
        </button>
      )}

      {/* native picker — visually hidden, opened programmatically */}
      <input
        ref={inputRef}
        type="datetime-local"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        onClick={(e) => e.stopPropagation()}
        className="absolute opacity-0 w-0 h-0 pointer-events-none"
        tabIndex={-1}
        aria-hidden="true"
      />
    </div>
  );
}

// ---- Progress photo placeholder card ----
function ProgressPhoto({ photo, onRemove }) {
  const labelTone = {
    'לפני': 'bg-rosegold-400',
    'אחרי': 'bg-emerald-500',
    'ביניים': 'bg-gold-500',
  }[photo.label] || 'bg-blush-500';
  return (
    <div className="group relative rounded-2xl overflow-hidden ring-1 ring-blush-100 anim-scale-in">
      <div className="stripe-ph aspect-square grid place-items-center">
        <span className="font-mono text-[10px] text-berry-700/35 tracking-wide">progress photo</span>
      </div>
      <div className="absolute top-2 right-2">
        <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold text-white shadow-sm ${labelTone}`}>{photo.label}</span>
      </div>
      <div className="absolute inset-x-0 bottom-0 px-2.5 py-1.5 bg-gradient-to-t from-berry-900/70 to-transparent">
        <span className="text-[11px] font-medium text-white/90 flex items-center gap-1">
          <Icon name="calendar" size={11} /> {photo.date}
        </span>
      </div>
      {onRemove && (
        <button onClick={onRemove} className="absolute top-2 left-2 grid place-items-center w-6 h-6 rounded-lg bg-white/85 text-rose-500 opacity-0 group-hover:opacity-100 transition hover:bg-white">
          <Icon name="trash-2" size={13} />
        </button>
      )}
    </div>
  );
}

// ---- Client profile modal ----
function ClientProfile({ client, products, onClose, onEdit, onAddPhoto, onRemovePhoto, onSetAppt }) {
  const fileRef = useRef(null);
  const labels = ['לפני', 'ביניים', 'אחרי'];

  function handleFile(e) {
    if (e.target.files && e.target.files.length) {
      const today = new Date().toLocaleDateString('he-IL').replaceAll('/', '.');
      const nextLabel = labels[Math.min(client.photos.length, labels.length - 1)];
      onAddPhoto(client.id, { id: 'ph' + Date.now(), date: today, label: nextLabel });
      e.target.value = '';
    }
  }

  return (
    <Modal open={true} onClose={onClose} max="max-w-3xl">
      {/* header */}
      <div className="relative px-7 pt-7 pb-6 bg-gradient-to-l from-blush-100 via-blush-50 to-white border-b border-blush-100">
        <button onClick={onClose} className="absolute top-5 left-5 grid place-items-center w-9 h-9 rounded-xl text-berry-700/50 hover:text-berry-800 hover:bg-white/70 transition">
          <Icon name="x" size={20} />
        </button>
        <div className="flex items-center gap-4">
          <Avatar name={client.name} size={64} />
          <div className="min-w-0">
            <h2 className="font-display text-3xl font-bold text-berry-800 leading-tight">{client.name}</h2>
            <div className="flex items-center gap-3 mt-1.5 text-sm text-berry-700/60">
              <span className="inline-flex items-center gap-1.5"><Icon name="phone" size={14} /> {client.phone}</span>
              <span className="w-1 h-1 rounded-full bg-berry-700/25" />
              <span className="inline-flex items-center gap-1.5"><Icon name="sparkles" size={14} /> {client.since}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-7 flex flex-col gap-7 max-h-[60vh] overflow-y-auto">
        {/* next appointment */}
        <section>
          <h3 className="text-[13px] font-bold uppercase tracking-wide text-berry-700/45 mb-3 flex items-center gap-2">
            <Icon name="calendar-clock" size={15} /> תור הבא
          </h3>
          <AppointmentPicker value={client.nextAppt} onChange={(v) => onSetAppt(client.id, v)} />
        </section>
        {/* assigned creams */}
        <section>
          <h3 className="text-[13px] font-bold uppercase tracking-wide text-berry-700/45 mb-3 flex items-center gap-2">
            <Icon name="flower-2" size={15} /> מוצרים בשימוש
          </h3>
          <div className="flex flex-wrap gap-2">
            {client.creams.length ? client.creams.map(c => <Tag key={c}>{c}</Tag>)
              : <span className="text-sm text-berry-700/40">אין מוצרים משויכים עדיין</span>}
          </div>
        </section>

        {/* notes */}
        <section>
          <h3 className="text-[13px] font-bold uppercase tracking-wide text-berry-700/45 mb-3 flex items-center gap-2">
            <Icon name="notebook-pen" size={15} /> הערות ורגישויות
          </h3>
          <div className="rounded-2xl bg-blush-50/70 border border-blush-100 px-5 py-4 text-[15px] leading-relaxed text-berry-800">
            {client.notes || <span className="text-berry-700/40">לא הוזנו הערות.</span>}
          </div>
        </section>

        {/* progress photos */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[13px] font-bold uppercase tracking-wide text-berry-700/45 flex items-center gap-2">
              <Icon name="images" size={15} /> תמונות התקדמות
              <span className="text-berry-700/30">· {client.photos.length}</span>
            </h3>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
            <Button size="sm" variant="soft" icon="upload" onClick={() => fileRef.current && fileRef.current.click()}>
              העלאת תמונת התקדמות
            </Button>
          </div>
          {client.photos.length ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {client.photos.map(ph => (
                <ProgressPhoto key={ph.id} photo={ph} onRemove={() => onRemovePhoto(client.id, ph.id)} />
              ))}
              <button
                onClick={() => fileRef.current && fileRef.current.click()}
                className="aspect-square rounded-2xl border-2 border-dashed border-blush-200 text-blush-400 grid place-items-center hover:border-blush-400 hover:text-blush-500 hover:bg-blush-50 transition"
              >
                <span className="flex flex-col items-center gap-1">
                  <Icon name="image-plus" size={22} />
                  <span className="text-[11px] font-semibold">הוספה</span>
                </span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => fileRef.current && fileRef.current.click()}
              className="w-full rounded-2xl border-2 border-dashed border-blush-200 text-berry-700/50 grid place-items-center py-10 hover:border-blush-400 hover:bg-blush-50 transition"
            >
              <span className="flex flex-col items-center gap-2">
                <Icon name="image-plus" size={28} className="text-blush-400" />
                <span className="text-sm font-medium">לחצי כאן להעלאת תמונת לפני/אחרי ראשונה</span>
              </span>
            </button>
          )}
        </section>
      </div>

      <div className="flex items-center justify-end gap-2.5 px-7 py-5 border-t border-blush-100 bg-blush-50/40">
        <Button variant="outline" icon="pencil" onClick={() => onEdit(client)}>עריכת פרטים</Button>
        <Button
          variant="primary"
          className="!from-[#25D366] !to-[#128C7E] hover:!from-[#1ebe5a] hover:!to-[#0f7a6d]"
          onClick={(e) => openWhatsApp(client.phone, e)}
        >
          <WhatsAppGlyph size={18} /> שליחת וואטסאפ
        </Button>
      </div>
    </Modal>
  );
}

// ---- Searchable multi-select dropdown for creams ----
function CreamSelect({ products, value, onChange }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const boxRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    function onDoc(e) { if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false); }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);
  useEffect(() => { if (open && searchRef.current) searchRef.current.focus(); }, [open]);

  function toggle(name) {
    onChange(value.includes(name) ? value.filter(c => c !== name) : [...value, name]);
  }

  const q = query.trim().toLowerCase();
  const filtered = products.filter(p => p.name.toLowerCase().includes(q));

  return (
    <div ref={boxRef} className="relative">
      {/* trigger / selected tags */}
      <div
        onClick={() => setOpen(o => !o)}
        className={`min-h-[48px] w-full rounded-2xl border bg-white px-3 py-2 flex items-center flex-wrap gap-1.5 cursor-pointer transition ${open ? 'border-blush-400 ring-4 ring-blush-100' : 'border-blush-200 hover:border-blush-300'}`}
      >
        {value.length === 0 && (
          <span className="text-berry-700/35 text-[15px] px-1">בחרי מוצרים מהרשימה…</span>
        )}
        {value.map(name => (
          <span key={name} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[13px] font-medium bg-blush-50 text-berry-700 ring-1 ring-inset ring-blush-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rosegold-400" />
            {name}
            <span
              role="button"
              onClick={(e) => { e.stopPropagation(); toggle(name); }}
              className="text-berry-700/40 hover:text-rose-500 transition-colors -ml-0.5 cursor-pointer"
            >
              <Icon name="x" size={13} />
            </span>
          </span>
        ))}
        <span className="ml-auto text-berry-700/35 pr-1 pointer-events-none">
          <Icon name={open ? 'chevron-up' : 'chevron-down'} size={18} />
        </span>
      </div>

      {/* dropdown panel */}
      {open && (
        <div className="absolute z-20 mt-2 w-full rounded-2xl bg-white border border-blush-100 shadow-royal anim-scale-in overflow-hidden">
          <div className="p-2.5 border-b border-blush-50">
            <div className="relative">
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-berry-700/35"><Icon name="search" size={16} /></span>
              <input
                ref={searchRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="חיפוש מוצר…"
                className="w-full rounded-xl border border-blush-200 bg-white pr-9 pl-3 py-2 text-[14px] text-berry-800 placeholder:text-berry-700/30 focus:outline-none focus:border-blush-400 focus:ring-4 focus:ring-blush-100 transition"
              />
            </div>
          </div>
          <ul className="max-h-56 overflow-y-auto py-1.5">
            {filtered.length === 0 && (
              <li className="px-4 py-6 text-center text-sm text-berry-700/40">לא נמצאו מוצרים תואמים</li>
            )}
            {filtered.map(p => {
              const on = value.includes(p.name);
              return (
                <li key={p.id}>
                  <button
                    type="button"
                    onClick={() => toggle(p.name)}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-right transition ${on ? 'bg-blush-50' : 'hover:bg-blush-50/60'}`}
                  >
                    <span className={`grid place-items-center w-5 h-5 rounded-md flex-none ring-1 ring-inset transition ${on ? 'bg-gradient-to-br from-blush-500 to-rosegold-500 ring-transparent text-white' : 'bg-white ring-blush-200'}`}>
                      {on && <Icon name="check" size={13} />}
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="block text-[14px] font-medium text-berry-800 truncate">{p.name}</span>
                    </span>
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

// ---- Add / Edit client form modal ----
function ClientForm({ initial, products, onClose, onSave }) {
  const editing = !!initial;
  const [name, setName] = useState(initial?.name || '');
  const [phone, setPhone] = useState(initial?.phone || '');
  const [notes, setNotes] = useState(initial?.notes || '');
  const [creams, setCreams] = useState(initial?.creams || []);
  const [err, setErr] = useState('');

  function toggleCream(name) {
    setCreams(cs => cs.includes(name) ? cs.filter(c => c !== name) : [...cs, name]);
  }
  function submit() {
    if (!name.trim()) { setErr('נא להזין שם מלא'); return; }
    onSave({
      id: initial?.id || 'c' + Date.now(),
      name: name.trim(),
      phone: phone.trim() || '—',
      since: initial?.since || 'לקוחה חדשה',
      creams,
      notes: notes.trim(),
      photos: initial?.photos || [],
    });
  }

  return (
    <Modal open={true} onClose={onClose}>
      <ModalHeader
        icon={editing ? 'pencil' : 'user-plus'}
        title={editing ? 'עריכת לקוחה' : 'הוספת לקוחה חדשה'}
        subtitle={editing ? 'עדכון פרטי הלקוחה' : 'מילוי כרטיס לקוחה חדש בספר'}
        onClose={onClose}
      />
      <div className="p-7 flex flex-col gap-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
          <TextArea rows={4} value={notes} onChange={e => setNotes(e.target.value)} placeholder="תיעוד רגישויות, סוג עור, העדפות והנחיות טיפול…" />
        </Field>

        {err && <div className="text-sm text-rose-600 font-medium flex items-center gap-1.5"><Icon name="alert-circle" size={15} /> {err}</div>}
      </div>
      <div className="flex items-center justify-end gap-2.5 px-7 py-5 border-t border-blush-100 bg-blush-50/40">
        <Button variant="ghost" onClick={onClose}>ביטול</Button>
        <Button variant="primary" icon="check" onClick={submit}>{editing ? 'שמירת שינויים' : 'הוספת לקוחה'}</Button>
      </div>
    </Modal>
  );
}

// ---- Client card ----
function ClientCard({ client, onOpen, onEdit, onDelete, onSetAppt }) {
  return (
    <Card className="group p-5 hover:shadow-royal hover:-translate-y-0.5 transition-all duration-300 flex flex-col anim-fade-up">
      <div className="flex items-start gap-3.5">
        <Avatar name={client.name} size={52} />
        <div className="flex-1 min-w-0">
          <button onClick={() => onOpen(client)} className="font-display text-lg font-bold text-berry-800 hover:text-blush-600 transition text-right leading-tight">
            {client.name}
          </button>
          <div className="text-[13px] text-berry-700/50 flex items-center gap-1.5 mt-0.5" dir="ltr" style={{ justifyContent: 'flex-end' }}>
            {client.phone} <Icon name="phone" size={12} />
          </div>
        </div>
        <div className="flex items-center gap-1">
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
            <button onClick={() => onEdit(client)} className="grid place-items-center w-8 h-8 rounded-xl text-berry-700/50 hover:text-berry-800 hover:bg-blush-100 transition"><Icon name="pencil" size={15} /></button>
            <button onClick={() => onDelete(client)} className="grid place-items-center w-8 h-8 rounded-xl text-berry-700/50 hover:text-rose-500 hover:bg-rose-50 transition"><Icon name="trash-2" size={15} /></button>
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

      <div className="mt-3.5 flex items-center gap-2">
        <span className="text-[12px] font-semibold text-berry-700/45 flex-none">תור הבא:</span>
        <AppointmentPicker value={client.nextAppt} onChange={(v) => onSetAppt(client.id, v)} />
      </div>

      <div className="flex items-center justify-between mt-4 pt-3.5 border-t border-blush-100">
        <span className="text-xs text-berry-700/45 inline-flex items-center gap-1.5">
          <Icon name="images" size={13} /> {client.photos.length} תמונות התקדמות
        </span>
        <button onClick={() => onOpen(client)} className="text-sm font-semibold text-blush-600 hover:text-berry-700 inline-flex items-center gap-1 transition">
          לכרטיס <Icon name="arrow-left" size={14} />
        </button>
      </div>
    </Card>
  );
}

// ---- Main directory view ----
function Clients({ clients, products, setClients, focusId, clearFocus }) {
  const [search, setSearch] = useState('');
  const [creamFilter, setCreamFilter] = useState('');
  const [openClient, setOpenClient] = useState(null);
  const [formClient, setFormClient] = useState(undefined); // undefined=closed, null=new, obj=edit
  const [confirmDel, setConfirmDel] = useState(null);

  // open profile when focused from elsewhere
  useEffect(() => {
    if (focusId) {
      const c = clients.find(c => c.id === focusId);
      if (c) setOpenClient(c);
      clearFocus && clearFocus();
    }
  }, [focusId]);

  // keep open profile synced with state updates
  const liveOpen = openClient ? clients.find(c => c.id === openClient.id) : null;

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return clients.filter(c => {
      const matchQ = !q || c.name.toLowerCase().includes(q) || c.phone.includes(q);
      const matchCream = !creamFilter || c.creams.includes(creamFilter);
      return matchQ && matchCream;
    });
  }, [clients, search, creamFilter]);

  function saveClient(data) {
    setClients(cs => {
      const exists = cs.some(c => c.id === data.id);
      return exists ? cs.map(c => c.id === data.id ? data : c) : [data, ...cs];
    });
    setFormClient(undefined);
  }
  function deleteClient(c) {
    setClients(cs => cs.filter(x => x.id !== c.id));
    setConfirmDel(null);
    if (openClient && openClient.id === c.id) setOpenClient(null);
  }
  function addPhoto(clientId, photo) {
    setClients(cs => cs.map(c => c.id === clientId ? { ...c, photos: [...c.photos, photo] } : c));
  }
  function removePhoto(clientId, photoId) {
    setClients(cs => cs.map(c => c.id === clientId ? { ...c, photos: c.photos.filter(p => p.id !== photoId) } : c));
  }
  function setAppointment(clientId, value) {
    setClients(cs => cs.map(c => c.id === clientId ? { ...c, nextAppt: value || undefined } : c));
  }

  return (
    <div data-tab-enter className="flex flex-col gap-6">
      {/* header */}
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-berry-800">ספר לקוחות</h1>
          <p className="text-berry-700/55 mt-1">{clients.length} לקוחות בקליניקה · {filtered.length} מוצגות</p>
        </div>
        <Button variant="primary" icon="user-plus" onClick={() => setFormClient(null)}>הוספת לקוחה</Button>
      </div>

      {/* search + filter */}
      <Card className="p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-berry-700/35"><Icon name="search" size={18} /></span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="חיפוש לפי שם או טלפון…"
            className={inputCls + ' pr-11'}
          />
        </div>
        <div className="relative sm:w-72">
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-berry-700/35"><Icon name="filter" size={17} /></span>
          <select
            value={creamFilter}
            onChange={e => setCreamFilter(e.target.value)}
            className={inputCls + ' pr-11 appearance-none cursor-pointer'}
          >
            <option value="">סינון לפי קרם — הכל</option>
            {products.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
          </select>
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-berry-700/35 pointer-events-none"><Icon name="chevron-down" size={16} /></span>
        </div>
        {(search || creamFilter) && (
          <Button variant="ghost" icon="x" onClick={() => { setSearch(''); setCreamFilter(''); }}>נקה</Button>
        )}
      </Card>

      {/* active filter chip */}
      {creamFilter && (
        <div className="-mt-2 flex items-center gap-2 text-sm text-berry-700/60">
          <Icon name="info" size={15} />
          מציג לקוחות שמשתמשות ב־<strong className="text-berry-800">{creamFilter}</strong>
        </div>
      )}

      {/* grid */}
      {filtered.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map(c => (
            <ClientCard key={c.id} client={c} onOpen={setOpenClient} onEdit={setFormClient} onDelete={setConfirmDel} onSetAppt={setAppointment} />
          ))}
        </div>
      ) : (
        <Card><EmptyState icon="user-search" title="לא נמצאו לקוחות" sub="נסי לשנות את החיפוש או הסינון, או הוסיפי לקוחה חדשה." /></Card>
      )}

      {/* profile modal */}
      {liveOpen && (
        <ClientProfile
          client={liveOpen}
          products={products}
          onClose={() => setOpenClient(null)}
          onEdit={(c) => { setOpenClient(null); setFormClient(c); }}
          onAddPhoto={addPhoto}
          onRemovePhoto={removePhoto}
          onSetAppt={setAppointment}
        />
      )}

      {/* form modal */}
      {formClient !== undefined && (
        <ClientForm initial={formClient} products={products} onClose={() => setFormClient(undefined)} onSave={saveClient} />
      )}

      {/* delete confirm */}
      {confirmDel && (
        <Modal open={true} onClose={() => setConfirmDel(null)} max="max-w-md">
          <div className="p-7 text-center">
            <span className="grid place-items-center w-14 h-14 rounded-2xl bg-rose-50 text-rose-500 mx-auto mb-4"><Icon name="trash-2" size={26} /></span>
            <h2 className="font-display text-2xl font-bold text-berry-800">מחיקת לקוחה</h2>
            <p className="text-berry-700/60 mt-2">האם למחוק את <strong className="text-berry-800">{confirmDel.name}</strong> לצמיתות? פעולה זו אינה הפיכה.</p>
            <div className="flex gap-2.5 justify-center mt-6">
              <Button variant="ghost" onClick={() => setConfirmDel(null)}>ביטול</Button>
              <Button variant="danger" icon="trash-2" onClick={() => deleteClient(confirmDel)}>כן, מחקי</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

Object.assign(window, { Clients });
