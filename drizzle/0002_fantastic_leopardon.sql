CREATE TABLE "sections" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"tone" text NOT NULL,
	"allowed_topics" text,
	"blocked_topics" text,
	"source_ids" text NOT NULL,
	"created_by" text NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"created_at" text DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "knowledge" ALTER COLUMN "content" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "knowledge" ADD COLUMN "type" text DEFAULT 'website' NOT NULL;--> statement-breakpoint
ALTER TABLE "knowledge" ADD COLUMN "meta_data" text;--> statement-breakpoint
ALTER TABLE "knowledge" ADD COLUMN "last_updated" text DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "knowledge" ADD COLUMN "created_at" text DEFAULT now() NOT NULL;