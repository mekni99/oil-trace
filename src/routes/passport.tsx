import { createFileRoute } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { AlertTriangle, Camera, Check, Copy, ExternalLink, Map, Route as RouteIcon, ShieldCheck, Warehouse, FileCheck2, Boxes, Recycle } from "lucide-react";
import { SiteNav, SiteFooter } from "@/components/site/SiteNav";
import { BrandQR } from "@/components/site/BrandQR";
import { Button } from "@/components/ui/button";
import { OIL_RUBRICS, EXTRA_RUBRICS } from "@/lib/oil-data";
import bottle from "@/assets/oil-bottle.jpg";
import grove from "@/assets/hero-grove.jpg";
import mill from "@/assets/oil-mill.jpg";

export const Route = createFileRoute("/passport")({
  head: () => ({
    meta: [
      { title: "Olive oil passport — Domaine Zitouna EVOO 2026 | Veritrace" },
      { name: "description", content: "Full blockchain traceability of a bottle of extra virgin olive oil: origin, harvest, mill, lab tests, certifications and shipping." },
      { property: "og:title", content: "Digital product passport — Extra virgin olive oil" },
      { property: "og:description", content: "Scan, verify and explore every step of this olive oil's journey." },
    ],
  }),
  component: Passport,
});

const SECTIONS = [...OIL_RUBRICS, ...EXTRA_RUBRICS];
type Key = (typeof SECTIONS)[number]["key"];

const journey = [
  { t: "Delivered to retailer", p: "Rotterdam, Netherlands", d: "Mar 15, 2026", h: "0x8f3a…c91e" },
  { t: "Customs cleared", p: "Port of Rotterdam", d: "Mar 12, 2026", h: "0x77b0…1a2d" },
  { t: "Shipped", p: "Port of Sfax, Tunisia", d: "Mar 02, 2026", h: "0x3b71…e40f" },
  { t: "Bottled & sealed", p: "Domaine Zitouna, Sfax", d: "Feb 20, 2026", h: "0x9e1c…77aa" },
  { t: "Lab approved", p: "ONH Laboratory, Sfax", d: "Dec 04, 2025", h: "0x5c92…b3d1" },
  { t: "Cold extraction", p: "Moulin El Bousten, Sfax", d: "Nov 19, 2025", h: "0x1a2f…09c4" },
  { t: "Harvest", p: "Orchard parcel P-14, Agareb", d: "Nov 18, 2025", h: "0x0c44…2be8" },
];

