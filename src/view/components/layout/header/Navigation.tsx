import CustomLink from '@/components/common/CustomLink'

export default function Navigation() {
 return (
  <div className='top-0 z-10 sticky bg-gray-50 shadow'>
   <nav>
    <div className='mx-auto px-4 container'>
     <div className='flex items-center gap-8 py-3.5 overflow-x-auto'>
      {[
       'সর্বশেষ',
       'জাতীয়',
       'রাজনীতি',
       'মতামত',
       'আন্তর্জাতিক',
       'অর্থনীতি',
       'খেলা',
       'বিনোদন',
       'লাইফস্টাইল',
       'শিক্ষা',
      ].map((item) => (
       <CustomLink
        key={item}
        href='#'
        className='font-medium text-gray-700 hover:text-red-600 whitespace-nowrap'
       >
        {item}
       </CustomLink>
      ))}
     </div>
    </div>
   </nav>
  </div>
 )
}
