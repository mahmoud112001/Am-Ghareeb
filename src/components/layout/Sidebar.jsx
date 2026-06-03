const navigationItems = [
  { id: 'ai', label: 'اسأل عم غريب', helper: 'AI Chatbot', icon: ChatIcon },
  { id: 'direct', label: 'البحث المباشر', helper: 'Deterministic Search', icon: RouteIcon },
  { id: 'saved', label: 'المحفوظات', helper: 'Pinned Routes', icon: BookmarkIcon },
  { id: 'admin', label: 'لوحة التحكم', helper: 'Admin Overview', icon: DashboardIcon },
];

export default function Sidebar({ currentTab, onTabChange, userName = 'Ahmed Mostafa', savedCount = 0 }) {
  const initials = userName
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-80 border-r border-white/10 bg-slate-950/95 px-5 py-6 text-right shadow-[18px_0_60px_rgba(2,6,23,0.35)] backdrop-blur-xl lg:flex lg:flex-col">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amberTransit-400 to-transit-400 text-xl font-black text-slate-950">
              غ
            </div>
            <div>
              <p className="font-display text-2xl font-bold text-white">عم غريب</p>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Transit AI</p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-300">
            مساعد تنقل ذكي للمواصلات الشعبية، مبني لاقتراحات سريعة ومفهومة.
          </p>
        </div>

        <nav className="mt-6 flex-1 space-y-2" aria-label="Dashboard navigation">
          {navigationItems.map((item) => (
            <SidebarItem
              key={item.id}
              item={item}
              active={currentTab === item.id}
              onClick={() => onTabChange(item.id)}
            />
          ))}
        </nav>

        <div className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-slate-100 to-cyan-300 text-sm font-black text-slate-950">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-white">{userName}</p>
              <p className="text-xs text-slate-400">راكب موثق</p>
            </div>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2 text-xs">
            <span className="text-slate-400">المحفوظات</span>
            <span className="font-bold text-amber-200">{savedCount}</span>
          </div>
        </div>
      </aside>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-slate-950/95 px-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-3 backdrop-blur-xl lg:hidden">
        <div className="mx-auto grid max-w-xl grid-cols-4 gap-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const active = currentTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onTabChange(item.id)}
                className={`flex min-h-16 flex-col items-center justify-center gap-1 rounded-2xl border px-2 py-2 text-center text-[11px] font-bold transition ${
                  active
                    ? 'border-amberTransit-400/40 bg-amberTransit-400/15 text-white'
                    : 'border-white/10 bg-white/5 text-slate-400'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="leading-4">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}

function SidebarItem({ item, active, onClick }) {
  const Icon = item.icon;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center justify-between gap-3 rounded-2xl border px-4 py-4 transition ${
        active
          ? 'border-amberTransit-400/35 bg-gradient-to-r from-amberTransit-400/15 to-transit-400/10 text-white shadow-glow'
          : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:bg-white/10 hover:text-white'
      }`}
    >
      <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${active ? 'bg-white/10' : 'bg-slate-950/70'}`}>
        <Icon className="h-5 w-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-bold">{item.label}</span>
        <span className="mt-1 block text-[11px] uppercase tracking-[0.16em] text-slate-400">{item.helper}</span>
      </span>
    </button>
  );
}

function ChatIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15a4 4 0 0 1-4 4H8l-5 3 1.5-4.5A4 4 0 0 1 2 15V7a4 4 0 0 1 4-4h11a4 4 0 0 1 4 4v8Z" />
      <path d="M7 8h10" />
      <path d="M7 12h6" />
    </svg>
  );
}

function RouteIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 4h6a3 3 0 0 1 3 3v10a3 3 0 0 0 3 3h2" />
      <path d="M16 4h3v3" />
      <path d="m14 10 5-5" />
    </svg>
  );
}

function BookmarkIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 4h10a1 1 0 0 1 1 1v15l-6-3-6 3V5a1 1 0 0 1 1-1Z" />
    </svg>
  );
}

function DashboardIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 4h7v8H4z" />
      <path d="M15 4h5v5h-5z" />
      <path d="M15 13h5v7h-5z" />
      <path d="M4 16h7v4H4z" />
    </svg>
  );
}
