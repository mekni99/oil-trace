import { useEffect, useRef, useState, type CSSProperties, type ElementType, type ReactNode } from "react";

export function useInView<T extends Element>(rootMargin = "0px 0px -12% 0px", once = true) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          if (once) io.disconnect();
        } else if (!once) setInView(false);
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin, once]);
  return [ref, inView] as const;
}

export function Reveal({ as: Tag = "div", delay = 0, className = "", children }: { as?: ElementType; delay?: number; className?: string; children?: ReactNode }) {
  const [ref, inView] = useInView<HTMLElement>();
  return (
    <Tag ref={ref} data-in={inView} className={`reveal ${className}`} style={{ "--d": `${delay}ms` } as CSSProperties}>
      {children}
    </Tag>
  );
}
