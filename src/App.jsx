import { useMemo, useState } from 'react';
import RouteDetailDrawer from './components/dashboard/RouteDetailDrawer';
import Sidebar from './components/layout/Sidebar';

const tabs = {
  ai: 'ai',
  direct: 'direct',
  saved: 'saved',
  admin: 'admin',
};

const stationOptions = [
  'سيدي جابر',
  'بحري',
  'محطة الرمل',
  'ميامي',
  'المندرة',
  'العجمي',
  'ستانلي',
  'سبورتنج',
  'جامعة الإسكندرية',
];

const routes = [
  {
    id: 'corniche',
    lineName: 'خط الكورنيش - ميكروباص',
    category: 'Microbus',
    origin: 'سيدي جابر',
    destination: 'بحري',
    fare: '8 جنيه',
    eta: '18-24 دقيقة',
    verified: true,
    accent: 'from-cyan-400 to-emerald-400',
    stations: ['سيدي جابر', 'سبورتنج', 'رشدي', 'ستانلي', 'بحري'],
    tip: 'وقت الذروة خليك عند الرصيف البحري واسأل على عربية رايحة بحري مباشرة. لو معاك شنط، بلاش أول عربية زحمة وخد اللي بعدها.',
    boardZone: 'اركب من مخرج المحطة ناحية الكورنيش، بعيد عن طابور الأتوبيس العام.',
    mapHint: 'مسار ساحلي طويل مع نزول قريب من منطقة القلعة.',
  },
  {
    id: 'university',
    lineName: 'خط الجامعة - ميكروباص',
    category: 'Microbus',
    origin: 'المندرة',
    destination: 'جامعة الإسكندرية',
    fare: '9 جنيه',
    eta: '26-34 دقيقة',
    verified: true,
    accent: 'from-amberTransit-400 to-orange-500',
    stations: ['المندرة', 'ميامي', 'سيدي بشر', 'سيدي جابر', 'جامعة الإسكندرية'],
    tip: 'لو رايح مجمع الكليات الصبح، اركب بدري عشر دقايق. العربيات بتتملي بسرعة حوالين سيدي بشر.',
    boardZone: 'استنى عند الرصيف الجانبي قبل الزحمة الرئيسية، مش قدام البوابة مباشرة.',
    mapHint: 'فرع شرقي سريع ثم دخول أهدأ ناحية الجامعة.',
  },
  {
    id: 'agami',
    lineName: 'خط العجمي السريع - ميكروباص',
    category: 'Microbus',
    origin: 'العجمي',
    destination: 'محطة الرمل',
    fare: '10 جنيه',
    eta: '35-44 دقيقة',
    verified: false,
    accent: 'from-emerald-400 to-cyan-500',
    stations: ['العجمي', 'الهانوفيل', 'الدخيلة', 'القباري', 'محطة الرمل'],
    tip: 'الخط مناسب لو عايز تدخل وسط البلد بأقل تبديلات، بس راقب الزحمة قبل ما تطلع من العجمي.',
    boardZone: 'اركب من نقطة التجميع الخارجية قبل دمج الطريق الرئيسي.',
    mapHint: 'مسار داخلي أعرض يلف حول مناطق النقل الثقيلة.',
  },
  {
    id: 'downtown',
    lineName: 'خط وسط البلد - ميكروباص',
    category: 'Microbus',
    origin: 'محطة الرمل',
    destination: 'ميامي',
    fare: '7 جنيه',
    eta: '14-20 دقيقة',
    verified: true,
    accent: 'from-sky-400 to-blue-500',
    stations: ['محطة الرمل', 'كوم الدكة', 'سيدي جابر', 'رشدي', 'ميامي'],
    tip: 'اختيار سريع للمشاوير القصيرة، لكن وقت العصر انزل بدري محطة واحدة لو الطريق قافل.',
    boardZone: 'استنى قرب مخرج التاكسي الجانبي علشان تتجنب الزحمة على الطابور الرئيسي.',
    mapHint: 'عمود وسط البلد ثم انحناءة شرقية ناحية ميامي.',
  },
];

