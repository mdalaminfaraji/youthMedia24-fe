'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useForm, Controller } from 'react-hook-form'
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
import FormatBoldIcon from '@mui/icons-material/FormatBold'
import FormatItalicIcon from '@mui/icons-material/FormatItalic'
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined'
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted'
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered'
import FormatQuoteIcon from '@mui/icons-material/FormatQuote'
import TitleIcon from '@mui/icons-material/Title'
import { useCategoryStore } from '@/store/categoriesStore'

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

const MediaPreview = styled(Card)(({ theme }) => ({
  position: 'relative',
  marginBottom: theme.spacing(2),
  borderRadius: '8px',
  overflow: 'hidden',
}))

// Form data type
interface NewsFormData {
  title: string;
  description: string;
  content: string;
  category: string;
  newsStatus: string;
  isTreanding: boolean;
  coverFiles: FileList | null;
  newsImageFiles: FileList | null;
}

// Editor component
const TextEditor = ({ value, onChange }: { value: string; onChange: (value: string) => void }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<'image' | 'video'>('image');
  const [mediaUrl, setMediaUrl] = useState('');
  const [altText, setAltText] = useState('');
  const editorRef = useRef<HTMLTextAreaElement>(null);

  const handleFormat = (format: string) => {
    if (!editorRef.current) return;
    
    const textarea = editorRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    const beforeText = textarea.value.substring(0, start);
    const afterText = textarea.value.substring(end);
    
    let newText;
    let newCursorPos;
    
    if (selectedText) {
      // Format selected text
      newText = beforeText + format + selectedText + format + afterText;
      newCursorPos = end + format.length * 2;
    } else {
      // Insert format at cursor
      newText = beforeText + format + format + afterText;
      newCursorPos = start + format.length;
    }
    
    onChange(newText);
    
    // Set cursor position after update
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const handleLineFormat = (prefix: string) => {
    if (!editorRef.current) return;
    
    const textarea = editorRef.current;
    const start = textarea.selectionStart;
    const beforeText = textarea.value.substring(0, start);
    const afterText = textarea.value.substring(start);
    
    // Find the start of the current line
    const lastNewline = beforeText.lastIndexOf('\n');
    const lineStart = lastNewline === -1 ? 0 : lastNewline + 1;
    
    // Insert prefix at the beginning of the line
    const newText = beforeText.substring(0, lineStart) + 
                    prefix + 
                    beforeText.substring(lineStart) + 
                    afterText;
    
    onChange(newText);
    
    // Set cursor position after the prefix
    const newCursorPos = start + prefix.length;
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const openMediaDialog = (type: 'image' | 'video') => {
    setDialogType(type);
    setMediaUrl('');
    setAltText('');
    setIsDialogOpen(true);
  };

  const insertMedia = () => {
    if (!mediaUrl || !editorRef.current) return;
    
    const textarea = editorRef.current;
    const start = textarea.selectionStart;
    const beforeText = textarea.value.substring(0, start);
    const afterText = textarea.value.substring(start);
    
    let mediaCode = '';
    
    if (dialogType === 'image') {
      mediaCode = `![${altText || 'Image'}](${mediaUrl})`;
    } else {
      // Convert YouTube URLs to embed format
      let embedUrl = mediaUrl;
      const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?([^&\s]+)/;
      const match = mediaUrl.match(youtubeRegex);
      
      if (match && match[1]) {
        embedUrl = `https://www.youtube.com/embed/${match[1]}`;
      }
      
      mediaCode = `<iframe width="560" height="315" src="${embedUrl}" frameborder="0" allowfullscreen></iframe>`;
    }
    
    const newText = beforeText + mediaCode + afterText;
    onChange(newText);
    
    // Set cursor position after the inserted media
    const newCursorPos = start + mediaCode.length;
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
    
    setIsDialogOpen(false);
  };

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
          placeholder="Write your content here..."
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
  );
};

// Main component
export default function AddNewsPage() {
  // State
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [newsImagePreviews, setNewsImagePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });
  
  // Get categories from store
  const { categories, fetchCategories } = useCategoryStore();
  
  // Initialize React Hook Form
  const { 
    control, 
    handleSubmit, 
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm<NewsFormData>({
    defaultValues: {
      title: '',
      description: '',
      content: '',
      category: '',
      newsStatus: 'draft',
      isTreanding: false,
      coverFiles: null,
      newsImageFiles: null
    }
  });
  
  // Watch for file changes
  const coverFiles = watch('coverFiles');
  const newsImageFiles = watch('newsImageFiles');
  
  // Fetch categories on mount
  useEffect(() => {
    fetchCategories('bn');
  }, [fetchCategories]);
  
  // Update cover preview when file changes
  useEffect(() => {
    if (coverFiles && coverFiles.length > 0) {
      const file = coverFiles[0];
      const reader = new FileReader();
      
      reader.onload = (e) => {
        setCoverPreview(e.target?.result as string);
      };
      
      reader.readAsDataURL(file);
    } else {
      setCoverPreview(null);
    }
  }, [coverFiles]);
  
  // Update news image previews when files change
  useEffect(() => {
    if (newsImageFiles && newsImageFiles.length > 0) {
      const previews: string[] = [];
      const files = Array.from(newsImageFiles);
      
      files.forEach(file => {
        const reader = new FileReader();
        
        reader.onload = (e) => {
          if (e.target?.result) {
            previews.push(e.target.result as string);
            if (previews.length === files.length) {
              setNewsImagePreviews([...previews]);
            }
          }
        };
        
        reader.readAsDataURL(file);
      });
    } else {
      setNewsImagePreviews([]);
    }
  }, [newsImageFiles]);
  
  // Handle cover removal
  const handleRemoveCover = () => {
    setValue('coverFiles', null);
    setCoverPreview(null);
  };
  
  // Form submission handler
  const onSubmit = async (data: NewsFormData) => {
    setIsSubmitting(true);
    
    try {
      // Log form data to console for testing
      console.log('Form submitted:', data);
      
      // Here you would normally send the data to your API
      // For example:
      // const formData = new FormData();
      // formData.append('title', data.title);
      // formData.append('description', data.description);
      // formData.append('content', data.content);
      // formData.append('category', data.category);
      // formData.append('newsStatus', data.newsStatus);
      // formData.append('isTreanding', String(data.isTreanding));
      
      // if (data.coverFiles && data.coverFiles.length > 0) {
      //   formData.append('cover', data.coverFiles[0]);
      // }
      
      // if (data.newsImageFiles) {
      //   Array.from(data.newsImageFiles).forEach(file => {
      //     formData.append('newsImages', file);
      //   });
      // }
      
      // const response = await fetch('/api/news', {
      //   method: 'POST',
      //   body: formData
      // });
      
      // if (!response.ok) throw new Error('Failed to submit news');
      
      // Success notification
      setSnackbar({
        open: true,
        message: 'News article saved successfully!',
        severity: 'success',
      });
      
      // Reset form
      reset();
      setCoverPreview(null);
      setNewsImagePreviews([]);
      
    } catch (error) {
      console.error('Error submitting form:', error);
      setSnackbar({
        open: true,
        message: 'Error saving news article. Please try again.',
        severity: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Add News Article
      </Typography>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          {/* Main content column */}
          <Grid item xs={12} md={8}>
            <StyledPaper>
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
                    fullWidth
                    multiline
                    rows={3}
                    margin="normal"
                    error={!!errors.description}
                    helperText={errors.description?.message}
                  />
                )}
              />
            </StyledPaper>
            
            <StyledPaper>
              <SectionTitle variant="h6">Article Content</SectionTitle>
              
              {/* Content Editor */}
              <Controller
                name="content"
                control={control}
                rules={{ required: 'Content is required' }}
                render={({ field }) => (
                  <>
                    <TextEditor 
                      value={field.value} 
                      onChange={field.onChange} 
                    />
                    {errors.content && (
                      <FormHelperText error sx={{ mt: 1 }}>
                        {errors.content.message}
                      </FormHelperText>
                    )}
                  </>
                )}
              />
            </StyledPaper>
          </Grid>
          
          {/* Sidebar column */}
          <Grid item xs={12} md={4}>
            <StyledPaper>
              <SectionTitle variant="h6">Publishing Options</SectionTitle>
              
              {/* Category */}
              <Controller
                name="category"
                control={control}
                rules={{ required: 'Category is required' }}
                render={({ field }) => (
                  <FormControl 
                    fullWidth 
                    margin="normal"
                    error={!!errors.category}
                  >
                    <InputLabel>Category</InputLabel>
                    <Select
                      {...field}
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
              
              {/* Status */}
              <Controller
                name="newsStatus"
                control={control}
                rules={{ required: 'Status is required' }}
                render={({ field }) => (
                  <FormControl 
                    fullWidth 
                    margin="normal"
                    error={!!errors.newsStatus}
                  >
                    <InputLabel>Status</InputLabel>
                    <Select
                      {...field}
                      label="Status"
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
            
            <StyledPaper>
              <SectionTitle variant="h6">Cover Image</SectionTitle>
              
              {/* Cover Image Upload */}
              <Controller
                name="coverFiles"
                control={control}
                rules={{ required: 'Cover image is required' }}
                render={({ field: { value, onChange, ...restField } }) => (
                  <>
                    {coverPreview ? (
                      <MediaPreview>
                        <CardMedia
                          component="img"
                          height="200"
                          image={coverPreview}
                          alt="Cover preview"
                        />
                        <IconButton
                          sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            bgcolor: 'rgba(0,0,0,0.6)',
                            color: 'white',
                            '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' },
                          }}
                          onClick={handleRemoveCover}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </MediaPreview>
                    ) : (
                      <Button
                        component="label"
                        variant="outlined"
                        startIcon={<CloudUploadIcon />}
                        fullWidth
                        sx={{ mb: 2, py: 1.5 }}
                      >
                        Upload Cover Image
                        <VisuallyHiddenInput
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files && e.target.files.length > 0) {
                              onChange(e.target.files);
                            }
                          }}
                          {...restField}
                        />
                      </Button>
                    )}
                    {errors.coverFiles && (
                      <FormHelperText error>
                        {errors.coverFiles.message}
                      </FormHelperText>
                    )}
                  </>
                )}
              />
            </StyledPaper>
            
            <StyledPaper>
              <SectionTitle variant="h6">Additional Images</SectionTitle>
              
              {/* News Images Upload */}
              <Controller
                name="newsImageFiles"
                control={control}
                render={({ field: { value, onChange, ...restField } }) => (
                  <>
                    <Button
                      component="label"
                      variant="outlined"
                      startIcon={<CloudUploadIcon />}
                      fullWidth
                      sx={{ mb: 2, py: 1.5 }}
                    >
                      Upload Additional Images
                      <VisuallyHiddenInput
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => {
                          if (e.target.files && e.target.files.length > 0) {
                            onChange(e.target.files);
                          }
                        }}
                        {...restField}
                      />
                    </Button>
                    
                    {/* Image Previews */}
                    <Grid container spacing={1}>
                      {newsImagePreviews.map((preview, index) => (
                        <Grid item xs={6} key={index}>
                          <MediaPreview>
                            <CardMedia
                              component="img"
                              height="100"
                              image={preview}
                              alt={`Image ${index + 1}`}
                            />
                          </MediaPreview>
                        </Grid>
                      ))}
                    </Grid>
                  </>
                )}
              />
            </StyledPaper>
            
            {/* Submit Buttons */}
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
              <Button 
                variant="outlined" 
                onClick={() => reset()}
                disabled={isSubmitting}
              >
                Reset
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSubmitting}
                sx={{ minWidth: 120 }}
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
      
      {/* Notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
