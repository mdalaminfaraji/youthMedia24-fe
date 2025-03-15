'use client'

import React, { useState, useRef } from 'react'
import {
  Box,
  IconButton,
  Tooltip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@mui/material'
import FormatBoldIcon from '@mui/icons-material/FormatBold'
import FormatItalicIcon from '@mui/icons-material/FormatItalic'
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined'
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted'
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered'
import FormatQuoteIcon from '@mui/icons-material/FormatQuote'
import TitleIcon from '@mui/icons-material/Title'
import ImageIcon from '@mui/icons-material/Image'
import VideocamIcon from '@mui/icons-material/Videocam'

interface SimpleRichTextEditorProps {
  value: string
  onChange: (content: string) => void
  placeholder?: string
}

/**
 * A lightweight rich text editor component that uses a native textarea
 * for optimal performance with React Hook Form
 */
export default function SimpleRichTextEditor({
  value,
  onChange,
  placeholder = 'Write your content here...',
}: SimpleRichTextEditorProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [dialogType, setDialogType] = useState<'image' | 'video'>('image')
  const [mediaUrl, setMediaUrl] = useState('')
  const [altText, setAltText] = useState('')
  const editorRef = useRef<HTMLTextAreaElement>(null)

  /**
   * Applies formatting to selected text or at cursor position
   */
  const handleFormat = (format: string) => {
    if (!editorRef.current) return
    
    const textarea = editorRef.current
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = textarea.value.substring(start, end)
    const beforeText = textarea.value.substring(0, start)
    const afterText = textarea.value.substring(end)
    
    let newText
    let newCursorPos
    
    if (selectedText) {
      // Format selected text
      newText = beforeText + format + selectedText + format + afterText
      newCursorPos = end + format.length * 2
    } else {
      // Insert format at cursor
      newText = beforeText + format + format + afterText
      newCursorPos = start + format.length
    }
    
    onChange(newText)
    
    // Set cursor position after update
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(newCursorPos, newCursorPos)
    }, 0)
  }

  /**
   * Applies line-based formatting (lists, headings, etc.)
   */
  const handleLineFormat = (prefix: string) => {
    if (!editorRef.current) return
    
    const textarea = editorRef.current
    const start = textarea.selectionStart
    const beforeText = textarea.value.substring(0, start)
    const afterText = textarea.value.substring(start)
    
    // Find the start of the current line
    const lastNewline = beforeText.lastIndexOf('\n')
    const lineStart = lastNewline === -1 ? 0 : lastNewline + 1
    
    // Insert prefix at the beginning of the line
    const newText = beforeText.substring(0, lineStart) + 
                    prefix + 
                    beforeText.substring(lineStart) + 
                    afterText
    
    onChange(newText)
    
    // Set cursor position after the prefix
    const newCursorPos = start + prefix.length
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(newCursorPos, newCursorPos)
    }, 0)
  }

  /**
   * Opens dialog for inserting media
   */
  const openMediaDialog = (type: 'image' | 'video') => {
    setDialogType(type)
    setMediaUrl('')
    setAltText('')
    setIsDialogOpen(true)
  }

  /**
   * Inserts media at cursor position
   */
  const insertMedia = () => {
    if (!mediaUrl || !editorRef.current) return
    
    const textarea = editorRef.current
    const start = textarea.selectionStart
    const beforeText = textarea.value.substring(0, start)
    const afterText = textarea.value.substring(start)
    
    let mediaCode = ''
    
    if (dialogType === 'image') {
      mediaCode = `![${altText || 'Image'}](${mediaUrl})`
    } else {
      // Convert YouTube URLs to embed format
      let embedUrl = mediaUrl
      const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?([^&\s]+)/
      const match = mediaUrl.match(youtubeRegex)
      
      if (match && match[1]) {
        embedUrl = `https://www.youtube.com/embed/${match[1]}`
      }
      
      mediaCode = `<iframe width="560" height="315" src="${embedUrl}" frameborder="0" allowfullscreen></iframe>`
    }
    
    const newText = beforeText + mediaCode + afterText
    onChange(newText)
    
    // Set cursor position after the inserted media
    const newCursorPos = start + mediaCode.length
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(newCursorPos, newCursorPos)
    }, 0)
    
    setIsDialogOpen(false)
  }

  return (
    <Box sx={{ border: '1px solid #ddd', borderRadius: '4px' }}>
      {/* Toolbar */}
      <Box sx={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: 0.5, 
        p: 1, 
        borderBottom: '1px solid #eee',
        bgcolor: '#f8f9fa'
      }}>
        <Tooltip title="Bold">
          <IconButton size="small" onClick={() => handleFormat('**')}>
            <FormatBoldIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Italic">
          <IconButton size="small" onClick={() => handleFormat('*')}>
            <FormatItalicIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Underline">
          <IconButton size="small" onClick={() => handleFormat('__')}>
            <FormatUnderlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Divider orientation="vertical" flexItem />
        <Tooltip title="Heading 1">
          <IconButton size="small" onClick={() => handleLineFormat('# ')}>
            <TitleIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Heading 2">
          <IconButton size="small" onClick={() => handleLineFormat('## ')}>
            <TitleIcon fontSize="small" sx={{ transform: 'scale(0.85)' }} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Quote">
          <IconButton size="small" onClick={() => handleLineFormat('> ')}>
            <FormatQuoteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Divider orientation="vertical" flexItem />
        <Tooltip title="Bullet List">
          <IconButton size="small" onClick={() => handleLineFormat('- ')}>
            <FormatListBulletedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Numbered List">
          <IconButton size="small" onClick={() => handleLineFormat('1. ')}>
            <FormatListNumberedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Divider orientation="vertical" flexItem />
        <Tooltip title="Insert Image">
          <IconButton size="small" onClick={() => openMediaDialog('image')}>
            <ImageIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Insert Video">
          <IconButton size="small" onClick={() => openMediaDialog('video')}>
            <VideocamIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
      
      {/* Editor */}
      <Box sx={{ p: 1 }}>
        <textarea
          ref={editorRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: '100%',
            minHeight: '300px',
            padding: '12px',
            fontFamily: 'inherit',
            fontSize: '16px',
            lineHeight: '1.5',
            border: 'none',
            outline: 'none',
            resize: 'vertical',
          }}
          placeholder={placeholder}
        />
      </Box>
      
      {/* Media Dialog */}
      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogTitle>
          {dialogType === 'image' ? 'Insert Image' : 'Insert Video'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label={dialogType === 'image' ? 'Image URL' : 'Video URL'}
            type="url"
            fullWidth
            value={mediaUrl}
            onChange={(e) => setMediaUrl(e.target.value)}
            sx={{ mb: 2 }}
          />
          {dialogType === 'image' && (
            <TextField
              margin="dense"
              label="Alt Text"
              fullWidth
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>
          <Button onClick={insertMedia} variant="contained" color="primary">
            Insert
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
