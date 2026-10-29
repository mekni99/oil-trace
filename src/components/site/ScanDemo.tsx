import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowRight,
  Check,
  Loader2,
  RotateCcw,
  ScanLine,
  Smartphone,
  ShieldCheck,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal, useInView } from "@/components/site/Reveal";
import { PassportScreen, PhoneShell } from "@/components/site/PhonePassport";
import premiumBottle from "@/assets/Premium Tunisian Olive Oil Bottle.png";

type Phase = "idle" | "scanning" | "verifying" | "done";
type Scenario = "real" | "fake";

const checks: Record<Scenario, { ok: boolean; text: string }[]> = {
  real: [
    { ok: true, text: "Serial matched · ZTN-EVOO-2026-0417" },
    { ok: true, text: "Chain integrity · 7/7 events" },
    { ok: true, text: "Issuers signed · ONH Lab, ECOCERT" },
  ],
  fake: [
    { ok: true, text: "Serial found · ZTN-EVOO-2026-0417" },
    { ok: false, text: "Clone detected · scanned 47× in 3 countries" },
    { ok: false, text: "Chain broken · event 05 re-signed" },
  ],
};

const status: Record<Phase, Record<Scenario, string>> = {
  idle: { real: "Point at a Veritrace QR", fake: "Point at a Veritrace QR" },
  scanning: { real: "Reading QR…", fake: "Reading QR…" },
  verifying: { real: "Checking ledger proofs…", fake: "Checking ledger proofs…" },
  done: { real: "Authentic — passport opened", fake: "Counterfeit flagged — brand alerted" },
};

function Viewfinder({ active }: { active: boolean }) {
  const c = `absolute h-4 w-4 transition-colors duration-300 ${active ? "border-gold" : "border-cream/80"}`;
  return (
    <div className="absolute left-[55.5%] top-[69.5%] h-14 w-14 -translate-x-1/2 -translate-y-1/2">
      <span className={`${c} left-0 top-0 rounded-tl-md border-l-2 border-t-2`} />
      <span className={`${c} right-0 top-0 rounded-tr-md border-r-2 border-t-2`} />
      <span className={`${c} bottom-0 left-0 rounded-bl-md border-b-2 border-l-2`} />
      <span className={`${c} bottom-0 right-0 rounded-br-md border-b-2 border-r-2`} />
      {active && (
        <div className="absolute inset-1 overflow-hidden rounded-sm">
          <div className="animate-scan absolute inset-x-0 h-0.5 bg-gold-gradient shadow-glow" />
        </div>
      )}
      {active && (
        <span className="animate-pulse-ring absolute inset-0 rounded-md border-2 border-gold/80" />
      )}
    </div>
  );
}

function CounterfeitScreen() {
  return (
    <div className="flex h-full flex-col bg-[#2a1110] px-6 pb-6 pt-16 text-center text-cream">
      <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-destructive/20 text-destructive ring-8 ring-destructive/10">
        <AlertTriangle className="h-8 w-8" />
      </span>
      <p className="mt-5 font-mono text-[9px] uppercase tracking-[0.22em] text-destructive">
        Alert · serialized unit
      </p>
      <p className="mt-2 font-display text-2xl leading-tight">Counterfeit suspected</p>
      <p className="mt-2 text-xs text-cream/70">
        This QR copies a genuine serial — but the scan pattern doesn't.
      </p>
      <dl className="mt-6 space-y-2.5 rounded-2xl bg-white/5 p-4 text-left text-[11px] ring-1 ring-white/10">
        {[
          ["Serial claimed", "ZTN-EVOO-2026-0417"],
          ["Scans recorded", "47× · 3 countries"],
          ["Last genuine scan", "Rotterdam, NL · 2h ago"],
          ["Chain status", "Broken at event 05 · Bottling"],
        ].map(([k, v]) => (
          <div key={k} className="flex items-baseline justify-between gap-3">
            <dt className="text-cream/50">{k}</dt>
            <dd className="font-mono text-right">{v}</dd>
          </div>
        ))}
      </dl>
      <button className="mt-5 w-full rounded-full bg-destructive py-2.5 text-xs font-semibold text-destructive-foreground">
        Report this unit
      </button>
      <p className="mt-3 text-[10px] text-cream/50">
        Scan logged · Domaine Zitouna notified in real time
      </p>
    </div>
  );
}

