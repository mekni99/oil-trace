import { useEffect, useRef, useState } from "react";
import {
  Award,
  Boxes,
  Check,
  Factory,
  FileCheck2,
  FlaskConical,
  Leaf,
  Smartphone,
  Truck,
} from "lucide-react";
import { Reveal, useInView } from "@/components/site/Reveal";

const pool = [
  { icon: Leaf, e: "Harvest logged", by: "Parcel P-14 · Agareb, TN" },
  { icon: Factory, e: "Cold extraction signed", by: "Moulin El Bousten · Sfax" },
  { icon: FlaskConical, e: "Lab report anchored", by: "ONH Laboratory · Sfax" },
  { icon: Smartphone, e: "Passport scanned", by: "Rotterdam, NL" },
  { icon: Boxes, e: "Bottling run sealed", by: "Lot ZTN-26-04 · 8,400 units" },
  { icon: Truck, e: "Shipment departed", by: "Port of Sfax → Rotterdam" },
  { icon: Smartphone, e: "Passport scanned", by: "Lyon, FR" },
  { icon: FileCheck2, e: "Phytosanitary cert anchored", by: "ONH · PH-2026-11872" },
  { icon: Award, e: "Sustainability score sealed", by: "Domaine Zitouna · 8.2/10" },
  { icon: Smartphone, e: "Passport scanned", by: "Dubai, AE" },
];

// Deterministic pseudo-hash (stable across SSR / hydration).
const hashFor = (n: number) =>
  `0x${((n * 2654435761) % 0xffff).toString(16).padStart(4, "0")}…${((n * 40503) % 0xffff).toString(16).padStart(4, "0")}`;

const BASE_BLOCK = 4812330;

type Row = {
  id: number;
  block: number;
  icon: (typeof pool)[number]["icon"];
  e: string;
  by: string;
};

const initialRows: Row[] = pool.slice(0, 5).map((p, i) => ({
  id: i,
  block: BASE_BLOCK - (4 - i),
  icon: p.icon,
  e: p.e,
  by: p.by,
}));

const cities = [
  { x: 80, y: 168, l: "Sfax" },
  { x: 190, y: 90, l: "Lyon" },
  { x: 258, y: 48, l: "Rotterdam" },
  { x: 330, y: 140, l: "Dubai" },
];

function Feed() {
  const [rows, setRows] = useState<Row[]>(initialRows);
  const [block, setBlock] = useState(BASE_BLOCK);
  const next = useRef(5);
  const [ref, inView] = useInView<HTMLDivElement>("0px 0px -15% 0px");

  useEffect(() => {
    if (!inView || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => {
      const n = next.current;
      next.current += 1;
      const ev = pool[n % pool.length]!;
      setRows((r) =>
        [{ id: n, block: BASE_BLOCK + n - 4, icon: ev.icon, e: ev.e, by: ev.by }, ...r].slice(0, 6),
      );
      setBlock(BASE_BLOCK + n - 4);
    }, 2400);
    return () => clearInterval(id);
  }, [inView]);

  return (
    <div ref={ref} className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10 backdrop-blur">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-cream/60">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" /> Network activity
        </p>
        <p className="font-mono text-[10px] text-gold">Block #{block.toLocaleString("en-US")}</p>
      </div>
      <ul className="mt-3 space-y-2">
        {rows.map((r) => (
          <li
            key={r.id}
            className="flex items-center gap-3 rounded-xl bg-white/5 px-3.5 py-2.5 ring-1 ring-white/10 animate-in fade-in slide-in-from-top-2 duration-500"
          >
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gold/15 text-gold">
              <r.icon className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-cream">{r.e}</p>
              <p className="truncate text-[10px] text-cream/50">{r.by}</p>
            </div>
            <div className="text-right font-mono text-[9px]">
              <p className="flex items-center justify-end gap-1 text-success">
                <Check className="h-2.5 w-2.5" /> sealed
              </p>
              <p className="mt-0.5 text-gold/80">
                #{r.block.toLocaleString("en-US")} · {hashFor(r.id)}
              </p>
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-center text-[9px] text-cream/40">
        Simulated replay — every production event is sealed the same way
      </p>
    </div>
  );
}

function MiniMap() {
  return (
    <div className="grid-lines relative mt-8 h-44 overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10">
      <svg viewBox="0 0 400 200" className="absolute inset-0 h-full w-full" aria-hidden>
        <path
          d="M80 168 C 120 110, 150 100, 190 90"
          stroke="var(--gold)"
          strokeWidth="1.2"
          strokeDasharray="4 5"
          fill="none"
          strokeOpacity="0.7"
        />
        <path
          d="M80 168 C 140 80, 200 40, 258 48"
          stroke="var(--gold)"
          strokeWidth="1.2"
          strokeDasharray="4 5"
          fill="none"
          strokeOpacity="0.7"
        />
        <path
          d="M80 168 C 160 190, 260 175, 330 140"
          stroke="var(--gold)"
          strokeWidth="1.2"
          strokeDasharray="4 5"
          fill="none"
          strokeOpacity="0.5"
        />
      </svg>
      {cities.map((c) => (
        <span
          key={c.l}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${(c.x / 400) * 100}%`, top: `${(c.y / 200) * 100}%` }}
        >
          <span className="animate-pulse-ring absolute -inset-2 rounded-full border border-gold/60" />
          <span className="block h-2 w-2 rounded-full bg-gold" />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 whitespace-nowrap font-mono text-[9px] text-cream/70">
            {c.l}
          </span>
        </span>
      ))}
      <span className="absolute bottom-2.5 right-3 font-mono text-[9px] text-cream/40">
        origin → live scan points
      </span>
    </div>
  );
}

export function LiveLedger() {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-28">
      <div className="grain relative overflow-hidden rounded-[2rem] bg-ink text-cream shadow-card">
        <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-gold/15 blur-[100px]" />
        <div className="absolute -bottom-32 -right-16 h-96 w-96 rounded-full bg-olive/20 blur-[120px]" />
        <div className="relative grid items-center gap-12 p-8 md:p-14 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <p className="eyebrow">07 · Live ledger</p>
            <h2 className="mt-4 text-4xl text-balance md:text-5xl">
              The ledger
              <br />
              <em className="text-gold-gradient">never sleeps.</em>
            </h2>
            <p className="mt-5 max-w-md text-cream/70">
              Every harvest, signature and scan becomes a permanent public proof — hashed, linked to
              the previous event and sealed on Polygon. Around the clock, across every partner.
            </p>
            <dl className="mt-9 grid grid-cols-3 gap-5">
              {[
                ["1.2M", "units traced"],
                ["7", "countries live"],
                ["~2.1s", "avg seal time"],
              ].map(([v, l]) => (
                <div key={l}>
                  <dt className="font-display text-3xl">{v}</dt>
                  <dd className="mt-1 text-xs text-cream/50">{l}</dd>
                </div>
              ))}
            </dl>
            <MiniMap />
          </Reveal>
          <Reveal delay={150}>
            <Feed />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
