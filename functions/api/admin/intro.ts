import { drizzle } from "drizzle-orm/d1";
import * as schema from "../../../db/schema";
import { eq } from "drizzle-orm";
import type { Env } from "../../env";

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const db = drizzle(context.env.DB, { schema });
  const rows = await db.select().from(schema.intro);
  return Response.json({ success: true, data: rows[0] ?? null });
};

export const onRequestPut: PagesFunction<Env> = async (context) => {
  const db = drizzle(context.env.DB, { schema });
  const body = await context.request.json() as {
    name?: string;
    tagline?: string;
    bio?: string;
    avatar_url?: string;
  };

  const existing = await db.select().from(schema.intro).where(eq(schema.intro.id, 1));
  if (existing.length === 0) {
    await db.insert(schema.intro).values({ id: 1, ...body });
  } else {
    await db.update(schema.intro).set(body).where(eq(schema.intro.id, 1));
  }

  const updated = await db.select().from(schema.intro).where(eq(schema.intro.id, 1));
  return Response.json({ success: true, data: updated[0] });
};
