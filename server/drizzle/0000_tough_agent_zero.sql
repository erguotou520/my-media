CREATE TABLE `medias` (
	`id` text PRIMARY KEY DEFAULT '69d27d20-6e89-4482-b5fc-ab3bc4e19798' NOT NULL,
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
	`id` text PRIMARY KEY DEFAULT 'b49a304f-2dd7-4cc3-850d-3209db34074d' NOT NULL,
	`created_at` text DEFAULT (datetime('now', 'localtime')),
	`updated_at` text DEFAULT (datetime('now', 'localtime')),
	`username` text NOT NULL,
	`nickname` text,
	`avatar` text,
	`hashed_password` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `medias_path_unique` ON `medias` (`path`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);