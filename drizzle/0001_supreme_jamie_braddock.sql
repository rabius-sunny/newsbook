ALTER TABLE "articles" DROP CONSTRAINT "articles_editor_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "comments" DROP CONSTRAINT "comments_moderated_by_users_id_fk";
--> statement-breakpoint
DROP INDEX "comments_parent_idx";--> statement-breakpoint
DROP INDEX "comments_approved_idx";--> statement-breakpoint
ALTER TABLE "articles" DROP COLUMN "editor_id";--> statement-breakpoint
ALTER TABLE "articles" DROP COLUMN "share_count";--> statement-breakpoint
ALTER TABLE "articles" DROP COLUMN "is_urgent";--> statement-breakpoint
ALTER TABLE "articles" DROP COLUMN "location_bn";--> statement-breakpoint
ALTER TABLE "comments" DROP COLUMN "parent_id";--> statement-breakpoint
ALTER TABLE "comments" DROP COLUMN "content_bn";--> statement-breakpoint
ALTER TABLE "comments" DROP COLUMN "is_approved";--> statement-breakpoint
ALTER TABLE "comments" DROP COLUMN "is_reported";--> statement-breakpoint
ALTER TABLE "comments" DROP COLUMN "moderated_by";--> statement-breakpoint
ALTER TABLE "comments" DROP COLUMN "moderated_at";--> statement-breakpoint
ALTER TABLE "comments" DROP COLUMN "reply_count";--> statement-breakpoint
ALTER TABLE "page_views" DROP COLUMN "country";--> statement-breakpoint
ALTER TABLE "page_views" DROP COLUMN "city";--> statement-breakpoint
ALTER TABLE "page_views" DROP COLUMN "device";