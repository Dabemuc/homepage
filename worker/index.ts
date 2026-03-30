import { drizzle } from "drizzle-orm/d1";
import { verifyToken } from "@clerk/backend";
import * as schema from "../db/schema";
import { eq } from "drizzle-orm";

interface Env {
  DB: D1Database;
  CLERK_SECRET_KEY: string;
  ADMIN_CLERK_USER_ID: string;
  VITE_CLERK_PUBLISHABLE_KEY: string;
}

async function requireAuth(request: Request, env: Env): Promise<Response | null> {
  const auth = request.headers.get("Authorization");
  if (!auth?.startsWith("Bearer ")) {
    return Response.json({ success: false, error: "UNAUTHORIZED" }, { status: 401 });
  }
  const token = auth.slice(7);
  try {
    const payload = await verifyToken(token, { secretKey: env.CLERK_SECRET_KEY });
    if (payload.sub !== env.ADMIN_CLERK_USER_ID) {
      return Response.json({ success: false, error: "FORBIDDEN" }, { status: 403 });
    }
  } catch {
    return Response.json({ success: false, error: "INVALID_TOKEN" }, { status: 401 });
  }
  return null;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const { method } = request;
    const { pathname } = url;

    if (!pathname.startsWith("/api/")) {
      return new Response(null, { status: 404 });
    }

    if (pathname.startsWith("/api/admin/")) {
      const authError = await requireAuth(request, env);
      if (authError) return authError;
    }

    const db = drizzle(env.DB, { schema });

    // GET /api/public/homepage
    if (pathname === "/api/public/homepage" && method === "GET") {
      try {
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
          data: { config: configMap, intro: introRows[0] ?? null, projects: projectRows, career, socials: socialRows },
        });
      } catch (err) {
        return Response.json({ success: false, error: String(err) }, { status: 500 });
      }
    }

    // /api/admin/intro
    if (pathname === "/api/admin/intro") {
      if (method === "GET") {
        const rows = await db.select().from(schema.intro);
        return Response.json({ success: true, data: rows[0] ?? null });
      }
      if (method === "PUT") {
        const body = await request.json() as { name?: string; tagline?: string; bio?: string; avatar_url?: string };
        const existing = await db.select().from(schema.intro).where(eq(schema.intro.id, 1));
        if (existing.length === 0) {
          await db.insert(schema.intro).values({ id: 1, ...body });
        } else {
          await db.update(schema.intro).set(body).where(eq(schema.intro.id, 1));
        }
        const updated = await db.select().from(schema.intro).where(eq(schema.intro.id, 1));
        return Response.json({ success: true, data: updated[0] });
      }
    }

    // /api/admin/projects
    if (pathname === "/api/admin/projects") {
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
      if (method === "GET") {
        const rows = await db.select().from(schema.projects).orderBy(schema.projects.display_order);
        return Response.json({ success: true, data: rows });
      }
      if (method === "POST") {
        const body = await request.json() as ProjectBody;
        const result = await db.insert(schema.projects).values(body).returning();
        return Response.json({ success: true, data: result[0] }, { status: 201 });
      }
      const id = url.searchParams.get("id");
      if (!id) return Response.json({ success: false, error: "MISSING_ID" }, { status: 400 });
      if (method === "PUT") {
        const body = await request.json() as ProjectBody;
        await db.update(schema.projects).set(body).where(eq(schema.projects.id, parseInt(id)));
        const updated = await db.select().from(schema.projects).where(eq(schema.projects.id, parseInt(id)));
        if (updated.length === 0) return Response.json({ success: false, error: "PROJECT_NOT_FOUND" }, { status: 404 });
        return Response.json({ success: true, data: updated[0] });
      }
      if (method === "DELETE") {
        await db.delete(schema.projects).where(eq(schema.projects.id, parseInt(id)));
        return Response.json({ success: true });
      }
    }

    // /api/admin/career
    if (pathname === "/api/admin/career") {
      type SectionBody = { title?: string; display_order?: number; visible?: boolean };
      type EntryBody = { section_id?: number; timestamp?: string; title?: string; description?: string; display_order?: number };

      if (method === "GET") {
        const [sections, entries] = await Promise.all([
          db.select().from(schema.careerSections).orderBy(schema.careerSections.display_order),
          db.select().from(schema.careerEntries).orderBy(schema.careerEntries.display_order),
        ]);
        const data = sections.map((section) => ({
          ...section,
          entries: entries.filter((e) => e.section_id === section.id),
        }));
        return Response.json({ success: true, data });
      }

      const type = url.searchParams.get("type");
      const id = url.searchParams.get("id");

      if (method === "POST") {
        if (type === "entry") {
          const body = await request.json() as EntryBody;
          const result = await db.insert(schema.careerEntries).values(body).returning();
          return Response.json({ success: true, data: result[0] }, { status: 201 });
        }
        const body = await request.json() as SectionBody;
        const result = await db.insert(schema.careerSections).values(body).returning();
        return Response.json({ success: true, data: result[0] }, { status: 201 });
      }

      if (!id) return Response.json({ success: false, error: "MISSING_ID" }, { status: 400 });

      if (method === "PUT") {
        if (type === "entry") {
          const body = await request.json() as EntryBody;
          await db.update(schema.careerEntries).set(body).where(eq(schema.careerEntries.id, parseInt(id)));
          const updated = await db.select().from(schema.careerEntries).where(eq(schema.careerEntries.id, parseInt(id)));
          return Response.json({ success: true, data: updated[0] ?? null });
        }
        const body = await request.json() as SectionBody;
        await db.update(schema.careerSections).set(body).where(eq(schema.careerSections.id, parseInt(id)));
        const updated = await db.select().from(schema.careerSections).where(eq(schema.careerSections.id, parseInt(id)));
        return Response.json({ success: true, data: updated[0] ?? null });
      }

      if (method === "DELETE") {
        if (type === "entry") {
          await db.delete(schema.careerEntries).where(eq(schema.careerEntries.id, parseInt(id)));
        } else {
          await db.delete(schema.careerEntries).where(eq(schema.careerEntries.section_id, parseInt(id)));
          await db.delete(schema.careerSections).where(eq(schema.careerSections.id, parseInt(id)));
        }
        return Response.json({ success: true });
      }
    }

    // /api/admin/socials
    if (pathname === "/api/admin/socials") {
      type SocialBody = {
        platform?: string;
        label?: string;
        url?: string;
        icon?: string;
        display_order?: number;
        visible?: boolean;
      };

      if (method === "GET") {
        const rows = await db.select().from(schema.socialLinks).orderBy(schema.socialLinks.display_order);
        return Response.json({ success: true, data: rows });
      }
      if (method === "POST") {
        const body = await request.json() as SocialBody;
        const result = await db.insert(schema.socialLinks).values(body).returning();
        return Response.json({ success: true, data: result[0] }, { status: 201 });
      }

      const id = url.searchParams.get("id");
      if (!id) return Response.json({ success: false, error: "MISSING_ID" }, { status: 400 });

      if (method === "PUT") {
        const body = await request.json() as SocialBody;
        await db.update(schema.socialLinks).set(body).where(eq(schema.socialLinks.id, parseInt(id)));
        const updated = await db.select().from(schema.socialLinks).where(eq(schema.socialLinks.id, parseInt(id)));
        if (updated.length === 0) return Response.json({ success: false, error: "SOCIAL_NOT_FOUND" }, { status: 404 });
        return Response.json({ success: true, data: updated[0] });
      }

      if (method === "DELETE") {
        await db.delete(schema.socialLinks).where(eq(schema.socialLinks.id, parseInt(id)));
        return Response.json({ success: true });
      }
    }

    return Response.json({ success: false, error: "NOT_FOUND" }, { status: 404 });
  },
} satisfies ExportedHandler<Env>;
