import Header from '@/components/layout/header'
import NewsCard from '@/components/common/news-card'
import SidebarNews from '@/components/layout/sidebar-news'
import SectionHeader from '@/components/layout/section-header'
import { newsData } from '@/config/data'
import Footer from '@/components/layout/footer'

export default function HomePage() {
 return (
  <div className='bg-gray-50 min-h-screen'>
   <Header />

   <main className='mx-auto px-4 py-6 container'>
    <div className='gap-6 grid grid-cols-1 lg:grid-cols-4'>
     {/* Main content */}
     <div className='lg:col-span-3'>
      {/* Featured news */}
      <section className='mb-8'>
       <div className='gap-6 grid grid-cols-1 md:grid-cols-2'>
        {/* Main featured article */}
        <div className='md:col-span-1'>
         <NewsCard {...newsData.mainNews[0]} featured={true} />
        </div>

        {/* Secondary articles */}
        <div className='space-y-4'>
         {newsData.mainNews.slice(1, 3).map((news) => (
          <NewsCard key={news.id} {...news} />
         ))}
        </div>
       </div>
      </section>

      {/* International news */}
      <section className='mb-8'>
       <SectionHeader title='আন্তর্জাতিক' />
       <div className='gap-6 grid grid-cols-1 md:grid-cols-2'>
        {newsData.internationalNews.map((news) => (
         <NewsCard key={news.id} {...news} />
        ))}
       </div>
      </section>

      {/* Sports news */}
      <section className='mb-8'>
       <SectionHeader title='খেলা' />
       <div className='gap-6 grid grid-cols-1 md:grid-cols-2'>
        {newsData.sportsNews.map((news) => (
         <NewsCard key={news.id} {...news} />
        ))}
       </div>
      </section>

      {/* Ad placeholder */}
      <div className='flex justify-center items-center bg-gray-200 mb-8 rounded-lg h-24 text-gray-500'>
       বিজ্ঞাপন
      </div>
     </div>

     {/* Sidebar */}
     <div className='lg:col-span-1'>
      <div className='top-6 sticky space-y-6'>
       <SidebarNews news={newsData.sidebarNews} />

       {/* Popular news */}
       <div className='bg-white p-4 border rounded-lg'>
        <h3 className='mb-4 pb-2 border-b font-bold text-gray-900'>জনপ্রিয়</h3>
        <div className='space-y-3'>
         {[1, 2, 3, 4, 5].map((num) => (
          <div
           key={num}
           className='group flex items-start gap-3 cursor-pointer'
          >
           <span className='flex flex-shrink-0 justify-center items-center bg-red-600 mt-1 rounded-full w-6 h-6 font-bold text-white text-xs'>
            {num}
           </span>
           <p className='text-gray-900 group-hover:text-red-600 text-sm line-clamp-2 transition-colors'>
            জনপ্রিয় সংবাদের শিরোনাম এখানে থাকবে যা পাঠকদের আকর্ষণ করবে
           </p>
          </div>
         ))}
        </div>
       </div>

       {/* Ad placeholder */}
       <div className='flex justify-center items-center bg-gray-200 rounded-lg h-64 text-gray-500'>
        বিজ্ঞাপন
       </div>
      </div>
     </div>
    </div>
   </main>

   {/* Footer */}
   <Footer />
  </div>
 )
}
