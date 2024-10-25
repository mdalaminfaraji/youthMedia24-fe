import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/home/navbar";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { ApolloProvider } from "@apollo/client";
import apolloClient from "@/lib/apolloClient";
const theme = createTheme({
  palette: {
    mode: "light",
  },
});
export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="">
        <ApolloProvider client={apolloClient}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Navbar /> {children}
          </ThemeProvider>
        </ApolloProvider>
      </body>
    </html>
  );
}
