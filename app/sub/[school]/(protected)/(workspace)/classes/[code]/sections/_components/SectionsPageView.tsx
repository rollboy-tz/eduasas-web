'use client'
import { ClassProfile } from "@/types/school";
import { useClassSections } from "@/hooks/school/useClassSections";
import { SectionCard } from "./SectionCard";

interface SectionsPageViewProps {
    currentClass: ClassProfile;
}

export const SectionsPageView = ({ currentClass }: SectionsPageViewProps) => {
    const { classSections, isLoading } = useClassSections(currentClass.id);

    return (
        <div className="w-full flex flex-col gap-4">
            {/* Header / Meta info */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Class Sections ({classSections?.length || 0})
                </h3>
            </div>

            {/* Responsive Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
                {classSections?.map((section) => (
                    <SectionCard key={section.id} section={section} />
                ))}
            </div>
        </div>
    );
};