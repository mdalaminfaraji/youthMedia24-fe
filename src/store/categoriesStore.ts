import { GET_ALL_CATEGORIES } from "@/graphql/queries/categories";
import apolloClient from "@/lib/apolloClient";
import { create } from "zustand";

// Define Category type
interface Category {
  documentId: string;
  name: string;
  description: string;
  locale: string;
}

// Define Zustand store state and actions
interface CategoryStore {
  categories: Category[];
  loading: boolean;
  error: string | null;
  fetchCategories: (locale: string) => Promise<void>;
}

// Create Zustand store
export const useCategoryStore = create<CategoryStore>((set) => ({
  categories: [],
  loading: false,
  error: null,
  fetchCategories: async (locale: string) => {
    set({ loading: true, error: null });

    try {
      const { data } = await apolloClient.query({
        query: GET_ALL_CATEGORIES,
        variables: { locale },
      });
      set({ categories: data.categories, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },
}));
