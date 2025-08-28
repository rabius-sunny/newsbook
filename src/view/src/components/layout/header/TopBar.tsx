import { User } from "lucide-react";

export default function TopBar() {
 return (
  <div className='bg-gray-100 py-1 text-gray-800'>
   <div className='flex justify-between items-center mx-auto px-4 text-sm container'>
    <div className='flex items-center gap-4'>
     <span>আজ ২৭ আগস্ট, ২০২৫</span>
     <span>|</span>
     <span>মঙ্গলবার</span>
    </div>
    <div className='flex items-center gap-4'>
     <span>English</span>
     <span>|</span>
     <span>ই-পেপার</span>
     <User className='w-4 h-4' />
    </div>
   </div>
  </div>
 )
}
