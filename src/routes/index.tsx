import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, BadgeCheck, Boxes, Check, Factory, FileCheck2, Fingerprint, Globe2, Leaf, Link2, Recycle, ScanLine, ShieldCheck, Shirt, Truck, Wheat, FlaskConical, Award, Apple, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SiteNav, SiteFooter } from "@/components/site/SiteNav";
import { Reveal } from "@/components/site/Reveal";
import { HowItWorks } from "@/components/site/HowItWorks";
import { ScanDemo } from "@/components/site/ScanDemo";
import { ProducerWorkspace } from "@/components/site/ProducerWorkspace";
import { LiveLedger } from "@/components/site/LiveLedger";
import { PhonePassport } from "@/components/site/PhonePassport";
import { QRCodeSVG } from "qrcode.react";
import grove from "@/assets/hero-grove.jpg";
import bottle from "@/assets/oil-bottle.jpg";
import mill from "@/assets/oil-mill.jpg";
import lightTrail from "@/assets/Golden Olive Oil Bottle with Light Trail.png";
import { OIL_RUBRICS } from "@/lib/oil-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Veritrace — Trace, verify & trust every product" },
      { name: "description", content: "Blockchain-anchored digital product passports. Starting with olive oil, built for food, textile and beyond." },
      { property: "og:title", content: "Veritrace — Blockchain product passports" },
      { property: "og:description", content: "Scan one QR code, see the whole story: origin, harvest, mill, lab results and shipping — verified on-chain." },
    ],
  }),
  component: Index,
});

const compliance = [
  [Globe2, "EU Digital Product Passport"],
  [Recycle, "ESPR ready"],
  [Leaf, "EUDR compliant"],
  [Award, "AOP / IGP"],
  [BadgeCheck, "Fair Trade"],
  [ScanLine, "GS1 Digital Link"],
  [FileCheck2, "ISO 22000"],
  [Link2, "Polygon PoS"],
] as const;

const otherSectors = [
  { icon: Wheat, t: "Grains & cereals", s: "2027", d: "Silo-to-bakery lot tracking and EUDR deforestation proofs.", span: "md:col-span-2" },
  { icon: Apple, t: "Fresh produce", s: "2027", d: "Cold chain, residue tests, harvest dates.", span: "" },
  { icon: Shirt, t: "Textile", s: "Planned", d: "ESPR passports: fibre, dye, repair, end of life.", span: "" },
];

const timeline = [
  { i: Leaf, t: "Orchard", p: "Parcel P-14, Agareb", d: "Chemlali · hand-picked", date: "Nov 18, 2025", h: "0x0c44…2be8" },
  { i: Factory, t: "Mill", p: "Moulin El Bousten", d: "Cold extraction < 27°C", date: "Nov 19, 2025", h: "0x1a2f…09c4" },
  { i: FlaskConical, t: "Laboratory", p: "ONH Laboratory, Sfax", d: "IOC methods · 6/6 pass", date: "Dec 04, 2025", h: "0x5c92…b3d1" },
  { i: Boxes, t: "Bottling", p: "Domaine Zitouna", d: "Lot ZTN-26-04", date: "Feb 20, 2026", h: "0x9e1c…77aa" },
  { i: Truck, t: "Distribution", p: "Sfax → Rotterdam", d: "Reefer · 9 days at sea", date: "Mar 15, 2026", h: "0x8f3a…c91e" },
];

const faqs = [
  ["Do my customers need an app to scan the passport?", "No. The QR code opens a web page in any phone camera, in the shopper's language. Nothing to install."],
  ["What exactly is stored on the blockchain?", "Only cryptographic fingerprints (hashes) of each event, never your raw business data. The documents themselves stay in your Veritrace workspace, and anyone can check they haven't been altered since they were sealed."],
  ["Does Veritrace help with EUDR and the EU Digital Product Passport?", "Yes. Parcel geolocation, harvest dates and chain-of-custody records are captured in the formats required by EUDR, and passports follow the ESPR data model and GS1 Digital Link standard."],
  ["How long does onboarding take?", "Most producers issue their first passport within a few days: we import your parcels and lots, configure your rubrics, then you print the QR codes on your existing labels."],
  ["Can my mill, lab and logistics partners add their own data?", "Yes. Each actor in the chain gets its own access and signs its own events, so every step is attested by the party responsible for it."],
];

