import { drizzle } from "drizzle-orm/d1";
import * as schema from "../../../db/schema";
import { eq } from "drizzle-orm";
import type { Env } from "../../env";

type SectionBody = {
  title?: string;
  display_order?: number;
  visible?: boolean;
};

type EntryBody = {
  section_id?: number;
  timestamp?: string;
  title?: string;
  description?: string;
  display_order?: number;
};

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const db = drizzle(context.env.DB, { schema });
  const [sections, entries] = await Promise.all([
    db.select().from(schema.careerSections).orderBy(schema.careerSections.display_order).all(),
    db.select().from(schema.careerEntries).orderBy(schema.careerEntries.display_order).all(),
  ]);

  const data = sections.map((section) => ({
    ...section,
    entries: entries.filter((e) => e.section_id === section.id),
  }));

  return Response.json({ success: true, data });
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const db = drizzle(context.env.DB, { schema });
  const url = new URL(context.request.url);
  const type = url.searchParams.get("type");

  if (type === "entry") {
    const body = await context.request.json() as EntryBody;
    const result = await db.insert(schema.careerEntries).values(body).returning();
    return Response.json({ success: true, data: result[0] }, { status: 201 });
  }

  const body = await context.request.json() as SectionBody;
  const result = await db.insert(schema.careerSections).values(body).returning();
  return Response.json({ success: true, data: result[0] }, { status: 201 });
};

export const onRequestPut: PagesFunction<Env> = async (context) => {
  const db = drizzle(context.env.DB, { schema });
  const url = new URL(context.request.url);
  const type = url.searchParams.get("type");
  const id = url.searchParams.get("id");

  if (!id) {
    return Response.json({ success: false, error: "MISSING_ID" }, { status: 400 });
  }

  if (type === "entry") {
    const body = await context.request.json() as EntryBody;
    await db.update(schema.careerEntries).set(body).where(eq(schema.careerEntries.id, parseInt(id)));
    const updated = await db.select().from(schema.careerEntries).where(eq(schema.careerEntries.id, parseInt(id))).all();
    return Response.json({ success: true, data: updated[0] ?? null });
  }

  const body = await context.request.json() as SectionBody;
  await db.update(schema.careerSections).set(body).where(eq(schema.careerSections.id, parseInt(id)));
  const updated = await db.select().from(schema.careerSections).where(eq(schema.careerSections.id, parseInt(id))).all();
  return Response.json({ success: true, data: updated[0] ?? null });
};

export const onRequestDelete: PagesFunction<Env> = async (context) => {
  const db = drizzle(context.env.DB, { schema });
  const url = new URL(context.request.url);
  const type = url.searchParams.get("type");
  const id = url.searchParams.get("id");

  if (!id) {
    return Response.json({ success: false, error: "MISSING_ID" }, { status: 400 });
  }

  if (type === "entry") {
    await db.delete(schema.careerEntries).where(eq(schema.careerEntries.id, parseInt(id)));
  } else {
    await db.delete(schema.careerEntries).where(eq(schema.careerEntries.section_id, parseInt(id)));
    await db.delete(schema.careerSections).where(eq(schema.careerSections.id, parseInt(id)));
  }

  return Response.json({ success: true });
};
