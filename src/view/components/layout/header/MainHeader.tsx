import CustomImage from '@/components/common/CustomImage'
import { Menu } from 'lucide-react'

export default function MainHeader() {
 return (
  <div className='mx-auto px-4 py-4 container'>
   <div className='flex justify-between items-center'>
    {/* Logo */}
    <div className='flex items-center'>
     <CustomImage
      src='/images/logo.png'
      alt='BD News'
      width={180}
      height={65}
     />
    </div>

    {/* Search */}
    <div className='flex flex-1 justify-end'>
     <CustomImage
      src='/images/ads/01.gif'
      unoptimized
      alt='BD News'
      width={580}
      height={65}
     />
    </div>

    {/* Right side */}
    <div className='md:hidden flex items-center gap-4'>
     <Menu className='w-6 h-6' />
    </div>
   </div>
  </div>
 )
}