const chatSeed = [
  { id: 'a1', role: 'assistant', content: 'أهلا يا غالي. قولّي منين لمين وأنا أرتبلك المشوار من غير لف ودوران.' },
  { id: 'u1', role: 'user', content: 'عايز أروح بحري من سيدي جابر ومعايا شنط.' },
  { id: 'a2', role: 'assistant', content: 'خد خط الكورنيش من برة محطة سيدي جابر. الأجرة حوالي 8 جنيه، وقول للسواق ينزلك قريب من بحري. لو العربية زحمة استنى اللي بعدها علشان الشنط.' },
];

function App() {
  const [currentTab, setCurrentTab] = useState(tabs.ai);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [pinnedRouteIds, setPinnedRouteIds] = useState(['corniche', 'downtown']);
  const [searchForm, setSearchForm] = useState({ origin: 'سيدي جابر', destination: 'بحري' });
  const [messages, setMessages] = useState(chatSeed);
  const [chatDraft, setChatDraft] = useState('');
  const [adminRows, setAdminRows] = useState(routes.map((route) => ({ ...route, lastUpdated: '2026-06-02 09:40' })));

  const pinnedRoutes = useMemo(() => routes.filter((route) => pinnedRouteIds.includes(route.id)), [pinnedRouteIds]);
  const directMatches = useMemo(() => {
    const origin = searchForm.origin;
    const destination = searchForm.destination;
    const matches = routes.filter(
      (route) =>
        route.origin === origin ||
        route.destination === destination ||
        route.stations.includes(origin) ||
        route.stations.includes(destination),
    );

    return matches.length ? matches : routes;
  }, [searchForm]);

  const openRoute = (route) => setSelectedRoute(route);

  const togglePin = (routeId) => {
    setPinnedRouteIds((current) =>
      current.includes(routeId) ? current.filter((id) => id !== routeId) : [...current, routeId],
    );
  };

  const sendMessage = (event) => {
    event.preventDefault();
    const trimmed = chatDraft.trim();

    if (!trimmed) return;

    setMessages((current) => [
      ...current,
      { id: `${Date.now()}-user`, role: 'user', content: trimmed },
      {
        id: `${Date.now()}-assistant`,
        role: 'assistant',
        content: 'تمام يا باشا. أقرب ترشيح عندي هو خط الكورنيش، ومعاه بديل الجامعة لو محتاج تبديل هادي. اضغط على أي توصية وافتح التفاصيل.',
      },
    ]);
    setChatDraft('');
  };

  return (
    <div dir="rtl" className="min-h-screen bg-mesh-dark text-slate-100">
      <Sidebar currentTab={currentTab} onTabChange={setCurrentTab} userName="Ahmed Mostafa" savedCount={pinnedRoutes.length} />

      <main className="flex-1 h-screen overflow-hidden lg:pl-80">
        <div className="h-full overflow-y-auto px-4 pb-28 pt-5 sm:px-6 lg:pb-8 lg:pt-8">
          <div className="mx-auto max-w-7xl space-y-6">
            <HeaderCard currentTab={currentTab} />

            {currentTab === tabs.ai ? (
              <AiChatView
                messages={messages}
                chatDraft={chatDraft}
                onChatDraftChange={setChatDraft}
                onSubmit={sendMessage}
                recommendations={routes.slice(0, 3)}
                onOpenRoute={openRoute}
              />
            ) : null}

            {currentTab === tabs.direct ? (
              <DirectSearchView
                searchForm={searchForm}
                onSearchFormChange={setSearchForm}
                routes={directMatches}
                pinnedRouteIds={pinnedRouteIds}
                onTogglePin={togglePin}
                onOpenRoute={openRoute}
              />
            ) : null}

            {currentTab === tabs.saved ? (
              <RoutesGrid
                title="المحفوظات"
                subtitle="الخطوط المثبتة للمشاوير المتكررة."
                routes={pinnedRoutes.length ? pinnedRoutes : routes.slice(0, 2)}
                pinnedRouteIds={pinnedRouteIds}
                onTogglePin={togglePin}
                onOpenRoute={openRoute}
              />
            ) : null}

            {currentTab === tabs.admin ? (
              <AdminView rows={adminRows} onRowsChange={setAdminRows} onOpenRoute={openRoute} />
            ) : null}
          </div>
        </div>
      </main>

      <RouteDetailDrawer route={selectedRoute} open={Boolean(selectedRoute)} onClose={() => setSelectedRoute(null)} />
    </div>
  );
}

