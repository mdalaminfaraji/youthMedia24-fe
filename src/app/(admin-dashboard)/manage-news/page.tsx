'use client'
import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Chip,
  Button,
  TextField,
  InputAdornment,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Alert,
  Snackbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import VisibilityIcon from '@mui/icons-material/Visibility'
import SearchIcon from '@mui/icons-material/Search'
import AddIcon from '@mui/icons-material/Add'
import { useCategoryStore } from '@/store/categoriesStore'
import { useRouter } from 'next/navigation'

// Mock data for news articles
const mockArticles = [
  {
    id: '1',
    title: 'Bangladesh Cricket Team Wins Series',
    category: 'Sports',
    categoryId: 'sports-123',
    status: 'published',
    author: 'Alamin Faraji',
    publishDate: '2025-03-10T10:30:00',
    language: 'bn',
    views: 1245,
  },
  {
    id: '2',
    title: 'New Economic Policy Announced',
    category: 'Business',
    categoryId: 'business-456',
    status: 'published',
    author: 'Alamin Faraji',
    publishDate: '2025-03-09T14:15:00',
    language: 'bn',
    views: 890,
  },
  {
    id: '3',
    title: 'Tech Innovation Summit in Dhaka',
    category: 'Technology',
    categoryId: 'tech-789',
    status: 'draft',
    author: 'Alamin Faraji',
    publishDate: '2025-03-08T09:45:00',
    language: 'en',
    views: 0,
  },
  {
    id: '4',
    title: 'Cultural Festival Celebrates Heritage',
    category: 'Culture',
    categoryId: 'culture-101',
    status: 'published',
    author: 'Alamin Faraji',
    publishDate: '2025-03-07T16:20:00',
    language: 'bn',
    views: 567,
  },
  {
    id: '5',
    title: 'Health Ministry Issues New Guidelines',
    category: 'Health',
    categoryId: 'health-112',
    status: 'published',
    author: 'Alamin Faraji',
    publishDate: '2025-03-06T11:10:00',
    language: 'bn',
    views: 723,
  },
  {
    id: '6',
    title: 'Education Reform Plan Unveiled',
    category: 'Education',
    categoryId: 'education-131',
    status: 'draft',
    author: 'Alamin Faraji',
    publishDate: '2025-03-05T13:40:00',
    language: 'en',
    views: 0,
  },
  {
    id: '7',
    title: 'Weather Alert: Heavy Rainfall Expected',
    category: 'Weather',
    categoryId: 'weather-415',
    status: 'published',
    author: 'Alamin Faraji',
    publishDate: '2025-03-04T08:30:00',
    language: 'bn',
    views: 1892,
  },
  {
    id: '8',
    title: 'Local Art Exhibition Opens',
    category: 'Arts',
    categoryId: 'arts-161',
    status: 'published',
    author: 'Alamin Faraji',
    publishDate: '2025-03-03T15:50:00',
    language: 'bn',
    views: 345,
  },
]

