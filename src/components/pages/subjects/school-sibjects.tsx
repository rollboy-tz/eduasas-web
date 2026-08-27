"use client";

import React, { useState, useEffect } from "react";
import { RegisteredSubject } from "@/types/school";
import { ActiveFlowList } from "./elements/ActiveFlowList";

interface SubjectsContainerProps {
  registeredSubjects: RegisteredSubject[];
  onSelect: (ids: string[]) => void;
}

export function SubjectsContainer({ registeredSubjects, onSelect }: SubjectsContainerProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Tuma IDs zilizochaguliwa kwenda parent component state inapobadilika
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
    <div className="selecto-list-container">
      <ActiveFlowList
        subjects={registeredSubjects}
        selectedIds={selectedIds}
        onToggle={handleToggle}
        // onLongPress={handleLongPress}
      />
    </div>
  );
}