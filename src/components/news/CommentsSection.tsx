'use client'

import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  TextField,
  Button,
} from '@mui/material'
import { useState } from 'react'

interface Comment {
  id: number
  user: {
    name: string
    avatar: string
  }
  content: string
  timestamp: string
}

interface CommentsSectionProps {
  articleId?: string // Optional prop for when you connect to backend
}

export default function CommentsSection({ articleId }: CommentsSectionProps) {
  const [comment, setComment] = useState('')
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      user: {
        name: 'John Doe',
        avatar: '/images/avatar1.jpg',
      },
      content: 'Great article! Very informative.',
      timestamp: '2 hours ago',
    },
    {
      id: 2,
      user: {
        name: 'Jane Smith',
        avatar: '/images/avatar2.jpg',
      },
      content: 'Thanks for sharing this important news.',
      timestamp: '1 hour ago',
    },
  ])

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (comment.trim()) {
      const newComment: Comment = {
        id: comments.length + 1,
        user: {
          name: 'Current User', // This would come from auth system
          avatar: '/images/avatar3.jpg',
        },
        content: comment,
        timestamp: 'Just now',
      }
      setComments([...comments, newComment])
      setComment('')
    }
  }

  return (
    <Box sx={{ mt: 6 }}>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 'bold',
          mb: 3,
          pb: 1,
          borderBottom: '2px solid',
          borderColor: 'error.main',
        }}
      >
        Comments ({comments.length})
      </Typography>
      <List sx={{ width: '100%' }}>
        {comments.map((comment, index) => (
          <Box key={comment.id}>
            <ListItem alignItems="flex-start" sx={{ px: 0, py: 2 }}>
              <ListItemAvatar>
                <Avatar
                  src={comment.user.avatar}
                  alt={comment.user.name}
                  sx={{ width: 48, height: 48 }}
                />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 1,
                    }}
                  >
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      {comment.user.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {comment.timestamp}
                    </Typography>
                  </Box>
                }
                secondary={
                  <Typography
                    variant="body2"
                    color="text.primary"
                    sx={{ whiteSpace: 'pre-wrap' }}
                  >
                    {comment.content}
                  </Typography>
                }
              />
            </ListItem>
            {index < comments.length - 1 && (
              <Divider variant="fullWidth" component="li" />
            )}
          </Box>
        ))}
      </List>
      {/* Comment Form */}
      <Paper
        component="form"
        onSubmit={handleCommentSubmit}
        elevation={0}
        sx={{
          p: 2,
          mb: 4,
          backgroundColor: 'grey.50',
          borderRadius: 2,
        }}
      >
        <TextField
          fullWidth
          multiline
          rows={2}
          placeholder="Write your comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Box sx={{ position: 'relative' }}>
          <Button
            type="submit"
            variant="contained"
            size="small"
            color="error"
            sx={{
              px: 4,
              py: 1,
              borderRadius: 2,
              textTransform: 'none',
              position: 'absolute',
              right: 0,
            }}
          >
            Post Comment
          </Button>
        </Box>
      </Paper>
    </Box>
  )
}
