import { create } from "zustand";
import { AddSchoolStore, SchoolFormData } from "@/types/school/add-school.types";

const initialFormData: SchoolFormData = {
  name: "",
  registrationNumber: "",
  schoolType: "PRIVATE",
  categoryIds: [],
  region: "",
  district: "",
  email: "",
  phone: "",
};

export const useAddSchoolStore = create<AddSchoolStore>((set) => ({
  ...initialFormData,
  currentStep: 1,

  setStepData: (data) => set((state) => ({ ...state, ...data })),
  
  nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
  
  prevStep: () => set((state) => ({ currentStep: Math.max(1, state.currentStep - 1) })),

  resetStore: () => set({ ...initialFormData, currentStep: 1 }),
}));