import { create } from "zustand";
import { SchoolSetupStore } from "@/types/school/school-setup.types";

const initialYear = new Date().getFullYear();

const initialState = {
  currentStep: 1,
  year: {
    value: initialYear,
    startDate: "",
    endDate: "",
  },
  terms: [{ name: "Term 1", startDate: "", endDate: "", order: 1, isCurrent: true }],
  primaryGrading: "",
};

export const useSchoolSetupStore = create<SchoolSetupStore>((set) => ({
  ...initialState,

  // --- NAVIGATION ACTIONS ---
  setStep: (step) => set({ currentStep: step }),
  nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
  // BUG ILIYOREKEBISHWA: hakukuwa na floor guard - currentStep ingeweza
  // kwenda 0 au hasi (kama prevStep ingeitwa programmatically nje ya UI
  // ambayo tayari inazuia button kwenye step 1). SchoolSetupForm inatumia
  // `currentStep - 3` kuchagua term index - step hasi ingesababisha
  // `terms[negativeIndex]` (undefined) na step tupu isiyo na namna ya
  // kurudi. Sasa haiwezi kamwe kushuka chini ya 1 - sawa na useAddSchoolStore.
  prevStep: () => set((state) => ({ currentStep: Math.max(1, state.currentStep - 1) })),

  // --- DATA ACTIONS ---
  updateYear: (data) =>
    set((state) => ({
      year: { ...state.year, ...data },
    })),

  // Inazalisha terms ikiweka na "order" kiotomatiki
  initializeTerms: (count: number) =>
    set((state) => {
      const newTerms = Array.from({ length: count }, (_, i) => ({
        name: count <= 2 ? (i === 0 ? "First Term" : "Second Term") : `Term ${i + 1}`,
        startDate: "",
        endDate: "",
        order: i + 1,
        isCurrent: i === 0,
      }));
      return { terms: newTerms };
    }),

  // Inahakikisha hata zikitoka nje, 'order' inajipanga upya kulingana na index
  setTerms: (terms) =>
    set({
      terms: terms.map((term, i) => ({
        ...term,
        order: i + 1,
      })),
    }),

  // Inapata order sahihi kwa kuhesabu urefu wa sasa + 1
  addTerm: () =>
    set((state) => {
      const nextOrder = state.terms.length + 1;
      return {
        terms: [
          ...state.terms,
          {
            name: `Term ${nextOrder}`,
            startDate: "",
            endDate: "",
            order: nextOrder,
            isCurrent: false,
          },
        ],
      };
    }),

  // Ikifuta, inazipanga upya order zilizobaki zisiruke namba (e.g., 1, 3 iwe 1, 2)
  removeTerm: (index) =>
    set((state) => {
      const filteredTerms = state.terms.filter((_, i) => i !== index);
      const reOrderedTerms = filteredTerms.map((term, i) => ({
        ...term,
        order: i + 1,
      }));
      return { terms: reOrderedTerms };
    }),

  updateTerm: (index, data) =>
    set((state) => {
      let newTerms = [...state.terms];

      if (data.isCurrent === true) {
        newTerms = newTerms.map((t, i) => ({
          ...t,
          isCurrent: i === index,
        }));
      }

      newTerms[index] = { ...newTerms[index], ...data };

      return { terms: newTerms };
    }),

  setGrading: (code) => set({ primaryGrading: code }),

  // --- RESET ---
  resetSetup: () => set(initialState),
}));