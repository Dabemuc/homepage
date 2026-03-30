import { drizzle } from "drizzle-orm/d1";
import * as schema from "../../../db/schema";
import { eq } from "drizzle-orm";
import type { Env } from "../../env";

export const onRequestGet: PagesFunction<Env> = async (context) => {
  console.log("[homepage] function invoked");
  try {
  const db = drizzle(context.env.DB, { schema });

  const [config, introRows, projectRows, sectionRows, entryRows, socialRows] = await Promise.all([
    db.select().from(schema.siteConfig),
    db.select().from(schema.intro),
    db.select().from(schema.projects).where(eq(schema.projects.visible, true)).orderBy(schema.projects.display_order),
    db.select().from(schema.careerSections).where(eq(schema.careerSections.visible, true)).orderBy(schema.careerSections.display_order),
    db.select().from(schema.careerEntries).orderBy(schema.careerEntries.display_order),
    db.select().from(schema.socialLinks).where(eq(schema.socialLinks.visible, true)).orderBy(schema.socialLinks.display_order),
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
  } catch (err) {
    console.error("[homepage] error:", err);
    return Response.json({ success: false, error: String(err) }, { status: 500 });
  }
};
