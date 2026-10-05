import { useEffect, useState } from "react";
import SocialIcon from "@/components/SocialIcon";
import type { SocialLink } from "@/lib/api";
import { LABEL } from "@/lib/station";

type Props = {
  socials: SocialLink[];
};

/**
 * Desktop-only social strip in the left page gutter. Uses difference blending so it stays legible over
 * the light and dark sections, and fades out once the Respond footer (which lists the socials) is in view.
 */
export default function SocialRail({ socials }: Props) {
  const [footerVisible, setFooterVisible] = useState(false);

  useEffect(() => {
    const footer = document.getElementById("respond");
    if (!footer) return;
    const observer = new IntersectionObserver(([entry]) => setFooterVisible(entry.isIntersecting));
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  if (socials.length === 0) return null;

  return (
    <nav
      aria-label="Social links"
      inert={footerVisible}
      className={`hidden md:flex fixed left-3 bottom-0 z-30 w-4 flex-col items-center gap-5 text-white mix-blend-difference transition-opacity duration-300 ${
        footerVisible ? "opacity-0" : "opacity-100"
      }`}
    >
      <span className={`${LABEL} [writing-mode:vertical-rl] rotate-180 select-none`}>ON AIR</span>
      {socials.map((social) => (
        <a
          key={social.id}
          href={social.url ?? "#"}
          target={social.url?.startsWith("mailto:") ? undefined : "_blank"}
          rel="noopener noreferrer"
          aria-label={social.label ?? social.platform ?? ""}
          title={social.label ?? social.platform ?? ""}
          className="flex items-center justify-center text-white transition-transform hover:-translate-y-0.5"
        >
          <SocialIcon social={social} className="w-4 h-4" />
        </a>
      ))}
      <span aria-hidden className="block w-px h-16 bg-white" />
    </nav>
  );
}
