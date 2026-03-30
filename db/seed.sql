-- Seed data for homepage

-- Site config
INSERT OR REPLACE INTO site_config (key, value) VALUES ('intro_visible', 'true');
INSERT OR REPLACE INTO site_config (key, value) VALUES ('projects_visible', 'true');
INSERT OR REPLACE INTO site_config (key, value) VALUES ('career_visible', 'true');

-- Intro
INSERT OR REPLACE INTO intro (id, name, tagline, bio, avatar_url) VALUES (
  1,
  'Dabemuc',
  'Full-Stack Developer & Cloud Enthusiast',
  'I build fast, reliable software with a focus on clean architecture and developer experience. Passionate about Rust, TypeScript, and edge computing.',
  null
);

-- Projects
INSERT INTO projects (title, short_description, description, screenshot, repo_url, website_url, tags, display_order, visible) VALUES (
  'Homepage',
  'Personal portfolio with admin UI, built on Cloudflare Pages + D1.',
  '## Homepage\n\nA fully configurable personal portfolio site.\n\n### Features\n- Public homepage with intro, projects, career timeline\n- Admin UI for all content\n- Hosted on Cloudflare Pages with D1 database\n- Dark/light mode\n\n### Tech Stack\n- Vite + React 19\n- TypeScript\n- Tailwind CSS v4\n- Cloudflare Pages Functions\n- Drizzle ORM + D1\n- Clerk auth',
  null,
  'https://github.com/dabemuc/homepage',
  null,
  '["TypeScript","React","Cloudflare","Tailwind"]',
  1,
  1
);

INSERT INTO projects (title, short_description, description, screenshot, repo_url, website_url, tags, display_order, visible) VALUES (
  'CLI Tool',
  'A blazing-fast command-line utility written in Rust.',
  '## CLI Tool\n\nA high-performance CLI utility built with Rust.\n\n### Features\n- Sub-millisecond startup time\n- Cross-platform binaries\n- Comprehensive test suite\n\n### Tech Stack\n- Rust\n- clap for argument parsing\n- GitHub Actions for CI/CD',
  null,
  'https://github.com/dabemuc/cli-tool',
  null,
  '["Rust","CLI","GitHub Actions"]',
  2,
  1
);

INSERT INTO projects (title, short_description, description, screenshot, repo_url, website_url, tags, display_order, visible) VALUES (
  'API Gateway',
  'Lightweight API gateway with rate limiting and JWT auth.',
  '## API Gateway\n\nA lightweight, high-performance API gateway.\n\n### Features\n- Rate limiting per route and client\n- JWT verification\n- Request logging and tracing\n- Hot reload configuration\n\n### Tech Stack\n- Go\n- Redis for rate limit state\n- Docker Compose',
  null,
  'https://github.com/dabemuc/api-gateway',
  null,
  '["Go","Redis","Docker","JWT"]',
  3,
  1
);

-- Career sections and entries
INSERT INTO career_sections (title, display_order, visible) VALUES ('Dual Studies at TechCorp & University', 1, 1);

INSERT INTO career_entries (section_id, timestamp, title, description, display_order) VALUES (
  1,
  'Sep 2020',
  'Started Dual Study Program',
  'Began a dual study program combining practical work at TechCorp with academic studies in Computer Science.',
  1
);

INSERT INTO career_entries (section_id, timestamp, title, description, display_order) VALUES (
  1,
  'Mar 2021',
  'First Major Project: Internal Tooling',
  'Led development of an internal tooling suite that reduced deployment time by 60%. Built with Python and Docker.',
  2
);

INSERT INTO career_entries (section_id, timestamp, title, description, display_order) VALUES (
  1,
  'Oct 2021',
  'Cloud Migration Initiative',
  'Contributed to migrating legacy on-prem services to Kubernetes on AWS. Wrote Terraform modules and CI/CD pipelines.',
  3
);

INSERT INTO career_entries (section_id, timestamp, title, description, display_order) VALUES (
  1,
  'Sep 2023',
  'Graduated B.Sc. Computer Science',
  'Completed dual study program with distinction. Thesis: "Edge Computing Patterns for Real-Time Applications".',
  4
);

INSERT INTO career_sections (title, display_order, visible) VALUES ('Software Engineer at StartupXYZ', 2, 1);

INSERT INTO career_entries (section_id, timestamp, title, description, display_order) VALUES (
  2,
  'Oct 2023',
  'Joined as Software Engineer',
  'Joined a Series A startup building developer tooling. Focus on backend services and infrastructure.',
  1
);

INSERT INTO career_entries (section_id, timestamp, title, description, display_order) VALUES (
  2,
  'Jan 2024',
  'Launched Real-Time Collaboration Feature',
  'Designed and shipped a real-time collaboration system using WebSockets and CRDTs, serving 10k+ concurrent users.',
  2
);

INSERT INTO career_entries (section_id, timestamp, title, description, display_order) VALUES (
  2,
  'Jun 2024',
  'Promoted to Senior Engineer',
  'Took on tech lead responsibilities for the infrastructure team. Mentoring junior developers and driving architectural decisions.',
  3
);

-- Social links
INSERT INTO social_links (platform, label, url, icon, display_order, visible) VALUES ('github', 'GitHub', 'https://github.com/dabemuc', 'Github', 1, 1);
INSERT INTO social_links (platform, label, url, icon, display_order, visible) VALUES ('linkedin', 'LinkedIn', 'https://linkedin.com/in/dabemuc', 'Linkedin', 2, 1);
INSERT INTO social_links (platform, label, url, icon, display_order, visible) VALUES ('email', 'Email', 'mailto:hello@example.com', 'Mail', 3, 1);
