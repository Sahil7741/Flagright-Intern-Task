import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export default function MediaCard({ title, content, imgSrc }) {
  return (
    <Card sx={{ maxWidth: 345 }} className='bg-gray-950'>
      <CardMedia
        sx={{ height: 140 }}
        image={imgSrc}
        title={title}
      />
      <CardContent className='bg-gray-950 text-white'>
        <Typography gutterBottom variant="h5" component="div">
          {title}
        </Typography>
        <Typography variant="body2" className='text-white'>
            {content}
        </Typography>
      </CardContent>
    </Card>
  );
}
