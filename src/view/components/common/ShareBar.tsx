'use client'

import { Facebook, Linkedin, TwitterX, WhatsApp } from '@/components/icons'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

type ShareProductBarProps = {
  title?: string
  url?: string // optional override
  variant?: 'default' | 'snug'
}

export function ShareBar({ title, url, variant = 'default' }: ShareProductBarProps) {
  const pathname = usePathname()
  const [shareUrl, setShareUrl] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setShareUrl(url || window.location.origin + pathname)
    }
  }, [pathname, url])

  const encodedTitle = encodeURIComponent(title || 'Check this out!')
  const encodedUrl = encodeURIComponent(shareUrl)

  const platforms = [
    {
      name: 'Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: <Facebook className='size-5' />
    },
    {
      name: 'LinkedIn',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      icon: <Linkedin className='size-5' />
    },
    {
      name: 'Twitter (X)',
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      icon: <TwitterX className='size-5' />
    },
    {
      name: 'WhatsApp',
      href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      icon: <WhatsApp className='size-5' />
    }
  ]

  return (
    <div className='flex items-center gap-2.5'>
      {platforms.map((platform) => (
        <span
          className={cn(
            'flex justify-center items-center w-8 h-8',
            {
              'bg-gray-100 hover:bg-gray-50 shadow-gray-400 hover:shadow-lg rounded-sm hover:scale-105 transition-all duration-100 ease-in-out transform':
                variant === 'default'
            },
            { 'w-6 h-6': variant === 'snug' }
          )}
          key={platform.name}
        >
          <Link
            href={platform.href || '/'}
            target='_blank'
            rel='noopener noreferrer'
            title={`Share on ${platform.name}`}
          >
            {platform.icon}
          </Link>
        </span>
      ))}
    </div>
  )
}
