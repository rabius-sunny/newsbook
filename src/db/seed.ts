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
} from './schema';

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

    // Seed Categories
    console.log('Creating categories...');
    const categoryData = await db
      .insert(categories)
      .values([
        {
          name: 'সর্বশেষ',
          nameEn: 'Latest',
          slug: 'latest',
          description: 'সর্বশেষ খবর',
          displayOrder: 1
        },
        {
          name: 'রাজনীতি',
          nameEn: 'Politics',
          slug: 'politics',
          description: 'রাজনৈতিক সংবাদ',
          displayOrder: 2
        },
        {
          name: 'অর্থনীতি',
          nameEn: 'Economy',
          slug: 'economy',
          description: 'অর্থনৈতিক সংবাদ',
          displayOrder: 3
        },
        {
          name: 'আন্তর্জাতিক',
          nameEn: 'International',
          slug: 'international',
          description: 'আন্তর্জাতিক সংবাদ',
          displayOrder: 4
        },
        {
          name: 'খেলা',
          nameEn: 'Sports',
          slug: 'sports',
          description: 'খেলাধুলার সংবাদ',
          displayOrder: 5
        },
        {
          name: 'বিনোদন',
          nameEn: 'Entertainment',
          slug: 'entertainment',
          description: 'বিনোদন জগতের সংবাদ',
          displayOrder: 6
        },
        {
          name: 'প্রযুক্তি',
          nameEn: 'Technology',
          slug: 'technology',
          description: 'প্রযুক্তি সংবাদ',
          displayOrder: 7
        },
        {
          name: 'স্বাস্থ্য',
          nameEn: 'Health',
          slug: 'health',
          description: 'স্বাস্থ্য বিষয়ক সংবাদ',
          displayOrder: 8
        },
        {
          name: 'শিক্ষা',
          nameEn: 'Education',
          slug: 'education',
          description: 'শিক্ষা বিষয়ক সংবাদ',
          displayOrder: 9
        },
        {
          name: 'জীবনযাত্রা',
          nameEn: 'Lifestyle',
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
          nameBn: 'প্রশাসক',
          role: 'admin',
          bio: 'System Administrator',
          bioBn: 'সিস্টেম প্রশাসক'
        },
        {
          email: 'editor@prothomalo.com',
          password: hashPassword('editor123'),
          name: 'Chief Editor',
          nameBn: 'প্রধান সম্পাদক',
          role: 'editor',
          bio: 'Chief Editor of Prothom Alo',
          bioBn: 'প্রথম আলোর প্রধান সম্পাদক'
        },
        {
          email: 'reporter1@prothomalo.com',
          password: hashPassword('reporter123'),
          name: 'Rashid Ahmed',
          nameBn: 'রশিদ আহমেদ',
          role: 'reporter',
          bio: 'Senior Political Reporter',
          bioBn: 'সিনিয়র রাজনৈতিক প্রতিবেদক'
        },
        {
          email: 'reporter2@prothomalo.com',
          password: hashPassword('reporter123'),
          name: 'Fatima Khan',
          nameBn: 'ফাতিমা খান',
          role: 'reporter',
          bio: 'Sports Correspondent',
          bioBn: 'ক্রীড়া প্রতিনিধি'
        },
        {
          email: 'reporter3@prothomalo.com',
          password: hashPassword('reporter123'),
          name: 'Karim Rahman',
          nameBn: 'করিম রহমান',
          role: 'reporter',
          bio: 'International Affairs Reporter',
          bioBn: 'আন্তর্জাতিক বিষয়ক প্রতিবেদক'
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
          nameBn: 'জরুরি',
          slug: 'breaking',
          color: '#DC2626'
        },
        {
          name: 'bangladesh',
          nameBn: 'বাংলাদেশ',
          slug: 'bangladesh',
          color: '#16A34A'
        },
        { name: 'dhaka', nameBn: 'ঢাকা', slug: 'dhaka', color: '#2563EB' },
        {
          name: 'cricket',
          nameBn: 'ক্রিকেট',
          slug: 'cricket',
          color: '#7C3AED'
        },
        {
          name: 'football',
          nameBn: 'ফুটবল',
          slug: 'football',
          color: '#EA580C'
        },
        {
          name: 'election',
          nameBn: 'নির্বাচন',
          slug: 'election',
          color: '#DC2626'
        },
        {
          name: 'economy',
          nameBn: 'অর্থনীতি',
          slug: 'economy-tag',
          color: '#059669'
        },
        {
          name: 'coronavirus',
          nameBn: 'করোনাভাইরাস',
          slug: 'coronavirus',
          color: '#DC2626'
        },
        {
          name: 'education',
          nameBn: 'শিক্ষা',
          slug: 'education-tag',
          color: '#2563EB'
        },
        {
          name: 'climate',
          nameBn: 'জলবায়ু',
          slug: 'climate',
          color: '#16A34A'
        }
      ])
      .returning();

    // Seed Articles
    console.log('Creating articles...');
    const politicsCategory = categoryData.find((c) => c.slug === 'politics');
    const sportsCategory = categoryData.find((c) => c.slug === 'sports');
    const economyCategory = categoryData.find((c) => c.slug === 'economy');
    const internationalCategory = categoryData.find(
      (c) => c.slug === 'international'
    );

    const adminUser = userData.find((u) => u.role === 'admin');
    const editorUser = userData.find((u) => u.role === 'editor');
    const politicsReporter = userData.find((u) => u.name === 'Rashid Ahmed');
    const sportsReporter = userData.find((u) => u.name === 'Fatima Khan');
    const intlReporter = userData.find((u) => u.name === 'Karim Rahman');

    const articleData = await db
      .insert(articles)
      .values([
        {
          title: 'Parliament Session to Discuss Economic Recovery Plan',
          titleBn: 'অর্থনৈতিক পুনরুদ্ধার পরিকল্পনা নিয়ে সংসদ অধিবেশন',
          slug: 'parliament-economic-recovery-plan',
          excerpt:
            'The upcoming parliament session will focus on the national economic recovery strategy.',
          excerptBn:
            'আসন্ন সংসদ অধিবেশনে জাতীয় অর্থনৈতিক পুনরুদ্ধার কৌশল নিয়ে আলোচনা হবে।',
          content:
            'The parliament is set to convene for a special session to discuss the comprehensive economic recovery plan. The plan includes measures for job creation, infrastructure development, and support for small businesses affected by recent global economic challenges.',
          contentBn:
            'ব্যাপক অর্থনৈতিক পুনরুদ্ধার পরিকল্পনা আলোচনার জন্য সংসদের বিশেষ অধিবেশন বসতে যাচ্ছে। এই পরিকল্পনায় কর্মসংস্থান সৃষ্টি, অবকাঠামো উন্নয়ন এবং সাম্প্রতিক বৈশ্বিক অর্থনৈতিক চ্যালেঞ্জে ক্ষতিগ্রস্ত ছোট ব্যবসার সহায়তার ব্যবস্থা রয়েছে।',
          categoryId: politicsCategory?.id,
          authorId: politicsReporter?.id,
          editorId: editorUser?.id,
          status: 'published',
          isPublished: true,
          publishedAt: new Date(),
          isFeatured: true,
          priority: 8,
          location: 'Dhaka',
          locationBn: 'ঢাকা',
          featuredImage:
            'https://images.unsplash.com/photo-1555848962-6e79363bfa19?w=800',
          imageCaption: 'Parliament building in Dhaka',
          imageCaptionBn: 'ঢাকার জাতীয় সংসদ ভবন',
          viewCount: 1250,
          likeCount: 89,
          shareCount: 34
        },
        {
          title: 'Bangladesh Cricket Team Wins Against Australia',
          titleBn: 'অস্ট্রেলিয়ার বিপক্ষে জয় পেল বাংলাদেশ ক্রিকেট দল',
          slug: 'bangladesh-cricket-wins-australia',
          excerpt:
            'Bangladesh secured a remarkable victory against Australia in the recent T20 match.',
          excerptBn:
            'সাম্প্রতিক টি-২০ ম্যাচে অস্ট্রেলিয়ার বিপক্ষে দুর্দান্ত জয় পেয়েছে বাংলাদেশ।',
          content:
            'In a thrilling T20 match at Shere Bangla National Stadium, Bangladesh defeated Australia by 7 wickets. The man of the match was awarded to Shakib Al Hasan for his outstanding all-round performance.',
          contentBn:
            'শেরে বাংলা জাতীয় স্টেডিয়ামে রোমাঞ্চকর টি-২০ ম্যাচে বাংলাদেশ অস্ট্রেলিয়াকে ৭ উইকেটে পরাজিত করেছে। অসাধারণ অল রাউন্ড পারফরম্যান্সের জন্য ম্যান অব দ্য ম্যাচ পুরস্কার পেয়েছেন শাকিব আল হাসান।',
          categoryId: sportsCategory?.id,
          authorId: sportsReporter?.id,
          editorId: editorUser?.id,
          status: 'published',
          isPublished: true,
          publishedAt: new Date(Date.now() - 86400000), // 1 day ago
          isBreaking: true,
          priority: 9,
          location: 'Dhaka',
          locationBn: 'ঢাকা',
          featuredImage:
            'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800',
          imageCaption: 'Bangladesh cricket team celebrates victory',
          imageCaptionBn: 'জয়ের উল্লাসে বাংলাদেশ ক্রিকেট দল',
          viewCount: 2340,
          likeCount: 156,
          shareCount: 78
        },
        {
          title: 'New Trade Agreement with European Union',
          titleBn: 'ইউরোপীয় ইউনিয়নের সাথে নতুন বাণিজ্য চুক্তি',
          slug: 'new-trade-agreement-eu',
          excerpt:
            'Bangladesh signs a comprehensive trade agreement with the European Union.',
          excerptBn:
            'ইউরোপীয় ইউনিয়নের সাথে ব্যাপক বাণিজ্য চুক্তি স্বাক্ষর করেছে বাংলাদেশ।',
          content:
            'The government has signed a landmark trade agreement with the European Union that will boost exports and create new opportunities for Bangladeshi businesses. The agreement covers textiles, pharmaceuticals, and technology sectors.',
          contentBn:
            'সরকার ইউরোপীয় ইউনিয়নের সাথে একটি ঐতিহাসিক বাণিজ্য চুক্তি স্বাক্ষর করেছে যা রপ্তানি বৃদ্ধি করবে এবং বাংলাদেশি ব্যবসার জন্য নতুন সুযোগ সৃষ্টি করবে। এই চুক্তিতে টেক্সটাইল, ফার্মাসিউটিক্যালস এবং প্রযুক্তি খাত অন্তর্ভুক্ত রয়েছে।',
          categoryId: economyCategory?.id,
          authorId: intlReporter?.id,
          editorId: editorUser?.id,
          status: 'published',
          isPublished: true,
          publishedAt: new Date(Date.now() - 172800000), // 2 days ago
          isFeatured: true,
          priority: 7,
          location: 'Brussels',
          locationBn: 'ব্রাসেলস',
          featuredImage:
            'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=800',
          imageCaption: 'Trade delegation meeting',
          imageCaptionBn: 'বাণিজ্য প্রতিনিধিদলের বৈঠক',
          viewCount: 1890,
          likeCount: 98,
          shareCount: 45
        },
        {
          title: 'Climate Change Conference Outcomes',
          titleBn: 'জলবায়ু পরিবর্তন সম্মেলনের ফলাফল',
          slug: 'climate-change-conference-outcomes',
          excerpt:
            'Key decisions from the international climate summit affect Bangladesh.',
          excerptBn:
            'আন্তর্জাতিক জলবায়ু শীর্ষ সম্মেলনের গুরুত্বপূর্ণ সিদ্ধান্ত বাংলাদেশকে প্রভাবিত করবে।',
          content:
            'The recent international climate conference concluded with important commitments for developing nations. Bangladesh secured significant funding for climate adaptation projects and renewable energy initiatives.',
          contentBn:
            'সাম্প্রতিক আন্তর্জাতিক জলবায়ু সম্মেলন উন্নয়নশীল দেশগুলির জন্য গুরুত্বপূর্ণ অঙ্গীকার নিয়ে শেষ হয়েছে। বাংলাদেশ জলবায়ু অভিযোজন প্রকল্প এবং নবায়নযোগ্য শক্তি উদ্যোগের জন্য উল্লেখযোগ্য অর্থায়ন নিশ্চিত করেছে।',
          categoryId: internationalCategory?.id,
          authorId: intlReporter?.id,
          editorId: editorUser?.id,
          status: 'published',
          isPublished: true,
          publishedAt: new Date(Date.now() - 259200000), // 3 days ago
          priority: 6,
          location: 'Geneva',
          locationBn: 'জেনেভা',
          featuredImage:
            'https://images.unsplash.com/photo-1569163139302-de44fdc5c72c?w=800',
          imageCaption: 'Climate conference delegates',
          imageCaptionBn: 'জলবায়ু সম্মেলনের প্রতিনিধিগণ',
          viewCount: 987,
          likeCount: 67,
          shareCount: 23
        }
      ])
      .returning();

    // Seed Article Tags
    console.log('Creating article tags...');
    const breakingTag = tagData.find((t) => t.slug === 'breaking');
    const bangladeshTag = tagData.find((t) => t.slug === 'bangladesh');
    const dhakaTag = tagData.find((t) => t.slug === 'dhaka');
    const cricketTag = tagData.find((t) => t.slug === 'cricket');
    const electionTag = tagData.find((t) => t.slug === 'election');
    const economyTag = tagData.find((t) => t.slug === 'economy-tag');
    const climateTag = tagData.find((t) => t.slug === 'climate');

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
        content: 'Great victory for Bangladesh! Proud moment for all of us.',
        contentBn:
          'বাংলাদেশের জন্য দুর্দান্ত জয়! আমাদের সবার জন্য গর্বের মুহূর্ত।',
        isApproved: true,
        likeCount: 15
      },
      {
        articleId: articleData[1].id, // Cricket article
        authorName: 'সালমা খান',
        authorEmail: 'salma@example.com',
        content: 'Shakib played exceptionally well. Man of the match indeed!',
        contentBn: 'শাকিব অসাধারণ খেলেছেন। সত্যিই ম্যান অব দ্য ম্যাচ!',
        isApproved: true,
        likeCount: 8
      },
      {
        articleId: articleData[0].id, // Parliament article
        authorName: 'আহমেদ হাসান',
        authorEmail: 'ahmed@example.com',
        content:
          'Hope this economic plan brings positive changes for common people.',
        contentBn:
          'আশা করি এই অর্থনৈতিক পরিকল্পনা সাধারণ মানুষের জন্য ইতিবাচক পরিবর্তন আনবে।',
        isApproved: true,
        likeCount: 12
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
        title: 'Bank Asia Credit Card',
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
        title: 'Grameenphone 5G',
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
