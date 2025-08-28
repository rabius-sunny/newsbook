import { Clock } from 'lucide-react'

interface SidebarNewsProps {
 news: Array<{
  id: number
  title: string
  time: string
  category: string
 }>
}

export default function SidebarNews({ news }: SidebarNewsProps) {
 return (
  <div className='bg-white p-4 border rounded-lg'>
   <h3 className='mb-4 pb-2 border-b font-bold text-gray-900'>সর্বশেষ সংবাদ</h3>
   <div className='space-y-4'>
    {news.map((item) => (
     <article key={item.id} className='group cursor-pointer'>
      <h4 className='mb-2 font-medium text-gray-900 group-hover:text-red-600 text-sm line-clamp-2 transition-colors'>
       {item.title}
      </h4>
      <div className='flex justify-between items-center text-gray-500 text-xs'>
       <span className='font-medium text-red-600'>{item.category}</span>
       <div className='flex items-center'>
        <Clock className='mr-1 w-3 h-3' />
        <span>{item.time}</span>
       </div>
      </div>
     </article>
    ))}
   </div>
  </div>
 )
}
