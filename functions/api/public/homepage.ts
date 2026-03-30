import { drizzle } from "drizzle-orm/d1";
import * as schema from "../../../db/schema";
import { eq } from "drizzle-orm";
import type { Env } from "../../env";

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const db = drizzle(context.env.DB, { schema });

  const [config, introRows, projectRows, sectionRows, entryRows, socialRows] = await Promise.all([
    db.select().from(schema.siteConfig).all(),
    db.select().from(schema.intro).all(),
    db.select().from(schema.projects).where(eq(schema.projects.visible, true)).orderBy(schema.projects.display_order).all(),
    db.select().from(schema.careerSections).where(eq(schema.careerSections.visible, true)).orderBy(schema.careerSections.display_order).all(),
    db.select().from(schema.careerEntries).orderBy(schema.careerEntries.display_order).all(),
    db.select().from(schema.socialLinks).where(eq(schema.socialLinks.visible, true)).orderBy(schema.socialLinks.display_order).all(),
  ]);

  const configMap = Object.fromEntries(config.map((c) => [c.key, c.value]));

  const career = sectionRows.map((section) => ({
    ...section,
    entries: entryRows.filter((e) => e.section_id === section.id),
  }));

  return Response.json({
    success: true,
    data: {
      config: configMap,
      intro: introRows[0] ?? null,
      projects: projectRows,
      career,
      socials: socialRows,
    },
  });
};
