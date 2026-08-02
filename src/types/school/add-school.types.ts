export type SchoolOwnership = "PRIVATE" | "GOVERNMENT";

export interface SchoolFormData {
  name: string;
  registrationNumber: string;
  schoolType: SchoolOwnership;
  categoryIds: string[]; 
  // Tunaruhusu null au string. "?" inamaanisha field inaweza isiwepo kabisa
  region?: string | null;
  district?: string | null;
  email?: string | null; 
  phone?: string | null;
}
export interface AddSchoolStore extends SchoolFormData {
  currentStep: number;
  // Actions
  setStepData: (data: Partial<SchoolFormData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  resetStore: () => void;
}