/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useEffect, useState } from 'react'
import { useEditor, EditorContent, Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import YouTube from '@tiptap/extension-youtube'
import Link from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Placeholder from '@tiptap/extension-placeholder'
import Heading from '@tiptap/extension-heading'
import CodeBlock from '@tiptap/extension-code-block'
import Color from '@tiptap/extension-color'
import TextStyle from '@tiptap/extension-text-style'
import Highlight from '@tiptap/extension-highlight'
import SlashCommand from './SlashCommand'

import {
  Box,
  Button,
  Divider,
  IconButton,
  Paper,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Menu,
  MenuItem,
} from '@mui/material'
import { styled } from '@mui/material/styles'

// Icons
import FormatBoldIcon from '@mui/icons-material/FormatBold'
import FormatItalicIcon from '@mui/icons-material/FormatItalic'
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined'
import StrikethroughSIcon from '@mui/icons-material/StrikethroughS'
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted'
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered'
import FormatQuoteIcon from '@mui/icons-material/FormatQuote'
import CodeIcon from '@mui/icons-material/Code'
import TitleIcon from '@mui/icons-material/Title'
import InsertLinkIcon from '@mui/icons-material/InsertLink'
import ImageIcon from '@mui/icons-material/Image'
import YouTubeIcon from '@mui/icons-material/YouTube'
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft'
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter'
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight'
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify'
import FormatColorTextIcon from '@mui/icons-material/FormatColorText'
import HighlightIcon from '@mui/icons-material/Highlight'
import UndoIcon from '@mui/icons-material/Undo'
import RedoIcon from '@mui/icons-material/Redo'
import ClearIcon from '@mui/icons-material/Clear'

// Styled components
const EditorContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1),
  marginTop: theme.spacing(1),
  border: '1px solid #e0e0e0',
  borderRadius: '4px',
  background: '#fff',
}))

const MenuBar = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(0.5),
  marginBottom: theme.spacing(1),
  padding: theme.spacing(1),
  borderBottom: '1px solid #e0e0e0',
  backgroundColor: '#f5f5f5',
  borderRadius: '4px 4px 0 0',
}))

const GroupDivider = styled(Divider)(({ theme }) => ({
  margin: theme.spacing(0, 0.5),
}))

const StyledEditorContent = styled(EditorContent)(({ theme }) => ({
  '& .ProseMirror': {
    padding: theme.spacing(2),
    minHeight: '350px',
    maxHeight: '650px',
    overflow: 'auto',
    '&:focus': {
      outline: 'none',
    },
    '& p': {
      margin: '0 0 0.7em 0',
    },
    '& h1, & h2, & h3, & h4, & h5, & h6': {
      margin: '1em 0 0.5em',
    },
    '& ul, & ol': {
      padding: '0 0 0 1.2em',
    },
    '& blockquote': {
      borderLeft: '3px solid #ccc',
      paddingLeft: '1em',
      color: '#666',
      fontStyle: 'italic',
      margin: '1em 0',
    },
    '& pre': {
      backgroundColor: '#2d2d2d',
      color: '#ccc',
      fontFamily: 'monospace',
      padding: '0.7em 1em',
      borderRadius: '5px',
      overflow: 'auto',
    },
    '& img': {
      maxWidth: '100%',
      height: 'auto',
      display: 'block',
      margin: '1em 0',
    },
    '& a': {
      color: '#0077cc',
      textDecoration: 'underline',
    },
    '& .youtube-video': {
      width: '100%',
      height: 'auto',
      aspectRatio: '16/9',
      margin: '1em 0',
    },
  },
}))

interface TiptapEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

// Editor types
type EditorUpdateEvent = {
  editor: Editor
}

