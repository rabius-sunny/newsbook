import CustomLink from '../common/CustomLink'

export default function Footer() {
 return (
  <footer className='bg-gray-800 mt-12 py-8 text-white'>
   <div className='mx-auto px-4 container'>
    <div className='gap-6 grid grid-cols-1 md:grid-cols-4'>
     <div>
      <h3 className='mb-4 font-bold text-lg'>প্রথমআলো</h3>
      <p className='text-gray-300 text-sm'>বাংলাদেশের অগ্রণী দৈনিক পত্রিকা</p>
     </div>
     <div>
      <h4 className='mb-3 font-semibold'>বিভাগসমূহ</h4>
      <ul className='space-y-2 text-gray-300 text-sm'>
       <li>
        <CustomLink href='#' className='hover:text-white'>
         জাতীয়
        </CustomLink>
       </li>
       <li>
        <CustomLink href='#' className='hover:text-white'>
         আন্তর্জাতিক
        </CustomLink>
       </li>
       <li>
        <CustomLink href='#' className='hover:text-white'>
         খেলা
        </CustomLink>
       </li>
       <li>
        <CustomLink href='#' className='hover:text-white'>
         বিনোদন
        </CustomLink>
       </li>
      </ul>
     </div>
     <div>
      <h4 className='mb-3 font-semibold'>যোগাযোগ</h4>
      <ul className='space-y-2 text-gray-300 text-sm'>
       <li>ফোন: ০২-৫৫০২৭৮৫১</li>
       <li>ইমেইল: info@prothomalo.com</li>
       <li>ঠিকানা: ঢাকা, বাংলাদেশ</li>
      </ul>
     </div>
     <div>
      <h4 className='mb-3 font-semibold'>সামাজিক মাধ্যম</h4>
      <div className='flex gap-3'>
       <div className='flex justify-center items-center bg-blue-600 rounded w-8 h-8 text-xs'>
        f
       </div>
       <div className='flex justify-center items-center bg-blue-400 rounded w-8 h-8 text-xs'>
        t
       </div>
       <div className='flex justify-center items-center bg-red-600 rounded w-8 h-8 text-xs'>
        y
       </div>
      </div>
     </div>
    </div>
    <div className='mt-6 pt-6 border-gray-700 border-t text-gray-400 text-sm text-center'>
     © ২০২৫ প্রথমআলো। সর্বস্বত্ব সংরক্ষিত।
    </div>
   </div>
  </footer>
 )
}