// Node coordinates (% of image width / height) measured on the light-trail image.
// x/y = glowing dot on the trail, lx/ly = label anchor point, p = connector path to the dot.
const traceNodes = [
  { x: 37, y: 84, lx: 14, ly: 66, p: "M14 75 C 16 82, 32 82, 37 84", e: "01 · Orchard", t: "Sfax, Tunisia", s: "34.74° N · 10.76° E" },
  { x: 45.5, y: 91.5, lx: 29, ly: 66, p: "M29 75 C 30 84, 42 88, 45.5 91.5", e: "02 · Harvest", t: "18 Nov 2025", s: "Hand-picked Chemlali" },
  { x: 50, y: 90.5, lx: 44, ly: 66, p: "M44 75 C 45 82, 48 86, 50 90.5", e: "03 · Mill", t: "Cold extracted", s: "< 27 °C · two-phase" },
  { x: 56, y: 80.5, lx: 55, ly: 64, p: "M55 73 C 55.5 77, 55.8 79, 56 80.5", e: "04 · Laboratory", t: "0.21 % acidity", s: "Extra virgin grade" },
  { x: 66, y: 77.5, lx: 68, ly: 62, p: "M68 71 C 67.5 75, 66.5 76.5, 66 77.5", e: "05 · Bottling", t: "Lot ZTN-26-04", s: "750 ml · Feb 2026" },
] as const;
const QR_NODE = { x: 77.5, y: 64 };

const nodeDelay = (x: number) => Math.round(400 + ((100 - x) / 100) * 1900);

function TraceNode({ x, y, lx, ly, e, t, s }: (typeof traceNodes)[number]) {
  const delay = `${nodeDelay(x)}ms`;
  return (
    <>
      <span className="node-in animate-pulse-ring absolute h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold/80" style={{ left: `${x}%`, top: `${y}%`, transitionDelay: delay }} />
      <div className="node-in absolute w-36 -translate-x-1/2 text-center" style={{ left: `${lx}%`, top: `${ly}%`, transitionDelay: delay }}>
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-gold">{e}</p>
        <p className="mt-0.5 font-display text-lg leading-tight text-ink">{t}</p>
        <p className="text-xs text-ink/60">{s}</p>
      </div>
    </>
  );
}

function HeroStage() {
  return (
    <Reveal className="relative mt-12 xl:mt-0">
      <div className="relative xl:translate-x-[3%]">
        <div className="absolute bottom-[10%] right-[8%] top-[5%] w-[22%] rounded-full bg-gold/25 blur-[80px]" />
        <img
          src={lightTrail}
          alt="Premium Tunisian olive oil bottle with a golden light trail tracing its journey to the QR code on its label"
          width={1672}
          height={941}
          fetchPriority="high"
          className="relative w-full drop-shadow-[0_30px_30px_oklch(0.3_0.06_70/25%)]"
        />

        <div className="hidden lg:block">
          {traceNodes.map((n) => <TraceNode key={n.e} {...n} />)}

          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="node-in pointer-events-none absolute inset-0 h-full w-full" style={{ transitionDelay: "300ms" }} aria-hidden>
            {traceNodes.map((n) => (
              <path key={n.e} d={n.p} fill="none" stroke="var(--gold)" strokeWidth="1" strokeDasharray="3 5" strokeOpacity="0.9" vectorEffect="non-scaling-stroke" />
            ))}
            <path d="M60 24 C 64 38, 70 52, 77.5 64" fill="none" stroke="var(--gold)" strokeWidth="1.5" strokeDasharray="4 6" vectorEffect="non-scaling-stroke" />
          </svg>
          <span className="node-in animate-pulse-ring absolute h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-md border-2 border-gold" style={{ left: `${QR_NODE.x}%`, top: `${QR_NODE.y}%`, transitionDelay: "300ms" }} />

          <div className="node-in absolute left-[48%] top-[4%] flex items-center gap-3 rounded-2xl bg-white p-2.5 pr-4 text-ink shadow-card ring-1 ring-gold/30" style={{ transitionDelay: "200ms" }}>
            <div className="relative overflow-hidden rounded-xl p-0.5">
              <QRCodeSVG value="https://veritrace.app/p/ZTN-EVOO-2026-0417" size={56} level="M" bgColor="transparent" fgColor="currentColor" />
              <div className="animate-scan absolute inset-x-0.5 h-0.5 rounded-full bg-gold-gradient" />
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-gold">Scan to verify</p>
              <p className="mt-0.5 flex items-center gap-1.5 font-display text-base leading-tight text-ink"><ShieldCheck className="h-4 w-4 text-success" /> Sealed on-chain</p>
              <p className="font-mono text-[10px] text-ink/60">0x8f3a…c91e · #4,812,330</p>
            </div>
          </div>
        </div>
      </div>

      <ol className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3 lg:hidden">
        {traceNodes.map((n) => (
          <li key={n.e} className="border-l border-gold/50 pl-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold">{n.e}</p>
            <p className="font-display text-lg leading-tight">{n.t}</p>
            <p className="text-xs text-muted-foreground">{n.s}</p>
          </li>
        ))}
        <li className="border-l border-success/50 pl-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-success">06 · Verified</p>
          <p className="font-display text-lg leading-tight">Sealed on-chain</p>
          <p className="font-mono text-xs text-muted-foreground">0x8f3a…c91e</p>
        </li>
      </ol>
    </Reveal>
  );
}