function HeaderCard({ currentTab }) {
  const labels = {
    ai: 'اسأل عم غريب',
    direct: 'البحث المباشر',
    saved: 'المحفوظات',
    admin: 'لوحة التحكم',
  };

  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-glow backdrop-blur-xl">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-amberTransit-200">Am Ghareeb Prototype</p>
          <h1 className="mt-2 font-display text-4xl font-bold text-white">عم غريب</h1>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-300">
            Dashboard modular للمواصلات الشعبية: شات ذكي، بحث مباشر، محفوظات، وإدارة خطوط.
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm">
          <span className="text-slate-400">العرض الحالي</span>
          <p className="mt-1 font-bold text-white">{labels[currentTab]}</p>
        </div>
      </div>
    </section>
  );
}

function AiChatView({ messages, chatDraft, onChatDraftChange, onSubmit, recommendations, onOpenRoute }) {
  return (
    <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
        <div className="h-[28rem] space-y-3 overflow-y-auto rounded-2xl border border-white/10 bg-slate-950/60 p-4">
          {messages.map((message) => (
            <ChatBubble key={message.id} message={message} />
          ))}
        </div>

        <form onSubmit={onSubmit} className="mt-4 flex gap-3">
          <input
            value={chatDraft}
            onChange={(event) => onChatDraftChange(event.target.value)}
            className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-amberTransit-400/50 focus:ring-2 focus:ring-amberTransit-400/20"
            placeholder="اكتب مشوارك هنا..."
          />
          <button type="submit" className="rounded-2xl bg-amberTransit-400 px-5 py-3 text-sm font-black text-slate-950">
            إرسال
          </button>
        </form>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
        <h2 className="text-xl font-bold text-white">ترشيحات قابلة للفتح</h2>
        <p className="mt-2 text-sm leading-6 text-slate-400">اضغط على أي توصية لفتح detail drawer من اليمين.</p>
        <div className="mt-5 space-y-3">
          {recommendations.map((route) => (
            <button
              key={route.id}
              type="button"
              onClick={() => onOpenRoute(route)}
              className="w-full rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-right transition hover:border-amberTransit-400/30 hover:bg-slate-950"
            >
              <p className="font-bold text-white">{route.lineName}</p>
              <p className="mt-1 text-sm text-slate-400">
                {route.origin} إلى {route.destination}
              </p>
              <p className="mt-3 text-sm font-black text-amberTransit-200">{route.fare}</p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function DirectSearchView({ searchForm, onSearchFormChange, routes, pinnedRouteIds, onTogglePin, onOpenRoute }) {
  return (
    <RoutesGrid
      title="البحث المباشر"
      subtitle="اختار نقطة البداية والنهاية وشوف الخطوط المطابقة."
      routes={routes}
      pinnedRouteIds={pinnedRouteIds}
      onTogglePin={onTogglePin}
      onOpenRoute={onOpenRoute}
      toolbar={
        <div className="grid gap-3 md:grid-cols-2">
          <SelectField
            label="من"
            value={searchForm.origin}
            onChange={(value) => onSearchFormChange((current) => ({ ...current, origin: value }))}
          />
          <SelectField
            label="إلى"
            value={searchForm.destination}
            onChange={(value) => onSearchFormChange((current) => ({ ...current, destination: value }))}
          />
        </div>
      }
    />
  );
}

function RoutesGrid({ title, subtitle, routes, pinnedRouteIds, onTogglePin, onOpenRoute, toolbar }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
      <div className="flex flex-col gap-4 border-b border-white/10 pb-5">
        <div>
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">{subtitle}</p>
        </div>
        {toolbar}
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        {routes.map((route) => (
          <RouteCard
            key={route.id}
            route={route}
            pinned={pinnedRouteIds.includes(route.id)}
            onPin={() => onTogglePin(route.id)}
            onOpen={() => onOpenRoute(route)}
          />
        ))}
      </div>
    </section>
  );
}

function RouteCard({ route, pinned, onPin, onOpen }) {
  return (
    <article
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') onOpen();
      }}
      className="cursor-pointer rounded-2xl border border-white/10 bg-slate-950/65 p-5 transition hover:border-amberTransit-400/30 hover:bg-slate-950"
    >
      <div className={`h-2 rounded-full bg-gradient-to-r ${route.accent}`} />
      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">{route.category}</p>
          <h3 className="mt-2 text-xl font-bold text-white">{route.lineName}</h3>
          <p className="mt-2 text-sm text-slate-400">
            {route.origin} إلى {route.destination}
          </p>
        </div>
        <div className="rounded-2xl border border-amberTransit-400/20 bg-amberTransit-400/10 px-4 py-3 text-center">
          <p className="text-xs text-slate-400">الأجرة</p>
          <p className="mt-1 font-black text-amberTransit-100">{route.fare}</p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {route.stations.slice(0, 4).map((station) => (
          <span key={station} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
            {station}
          </span>
        ))}
      </div>
      <div className="mt-5 flex items-center justify-between gap-3">
        <span className="text-sm text-slate-400">{route.eta}</span>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onPin();
          }}
          className={`rounded-xl px-4 py-2 text-sm font-bold ${
            pinned ? 'bg-emerald-400/15 text-emerald-100 ring-1 ring-emerald-400/25' : 'border border-white/10 bg-white/5 text-slate-200'
          }`}
        >
          {pinned ? 'مثبت' : 'حفظ'}
        </button>
      </div>
    </article>
  );
}

