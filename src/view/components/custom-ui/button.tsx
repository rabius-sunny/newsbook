'use client'

import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import * as React from 'react'

const baseButtonStyles =
 'inline-flex justify-center items-center gap-2 rounded-md font-oswald font-medium text-base whitespace-nowrap transition-colors'
const interactiveStyles =
 'disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ring-offset-background focus-visible:ring-offset-2'
const iconStyles = '[&_svg]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0'

const buttonVariants = cva(
 cn(baseButtonStyles, interactiveStyles, iconStyles),
 {
  variants: {
   variant: {
    solid: 'bg-primary text-white hover:opacity-90 active:opacity-100',
    outline:
     'border border-input bg-transparent hover:bg-transparent hover:text-primary active:bg-primary/5',
    ghost: 'hover:bg-accent hover:text-accent-foreground active:bg-accent/80',
    link:
     'text-primary underline-offset-4 hover:underline active:text-primary/80',
    secondary:
     'bg-secondary text-secondary-foreground hover:bg-secondary/80 active:bg-secondary/90',
    destructive:
     'bg-destructive text-destructive-foreground hover:bg-destructive/90 active:bg-destructive',
    subtle:
     'text-primary bg-primary/5 hover:bg-primary/20 active:bg-primary/30',
   },
   size: {
    sm: 'h-9 px-3 text-sm',
    md: 'h-10 px-4 py-2',
    lg: 'h-12 px-6 text-lg font-semibold',
    icon: 'h-10 w-10 p-0',
   },
   loading: {
    true: 'cursor-not-allowed opacity-70',
    false: 'cursor-pointer',
   },
  },
  defaultVariants: {
   variant: 'solid',
   size: 'md',
   loading: false,
  },
 },
)

interface ButtonBaseProps extends VariantProps<typeof buttonVariants> {
 asChild?: boolean
 icon?: React.ReactNode
 iconPosition?: 'start' | 'end'
 loading?: boolean
 disabled?: boolean
}

interface ButtonProps
 extends ButtonBaseProps,
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBaseProps> {
 href?: undefined
}

interface AnchorProps
 extends ButtonBaseProps,
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
 href: string
}

const renderButtonContent = (
 loading: boolean,
 icon: React.ReactNode | undefined,
 iconPosition: 'start' | 'end',
 children: React.ReactNode,
) => (
 <>
  {loading && <Loader2 className='animate-spin' />}
  {!loading && icon && iconPosition === 'start' && icon}
  {children && <span>{children}</span>}
  {!loading && icon && iconPosition === 'end' && icon}
 </>
)

type Ref = HTMLButtonElement | HTMLAnchorElement
type Props = ButtonProps | AnchorProps

export const Button = React.forwardRef<Ref, Props>((props, ref) => {
 const {
  className,
  variant,
  size,
  loading = false,
  href,
  icon,
  iconPosition = 'start',
  children,
  ...rest
 } = props

 const commonProps = {
  className: cn(buttonVariants({ variant, size, loading }), className),
 }

 if (href) {
  const { disabled, ...anchorProps } = rest as AnchorProps
  return (
   <Link
    {...anchorProps}
    {...commonProps}
    href={href}
    ref={ref as React.Ref<HTMLAnchorElement>}
   >
    {renderButtonContent(loading, icon, iconPosition, children)}
   </Link>
  )
 }

 const { disabled, ...buttonProps } = rest as ButtonProps
 const isDisabled = loading || disabled

 return (
  <button
   {...buttonProps}
   {...commonProps}
   disabled={isDisabled}
   ref={ref as React.Ref<HTMLButtonElement>}
  >
   {renderButtonContent(loading, icon, iconPosition, children)}
  </button>
 )
})

Button.displayName = 'Button'

export { buttonVariants }
