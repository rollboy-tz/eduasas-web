/**
 * @fileoverview School Class Schema Types
 * @description Inafafanua muundo wa madarasa (School Classes) na sections zake.
 */

export interface ClassSection {
    id: string;
    schoolUId: string;
    classId: string;
    name: string;
    stream: string | null;
    capacity: number;
    classTeacherId: string | null;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface SchoolClass {
    id: string;
    schoolUId: string;
    academicYearId: string;
    status: 'created' | 'active' | 'archived'; // Unaweza kuongeza statuses nyingine kama zipo
    classCode: string;
    classCategory: 'PRIMARY' | 'O-LEVEL' | 'A-LEVEL';
    gradingRuleId: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    displayName: string;
    shortName: string;
    sections: ClassSection[];
  }
  
  // Kwa ajili ya API response inayorudisha array ya madarasa
  export interface SchoolClassesResponse {
    data: SchoolClass[];
  }