import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-gold-gradient">
        <svg viewBox="0 0 24 24" className="h-4 w-4 text-ink" fill="currentColor"><path d="M12 2c5 3.5 6.5 9 3.3 14.8C13.8 19.6 11.3 21 9 21c.6-5.8.8-12 3-19z" /></svg>
      </span>
      <span className="font-display text-xl font-semibold tracking-tight">Veritrace</span>
    </Link>
  );
}

const links = [
  { to: "/", label: "Platform" },
  { to: "/products", label: "Products" },
  { to: "/passport", label: "Oil passport" },
] as const;

const anchors = [
  { href: "/#how", label: "How it works" },
  { href: "/#sectors", label: "Sectors" },
  { href: "/#faq", label: "FAQ" },
];

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 border-b transition-all duration-300 ${scrolled ? "border-border bg-background/80 shadow-card backdrop-blur-xl" : "border-transparent bg-background/0"}`}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Logo />
        <nav className="hidden items-center gap-1 rounded-full border border-border bg-surface/60 p-1 backdrop-blur md:flex">
          {links.map((l) => (
            <Link key={l.to} to={l.to} activeOptions={{ exact: true }} className="rounded-full px-4 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground" activeProps={{ className: "rounded-full bg-card px-4 py-1.5 text-sm text-foreground shadow-card" }}>
              {l.label}
            </Link>
          ))}
          {anchors.map((a) => (
            <a key={a.href} href={a.href} className="rounded-full px-4 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">{a.label}</a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex"><Link to="/signin">Sign in</Link></Button>
          <Button asChild size="sm" className="rounded-full"><Link to="/signup">Get started</Link></Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full md:hidden" aria-label="Open menu"><Menu /></Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex w-[85%] max-w-sm flex-col gap-0 bg-background p-0">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <div className="flex h-16 items-center border-b border-border px-6"><Logo /></div>
              <nav className="flex flex-col p-4">
                {links.map((l) => (
                  <SheetClose asChild key={l.to}>
                    <Link to={l.to} className="flex items-center justify-between rounded-xl px-4 py-3.5 font-display text-2xl transition-colors hover:bg-surface-2">{l.label}<ArrowRight className="h-4 w-4 text-gold" /></Link>
                  </SheetClose>
                ))}
                {anchors.map((a) => (
                  <SheetClose asChild key={a.href}>
                    <a href={a.href} className="flex items-center justify-between rounded-xl px-4 py-3.5 font-display text-2xl transition-colors hover:bg-surface-2">{a.label}<ArrowRight className="h-4 w-4 text-gold" /></a>
                  </SheetClose>
                ))}
              </nav>
              <div className="mt-auto grid gap-2 border-t border-border p-6">
                <SheetClose asChild><Button asChild variant="outline" size="lg" className="rounded-full"><Link to="/signin">Sign in</Link></Button></SheetClose>
                <SheetClose asChild><Button asChild size="lg" className="rounded-full"><Link to="/signup">Get started</Link></Button></SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

const footerCols = [
  { title: "Platform", items: [["Passports", "/passport"], ["Verification", "/passport"], ["How it works", "/#how"], ["Compliance (EUDR, ESPR)", "/#faq"]] },
  { title: "Sectors", items: [["Olive oil", "/passport"], ["Grains & cereals", "/#sectors"], ["Fresh produce", "/#sectors"], ["Textile — soon", "/#sectors"]] },
  { title: "Company", items: [["Sign in", "/signin"], ["Create account", "/signup"], ["FAQ", "/#faq"], ["Contact", "mailto:hello@veritrace.app"]] },
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface-2/60">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
          <Logo />
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">Digital product passports anchored on blockchain — from the field to the shelf, for every product that deserves to be trusted.</p>
          <form className="mt-6 flex max-w-sm gap-2" onSubmit={(e) => e.preventDefault()}>
            <input type="email" required placeholder="you@company.com" aria-label="Email" className="h-10 flex-1 rounded-full border border-input bg-card px-4 text-sm outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/20" />
            <Button type="submit" size="sm" className="h-10 rounded-full px-5">Subscribe</Button>
          </form>
        </div>
        {footerCols.map((c) => (
          <div key={c.title} className="text-sm">
            <p className="eyebrow mb-4">{c.title}</p>
            <ul className="space-y-2.5">
              {c.items.map(([label, href]) => (
                <li key={label}><a href={href} className="text-muted-foreground transition-colors hover:text-foreground">{label}</a></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-6 font-mono text-xs text-muted-foreground">
          <span>© 2026 Veritrace · Trace. Verify. Trust.</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-foreground">Privacy</a>
            <a href="#" className="hover:text-foreground">Terms</a>
            <span className="inline-flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-success" /> All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
