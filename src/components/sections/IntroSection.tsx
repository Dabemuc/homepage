import type { Intro } from "@/lib/api";

type Props = {
  intro: Intro;
};

export default function IntroSection({ intro }: Props) {
  return (
    <section className="py-20 px-4 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row items-center gap-8">
        {intro.avatar_url && (
          <img
            src={intro.avatar_url}
            alt={intro.name ?? "Avatar"}
            className="w-32 h-32 rounded-full object-cover border-4 border-border shadow-lg flex-shrink-0"
          />
        )}
        <div>
          {intro.name && (
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">
              {intro.name}
            </h1>
          )}
          {intro.tagline && (
            <p className="text-xl text-muted-foreground mb-4">{intro.tagline}</p>
          )}
          {intro.bio && (
            <p className="text-base leading-relaxed text-foreground/80 max-w-2xl">
              {intro.bio}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
