CREATE TABLE "chatBotMetaData" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_email" text NOT NULL,
	"color" text DEFAULT '#4f39f6' NOT NULL,
	"welcome_message" text DEFAULT 'Hello! How can I assist you today?' NOT NULL,
	"created_at" text DEFAULT now() NOT NULL
);
