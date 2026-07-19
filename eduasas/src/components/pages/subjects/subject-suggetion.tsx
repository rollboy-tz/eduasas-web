"use client";

import React, { useState, useEffect } from "react";
import { SubjectSuggestion } from "@/types/school";
import { FlowList } from "./elements/smart-flow-list";
import { SelectoWrapper } from "./elements/selecto-wrapper";

interface SubjectSuggestionContainerProps {
  suggestedSubjects: SubjectSuggestion[];
  onSelect: (ids: string[]) => void;
}

export function SubjectSuggestionContainer({ suggestedSubjects, onSelect }: SubjectSuggestionContainerProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Boresho: Hapa ndipo tunapomshitua jamaa kule nje kila state inapobadilika
  useEffect(() => {
    onSelect(selectedIds);
  }, [selectedIds, onSelect]);

  const handleToggle = (id: string) => {
    setSelectedIds((prev) => {
      const isAlreadySelected = prev.includes(id);
      return isAlreadySelected ? prev.filter((i) => i !== id) : [...prev, id];
    });
  };

  const handleLongPress = (id: string) => {
    setSelectedIds((prev) => prev.filter((item) => item !== id));
  };

  return (
    <SelectoWrapper
      onSelect={(ids) => {
        setSelectedIds((prev) => {
          const nextIds = new Set([...prev, ...ids]);
          return Array.from(nextIds);
        });
      }}
    >
      <div className="selecto-list-container">
        <FlowList
          subjects={suggestedSubjects}
          selectedIds={selectedIds}
          onToggle={handleToggle}
          onLongPress={handleLongPress}
        />
      </div>
    </SelectoWrapper>
  );
}