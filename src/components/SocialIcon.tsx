import {
  AtSign,
  Codepen,
  Dribbble,
  Facebook,
  FileText,
  Github,
  Gitlab,
  Globe,
  Instagram,
  Linkedin,
  Mail,
  Rss,
  Twitch,
  Twitter,
  Youtube,
  type LucideIcon,
} from "lucide-react";
import type { SocialLink } from "@/lib/api";

// Explicit set instead of `import * as Icons` so the homepage bundle doesn't ship every lucide icon
const ICONS: Record<string, LucideIcon> = {
  AtSign, Codepen, Dribbble, Facebook, FileText, Github, Gitlab, Globe,
  Instagram, Linkedin, Mail, Rss, Twitch, Twitter, Youtube,
};

export const SUPPORTED_SOCIAL_ICONS = Object.keys(ICONS);

const BY_LOWERCASE = Object.fromEntries(Object.entries(ICONS).map(([k, v]) => [k.toLowerCase(), v]));

/** The social's configured icon (or platform name) if supported, else a two-letter text badge. */
export default function SocialIcon({ social, className }: { social: SocialLink; className?: string }) {
  const Icon = BY_LOWERCASE[(social.icon ?? "").toLowerCase()] ?? BY_LOWERCASE[(social.platform ?? "").toLowerCase()];
  if (Icon) return <Icon className={className} strokeWidth={1.75} aria-hidden />;
  return (
    <span aria-hidden className="text-[10px] font-bold leading-none">
      {(social.label ?? social.platform ?? "?").slice(0, 2).toUpperCase()}
    </span>
  );
}
