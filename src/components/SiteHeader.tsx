import { useEffect, useRef, useState } from "react";
import SocialIcon from "@/components/SocialIcon";
import type { Intro, SocialLink } from "@/lib/api";
import { WRAP, LABEL, stationOf } from "@/lib/station";

type NavLink = { id: string; label: string };

type Props = {
  links: NavLink[];
  /** null while loading — the label stays empty instead of flashing the default */
  intro: Intro | null | undefined;
  socials: SocialLink[];
};

export default function SiteHeader({ links, intro, socials }: Props) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);
  // Closing via a nav link lets the anchor jump take focus instead of the burger
  const restoreFocus = useRef(true);

  // While open: lock page scroll, close on Escape, and move focus into the panel (and back on close)
  useEffect(() => {
    if (!open) {
      if (wasOpen.current && restoreFocus.current) burgerRef.current?.focus({ preventScroll: true });
      wasOpen.current = false;
      restoreFocus.current = true;
      return;
    }
    wasOpen.current = true;
    closeRef.current?.focus({ preventScroll: true });
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Sticky on mobile: show a hairline under the bar once the page has scrolled
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // The panel only exists below md; close it if the viewport grows past that
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = () => mq.matches && setOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const station = stationOf(intro ?? null);
  const stationLabel = intro === undefined ? "\u00a0" : `${station.name} — ${station.frequency} MHZ`;

  return (
    // Sticky below md (desktop has the tuner bar); overflow-x-clip on the page wrapper keeps sticky working
    <header
      className={`${WRAP} ${LABEL} sticky top-0 z-40 flex items-center justify-between gap-5 bg-tx-paper border-b transition-colors py-4 md:py-6 md:static md:border-b-0 ${
        scrolled ? "border-tx-ink/15" : "border-transparent"
      }`}
    >
      <span className="uppercase">{stationLabel}</span>

      {/* Desktop nav */}
      <nav className="hidden md:flex flex-wrap gap-7">
        {links.map(({ id, label }) => (
          <a key={id} href={`#${id}`} className="text-tx-ink no-underline hover:text-tx-signal">
            {label}
          </a>
        ))}
      </nav>

      {/* Mobile burger */}
      <button
        ref={burgerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open navigation"
        aria-expanded={open}
        aria-controls="mobile-nav"
        className="md:hidden -m-2 p-2 flex flex-col gap-[5px] cursor-pointer"
      >
        <span className="block w-6 h-[2px] bg-tx-ink" />
        <span className="block w-6 h-[2px] bg-tx-ink" />
        <span className="block w-4 h-[2px] bg-tx-signal" />
      </button>

      {/* Backdrop */}
      <div
        aria-hidden
        onClick={() => setOpen(false)}
        className={`md:hidden fixed inset-0 z-40 bg-tx-ink/40 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Slide-in panel */}
      <div
        id="mobile-nav"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation"
        inert={!open}
        className={`md:hidden fixed inset-y-0 right-0 z-50 w-[min(340px,85vw)] bg-tx-ink text-tx-paper flex flex-col px-6 py-6 motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between gap-4">
          {/* Name and frequency on separate lines so long names never squeeze the close button */}
          <span className="flex flex-col gap-1 text-tx-rule uppercase">
            <span>{intro === undefined ? "\u00a0" : station.name}</span>
            <span>{intro === undefined ? "\u00a0" : `${station.frequency} MHZ`}</span>
          </span>
          <button
            ref={closeRef}
            type="button"
            onClick={() => setOpen(false)}
            className="-m-2 p-2 shrink-0 whitespace-nowrap cursor-pointer hover:text-tx-signal"
          >
            CLOSE ✕
          </button>
        </div>

        <span className="mt-14 text-tx-rule">CHANNELS</span>
        <nav className="mt-4 flex flex-col border-t border-tx-line">
          {links.map(({ id, label }, index) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={() => {
                restoreFocus.current = false;
                setOpen(false);
              }}
              className="group flex items-baseline gap-4 py-4 border-b border-tx-line text-tx-paper no-underline"
            >
              <span className="text-tx-signal font-bold">{String(index + 1).padStart(2, "0")}</span>
              <span className="font-display font-extrabold text-[40px] leading-none tracking-normal transition-colors group-hover:text-tx-signal">
                {label}
              </span>
            </a>
          ))}
        </nav>

        <div className="mt-auto flex flex-col gap-5">
          {socials.length > 0 && (
            <div className="flex flex-wrap gap-x-6 gap-y-3">
              {socials.map((social) => (
                <a
                  key={social.id}
                  href={social.url ?? "#"}
                  target={social.url?.startsWith("mailto:") ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-tx-paper uppercase no-underline hover:text-tx-signal"
                >
                  <SocialIcon social={social} className="w-4 h-4" />
                  {social.label ?? social.platform}
                </a>
              ))}
            </div>
          )}
          <span className="text-tx-rule">
            <span className="text-tx-signal motion-safe:animate-tx-blink">●</span> STAY TUNED
          </span>
        </div>
      </div>
    </header>
  );
}
