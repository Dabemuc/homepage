CREATE TABLE `skills` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`label` text,
	`value` text,
	`display_order` integer,
	`visible` integer
);
--> statement-breakpoint
ALTER TABLE `career_sections` ADD `active` integer;--> statement-breakpoint
ALTER TABLE `intro` ADD `on_air_since` text;