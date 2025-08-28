'use client'

import dynamic from 'next/dynamic'
import { useRef, forwardRef } from 'react'

// Dynamically import Jodit (disable SSR)
const JoditEditor = dynamic(() => import('jodit-react'), {
 ssr: false,
})

interface TextEditorProps {
 value: string
 onChange: (value: string) => void
 buttons?: string[]
 placeholder?: string
 height?: number | string
}

const TextEditor = forwardRef<any, TextEditorProps>(
 (
  { value, onChange, buttons, placeholder = 'Start typing...', height = 400 },
  ref,
 ) => {
  const editorRef = useRef(null)

  // Config function
  const getConfig = (): any => {
   return {
    processPasteHTML: true,
    askBeforePasteHTML: false,
    defaultActionOnPaste: 'insert_as_html',
    readonly: false,
    uploader: {
     insertImageAsBase64URI: true,
     imagesExtensions: ['jpg', 'png', 'jpeg', 'gif'],
    },
   }
  }

  return (
   <JoditEditor
    ref={ref || editorRef}
    value={value}
    config={getConfig()}
    onBlur={(newContent) => onChange(newContent)}
    onChange={(newContent) => onChange(newContent)}
   />
  )
 },
)

TextEditor.displayName = 'TextEditor'

export default TextEditor
