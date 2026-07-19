import { create } from "zustand";
import { SchoolCategory, SchoolCategoriesState } from "@/types/portal/school-categories.types";

interface SchoolCategoriesStore extends SchoolCategoriesState {
  setCategories: (categories: SchoolCategory[]) => void;
  setLoading: (status: boolean) => void;
  setError: (message: string | null) => void;
}

export const useSchoolCategoriesStore = create<SchoolCategoriesStore>((set) => ({
  categories: [],
  isLoading: false,
  error: null,

  setCategories: (categories) => set({ categories, isLoading: false, error: null }),
  setLoading: (status) => set({ isLoading: status }),
  setError: (message) => set({ error: message, isLoading: false }),
}));