'use client'
import React, { useState, useEffect, useRef } from 'react'
import { useForm, Controller, SubmitHandler } from 'react-hook-form'
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  FormControlLabel,
  Switch,
  Card,
  CardMedia,
  IconButton,
  CircularProgress,
  Alert,
  Snackbar,
  Divider,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormHelperText,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import DeleteIcon from '@mui/icons-material/Delete'
import ImageIcon from '@mui/icons-material/Image'
import VideocamIcon from '@mui/icons-material/Videocam'
import AudioFileIcon from '@mui/icons-material/AudioFile'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'
import FormatBoldIcon from '@mui/icons-material/FormatBold'
import FormatItalicIcon from '@mui/icons-material/FormatItalic'
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined'
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted'
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered'
import FormatQuoteIcon from '@mui/icons-material/FormatQuote'
import TitleIcon from '@mui/icons-material/Title'
import { useCategoryStore } from '@/store/categoriesStore'

// Create a client-only wrapper component
function ClientOnly({ children }: { children: React.ReactNode }) {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  if (!hasMounted) {
    return null
  }

  return <>{children}</>
}

// Simple rich text editor component using textarea
function SimpleRichTextEditor({
  value,
  onChange,
  style,
}: {
  value: string
  onChange: (content: string) => void
  style?: React.CSSProperties
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [imageDialogOpen, setImageDialogOpen] = useState(false)
  const [videoDialogOpen, setVideoDialogOpen] = useState(false)
  const [mediaUrl, setMediaUrl] = useState('')
  const [mediaAlt, setMediaAlt] = useState('')

  const insertFormatting = (startTag: string, endTag: string = '') => {
    if (!textareaRef.current) return

    const textarea = textareaRef.current
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = textarea.value.substring(start, end)
    const beforeText = textarea.value.substring(0, start)
    const afterText = textarea.value.substring(end)

    // If no text is selected, just insert the tags at cursor position
    if (start === end) {
      const newText = beforeText + startTag + endTag + afterText
      onChange(newText)

      // Set cursor position between tags
      setTimeout(() => {
        textarea.focus()
        textarea.selectionStart = start + startTag.length
        textarea.selectionEnd = start + startTag.length
      }, 0)
    } else {
      // Wrap selected text with tags
      const newText =
        beforeText + startTag + selectedText + (endTag || startTag) + afterText
      onChange(newText)

      // Keep the same text selected after formatting
      setTimeout(() => {
        textarea.focus()
        textarea.selectionStart = start + startTag.length
        textarea.selectionEnd = start + startTag.length + selectedText.length
      }, 0)
    }
  }

  const handleBold = () => insertFormatting('**', '**')
  const handleItalic = () => insertFormatting('*', '*')
  const handleUnderline = () => insertFormatting('<u>', '</u>')
  const handleHeading = () => insertFormatting('# ')
  const handleQuote = () => insertFormatting('> ')
  const handleBulletList = () => insertFormatting('- ')
  const handleNumberList = () => insertFormatting('1. ')

  // Handle image insertion
  const handleOpenImageDialog = () => {
    setMediaUrl('')
    setMediaAlt('')
    setImageDialogOpen(true)
  }

  const handleInsertImage = () => {
    if (mediaUrl) {
      const imageMarkdown = `![${mediaAlt || 'Image'}](${mediaUrl})`
      if (textareaRef.current) {
        const textarea = textareaRef.current
        const start = textarea.selectionStart
        const beforeText = textarea.value.substring(0, start)
        const afterText = textarea.value.substring(start)

        const newText = beforeText + imageMarkdown + afterText
        onChange(newText)

        // Set cursor position after the inserted image
        setTimeout(() => {
          textarea.focus()
          const newPosition = start + imageMarkdown.length
          textarea.selectionStart = newPosition
          textarea.selectionEnd = newPosition
        }, 0)
      }
    }
    setImageDialogOpen(false)
  }

  // Handle video insertion
  const handleOpenVideoDialog = () => {
    setMediaUrl('')
    setVideoDialogOpen(true)
  }

  const handleInsertVideo = () => {
    if (mediaUrl) {
      // For YouTube videos, convert standard URL to embed URL if needed
      let embedUrl = mediaUrl
      const youtubeRegex =
        /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?([^&\s]+)/
      const match = mediaUrl.match(youtubeRegex)

      if (match && match[1]) {
        embedUrl = `https://www.youtube.com/embed/${match[1]}`
      }

      const videoHtml = `<div class="video-container"><iframe width="560" height="315" src="${embedUrl}" frameborder="0" allowfullscreen></iframe></div>`

      if (textareaRef.current) {
        const textarea = textareaRef.current
        const start = textarea.selectionStart
        const beforeText = textarea.value.substring(0, start)
        const afterText = textarea.value.substring(start)

        const newText = beforeText + videoHtml + afterText
        onChange(newText)

        // Set cursor position after the inserted video
        setTimeout(() => {
          textarea.focus()
          const newPosition = start + videoHtml.length
          textarea.selectionStart = newPosition
          textarea.selectionEnd = newPosition
        }, 0)
      }
    }
    setVideoDialogOpen(false)
  }

  return (
    <>
      <Box sx={{ border: '1px solid #ccc', borderRadius: '4px', ...style }}>
        <Box
          sx={{ p: 1, display: 'flex', gap: 1, borderBottom: '1px solid #eee' }}
        >
          <Tooltip title="Bold">
            <IconButton size="small" onClick={handleBold}>
              <FormatBoldIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Italic">
            <IconButton size="small" onClick={handleItalic}>
              <FormatItalicIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Underline">
            <IconButton size="small" onClick={handleUnderline}>
              <FormatUnderlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Divider orientation="vertical" flexItem />
          <Tooltip title="Heading">
            <IconButton size="small" onClick={handleHeading}>
              <TitleIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Quote">
            <IconButton size="small" onClick={handleQuote}>
              <FormatQuoteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Divider orientation="vertical" flexItem />
          <Tooltip title="Bullet List">
            <IconButton size="small" onClick={handleBulletList}>
              <FormatListBulletedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Numbered List">
            <IconButton size="small" onClick={handleNumberList}>
              <FormatListNumberedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Divider orientation="vertical" flexItem />
          <Tooltip title="Insert Image">
            <IconButton size="small" onClick={handleOpenImageDialog}>
              <ImageIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Insert Video">
            <IconButton size="small" onClick={handleOpenVideoDialog}>
              <VideocamIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
        <TextField
          multiline
          fullWidth
          minRows={10}
          maxRows={20}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          inputRef={textareaRef}
          variant="outlined"
          InputProps={{
            sx: {
              p: 2,
              fontFamily: 'monospace',
              fontSize: '14px',
              '& fieldset': { border: 'none' },
            },
          }}
          placeholder="Enter content here. Use the toolbar for formatting or use markdown syntax directly."
        />
        <Box sx={{ p: 1, borderTop: '1px solid #eee', bgcolor: '#f9f9f9' }}>
          <Typography variant="caption" color="text.secondary">
            You can use Markdown syntax: **bold**, *italic*, # heading, quote, -
            bullet list, 1. numbered list
          </Typography>
        </Box>
      </Box>

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
            value={mediaUrl}
            onChange={(e) => setMediaUrl(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Alt Text (Description)"
            type="text"
            fullWidth
            variant="outlined"
            value={mediaAlt}
            onChange={(e) => setMediaAlt(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setImageDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleInsertImage}
            variant="contained"
            color="primary"
          >
            Insert
          </Button>
        </DialogActions>
      </Dialog>

      {/* Video Dialog */}
      <Dialog open={videoDialogOpen} onClose={() => setVideoDialogOpen(false)}>
        <DialogTitle>Insert Video</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Video URL (YouTube, Vimeo, etc.)"
            type="url"
            fullWidth
            variant="outlined"
            value={mediaUrl}
            onChange={(e) => setMediaUrl(e.target.value)}
            helperText="Paste a YouTube or other video URL"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setVideoDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleInsertVideo}
            variant="contained"
            color="primary"
          >
            Insert
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

// Custom styled components
const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
})

const StyledCard = styled(Card)(({ theme }) => ({
  position: 'relative',
  height: 150,
  width: '100%',
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  '&:hover .media-actions': {
    opacity: 1,
  },
}))

const MediaActions = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  background: 'rgba(0, 0, 0, 0.6)',
  display: 'flex',
  justifyContent: 'center',
  padding: theme.spacing(1),
  opacity: 0,
  transition: 'opacity 0.3s ease',
}))

