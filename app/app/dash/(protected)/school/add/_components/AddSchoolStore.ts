import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
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

/**
 * ONGEZO: `persist` kwa sessionStorage.
 *
 * Kabla: mtumiaji akijaza step 1-3 kisha akaburuza page kwa bahati mbaya
 * (au akafunga tab kimakosa), maendeleo yote yalipotea - lazima aanze upya.
 * sessionStorage inahifadhi ndani ya tab hiyo hiyo tu (inafutika tab
 * ikifungwa kabisa) - suluhisho la katikati kati ya localStorage (inabaki
 * milele, hatari kwa data ya usajili) na hakuna persistence kabisa.
 */
export const useAddSchoolStore = create<AddSchoolStore>()(
  persist(
    (set) => ({
      ...initialFormData,
      currentStep: 1,

      setStepData: (data) => set((state) => ({ ...state, ...data })),

      nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),

      prevStep: () => set((state) => ({ currentStep: Math.max(1, state.currentStep - 1) })),

      resetStore: () => set({ ...initialFormData, currentStep: 1 }),
    }),
    {
      name: "add-school-form",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);