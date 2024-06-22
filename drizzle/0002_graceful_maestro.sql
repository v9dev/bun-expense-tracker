DROP INDEX IF EXISTS "name_idx";--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "user_id_idx" ON "expenses" USING btree ("user_id");