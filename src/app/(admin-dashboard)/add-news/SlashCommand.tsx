/* eslint-disable @typescript-eslint/no-explicit-any */
import { Extension } from '@tiptap/core'
import Suggestion from '@tiptap/suggestion'
import { ReactRenderer } from '@tiptap/react'
import tippy from 'tippy.js'
import 'tippy.js/dist/tippy.css'
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
} from '@mui/material'
import {
  FormatBold as FormatBoldIcon,
  FormatItalic as FormatItalicIcon,
  FormatUnderlined as FormatUnderlinedIcon,
  StrikethroughS as StrikethroughSIcon,
  FormatListBulleted as FormatListBulletedIcon,
  FormatListNumbered as FormatListNumberedIcon,
  FormatQuote as FormatQuoteIcon,
  Code as CodeIcon,
  Title as TitleIcon,
  Image as ImageIcon,
  YouTube as YouTubeIcon,
  InsertLink as LinkIcon,
  HorizontalRule as HorizontalRuleIcon,
} from '@mui/icons-material'
import {
  ReactNode,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
  createRef,
} from 'react'

export interface CommandItem {
  title: string
  description: string
  icon?: ReactNode
  command: ({ editor, range }: { editor: any; range: any }) => void
}

interface CommandListProps {
  items: CommandItem[]
  command: (item: CommandItem) => void
  editor: any
  range: any
}

// Define the ref type explicitly
interface CommandListRef {
  onKeyDown: (props: { event: KeyboardEvent }) => boolean
}