function AdminView({ rows, onRowsChange, onOpenRoute }) {
  const toggleVerified = (routeId) => {
    onRowsChange((current) =>
      current.map((row) => (row.id === routeId ? { ...row, verified: !row.verified, lastUpdated: nowStamp() } : row)),
    );
  };

  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
      <h2 className="text-2xl font-bold text-white">لوحة التحكم</h2>
      <p className="mt-2 text-sm leading-6 text-slate-400">نظرة سريعة على الخطوط، السعر، وحالة التحقق.</p>

      <div className="mt-5 overflow-hidden rounded-2xl border border-white/10">
        <table className="min-w-full text-right text-sm">
          <thead className="bg-white/5 text-xs uppercase tracking-[0.16em] text-slate-400">
            <tr>
              <th className="px-4 py-4">الخط</th>
              <th className="px-4 py-4">الأجرة</th>
              <th className="px-4 py-4">آخر تحديث</th>
              <th className="px-4 py-4">إجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10 bg-slate-950/55">
            {rows.map((row) => (
              <tr key={row.id}>
                <td className="px-4 py-4 font-bold text-white">{row.lineName}</td>
                <td className="px-4 py-4 text-amberTransit-100">{row.fare}</td>
                <td className="px-4 py-4 text-slate-400">{row.lastUpdated}</td>
                <td className="px-4 py-4">
                  <div className="flex flex-wrap gap-2">
                    <ActionButton onClick={() => onOpenRoute(row)}>فتح</ActionButton>
                    <ActionButton onClick={() => toggleVerified(row.id)}>{row.verified ? 'إلغاء التحقق' : 'تحقق'}</ActionButton>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function ChatBubble({ message }) {
  const assistant = message.role === 'assistant';

  return (
    <div className={`flex ${assistant ? 'justify-start' : 'justify-end'}`}>
      <div
        className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-7 ${
          assistant ? 'border border-cyan-400/15 bg-cyan-400/10 text-slate-100' : 'bg-amberTransit-400 text-slate-950'
        }`}
      >
        <p className="mb-1 text-xs font-black opacity-80">{assistant ? 'عم غريب' : 'أنت'}</p>
        <p>{message.content}</p>
      </div>
    </div>
  );
}

function SelectField({ label, value, onChange }) {
  return (
    <label className="space-y-2">
      <span className="block text-sm font-bold text-slate-200">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none focus:border-amberTransit-400/50 focus:ring-2 focus:ring-amberTransit-400/20"
      >
        {stationOptions.map((station) => (
          <option key={station} value={station} className="bg-slate-950 text-white">
            {station}
          </option>
        ))}
      </select>
    </label>
  );
}

function ActionButton({ children, onClick }) {
  return (
    <button type="button" onClick={onClick} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-slate-200 transition hover:bg-white/10">
      {children}
    </button>
  );
}

function nowStamp() {
  return new Date().toLocaleString('en-GB', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

export default App;
