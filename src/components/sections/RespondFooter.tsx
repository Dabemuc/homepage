import { Link } from "react-router-dom";
import type { SocialLink } from "@/lib/api";
import { WRAP, LABEL } from "@/lib/station";

/** "mailto:hi@x.de?subject=…" → "hi@x.de" */
function mailAddress(url: string): string {
  const address = url.replace(/^mailto:/i, "").split("?")[0];
  try {
    return decodeURIComponent(address);
  } catch {
    return address;
  }
}

type Props = {
  socials: SocialLink[];
  name: string | null;
};

export default function RespondFooter({ socials, name }: Props) {
  const mail = socials.find((s) => s.url?.startsWith("mailto:"));
  const others = socials.filter((s) => s !== mail && s.url);
  const respondClass =
    "font-display font-extrabold text-[clamp(56px,8vw,120px)] leading-[0.9] uppercase text-tx-card no-underline";

  return (
    <footer id="respond" className="bg-tx-signal text-tx-card pt-20 md:pt-[90px] pb-8">
      <div className={`${WRAP} flex flex-col gap-16 md:gap-20`}>
        <div className="flex flex-wrap justify-between items-end gap-8">
          <div className="flex flex-col gap-2.5">
            <span className={LABEL}>IF YOU CAN HEAR THIS —</span>
            {mail?.url ? (
              <>
                <a href={mail.url} className={`${respondClass} hover:text-tx-ink transition-colors`}>
                  Respond
                </a>
                <a href={mail.url} className="text-sm text-tx-card underline underline-offset-4 hover:text-tx-ink break-all">
                  → {mailAddress(mail.url)}
                </a>
              </>
            ) : (
              <span className={respondClass}>Respond</span>
            )}
          </div>
          {others.length > 0 && (
            <div className="flex flex-wrap gap-6 text-xs">
              {others.map((social) => (
                <a
                  key={social.id}
                  href={social.url!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-tx-card uppercase underline hover:text-tx-ink"
                >
                  {social.label ?? social.platform}
                </a>
              ))}
            </div>
          )}
        </div>

        <div className={`${LABEL} flex flex-wrap justify-between gap-4 pt-6 border-t border-tx-card/30`}>
          <span>
            © {new Date().getFullYear()} {name?.toUpperCase()} — END OF TRANSMISSION
          </span>
          <Link to="/admin" className="text-tx-card/70 no-underline hover:text-tx-ink">
            CONTROL ROOM
          </Link>
        </div>
      </div>
    </footer>
  );
}
