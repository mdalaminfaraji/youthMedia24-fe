/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useCallback, useMemo } from 'react'
import { createEditor, Descendant, BaseEditor, Editor } from 'slate'
import { Slate, Editable, withReact, ReactEditor } from 'slate-react'
import { withHistory, HistoryEditor } from 'slate-history'
import { styled } from '@mui/material/styles'

// Define the props for the SlateEditor component
interface SlateEditorProps {
  value: string
  onChange: (content: string) => void
  style?: React.CSSProperties
}

// Define custom element types
type CustomElement = {
  type:
    | 'paragraph'
    | 'heading-one'
    | 'heading-two'
    | 'block-quote'
    | 'bulleted-list'
    | 'numbered-list'
    | 'list-item'
  children: CustomText[]
}

type CustomText = {
  text: string
  bold?: boolean
  italic?: boolean
  underline?: boolean
}

// Define types for rendering props
interface RenderElementProps {
  attributes: React.HTMLAttributes<HTMLElement>
  children: React.ReactNode
  element: CustomElement
}

interface RenderLeafProps {
  attributes: React.HTMLAttributes<HTMLElement>
  children: React.ReactNode
  leaf: CustomText
}

// Declare the custom types for TypeScript
declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor
    Element: CustomElement
    Text: CustomText
  }
}

// Style the editor container
const EditorContainer = styled('div')({
  border: '1px solid #ccc',
  borderRadius: '4px',
  padding: '16px',
  minHeight: '300px',
  '& p': {
    margin: '0 0 8px 0',
  },
  '& h1': {
    fontSize: '24px',
    fontWeight: 'bold',
    margin: '16px 0 8px 0',
  },
  '& h2': {
    fontSize: '20px',
    fontWeight: 'bold',
    margin: '14px 0 8px 0',
  },
  '& blockquote': {
    borderLeft: '2px solid #ddd',
    marginLeft: '0',
    marginRight: '0',
    paddingLeft: '10px',
    color: '#aaa',
    fontStyle: 'italic',
  },
  '& ul': {
    paddingLeft: '20px',
    listStyleType: 'disc',
  },
  '& ol': {
    paddingLeft: '20px',
    listStyleType: 'decimal',
  },
})

// Define the default initial value
const defaultValue: Descendant[] = [
  {
    type: 'paragraph',
    children: [{ text: '' }],
  } as CustomElement,
]

// Define the SlateEditor component
const SlateEditor: React.FC<SlateEditorProps> = ({
  value,
  onChange,
  style,
}) => {
  // Create a Slate editor object that won't change across renders
  const editor = useMemo(() => withHistory(withReact(createEditor())), [])

  // Parse the initial value from the string or use default content
  const initialValue = useMemo(() => {
    try {
      return value ? (JSON.parse(value) as Descendant[]) : defaultValue
    } catch {
      // If parsing fails, create a default paragraph with the content as text
      return [
        {
          type: 'paragraph',
          children: [{ text: value || '' }],
        } as CustomElement,
      ]
    }
  }, [value])

  // Define a rendering function for elements
  const renderElement = useCallback((props: RenderElementProps) => {
    const { attributes, children, element } = props

    switch (element.type) {
      case 'heading-one':
        return <h1 {...attributes}>{children}</h1>
      case 'heading-two':
        return <h2 {...attributes}>{children}</h2>
      case 'block-quote':
        return <blockquote {...attributes}>{children}</blockquote>
      case 'bulleted-list':
        return <ul {...attributes}>{children}</ul>
      case 'numbered-list':
        return <ol {...attributes}>{children}</ol>
      case 'list-item':
        return <li {...attributes}>{children}</li>
      default:
        return <p {...attributes}>{children}</p>
    }
  }, [])

  // Define a rendering function for leaf nodes (text formatting)
  const renderLeaf = useCallback((props: RenderLeafProps) => {
    const { attributes, children, leaf } = props

    let formattedChildren = children

    if (leaf.bold) {
      formattedChildren = <strong>{formattedChildren}</strong>
    }

    if (leaf.italic) {
      formattedChildren = <em>{formattedChildren}</em>
    }

    if (leaf.underline) {
      formattedChildren = <u>{formattedChildren}</u>
    }

    return <span {...attributes}>{formattedChildren}</span>
  }, [])

  // Handle keyboard shortcuts for formatting
  const handleKeyDown = (event: React.KeyboardEvent) => {
    // Bold: Ctrl+B
    if (event.ctrlKey && event.key === 'b') {
      event.preventDefault()
      const isBold = isFormatActive('bold')
      toggleFormat('bold', !isBold)
    }

    // Italic: Ctrl+I
    if (event.ctrlKey && event.key === 'i') {
      event.preventDefault()
      const isItalic = isFormatActive('italic')
      toggleFormat('italic', !isItalic)
    }

    // Underline: Ctrl+U
    if (event.ctrlKey && event.key === 'u') {
      event.preventDefault()
      const isUnderline = isFormatActive('underline')
      toggleFormat('underline', !isUnderline)
    }
  }

  // Check if a format is currently active
  const isFormatActive = (format: string) => {
    const [match] = Editor.nodes(editor, {
      match: (n: any) => n[format] === true,
      universal: true,
    })
    return !!match
  }

  // Toggle a format on or off
  const toggleFormat = (format: string, isActive: boolean) => {
    Editor.addMark(editor, format, isActive)
  }

  return (
    <EditorContainer style={style}>
      <Slate
        editor={editor}
        initialValue={initialValue}
        onChange={(value: Descendant[]) => {
          const isAstChange = editor.operations.some(
            (op: any) => op.type !== 'set_selection'
          )
          if (isAstChange) {
            // Save the value to string
            const content = JSON.stringify(value)
            onChange(content)
          }
        }}
      >
        <div style={{ marginBottom: '8px', fontSize: '14px', color: '#666' }}>
          Formatting: Ctrl+B (Bold), Ctrl+I (Italic), Ctrl+U (Underline)
        </div>
        <Editable
          renderElement={renderElement as any}
          renderLeaf={renderLeaf as any}
          onKeyDown={handleKeyDown}
          placeholder="Enter content here..."
          style={{ minHeight: '250px' }}
        />
      </Slate>
    </EditorContainer>
  )
}

export default SlateEditor
