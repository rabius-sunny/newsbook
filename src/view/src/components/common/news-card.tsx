import { Clock } from 'lucide-react'
import CustomImage from './CustomImage'

interface NewsCardProps {
  title: string
  excerpt?: string
  image?: string
  category: string
  time: string
  featured?: boolean
  className?: string
}

export default function NewsCard({
  title,
  excerpt,
  image,
  category,
  time,
  featured = false,
  className = ''
}: NewsCardProps) {
  if (featured) {
    return (
      <article className={`group cursor-pointer ${className}`}>
        <div className='relative mb-4'>
          <CustomImage
            src={image || '/placeholder.svg?height=300&width=500&query=news'}
            alt={title}
            width={500}
            height={300}
            className='rounded-lg w-full h-64 object-cover'
          />
          <div className='top-3 left-3 absolute'>
            <span className='bg-red-600 px-2 py-1 rounded font-medium text-white text-xs'>
              {category}
            </span>
          </div>
        </div>
        <h2 className='mb-2 font-bold text-gray-900 group-hover:text-red-600 text-xl line-clamp-2 transition-colors'>
          {title}
        </h2>
        {excerpt && <p className='mb-3 text-gray-600 text-sm line-clamp-3'>{excerpt}</p>}
        <div className='flex items-center text-gray-500 text-xs'>
          <Clock className='mr-1 w-3 h-3' />
          <span>{time}</span>
        </div>
      </article>
    )
  }

  return (
    <article className={`group cursor-pointer flex gap-3 ${className}`}>
      {image && (
        <div className='flex-shrink-0'>
          <CustomImage
            src={image || '/placeholder.svg'}
            alt={title}
            width={120}
            height={80}
            className='rounded w-20 h-16 object-cover'
          />
        </div>
      )}
      <div className='flex-1'>
        <h3 className='mb-1 font-semibold text-gray-900 group-hover:text-red-600 text-sm line-clamp-2 transition-colors'>
          {title}
        </h3>
        {excerpt && <p className='mb-2 text-gray-600 text-xs line-clamp-2'>{excerpt}</p>}
        <div className='flex justify-between items-center text-gray-500 text-xs'>
          <span className='font-medium text-red-600'>{category}</span>
          <div className='flex items-center'>
            <Clock className='mr-1 w-3 h-3' />
            <span>{time}</span>
          </div>
        </div>
      </div>
    </article>
  )
}
