CREATE TABLE `career_entries` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`section_id` integer,
	`timestamp` text,
	`title` text,
	`description` text,
	`display_order` integer,
	FOREIGN KEY (`section_id`) REFERENCES `career_sections`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `career_sections` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text,
	`display_order` integer,
	`visible` integer
);
--> statement-breakpoint
CREATE TABLE `intro` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text,
	`tagline` text,
	`bio` text,
	`avatar_url` text
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text,
	`short_description` text,
	`description` text,
	`screenshot` text,
	`repo_url` text,
	`website_url` text,
	`tags` text,
	`display_order` integer,
	`visible` integer
);
--> statement-breakpoint
CREATE TABLE `site_config` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text
);
--> statement-breakpoint
CREATE TABLE `social_links` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`platform` text,
	`label` text,
	`url` text,
	`icon` text,
	`display_order` integer,
	`visible` integer
);
