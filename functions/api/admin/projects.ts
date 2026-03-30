import { drizzle } from "drizzle-orm/d1";
import * as schema from "../../../db/schema";
import { eq } from "drizzle-orm";
import type { Env } from "../../env";

type ProjectBody = {
  title?: string;
  short_description?: string;
  description?: string;
  screenshot?: string;
  repo_url?: string;
  website_url?: string;
  tags?: string;
  display_order?: number;
  visible?: boolean;
};

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const db = drizzle(context.env.DB, { schema });
  const rows = await db.select().from(schema.projects).orderBy(schema.projects.display_order).all();
  return Response.json({ success: true, data: rows });
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const db = drizzle(context.env.DB, { schema });
  const body = await context.request.json() as ProjectBody;

  const result = await db.insert(schema.projects).values(body).returning();
  return Response.json({ success: true, data: result[0] }, { status: 201 });
};

export const onRequestPut: PagesFunction<Env> = async (context) => {
  const db = drizzle(context.env.DB, { schema });
  const url = new URL(context.request.url);
  const id = url.searchParams.get("id");

  if (!id) {
    return Response.json({ success: false, error: "MISSING_ID" }, { status: 400 });
  }

  const body = await context.request.json() as ProjectBody;
  await db.update(schema.projects).set(body).where(eq(schema.projects.id, parseInt(id)));

  const updated = await db.select().from(schema.projects).where(eq(schema.projects.id, parseInt(id))).all();
  if (updated.length === 0) {
    return Response.json({ success: false, error: "PROJECT_NOT_FOUND" }, { status: 404 });
  }

  return Response.json({ success: true, data: updated[0] });
};

export const onRequestDelete: PagesFunction<Env> = async (context) => {
  const db = drizzle(context.env.DB, { schema });
  const url = new URL(context.request.url);
  const id = url.searchParams.get("id");

  if (!id) {
    return Response.json({ success: false, error: "MISSING_ID" }, { status: 400 });
  }

  await db.delete(schema.projects).where(eq(schema.projects.id, parseInt(id)));
  return Response.json({ success: true });
};
