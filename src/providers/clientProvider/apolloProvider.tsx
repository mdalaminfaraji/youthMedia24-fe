"use client";
import React from "react";
import apolloClient from "@/lib/apolloClient";
import { ApolloProvider as GraphQlApolloProvider } from "@apollo/client";
import { ThemeProvider, createTheme } from "@mui/material";
const theme = createTheme({
  palette: {
    mode: "light",
  },
});
const ApolloProvider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <GraphQlApolloProvider client={apolloClient}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </GraphQlApolloProvider>
  );
};

export default ApolloProvider;
