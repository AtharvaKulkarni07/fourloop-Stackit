'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

export const RichTextEditor = ({ content, onChange, placeholder }: any) => {
  const editor = useEditor({
    extensions: [StarterKit],  // only StarterKit
    content,
    editorProps: {
      attributes: {
        className: 'min-h-[150px] prose dark:prose-invert focus:outline-none',
        placeholder: placeholder || '',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  return <EditorContent editor={editor} />
}
