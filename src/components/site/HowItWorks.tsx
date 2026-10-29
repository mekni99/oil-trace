import { useEffect, useState, type ReactNode } from "react";
import { Camera, Check, Link2, MapPin, ScanLine, ShieldCheck, Smartphone, Sprout } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useInView } from "@/components/site/Reveal";
import grove from "@/assets/hero-grove.jpg";
import premiumBottle from "@/assets/Premium Tunisian Olive Oil Bottle.png";

const steps = [
  { icon: Sprout, t: "Capture at source", d: "Farms, mills and factories log events from any device — GPS, photos, lab files. Works offline in the field and syncs when back online." },
  { icon: Link2, t: "Anchor on-chain", d: "Each event is hashed and sealed on a public ledger, linked to the previous one. Any later edit breaks the chain and is flagged — tamper-evident forever." },
  { icon: ScanLine, t: "Print the passport", d: "A unique, serialized QR code links each physical unit to its digital twin. GS1 Digital Link compatible, ready for any label printer." },
  { icon: ShieldCheck, t: "Consumers verify", d: "One scan with any phone camera reveals origin, journey, certifications and impact — no app to install, in the shopper's own language." },
];

function Frame({ children }: { children: ReactNode }) {
  return <div className="w-full max-w-sm rounded-3xl border border-border bg-card p-6 shadow-card">{children}</div>;
}

function Visual({ i }: { i: number }) {
  if (i === 0)
    return (
      <Frame>
        <div className="flex items-center justify-between"><p className="text-sm font-semibold">New harvest event</p><span className="rounded-full bg-accent px-2 py-0.5 font-mono text-[10px] text-accent-foreground">DRAFT</span></div>
        <div className="relative mt-4 overflow-hidden rounded-2xl">
          <img src={grove} alt="" className="h-32 w-full object-cover" />
          <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-full bg-white/85 px-2 py-0.5 text-[10px] backdrop-blur"><Camera className="h-3 w-3" /> 3 photos</span>
        </div>
        <dl className="mt-4 space-y-2.5 text-sm">
          {[["Parcel", "P-14 · Agareb"], ["Variety", "Chemlali"], ["Quantity", "12,400 kg"]].map(([k, v]) => (
            <div key={k} className="flex justify-between"><dt className="text-muted-foreground">{k}</dt><dd className="font-medium">{v}</dd></div>
          ))}
          <div className="flex justify-between"><dt className="text-muted-foreground">GPS</dt><dd className="inline-flex items-center gap-1 font-mono text-xs"><MapPin className="h-3 w-3 text-gold" /> 34.7406, 10.7603</dd></div>
        </dl>
      </Frame>
    );
  if (i === 1)
    return (
      <div className="w-full max-w-sm space-y-3">
        {[["#4,812,328", "Harvest", "0x0c44…2be8"], ["#4,812,329", "Cold extraction", "0x1a2f…09c4"], ["#4,812,330", "Lab approved", "0x5c92…b3d1"]].map(([b, e, h], k) => (
          <div key={b} className="relative">
            <div className={`flex items-center justify-between rounded-2xl border bg-card p-4 shadow-card ${k === 2 ? "border-gold/50 ring-4 ring-gold/10" : "border-border"}`}>
              <div><p className="font-mono text-[10px] text-muted-foreground">Block {b}</p><p className="text-sm font-semibold">{e}</p></div>
              <span className="font-mono text-xs text-gold">{h}</span>
            </div>
            {k < 2 && <div className="mx-auto h-3 w-0.5 bg-gold-gradient" />}
          </div>
        ))}
        <p className="flex items-center justify-center gap-1.5 pt-1 text-xs text-success"><Check className="h-3.5 w-3.5" /> Chain integrity verified</p>
      </div>
    );
  if (i === 2)
    return (
      <div className="relative flex justify-center">
        <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/15 blur-3xl" />
        <div className="relative">
          <img src={premiumBottle} alt="Olive oil bottle with a serialized QR passport label" className="h-72 w-auto drop-shadow-[0_24px_28px_oklch(0.3_0.06_70/30%)] sm:h-80 lg:h-96" />
          <span className="animate-pulse-ring absolute left-[55.5%] top-[69.5%] h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-md border-2 border-gold/80" />
          <div className="absolute -left-16 bottom-8 -rotate-3 rounded-xl border border-border bg-cream/95 p-3 shadow-card backdrop-blur">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-white p-1.5 text-ink ring-1 ring-border"><QRCodeSVG value="https://veritrace.app/p/ZTN-EVOO-2026-0417" size={56} bgColor="transparent" fgColor="currentColor" /></div>
              <div className="font-mono text-[10px]">
                <p className="uppercase tracking-wider text-gold">Passport</p>
                <p className="mt-1 font-semibold text-foreground">SN ZTN-0417</p>
                <p className="text-muted-foreground">LOT 26-04</p>
                <p className="text-muted-foreground">BB 2027-11</p>
              </div>
            </div>
          </div>
          <span className="absolute -right-10 top-10 rotate-2 rounded-full border border-border bg-card/95 px-3 py-1 font-mono text-[10px] text-muted-foreground shadow-card backdrop-blur">GS1 Digital Link</span>
        </div>
      </div>
    );
  return (
    <Frame>
      <div className="flex flex-col items-center text-center">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-success/12 text-success ring-8 ring-success/5"><ShieldCheck className="h-8 w-8" /></span>
        <p className="mt-4 font-display text-2xl">Authentic product</p>
        <p className="text-sm text-muted-foreground">7 of 7 events match the ledger</p>
      </div>
      <div className="mt-5 flex items-center justify-between rounded-xl bg-surface-2 px-4 py-3 text-xs">
        <span className="inline-flex items-center gap-1.5"><Smartphone className="h-3.5 w-3.5 text-gold" /> Scanned in Rotterdam</span>
        <span className="text-muted-foreground">just now</span>
      </div>
    </Frame>
  );
}

