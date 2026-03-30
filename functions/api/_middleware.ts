import { verifyToken } from "@clerk/backend";
import type { Env } from "../env";

export const onRequest: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url);
  if (!url.pathname.startsWith("/api/admin")) {
    return context.next();
  }

  const auth = context.request.headers.get("Authorization");
  if (!auth?.startsWith("Bearer ")) {
    return Response.json({ success: false, error: "UNAUTHORIZED" }, { status: 401 });
  }

  const token = auth.slice(7);
  try {
    const payload = await verifyToken(token, {
      secretKey: context.env.CLERK_SECRET_KEY,
    });
    if (payload.sub !== context.env.ADMIN_CLERK_USER_ID) {
      return Response.json({ success: false, error: "FORBIDDEN" }, { status: 403 });
    }
  } catch {
    return Response.json({ success: false, error: "INVALID_TOKEN" }, { status: 401 });
  }

  return context.next();
};
