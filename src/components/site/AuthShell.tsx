import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/site/SiteNav";
import grove from "@/assets/hero-grove.jpg";

export function AuthShell({ title, sub, children, footer }: { title: string; sub: string; children: ReactNode; footer: ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="grain relative hidden overflow-hidden lg:block">
        <img src={grove} alt="Olive grove" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute bottom-12 left-12 right-12">
          <p className="eyebrow">Trace · Verify · Trust</p>
          <p className="mt-4 font-display text-4xl leading-tight">"Every bottle now carries<br />its own proof of origin."</p>
          <p className="mt-4 text-sm text-muted-foreground">— Domaine Zitouna, Sfax</p>
        </div>
      </div>
      <div className="flex flex-col p-8">
        <Logo />
        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center">
          <h1 className="text-4xl">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{sub}</p>
          <div className="mt-8">{children}</div>
          <p className="mt-8 text-center text-sm text-muted-foreground">{footer}</p>
        </div>
        <Link to="/" className="text-center text-xs text-muted-foreground hover:text-foreground">← Back to home</Link>
      </div>
    </div>
  );
}

export function Field({ label, ...p }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-muted-foreground">{label}</span>
      <input {...p} className="h-12 w-full rounded-xl border border-input bg-surface px-4 text-sm outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/20" />
    </label>
  );
}