function Index() {
  return (
    <div className="min-h-screen">
      <SiteNav />

      {/* HERO */}
      <section className="grain relative overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-accent/70 blur-[120px]" />
        <div className="absolute -right-20 top-10 h-[600px] w-[600px] rounded-full bg-gold/15 blur-[140px]" />
        <div className="grid-lines absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_top,#000_20%,transparent_70%)]" />
        <div className="relative mx-auto max-w-7xl px-6 pb-16 pt-16 lg:pt-20 xl:pt-6">
          <Reveal className="relative z-10 max-w-xl xl:absolute xl:left-6 xl:top-8 xl:w-[42%] xl:max-w-none">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 px-3 py-1.5 text-xs text-muted-foreground shadow-card backdrop-blur xl:mb-5">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" /> Block #4,812,330 sealed · 2s ago
            </div>
            <h1 className="text-5xl font-medium leading-[1.02] tracking-[-0.03em] md:text-7xl xl:text-6xl">
              Every product<br />has a story.<br /><em className="text-gold-gradient font-normal">Prove it.</em>
            </h1>
            <p className="mt-7 max-w-lg text-lg text-muted-foreground xl:mt-4 xl:max-w-md xl:text-base">
              Veritrace issues blockchain-anchored digital product passports. One QR code connects a physical unit to its verified origin, journey and impact — for food today, textile tomorrow.
            </p>
            <div className="mt-10 flex flex-wrap gap-3 xl:mt-6">
              <Button asChild size="lg" className="rounded-full px-7"><Link to="/passport">Scan a sample passport <ArrowRight /></Link></Button>
              <Button asChild size="lg" variant="outline" className="rounded-full border-border bg-surface/70 px-7 backdrop-blur"><Link to="/signup">Onboard your brand</Link></Button>
            </div>
          </Reveal>

          <HeroStage />

          <Reveal as="dl" className="mt-10 grid grid-cols-3 gap-6 border-t border-border pt-8 lg:mt-6">
            {[["1.2M", "units traced"], ["340+", "producers onboarded"], ["100%", "events anchored on-chain"]].map(([n, l]) => (
              <div key={l}><dt className="font-display text-3xl md:text-4xl">{n}</dt><dd className="mt-1 text-xs text-muted-foreground md:text-sm">{l}</dd></div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* COMPLIANCE MARQUEE */}
      <section className="border-y border-border bg-surface-2/60 py-5">
        <div className="mx-auto flex max-w-7xl items-center gap-8 px-6">
          <span className="hidden shrink-0 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground md:block">Built for<br />compliance</span>
          <div className="mask-fade-x group flex-1 overflow-hidden">
            <div className="animate-marquee flex w-max group-hover:[animation-play-state:paused]">
              {[...compliance, ...compliance].map(([I, t], k) => (
                <span key={k} aria-hidden={k >= compliance.length} className="mr-3 inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-border bg-card px-4 py-2 text-sm shadow-card">
                  <I className="h-4 w-4 text-gold" /> {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <ScanDemo />

      <HowItWorks />

      <ProducerWorkspace />

      {/* SECTORS — BENTO */}
      <section id="sectors" className="mx-auto max-w-7xl scroll-mt-20 px-6 pb-28">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div><p className="eyebrow">04 · One platform, many supply chains</p><h2 className="mt-4 text-4xl md:text-6xl">Sectors</h2></div>
          <p className="max-w-md text-sm text-muted-foreground">We start where provenance matters most: olive oil. Every module shares the same ledger, QR standard and verification flow.</p>
        </Reveal>
        <div className="mt-12 grid auto-rows-[220px] gap-4 md:grid-cols-4">
          <Reveal className="group relative row-span-2 overflow-hidden rounded-3xl shadow-card md:col-span-2">
            <img src={bottle} alt="Extra virgin olive oil" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/35 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-8 text-cream">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-gradient px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-ink"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ink" /> Live</span>
              <h3 className="mt-4 text-4xl md:text-5xl">Olive oil</h3>
              <p className="mt-2 max-w-sm text-sm text-cream/80">Full tree-to-bottle passports: orchard GPS, mill, lab analyses, batch aggregation and export documents.</p>
              <div className="mt-5 flex flex-wrap items-center gap-2">
                {["8 rubrics", "Lab analyses", "Batch merge"].map((c) => <span key={c} className="rounded-full border border-cream/25 bg-cream/10 px-3 py-1 text-xs backdrop-blur">{c}</span>)}
                <Link to="/products" className="ml-auto inline-flex items-center gap-1.5 text-sm font-medium text-cream hover:text-gold">Explore <ArrowRight className="h-4 w-4" /></Link>
              </div>
            </div>
          </Reveal>
          {otherSectors.map((s, i) => (
            <Reveal key={s.t} delay={(i + 1) * 100} className={`panel group relative overflow-hidden p-6 transition-transform hover:-translate-y-1 ${s.span}`}>
              <s.icon className="absolute -bottom-6 -right-6 h-36 w-36 text-foreground/[0.04] transition-transform duration-700 group-hover:scale-110" />
              <div className="relative flex h-full flex-col">
                <div className="flex items-center justify-between">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent text-accent-foreground"><s.icon className="h-5 w-5" /></span>
                  <span className="rounded-full border border-border bg-surface-2 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{s.s}</span>
                </div>
                <h3 className="mt-auto text-2xl">{s.t}</h3>
                <p className="mt-1.5 max-w-xs text-sm text-muted-foreground">{s.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* OIL FEATURE */}
      <section className="relative overflow-hidden border-y border-border bg-surface-2/70">
        <div className="mx-auto grid max-w-7xl gap-14 px-6 py-28 lg:grid-cols-2">
          <Reveal className="relative">
            <img src={mill} alt="Olive oil flowing from a traditional mill" loading="lazy" width={1280} height={912} className="aspect-[4/5] w-full rounded-3xl object-cover shadow-card" />
            <div className="panel absolute -bottom-8 right-6 w-64 p-5 backdrop-blur-xl">
              <p className="eyebrow text-[10px]">Lab analysis · ZTN-26-04</p>
              <div className="mt-3 space-y-2.5 text-sm">
                {[["Free acidity", "0.21 %", 21], ["Peroxide", "6.4 meq", 32], ["Polyphenols", "612 mg/kg", 82]].map(([k, v, p]) => (
                  <div key={k as string}>
                    <div className="flex justify-between"><span className="text-muted-foreground">{k}</span><span className="font-mono">{v}</span></div>
                    <div className="mt-1 h-1.5 rounded-full bg-muted"><div className="grow-x h-1.5 rounded-full bg-gold-gradient" style={{ width: `${p}%` }} /></div>
                  </div>
                ))}
              </div>
              <p className="mt-3 flex items-center gap-1 text-[11px] text-success"><Check className="h-3 w-3" /> Extra virgin grade confirmed</p>
            </div>
          </Reveal>
          <Reveal delay={150} className="flex flex-col justify-center">
            <p className="eyebrow">05 · Sector focus · Olive oil</p>
            <h2 className="mt-4 text-4xl leading-tight md:text-5xl">Liquid gold deserves<br /><em className="text-gold-gradient">a verifiable past.</em></h2>
            <p className="mt-6 text-muted-foreground">Olive oil is one of the most counterfeited foods in the world. Veritrace follows each lot from the tree to the bottle — orchard GPS, harvest date, mill, pressing, lab analysis, bottling and export — and seals every step on-chain.</p>
            <div className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border shadow-card">
              {OIL_RUBRICS.map((r) => (
                <div key={r.key} className="group flex items-start gap-3 bg-card p-4 transition-colors hover:bg-cream">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-accent text-accent-foreground transition-colors group-hover:bg-gold-gradient group-hover:text-ink"><r.icon className="h-4 w-4" /></span>
                  <div><p className="text-sm font-semibold">{r.title}</p><p className="text-xs text-muted-foreground">{r.short}</p></div>
                </div>
              ))}
            </div>
            <Button asChild size="lg" className="mt-10 w-fit rounded-full px-7"><Link to="/passport">Open the oil passport <ArrowRight /></Link></Button>
          </Reveal>
        </div>
      </section>

      {/* CHAIN OF CUSTODY — TIMELINE */}
      <section className="mx-auto max-w-7xl px-6 py-28">
        <Reveal className="max-w-2xl">
          <p className="eyebrow">06 · Chain of custody</p>
          <h2 className="mt-4 text-4xl text-balance md:text-6xl">Five hands. One unbroken record.</h2>
          <p className="mt-5 text-muted-foreground">Every actor signs its own step. Each event references the previous one, so the full history of a bottle can be replayed and checked by anyone.</p>
        </Reveal>
        <Reveal className="relative mt-16">
          <div className="absolute left-6 right-6 top-6 hidden h-0.5 bg-border lg:block"><div className="grow-x h-full bg-gold-gradient" /></div>
          <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {timeline.map((s) => (
              <li key={s.t} className="relative">
                <div className="relative z-10 grid h-12 w-12 place-items-center rounded-full border border-gold/40 bg-card shadow-card"><s.i className="h-5 w-5 text-gold" /></div>
                <div className="mt-5 rounded-2xl border border-border bg-card p-5 shadow-card transition-transform hover:-translate-y-1">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{s.date}</p>
                  <h3 className="mt-2 text-xl">{s.t}</h3>
                  <p className="text-sm font-medium">{s.p}</p>
                  <p className="text-xs text-muted-foreground">{s.d}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-gold/10 px-2.5 py-1 font-mono text-[10px] text-gold"><Check className="h-3 w-3" /> {s.h}</span>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>
      </section>

      <LiveLedger />

      {/* PASSPORT — PHONE MOCKUP */}
      <section className="mx-auto max-w-7xl px-6 pb-28">
        <div className="grain relative overflow-hidden rounded-[2rem] border border-border bg-gradient-to-br from-cream via-card to-accent shadow-card">
          <img src={grove} alt="" loading="lazy" className="absolute inset-y-0 right-0 hidden h-full w-1/2 object-cover lg:block" />
          <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-gradient-to-r from-card via-card/40 to-transparent lg:block" />
          <div className="relative grid items-center gap-12 p-8 md:p-16 lg:grid-cols-2">
            <Reveal>
              <p className="eyebrow">08 · The consumer experience</p>
              <h2 className="mt-4 text-4xl md:text-5xl">A QR code that<br /><em className="text-gold-gradient">can't lie.</em></h2>
              <p className="mt-5 max-w-md text-muted-foreground">This is what your customer sees after one scan — no app, no login. A beautiful, branded page that turns transparency into a selling point.</p>
              <ul className="mt-8 space-y-4 text-sm">
                {[
                  [Fingerprint, "Serialized per unit", "Cloned codes are detected and flagged instantly"],
                  [Globe2, "Works with any phone camera", "GS1 Digital Link compatible, multilingual"],
                  [Award, "Proofs attached", "Certifications & lab reports signed by issuers"],
                ].map(([I, t, d], k) => {
                  const Icon = I as typeof Fingerprint;
                  return (
                    <li key={k} className="flex gap-4">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-border bg-card shadow-card"><Icon className="h-5 w-5 text-gold" /></span>
                      <div><p className="font-semibold">{t as string}</p><p className="text-muted-foreground">{d as string}</p></div>
                    </li>
                  );
                })}
              </ul>
              <Button asChild size="lg" className="mt-10 rounded-full px-7"><Link to="/passport">Try the live passport <ArrowRight /></Link></Button>
            </Reveal>
            <Reveal delay={200} className="flex justify-center"><PhonePassport /></Reveal>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="border-y border-border bg-surface-2/60">
        <div className="mx-auto grid max-w-7xl gap-14 px-6 py-24 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <Reveal as="figure">
            <p className="eyebrow">09 · Trusted at origin</p>
            <blockquote className="mt-6 font-display text-3xl leading-snug tracking-tight text-balance md:text-4xl">
              “Our buyers in Rotterdam used to ask for paperwork by email. Now they scan the bottle and see the lab report, the harvest photos and the shipping log in seconds.”
            </blockquote>
            <figcaption className="mt-8 flex items-center gap-4">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-gold-gradient font-display text-lg text-ink">AB</span>
              <div><p className="font-semibold">Amel Ben Ali</p><p className="text-sm text-muted-foreground">Export manager, Domaine Zitouna</p></div>
            </figcaption>
          </Reveal>
          <div className="grid grid-cols-2 gap-4">
            {[["−92%", "time spent answering buyer audits"], ["3.4×", "more consumer engagement vs. paper labels"], ["5 days", "from signup to first printed passport"], ["0", "counterfeit units undetected"]].map(([v, l], i) => (
              <Reveal key={l} delay={i * 100} className="panel p-6">
                <p className="font-display text-4xl">{v}</p>
                <p className="mt-2 text-sm text-muted-foreground">{l}</p>
              </Reveal>
            ))}
          </div>
        </div>
        <div className="border-t border-border">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-12 gap-y-4 px-6 py-8 font-display text-xl text-muted-foreground/70">
            {["Moulin El Bousten", "ONH Laboratory", "ECOCERT", "CTN Maritime", "Grigolato.NL"].map((n) => <span key={n} className="transition-colors hover:text-foreground">{n}</span>)}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto grid max-w-7xl scroll-mt-20 gap-12 px-6 py-28 lg:grid-cols-[0.8fr_1.2fr]">
        <Reveal>
          <p className="eyebrow">10 · FAQ</p>
          <h2 className="mt-4 text-4xl md:text-5xl">Questions,<br />answered.</h2>
          <p className="mt-5 max-w-sm text-muted-foreground">Can't find what you're looking for? Our team replies within one business day.</p>
          <Button asChild variant="outline" className="mt-8 rounded-full bg-card"><a href="mailto:hello@veritrace.app"><Mail /> Contact us</a></Button>
        </Reveal>
        <Reveal delay={150}>
          <Accordion type="single" collapsible defaultValue="q0" className="rounded-3xl border border-border bg-card px-6 shadow-card md:px-8">
            {faqs.map(([q, a], i) => (
              <AccordionItem key={q} value={`q${i}`} className="last:border-b-0">
                <AccordionTrigger className="py-6 text-left font-display text-lg hover:no-underline md:text-xl">{q}</AccordionTrigger>
                <AccordionContent className="pb-6 text-muted-foreground">{a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </section>

      <CTA />
      <SiteFooter />
    </div>
  );
}

function CTA() {
  const navigate = useNavigate();
  return (
    <section className="mx-auto max-w-7xl px-6 pb-28">
      <Reveal className="relative overflow-hidden rounded-[2rem] border border-border bg-gradient-to-br from-accent via-card to-cream px-6 py-20 text-center shadow-card">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-gold/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-olive/15 blur-3xl" />
        <div className="relative">
          <h2 className="text-4xl text-balance md:text-6xl">Ready to make your<br /><em className="text-gold-gradient">provenance provable?</em></h2>
          <p className="mx-auto mt-5 max-w-lg text-muted-foreground">Tell us about your products — we'll set up a pilot passport for one of your lots.</p>
          <form onSubmit={(e) => { e.preventDefault(); navigate({ to: "/signup" }); }} className="mx-auto mt-10 flex max-w-md flex-col gap-2 sm:flex-row sm:rounded-full sm:border sm:border-border sm:bg-card sm:p-1.5 sm:shadow-card">
            <input type="email" required placeholder="Work email" aria-label="Work email" className="h-12 flex-1 rounded-full border border-border bg-card px-5 text-sm outline-none focus:ring-2 focus:ring-gold/30 sm:h-11 sm:border-0 sm:bg-transparent sm:focus:ring-0" />
            <Button type="submit" size="lg" className="h-12 rounded-full px-6 sm:h-11">Get a demo <ArrowRight /></Button>
          </form>
          <p className="mt-5 text-sm text-muted-foreground">or <Link to="/passport" className="font-medium text-gold underline-offset-4 hover:underline">explore a live passport</Link></p>
        </div>
      </Reveal>
    </section>
  );
}
