'use client'

import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'
import Link, { LinkProps } from 'next/link'
import * as React from 'react'

/**
 * Typography CVA variants
 */
const typographyVariants = cva('leading-relaxed', {
 variants: {
  variant: {
   h1: 'text-4xl sm:text-5xl lg:text-6xl tracking-tight',
   h2: 'text-3xl sm:text-4xl lg:text-5xl tracking-tight',
   h3: 'text-2xl sm:text-3xl lg:text-4xl',
   h4: 'text-xl sm:text-2xl lg:text-3xl',
   h5: 'text-lg sm:text-xl lg:text-2xl',
   body1: 'text-base sm:text-lg',
   body2: 'text-sm sm:text-base',
   subtitle1: 'text-lg',
   subtitle2: 'text-sm',
   caption: 'text-xs',
   overline: 'text-xs uppercase tracking-wider',
  },
  weight: {
   thin: 'font-thin',
   light: 'font-light',
   normal: 'font-normal',
   medium: 'font-medium',
   semibold: 'font-semibold',
   bold: 'font-bold',
  },
  align: {
   left: 'text-left',
   center: 'text-center',
   right: 'text-right',
   justify: 'text-justify',
   start: 'text-start',
  },
  transform: {
   uppercase: 'uppercase',
   lowercase: 'lowercase',
   capitalize: 'capitalize',
   normal: 'normal-case',
  },
 },
 defaultVariants: {
  variant: 'body1',
  weight: 'normal',
  align: 'start',
  transform: 'normal',
 },
})

/**
 * Typography Props
 */
type TypographyBaseProps = VariantProps<typeof typographyVariants> & {
 as?: React.ElementType
 className?: string
 children: React.ReactNode
}

type TypographyLinkProps = TypographyBaseProps &
 LinkProps &
 Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> & {
  href: string
 }

type TypographyComponentProps = TypographyBaseProps &
 React.HTMLAttributes<HTMLElement> & {
  href?: undefined
 }

type TypographyProps = TypographyLinkProps | TypographyComponentProps

/**
 * Typography Component
 */
const Typography = React.forwardRef<HTMLElement, TypographyProps>(
 (
  {
   variant,
   weight,
   align,
   transform,
   as: asProp,
   href,
   className,
   children,
   ...props
  },
  ref,
 ) => {
  const classes = cn(
   typographyVariants({ variant, weight, align, transform }),
   className,
  )

  // Determine element type: Link if href, otherwise asProp or default 'p'
  const Element: React.ElementType = href && !asProp ? Link : asProp || 'p'

  // Merge props
  const elementProps =
   href && Element === Link
    ? {
       href,
       className: classes,
       ref: ref as React.Ref<HTMLAnchorElement>,
       ...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>),
      }
    : {
       className: classes,
       ref,
       ...(props as React.HTMLAttributes<HTMLElement>),
      }

  return <Element {...elementProps}>{children}</Element>
 },
)

Typography.displayName = 'Typography'

export { Typography, typographyVariants }
