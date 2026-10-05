import { useEffect, useState } from "react";
import { WRAP, LABEL, stationPosition } from "@/lib/station";

type NavLink = { id: string; label: string };

type Props = {
  links: NavLink[];
  stationName: string;
};

/**
 * Desktop-only sticky tuner: slides in once the hero's horizon dial has scrolled away.
 * The needle glides to the section currently being read; stations are anchor links.
 */
export default function TunerBar({ links, stationName }: Props) {
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const dial = document.getElementById("hero-dial");
      setVisible(!!dial && dial.getBoundingClientRect().bottom < 0);
      // Active station: the last section whose top has passed 40% of the viewport
      const line = window.innerHeight * 0.4;
      let current = 0;
      links.forEach(({ id }, i) => {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = i;
      });
      // A short last section (the footer) can never scroll up to that line — at the page bottom, tune to it
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      setActive(atBottom ? links.length - 1 : current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [links]);

  if (links.length === 0) return null;

  return (
    <div
      inert={!visible}
      className={`hidden md:block fixed top-0 inset-x-0 z-40 bg-tx-ink text-tx-paper transition-transform duration-300 ease-out ${
        visible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className={`${WRAP} h-14 flex items-center gap-8`}>
        <span className={`${LABEL} w-36 shrink-0 text-tx-rule uppercase truncate`}>{stationName}</span>

        <nav aria-label="Stations" className="relative flex-1 h-full">
          {/* Scale */}
          <div aria-hidden className="absolute inset-x-0 bottom-0 h-2.5 flex justify-between">
            {Array.from({ length: 41 }, (_, i) => (
              <span key={i} className={`w-px bg-tx-line ${i % 5 === 0 ? "h-2.5" : "h-1.5"} self-end`} />
            ))}
          </div>
          {links.map(({ id, label }, i) => (
            <a
              key={id}
              href={`#${id}`}
              aria-current={i === active ? "location" : undefined}
              className={`absolute top-1/2 -translate-x-1/2 -translate-y-[60%] font-display font-extrabold text-[15px] tracking-[0.02em] whitespace-nowrap no-underline transition-colors ${
                i === active ? "text-tx-signal" : "text-tx-paper hover:text-tx-signal"
              }`}
              style={{ left: `${stationPosition(i, links.length)}%` }}
            >
              {label}
            </a>
          ))}
          {/* Needle */}
          <span
            aria-hidden
            className="absolute bottom-0 h-4 w-[2px] -translate-x-1/2 bg-tx-signal transition-[left] duration-500 ease-out"
            style={{ left: `${stationPosition(active, links.length)}%` }}
          />
        </nav>

        <span className={`${LABEL} w-36 shrink-0 text-right text-tx-rule`}>
          TUNED: <span className="text-tx-paper">{links[active]?.label}</span>
        </span>
      </div>
    </div>
  );
}
