'use client'

import { LucideProps } from 'lucide-react'
import { DynamicIcon } from 'lucide-react/dynamic'
import dynamicIconImports from 'lucide-react/dynamicIconImports'

export interface IconProps extends LucideProps {
 name: keyof typeof dynamicIconImports
 fallback?: () => React.ReactNode
}

const Icon = ({ name, fallback, ...props }: IconProps) => {
 if (!dynamicIconImports[name]) {
  return <DynamicIcon name={'help-circle'} strokeWidth={1.2} {...props} />
 }

 return (
  <DynamicIcon
   name={name}
   {...props}
   // fallback={ fallback ??  (() => <span className='block relative bg-gray-100 rounded-full size-5 animate-spin' />) }
  />
 )
}

export default Icon
