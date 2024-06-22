DROP INDEX IF EXISTS "user_id_idx";--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "name_idx" ON "expenses" USING btree ("user_id");