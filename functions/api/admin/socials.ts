import { drizzle } from "drizzle-orm/d1";
import * as schema from "../../../db/schema";
import { eq } from "drizzle-orm";
import type { Env } from "../../env";

type SocialBody = {
  platform?: string;
  label?: string;
  url?: string;
  icon?: string;
  display_order?: number;
  visible?: boolean;
};

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const db = drizzle(context.env.DB, { schema });
  const rows = await db.select().from(schema.socialLinks).orderBy(schema.socialLinks.display_order);
  return Response.json({ success: true, data: rows });
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const db = drizzle(context.env.DB, { schema });
  const body = await context.request.json() as SocialBody;
  const result = await db.insert(schema.socialLinks).values(body).returning();
  return Response.json({ success: true, data: result[0] }, { status: 201 });
};

export const onRequestPut: PagesFunction<Env> = async (context) => {
  const db = drizzle(context.env.DB, { schema });
  const url = new URL(context.request.url);
  const id = url.searchParams.get("id");

  if (!id) {
    return Response.json({ success: false, error: "MISSING_ID" }, { status: 400 });
  }

  const body = await context.request.json() as SocialBody;
  await db.update(schema.socialLinks).set(body).where(eq(schema.socialLinks.id, parseInt(id)));

  const updated = await db.select().from(schema.socialLinks).where(eq(schema.socialLinks.id, parseInt(id)));
  if (updated.length === 0) {
    return Response.json({ success: false, error: "SOCIAL_NOT_FOUND" }, { status: 404 });
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

  await db.delete(schema.socialLinks).where(eq(schema.socialLinks.id, parseInt(id)));
  return Response.json({ success: true });
};
