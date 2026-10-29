import { QRCodeSVG } from "qrcode.react";
import { ShieldCheck } from "lucide-react";

export function BrandQR({
  value,
  producer = "Domaine Zitouna",
  size = 190,
  scan = false,
}: {
  value: string;
  producer?: string;
  size?: number;
  scan?: boolean;
}) {
  return (
    <div className="relative w-fit rounded-3xl bg-card p-5 text-ink shadow-glow ring-1 ring-border">
      <div className="mb-4 flex items-center justify-between gap-6">
        <span className="rounded-full bg-ink px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-cream">
          {producer}
        </span>
        <span className="font-mono text-[10px] tracking-widest opacity-60">DPP · EU</span>
      </div>
      <div className="relative overflow-hidden rounded-xl">
        <QRCodeSVG
          value={value}
          size={size}
          level="H"
          bgColor="transparent"
          fgColor="currentColor"
          imageSettings={{ src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' rx='10' fill='%231d1a14'/%3E%3Cpath d='M20 9c6 4 8 10 4 17-2 3-5 5-8 5 1-6 1-12 4-22z' fill='%23d9b54a'/%3E%3C/svg%3E", height: 38, width: 38, excavate: true }}
        />
        {scan && <div className="animate-scan absolute inset-x-0 top-0 h-0.5 bg-gold-gradient shadow-glow" />}
      </div>
      <div className="mt-4 flex items-center justify-center gap-2 border-t border-ink/15 pt-3 text-xs font-semibold">
        <ShieldCheck className="h-4 w-4" />
        Trace<span className="opacity-40">·</span>Verify<span className="opacity-40">·</span>Trust
      </div>
    </div>
  );
}
