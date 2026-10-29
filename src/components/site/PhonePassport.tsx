import { Award, Check, FlaskConical, Leaf, MapPin, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";
import bottle from "@/assets/oil-bottle.jpg";

export function PhoneShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative mx-auto w-[280px]">
      <div className="absolute -inset-10 rounded-full bg-gold/20 blur-3xl" />
      <div className="relative rounded-[3rem] bg-ink p-2.5 shadow-[0_60px_120px_-40px_oklch(0.2_0.05_70/80%)] ring-1 ring-black/20">
        <div className="relative h-[560px] overflow-hidden rounded-[2.4rem] bg-background">
          <div className="absolute left-1/2 top-2.5 z-20 h-6 w-24 -translate-x-1/2 rounded-full bg-ink" />
          {children}
        </div>
      </div>
    </div>
  );
}

export function PassportScreen() {
  return (
    <>
      <div className="relative h-48">
        <img src={bottle} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/10 to-transparent" />
        <span className="absolute right-3 top-10 inline-flex items-center gap-1 rounded-full bg-white/85 px-2 py-0.5 text-[10px] font-medium text-success backdrop-blur">
          <ShieldCheck className="h-3 w-3" /> Authentic
        </span>
      </div>
      <div className="-mt-6 px-5">
        <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-gold">
          Domaine Zitouna · Sfax
        </p>
        <p className="mt-1 font-display text-xl leading-tight">Extra Virgin Olive Oil</p>
        <p className="text-xs text-muted-foreground">Chemlali Early Harvest 2025 · 750 ml</p>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {[
            ["Origin", "Sfax"],
            ["Acidity", "0.21%"],
            ["Score", "8.2"],
          ].map(([k, v]) => (
            <div key={k} className="rounded-xl border border-border bg-card p-2 text-center">
              <p className="text-[9px] text-muted-foreground">{k}</p>
              <p className="font-display text-sm">{v}</p>
            </div>
          ))}
        </div>
        <p className="mt-5 font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
          Journey
        </p>
        <ol className="relative mt-2 space-y-3 border-l border-gold/40 pl-4">
          {[
            [Leaf, "Harvest", "Agareb · Nov 18"],
            [FlaskConical, "Lab approved", "ONH Sfax · Dec 04"],
            [MapPin, "Delivered", "Rotterdam · Mar 15"],
          ].map(([I, t, d]) => {
            const Icon = I as typeof Leaf;
            return (
              <li key={t as string} className="relative">
                <span className="absolute -left-[23px] top-0.5 grid h-3.5 w-3.5 place-items-center rounded-full bg-gold text-white">
                  <Check className="h-2 w-2" />
                </span>
                <p className="flex items-center gap-1.5 text-xs font-semibold">
                  <Icon className="h-3 w-3 text-gold" /> {t as string}
                </p>
                <p className="text-[10px] text-muted-foreground">{d as string}</p>
              </li>
            );
          })}
        </ol>
        <div className="mt-4 flex items-center gap-2 rounded-xl bg-surface-2 p-2.5 text-[10px]">
          <Award className="h-3.5 w-3.5 text-gold" /> Organic · IGP Sfax · Fair Trade
        </div>
      </div>
    </>
  );
}

export function PhonePassport() {
  return (
    <PhoneShell>
      <PassportScreen />
    </PhoneShell>
  );
}
