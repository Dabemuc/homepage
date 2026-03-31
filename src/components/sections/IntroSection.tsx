import type { Intro } from "@/lib/api";

type Props = {
  intro: Intro;
};

export default function IntroSection({ intro }: Props) {
  return (
    <section className="py-24 px-6 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-10">
        {intro.avatar_url && (
          <div className="relative flex-shrink-0">
            {/* Glow ring behind avatar */}
            <div
              className="absolute inset-0 rounded-full blur-xl opacity-40"
              style={{
                background:
                  "radial-gradient(circle, var(--brand-glow), transparent 70%)",
                transform: "scale(1.3)",
              }}
            />
            <img
              src={intro.avatar_url}
              alt={intro.name ?? "Avatar"}
              className="relative w-28 h-28 md:w-32 md:h-32 rounded-full object-cover ring-2 ring-border shadow-xl"
            />
          </div>
        )}
        <div className="text-center md:text-left">
          {intro.name && (
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3 text-foreground">
              {intro.name}
            </h1>
          )}
          {intro.tagline && (
            <p className="text-lg text-primary font-medium mb-5 tracking-wide">
              {intro.tagline}
            </p>
          )}
          {intro.bio && (
            <p className="text-base leading-relaxed text-muted-foreground max-w-xl whitespace-pre-wrap">
              {intro.bio}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
