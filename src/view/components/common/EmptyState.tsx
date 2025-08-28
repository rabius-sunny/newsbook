// components/shared/empty-state.tsx

import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'
import Image from 'next/image'

const emptyStateVariants = cva(
 'flex flex-col justify-center items-center space-y-4 mx-auto p-6 rounded-lg max-w-2xl text-center',
 {
  variants: {
   variant: {
    default: 'bg-transparent text-muted-foreground',
    error: 'bg-red-50 border border-red-200 text-red-600',
    minimal: 'bg-transparent text-gray-500 p-0',
   },
  },
  defaultVariants: {
   variant: 'default',
  },
 },
)

type EmptyStateProps = VariantProps<typeof emptyStateVariants> & {
 title?: string
 description?: string
 imageSrc?: string
 imageAlt?: string
 showImage?: boolean
 action?: React.ReactNode
 className?: string
}

export function EmptyState({
 title = 'No data found!',
 description,
 imageSrc = '/images/empty-cart.jpg',
 imageAlt = 'Empty',
 showImage = true,
 action,
 variant,
 className,
}: EmptyStateProps) {
 return (
  <section className={cn(emptyStateVariants({ variant }), className)}>
   {showImage && (
    <Image src={imageSrc} alt={imageAlt} width={200} height={200} />
   )}
   <div>
    <h3 className='font-semibold text-lg'>{title}</h3>
    {description && (
     <p className='mt-1 font-light text-muted-foreground text-sm'>
      {description}
     </p>
    )}
   </div>
   {action && <div>{action}</div>}
  </section>
 )
}
