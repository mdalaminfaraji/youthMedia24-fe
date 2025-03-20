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
  Grid,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import VisibilityIcon from '@mui/icons-material/Visibility'
import SearchIcon from '@mui/icons-material/Search'
import AddIcon from '@mui/icons-material/Add'
import PublishIcon from '@mui/icons-material/Publish'
import UnpublishedIcon from '@mui/icons-material/Unpublished'
import { useCategoryStore } from '@/store/categoriesStore'
import { useForm, Controller } from 'react-hook-form'

// Form data type
interface CategoryFormData {
  name: string
  description: string
  locale: string
}

export default function CategoriesPage() {
  // Get categories from store
  const {
    categories,
    selectedCategory,
    loading,
    fetchCategories,
    fetchCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
    publishCategory,
    unpublishCategory,
  } = useCategoryStore()

  // State for pagination, search, and dialogs
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [searchTerm, setSearchTerm] = useState('')
  const [languageFilter, setLanguageFilter] = useState('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [statusDialogOpen, setStatusDialogOpen] = useState(false)
  const [selectedCategoryId, setSelectedCategoryId] = useState('')
  const [statusAction, setStatusAction] = useState<'publish' | 'unpublish'>('publish')
  const [formDialogOpen, setFormDialogOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  })

  // Initialize React Hook Form
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormData>({
    defaultValues: {
      name: '',
      description: '',
      locale: 'en',
    },
  })

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  // Filter categories based on search term and language filter
  const filteredCategories = categories.filter((category) => {
    const matchesSearch =
      searchTerm === '' ||
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesLanguage =
      languageFilter === '' || category.locale === languageFilter

    return matchesSearch && matchesLanguage
  })

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

  // Handle language filter change
  const handleLanguageFilterChange = (event: SelectChangeEvent) => {
    setLanguageFilter(event.target.value)
    setPage(0)
  }

  // Handle delete dialog
  const handleDeleteDialogOpen = (id: string) => {
    setSelectedCategoryId(id)
    setDeleteDialogOpen(true)
  }

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false)
  }

  const handleDeleteConfirm = async () => {
    const success = await deleteCategory(selectedCategoryId)
    handleDeleteDialogClose()

    setNotification({
      open: true,
      message: success
        ? 'Category deleted successfully'
        : 'Failed to delete category',
      severity: success ? 'success' : 'error',
    })
  }

  // Handle status dialog
  const handleStatusDialogOpen = (id: string, action: 'publish' | 'unpublish') => {
    setSelectedCategoryId(id)
    setStatusAction(action)
    setStatusDialogOpen(true)
  }

  const handleStatusDialogClose = () => {
    setStatusDialogOpen(false)
  }

  const handleStatusConfirm = async () => {
    let success = false

    if (statusAction === 'publish') {
      success = await publishCategory(selectedCategoryId)
    } else {
      success = await unpublishCategory(selectedCategoryId)
    }

    handleStatusDialogClose()

    setNotification({
      open: true,
      message: success
        ? `Category ${statusAction === 'publish' ? 'published' : 'unpublished'} successfully`
        : `Failed to ${statusAction} category`,
      severity: success ? 'success' : 'error',
    })
  }

  // Handle form dialog
  const handleFormDialogOpen = (isEdit: boolean, id?: string) => {
    setIsEditMode(isEdit)
    
    if (isEdit && id) {
      setSelectedCategoryId(id)
      fetchCategoryById(id)
      // Form will be reset with category data when selectedCategory is updated
    } else {
      // Reset form for create mode
      reset({
        name: '',
        description: '',
        locale: 'en',
      })
    }
    
    setFormDialogOpen(true)
  }

  // Reset form when selectedCategory changes (for edit mode)
  useEffect(() => {
    if (isEditMode && selectedCategory) {
      reset({
        name: selectedCategory.name,
        description: selectedCategory.description,
        locale: selectedCategory.locale,
      })
    }
  }, [selectedCategory, isEditMode, reset])

  const handleFormDialogClose = () => {
    setFormDialogOpen(false)
  }

  const onSubmit = async (data: CategoryFormData) => {
    let success = false

    if (isEditMode) {
      success = await updateCategory(
        selectedCategoryId,
        {
          name: data.name,
          description: data.description,
        },
        data.locale
      )
    } else {
      success = await createCategory(
        {
          name: data.name,
          description: data.description,
        },
        data.locale
      )
    }

    if (success) {
      handleFormDialogClose()
      setNotification({
        open: true,
        message: `Category ${isEditMode ? 'updated' : 'created'} successfully`,
        severity: 'success',
      })
    } else {
      setNotification({
        open: true,
        message: `Failed to ${isEditMode ? 'update' : 'create'} category`,
        severity: 'error',
      })
    }
  }

  // Handle view dialog
  const handleViewDialogOpen = (id: string) => {
    setSelectedCategoryId(id)
    fetchCategoryById(id)
    setViewDialogOpen(true)
  }

  const handleViewDialogClose = () => {
    setViewDialogOpen(false)
  }

  // Handle notification close
  const handleNotificationClose = () => {
    setNotification({
      ...notification,
      open: false,
    })
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Manage Categories
      </Typography>

      {/* Filters and Actions */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          {/* Search */}
          <TextField
            placeholder="Search categories..."
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 300 }}
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            {/* Language Filter */}
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Language</InputLabel>
              <Select
                value={languageFilter}
                label="Language"
                onChange={handleLanguageFilterChange}
              >
                <MenuItem value="">All Languages</MenuItem>
                <MenuItem value="bn">Bengali</MenuItem>
                <MenuItem value="en">English</MenuItem>
              </Select>
            </FormControl>

            {/* Add Category Button */}
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => handleFormDialogOpen(false)}
            >
              Add Category
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Categories Table */}
      <Paper sx={{ width: '100%', borderRadius: 2 }}>
        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Language</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              )}

              {!loading && filteredCategories.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1" color="text.secondary">
                      No categories found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}

              {!loading &&
                filteredCategories
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((category) => (
                    <TableRow key={category.documentId} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {category.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Tooltip title={category.description}>
                          <Typography
                            variant="body2"
                            sx={{
                              maxWidth: 300,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {category.description}
                          </Typography>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={category.locale === 'bn' ? 'Bengali' : 'English'}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={category.status || 'draft'}
                          size="small"
                          color={
                            category.status === 'published' ? 'success' : 'default'
                          }
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title="View Category">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handleViewDialogOpen(category.documentId)}
                            >
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit Category">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handleFormDialogOpen(true, category.documentId)}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          {category.status !== 'published' ? (
                            <Tooltip title="Publish Category">
                              <IconButton
                                size="small"
                                color="success"
                                onClick={() =>
                                  handleStatusDialogOpen(
                                    category.documentId,
                                    'publish'
                                  )
                                }
                              >
                                <PublishIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          ) : (
                            <Tooltip title="Unpublish Category">
                              <IconButton
                                size="small"
                                color="warning"
                                onClick={() =>
                                  handleStatusDialogOpen(
                                    category.documentId,
                                    'unpublish'
                                  )
                                }
                              >
                                <UnpublishedIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                          <Tooltip title="Delete Category">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() =>
                                handleDeleteDialogOpen(category.documentId)
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
          count={filteredCategories.length}
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
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title">Delete Category</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this category? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Status Change Dialog */}
      <Dialog
        open={statusDialogOpen}
        onClose={handleStatusDialogClose}
        aria-labelledby="status-dialog-title"
      >
        <DialogTitle id="status-dialog-title">
          {statusAction === 'publish' ? 'Publish' : 'Unpublish'} Category
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to {statusAction} this category?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleStatusDialogClose}>Cancel</Button>
          <Button
            onClick={handleStatusConfirm}
            color={statusAction === 'publish' ? 'success' : 'warning'}
            autoFocus
          >
            {statusAction === 'publish' ? 'Publish' : 'Unpublish'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create/Edit Category Dialog */}
      <Dialog
        open={formDialogOpen}
        onClose={handleFormDialogClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {isEditMode ? 'Edit Category' : 'Create New Category'}
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Controller
                  name="name"
                  control={control}
                  rules={{ required: 'Name is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Category Name"
                      fullWidth
                      error={!!errors.name}
                      helperText={errors.name?.message}
                      margin="normal"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
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
                      rows={4}
                      error={!!errors.description}
                      helperText={errors.description?.message}
                      margin="normal"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="locale"
                  control={control}
                  rules={{ required: 'Language is required' }}
                  render={({ field }) => (
                    <FormControl fullWidth margin="normal">
                      <InputLabel>Language</InputLabel>
                      <Select {...field} label="Language">
                        <MenuItem value="en">English</MenuItem>
                        <MenuItem value="bn">Bengali</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleFormDialogClose}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} />
              ) : isEditMode ? (
                'Update'
              ) : (
                'Create'
              )}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* View Category Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={handleViewDialogClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Category Details</DialogTitle>
        <DialogContent dividers>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : selectedCategory ? (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Name
                </Typography>
                <Typography variant="body1" paragraph>
                  {selectedCategory.name}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Description
                </Typography>
                <Typography variant="body1" paragraph>
                  {selectedCategory.description}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Language
                </Typography>
                <Chip
                  label={selectedCategory.locale === 'bn' ? 'Bengali' : 'English'}
                  size="small"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Status
                </Typography>
                <Chip
                  label={selectedCategory.status || 'draft'}
                  size="small"
                  color={
                    selectedCategory.status === 'published'
                      ? 'success'
                      : 'default'
                  }
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight="bold">
                  ID
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedCategory.documentId}
                </Typography>
              </Grid>
            </Grid>
          ) : (
            <Typography color="error">Failed to load category details</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleViewDialogClose}>Close</Button>
          {selectedCategory && (
            <Button
              color="primary"
              onClick={() => {
                handleViewDialogClose()
                handleFormDialogOpen(true, selectedCategory.documentId)
              }}
            >
              Edit
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleNotificationClose}
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
