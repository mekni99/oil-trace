import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Search, ShieldCheck } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { SiteNav, SiteFooter } from "@/components/site/SiteNav";
import premiumBottle from "@/assets/Premium Tunisian Olive Oil Bottle.png";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "Traced olive oils — every product, one passport | Veritrace" },
      { name: "description", content: "Browse serialized olive oil products. Each unit carries a QR code linked to its blockchain-anchored digital passport." },
    ],
  }),
  component: Products,
});

const FILTERS = ["All", "Extra virgin", "Organic", "AOP / IGP", "Virgin"] as const;

const products = [
  { code: "ZTN-EVOO-2026-0417", brand: "Domaine Zitouna", name: "Extra Virgin Olive Oil", tag: "Extra virgin", cats: ["Extra virgin", "Organic"], region: "Sfax", sn: "SN ZTN-0417" },
  { code: "HEK-EVOO-2026-0032", brand: "Huilerie El Kebir", name: "Extra Virgin Olive Oil", tag: "Extra virgin", cats: ["Extra virgin"], region: "Sousse", sn: "SN HEK-0032" },
  { code: "OGB-EVOO-2026-0118", brand: "Oasis Gabès Bio", name: "Organic Extra Virgin", tag: "Organic EVOO", cats: ["Organic", "Extra virgin"], region: "Gabès", sn: "SN OGB-0118" },
  { code: "DZS-AOP-2026-0054", brand: "Domaine Zarzis", name: "AOP Zarzis Olive Oil", tag: "AOP / IGP", cats: ["AOP / IGP", "Extra virgin"], region: "Zarzis", sn: "SN DZS-0054" },
  { code: "MNB-VGO-2026-0089", brand: "Moulin Nabeul", name: "Virgin Olive Oil", tag: "Virgin", cats: ["Virgin"], region: "Nabeul", sn: "SN MNB-0089" },
  { code: "TRZ-ORG-2026-0063", brand: "Terroir Zaghouan", name: "Organic Olive Oil", tag: "Organic", cats: ["Organic"], region: "Zaghouan", sn: "SN TRZ-0063" },
];

function ProductCard({ p }: { p: (typeof products)[number] }) {
  return (
    <Link to="/passport" className="group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-card transition-transform duration-300 hover:-translate-y-1">
      <div className="relative bg-cream/70 px-5 pt-5">
        <div className="flex items-center justify-between">
          <span className="rounded-full border border-border bg-card px-3 py-1 text-xs font-medium shadow-card">{p.tag}</span>
          <span className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground shadow-card"><ShieldCheck className="h-3.5 w-3.5 text-success" /> On-chain</span>
        </div>
        <div className="relative">
          <img src={premiumBottle} alt={`${p.brand} — ${p.name}`} loading="lazy" className="mx-auto mt-2 h-52 w-auto drop-shadow-[0_16px_20px_oklch(0.3_0.06_70/25%)] transition-transform duration-500 group-hover:scale-[1.03]" />
          <div className="absolute bottom-2 right-[16%] rounded-xl bg-white p-1.5 text-ink shadow-card ring-1 ring-border transition-transform duration-300 group-hover:-translate-y-1">
            <QRCodeSVG value={`https://veritrace.app/p/${p.code}`} size={56} level="M" bgColor="transparent" fgColor="currentColor" />
          </div>
        </div>
      </div>
      <div className="relative z-10 mt-auto border-t border-border bg-card p-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold">{p.brand}</p>
        <div className="mt-1.5 flex items-center justify-between gap-3">
          <div>
            <p className="font-display text-xl leading-tight">{p.name}</p>
            <p className="mt-1 font-mono text-[11px] text-muted-foreground">{p.region} · {p.sn}</p>
          </div>
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-border bg-surface text-muted-foreground transition-colors group-hover:border-gold group-hover:text-gold"><ArrowRight className="h-4 w-4" /></span>
        </div>
      </div>
    </Link>
  );
}

function Products() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();
  const visible = products.filter(
    (p) =>
      (filter === "All" || p.cats.includes(filter)) &&
      (!q || `${p.brand} ${p.name} ${p.code} ${p.sn}`.toLowerCase().includes(q)),
  );

  return (
    <div className="min-h-screen">
      <SiteNav />

      <section className="grain relative overflow-hidden border-b border-border">
        <div className="grid-lines absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_top,#000_20%,transparent_70%)]" />
        <div className="relative mx-auto max-w-7xl px-6 pb-10 pt-14 lg:pt-20">
          <div className="flex flex-wrap items-end justify-between gap-8">
            <div className="max-w-2xl">
              <p className="eyebrow">Sector · Olive oil</p>
              <h1 className="mt-4 text-5xl font-medium leading-[1.05] tracking-[-0.03em] md:text-6xl">
                Traced oils,<br />one <em className="text-gold-gradient font-normal">passport</em> each.
              </h1>
            </div>
            <p className="max-w-md text-muted-foreground">Every product below carries a serialised QR code. Open one to read its full verified story — from parcel to bottle.</p>
          </div>
          <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`rounded-full px-4 py-1.5 text-sm transition-colors ${filter === f ? "bg-ink text-cream shadow-card" : "border border-border bg-card text-muted-foreground shadow-card hover:text-foreground"}`}
                >
                  {f}
                </button>
              ))}
            </div>
            <label className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search product, brand, code…"
                aria-label="Search products"
                className="h-10 w-72 rounded-full border border-input bg-card pl-10 pr-4 text-sm shadow-card outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/20"
              />
            </label>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-28 pt-10">
        <p className="text-sm text-muted-foreground">{visible.length} verified products</p>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((p) => <ProductCard key={p.code} p={p} />)}
        </div>
        {visible.length === 0 && (
          <div className="panel mt-6 flex flex-col items-center py-16 text-center">
            <p className="font-display text-2xl">No product matches</p>
            <p className="mt-2 text-sm text-muted-foreground">Try another grade, brand or serial code.</p>
          </div>
        )}
      </section>

      <SiteFooter />
    </div>
  );
}
