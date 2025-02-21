'use client'

import { useAuth } from '@/providers/clientProvider/authProvider'
import { useArticleStore } from '@/store/useArticleStore'
import { formateDate } from '@/utils/urlHelper'
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
import { getCookie } from 'cookies-next'
import { useState } from 'react'

interface CommentsSectionProps {
  articleId?: string // Optional prop for when you connect to backend
}

export default function CommentsSection({ articleId }: CommentsSectionProps) {
  const { user } = useAuth()
  const { comments, createComment, loading } = useArticleStore()
  const [comment, setComment] = useState('')

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Submitting comment:', comment)
    const UserData = await getCookie('user')
    const user = UserData ? JSON.parse(UserData) : null

    const strapiUserId = user?.strapiUserId
    const data = {
      article: articleId as string,
      content: comment,
      user: strapiUserId as string,
    }
    await createComment(data, 'bn')
    console.log(comments)
  }
  console.log(user, 'articleId', articleId)
  console.log(comments)
  if (loading) {
    return <Box>Loading.....</Box>
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
        {comments.length > 0 &&
          comments.map((comment, index) => (
            <Box key={index}>
              <ListItem alignItems="flex-start" sx={{ px: 0, py: 2 }}>
                <ListItemAvatar>
                  <Avatar
                    src={comment.user?.username}
                    alt={comment.user?.username}
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
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 'bold' }}
                      >
                        {comment.user?.username}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formateDate(comment.createdAt)}
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
      {user && (
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
      )}
    </Box>
  )
}
