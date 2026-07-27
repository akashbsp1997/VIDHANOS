CREATE TABLE `case_opponents` (
	`id` text PRIMARY KEY NOT NULL,
	`case_id` text NOT NULL,
	`opponent_id` text NOT NULL,
	`role` text,
	FOREIGN KEY (`case_id`) REFERENCES `cases`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`opponent_id`) REFERENCES `opponents`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `case_opponents_case_opponent_unique` ON `case_opponents` (`case_id`,`opponent_id`);--> statement-breakpoint
CREATE TABLE `cases` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`cnr_number` text,
	`case_type` text,
	`filing_number` text,
	`filing_date` integer,
	`registration_number` text,
	`forum_name` text,
	`court_state` text,
	`court_district` text,
	`court_complex` text,
	`judge_name` text,
	`case_status` text DEFAULT 'pending' NOT NULL,
	`stage` text,
	`client_id` text NOT NULL,
	`next_hearing_date` integer,
	`priority` text DEFAULT 'normal' NOT NULL,
	`source` text DEFAULT 'manual' NOT NULL,
	`notes` text,
	`created_at` integer DEFAULT (strftime('%s','now') * 1000) NOT NULL,
	`updated_at` integer DEFAULT (strftime('%s','now') * 1000) NOT NULL,
	FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `cases_next_hearing_date_idx` ON `cases` (`next_hearing_date`);--> statement-breakpoint
CREATE INDEX `cases_client_id_idx` ON `cases` (`client_id`);--> statement-breakpoint
CREATE TABLE `citations` (
	`id` text PRIMARY KEY NOT NULL,
	`case_id` text,
	`indiankanoon_doc_id` text,
	`title` text NOT NULL,
	`court` text,
	`citation_text` text,
	`date_of_judgment` integer,
	`snippet` text,
	`source_url` text,
	`local_file_uri` text,
	`tags` text,
	`created_at` integer DEFAULT (strftime('%s','now') * 1000) NOT NULL,
	FOREIGN KEY (`case_id`) REFERENCES `cases`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `citations_case_id_idx` ON `citations` (`case_id`);--> statement-breakpoint
CREATE TABLE `clients` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`phone` text,
	`email` text,
	`address` text,
	`notes` text,
	`created_at` integer DEFAULT (strftime('%s','now') * 1000) NOT NULL,
	`updated_at` integer DEFAULT (strftime('%s','now') * 1000) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `document_analyses` (
	`id` text PRIMARY KEY NOT NULL,
	`document_id` text NOT NULL,
	`case_id` text NOT NULL,
	`provider` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`issue_summary` text,
	`recommended_departments` text,
	`recommended_mechanisms` text,
	`recommended_forums` text,
	`clarifying_questions` text,
	`user_answers` text,
	`next_steps` text,
	`raw_response` text,
	`created_at` integer DEFAULT (strftime('%s','now') * 1000) NOT NULL,
	`updated_at` integer DEFAULT (strftime('%s','now') * 1000) NOT NULL,
	FOREIGN KEY (`document_id`) REFERENCES `documents`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`case_id`) REFERENCES `cases`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `document_analyses_document_id_idx` ON `document_analyses` (`document_id`);--> statement-breakpoint
CREATE INDEX `document_analyses_case_id_idx` ON `document_analyses` (`case_id`);--> statement-breakpoint
CREATE TABLE `documents` (
	`id` text PRIMARY KEY NOT NULL,
	`case_id` text NOT NULL,
	`hearing_id` text,
	`file_name` text NOT NULL,
	`file_uri` text NOT NULL,
	`thumbnail_uri` text,
	`file_type` text NOT NULL,
	`mime_type` text,
	`file_size_bytes` integer,
	`page_count` integer,
	`pdf_title` text,
	`pdf_author` text,
	`pdf_created_at` integer,
	`pdf_modified_at` integer,
	`exif_taken_at` integer,
	`exif_gps_lat` real,
	`exif_gps_lng` real,
	`exif_camera_model` text,
	`ocr_text` text,
	`ocr_status` text DEFAULT 'not_applicable' NOT NULL,
	`source` text DEFAULT 'manual' NOT NULL,
	`created_at` integer DEFAULT (strftime('%s','now') * 1000) NOT NULL,
	`updated_at` integer DEFAULT (strftime('%s','now') * 1000) NOT NULL,
	FOREIGN KEY (`case_id`) REFERENCES `cases`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`hearing_id`) REFERENCES `hearings`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `documents_case_id_idx` ON `documents` (`case_id`);--> statement-breakpoint
CREATE TABLE `hearings` (
	`id` text PRIMARY KEY NOT NULL,
	`case_id` text NOT NULL,
	`hearing_date` integer NOT NULL,
	`purpose` text,
	`judge_name` text,
	`order_summary` text,
	`order_type` text DEFAULT 'hearing' NOT NULL,
	`next_hearing_date` integer,
	`is_deadline` integer DEFAULT 0 NOT NULL,
	`reminder_offset_minutes` integer DEFAULT 1440 NOT NULL,
	`notification_id` text,
	`source` text DEFAULT 'manual' NOT NULL,
	`created_at` integer DEFAULT (strftime('%s','now') * 1000) NOT NULL,
	`updated_at` integer DEFAULT (strftime('%s','now') * 1000) NOT NULL,
	FOREIGN KEY (`case_id`) REFERENCES `cases`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `hearings_case_id_idx` ON `hearings` (`case_id`);--> statement-breakpoint
CREATE INDEX `hearings_hearing_date_idx` ON `hearings` (`hearing_date`);--> statement-breakpoint
CREATE TABLE `legal_references` (
	`id` text PRIMARY KEY NOT NULL,
	`category` text NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`applies_to_keywords` text,
	`jurisdiction_level` text,
	`created_at` integer DEFAULT (strftime('%s','now') * 1000) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `opponents` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`phone` text,
	`email` text,
	`address` text,
	`notes` text,
	`created_at` integer DEFAULT (strftime('%s','now') * 1000) NOT NULL,
	`updated_at` integer DEFAULT (strftime('%s','now') * 1000) NOT NULL
);