export default function TiptapEditor({
  value,
  onChange,
  placeholder = 'Write your content here...',
}: TiptapEditorProps) {
  // Dialog states
  const [linkDialogOpen, setLinkDialogOpen] = useState(false)
  const [imageDialogOpen, setImageDialogOpen] = useState(false)
  const [youtubeDialogOpen, setYoutubeDialogOpen] = useState(false)

  // Dialog form values
  const [linkUrl, setLinkUrl] = useState('')
  const [linkText, setLinkText] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [imageAlt, setImageAlt] = useState('')
  const [youtubeUrl, setYoutubeUrl] = useState('')

  // Color picker state
  const [colorMenuAnchorEl, setColorMenuAnchorEl] =
    useState<null | HTMLElement>(null)
  const [highlightMenuAnchorEl, setHighlightMenuAnchorEl] =
    useState<null | HTMLElement>(null)

  // Common colors for quick selection
  const commonColors = [
    '#000000',
    '#5C5C5C',
    '#616161',
    '#9E9E9E',
    '#B0B0B0',
    '#BDBDBD',
    '#E0E0E0',
    '#F5F5F5',
    '#FFFFFF',
    '#F44336',
    '#E91E63',
    '#9C27B0',
    '#673AB7',
    '#3F51B5',
    '#2196F3',
    '#03A9F4',
    '#00BCD4',
    '#009688',
    '#4CAF50',
    '#8BC34A',
    '#CDDC39',
    '#FFEB3B',
    '#FFC107',
    '#FF9800',
    '#FF5722',
    '#795548',
    '#607D8B',
  ]

  // Initialize the editor
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        inline: false,
        allowBase64: true,
      }),
      YouTube.configure({
        controls: true,
        nocookie: true,
      }),
      Link.configure({
        openOnClick: false,
        linkOnPaste: true,
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Placeholder.configure({
        placeholder,
      }),
      Heading.configure({
        levels: [1, 2, 3, 4, 5, 6],
      }),
      CodeBlock,
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      SlashCommand,
    ],
    content: value || '<p></p>',
    onUpdate: ({ editor }: EditorUpdateEvent) => {
      onChange(editor.getHTML())
    },
  })

  // Update editor content when value changes from outside
  useEffect(() => {
    if (editor && value && editor.getHTML() !== value) {
      editor.commands.setContent(value)
    }
  }, [editor, value])

  if (!editor) {
    return null
  }

  // Handle dialog actions
  const handleOpenLinkDialog = () => {
    const { from, to } = editor.state.selection
    const text = editor.state.doc.textBetween(from, to, '')
    setLinkText(text)
    setLinkUrl('')
    setLinkDialogOpen(true)
  }

  const handleAddLink = () => {
    if (linkUrl) {
      if (linkText) {
        editor
          .chain()
          .focus()
          .insertContent(`<a href="${linkUrl}" target="_blank">${linkText}</a>`)
          .run()
      } else {
        editor
          .chain()
          .focus()
          .setLink({ href: linkUrl, target: '_blank' })
          .run()
      }
    }
    setLinkDialogOpen(false)
  }

  const handleOpenImageDialog = () => {
    setImageUrl('')
    setImageAlt('')
    setImageDialogOpen(true)
  }

  const handleAddImage = () => {
    if (imageUrl) {
      editor.chain().focus().setImage({ src: imageUrl, alt: imageAlt }).run()
    }
    setImageDialogOpen(false)
  }

  const handleOpenYoutubeDialog = () => {
    setYoutubeUrl('')
    setYoutubeDialogOpen(true)
  }

  const handleAddYoutube = () => {
    if (youtubeUrl) {
      editor
        .chain()
        .focus()
        .setYoutubeVideo({
          src: youtubeUrl,
          width: 640,
          height: 480,
        })
        .run()
    }
    setYoutubeDialogOpen(false)
  }

  // Handle color menu
  const handleColorMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setColorMenuAnchorEl(event.currentTarget)
  }

  const handleColorMenuClose = () => {
    setColorMenuAnchorEl(null)
  }

  const handleColorSelect = (color: string) => {
    editor.chain().focus().setColor(color).run()
    handleColorMenuClose()
  }

  // Handle highlight menu
  const handleHighlightMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setHighlightMenuAnchorEl(event.currentTarget)
  }

  const handleHighlightMenuClose = () => {
    setHighlightMenuAnchorEl(null)
  }

  const handleHighlightSelect = (color: string) => {
    editor.chain().focus().setHighlight({ color }).run()
    handleHighlightMenuClose()
  }

  return (
    <EditorContainer elevation={0}>
      <MenuBar>
        {/* Text formatting */}
        <Tooltip title="Bold">
          <IconButton
            size="small"
            onClick={() => editor.chain().focus().toggleBold().run()}
            color={editor.isActive('bold') ? 'primary' : 'default'}
          >
            <FormatBoldIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Italic">
          <IconButton
            size="small"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            color={editor.isActive('italic') ? 'primary' : 'default'}
          >
            <FormatItalicIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Underline">
          <IconButton
            size="small"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            color={editor.isActive('underline') ? 'primary' : 'default'}
          >
            <FormatUnderlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Strikethrough">
          <IconButton
            size="small"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            color={editor.isActive('strike') ? 'primary' : 'default'}
          >
            <StrikethroughSIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Text Color">
          <IconButton
            size="small"
            onClick={handleColorMenuOpen}
            color={editor.isActive('textStyle') ? 'primary' : 'default'}
          >
            <FormatColorTextIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Highlight">
          <IconButton
            size="small"
            onClick={handleHighlightMenuOpen}
            color={editor.isActive('highlight') ? 'primary' : 'default'}
          >
            <HighlightIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <GroupDivider orientation="vertical" flexItem />

        {/* Paragraphs and lists */}
        <Tooltip title="Bullet List">
          <IconButton
            size="small"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            color={editor.isActive('bulletList') ? 'primary' : 'default'}
          >
            <FormatListBulletedIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Numbered List">
          <IconButton
            size="small"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            color={editor.isActive('orderedList') ? 'primary' : 'default'}
          >
            <FormatListNumberedIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Block Quote">
          <IconButton
            size="small"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            color={editor.isActive('blockquote') ? 'primary' : 'default'}
          >
            <FormatQuoteIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Code Block">
          <IconButton
            size="small"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            color={editor.isActive('codeBlock') ? 'primary' : 'default'}
          >
            <CodeIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <GroupDivider orientation="vertical" flexItem />

        {/* Headings */}
        <Tooltip title="Heading">
          <IconButton
            size="small"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            color={
              editor.isActive('heading', { level: 2 }) ? 'primary' : 'default'
            }
          >
            <TitleIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <GroupDivider orientation="vertical" flexItem />

        {/* Alignment */}
        <Tooltip title="Align Left">
          <IconButton
            size="small"
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            color={
              editor.isActive({ textAlign: 'left' }) ? 'primary' : 'default'
            }
          >
            <FormatAlignLeftIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Align Center">
          <IconButton
            size="small"
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            color={
              editor.isActive({ textAlign: 'center' }) ? 'primary' : 'default'
            }
          >
            <FormatAlignCenterIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Align Right">
          <IconButton
            size="small"
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            color={
              editor.isActive({ textAlign: 'right' }) ? 'primary' : 'default'
            }
          >
            <FormatAlignRightIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Justify">
          <IconButton
            size="small"
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            color={
              editor.isActive({ textAlign: 'justify' }) ? 'primary' : 'default'
            }
          >
            <FormatAlignJustifyIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <GroupDivider orientation="vertical" flexItem />

        {/* Links and media */}
        <Tooltip title="Insert Link">
          <IconButton
            size="small"
            onClick={handleOpenLinkDialog}
            color={editor.isActive('link') ? 'primary' : 'default'}
          >
            <InsertLinkIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Insert Image">
          <IconButton size="small" onClick={handleOpenImageDialog}>
            <ImageIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Insert YouTube Video">
          <IconButton size="small" onClick={handleOpenYoutubeDialog}>
            <YouTubeIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <GroupDivider orientation="vertical" flexItem />

        {/* History */}
        <Tooltip title="Undo">
          <span>
            <IconButton
              size="small"
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
            >
              <UndoIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>

        <Tooltip title="Redo">
          <span>
            <IconButton
              size="small"
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
            >
              <RedoIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>

        <GroupDivider orientation="vertical" flexItem />

        {/* Clear formatting */}
        <Tooltip title="Clear Formatting">
          <IconButton
            size="small"
            onClick={() =>
              editor.chain().focus().clearNodes().unsetAllMarks().run()
            }
          >
            <ClearIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </MenuBar>

      <StyledEditorContent editor={editor} />

      {/* Link Dialog */}
      <Dialog open={linkDialogOpen} onClose={() => setLinkDialogOpen(false)}>
        <DialogTitle>Insert Link</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Link URL"
            type="url"
            fullWidth
            variant="outlined"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Link Text (optional)"
            type="text"
            fullWidth
            variant="outlined"
            value={linkText}
            onChange={(e) => setLinkText(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLinkDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAddLink} variant="contained" color="primary">
            Add Link
          </Button>
        </DialogActions>
      </Dialog>

      {/* Image Dialog */}
      <Dialog open={imageDialogOpen} onClose={() => setImageDialogOpen(false)}>
        <DialogTitle>Insert Image</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Image URL"
            type="url"
            fullWidth
            variant="outlined"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Alt Text"
            type="text"
            fullWidth
            variant="outlined"
            value={imageAlt}
            onChange={(e) => setImageAlt(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setImageDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAddImage} variant="contained" color="primary">
            Add Image
          </Button>
        </DialogActions>
      </Dialog>

      {/* YouTube Dialog */}
      <Dialog
        open={youtubeDialogOpen}
        onClose={() => setYoutubeDialogOpen(false)}
      >
        <DialogTitle>Insert YouTube Video</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="YouTube URL"
            type="url"
            fullWidth
            variant="outlined"
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            helperText="Example: https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setYoutubeDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleAddYoutube}
            variant="contained"
            color="primary"
          >
            Add Video
          </Button>
        </DialogActions>
      </Dialog>

      {/* Color Menu */}
      <Menu
        anchorEl={colorMenuAnchorEl}
        open={Boolean(colorMenuAnchorEl)}
        onClose={handleColorMenuClose}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(9, 1fr)',
            gap: 0.5,
            p: 1,
            width: 300,
          }}
        >
          {commonColors.map((color) => (
            <Box
              key={color}
              sx={{
                width: 20,
                height: 20,
                backgroundColor: color,
                border: '1px solid #ccc',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'scale(1.2)',
                },
              }}
              onClick={() => handleColorSelect(color)}
            />
          ))}
        </Box>
      </Menu>

      {/* Highlight Menu */}
      <Menu
        anchorEl={highlightMenuAnchorEl}
        open={Boolean(highlightMenuAnchorEl)}
        onClose={handleHighlightMenuClose}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: 0.5,
            p: 1,
            width: 180,
          }}
        >
          {[
            '#FFFF00',
            '#00FF00',
            '#FF00FF',
            '#00FFFF',
            '#FFA500',
            '#FFD700',
            '#98FB98',
            '#FF6347',
            '#87CEFA',
            '#ADFF2F',
          ].map((color) => (
            <Box
              key={color}
              sx={{
                width: 25,
                height: 25,
                backgroundColor: color,
                border: '1px solid #ccc',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'scale(1.2)',
                },
              }}
              onClick={() => handleHighlightSelect(color)}
            />
          ))}
        </Box>
        <MenuItem
          onClick={() => {
            editor.chain().focus().unsetHighlight().run()
            handleHighlightMenuClose()
          }}
        >
          Remove highlight
        </MenuItem>
      </Menu>
    </EditorContainer>
  )
}
