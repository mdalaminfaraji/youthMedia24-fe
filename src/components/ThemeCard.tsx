"use client";

import {
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
} from "@mui/material";

export default function ThemedCard() {
  return (
    <Card sx={{ maxWidth: 345, my: 2, mx: "auto", boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          Themed Card
        </Typography>
        <Typography variant="body2" color="text.secondary">
          This card adjusts its color and style based on the selected theme
          (light, dark, or system). It dynamically applies theme-based styling
          using Material-UI's design tokens.
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" variant="contained">
          Learn More
        </Button>
      </CardActions>
    </Card>
  );
}
