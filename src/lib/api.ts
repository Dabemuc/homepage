// Types
export type Intro = {
  id: number;
  name: string | null;
  tagline: string | null;
  bio: string | null;
  avatar_url: string | null;
};

export type Project = {
  id: number;
  title: string | null;
  short_description: string | null;
  description: string | null;
  screenshot: string | null;
  repo_url: string | null;
  website_url: string | null;
  tags: string | null;
  display_order: number | null;
  visible: boolean | null;
};

export type CareerEntry = {
  id: number;
  section_id: number | null;
  timestamp: string | null;
  title: string | null;
  description: string | null;
  display_order: number | null;
};

export type CareerSection = {
  id: number;
  title: string | null;
  display_order: number | null;
  visible: boolean | null;
  entries: CareerEntry[];
};

export type SocialLink = {
  id: number;
  platform: string | null;
  label: string | null;
  url: string | null;
  icon: string | null;
  display_order: number | null;
  visible: boolean | null;
};

export type HomepageData = {
  config: Record<string, string | null>;
  intro: Intro | null;
  projects: Project[];
  career: CareerSection[];
  socials: SocialLink[];
};

// Public API
export async function fetchHomepage(): Promise<HomepageData> {
  const res = await fetch("/api/public/homepage");
  if (!res.ok) throw new Error("Failed to fetch homepage data");
  const json = await res.json() as { success: boolean; data: HomepageData };
  return json.data;
}

// Admin API helpers
async function adminFetch(
  url: string,
  options: RequestInit,
  getToken: () => Promise<string | null>
): Promise<Response> {
  const token = await getToken();
  return fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });
}

// Admin Intro
export async function adminGetIntro(getToken: () => Promise<string | null>): Promise<Intro | null> {
  const res = await adminFetch("/api/admin/intro", { method: "GET" }, getToken);
  const json = await res.json() as { success: boolean; data: Intro | null };
  return json.data;
}

export async function adminUpdateIntro(
  data: Partial<Intro>,
  getToken: () => Promise<string | null>
): Promise<Intro> {
  const res = await adminFetch("/api/admin/intro", { method: "PUT", body: JSON.stringify(data) }, getToken);
  const json = await res.json() as { success: boolean; data: Intro };
  return json.data;
}

// Admin Projects
export async function adminGetProjects(getToken: () => Promise<string | null>): Promise<Project[]> {
  const res = await adminFetch("/api/admin/projects", { method: "GET" }, getToken);
  const json = await res.json() as { success: boolean; data: Project[] };
  return json.data;
}

export async function adminCreateProject(
  data: Partial<Project>,
  getToken: () => Promise<string | null>
): Promise<Project> {
  const res = await adminFetch("/api/admin/projects", { method: "POST", body: JSON.stringify(data) }, getToken);
  const json = await res.json() as { success: boolean; data: Project };
  return json.data;
}

export async function adminUpdateProject(
  id: number,
  data: Partial<Project>,
  getToken: () => Promise<string | null>
): Promise<Project> {
  const res = await adminFetch(`/api/admin/projects?id=${id}`, { method: "PUT", body: JSON.stringify(data) }, getToken);
  const json = await res.json() as { success: boolean; data: Project };
  return json.data;
}

export async function adminDeleteProject(
  id: number,
  getToken: () => Promise<string | null>
): Promise<void> {
  await adminFetch(`/api/admin/projects?id=${id}`, { method: "DELETE" }, getToken);
}

// Admin Career
export async function adminGetCareer(getToken: () => Promise<string | null>): Promise<CareerSection[]> {
  const res = await adminFetch("/api/admin/career", { method: "GET" }, getToken);
  const json = await res.json() as { success: boolean; data: CareerSection[] };
  return json.data;
}

export async function adminCreateSection(
  data: Partial<CareerSection>,
  getToken: () => Promise<string | null>
): Promise<CareerSection> {
  const res = await adminFetch("/api/admin/career", { method: "POST", body: JSON.stringify(data) }, getToken);
  const json = await res.json() as { success: boolean; data: CareerSection };
  return json.data;
}

export async function adminUpdateSection(
  id: number,
  data: Partial<CareerSection>,
  getToken: () => Promise<string | null>
): Promise<CareerSection> {
  const res = await adminFetch(`/api/admin/career?id=${id}`, { method: "PUT", body: JSON.stringify(data) }, getToken);
  const json = await res.json() as { success: boolean; data: CareerSection };
  return json.data;
}

export async function adminDeleteSection(
  id: number,
  getToken: () => Promise<string | null>
): Promise<void> {
  await adminFetch(`/api/admin/career?id=${id}`, { method: "DELETE" }, getToken);
}

export async function adminCreateEntry(
  data: Partial<CareerEntry>,
  getToken: () => Promise<string | null>
): Promise<CareerEntry> {
  const res = await adminFetch("/api/admin/career?type=entry", { method: "POST", body: JSON.stringify(data) }, getToken);
  const json = await res.json() as { success: boolean; data: CareerEntry };
  return json.data;
}

export async function adminUpdateEntry(
  id: number,
  data: Partial<CareerEntry>,
  getToken: () => Promise<string | null>
): Promise<CareerEntry> {
  const res = await adminFetch(`/api/admin/career?type=entry&id=${id}`, { method: "PUT", body: JSON.stringify(data) }, getToken);
  const json = await res.json() as { success: boolean; data: CareerEntry };
  return json.data;
}

export async function adminDeleteEntry(
  id: number,
  getToken: () => Promise<string | null>
): Promise<void> {
  await adminFetch(`/api/admin/career?type=entry&id=${id}`, { method: "DELETE" }, getToken);
}

// Admin Socials
export async function adminGetSocials(getToken: () => Promise<string | null>): Promise<SocialLink[]> {
  const res = await adminFetch("/api/admin/socials", { method: "GET" }, getToken);
  const json = await res.json() as { success: boolean; data: SocialLink[] };
  return json.data;
}

export async function adminCreateSocial(
  data: Partial<SocialLink>,
  getToken: () => Promise<string | null>
): Promise<SocialLink> {
  const res = await adminFetch("/api/admin/socials", { method: "POST", body: JSON.stringify(data) }, getToken);
  const json = await res.json() as { success: boolean; data: SocialLink };
  return json.data;
}

export async function adminUpdateSocial(
  id: number,
  data: Partial<SocialLink>,
  getToken: () => Promise<string | null>
): Promise<SocialLink> {
  const res = await adminFetch(`/api/admin/socials?id=${id}`, { method: "PUT", body: JSON.stringify(data) }, getToken);
  const json = await res.json() as { success: boolean; data: SocialLink };
  return json.data;
}

export async function adminDeleteSocial(
  id: number,
  getToken: () => Promise<string | null>
): Promise<void> {
  await adminFetch(`/api/admin/socials?id=${id}`, { method: "DELETE" }, getToken);
}
