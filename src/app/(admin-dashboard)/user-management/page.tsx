'use client'

import React, { useState, useEffect } from 'react'
import {
  Box,
  Button,
  Card,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Chip,
} from '@mui/material'
import { Edit as EditIcon, Delete as DeleteIcon, Block as BlockIcon, CheckCircle as CheckCircleIcon } from '@mui/icons-material'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { useUserStore, User } from '@/store/userManagementStore'

interface EditUserFormData {
  username: string
  email: string
  phoneNumber: string
  blocked: boolean
}

export default function UserManagementPage() {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [searchQuery, setSearchQuery] = useState('')
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)

  const { register, handleSubmit, reset } = useForm<EditUserFormData>()

  const { users, loading, error, fetchUsers, updateUser, deleteUser, toggleBlockUser } = useUserStore()

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const filteredUsers = users.filter((user: User) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.phoneNumber?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleEditClick = (user: User) => {
    setEditingUser(user)
    reset({
      username: user.username,
      email: user.email,
      phoneNumber: user.phoneNumber,
      blocked: user.blocked,
    })
    setIsEditDialogOpen(true)
  }

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user)
    setIsDeleteDialogOpen(true)
  }

  const handleEditSubmit = async (formData: EditUserFormData) => {
    if (!editingUser?.documentId) return

    try {
      const success = await updateUser(editingUser.documentId, formData)
      if (success) {
        toast.success('User updated successfully')
        setIsEditDialogOpen(false)
      } else {
        toast.error('Failed to update user')
      }
    } catch (error) {
      toast.error('Failed to update user')
      console.error(error)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!userToDelete?.documentId) return

    try {
      const success = await deleteUser(userToDelete.documentId)
      if (success) {
        toast.success('User deleted successfully')
        setIsDeleteDialogOpen(false)
      } else {
        toast.error('Failed to delete user')
      }
    } catch (error) {
      toast.error('Failed to delete user')
      console.error(error)
    }
  }

  const handleToggleBlock = async (user: User) => {
    try {
      const success = await toggleBlockUser(user.documentId, !user.blocked)
      if (success) {
        toast.success(`User ${user.blocked ? 'unblocked' : 'blocked'} successfully`)
      } else {
        toast.error(`Failed to ${user.blocked ? 'unblock' : 'block'} user`)
      }
    } catch (error) {
      toast.error(`Failed to ${user.blocked ? 'unblock' : 'block'} user`)
      console.error(error)
    }
  }

  if (error) {
    toast.error(error)
  }

  return (
    <Box p={3}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" component="h1">
          User Management
        </Typography>
        <TextField
          size="small"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ width: 300 }}
        />
      </Stack>

      <Card>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Username</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone Number</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((user: User) => (
                    <TableRow key={user.documentId}>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phoneNumber}</TableCell>
                      <TableCell>{user.role.name}</TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <Chip
                            size="small"
                            color={user.confirmed ? 'success' : 'warning'}
                            label={user.confirmed ? 'Confirmed' : 'Pending'}
                          />
                          <Chip
                            size="small"
                            color={user.blocked ? 'error' : 'success'}
                            label={user.blocked ? 'Blocked' : 'Active'}
                          />
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <Tooltip title="Edit">
                            <IconButton size="small" onClick={() => handleEditClick(user)}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={user.blocked ? 'Unblock' : 'Block'}>
                            <IconButton size="small" onClick={() => handleToggleBlock(user)}>
                              {user.blocked ? (
                                <CheckCircleIcon fontSize="small" color="success" />
                              ) : (
                                <BlockIcon fontSize="small" color="warning" />
                              )}
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton size="small" onClick={() => handleDeleteClick(user)}>
                              <DeleteIcon fontSize="small" color="error" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredUsers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      </Card>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onClose={() => setIsEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit(handleEditSubmit)}>
          <DialogTitle>Edit User</DialogTitle>
          <DialogContent>
            <Stack spacing={2} mt={2}>
              <TextField
                label="Username"
                fullWidth
                {...register('username')}
                defaultValue={editingUser?.username}
              />
              <TextField
                label="Email"
                fullWidth
                type="email"
                {...register('email')}
                defaultValue={editingUser?.email}
              />
              <TextField
                label="Phone Number"
                fullWidth
                {...register('phoneNumber')}
                defaultValue={editingUser?.phoneNumber}
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">Save Changes</Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete user {userToDelete?.username}?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
