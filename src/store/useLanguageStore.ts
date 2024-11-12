import { create } from 'zustand';

interface LanguageStore {
  locale: string;
  toggleLocale: () => void;
}

export const useLanguageStore = create<LanguageStore>((set) => ({
  locale: 'bn', 
  toggleLocale: () =>
    set((state) => ({
      locale: state.locale === 'bn' ? 'en' : 'bn',
    })),
}));
