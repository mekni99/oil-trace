import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Boxes,
  CloudOff,
  Factory,
  FileCheck2,
  FlaskConical,
  KeyRound,
  Leaf,
  Printer,
  Truck,
  Users,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/site/Reveal";

const events = [
  {
    icon: Leaf,
    e: "Harvest logged",
    ref: "HV-P14-251118",
    by: "Parcel P-14 · field app",
    t: "2h ago",
    ok: true,
  },
  {
    icon: Factory,
    e: "Cold extraction",
    ref: "ML-25-1119-07",
    by: "Moulin El Bousten",
    t: "1d ago",
    ok: true,
  },
  {
    icon: FlaskConical,
    e: "Lab report attached",
    ref: "ONH-2025-1187",
    by: "ONH Laboratory",
    t: "awaiting signature",
    ok: false,
  },
  {
    icon: Boxes,
    e: "Bottling run sealed",
    ref: "ZTN-26-04",
    by: "Domaine Zitouna · 8,400 units",
    t: "3d ago",
    ok: true,
  },
  {
    icon: Truck,
    e: "Export docs sealed",
    ref: "EXP-26-0312",
    by: "CTN Maritime · Port of Sfax",
    t: "5d ago",
    ok: true,
  },
];

const features = [
  {
    icon: Users,
    t: "Roles per actor",
    d: "Farm, mill, lab and logistics each sign their own step.",
  },
  {
    icon: CloudOff,
    t: "Offline-first capture",
    d: "Field events sync when the device is back online.",
  },
  { icon: Printer, t: "Serialized print runs", d: "GS1 QR batches ready for any label printer." },
  { icon: KeyRound, t: "API & CSV import", d: "Plug your ERP or upload existing lot data." },
];

function WorkspaceMockup() {
  return (
    <div className="panel overflow-hidden">
      {/* Browser chrome */}
      <div className="flex items-center gap-3 border-b border-border bg-surface-2/70 px-4 py-2.5">
        <span className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
          <span className="h-2.5 w-2.5 rounded-full bg-warning/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-success/60" />
        </span>
        <span className="flex-1 truncate rounded-md bg-card px-3 py-1 text-center font-mono text-[10px] text-muted-foreground ring-1 ring-border">
          veritrace.app/workspace
        </span>
        <span className="grid h-6 w-6 place-items-center rounded-full bg-gold-gradient font-mono text-[9px] font-semibold text-ink">
          AB
        </span>
      </div>

      <div className="p-5">
        {/* KPI row */}
        <div className="grid grid-cols-4 gap-2">
          {[
            ["12", "Active lots"],
            ["34", "Events this week"],
            ["8.4K", "Units printed"],
            ["3", "Pending signs"],
          ].map(([v, l]) => (
            <div key={l} className="rounded-xl border border-border bg-card p-2.5 text-center">
              <p className="font-display text-lg leading-none">{v}</p>
              <p className="mt-1 text-[9px] text-muted-foreground">{l}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-[1.5fr_1fr]">
          {/* Event feed */}
          <div className="rounded-xl border border-border bg-card">
            <p className="flex items-center justify-between border-b border-border px-4 py-2.5 font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
              Chain of custody · ZTN-26-04
              <span className="inline-flex items-center gap-1 text-success">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" /> live
              </span>
            </p>
            <ul className="divide-y divide-border">
              {events.map((ev) => (
                <li key={ev.ref} className="flex items-center gap-3 px-4 py-2.5">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-accent text-accent-foreground">
                    <ev.icon className="h-3.5 w-3.5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold">{ev.e}</p>
                    <p className="truncate font-mono text-[9px] text-muted-foreground">
                      {ev.ref} · {ev.by}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`rounded-full px-2 py-0.5 font-mono text-[8px] uppercase tracking-wider ${ev.ok ? "bg-success/12 text-success" : "bg-warning/15 text-warning"}`}
                    >
                      {ev.ok ? "Anchored" : "Pending"}
                    </span>
                    <p className="mt-0.5 text-[9px] text-muted-foreground">{ev.t}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Print queue */}
          <div className="flex flex-col gap-4">
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
                Print queue
              </p>
              <div className="mt-3 flex items-center gap-3">
                <div className="rounded-lg bg-white p-1.5 text-ink ring-1 ring-border">
                  <QRCodeSVG
                    value="https://veritrace.app/p/ZTN-EVOO-2026-0417"
                    size={52}
                    bgColor="transparent"
                    fgColor="currentColor"
                  />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold">Lot ZTN-26-04</p>
                  <p className="font-mono text-[9px] text-muted-foreground">8,400 labels · GS1</p>
                </div>
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
                <div className="h-full w-[72%] rounded-full bg-gold-gradient" />
              </div>
              <p className="mt-1.5 flex justify-between text-[9px] text-muted-foreground">
                <span>6,048 printed</span>
                <span className="font-mono">72%</span>
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="flex items-center gap-1.5 text-xs font-semibold">
                <FileCheck2 className="h-3.5 w-3.5 text-gold" /> Signature requested
              </p>
              <p className="mt-1 text-[10px] text-muted-foreground">
                ONH Laboratory must sign the lab report before bottling closes the lot.
              </p>
              <button className="mt-3 w-full rounded-full bg-ink py-1.5 text-[10px] font-medium text-cream">
                Send reminder
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProducerWorkspace() {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-28">
      <div className="grid items-center gap-14 lg:grid-cols-[0.85fr_1.15fr]">
        <Reveal>
          <p className="eyebrow">03 · For producers</p>
          <h2 className="mt-4 text-4xl text-balance md:text-5xl">
            Your whole supply chain,
            <br />
            <em className="text-gold-gradient">one workspace.</em>
          </h2>
          <p className="mt-5 max-w-md text-muted-foreground">
            Lots, signed events, partner requests and print runs — everything your team needs to
            issue passports at scale, without changing how you work.
          </p>
          <ul className="mt-8 grid gap-5 sm:grid-cols-2">
            {features.map((f) => (
              <li key={f.t} className="flex gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-accent text-accent-foreground">
                  <f.icon className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-semibold">{f.t}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{f.d}</p>
                </div>
              </li>
            ))}
          </ul>
          <Button asChild size="lg" className="mt-9 rounded-full px-7">
            <Link to="/signup">
              Onboard your brand <ArrowRight />
            </Link>
          </Button>
        </Reveal>
        <Reveal delay={150}>
          <WorkspaceMockup />
        </Reveal>
      </div>
    </section>
  );
}
