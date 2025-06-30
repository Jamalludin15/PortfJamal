CREATE TABLE `activities` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`icon` varchar(100),
	`url` varchar(255),
	CONSTRAINT `activities_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `articles` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`content` text NOT NULL,
	`excerpt` text,
	`image` varchar(255),
	`tags` text,
	`published` boolean DEFAULT false,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `articles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `contacts` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`email` varchar(100) NOT NULL,
	`subject` varchar(255) NOT NULL,
	`message` text NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `contacts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `education` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`degree` varchar(255) NOT NULL,
	`institution` varchar(255) NOT NULL,
	`period` varchar(100) NOT NULL,
	`description` text,
	`type` varchar(100) NOT NULL,
	CONSTRAINT `education_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `experiences` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`company` varchar(255) NOT NULL,
	`period` varchar(100) NOT NULL,
	`description` text NOT NULL,
	`technologies` text,
	`current` boolean DEFAULT false,
	CONSTRAINT `experiences_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pricing` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`price` int NOT NULL,
	`currency` varchar(10) NOT NULL DEFAULT 'USD',
	`period` varchar(50) NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`features` text,
	`is_active` boolean DEFAULT true,
	`is_premium` boolean DEFAULT false,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `pricing_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `profile` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`first_name` varchar(100) NOT NULL,
	`last_name` varchar(100) NOT NULL,
	`title` varchar(100) NOT NULL,
	`email` varchar(100) NOT NULL,
	`phone` varchar(50),
	`location` varchar(100),
	`hero_description` text,
	`about_title` varchar(255),
	`about_description_1` text,
	`about_description_2` text,
	`about_description_3` text,
	`profile_image` varchar(255),
	`github_url` varchar(255),
	`linkedin_url` varchar(255),
	`twitter_url` varchar(255),
	`tiktok_url` varchar(255),
	`instagram_url` varchar(255),
	`contact_heading` varchar(255),
	`contact_description` text,
	`contact_main_heading` varchar(255),
	`contact_main_description` text,
	`contact_sub_heading` varchar(255),
	`contact_sub_description` text,
	`experience_years` int DEFAULT 0,
	`projects_completed` int DEFAULT 0,
	CONSTRAINT `profile_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`image` varchar(255),
	`technologies` text,
	`live_url` varchar(255),
	`github_url` varchar(255),
	`featured` boolean DEFAULT false,
	CONSTRAINT `projects_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`user_id` int,
	`token` varchar(255) NOT NULL,
	`expires_at` timestamp NOT NULL,
	CONSTRAINT `sessions_id` PRIMARY KEY(`id`),
	CONSTRAINT `sessions_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint
CREATE TABLE `skills` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`category` varchar(100) NOT NULL,
	`level` int NOT NULL,
	`icon` varchar(100),
	CONSTRAINT `skills_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`username` varchar(100) NOT NULL,
	`password` varchar(255) NOT NULL,
	CONSTRAINT `users_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `sessions` ADD CONSTRAINT `sessions_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;