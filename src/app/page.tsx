import Categories from "@/components/home/Categories";
import { Button } from "@mui/material";
import Image from "next/image";

export default function Home() {
  return (
    <Button variant="contained">
      <Categories />
    </Button>
  );
}
