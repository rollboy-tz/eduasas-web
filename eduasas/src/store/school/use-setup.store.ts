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
  terms: [
    { name: "Term 1", startDate: "", endDate: "", order: 1, isCurrent: true },
  ],
  primaryGrading: "",
};

export const useSchoolSetupStore = create<SchoolSetupStore>((set) => ({
  ...initialState,

  // --- NAVIGATION ACTIONS ---
  setStep: (step) => set({ currentStep: step }),
  nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
  prevStep: () => set((state) => ({ currentStep: state.currentStep - 1 })),

  // --- DATA ACTIONS ---
  updateYear: (data) =>
    set((state) => ({
      year: { ...state.year, ...data },
    })),

  // Imeboreshwa: Inazalisha terms ikiweka na "order" kiotomatiki
  initializeTerms: (count: number) =>
    set((state) => {
      const newTerms = Array.from({ length: count }, (_, i) => ({
        name: count <= 2 ? (i === 0 ? "First Term" : "Second Term") : `Term ${i + 1}`,
        startDate: "",
        endDate: "",
        order: i + 1, // Mfano: i=0 inakuwa order=1, i=1 inakuwa order=2
        isCurrent: i === 0,
      }));
      return { terms: newTerms };
    }),

  // Imeboreshwa: Inahakikisha hata zikitoka nje, 'order' inajipanga upya kulingana na index
  setTerms: (terms) =>
    set({
      terms: terms.map((term, i) => ({
        ...term,
        order: i + 1,
      })),
    }),

  // Imeboreshwa: Inapata order sahihi kwa kuhesabu urefu wa sasa + 1
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
            order: nextOrder, // Inajaza order inayofuata
            isCurrent: false,
          },
        ],
      };
    }),

  // Imeboreshwa: Ikifuta, inazipanga upya order zilizobaki zisiruke namba (e.g., 1, 3 iwe 1, 2)
  removeTerm: (index) =>
    set((state) => {
      const filteredTerms = state.terms.filter((_, i) => i !== index);
      // Re-index order baada ya kufuta
      const reOrderedTerms = filteredTerms.map((term, i) => ({
        ...term,
        order: i + 1,
      }));
      return { terms: reOrderedTerms };
    }),

  updateTerm: (index, data) =>
    set((state) => {
      let newTerms = [...state.terms];

      // Kama data inayokuja ni isCurrent: true, zizime zingine kwanza
      if (data.isCurrent === true) {
        newTerms = newTerms.map((t, i) => ({
          ...t,
          isCurrent: i === index,
        }));
      }

      // Update data ya term husika na kuhakikisha order haipotei
      newTerms[index] = { ...newTerms[index], ...data };

      return { terms: newTerms };
    }),

  setGrading: (code) => set({ primaryGrading: code }),

  // --- RESET ---
  resetSetup: () => set(initialState),
}));