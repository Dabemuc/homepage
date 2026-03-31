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
  'A fully configurable personal portfolio site.
  ### Features
  - Public homepage with intro, projects, career timeline
  - Admin UI for all content
  - Hosted on Cloudflare Pages with D1 database
  - Dark/light mode

  ### Tech Stack
  - Vite + React 19
  - TypeScript
  - Tailwind CSS v4
  - Cloudflare Pages Functions
  - Drizzle ORM + D1
  - Clerk auth',
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
  'A high-performance CLI utility built with Rust
  ### Features
  - Sub-millisecond startup time
  - Cross-platform binaries
  - Comprehensive test suite

  ### Tech Stack
  - Rust
  - clap for argument parsing
  - GitHub Actions for CI/CD',
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
  'A lightweight, high-performance API gateway.
  ### Features
  - Rate limiting per route and client
  - JWT verification
  - Request logging and tracing
  - Hot reload configuration

  ### Tech Stack
  - Go
  - Redis for rate limit state
  - Docker Compose',
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