const FileTypeIcon = styled(Box)(() => ({
  position: 'absolute',
  top: 8,
  right: 8,
  background: 'rgba(0, 0, 0, 0.6)',
  borderRadius: '50%',
  padding: 4,
  color: 'white',
}))

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
}))

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  marginBottom: theme.spacing(2),
  color: theme.palette.text.primary,
  position: 'relative',
  '&:after': {
    content: '""',
    position: 'absolute',
    bottom: -8,
    left: 0,
    width: 40,
    height: 3,
    backgroundColor: '#00141A',
  },
}))

// Helper function to get file type icon
const getFileTypeIcon = (file: File) => {
  const type = file.type.split('/')[0]

  switch (type) {
    case 'image':
      return <ImageIcon />
    case 'video':
      return <VideocamIcon />
    case 'audio':
      return <AudioFileIcon />
    default:
      return <InsertDriveFileIcon />
  }
}

// Define the form data type
interface NewsFormData {
  title: string
  description: string
  content: string
  category: string
  newsStatus: string
  isTreanding: boolean
  coverFiles: File[]
  coverPreviews: string[]
  newsImageFiles: File[]
  newsImagePreviews: string[]
}

// Main component
export default function AddNewsPage() {
  // Get categories from store
  const { categories, fetchCategories } = useCategoryStore()

  // Form state with React Hook Form
  const { 
    control, 
    handleSubmit, 
    setValue, 
    watch, 
    formState: { errors } 
  } = useForm<NewsFormData>({
    defaultValues: {
      title: '',
      description: '',
      content: '',
      category: '',
      newsStatus: 'draft',
      isTreanding: false,
      coverFiles: [],
      coverPreviews: [],
      newsImageFiles: [],
      newsImagePreviews: [],
    }
  })

  // Watch form values
  const watchTitle = watch('title')
  const watchContent = watch('content')

  // State for UI
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Fetch categories on mount
  useEffect(() => {
    fetchCategories('bn')
  }, [fetchCategories])

  // Handle thumbnail upload
  const handleThumbnailUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0]
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          setValue('coverFiles', [file])
          setValue('coverPreviews', [e.target.result as string])
        }
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle thumbnail removal
  const handleRemoveThumbnail = () => {
    setValue('coverFiles', [])
    setValue('coverPreviews', [])
  }

  // Handle attachment upload
  const handleAttachmentUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files)
      const currentAttachments = watch('newsImageFiles') || []
      const currentPreviews = watch('newsImagePreviews') || []

      files.forEach((file) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          if (e.target?.result) {
            // Determine file type
            let fileType = 'file'
            if (file.type.startsWith('image/')) fileType = 'image'
            else if (file.type.startsWith('video/')) fileType = 'video'
            else if (file.type.startsWith('audio/')) fileType = 'audio'

            // Add to attachments
            setValue('newsImageFiles', [...currentAttachments, file])
            
            // Add to previews
            setValue('newsImagePreviews', [
              ...currentPreviews,
              e.target.result as string,
            ])
          }
        }
        reader.readAsDataURL(file)
      })
    }
  }

  // Handle attachment removal
  const handleRemoveAttachment = (index: number) => {
    const currentAttachments = watch('newsImageFiles') || []
    const currentPreviews = watch('newsImagePreviews') || []

    setValue(
      'newsImageFiles',
      currentAttachments.filter((_, i) => i !== index)
    )
    setValue(
      'newsImagePreviews',
      currentPreviews.filter((_, i) => i !== index)
    )
  }

  // Handle editor content change
  const handleEditorChange = (content: string) => {
    setValue('content', content)
  }

  // Form submission handler
  const onSubmit: SubmitHandler<NewsFormData> = async (data) => {
    setIsSubmitting(true)
    
    try {
      // Log form data to console
      console.log('Form submitted with data:', data)
      
      // Here you would normally send the data to your API
      // For now, we'll just simulate a successful submission
      
      // Show success message
      setSnackbar({
        open: true,
        message: 'News article saved successfully!',
        severity: 'success',
      })
      
      // Reset form or redirect as needed
      // resetForm()
    } catch (error) {
      console.error('Error submitting form:', error)
      setSnackbar({
        open: true,
        message: 'Error saving news article. Please try again.',
        severity: 'error',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle snackbar close
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  // Styled components
  const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3),
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
  }))

  const SectionTitle = styled(Typography)(({ theme }) => ({
    marginBottom: theme.spacing(2),
    fontWeight: 600,
    color: theme.palette.primary.main,
    borderBottom: `1px solid ${theme.palette.divider}`,
    paddingBottom: theme.spacing(1),
  }))

  const AttachmentPreview = styled(Card)(({ theme }) => ({
    position: 'relative',
    marginBottom: theme.spacing(2),
    borderRadius: '8px',
    overflow: 'hidden',
  }))

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Add News Article
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          {/* Main content column */}
          <Grid item xs={12} md={8}>
            <StyledPaper elevation={0}>
              <SectionTitle variant="h6">Basic Information</SectionTitle>
              
              {/* Title */}
              <Controller
                name="title"
                control={control}
                rules={{ required: 'Title is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Title"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    error={!!errors.title}
                    helperText={errors.title?.message}
                  />
                )}
              />
              
              {/* Description */}
              <Controller
                name="description"
                control={control}
                rules={{ required: 'Description is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Description"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={3}
                    margin="normal"
                    error={!!errors.description}
                    helperText={errors.description?.message || 'Brief description of the article'}
                  />
                )}
              />
            </StyledPaper>

            <StyledPaper elevation={0}>
              <SectionTitle variant="h6">Article Content</SectionTitle>
              <Box sx={{ mt: 3, mb: 3 }}>
                <Controller
                  name="content"
                  control={control}
                  rules={{ required: 'Content is required' }}
                  render={({ field }) => (
                    <>
                      <SimpleRichTextEditor
                        value={field.value}
                        onChange={handleEditorChange}
                        style={{ height: '300px', marginBottom: '8px' }}
                      />
                      {errors.content && (
                        <FormHelperText error>{errors.content.message}</FormHelperText>
                      )}
                    </>
                  )}
                />
              </Box>
            </StyledPaper>
          </Grid>

          {/* Sidebar column */}
          <Grid item xs={12} md={4}>
            <StyledPaper elevation={0}>
              <SectionTitle variant="h6">Publishing Options</SectionTitle>
              
              {/* Category */}
              <Controller
                name="category"
                control={control}
                rules={{ required: 'Category is required' }}
                render={({ field }) => (
                  <FormControl fullWidth margin="normal" error={!!errors.category}>
                    <InputLabel id="category-label">Category</InputLabel>
                    <Select
                      {...field}
                      labelId="category-label"
                      label="Category"
                    >
                      {categories.map((category) => (
                        <MenuItem
                          key={category.documentId}
                          value={category.documentId}
                        >
                          {category.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.category && (
                      <FormHelperText>{errors.category.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
              
              {/* News Status */}
              <Controller
                name="newsStatus"
                control={control}
                rules={{ required: 'News Status is required' }}
                render={({ field }) => (
                  <FormControl fullWidth margin="normal" error={!!errors.newsStatus}>
                    <InputLabel id="news-status-label">News Status</InputLabel>
                    <Select
                      {...field}
                      labelId="news-status-label"
                      label="News Status"
                    >
                      <MenuItem value="draft">Draft</MenuItem>
                      <MenuItem value="submitted">Submitted</MenuItem>
                      <MenuItem value="approved">Approved</MenuItem>
                      <MenuItem value="rejected">Rejected</MenuItem>
                    </Select>
                    {errors.newsStatus && (
                      <FormHelperText>{errors.newsStatus.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
              
              {/* Trending */}
              <Controller
                name="isTreanding"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Switch
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                    }
                    label="Mark as Trending"
                    sx={{ mt: 2 }}
                  />
                )}
              />
            </StyledPaper>

            <StyledPaper elevation={0}>
              <SectionTitle variant="h6">Cover Media</SectionTitle>
              <Box sx={{ mt: 2, mb: 2 }}>
                <Controller
                  name="coverPreviews"
                  control={control}
                  render={({ field }) => (
                    <>
                      {field.value && field.value.length > 0 ? (
                        <Box sx={{ position: 'relative', mb: 2 }}>
                          <Card>
                            <CardMedia
                              component="img"
                              height="200"
                              image={field.value[0]}
                              alt="Thumbnail preview"
                            />
                            <IconButton
                              sx={{
                                position: 'absolute',
                                top: 8,
                                right: 8,
                                bgcolor: 'rgba(0,0,0,0.5)',
                                color: 'white',
                                '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
                              }}
                              onClick={handleRemoveThumbnail}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Card>
                        </Box>
                      ) : (
                        <Button
                          component="label"
                          variant="outlined"
                          startIcon={<CloudUploadIcon />}
                          fullWidth
                          sx={{ mb: 2 }}
                        >
                          Upload Thumbnail
                          <VisuallyHiddenInput
                            type="file"
                            accept="image/*"
                            onChange={handleThumbnailUpload}
                          />
                        </Button>
                      )}
                    </>
                  )}
                />
                <Controller
                  name="coverFiles"
                  control={control}
                  rules={{ required: 'Cover image is required' }}
                  render={({ field }) => (
                    <>
                      {errors.coverFiles && (
                        <FormHelperText error>{errors.coverFiles.message}</FormHelperText>
                      )}
                    </>
                  )}
                />
              </Box>
            </StyledPaper>

            <StyledPaper elevation={0}>
              <SectionTitle variant="h6">Additional Media</SectionTitle>
              <Button
                component="label"
                variant="outlined"
                startIcon={<CloudUploadIcon />}
                fullWidth
                sx={{ mb: 2 }}
              >
                Upload Additional Media
                <VisuallyHiddenInput
                  type="file"
                  multiple
                  onChange={handleAttachmentUpload}
                />
              </Button>

              <Controller
                name="newsImagePreviews"
                control={control}
                render={({ field }) => (
                  <Box>
                    {field.value && field.value.map((attachment, index) => (
                      <AttachmentPreview key={index}>
                        <CardMedia
                          component="img"
                          height="120"
                          image={attachment}
                          alt={`Attachment ${index + 1}`}
                        />
                        <IconButton
                          sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            bgcolor: 'rgba(0,0,0,0.5)',
                            color: 'white',
                            '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
                          }}
                          onClick={() => handleRemoveAttachment(index)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </AttachmentPreview>
                    ))}
                  </Box>
                )}
              />
            </StyledPaper>

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
              <Button variant="outlined">Cancel</Button>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <CircularProgress size={24} sx={{ mr: 1 }} />
                    Saving...
                  </>
                ) : (
                  'Save Article'
                )}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}
