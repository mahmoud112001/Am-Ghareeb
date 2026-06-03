export default function RouteDetailDrawer({ route, open, onClose }) {
  return (
    <div className={`fixed inset-0 z-50 ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}>
      <button
        type="button"
        aria-label="Close route details"
        onClick={onClose}
        className={`absolute inset-0 bg-slate-950/65 backdrop-blur-sm transition-opacity duration-300 ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
      />

      <aside
        dir="rtl"
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-white/10 bg-slate-950 shadow-[0_30px_90px_rgba(2,6,23,0.65)] transition-transform duration-300 ease-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="border-b border-white/10 px-5 py-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-amberTransit-200">تفاصيل الخط</p>
              <h2 className="mt-2 text-2xl font-bold leading-8 text-white">{route?.lineName || 'اختار خط'}</h2>
              {route ? (
                <p className="mt-2 text-sm text-slate-400">
                  {route.origin} إلى {route.destination}
                </p>
              ) : null}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-200 transition hover:bg-white/10 hover:text-white"
            >
              <CloseIcon />
            </button>
          </div>

          {route ? (
            <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-amberTransit-400/20 bg-amberTransit-400/10 px-4 py-3">
              <span className="text-sm font-semibold text-amberTransit-100">الأجرة المتوقعة</span>
              <span className="text-2xl font-black text-amberTransit-100">{route.fare}</span>
            </div>
          ) : null}
        </div>

        {route ? (
          <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
            <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-white">محطات الطريق</h3>
                  <p className="mt-1 text-xs text-slate-400">منطقة ركوب، توقفات وسيطة، ثم النزول</p>
                </div>
                <Badge>{route.eta}</Badge>
              </div>

              <div dir="ltr" className="relative border-l border-white/15 pl-6">
                {route.stations.map((station, index) => (
                  <div key={`${route.id}-${station}`} className="relative pb-6 last:pb-0">
                    <span className="absolute -left-[31px] top-0 flex h-4 w-4 rounded-full bg-slate-950 ring-4 ring-amberTransit-400/35">
                      <span className="m-auto h-2 w-2 rounded-full bg-amberTransit-300" />
                    </span>
                    <div dir="rtl">
                      <p className="text-sm font-bold text-white">{station}</p>
                      <p className="mt-1 text-xs text-slate-400">
                        {index === 0 ? 'ركوب' : index === route.stations.length - 1 ? 'نزول' : `توقف ${index + 1}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-amberTransit-400/20 bg-amberTransit-400/10 p-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-sm font-bold text-amberTransit-50">نصيحة عم غريب</h3>
                <Badge tone="amber">Street-smart</Badge>
              </div>
              <p className="mt-3 text-sm leading-7 text-amberTransit-50">{route.tip}</p>
              <p className="mt-3 rounded-xl border border-amberTransit-300/20 bg-slate-950/30 px-3 py-2 text-sm leading-7 text-amberTransit-50/90">
                {route.boardZone}
              </p>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-white">خريطة مبسطة</h3>
                  <p className="mt-1 text-xs text-slate-400">CSS/SVG mock map بلا APIs مدفوعة</p>
                </div>
                <Badge tone="emerald">Zero-cost</Badge>
              </div>

              <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-slate-950 p-3">
                <div className="relative h-60 rounded-xl bg-[linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:28px_28px]">
                  <div className="absolute left-4 top-4 rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-3 py-2 text-xs font-bold text-cyan-100">
                    ركوب
                  </div>
                  <div className="absolute bottom-4 right-4 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-xs font-bold text-emerald-100">
                    نزول
                  </div>

                  <svg viewBox="0 0 360 240" className="absolute inset-0 h-full w-full" aria-hidden="true">
                    <path
                      d="M35 190 C 80 150, 118 168, 148 128 S 205 82, 248 104 S 304 154, 330 68"
                      fill="none"
                      stroke="rgba(245,158,11,0.22)"
                      strokeWidth="16"
                      strokeLinecap="round"
                    />
                    <path
                      d="M35 190 C 80 150, 118 168, 148 128 S 205 82, 248 104 S 304 154, 330 68"
                      fill="none"
                      stroke="rgba(45,212,191,0.9)"
                      strokeWidth="5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle cx="35" cy="190" r="8" fill="#fbbf24" />
                    <circle cx="330" cy="68" r="8" fill="#34d399" />
                    <circle cx="148" cy="128" r="5" fill="rgba(255,255,255,0.86)" />
                    <circle cx="248" cy="104" r="5" fill="rgba(255,255,255,0.86)" />
                  </svg>

                  <p className="absolute bottom-4 left-4 max-w-[12rem] rounded-xl border border-white/10 bg-slate-950/85 px-3 py-2 text-xs leading-5 text-slate-300">
                    {route.mapHint}
                  </p>
                </div>
              </div>
            </section>
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center px-5 text-center">
            <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-6">
              <p className="font-bold text-white">لسه مفيش خط مفتوح</p>
              <p className="mt-2 text-sm leading-7 text-slate-400">اضغط على أي كارت خط أو توصية من الشات لفتح التفاصيل.</p>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}

function Badge({ children, tone = 'slate' }) {
  const tones = {
    slate: 'border-white/10 bg-white/5 text-slate-300',
    amber: 'border-amberTransit-400/20 bg-amberTransit-400/10 text-amberTransit-100',
    emerald: 'border-emerald-400/20 bg-emerald-400/10 text-emerald-100',
  };

  return <span className={`rounded-full border px-3 py-1 text-xs font-bold ${tones[tone]}`}>{children}</span>;
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m6 6 12 12" />
      <path d="M18 6 6 18" />
    </svg>
  );
}
