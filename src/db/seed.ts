import { db } from './index';
import {
  categories,
  users,
  tags,
  articles,
  articleTags,
  comments,
  newsletters,
  advertisements
} from './schemas';

// Hash password function (simple for demo - use bcrypt in production)
const hashPassword = (password: string): string => {
  return Buffer.from(password).toString('base64');
};

async function seed() {
  console.log('🌱 Seeding database...');

  try {
    // Clear existing data (be careful in production!)
    console.log('Clearing existing data...');
    await db.delete(comments);
    await db.delete(articleTags);
    await db.delete(articles);
    await db.delete(tags);
    await db.delete(users);
    await db.delete(categories);
    await db.delete(newsletters);
    await db.delete(advertisements);

    // Reset serial id sequences so new inserts start from 1.
    // Using raw SQL TRUNCATE with RESTART IDENTITY ensures all sequences reset.
    // We cast `db` to `any` to call the underlying raw execute method without typing errors.
    try {
      await (db as any).execute(
        `TRUNCATE categories, users, tags, articles, article_tags, comments, newsletters, advertisements, page_views RESTART IDENTITY CASCADE;`
      );
    } catch (err) {
      // If TRUNCATE fails (e.g., permissions), fall back to individual sequence restart.
      try {
        const sequences = [
          'categories_id_seq',
          'users_id_seq',
          'tags_id_seq',
          'articles_id_seq',
          'article_tags_id_seq',
          'comments_id_seq',
          'newsletters_id_seq',
          'advertisements_id_seq',
          'page_views_id_seq'
        ];
        for (const seq of sequences) {
          await (db as any).execute(`ALTER SEQUENCE ${seq} RESTART WITH 1;`);
        }
      } catch (err2) {
        console.warn('Could not reset sequences automatically:', err2);
      }
    }

    // Seed Categories
    console.log('Creating categories...');
    const categoryData = await db
      .insert(categories)
      .values([
        {
          name: 'সর্বশেষ',
          slug: 'latest',
          description: 'সর্বশেষ খবর',
          displayOrder: 1
        },
        {
          name: 'রাজনীতি',
          slug: 'politics',
          description: 'রাজনৈতিক সংবাদ',
          displayOrder: 2
        },
        {
          name: 'অর্থনীতি',
          slug: 'economy',
          description: 'অর্থনৈতিক সংবাদ',
          displayOrder: 3
        },
        {
          name: 'আন্তর্জাতিক',
          slug: 'international',
          description: 'আন্তর্জাতিক সংবাদ',
          displayOrder: 4
        },
        {
          name: 'খেলা',
          slug: 'sports',
          description: 'খেলাধুলার সংবাদ',
          displayOrder: 5
        },
        {
          name: 'বিনোদন',
          slug: 'entertainment',
          description: 'বিনোদন জগতের সংবাদ',
          displayOrder: 6
        },
        {
          name: 'প্রযুক্তি',
          slug: 'technology',
          description: 'প্রযুক্তি সংবাদ',
          displayOrder: 7
        },
        {
          name: 'স্বাস্থ্য',
          slug: 'health',
          description: 'স্বাস্থ্য বিষয়ক সংবাদ',
          displayOrder: 8
        },
        {
          name: 'শিক্ষা',
          slug: 'education',
          description: 'শিক্ষা বিষয়ক সংবাদ',
          displayOrder: 9
        },
        {
          name: 'জীবনযাত্রা',
          slug: 'lifestyle',
          description: 'জীবনযাত্রার সংবাদ',
          displayOrder: 10
        }
      ])
      .returning();

    // Seed Users
    console.log('Creating users...');
    const userData = await db
      .insert(users)
      .values([
        {
          email: 'admin@prothomalo.com',
          password: hashPassword('admin123'),
          name: 'Admin User',
          role: 'admin',
          bio: 'System Administrator'
        },
        {
          email: 'editor@prothomalo.com',
          password: hashPassword('editor123'),
          name: 'Chief Editor',
          role: 'editor',
          bio: 'Chief Editor of Prothom Alo'
        },
        {
          email: 'reporter1@prothomalo.com',
          password: hashPassword('reporter123'),
          name: 'Rashid Ahmed',
          role: 'reporter',
          bio: 'Senior Political Reporter'
        },
        {
          email: 'reporter2@prothomalo.com',
          password: hashPassword('reporter123'),
          name: 'Fatima Khan',
          role: 'reporter',
          bio: 'Sports Correspondent'
        },
        {
          email: 'reporter3@prothomalo.com',
          password: hashPassword('reporter123'),
          name: 'Karim Rahman',
          role: 'reporter',
          bio: 'International Affairs Reporter'
        }
      ])
      .returning();

    // Seed Tags
    console.log('Creating tags...');
    const tagData = await db
      .insert(tags)
      .values([
        {
          name: 'breaking',
          slug: 'breaking'
        },
        {
          name: 'bangladesh',
          slug: 'bangladesh'
        },
        {
          name: 'cricket',
          slug: 'cricket'
        },
        {
          name: 'football',
          slug: 'football'
        },
        {
          name: 'election',
          slug: 'election'
        },
        {
          name: 'economy',
          slug: 'economy-tag'
        },
        {
          name: 'coronavirus',
          slug: 'coronavirus'
        },
        {
          name: 'education',
          slug: 'education-tag'
        },
        {
          name: 'climate',
          slug: 'climate'
        }
      ])
      .returning();

    // Seed Articles
    console.log('Creating articles...');
    const politicsCategory = categoryData.find(
      (c: any) => c.slug === 'politics'
    );
    const sportsCategory = categoryData.find((c: any) => c.slug === 'sports');
    const economyCategory = categoryData.find((c: any) => c.slug === 'economy');
    const internationalCategory = categoryData.find(
      (c: any) => c.slug === 'international'
    );

    const politicsReporter = userData.find(
      (u: any) => u.name === 'Rashid Ahmed'
    );
    const sportsReporter = userData.find((u: any) => u.name === 'Fatima Khan');
    const intlReporter = userData.find((u: any) => u.name === 'Karim Rahman');

    const articleData = await db
      .insert(articles)
      .values([
        {
          title: 'অর্থনৈতিক পুনরুদ্ধার পরিকল্পনা নিয়ে সংসদ অধিবেশন',
          slug: 'parliament-economic-recovery-plan',
          excerpt:
            'আসন্ন সংসদ অধিবেশনে জাতীয় অর্থনৈতিক পুনরুদ্ধার কৌশল নিয়ে আলোচনা হবে।',
          content:
            'ব্যাপক অর্থনৈতিক পুনরুদ্ধার পরিকল্পনা আলোচনার জন্য সংসদের বিশেষ অধিবেশন বসতে যাচ্ছে। এই পরিকল্পনায় কর্মসংস্থান সৃষ্টি, অবকাঠামো উন্নয়ন এবং সাম্প্রতিক বৈশ্বিক অর্থনৈতিক চ্যালেঞ্জে ক্ষতিগ্রস্ত ছোট ব্যবসার সহায়তার ব্যবস্থা রয়েছে।',
          categoryId: politicsCategory?.id,
          authorId: politicsReporter?.id,
          status: 'published',
          isPublished: true,
          publishedAt: new Date(),
          isFeatured: true,
          priority: 8,
          location: 'ঢাকা',
          featuredImage:
            'https://images.unsplash.com/photo-1555848962-6e79363bfa19?w=800',

          imageCaption: 'ঢাকার জাতীয় সংসদ ভবন',
          viewCount: 1250
        },
        {
          title: 'অস্ট্রেলিয়ার বিপক্ষে জয় পেল বাংলাদেশ ক্রিকেট দল',
          slug: 'bangladesh-cricket-wins-australia',
          excerpt:
            'সাম্প্রতিক টি-২০ ম্যাচে অস্ট্রেলিয়ার বিপক্ষে দুর্দান্ত জয় পেয়েছে বাংলাদেশ।',
          content:
            'শেরে বাংলা জাতীয় স্টেডিয়ামে রোমাঞ্চকর টি-২০ ম্যাচে বাংলাদেশ অস্ট্রেলিয়াকে ৭ উইকেটে পরাজিত করেছে। অসাধারণ অল রাউন্ড পারফরম্যান্সের জন্য ম্যান অব দ্য ম্যাচ পুরস্কার পেয়েছেন শাকিব আল হাসান।',
          categoryId: sportsCategory?.id,
          authorId: sportsReporter?.id,
          status: 'published',
          isPublished: true,
          publishedAt: new Date(Date.now() - 86400000), // 1 day ago
          isBreaking: true,
          priority: 9,
          location: 'ঢাকা',
          featuredImage:
            'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800',
          imageCaption: 'জয়ের উল্লাসে বাংলাদেশ ক্রিকেট দল',
          viewCount: 2340
        },
        {
          title: 'ইউরোপীয় ইউনিয়নের সাথে নতুন বাণিজ্য চুক্তি',
          slug: 'new-trade-agreement-eu',
          excerpt:
            'ইউরোপীয় ইউনিয়নের সাথে ব্যাপক বাণিজ্য চুক্তি স্বাক্ষর করেছে বাংলাদেশ।',
          content:
            'সরকার ইউরোপীয় ইউনিয়নের সাথে একটি ঐতিহাসিক বাণিজ্য চুক্তি স্বাক্ষর করেছে যা রপ্তানি বৃদ্ধি করবে এবং বাংলাদেশি ব্যবসার জন্য নতুন সুযোগ সৃষ্টি করবে। এই চুক্তিতে টেক্সটাইল, ফার্মাসিউটিক্যালস এবং প্রযুক্তি খাত অন্তর্ভুক্ত রয়েছে।',
          categoryId: economyCategory?.id,
          authorId: intlReporter?.id,
          status: 'published',
          isPublished: true,
          publishedAt: new Date(Date.now() - 172800000), // 2 days ago
          isFeatured: true,
          priority: 7,
          location: 'ব্রাসেলস',
          featuredImage:
            'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=800',
          imageCaption: 'বাণিজ্য প্রতিনিধিদলের বৈঠক',
          viewCount: 1890
        },
        {
          title: 'জলবায়ু পরিবর্তন সম্মেলনের ফলাফল',
          slug: 'climate-change-conference-outcomes',
          excerpt:
            'আন্তর্জাতিক জলবায়ু শীর্ষ সম্মেলনের গুরুত্বপূর্ণ সিদ্ধান্ত বাংলাদেশকে প্রভাবিত করবে।',
          content:
            'সাম্প্রতিক আন্তর্জাতিক জলবায়ু সম্মেলন উন্নয়নশীল দেশগুলির জন্য গুরুত্বপূর্ণ অঙ্গীকার নিয়ে শেষ হয়েছে। বাংলাদেশ জলবায়ু অভিযোজন প্রকল্প এবং নবায়নযোগ্য শক্তি উদ্যোগের জন্য উল্লেখযোগ্য অর্থায়ন নিশ্চিত করেছে।',
          categoryId: internationalCategory?.id,
          authorId: intlReporter?.id,
          status: 'published',
          isPublished: true,
          publishedAt: new Date(Date.now() - 259200000), // 3 days ago
          priority: 6,
          location: 'জেনেভা',
          featuredImage:
            'https://images.unsplash.com/photo-1569163139302-de44fdc5c72c?w=800',
          imageCaption: 'জলবায়ু সম্মেলনের প্রতিনিধিগণ',
          viewCount: 987
        }
      ])
      .returning();

    // Seed Article Tags
    console.log('Creating article tags...');
    const breakingTag = tagData.find((t: any) => t.slug === 'breaking');
    const bangladeshTag = tagData.find((t: any) => t.slug === 'bangladesh');
    const dhakaTag = tagData.find((t: any) => t.slug === 'dhaka');
    const cricketTag = tagData.find((t: any) => t.slug === 'cricket');
    const electionTag = tagData.find((t: any) => t.slug === 'election');
    const economyTag = tagData.find((t: any) => t.slug === 'economy-tag');
    const climateTag = tagData.find((t: any) => t.slug === 'climate');

    await db.insert(articleTags).values([
      // Parliament article tags
      { articleId: articleData[0].id, tagId: bangladeshTag?.id },
      { articleId: articleData[0].id, tagId: electionTag?.id },
      { articleId: articleData[0].id, tagId: economyTag?.id },

      // Cricket article tags
      { articleId: articleData[1].id, tagId: breakingTag?.id },
      { articleId: articleData[1].id, tagId: bangladeshTag?.id },
      { articleId: articleData[1].id, tagId: cricketTag?.id },
      { articleId: articleData[1].id, tagId: dhakaTag?.id },

      // Trade agreement tags
      { articleId: articleData[2].id, tagId: bangladeshTag?.id },
      { articleId: articleData[2].id, tagId: economyTag?.id },

      // Climate conference tags
      { articleId: articleData[3].id, tagId: bangladeshTag?.id },
      { articleId: articleData[3].id, tagId: climateTag?.id }
    ]);

    // Seed Comments
    console.log('Creating comments...');
    await db.insert(comments).values([
      {
        articleId: articleData[1].id, // Cricket article
        authorName: 'রহিম উদ্দিন',
        authorEmail: 'rahim@example.com',
        content:
          'বাংলাদেশের জন্য দুর্দান্ত জয়! আমাদের সবার জন্য গর্বের মুহূর্ত।'
      },
      {
        articleId: articleData[1].id, // Cricket article
        authorName: 'সালমা খান',
        authorEmail: 'salma@example.com',
        content: 'শাকিব অসাধারণ খেলেছেন। সত্যিই ম্যান অব দ্য ম্যাচ!'
      },
      {
        articleId: articleData[0].id, // Parliament article
        authorName: 'আহমেদ হাসান',
        authorEmail: 'ahmed@example.com',
        content:
          'আশা করি এই অর্থনৈতিক পরিকল্পনা সাধারণ মানুষের জন্য ইতিবাচক পরিবর্তন আনবে।'
      }
    ]);

    // Seed Newsletter subscriptions
    console.log('Creating newsletter subscriptions...');
    await db.insert(newsletters).values([
      {
        email: 'subscriber1@example.com',
        name: 'মোহাম্মদ করিম',
        preferences: {
          categories: ['politics', 'sports', 'economy'],
          frequency: 'daily'
        },
        verifiedAt: new Date()
      },
      {
        email: 'subscriber2@example.com',
        name: 'রাশিদা বেগম',
        preferences: {
          categories: ['lifestyle', 'health', 'education'],
          frequency: 'weekly'
        },
        verifiedAt: new Date()
      }
    ]);

    // Seed Advertisements
    console.log('Creating advertisements...');
    await db.insert(advertisements).values([
      {
        title: 'Bank Asia Credit Card Offer',
        description: 'Get your Bank Asia credit card with amazing benefits',
        imageUrl:
          'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300',
        clickUrl: 'https://bankasia.com.bd/credit-card',
        position: 'header',
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        impressions: 15420,
        clicks: 234
      },
      {
        title: 'Grameenphone 5G Network',
        description: 'Experience the fastest 5G network in Bangladesh',
        imageUrl:
          'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300',
        clickUrl: 'https://grameenphone.com/5g',
        position: 'sidebar',
        startDate: new Date(),
        endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days
        impressions: 8932,
        clicks: 156
      }
    ]);

    console.log('✅ Database seeded successfully!');
    console.log(`Created:
    - ${categoryData.length} categories
    - ${userData.length} users
    - ${tagData.length} tags
    - ${articleData.length} articles
    - Multiple article tags, comments, newsletters, and ads
    `);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  }
}

// Run the seed function
seed()
  .then(() => {
    console.log('🎉 Seeding completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Seeding failed:', error);
    process.exit(1);
  });