function ScanPhone() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [scenario, setScenario] = useState<Scenario>("real");
  const [ref, inView] = useInView<HTMLDivElement>("0px 0px -25% 0px");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const start = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [
      setTimeout(() => setPhase("verifying"), 1600),
      setTimeout(() => setPhase("done"), 3700),
    ];
    setPhase("scanning");
  }, []);

  const switchScenario = (s: Scenario) => {
    if (s === scenario) return;
    timers.current.forEach(clearTimeout);
    setScenario(s);
    setPhase("idle");
    timers.current.push(setTimeout(start, 450));
  };

  useEffect(() => {
    if (inView) timers.current.push(setTimeout(start, 700));
  }, [inView, start]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const verifying = phase === "verifying" || phase === "done";
  const failed = scenario === "fake";

  return (
    <div ref={ref} className="flex flex-col items-center">
      <PhoneShell>
        {/* Camera feed */}
        <button
          type="button"
          onClick={phase === "idle" ? start : undefined}
          aria-label="Simulate a passport scan"
          className={`absolute inset-0 block h-full w-full bg-ink text-left ${phase === "idle" ? "cursor-pointer" : "cursor-default"}`}
        >
          <img
            src={premiumBottle}
            alt=""
            className="absolute left-1/2 top-1/2 h-[430px] w-auto -translate-x-1/2 -translate-y-1/2 opacity-90"
          />
          <span className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <Viewfinder active={phase === "scanning"} />
          </span>
          <span className="absolute left-4 top-10 font-mono text-[9px] uppercase tracking-[0.22em] text-cream/70">
            Veritrace · scan
          </span>
          <span
            role="status"
            className="absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-ink/70 px-3.5 py-1.5 text-[10px] font-medium text-cream backdrop-blur"
          >
            {phase === "idle" ? (
              <span className="inline-flex items-center gap-1.5">
                <Smartphone className="h-3 w-3 text-gold" /> Tap to scan
              </span>
            ) : (
              status[phase][scenario]
            )}
          </span>
        </button>

        {/* On-chain verification sheet */}
        <div
          className={`absolute inset-x-0 bottom-0 z-10 rounded-t-3xl border-t bg-card/95 p-4 pb-6 shadow-card backdrop-blur transition-transform duration-500 ${phase === "verifying" ? "translate-y-0" : "translate-y-full"} ${failed ? "border-destructive/40" : "border-border"}`}
        >
          <p
            className={`flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.22em] ${failed ? "text-destructive" : "text-gold"}`}
          >
            <Loader2 className="h-3 w-3 animate-spin" /> Verifying on-chain
          </p>
          <ul className="mt-3 space-y-2">
            {checks[scenario].map((c, i) => (
              <li
                key={c.text}
                className={`flex items-center gap-2 text-[11px] transition-all duration-500 ${verifying ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"}`}
                style={{ transitionDelay: `${300 + i * 400}ms` }}
              >
                <span
                  className={`grid h-4 w-4 shrink-0 place-items-center rounded-full ${c.ok ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"}`}
                >
                  {c.ok ? <Check className="h-2.5 w-2.5" /> : <X className="h-2.5 w-2.5" />}
                </span>
                {c.text}
              </li>
            ))}
          </ul>
        </div>

        {/* Result slides in once verified */}
        <div
          className={`absolute inset-0 z-10 bg-background transition-transform duration-700 ease-[cubic-bezier(0.2,0.7,0.2,1)] ${phase === "done" ? "translate-y-0" : "translate-y-full"}`}
        >
          {failed ? <CounterfeitScreen /> : <PassportScreen />}
        </div>
      </PhoneShell>

      {/* Scenario switch */}
      <div className="mt-8 flex rounded-full border border-border bg-card p-1 shadow-card">
        {(
          [
            ["real", ShieldCheck, "Authentic bottle"],
            ["fake", AlertTriangle, "Counterfeit unit"],
          ] as const
        ).map(([k, I, l]) => (
          <button
            key={k}
            onClick={() => switchScenario(k)}
            className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
              scenario === k
                ? k === "real"
                  ? "bg-success text-white"
                  : "bg-destructive text-destructive-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <I className="h-3.5 w-3.5" /> {l}
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
        <Button variant="outline" size="sm" className="rounded-full bg-card" onClick={start}>
          <RotateCcw className="h-3.5 w-3.5" /> Replay scan
        </Button>
        <Button asChild size="sm" className="rounded-full">
          <Link to="/passport">
            Open full passport <ArrowRight />
          </Link>
        </Button>
      </div>
    </div>
  );
}

const demoSteps = [
  { icon: Smartphone, t: "Camera opens", d: "Any smartphone, nothing to install." },
  {
    icon: ScanLine,
    t: "QR resolves on-chain",
    d: "Serial, chain integrity and issuer signatures checked live.",
  },
  {
    icon: ShieldCheck,
    t: "Genuine — or flagged",
    d: "Cloned serials are caught instantly and the brand is alerted.",
  },
];

export function ScanDemo() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="grid items-center gap-14 lg:grid-cols-2">
        <Reveal>
          <p className="eyebrow">01 · Live demo</p>
          <h2 className="mt-4 text-4xl text-balance md:text-6xl">
            Point, scan,
            <br />
            <em className="text-gold-gradient">believe.</em>
          </h2>
          <p className="mt-5 max-w-md text-muted-foreground">
            This is the exact flow your customers live — no app, no account. The QR resolves against
            the ledger and the verified passport opens. Flip to the counterfeit unit to see what a
            clone looks like.
          </p>
          <ol className="mt-10 space-y-5">
            {demoSteps.map((s, i) => (
              <li key={s.t} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent text-accent-foreground">
                    <s.icon className="h-5 w-5" />
                  </span>
                  {i < demoSteps.length - 1 && <span className="mt-2 w-px flex-1 bg-border" />}
                </div>
                <div className="pb-1">
                  <p className="flex items-baseline gap-2 font-semibold">
                    <span className="font-mono text-[10px] text-gold">0{i + 1}</span> {s.t}
                  </p>
                  <p className="mt-0.5 text-sm text-muted-foreground">{s.d}</p>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>
        <Reveal delay={150} className="flex justify-center">
          <ScanPhone />
        </Reveal>
      </div>
    </section>
  );
}
