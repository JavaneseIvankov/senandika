CREATE TABLE "rolling_summary" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"session_id" uuid,
	"daily_summary" text NOT NULL,
	"key_points" jsonb NOT NULL,
	"follow_up_tomorrow" jsonb NOT NULL,
	"safety_flag" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "rolling_summary" ADD CONSTRAINT "rolling_summary_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rolling_summary" ADD CONSTRAINT "rolling_summary_session_id_reflection_session_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."reflection_session"("id") ON DELETE cascade ON UPDATE no action;