function Step({ i, active, onEnter }: { i: number; active: boolean; onEnter: (i: number) => void }) {
  const [ref, inView] = useInView<HTMLLIElement>("-45% 0px -45% 0px", false);
  useEffect(() => { if (inView) onEnter(i); }, [inView, i, onEnter]);
  const s = steps[i];
  return (
    <li ref={ref} className="flex min-h-[46vh] flex-col justify-center py-10 lg:min-h-[60vh]">
      <div className={`transition-opacity duration-500 ${active ? "lg:opacity-100" : "lg:opacity-35"}`}>
        <div className="flex items-center gap-3">
          <span className={`grid h-11 w-11 place-items-center rounded-xl transition-colors ${active ? "bg-gold-gradient text-ink shadow-glow" : "bg-accent text-accent-foreground"}`}><s.icon className="h-5 w-5" /></span>
          <span className="font-mono text-xs text-muted-foreground">0{i + 1} / 0{steps.length}</span>
        </div>
        <h3 className="mt-6 text-3xl md:text-4xl">{s.t}</h3>
        <p className="mt-4 max-w-md text-muted-foreground">{s.d}</p>
        <div className="mt-8 flex justify-center lg:hidden"><Visual i={i} /></div>
      </div>
    </li>
  );
}

export function HowItWorks() {
  const [active, setActive] = useState(0);
  return (
    <section id="how" className="mx-auto max-w-7xl scroll-mt-20 px-6 py-28">
      <div className="max-w-2xl">
        <p className="eyebrow">02 · How it works</p>
        <h2 className="mt-4 text-4xl text-balance md:text-6xl">From the first harvest to the final scan.</h2>
        <p className="mt-5 text-muted-foreground">A universal traceability engine. Sectors plug in their own data model — the chain of custody, proofs and consumer experience stay the same.</p>
      </div>
      <div className="mt-10 grid gap-16 lg:grid-cols-2">
        <ol>{steps.map((_, i) => <Step key={i} i={i} active={active === i} onEnter={setActive} />)}</ol>
        <div className="hidden lg:block">
          <div className="sticky top-24 flex h-[calc(100vh-8rem)] items-center justify-center">
            <div className="absolute inset-6 rounded-[2.5rem] border border-border bg-surface-2/60" />
            <div className="absolute left-1/2 top-12 flex -translate-x-1/2 gap-2">
              {steps.map((_, i) => <span key={i} className={`h-1.5 rounded-full transition-all duration-500 ${active === i ? "w-8 bg-gold" : "w-1.5 bg-border"}`} />)}
            </div>
            <div key={active} className="relative flex w-full justify-center animate-in fade-in zoom-in-95 duration-500">
              <Visual i={active} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
