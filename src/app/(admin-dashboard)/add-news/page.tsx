'use client'
import React, { useState, useEffect } from 'react'
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
  Chip,
  CircularProgress,
  Alert,
  Snackbar,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { useCategoryStore } from '@/store/categoriesStore'

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

const ImagePreview = styled('img')({
  width: '100%',
  height: 'auto',
  maxHeight: '200px',
  objectFit: 'cover',
  borderRadius: '4px',
  marginTop: '8px',
})

export default function AddNewsPage() {
  const { categories, fetchCategories } = useCategoryStore()
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    category: '',
    tags: [] as string[],
    language: 'bn', // Default language is Bengali
  })
  
  // UI state
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [currentTag, setCurrentTag] = useState('')

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories('bn')
  }, [fetchCategories])

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  // Handle select changes
  const handleSelectChange = (e: SelectChangeEvent) => {
    const name = e.target.name as string
    const value = e.target.value
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setImageFile(file)
      
      // Create preview URL
      const reader = new FileReader()
      reader.onload = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle adding tags
  const handleAddTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, currentTag.trim()],
      })
      setCurrentTag('')
    }
  }

  // Handle removing tags
  const handleDeleteTag = (tagToDelete: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToDelete),
    })
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form
    if (!formData.title || !formData.description || !formData.content || !formData.category || !imageFile) {
      setError('Please fill in all required fields and upload an image')
      return
    }
    
    setLoading(true)
    setError('')
    
    try {
      // TODO: Implement API call to save news article
      // This is a placeholder for the actual API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Show success message
      setSuccess(true)
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        content: '',
        category: '',
        tags: [],
        language: 'bn',
      })
      setImagePreview(null)
      setImageFile(null)
      
    } catch (err) {
      setError('Failed to create news article. Please try again.')
      console.error('Error creating news article:', err)
    } finally {
      setLoading(false)
    }
  }

  // Handle closing success message
  const handleCloseSuccess = () => {
    setSuccess(false)
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4, fontWeight: 600 }}>
        Add New Article
      </Typography>
      
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Title */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                variant="outlined"
              />
            </Grid>
            
            {/* Description */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                multiline
                rows={2}
                variant="outlined"
              />
            </Grid>
            
            {/* Content */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
                multiline
                rows={6}
                variant="outlined"
              />
            </Grid>
            
            {/* Category */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={formData.category}
                  onChange={handleSelectChange}
                  label="Category"
                >
                  {categories.map((category) => (
                    <MenuItem key={category.documentId} value={category.documentId}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            {/* Language */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Language</InputLabel>
                <Select
                  name="language"
                  value={formData.language}
                  onChange={handleSelectChange}
                  label="Language"
                >
                  <MenuItem value="bn">Bengali</MenuItem>
                  <MenuItem value="en">English</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            {/* Tags */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1 }}>
                <TextField
                  label="Add Tags"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  sx={{ flexGrow: 1 }}
                />
                <Button 
                  variant="contained" 
                  onClick={handleAddTag}
                  sx={{ mt: 1 }}
                >
                  Add
                </Button>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {formData.tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    onDelete={() => handleDeleteTag(tag)}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Grid>
            
            {/* Image Upload */}
            <Grid item xs={12}>
              <Button
                component="label"
                variant="contained"
                startIcon={<CloudUploadIcon />}
                sx={{ mb: 2 }}
              >
                Upload Featured Image
                <VisuallyHiddenInput type="file" accept="image/*" onChange={handleImageUpload} />
              </Button>
              
              {imagePreview && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Image Preview:
                  </Typography>
                  <ImagePreview src={imagePreview} alt="Preview" />
                </Box>
              )}
            </Grid>
            
            {/* Error message */}
            {error && (
              <Grid item xs={12}>
                <Alert severity="error">{error}</Alert>
              </Grid>
            )}
            
            {/* Submit Button */}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                disabled={loading}
                sx={{ 
                  minWidth: '150px',
                  py: 1.5,
                  backgroundColor: '#00141A',
                  '&:hover': {
                    backgroundColor: '#002a3a',
                  }
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Publish Article'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
      
      {/* Success message */}
      <Snackbar open={success} autoHideDuration={6000} onClose={handleCloseSuccess}>
        <Alert onClose={handleCloseSuccess} severity="success" sx={{ width: '100%' }}>
          Article published successfully!
        </Alert>
      </Snackbar>
    </Box>
  )
}
