/* eslint-disable @typescript-eslint/no-explicit-any */

import { GET_ALL_ARTICLES } from '@/graphql/queries/articles';
import apolloClient from '@/lib/apolloClient';
import { create } from 'zustand';


interface Article {
  documentId: string;
  description: string;
  cover: {
    url: string;
  };
  createdAt: string;
  title: string;
  category: {
    name: string;
  };
}

interface ArticleStore {
  articles: Article[];
  loading: boolean;
  error: string | null;
  locale: string;
  fetchArticles: (locale?: string) => Promise<void>;
}

export const useArticleStore = create<ArticleStore>((set, get) => ({
  articles: [],
  loading: false,
  error: null,
  locale: 'bn',


  fetchArticles: async (locale?: string) => {
    set({ loading: true, error: null });
    const currentLocale = locale || get().locale;

    try {
      const { data } = await apolloClient.query({
        query: GET_ALL_ARTICLES,
        variables: { locale: currentLocale },
      });
      set({ articles: data.articles, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },


}));
