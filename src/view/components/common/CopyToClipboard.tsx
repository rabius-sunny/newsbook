import { copyToClipboard } from '@/lib/clipboard'
import { useState } from 'react'
import Icon from '../icons'

type CopyToClipboardProps = {
 text: string
 successMessage?: string
 duration?: number // icon switch duration in ms
}

export const CopyToClipboard = ({
 text,
 duration = 2000,
}: CopyToClipboardProps) => {
 const [copied, setCopied] = useState(false)

 const handleCopy = async () => {
  const success = await copyToClipboard(text)
  if (success) {
   setCopied(true)
   setTimeout(() => setCopied(false), duration)
  }
 }

 return (
  <span
   onClick={handleCopy}
   className='text-gray-600 hover:text-primary text-base transition-colors cursor-pointer'
  >
   {copied ? <Icon name='check' /> : <Icon name='copy' />}
  </span>
 )
}
