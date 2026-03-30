import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const siteConfig = sqliteTable("site_config", {
  key: text("key").primaryKey(),
  value: text("value"),
});

export const intro = sqliteTable("intro", {
  id: integer("id").primaryKey(),
  name: text("name"),
  tagline: text("tagline"),
  bio: text("bio"),
  avatar_url: text("avatar_url"),
});

export const projects = sqliteTable("projects", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title"),
  short_description: text("short_description"),
  description: text("description"),
  screenshot: text("screenshot"),
  repo_url: text("repo_url"),
  website_url: text("website_url"),
  tags: text("tags"),
  display_order: integer("display_order"),
  visible: integer("visible", { mode: "boolean" }),
});

export const careerSections = sqliteTable("career_sections", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title"),
  display_order: integer("display_order"),
  visible: integer("visible", { mode: "boolean" }),
});

export const careerEntries = sqliteTable("career_entries", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  section_id: integer("section_id").references(() => careerSections.id),
  timestamp: text("timestamp"),
  title: text("title"),
  description: text("description"),
  display_order: integer("display_order"),
});

export const socialLinks = sqliteTable("social_links", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  platform: text("platform"),
  label: text("label"),
  url: text("url"),
  icon: text("icon"),
  display_order: integer("display_order"),
  visible: integer("visible", { mode: "boolean" }),
});
