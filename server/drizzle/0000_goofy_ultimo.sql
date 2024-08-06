CREATE TABLE `medias` (
	`id` text PRIMARY KEY DEFAULT '55d9d7fb-25bc-48a0-9730-58af48c55f37' NOT NULL,
	`created_at` text DEFAULT (datetime('now', 'localtime')),
	`updated_at` text DEFAULT (datetime('now', 'localtime')),
	`path` text NOT NULL,
	`thumbnail_path` text,
	`latitude` real,
	`longitude` real,
	`altitude` real,
	`gps_info_read` integer DEFAULT false,
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
	`id` text PRIMARY KEY DEFAULT '8aeafa40-9c7e-450a-885b-372bbf488fde' NOT NULL,
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