export default function ManageNewsPage() {
  const router = useRouter()
  const { categories, fetchCategories } = useCategoryStore()
  
  // State for articles and pagination
  const [articles, setArticles] = useState(mockArticles)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [loading, setLoading] = useState(false)
  
  // State for filtering and searching
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterLanguage, setFilterLanguage] = useState('')
  
  // State for delete dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [articleToDelete, setArticleToDelete] = useState<string | null>(null)
  
  // State for notifications
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  })

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories('bn')
    // In a real app, you would fetch articles here
    // For now, we're using mock data
  }, [fetchCategories])

  // Handle page change
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  // Handle rows per page change
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  // Handle search
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
    setPage(0)
  }

  // Handle filter changes
  const handleFilterChange = (
    event: SelectChangeEvent<string>
  ) => {
    const { name, value } = event.target as { name: string; value: string }
    
    if (name === 'category') {
      setFilterCategory(value)
    } else if (name === 'status') {
      setFilterStatus(value)
    } else if (name === 'language') {
      setFilterLanguage(value)
    }
    
    setPage(0)
  }

  // Handle delete dialog open
  const handleDeleteDialogOpen = (id: string) => {
    setArticleToDelete(id)
    setDeleteDialogOpen(true)
  }

  // Handle delete dialog close
  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false)
    setArticleToDelete(null)
  }

  // Handle delete article
  const handleDeleteArticle = () => {
    setLoading(true)
    
    // In a real app, you would call an API to delete the article
    setTimeout(() => {
      setArticles(articles.filter(article => article.id !== articleToDelete))
      setNotification({
        open: true,
        message: 'Article deleted successfully',
        severity: 'success',
      })
      setLoading(false)
      handleDeleteDialogClose()
    }, 1000)
  }

  // Handle notification close
  const handleNotificationClose = () => {
    setNotification({
      ...notification,
      open: false,
    })
  }

  // Handle edit article
  const handleEditArticle = (id: string) => {
    // In a real app, you would navigate to the edit page
    router.push(`/admin-dashboard/edit-news/${id}`)
  }

  // Handle view article
  const handleViewArticle = (id: string) => {
    // In a real app, you would navigate to the article page
    window.open(`/article/${id}`, '_blank')
  }

  // Handle add new article
  const handleAddNewArticle = () => {
    router.push('/admin-dashboard/add-news')
  }

  // Filter and search articles
  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory ? article.categoryId === filterCategory : true
    const matchesStatus = filterStatus ? article.status === filterStatus : true
    const matchesLanguage = filterLanguage ? article.language === filterLanguage : true
    
    return matchesSearch && matchesCategory && matchesStatus && matchesLanguage
  })

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          Manage News Articles
        </Typography>
        
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddNewArticle}
          sx={{
            backgroundColor: '#00141A',
            '&:hover': {
              backgroundColor: '#002a3a',
            }
          }}
        >
          Add New Article
        </Button>
      </Box>
      
      {/* Search and Filters */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
          <TextField
            label="Search Articles"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={handleSearch}
            sx={{ flexGrow: 1, minWidth: '200px' }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          
          <FormControl size="small" sx={{ minWidth: '150px' }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={filterCategory}
              onChange={handleFilterChange}
              label="Category"
              name="category"
            >
              <MenuItem value="">All Categories</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category.documentId} value={category.documentId}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl size="small" sx={{ minWidth: '120px' }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={filterStatus}
              onChange={handleFilterChange}
              label="Status"
              name="status"
            >
              <MenuItem value="">All Status</MenuItem>
              <MenuItem value="published">Published</MenuItem>
              <MenuItem value="draft">Draft</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl size="small" sx={{ minWidth: '120px' }}>
            <InputLabel>Language</InputLabel>
            <Select
              value={filterLanguage}
              onChange={handleFilterChange}
              label="Language"
              name="language"
            >
              <MenuItem value="">All Languages</MenuItem>
              <MenuItem value="bn">Bengali</MenuItem>
              <MenuItem value="en">English</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>
      
      {/* Articles Table */}
      <Paper sx={{ width: '100%', borderRadius: 2 }}>
        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Title</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Category</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Language</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Views</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredArticles
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((article) => (
                  <TableRow key={article.id} hover>
                    <TableCell sx={{ maxWidth: '300px' }}>
                      <Typography noWrap variant="body2">
                        {article.title}
                      </Typography>
                    </TableCell>
                    <TableCell>{article.category}</TableCell>
                    <TableCell>
                      <Chip
                        label={article.status}
                        size="small"
                        color={article.status === 'published' ? 'success' : 'default'}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>{formatDate(article.publishDate)}</TableCell>
                    <TableCell>
                      <Chip
                        label={article.language === 'bn' ? 'Bengali' : 'English'}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>{article.views}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleViewArticle(article.id)}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleEditArticle(article.id)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteDialogOpen(article.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              {filteredArticles.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1" color="text.secondary">
                      No articles found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredArticles.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
      >
        <DialogTitle>Delete Article</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this article? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteArticle} 
            color="error" 
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleNotificationClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleNotificationClose}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}
