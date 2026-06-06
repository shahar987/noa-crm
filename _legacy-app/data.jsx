// ===== Mock data + helpers for the Royal Princess CRM =====

const PRODUCTS_SEED = [
  { id: 'p1', name: 'סרום ויטמין C מאיר' },
  { id: 'p2', name: 'קרם לחות יוקרתי' },
  { id: 'p3', name: 'רטינול לילה אקטיבי' },
  { id: 'p4', name: 'מסכת זהב 24K' },
  { id: 'p5', name: 'קרם הגנה SPF50' },
  { id: 'p6', name: 'אמפולות חומצה היאלורונית' },
];

const CLIENTS_SEED = [
  {
    id: 'c1',
    name: 'נועה לוי',
    phone: '052-1234567',
    since: 'לקוחה מאז 2023',
    creams: ['סרום ויטמין C מאיר', 'קרם הגנה SPF50'],
    notes: 'רגישות לרטינול — להימנע לחלוטין. עור יבש מאוד, נדרשת לחות מוגברת בחורף. אוהבת מרקמים קלים.',
    nextAppt: '2026-06-12T14:30',
    photos: [
      { id: 'ph1', date: '12.01.2025', label: 'לפני' },
      { id: 'ph2', date: '12.03.2025', label: 'אחרי' },
    ],
  },
  {
    id: 'c2',
    name: 'מיכל כהן',
    phone: '054-7654321',
    since: 'לקוחה מאז 2024',
    creams: ['קרם לחות יוקרתי', 'מסכת זהב 24K'],
    notes: 'עור מעורב, נטייה לפצעונים באזור ה-T. אלרגיה לבישומים — להשתמש במוצרים ללא ריח בלבד.',
    photos: [
      { id: 'ph3', date: '03.02.2025', label: 'לפני' },
    ],
  },
  {
    id: 'c3',
    name: 'שירה אברהם',
    phone: '053-9988776',
    since: 'לקוחה מאז 2022',
    creams: ['רטינול לילה אקטיבי', 'סרום ויטמין C מאיר', 'מסכת זהב 24K'],
    notes: 'טיפול אנטי-אייג׳ינג ממוקד. עור רגיש לשמש — חובה הגנה יומית. מגיבה מצוין לרטינול.',
    nextAppt: '2026-06-08T10:00',
    photos: [
      { id: 'ph4', date: '20.11.2024', label: 'לפני' },
      { id: 'ph5', date: '20.01.2025', label: 'ביניים' },
      { id: 'ph6', date: '20.03.2025', label: 'אחרי' },
    ],
  },
  {
    id: 'c4',
    name: 'תמר פרידמן',
    phone: '050-3344556',
    since: 'לקוחה חדשה',
    creams: ['מסכת זהב 24K'],
    notes: 'הכנת עור לאירוע (חתונה). מעוניינת בזוהר מיידי וטיפול אינטנסיבי בחודש הקרוב.',
    photos: [],
  },
];

// ---- helpers ----
// how many clients currently use a given product (by name)
function clientsUsing(productName, clients) {
  return clients.filter(c => c.creams.includes(productName)).length;
}

Object.assign(window, {
  PRODUCTS_SEED, CLIENTS_SEED, clientsUsing,
});
