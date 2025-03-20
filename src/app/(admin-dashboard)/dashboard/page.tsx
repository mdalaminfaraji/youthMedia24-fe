/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React from 'react'
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Chip,
  Avatar,
  Divider,
  LinearProgress,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import {
  Article as ArticleIcon,
  Category as CategoryIcon,
  Visibility as ViewsIcon,
  TrendingUp as TrendingIcon,
  Comment as CommentIcon,
  Share as ShareIcon,
  MoreVert as MoreVertIcon,
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon,
} from '@mui/icons-material'
import { useRouter } from 'next/navigation'
import { useArticleStore } from '@/store/useArticleStore'
import { useCategoryStore } from '@/store/categoriesStore'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

// Mock data for visualization - Replace with real data later
const viewsData = [
  { name: 'Mon', views: 2400 },
  { name: 'Tue', views: 1398 },
  { name: 'Wed', views: 9800 },
  { name: 'Thu', views: 3908 },
  { name: 'Fri', views: 4800 },
  { name: 'Sat', views: 3800 },
  { name: 'Sun', views: 4300 },
]

export default function AdminDashboardPage() {
  const router = useRouter()
  const { articles } = useArticleStore()
  const { categories } = useCategoryStore()

  // Calculate statistics
  const totalArticles = articles.length
  const totalCategories = categories.length
  const totalViews = articles.reduce(
    (sum, article) => sum + (article.views || 0),
    0
  )
  const publishedArticles = articles.filter(
    (article) => article.status === 'published'
  ).length
  const draftArticles = articles.filter(
    (article) => article.status === 'draft'
  ).length

  // Get recent articles
  const recentArticles = [...articles]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5)

  // Get popular categories
  const categoryStats = categories
    .map((category) => ({
      ...category,
      articleCount: articles.filter(
        (article) => article.category?.documentId === category.documentId
      ).length,
    }))
    .sort((a, b) => b.articleCount - a.articleCount)
    .slice(0, 5)

  const StatCard = ({ icon: Icon, title, value, trend, color }: any) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Box
            sx={{
              backgroundColor: `${color}.lighter`,
              borderRadius: '50%',
              p: 1,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Icon sx={{ color: `${color}.main` }} />
          </Box>
          <IconButton size="small">
            <MoreVertIcon />
          </IconButton>
        </Box>
        <Typography variant="h4" component="div" sx={{ mb: 1 }}>
          {value.toLocaleString()}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          {trend > 0 ? (
            <ArrowUpIcon
              sx={{ color: 'success.main', mr: 0.5 }}
              fontSize="small"
            />
          ) : (
            <ArrowDownIcon
              sx={{ color: 'error.main', mr: 0.5 }}
              fontSize="small"
            />
          )}
          <Typography
            variant="body2"
            sx={{ color: trend > 0 ? 'success.main' : 'error.main' }}
          >
            {Math.abs(trend)}%
          </Typography>
        </Box>
        <Typography color="text.secondary" variant="body2">
          {title}
        </Typography>
      </CardContent>
    </Card>
  )

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 4 }} fontWeight="bold">
        Dashboard
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={ArticleIcon}
            title="Total Articles"
            value={totalArticles}
            trend={12}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={ViewsIcon}
            title="Total Views"
            value={totalViews}
            trend={8}
            color="info"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={CategoryIcon}
            title="Categories"
            value={totalCategories}
            trend={5}
            color="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={TrendingIcon}
            title="Engagement Rate"
            value={85}
            trend={-3}
            color="error"
          />
        </Grid>
      </Grid>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Views Chart */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box
              sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}
            >
              <Typography variant="h6">Weekly Views Overview</Typography>
              <Button
                variant="outlined"
                size="small"
                onClick={() => router.push('/admin/analytics')}
              >
                View Details
              </Button>
            </Box>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={viewsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="views" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Article Status */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Article Status
            </Typography>
            <Box sx={{ mb: 3 }}>
              <Box
                sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}
              >
                <Typography variant="body2" color="text.secondary">
                  Published ({publishedArticles})
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {Math.round((publishedArticles / totalArticles) * 100)}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={(publishedArticles / totalArticles) * 100}
                color="success"
                sx={{ mb: 2 }}
              />
              <Box
                sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}
              >
                <Typography variant="body2" color="text.secondary">
                  Draft ({draftArticles})
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {Math.round((draftArticles / totalArticles) * 100)}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={(draftArticles / totalArticles) * 100}
                color="warning"
              />
            </Box>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => router.push('/manage-news')}
            >
              View All Articles
            </Button>
          </Paper>
        </Grid>

        {/* Recent Articles */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Recent Articles
            </Typography>
            <List>
              {recentArticles.map((article, index) => (
                <React.Fragment key={article.documentId}>
                  <ListItem
                    secondaryAction={
                      <Chip
                        size="small"
                        label={article.status}
                        color={
                          article.status === 'published' ? 'success' : 'default'
                        }
                      />
                    }
                  >
                    <ListItemText
                      primary={article.title}
                      secondary={
                        <Box sx={{ display: 'flex', gap: 2, mt: 0.5 }}>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 0.5,
                            }}
                          >
                            <ViewsIcon fontSize="small" color="action" />
                            <Typography variant="caption">
                              {article.views || 0}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 0.5,
                            }}
                          >
                            <CommentIcon fontSize="small" color="action" />
                            <Typography variant="caption">
                              {/* {article.comments || 0} */}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 0.5,
                            }}
                          >
                            <ShareIcon fontSize="small" color="action" />
                            <Typography variant="caption">
                              {/* {article.shares || 0} */}
                            </Typography>
                          </Box>
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < recentArticles.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Popular Categories */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Popular Categories
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Category</TableCell>
                    <TableCell>Articles</TableCell>
                    <TableCell>Language</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {categoryStats.map((category) => (
                    <TableRow key={category.documentId} hover>
                      <TableCell>
                        <Box
                          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                        >
                          <Avatar
                            sx={{
                              width: 32,
                              height: 32,
                              bgcolor: 'primary.lighter',
                              color: 'primary.main',
                            }}
                          >
                            {category.name.charAt(0).toUpperCase()}
                          </Avatar>
                          <Typography variant="body2">
                            {category.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{category.articleCount}</TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={
                            category.locale === 'bn' ? 'Bengali' : 'English'
                          }
                          variant="outlined"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}
