import React from "react";
import { ClassSections } from "@/types/school";
import { Users, Layers } from "lucide-react";

interface SectionCardProps {
  section: ClassSections;
  onSelect?: (section: ClassSections) => void;
}

export const SectionCard = ({ section, onSelect }: SectionCardProps) => {
  const capacity = section.capacity || 0;
  const current = section.currentStudents || 0;
  const available = section.availableSlots ?? Math.max(0, capacity - current);

  // Kipimo cha asilimia ya darasa lilivyojaa
  const fillPercentage = capacity > 0 ? Math.min(100, Math.round((current / capacity) * 100)) : 0;

  return (
    <div 
      onClick={() => onSelect?.(section)}
      className="group relative rounded-md bg-white border border-slate-200/80 p-3.5 hover:border-blue-400 hover:shadow-sm transition-all duration-200 flex flex-col justify-between gap-3 cursor-pointer"
    >
      {/* Header: Section Name & Stream Badge */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col">
          <h4 className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
            {section.name}
          </h4>
          {section.stream?.name && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 mt-0.5">
              <Layers className="h-3 w-3 text-slate-400" />
              {section.stream.name}
              {section.stream.code && (
                <span className="text-[10px] font-mono text-slate-400">
                  ({section.stream.code})
                </span>
              )}
            </span>
          )}
        </div>

        {/* Capacity Percentage Badge */}
        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
            fillPercentage >= 90
              ? "bg-rose-50 text-rose-600 border border-rose-100"
              : fillPercentage >= 75
              ? "bg-amber-50 text-amber-600 border border-amber-100"
              : "bg-emerald-50 text-emerald-600 border border-emerald-100"
          }`}
        >
          {fillPercentage}% Full
        </span>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-100 bg-slate-50/50 rounded-sm px-2">
        <div className="flex flex-col">
          <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
            Capacity
          </span>
          <span className="text-xs font-semibold text-slate-700 font-mono">
            {capacity}
          </span>
        </div>

        <div className="flex flex-col border-x border-slate-200/60 px-2">
          <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
            Enrolled
          </span>
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3 text-slate-500" />
            <span className="text-xs font-bold text-slate-900 font-mono">
              {current}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-end">
          <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
            Available
          </span>
          <span
            className={`text-xs font-semibold font-mono ${
              available === 0 ? "text-rose-600 font-bold" : "text-slate-700"
            }`}
          >
            {available}
          </span>
        </div>
      </div>

      {/* Progress Bar Ndogo */}
      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${
            fillPercentage >= 90
              ? "bg-rose-500"
              : fillPercentage >= 75
              ? "bg-amber-500"
              : "bg-blue-600"
          }`}
          style={{ width: `${fillPercentage}%` }}
        />
      </div>
    </div>
  );
};