const CommandList = forwardRef<CommandListRef, CommandListProps>((props, ref) => {
  const { items, command } = props
  const [selectedIndex, setSelectedIndex] = useState(0)

  const selectItem = (index: number) => {
    const item = items[index]
    if (item) {
      command(item)
    }
  }

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }) => {
      if (event.key === 'ArrowUp') {
        setSelectedIndex((selectedIndex + items.length - 1) % items.length)
        return true
      }

      if (event.key === 'ArrowDown') {
        setSelectedIndex((selectedIndex + 1) % items.length)
        return true
      }

      if (event.key === 'Enter') {
        selectItem(selectedIndex)
        return true
      }

      return false
    },
  }))

  useEffect(() => {
    setSelectedIndex(0)
  }, [items])

  return (
    <Paper
      elevation={3}
      sx={{
        maxWidth: 320,
        maxHeight: 400,
        overflow: 'auto',
      }}
    >
      <List dense>
        {items.map((item, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton
              selected={index === selectedIndex}
              onClick={() => selectItem(index)}
              sx={{
                py: 1,
                bgcolor:
                  index === selectedIndex
                    ? 'action.selected'
                    : 'background.paper',
              }}
            >
              {item.icon && (
                <ListItemIcon sx={{ minWidth: 36 }}>{item.icon}</ListItemIcon>
              )}
              <ListItemText
                primary={item.title}
                secondary={item.description}
                primaryTypographyProps={{
                  fontWeight: index === selectedIndex ? 'bold' : 'normal',
                  fontSize: '0.9rem',
                }}
                secondaryTypographyProps={{
                  fontSize: '0.75rem',
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Paper>
  )
})

CommandList.displayName = 'CommandList'

const SlashCommand = Extension.create({
  name: 'slashCommand',

  addOptions() {
    return {
      suggestion: {
        char: '/',
        command: ({
          editor,
          range,
          props,
        }: {
          editor: any
          range: any
          props: any
        }) => {
          props.command({ editor, range })
        },
      },
    }
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
        items: ({ query }: { query: string }) => {
          const commands: CommandItem[] = [
            {
              title: 'Heading 1',
              description: 'Large section heading',
              icon: <TitleIcon fontSize="small" />,
              command: ({ editor, range }) => {
                editor
                  .chain()
                  .focus()
                  .deleteRange(range)
                  .setNode('heading', { level: 1 })
                  .run()
              },
            },
            {
              title: 'Heading 2',
              description: 'Medium section heading',
              icon: <TitleIcon fontSize="small" />,
              command: ({ editor, range }) => {
                editor
                  .chain()
                  .focus()
                  .deleteRange(range)
                  .setNode('heading', { level: 2 })
                  .run()
              },
            },
            {
              title: 'Heading 3',
              description: 'Small section heading',
              icon: <TitleIcon fontSize="small" />,
              command: ({ editor, range }) => {
                editor
                  .chain()
                  .focus()
                  .deleteRange(range)
                  .setNode('heading', { level: 3 })
                  .run()
              },
            },
            {
              title: 'Bullet List',
              description: 'Create a simple bullet list',
              icon: <FormatListBulletedIcon fontSize="small" />,
              command: ({ editor, range }) => {
                editor
                  .chain()
                  .focus()
                  .deleteRange(range)
                  .toggleBulletList()
                  .run()
              },
            },
            {
              title: 'Numbered List',
              description: 'Create a numbered list',
              icon: <FormatListNumberedIcon fontSize="small" />,
              command: ({ editor, range }) => {
                editor
                  .chain()
                  .focus()
                  .deleteRange(range)
                  .toggleOrderedList()
                  .run()
              },
            },
            {
              title: 'Quote',
              description: 'Add a quote block',
              icon: <FormatQuoteIcon fontSize="small" />,
              command: ({ editor, range }) => {
                editor
                  .chain()
                  .focus()
                  .deleteRange(range)
                  .toggleBlockquote()
                  .run()
              },
            },
            {
              title: 'Code Block',
              description: 'Add a code block',
              icon: <CodeIcon fontSize="small" />,
              command: ({ editor, range }) => {
                editor
                  .chain()
                  .focus()
                  .deleteRange(range)
                  .toggleCodeBlock()
                  .run()
              },
            },
            {
              title: 'Bold',
              description: 'Make text bold',
              icon: <FormatBoldIcon fontSize="small" />,
              command: ({ editor, range }) => {
                editor.chain().focus().deleteRange(range).toggleBold().run()
              },
            },
            {
              title: 'Italic',
              description: 'Make text italic',
              icon: <FormatItalicIcon fontSize="small" />,
              command: ({ editor, range }) => {
                editor.chain().focus().deleteRange(range).toggleItalic().run()
              },
            },
            {
              title: 'Underline',
              description: 'Underline text',
              icon: <FormatUnderlinedIcon fontSize="small" />,
              command: ({ editor, range }) => {
                editor
                  .chain()
                  .focus()
                  .deleteRange(range)
                  .toggleUnderline()
                  .run()
              },
            },
            {
              title: 'Strikethrough',
              description: 'Cross out text',
              icon: <StrikethroughSIcon fontSize="small" />,
              command: ({ editor, range }) => {
                editor.chain().focus().deleteRange(range).toggleStrike().run()
              },
            },
            {
              title: 'Image',
              description: 'Insert an image',
              icon: <ImageIcon fontSize="small" />,
              command: ({ editor, range }) => {
                const url = prompt('Enter image URL')
                if (url) {
                  editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .setImage({ src: url })
                    .run()
                }
              },
            },
            {
              title: 'YouTube',
              description: 'Insert a YouTube video',
              icon: <YouTubeIcon fontSize="small" />,
              command: ({ editor, range }) => {
                const url = prompt('Enter YouTube video URL')
                if (url) {
                  editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .setYoutubeVideo({
                      src: url,
                    })
                    .run()
                }
              },
            },
            {
              title: 'Link',
              description: 'Add a link',
              icon: <LinkIcon fontSize="small" />,
              command: ({ editor, range }) => {
                const url = prompt('Enter link URL')
                if (url) {
                  editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .setLink({ href: url })
                    .run()
                }
              },
            },
            {
              title: 'Horizontal Rule',
              description: 'Insert a horizontal divider',
              icon: <HorizontalRuleIcon fontSize="small" />,
              command: ({ editor, range }) => {
                editor
                  .chain()
                  .focus()
                  .deleteRange(range)
                  .setHorizontalRule()
                  .run()
              },
            },
          ]

          // Filter based on search query
          return commands.filter((item) =>
            item.title.toLowerCase().includes(query.toLowerCase())
          )
        },
        render: () => {
          let reactRenderer: ReactRenderer
          let popup: any
          // Create a typed ref we can use later
          let commandListRef = createRef<CommandListRef>()

          return {
            onStart: (props: any) => {
              // Create new reference
              commandListRef = createRef<CommandListRef>()
              
              reactRenderer = new ReactRenderer(CommandList, {
                props: {
                  ...props,
                  ref: commandListRef,
                },
                editor: props.editor,
              })

              popup = tippy('body', {
                getReferenceClientRect: props.clientRect,
                appendTo: () => document.body,
                content: reactRenderer.element,
                showOnCreate: true,
                interactive: true,
                trigger: 'manual',
                placement: 'bottom-start',
              })
            },
            onUpdate(props: any) {
              reactRenderer.updateProps(props)

              popup[0].setProps({
                getReferenceClientRect: props.clientRect,
              })
            },
            onKeyDown(props: any) {
              if (props.event.key === 'Escape') {
                popup[0].hide()
                return true
              }
              
              // Use the typed ref to safely access onKeyDown
              if (commandListRef.current && commandListRef.current.onKeyDown) {
                return commandListRef.current.onKeyDown(props)
              }
              
              return false
            },
            onExit() {
              popup[0].destroy()
              reactRenderer.destroy()
            },
          }
        },
      }),
    ]
  },
})

export default SlashCommand
