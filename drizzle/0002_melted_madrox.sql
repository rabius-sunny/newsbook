CREATE TABLE "advertisements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"image_url" text,
	"click_url" text NOT NULL,
	"position" text NOT NULL,
	"is_active" boolean DEFAULT true,
	"impressions" integer DEFAULT 0,
	"clicks" integer DEFAULT 0,
	"start_date" timestamp,
	"end_date" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "newsletters" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"name" text,
	"preferences" jsonb,
	"is_active" boolean DEFAULT true,
	"verified_at" timestamp,
	"unsubscribed_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "newsletters_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "page_views" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"article_id" uuid,
	"ip_address" text,
	"user_agent" text,
	"referrer" text,
	"country" text,
	"city" text,
	"device" text,
	"session_id" text,
	"viewed_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "categories" DROP CONSTRAINT "categories_name_unique";--> statement-breakpoint
ALTER TABLE "articles" DROP CONSTRAINT "articles_author_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "articles" DROP CONSTRAINT "articles_category_id_categories_id_fk";
--> statement-breakpoint
ALTER TABLE "comments" DROP CONSTRAINT "comments_author_id_users_id_fk";
--> statement-breakpoint
DROP INDEX "article_tag_idx";--> statement-breakpoint
DROP INDEX "article_slug_idx";--> statement-breakpoint
DROP INDEX "article_author_idx";--> statement-breakpoint
DROP INDEX "article_category_idx";--> statement-breakpoint
DROP INDEX "article_published_idx";--> statement-breakpoint
DROP INDEX "article_created_at_idx";--> statement-breakpoint
DROP INDEX "category_slug_idx";--> statement-breakpoint
DROP INDEX "comment_author_idx";--> statement-breakpoint
DROP INDEX "comment_article_idx";--> statement-breakpoint
DROP INDEX "comment_parent_idx";--> statement-breakpoint
DROP INDEX "comment_approved_idx";--> statement-breakpoint
DROP INDEX "tag_slug_idx";--> statement-breakpoint
DROP INDEX "email_idx";--> statement-breakpoint
DROP INDEX "name_idx";--> statement-breakpoint
ALTER TABLE "article_tags" ALTER COLUMN "article_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "article_tags" ALTER COLUMN "tag_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "articles" ALTER COLUMN "title" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "articles" ALTER COLUMN "slug" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "articles" ALTER COLUMN "author_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "articles" ALTER COLUMN "category_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "categories" ALTER COLUMN "name" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "categories" ALTER COLUMN "slug" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "comments" ALTER COLUMN "article_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "tags" ALTER COLUMN "name" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "tags" ALTER COLUMN "slug" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "email" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "name" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "articles" ADD COLUMN "title_bn" text NOT NULL;--> statement-breakpoint
ALTER TABLE "articles" ADD COLUMN "excerpt_bn" text;--> statement-breakpoint
ALTER TABLE "articles" ADD COLUMN "content_bn" text NOT NULL;--> statement-breakpoint
ALTER TABLE "articles" ADD COLUMN "featured_image" text;--> statement-breakpoint
ALTER TABLE "articles" ADD COLUMN "image_caption" text;--> statement-breakpoint
ALTER TABLE "articles" ADD COLUMN "image_caption_bn" text;--> statement-breakpoint
ALTER TABLE "articles" ADD COLUMN "gallery" jsonb;--> statement-breakpoint
ALTER TABLE "articles" ADD COLUMN "editor_id" uuid;--> statement-breakpoint
ALTER TABLE "articles" ADD COLUMN "status" text DEFAULT 'draft' NOT NULL;--> statement-breakpoint
ALTER TABLE "articles" ADD COLUMN "scheduled_at" timestamp;--> statement-breakpoint
ALTER TABLE "articles" ADD COLUMN "meta_title" text;--> statement-breakpoint
ALTER TABLE "articles" ADD COLUMN "meta_description" text;--> statement-breakpoint
ALTER TABLE "articles" ADD COLUMN "keywords" text;--> statement-breakpoint
ALTER TABLE "articles" ADD COLUMN "like_count" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "articles" ADD COLUMN "share_count" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "articles" ADD COLUMN "comment_count" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "articles" ADD COLUMN "is_featured" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "articles" ADD COLUMN "is_breaking" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "articles" ADD COLUMN "is_urgent" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "articles" ADD COLUMN "priority" integer DEFAULT 5;--> statement-breakpoint
ALTER TABLE "articles" ADD COLUMN "location" text;--> statement-breakpoint
ALTER TABLE "articles" ADD COLUMN "location_bn" text;--> statement-breakpoint
ALTER TABLE "articles" ADD COLUMN "source" text;--> statement-breakpoint
ALTER TABLE "categories" ADD COLUMN "name_en" text NOT NULL;--> statement-breakpoint
ALTER TABLE "categories" ADD COLUMN "parent_id" uuid;--> statement-breakpoint
ALTER TABLE "categories" ADD COLUMN "display_order" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "categories" ADD COLUMN "is_active" boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE "categories" ADD COLUMN "updated_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "comments" ADD COLUMN "author_name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "comments" ADD COLUMN "author_email" text;--> statement-breakpoint
ALTER TABLE "comments" ADD COLUMN "author_avatar" text;--> statement-breakpoint
ALTER TABLE "comments" ADD COLUMN "content_bn" text;--> statement-breakpoint
ALTER TABLE "comments" ADD COLUMN "is_reported" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "comments" ADD COLUMN "moderated_by" uuid;--> statement-breakpoint
ALTER TABLE "comments" ADD COLUMN "moderated_at" timestamp;--> statement-breakpoint
ALTER TABLE "comments" ADD COLUMN "like_count" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "comments" ADD COLUMN "reply_count" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "comments" ADD COLUMN "ip_address" text;--> statement-breakpoint
ALTER TABLE "comments" ADD COLUMN "user_agent" text;--> statement-breakpoint
ALTER TABLE "tags" ADD COLUMN "name_bn" text NOT NULL;--> statement-breakpoint
ALTER TABLE "tags" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "tags" ADD COLUMN "color" text DEFAULT '#3B82F6';--> statement-breakpoint
ALTER TABLE "tags" ADD COLUMN "is_active" boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "password" text NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "name_bn" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "bio_bn" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "avatar" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "role" text DEFAULT 'reporter' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "last_login_at" timestamp;--> statement-breakpoint
ALTER TABLE "page_views" ADD CONSTRAINT "page_views_article_id_articles_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "ads_position_idx" ON "advertisements" USING btree ("position");--> statement-breakpoint
CREATE INDEX "ads_active_idx" ON "advertisements" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "ads_date_idx" ON "advertisements" USING btree ("start_date","end_date");--> statement-breakpoint
CREATE INDEX "newsletters_email_idx" ON "newsletters" USING btree ("email");--> statement-breakpoint
CREATE INDEX "newsletters_active_idx" ON "newsletters" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "page_views_article_idx" ON "page_views" USING btree ("article_id");--> statement-breakpoint
CREATE INDEX "page_views_date_idx" ON "page_views" USING btree ("viewed_at");--> statement-breakpoint
CREATE INDEX "page_views_session_idx" ON "page_views" USING btree ("session_id");--> statement-breakpoint
ALTER TABLE "articles" ADD CONSTRAINT "articles_editor_id_users_id_fk" FOREIGN KEY ("editor_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "articles" ADD CONSTRAINT "articles_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "articles" ADD CONSTRAINT "articles_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_moderated_by_users_id_fk" FOREIGN KEY ("moderated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "article_tags_article_idx" ON "article_tags" USING btree ("article_id");--> statement-breakpoint
CREATE INDEX "article_tags_tag_idx" ON "article_tags" USING btree ("tag_id");--> statement-breakpoint
CREATE INDEX "articles_slug_idx" ON "articles" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "articles_status_idx" ON "articles" USING btree ("status");--> statement-breakpoint
CREATE INDEX "articles_published_idx" ON "articles" USING btree ("is_published","published_at");--> statement-breakpoint
CREATE INDEX "articles_category_idx" ON "articles" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "articles_author_idx" ON "articles" USING btree ("author_id");--> statement-breakpoint
CREATE INDEX "articles_featured_idx" ON "articles" USING btree ("is_featured");--> statement-breakpoint
CREATE INDEX "articles_breaking_idx" ON "articles" USING btree ("is_breaking");--> statement-breakpoint
CREATE INDEX "articles_created_idx" ON "articles" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "categories_slug_idx" ON "categories" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "categories_name_idx" ON "categories" USING btree ("name");--> statement-breakpoint
CREATE INDEX "comments_article_idx" ON "comments" USING btree ("article_id");--> statement-breakpoint
CREATE INDEX "comments_parent_idx" ON "comments" USING btree ("parent_id");--> statement-breakpoint
CREATE INDEX "comments_approved_idx" ON "comments" USING btree ("is_approved");--> statement-breakpoint
CREATE INDEX "comments_created_idx" ON "comments" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "tags_name_idx" ON "tags" USING btree ("name");--> statement-breakpoint
CREATE INDEX "tags_slug_idx" ON "tags" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "users_email_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "users_role_idx" ON "users" USING btree ("role");--> statement-breakpoint
ALTER TABLE "comments" DROP COLUMN "author_id";--> statement-breakpoint
ALTER TABLE "article_tags" ADD CONSTRAINT "article_tags_article_id_tag_id_unique" UNIQUE("article_id","tag_id");--> statement-breakpoint
ALTER TABLE "tags" ADD CONSTRAINT "tags_name_bn_unique" UNIQUE("name_bn");