// ===== Product catalog (מלאי מוצרים) — name only =====

function ProductForm({ initial, products, onClose, onSave }) {
  const editing = !!initial;
  const [name, setName] = useState(initial?.name || '');
  const [err, setErr] = useState('');

  function submit() {
    const v = name.trim();
    if (!v) { setErr('נא להזין שם מוצר'); return; }
    const dup = products.some(p => p.name === v && p.id !== initial?.id);
    if (dup) { setErr('מוצר בשם זה כבר קיים'); return; }
    onSave({ id: initial?.id || 'p' + Date.now(), name: v });
  }

  return (
    <Modal open={true} onClose={onClose} max="max-w-md">
      <ModalHeader
        icon={editing ? 'pencil' : 'plus'}
        title={editing ? 'עריכת מוצר' : 'הוספת מוצר חדש'}
        subtitle={editing ? 'עדכון שם המוצר' : 'הוספת קרם חדש לקטלוג'}
        onClose={onClose}
      />
      <div className="p-7 flex flex-col gap-5">
        <Field label="שם המוצר">
          <TextInput
            autoFocus
            value={name}
            onChange={e => { setName(e.target.value); setErr(''); }}
            onKeyDown={e => { if (e.key === 'Enter') submit(); }}
            placeholder="לדוגמה: סרום ויטמין C"
          />
        </Field>
        {err && <div className="text-sm text-rose-600 font-medium flex items-center gap-1.5"><Icon name="alert-circle" size={15} /> {err}</div>}
      </div>
      <div className="flex items-center justify-end gap-2.5 px-7 py-5 border-t border-blush-100 bg-blush-50/40">
        <Button variant="ghost" onClick={onClose}>ביטול</Button>
        <Button variant="primary" icon="check" onClick={submit}>{editing ? 'שמירת שינויים' : 'הוספת מוצר'}</Button>
      </div>
    </Modal>
  );
}

function ProductCard({ p, usage, onEdit, onDelete }) {
  return (
    <Card className="group p-5 flex items-center gap-4 hover:shadow-royal hover:-translate-y-0.5 transition-all duration-300 anim-fade-up">
      <span className="grid place-items-center w-12 h-12 rounded-2xl flex-none text-white shadow-royal-sm bg-gradient-to-br from-blush-400 to-rosegold-400">
        <Icon name="flower-2" size={22} />
      </span>
      <div className="flex-1 min-w-0">
        <div className="font-display text-lg font-bold text-berry-800 leading-tight">{p.name}</div>
        <div className="text-[13px] text-berry-700/50 flex items-center gap-1.5 mt-0.5">
          <Icon name="users" size={13} />
          {usage > 0 ? `${usage} לקוחות משתמשות` : 'לא בשימוש עדיין'}
        </div>
      </div>
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition flex-none">
        <button onClick={() => onEdit(p)} className="grid place-items-center w-9 h-9 rounded-xl text-berry-700/50 hover:text-berry-800 hover:bg-blush-100 transition"><Icon name="pencil" size={16} /></button>
        <button onClick={() => onDelete(p)} className="grid place-items-center w-9 h-9 rounded-xl text-berry-700/50 hover:text-rose-500 hover:bg-rose-50 transition"><Icon name="trash-2" size={16} /></button>
      </div>
    </Card>
  );
}

function Inventory({ products, setProducts, clients }) {
  const [form, setForm] = useState(undefined);
  const [confirmDel, setConfirmDel] = useState(null);
  const [search, setSearch] = useState('');

  const q = search.trim().toLowerCase();
  const shown = products.filter(p => !q || p.name.toLowerCase().includes(q));

  function saveProduct(data) {
    setProducts(ps => {
      const exists = ps.some(p => p.id === data.id);
      return exists ? ps.map(p => p.id === data.id ? data : p) : [data, ...ps];
    });
    setForm(undefined);
  }
  function deleteProduct(p) { setProducts(ps => ps.filter(x => x.id !== p.id)); setConfirmDel(null); }

  return (
    <div data-tab-enter className="flex flex-col gap-6">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-berry-800">מוצרים</h1>
          <p className="text-berry-700/55 mt-1">{products.length} מוצרים בקטלוג · ניהול הקרמים של הקליניקה</p>
        </div>
        <Button variant="primary" icon="plus" onClick={() => setForm(null)}>הוספת מוצר</Button>
      </div>

      {/* search */}
      <Card className="p-4">
        <div className="relative">
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-berry-700/35"><Icon name="search" size={18} /></span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="חיפוש מוצר…"
            className={inputCls + ' pr-11'}
          />
        </div>
      </Card>

      {shown.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {shown.map(p => (
            <ProductCard
              key={p.id}
              p={p}
              usage={window.clientsUsing(p.name, clients)}
              onEdit={setForm}
              onDelete={setConfirmDel}
            />
          ))}
        </div>
      ) : (
        <Card><EmptyState icon="package-search" title="לא נמצאו מוצרים" sub="נסי חיפוש אחר, או הוסיפי מוצר חדש לקטלוג." /></Card>
      )}

      {form !== undefined && (
        <ProductForm initial={form} products={products} onClose={() => setForm(undefined)} onSave={saveProduct} />
      )}

      {confirmDel && (
        <Modal open={true} onClose={() => setConfirmDel(null)} max="max-w-md">
          <div className="p-7 text-center">
            <span className="grid place-items-center w-14 h-14 rounded-2xl bg-rose-50 text-rose-500 mx-auto mb-4"><Icon name="trash-2" size={26} /></span>
            <h2 className="font-display text-2xl font-bold text-berry-800">מחיקת מוצר</h2>
            <p className="text-berry-700/60 mt-2">האם למחוק את <strong className="text-berry-800">{confirmDel.name}</strong> מהקטלוג?</p>
            <div className="flex gap-2.5 justify-center mt-6">
              <Button variant="ghost" onClick={() => setConfirmDel(null)}>ביטול</Button>
              <Button variant="danger" icon="trash-2" onClick={() => deleteProduct(confirmDel)}>כן, מחקי</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

Object.assign(window, { Inventory });
