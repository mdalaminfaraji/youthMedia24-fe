/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useAuth } from '@/providers/clientProvider/authProvider'
import { NewsDetails, useArticleStore } from '@/store/useArticleStore'
import { formateDate } from '@/utils/urlHelper'
import {
  Box,
  Avatar,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Skeleton,
} from '@mui/material'
import { getCookie } from 'cookies-next'
import { useState } from 'react'

interface CommentsSectionProps {
  newsData: NewsDetails
}

export default function CommentsSection({ newsData }: CommentsSectionProps) {
  const { user } = useAuth()
  const { createComment, loading } = useArticleStore()
  const [comment, setComment] = useState('')
  const [localComments, setLocalComments] = useState<any[]>([])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const UserData = await getCookie('user')
    const user = UserData ? JSON.parse(UserData) : null

    const strapiUserId = user?.documentId
    const data = {
      article: newsData.documentId as string,
      content: comment,
      user: strapiUserId as string,
    }
    await createComment(data, 'bn')
    // Add the new comment to local state
    const newComment = {
      content: comment,
      createdAt: new Date().toISOString(),
      user: {
        username: user?.username,
        email: user?.email,
      },
    }
    setLocalComments([newComment, ...localComments])
    setComment('')
  }

  // Merge newsData comments with local comments
  const allComments = [...localComments, ...(newsData?.comments || [])]

  if (loading) {
    return (
      <Box sx={{ width: '100%', mt: 3 }}>
        <Skeleton variant="text" width="200px" height={40} />
        {[1, 2, 3].map((item) => (
          <Box key={item} sx={{ display: 'flex', gap: 2, my: 2 }}>
            <Skeleton variant="circular" width={48} height={48} />
            <Box sx={{ width: '100%' }}>
              <Skeleton variant="text" width="150px" />
              <Skeleton variant="text" width="100%" />
              <Skeleton variant="text" width="60%" />
            </Box>
          </Box>
        ))}
      </Box>
    )
  }

  return (
    <Box component="section" sx={{ mt: 4 }}>
      {user && (
        <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="Write your comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={!comment.trim()}
          >
            Post Comment
          </Button>
        </Box>
      )}

      <Typography
        variant="h6"
        sx={{
          mb: 2,
          pb: 1,
          borderBottom: '2px solid',
          borderColor: 'error.main',
        }}
      >
        Comments ({allComments.length})
      </Typography>
      <List sx={{ width: '100%' }}>
        {allComments.length > 0 ? (
          allComments.map((comment, index) => (
            <Box key={index}>
              <ListItem alignItems="flex-start" sx={{ px: 0, py: 2 }}>
                <ListItemAvatar>
                  <Avatar
                    src={comment?.user?.username}
                    alt={comment?.user?.username}
                    sx={{ width: 48, height: 48 }}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography
                      component="span"
                      variant="subtitle1"
                      color="text.primary"
                      sx={{ fontWeight: 600 }}
                    >
                      {comment?.user?.username || 'Anonymous'}
                    </Typography>
                  }
                  secondary={
                    <Box>
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.primary"
                        sx={{ display: 'block', my: 1 }}
                      >
                        {comment.content}
                      </Typography>
                      <Typography
                        component="span"
                        variant="caption"
                        color="text.secondary"
                      >
                        {formateDate(comment.createdAt)}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
              {index < allComments.length - 1 && (
                <Divider variant="inset" component="li" />
              )}
            </Box>
          ))
        ) : (
          <Typography variant="body2" color="text.secondary">
            No comments yet. Be the first to comment!
          </Typography>
        )}
      </List>
    </Box>
  )
}
