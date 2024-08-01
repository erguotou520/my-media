CREATE TABLE `medias` (
	`id` text PRIMARY KEY DEFAULT 'a7200d73-4079-4300-8e7c-f38ba3d7e4bf' NOT NULL,
	`created_at` text DEFAULT (datetime('now', 'localtime')),
	`updated_at` text DEFAULT (datetime('now', 'localtime')),
	`path` text NOT NULL,
	`thumbnail_path` text,
	`latitude` text,
	`longitude` text,
	`width` integer,
	`height` integer,
	`file_size` integer,
	`media_type` text,
	`duration` numeric,
	`file_hash` text,
	`user_id` text,
	`user_name` text
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY DEFAULT '09cb812e-ea91-401c-a374-409ea537fbc7' NOT NULL,
	`created_at` text DEFAULT (datetime('now', 'localtime')),
	`updated_at` text DEFAULT (datetime('now', 'localtime')),
	`username` text NOT NULL,
	`nickname` text,
	`avatar` text,
	`hashed_password` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `medias_path_unique` ON `medias` (`path`);--> statement-breakpoint
CREATE UNIQUE INDEX `path_idx` ON `medias` (`path`);--> statement-breakpoint
CREATE INDEX `create_at_idx` ON `medias` (`created_at`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);