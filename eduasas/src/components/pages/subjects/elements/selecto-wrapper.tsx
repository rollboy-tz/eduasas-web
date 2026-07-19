"use client";

import React from "react";
import Selecto from "react-selecto";

interface InteractionWrapperProps {
  children: React.ReactNode;
  onSelect: (selectedIds: string[]) => void;
}

export function SelectoWrapper({ children, onSelect }: InteractionWrapperProps) {
  return (
    <>
      {children}
      {/* Selecto pekee - Bila Dnd-Kit */}
      <Selecto
        dragContainer={".selecto-list-container"}
        selectableTargets={[".selecto-list"]}
        selectByClick={true}
        selectFromInside={true}
        toggleContinueSelect={["shift", "meta", "ctrl"]}
        toggleContinueSelectWithoutDeselect={["shift", "meta", "ctrl"]}
        hitRate={50}
        onSelect={(e) => {
          const selected = e.added
            .map(el => el.getAttribute('data-id'))
            .filter((id): id is string => id !== null && id !== undefined);
          if (selected.length > 0) {
            onSelect(selected);
          }
        }}
      />
    </>
  );
}