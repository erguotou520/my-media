CREATE TABLE `medias` (
	`id` text PRIMARY KEY DEFAULT '98912c22-d0a7-4491-b7f5-7210182f33d4' NOT NULL,
	`created_at` text DEFAULT (datetime('now', 'localtime')),
	`updated_at` text DEFAULT (datetime('now', 'localtime')),
	`path` text NOT NULL,
	`thumbnail_path` text,
	`latitude` text,
	`longitude` text,
	`altitude` text,
	`width` integer,
	`height` integer,
	`file_size` integer,
	`media_type` text,
	`duration` integer,
	`file_hash` text,
	`user_id` text,
	`user_name` text
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY DEFAULT '61235b37-dcc6-4bdb-b161-c2c1f0a54521' NOT NULL,
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