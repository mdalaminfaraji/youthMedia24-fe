import { Container, Grid, Typography, Box } from "@mui/material";
import Image from "next/image";
import busImage from "@/assests/busImage.jpg";
const Feature = () => {
  return (
    <Container maxWidth="lg" sx={{ marginTop: 4 }}>
      <Grid container spacing={4}>
        {/* Text Section */}
        <Grid item xs={12} md={7}>
          <Typography variant="h4" component="h1" gutterBottom>
            'বামে প্লাস্টিক, সামনে পোকার': বাস হেলপারদের আরও যত সাংকেতিক
            কথাবার্তা
          </Typography>
          <Typography
            variant="body1"
            sx={{ fontSize: "1.1rem", lineHeight: 1.8 }}
          >
            দিনে দিনে ঢাকার রাস্তায় গাড়ি বাড়ছিল, বাড়ছিল মানুষ। বাসের ভেতরে
            আর বাইরে রাস্তার রাগঝাড়-মাঠি ও বাড়ছিল। ওস্তাদ ও হেলপারদের
            চোক্ষ-কান। কালো প্লাস্টিক টানলেই বুঝা যাবে পাশের রিকশা, বামে
            প্রাইভেট কার।
          </Typography>
        </Grid>

        {/* Image Section */}
        <Grid item xs={12} md={5}>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Image
              src={busImage}
              alt="Bus Image"
              width={500}
              height={300}
              style={{ maxWidth: "100%", height: "auto" }}
            />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Feature;
