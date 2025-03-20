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
  Tooltip,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import VisibilityIcon from '@mui/icons-material/Visibility'
import SearchIcon from '@mui/icons-material/Search'
import AddIcon from '@mui/icons-material/Add'
import PublishIcon from '@mui/icons-material/Publish'
import UnpublishedIcon from '@mui/icons-material/Unpublished'
import { useCategoryStore } from '@/store/categoriesStore'
import { useRouter } from 'next/navigation'
import { useArticleStore } from '@/store/useArticleStore'
import Image from 'next/image'

export default function ManageNewsPage() {
  const router = useRouter()
  const { categories, fetchCategories } = useCategoryStore()
  const {
    adminArticles,
    loading: storeLoading,
    error: storeError,
    fetchAdminArticles,
    deleteArticle,
    publishArticle,
    unpublishArticle,
  } = useArticleStore()

  // State for articles and pagination
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

  // State for publish/unpublish dialog
  const [statusDialogOpen, setStatusDialogOpen] = useState(false)
  const [articleToChangeStatus, setArticleToChangeStatus] = useState<{
    id: string
    action: 'publish' | 'unpublish'
  } | null>(null)

  // State for notifications
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  })

  // Fetch categories and articles on component mount
  useEffect(() => {
    fetchCategories('bn')
    fetchAdminArticles()
  }, [fetchCategories, fetchAdminArticles])

  // Handle page change
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  // Handle rows per page change
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  // Handle search
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
    setPage(0)
  }

  // Handle filter changes
  const handleFilterChange = (event: SelectChangeEvent<string>) => {
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

  // Handle status dialog open
  const handleStatusDialogOpen = (
    id: string,
    action: 'publish' | 'unpublish'
  ) => {
    setArticleToChangeStatus({ id, action })
    setStatusDialogOpen(true)
  }

  // Handle status dialog close
  const handleStatusDialogClose = () => {
    setStatusDialogOpen(false)
    setArticleToChangeStatus(null)
  }

  // Handle delete article
  const handleDeleteArticle = async () => {
    if (!articleToDelete) return

    setLoading(true)
    const success = await deleteArticle(articleToDelete)

    setNotification({
      open: true,
      message: success
        ? 'Article deleted successfully'
        : 'Failed to delete article',
      severity: success ? 'success' : 'error',
    })

    setLoading(false)
    handleDeleteDialogClose()
  }

  // Handle change article status
  const handleChangeArticleStatus = async () => {
    if (!articleToChangeStatus) return

    setLoading(true)
    let success = false

    if (articleToChangeStatus.action === 'publish') {
      success = await publishArticle(articleToChangeStatus.id)
    } else {
      success = await unpublishArticle(articleToChangeStatus.id)
    }

    setNotification({
      open: true,
      message: success
        ? `Article ${
            articleToChangeStatus.action === 'publish'
              ? 'published'
              : 'unpublished'
          } successfully`
        : `Failed to ${articleToChangeStatus.action} article`,
      severity: success ? 'success' : 'error',
    })

    setLoading(false)
    handleStatusDialogClose()
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
    router.push(`/edit-news/${id}`)
  }

  // Handle view article
  const handleViewArticle = (id: string, locale: string, slug?: string) => {
    if (locale === 'bn' && slug) {
      window.open(`/bangla/all/${slug}`, '_blank')
    } else {
      window.open(`/english/all/${id}`, '_blank')
    }
  }

  // Handle add new article
  const handleAddNewArticle = () => {
    router.push('/add-news')
  }

  // Filter and search articles
  const filteredArticles = adminArticles.filter((article) => {
    const matchesSearch = article.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory
      ? article.category?.documentId === filterCategory
      : true
    const matchesStatus = filterStatus
      ? article.newsStatus?.toLowerCase() === filterStatus
      : true
    const matchesLanguage = filterLanguage
      ? article.locale === filterLanguage
      : true

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
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
        }}
      >
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
            },
          }}
        >
          Add New Article
        </Button>
      </Box>

      {/* Search and Filters */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
            alignItems: 'center',
          }}
        >
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
                <TableCell sx={{ fontWeight: 'bold' }}>Image</TableCell>
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
              {storeLoading && (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              )}

              {!storeLoading && filteredArticles.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1" color="text.secondary">
                      No articles found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}

              {!storeLoading &&
                filteredArticles
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((article) => (
                    <TableRow key={article.documentId} hover>
                      <TableCell sx={{ width: 80 }}>
                        {article.cover && article.cover[0]?.url ? (
                          <Box
                            sx={{ width: 60, height: 40, position: 'relative' }}
                          >
                            <Image
                              src={article.cover[0].url}
                              alt={article.title}
                              fill
                              style={{ objectFit: 'cover' }}
                            />
                          </Box>
                        ) : (
                          <Box
                            sx={{
                              width: 60,
                              height: 40,
                              bgcolor: 'grey.300',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              No image
                            </Typography>
                          </Box>
                        )}
                      </TableCell>
                      <TableCell sx={{ maxWidth: '300px' }}>
                        <Tooltip title={article.title}>
                          <Typography noWrap variant="body2">
                            {article.title}
                          </Typography>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        {article.category?.name || 'Uncategorized'}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={article.newsStatus}
                          size="small"
                          color={
                            article.newsStatus === 'published'
                              ? 'success'
                              : 'default'
                          }
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        {formatDate(article.updatedAt || article.createdAt)}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={
                            article.locale === 'bn' ? 'Bengali' : 'English'
                          }
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>{article.views || 0}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title="View Article">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() =>
                                handleViewArticle(
                                  article.documentId,
                                  article.locale
                                  // article?.banglaSlug
                                )
                              }
                            >
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit Article">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() =>
                                handleEditArticle(article.documentId)
                              }
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          {article.newsStatus === 'draft' ? (
                            <Tooltip title="Publish Article">
                              <IconButton
                                size="small"
                                color="success"
                                onClick={() =>
                                  handleStatusDialogOpen(
                                    article.documentId,
                                    'publish'
                                  )
                                }
                              >
                                <PublishIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          ) : (
                            <Tooltip title="Unpublish Article">
                              <IconButton
                                size="small"
                                color="warning"
                                onClick={() =>
                                  handleStatusDialogOpen(
                                    article.documentId,
                                    'unpublish'
                                  )
                                }
                              >
                                <UnpublishedIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                          <Tooltip title="Delete Article">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() =>
                                handleDeleteDialogOpen(article.documentId)
                              }
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
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
      <Dialog open={deleteDialogOpen} onClose={handleDeleteDialogClose}>
        <DialogTitle>Delete Article</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this article? This action cannot be
            undone.
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

      {/* Status Change Confirmation Dialog */}
      <Dialog open={statusDialogOpen} onClose={handleStatusDialogClose}>
        <DialogTitle>
          {articleToChangeStatus?.action === 'publish'
            ? 'Publish Article'
            : 'Unpublish Article'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to {articleToChangeStatus?.action} this
            article?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleStatusDialogClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleChangeArticleStatus}
            color={
              articleToChangeStatus?.action === 'publish'
                ? 'success'
                : 'warning'
            }
            variant="contained"
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} />
            ) : articleToChangeStatus?.action === 'publish' ? (
              'Publish'
            ) : (
              'Unpublish'
            )}
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

      {/* Error Alert */}
      {storeError && (
        <Alert
          severity="error"
          sx={{ mt: 2 }}
          onClose={() => useArticleStore.setState({ error: null })}
        >
          {storeError}
        </Alert>
      )}
    </Box>
  )
}
