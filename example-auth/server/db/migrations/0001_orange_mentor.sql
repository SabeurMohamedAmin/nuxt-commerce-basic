PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_login_attempts` (
	`id` integer PRIMARY KEY NOT NULL,
	`user_id` integer,
	`ip` text NOT NULL,
	`timestamp` integer NOT NULL,
	`success` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_login_attempts`("id", "user_id", "ip", "timestamp", "success") SELECT "id", "user_id", "ip", "timestamp", "success" FROM `login_attempts`;--> statement-breakpoint
DROP TABLE `login_attempts`;--> statement-breakpoint
ALTER TABLE `__new_login_attempts` RENAME TO `login_attempts`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);