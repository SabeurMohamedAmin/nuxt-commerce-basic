CREATE TABLE `login_attempts` (
	`id` integer PRIMARY KEY NOT NULL,
	`user_id` integer,
	`ip` text NOT NULL,
	`timestamp` integer NOT NULL,
	`success` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text,
	`email` text NOT NULL,
	`login` text,
	`password` text
);