function Passport() {
  const [tab, setTab] = useState<"photos" | "journey" | "map">("journey");
  const [section, setSection] = useState<Key>("identification");

  return (
    <div className="min-h-screen">
      <SiteNav />

      {/* HEADER */}
      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="panel overflow-hidden">
          <div className="grid grid-cols-3 border-b border-border">
            {([["photos", Camera, "Photos"], ["journey", RouteIcon, "Journey"], ["map", Map, "Map"]] as const).map(([k, I, l]) => (
              <button key={k} onClick={() => setTab(k)} className={`flex items-center justify-center gap-2 py-4 text-sm transition-colors ${tab === k ? "border-b-2 border-gold bg-cream font-medium text-foreground" : "text-muted-foreground hover:bg-surface-2/60 hover:text-foreground"}`}>
                <I className="h-4 w-4" /> {l}
              </button>
            ))}
          </div>
          <div className="h-[420px] overflow-y-auto p-6">
            {tab === "photos" && (
              <div className="grid h-full grid-cols-2 grid-rows-2 gap-3">
                <img src={bottle} alt="Bottle" className="row-span-2 h-full w-full rounded-xl object-cover" />
                <img src={grove} alt="Orchard" className="h-full w-full rounded-xl object-cover" />
                <img src={mill} alt="Mill" className="h-full w-full rounded-xl object-cover" />
              </div>
            )}
            {tab === "journey" && (
              <ol className="relative ml-2 border-l border-gold/30">
                {journey.map((j, i) => (
                  <li key={j.t} className="relative mb-6 pl-7">
                    <span className={`absolute -left-[7px] top-1 h-3.5 w-3.5 rounded-full border-2 border-background ${i === 0 ? "bg-gold" : "bg-gold/50"}`} />
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <p className="font-semibold">{j.t}</p>
                      <span className="font-mono text-[11px] text-muted-foreground">{j.h}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{j.p} · {j.d}</p>
                  </li>
                ))}
              </ol>
            )}
            {tab === "map" && (
              <div className="grid-lines relative h-full rounded-xl border border-border bg-surface-2">
                <svg viewBox="0 0 400 300" className="absolute inset-0 h-full w-full">
                  <path d="M80 240 C 160 200, 200 120, 320 60" stroke="var(--gold)" strokeWidth="2" strokeDasharray="6 6" fill="none" />
                  <circle cx="80" cy="240" r="7" fill="var(--gold)" />
                  <circle cx="320" cy="60" r="7" fill="var(--olive)" />
                </svg>
                <span className="absolute bottom-10 left-6 rounded-md bg-card px-2 py-1 text-xs shadow-card">Sfax, TN · 34.74°N</span>
                <span className="absolute right-6 top-6 rounded-md bg-card px-2 py-1 text-xs shadow-card">Rotterdam, NL · 51.92°N</span>
                <span className="absolute bottom-4 right-4 font-mono text-[11px] text-muted-foreground">2,384 km by sea · 9 days</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <p className="eyebrow">Domaine Zitouna · Sfax</p>
          <h1 className="mt-3 text-4xl leading-tight md:text-5xl">Extra Virgin Olive Oil<br /><em className="text-gold-gradient">Chemlali Early Harvest 2025</em></h1>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-sm text-gold"><Check className="h-4 w-4" /> Digital passport active</span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-success/40 bg-success/10 px-3 py-1 text-sm text-success"><ShieldCheck className="h-4 w-4" /> Verified on-chain</span>
          </div>
          <p className="mt-4 font-mono text-xs text-muted-foreground">Serial ZTN-EVOO-2026-0417 · Lot ZTN-26-04 · Best before 2027-11</p>
          <div className="mt-6 grid grid-cols-3 gap-3">
            {[["Origin", "Sfax, TN"], ["Harvest", "Nov 2025"], ["Acidity", "0.21 %"]].map(([l, v]) => (
              <div key={l} className="panel p-4"><p className="text-xs text-muted-foreground">{l}</p><p className="mt-1 font-display text-lg">{v}</p></div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            <Button variant="outline" className="rounded-full border-gold/50 bg-card text-gold hover:bg-gold/10 hover:text-gold">I need assistance</Button>
            <Button variant="outline" className="rounded-full bg-card">Find a retailer</Button>
            <Button variant="outline" className="rounded-full border-destructive/50 bg-card text-destructive hover:bg-destructive/10 hover:text-destructive">Report an issue</Button>
          </div>
        </div>
      </section>

      {/* BODY */}
      <section className="mx-auto grid max-w-7xl gap-8 px-6 pb-24 lg:grid-cols-[240px_1fr]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <p className="eyebrow mb-3">Passport rubrics</p>
          <nav className="flex gap-2 overflow-x-auto lg:flex-col">
            {SECTIONS.map((s, i) => (
              <button key={s.key} onClick={() => setSection(s.key)} className={`flex shrink-0 items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-all ${section === s.key ? "border-primary bg-primary text-primary-foreground shadow-card" : "border-border bg-card text-muted-foreground hover:border-gold/40 hover:text-foreground"}`}>
                <s.icon className="h-4 w-4" />
                <span className="flex-1 font-medium">{s.title}</span>
                <span className="font-mono text-[10px] opacity-60">{String(i + 1).padStart(2, "0")}</span>
              </button>
            ))}
          </nav>
        </aside>

        <div className="min-w-0">
          <SectionBody k={section} />
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}

function Head({ title, sub, badge }: { title: string; sub?: string; badge?: string }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h2 className="text-3xl md:text-4xl">{title}</h2>
        <div className="mt-3 h-0.5 w-12 bg-gold-gradient" />
        {sub && <p className="mt-3 text-sm text-muted-foreground">{sub}</p>}
      </div>
      {badge && <span className="rounded-full border border-gold/40 px-3 py-1 text-xs text-gold">✦ {badge}</span>}
    </div>
  );
}

function Rows({ rows }: { rows: [string, ReactNode][] }) {
  return (
    <dl className="divide-y divide-border">
      {rows.map(([k, v]) => (
        <div key={k} className="grid gap-1 py-3.5 sm:grid-cols-[200px_1fr]">
          <dt className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">{k}</dt>
          <dd className="text-sm">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

function Card({ title, children, className = "" }: { title: string; children: ReactNode; className?: string }) {
  return <div className={`panel p-6 ${className}`}><p className="eyebrow mb-4">{title}</p>{children}</div>;
}

function Metric({ v, l, sub }: { v: string; l: string; sub?: string }) {
  return (
    <div className="panel p-5">
      <div className="flex items-start justify-between"><p className="font-display text-3xl">{v}</p><span className="grid h-6 w-6 place-items-center rounded-full border border-gold/40 text-gold"><Check className="h-3 w-3" /></span></div>
      <p className="mt-1 text-sm">{l}</p>
      {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}

function Hash({ h }: { h: string }) {
  return <span className="inline-flex items-center gap-1.5 font-mono text-xs text-gold">{h} <Copy className="h-3 w-3 opacity-60" /></span>;
}

function SectionBody({ k }: { k: Key }) {
  switch (k) {
    case "identification":
      return (
        <>
          <Head title="Identification" sub="Unique identity of this unit and its lot" />
          <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
            <Card title="About this unit">
              <Rows rows={[
                ["Product name", "Extra Virgin Olive Oil — Chemlali Early Harvest"],
                ["Brand / Title", "Domaine Zitouna · Réserve"],
                ["Format", "Dark glass bottle · 750 ml"],
                ["Serial", <span className="font-mono">ZTN-EVOO-2026-0417</span>],
                ["Lot number", <span className="font-mono">ZTN-26-04 <span className="text-gold">· All units of this lot</span></span>],
                ["Manufactured", "2026-02-20"],
                ["Expiry / Best before", "2027-11-30"],
                ["Packaging", "UV-protective glass, aluminium tamper-proof cap, FSC label"],
                ["GTIN", <span className="font-mono">06191234500417</span>],
              ]} />
            </Card>
            <Card title="Product QR code" className="flex flex-col items-center">
              <BrandQR value="https://veritrace.app/p/ZTN-EVOO-2026-0417" size={150} />
            </Card>
          </div>
        </>
      );
    case "geography":
      return (
        <>
          <Head title="Geography" sub="Where the olives were grown" badge="IGP Sfax (pending)" />
          <div className="grid gap-6 md:grid-cols-2">
            <Card title="Origin">
              <Rows rows={[
                ["Country", "Tunisia 🇹🇳"],
                ["Region", "Sfax · Agareb"],
                ["Harvest GPS", <span className="font-mono">34.7406° N, 10.7603° E</span>],
                ["Parcel", "P-14 · 38 ha · 2,400 trees"],
                ["Parcel GLN", <span className="font-mono">6191234500014</span>],
                ["Altitude", "110 m"],
                ["AOP / IGP label", "IGP Huile d'olive de Sfax"],
              ]} />
            </Card>
            <Card title="Producer & operator">
              <Rows rows={[
                ["Producer", "Domaine Zitouna SARL"],
                ["Operator GLN", <span className="font-mono">6191234500007</span>],
                ["Exploitation", "Family estate since 1962, 3rd generation"],
                ["Address", "Route de Gremda km 8, 3062 Sfax, Tunisia"],
                ["Contact", <span className="text-gold">contact@zitouna.tn</span>],
              ]} />
            </Card>
          </div>
        </>
      );
    case "agricultural":
      return (
        <>
          <Head title="Agricultural" sub="Cultivation practices and harvest record" />
          <div className="grid gap-4 md:grid-cols-4">
            <Metric v="100%" l="Chemlali" sub="Single variety" />
            <Metric v="Bio" l="Organic farming" sub="Since 2014" />
            <Metric v="Rain-fed" l="Water management" sub="Drip in drought only" />
            <Metric v="4h" l="Harvest → mill" sub="Max delay" />
          </div>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <Card title="Harvest">
              <Rows rows={[
                ["Harvest date", "18 November 2025"],
                ["Method", "Hand-picked with combs, nets"],
                ["Variety", "Chemlali (early, green)"],
                ["Harvest lot ID", <span className="font-mono">HV-P14-251118</span>],
                ["Label", "Organic (ECOCERT TN-BIO-01)"],
              ]} />
            </Card>
            <Card title="Treatments">
              <table className="w-full text-sm">
                <thead className="text-left font-mono text-[10px] uppercase tracking-wider text-muted-foreground"><tr><th className="pb-3">Product</th><th>Applied</th><th>Pre-harvest delay</th></tr></thead>
                <tbody className="divide-y divide-border">
                  <tr><td className="py-3">Copper (Bordeaux)</td><td>2025-04-10</td><td>222 days</td></tr>
                  <tr><td className="py-3">Kaolin clay</td><td>2025-07-02</td><td>139 days</td></tr>
                  <tr><td className="py-3">Organic compost</td><td>2025-02-15</td><td>—</td></tr>
                </tbody>
              </table>
            </Card>
          </div>
        </>
      );
    case "process":
      return (
        <>
          <Head title="Process" sub="Transformation from olive to bottle" />
          <div className="grid gap-6 md:grid-cols-2">
            <Card title="Mill">
              <Rows rows={[
                ["Mill", "Moulin El Bousten"],
                ["Location", "Sakiet Ezzit, Sfax"],
                ["Mill GLN", <span className="font-mono">6191234500021</span>],
                ["Date", "19 November 2025"],
                ["Label", "ISO 22000 certified"],
                ["Extraction", "Cold extraction, 2-phase, < 27°C"],
                ["Malaxation", "35 min"],
              ]} />
            </Card>
            <Card title="Transformed lot">
              <Rows rows={[
                ["Lot", <span className="font-mono">ML-25-1119-07</span>],
                ["Gross weight", "12,400 kg olives → 2,050 L oil"],
                ["Yield", "16.5 %"],
                ["Filtration", "Cotton filtered, nitrogen-stored"],
                ["Storage tank", <span className="font-mono">Cuve C-07 · GLN 6191234500038</span>],
                ["Bottling date", "20 February 2026"],
                ["Ingredients", "100% extra virgin olive oil"],
              ]} />
            </Card>
          </div>
        </>
      );
    case "sustainability":
      return (
        <>
          <Head title="Sustainability" sub="Chemlali olives, organic, Sfax (TN)" />
          <div className="grid gap-4 md:grid-cols-4">
            <Metric v="1.4 kg" l="CO₂e / bottle" sub="Carbon footprint" />
            <Metric v="420 L" l="Water / bottle" sub="Mostly rain-fed" />
            <Metric v="62%" l="Renewable energy" sub="Solar at mill" />
            <Metric v="70%" l="Recycled glass" sub="Packaging" />
          </div>
          <div className="panel mt-6 flex flex-wrap items-center gap-8 p-6">
            <div className="relative grid h-28 w-28 place-items-center rounded-full" style={{ background: "conic-gradient(var(--gold) 0 82%, var(--muted) 82% 100%)" }}>
              <div className="grid h-22 w-22 place-items-center rounded-full bg-surface"><span className="font-display text-3xl">8.2</span></div>
            </div>
            <div className="flex-1">
              <p className="eyebrow">Sustainability score (0–10)</p>
              <p className="mt-2 text-sm text-muted-foreground">Computed from carbon, water, energy and recycled content against the regional EVOO benchmark. Pomace is valorised into biomass fuel.</p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs">{["Organic", "Zero waste mill", "Solar powered"].map((t) => <span key={t} className="rounded-full border border-border px-3 py-1">{t}</span>)}</div>
            </div>
          </div>
        </>
      );
    case "certifications":
      return (
        <>
          <Head title="Certifications & controls" sub="Signed by issuers, anchored on-chain" />
          <div className="grid gap-4 md:grid-cols-3">
            {[["Organic (EU / TN)", "ECOCERT · valid 2027"], ["IGP Sfax", "Ministry of Agriculture"], ["Fair Trade", "FLO-ID 45218"], ["EUDR compliant", "Deforestation-free · geo-proof"], ["Phytosanitary certificate", "N° PH-2026-11872"], ["Export authorisation", "ONH · 2026-0217"]].map(([t, d]) => (
              <div key={t} className="panel flex items-start gap-3 p-5"><FileCheck2 className="h-5 w-5 shrink-0 text-gold" /><div><p className="text-sm font-semibold">{t}</p><p className="text-xs text-muted-foreground">{d}</p></div></div>
            ))}
          </div>
          <Card title="Laboratory analyses · ONH Sfax · IOC methods" className="mt-6">
            <table className="w-full text-sm">
              <thead className="text-left font-mono text-[10px] uppercase tracking-wider text-muted-foreground"><tr><th className="pb-3">Parameter</th><th>Result</th><th>EVOO limit</th><th className="text-right">Status</th></tr></thead>
              <tbody className="divide-y divide-border">
                {[["Free acidity", "0.21 %", "≤ 0.8 %"], ["Peroxide value", "6.4 meq O₂/kg", "≤ 20"], ["K232 / K270", "1.82 / 0.14", "≤ 2.5 / 0.22"], ["Moisture", "0.08 %", "≤ 0.2 %"], ["Pesticide residues", "Not detected", "< LOQ"], ["Contaminants (PAH, metals)", "Compliant", "EU 2023/915"], ["Organoleptic (panel test)", "Fruity 4.2 · no defect", "Md = 0, Mf > 0"]].map(([a, b, c]) => (
                  <tr key={a}><td className="py-3">{a}</td><td className="font-mono">{b}</td><td className="text-muted-foreground">{c}</td><td className="text-right"><span className="rounded-full bg-success/15 px-2 py-0.5 text-xs text-success">Pass</span></td></tr>
                ))}
              </tbody>
            </table>
          </Card>
        </>
      );
    case "nutrition":
      return (
        <>
          <Head title="Nutrition" sub="Per 100 ml · 1 tablespoon = 14 ml" badge="Nutri-Score B" />
          <div className="grid gap-6 md:grid-cols-[1fr_0.8fr]">
            <Card title="Nutrition facts">
              <Rows rows={[["Energy", "3,404 kJ / 828 kcal"], ["Fat", "92 g"], ["of which saturated", "13 g"], ["Monounsaturated", "68 g"], ["Polyunsaturated", "11 g"], ["Carbohydrates", "0 g"], ["Protein", "0 g"], ["Polyphenols", "612 mg/kg"], ["Vitamin E", "18 mg"]]} />
            </Card>
            <Card title="Instructions">
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>Store away from light and heat, 14–18°C.</li>
                <li>Consume within 3 months after opening.</li>
                <li>Ideal raw, on salads, bread and grilled fish.</li>
                <li>Health claim: polyphenols contribute to the protection of blood lipids from oxidative stress (EU 432/2012).</li>
              </ul>
            </Card>
          </div>
        </>
      );
    case "traceability":
      return (
        <>
          <Head title="Traceability" sub="Farm → distribution, verified on blockchain" badge="Chain of custody certified" />
          <div className="panel overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-surface-2 text-left font-mono text-[10px] uppercase tracking-wider text-muted-foreground"><tr><th className="p-4">Event</th><th>Location</th><th>Date</th><th className="pr-4 text-right">Tx hash</th></tr></thead>
              <tbody className="divide-y divide-border">
                {journey.slice().reverse().map((j) => (
                  <tr key={j.t}><td className="p-4 font-medium">{j.t}</td><td className="text-muted-foreground">{j.p}</td><td>{j.d}</td><td className="pr-4 text-right"><Hash h={j.h} /></td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <Card title="Aggregation">
              <Rows rows={[["Batch merge", "ML-25-1119-07 + ML-25-1120-02 (blend 70/30)"], ["Pallet", <span className="font-mono">SSCC 361912345000417</span>], ["Container", <span className="font-mono">MSCU 482917-3</span>], ["Case marking", "GS1-128 · AI(01) GTIN + AI(10) lot"]]} />
            </Card>
            <Card title="Blockchain proof">
              <Rows rows={[["Network", "Polygon PoS"], ["Contract", <Hash h="0x4D2e…aF71" />], ["Last block", "#4,812,330"], ["Integrity", <span className="text-success">✓ All 7 events match on-chain hashes</span>]]} />
              <Button variant="ghost" size="sm" className="mt-3 text-gold">View on explorer <ExternalLink /></Button>
            </Card>
          </div>
          <div className="mt-6 flex items-center gap-3 rounded-xl border border-warning/50 bg-warning/10 p-4 text-sm text-warning"><AlertTriangle className="h-4 w-4" /> Temperature excursion (31°C, 2h) logged during transit on Mar 08 — within tolerance.</div>
        </>
      );
    case "packaging":
      return (
        <>
          <Head title="Packaging & storage" sub="Conditioning, ecodesign and end of life" badge="Ecodesign ready" />
          <div className="grid gap-4 md:grid-cols-3">
            <Metric v="1,180 g" l="Gross weight" sub="Net 690 g · 750 ml" />
            <Metric v="31 cm" l="Height" sub="Ø 7.4 cm" />
            <Metric v="3" l="Variants" sub="250 ml · 500 ml · 750 ml" />
          </div>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <Card title="Conditioning">
              <Rows rows={[["Date", "2026-02-20"], ["Establishment", "Domaine Zitouna bottling unit"], ["Lot", <span className="font-mono">ZTN-26-04</span>], ["Blend of lots", "Yes · 2 mill lots"], ["GTIN case ×6", <span className="font-mono">06191234500424</span>], ["GTIN pallet", <span className="font-mono">06191234500431</span>], ["Case marking", "GS1-128 · AI(01)+(10)"], ["Conditioner approval", "ONH n° TN-AGR-2026-1187"]]} />
            </Card>
            <Card title="Storage & end of life">
              <div className="space-y-3 text-sm">
                <p className="flex gap-2"><Warehouse className="h-4 w-4 text-gold" /> Stored in stainless tanks under nitrogen, 16°C, 92 days.</p>
                <p className="flex gap-2"><Boxes className="h-4 w-4 text-gold" /> Cardboard case of 6, recyclable.</p>
                <p className="flex gap-2"><Recycle className="h-4 w-4 text-gold" /> Glass → glass bin. Cap → metal. Label → paper.</p>
              </div>
            </Card>
          </div>
        </>
      );
    case "shipping":
      return (
        <>
          <Head title="Shipping & reception" sub="Transport, sale and commercial documents" />
          <div className="grid gap-6 md:grid-cols-2">
            <Card title="Dispatch">
              <Rows rows={[["Date", "2026-03-02"], ["Supplier", "Domaine Zitouna SARL"], ["Ship-from GLN", <span className="font-mono">6191234500007</span>], ["Carrier", "CTN Maritime · reefer"], ["HS code", <span className="font-mono">1509 20 00 · EVOO</span>], ["Incoterm", "FOB Port of Sfax"], ["Export decl.", <span className="font-mono">DUM TTN-2026-08841</span>], ["Invoice", <span className="font-mono">INV-2026-0311</span>], ["Delivery note", <span className="font-mono">BL-ZTN-0417</span>]]} />
            </Card>
            <Card title="Reception">
              <Rows rows={[["Date", "2026-03-15"], ["Buyer", "Grigolato.NL B.V."], ["Ship-to GLN", <span className="font-mono">3112345678903</span>], ["Address", "Gaffel 48, 1319 BV Almere, NL"], ["Importer EORI", <span className="font-mono">NL851234567B01</span>], ["Customs MRN", <span className="font-mono">26NL-5518-DELTA · cleared Mar 12</span>], ["Reception check", <span className="text-success">✓ Seal intact · 6/6 cases</span>]]} />
            </Card>
          </div>
        </>
      );
  }
}
