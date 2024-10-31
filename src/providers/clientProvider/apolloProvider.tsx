"use client";
import React from "react";
import apolloClient from "@/lib/apolloClient";
import { ApolloProvider as GraphQlApolloProvider } from "@apollo/client";
import ThemeProvider from "./themeProvider";

const ApolloProvider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <GraphQlApolloProvider client={apolloClient}>
      <ThemeProvider>{children}</ThemeProvider>
    </GraphQlApolloProvider>
  );
};

export default ApolloProvider;
