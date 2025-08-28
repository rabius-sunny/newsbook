import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'
import { cn } from '@/lib/utils'

const sectionVariants = cva('block w-full', {
 variants: {
  variant: {
   none: 'py-0',
   xs: 'py-2',
   sm: 'py-4',
   md: 'py-6 md:py-8 lg:py-10',
   lg: 'py-12 lg:py-14',
   xl: 'py-14 xl:py-20',
   xxl: 'py-20 xl:py-32',
  },
  bg: {
   none: '',
   light: 'bg-lightGray',
   mid: 'bg-slate-50',
   dark: 'bg-dark',
   secondary: 'bg-secondary',
   primary: 'bg-primary text-white',
  },
  fullWidth: {
   true: 'w-full',
   false: 'max-w-screen-xl mx-auto',
  },
 },
 defaultVariants: {
  variant: 'md',
  bg: 'none',
  fullWidth: true,
 },
})

export interface SectionProps
 extends React.HTMLAttributes<HTMLElement>,
  VariantProps<typeof sectionVariants> {
 as?: React.ElementType
}

const Section = React.forwardRef<HTMLElement, SectionProps>(
 (
  { as: Comp = 'section', className, variant, bg, fullWidth, ...props },
  ref,
 ) => (
  <Comp
   ref={ref}
   className={cn(sectionVariants({ variant, bg, fullWidth }), className)}
   {...props}
  />
 ),
)

Section.displayName = 'Section'

export { Section, sectionVariants }
export type SectionVariant = VariantProps<typeof sectionVariants>['variant']
export type SectionBg = VariantProps<typeof sectionVariants>['bg']
export type SectionFullWidth = VariantProps<typeof sectionVariants>['fullWidth']
