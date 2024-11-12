import * as React from 'react';
import { Card, CardContent, CardMedia, Typography, Button, CardActionArea, CardActions } from '@mui/material';

import Link from 'next/link';

interface Article {
  documentId?: string;
  title: string;
  category:{
    name:string;
  }
  cover?: { url?: string };
  createdAt: string;
}

interface NewsCardProps {
  article: Article;
}

// Helper function to calculate time since creation
const calculateTimeSince = (createdAt: string): string => {
  const createdDate = new Date(createdAt);
  const currentDate = new Date();
  const differenceInMs = currentDate.getTime() - createdDate.getTime();

  const seconds = Math.floor(differenceInMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d`;
  if (hours > 0) return `${hours}h`;
  if (minutes > 0) return `${minutes}m`;
  return `${seconds}s`;
};

export default function NewsCard({ article }: NewsCardProps) {

  const imageUrl = `${process.env.NEXT_PUBLIC_API_URL}${article?.cover?.url}`;
  const timeSinceCreated = article ? calculateTimeSince(article.createdAt) : "";


  return (
    <Card sx={{ maxWidth: 345 }}>
      <Link href={`/articles/${article?.documentId}`}>
      <CardActionArea >
        {
          article&&   <CardMedia
          component="img"
          height="140"
          image={imageUrl}
          alt={article.title}
        />
        }
     
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {article?.title}
          </Typography>

        </CardContent>
      </CardActionArea></Link>

      <CardActions>
        <Button size="small" color="primary">
            {timeSinceCreated} ago | {article?.category?.name}
        </Button>
      </CardActions>
    </Card>
  );
}
