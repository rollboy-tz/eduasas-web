"use client";

import React from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import Selecto from "react-selecto";

/**
 * @interface InteractionContainerProps
 * @description Mipangilio ya udhibiti wa interaction ndani ya list.
 */
interface InteractionContainerProps {
  /** Maudhui ya ndani (kadi za masomo) */
  children: React.ReactNode;
  /** Kitambulisho cha kipekee kwa ajili ya list ya DND */
  items: string[];
  /** Washa/Zima Drag and Drop */
  enableDrag?: boolean;
  /** Washa/Zima Selection (Lasso) */
  enableSelect?: boolean;
  /** Callback pale Drag inapokamilika */
  onDragEnd?: (event: any) => void;
  /** Callback pale Selection inapobadilika */
  onSelect?: (ids: string[]) => void;
  /** CSS Selector ya container (kwa ajili ya Selecto boundary) */
  containerSelector?: string;
}

/**
 * @component InteractionContainer
 * @description Hii ni Orchestrator wrapper. Inasimamia logic zote za Drag-and-Drop 
 * na Selection. Inatumia "Feature Flags" (enableDrag, enableSelect) ili 
 * kudhibiti utendaji kwa usahihi.
 * * @example
 * <InteractionContainer 
 * items={subjectIds} 
 * enableDrag={true} 
 * enableSelect={true}
 * >
 * <div className="my-list-container">
 * {subjects.map(s => <SelectoList ... />)}
 * </div>
 * </InteractionContainer>
 */
export function InteractionContainer({ 
  children, 
  items,
  enableDrag = true, 
  enableSelect = true,
  onDragEnd,
  onSelect,
  containerSelector = ".interaction-container"
}: InteractionContainerProps) {
  
  return (
    <>
      {/* 1. DND Engine - Ina-render tu kama enableDrag ni true */}
      {enableDrag ? (
        <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={items} strategy={verticalListSortingStrategy}>
            {enableSelect ? (
              <SelectoContainer containerSelector={containerSelector} onSelect={onSelect}>
                {children}
              </SelectoContainer>
            ) : (
              children
            )}
          </SortableContext>
        </DndContext>
      ) : (
        /* Kama Drag imezimwa lakini Select bado inahitajika */
        enableSelect ? (
          <SelectoContainer containerSelector={containerSelector} onSelect={onSelect}>
            {children}
          </SelectoContainer>
        ) : (
          children
        )
      )}
    </>
  );
}

/**
 * @internal Sub-component ya kutenga logic ya Selecto
 */
function SelectoContainer({ containerSelector, onSelect, children }: any) {
  return (
    <>
      <Selecto
        dragContainer={containerSelector}
        selectableTargets={[".selecto-item"]}
        selectByClick={true}
        selectFromInside={true}
        onSelect={(e) => onSelect?.(e.added.map(el => el.getAttribute('data-selecto-target')!))}
      />
      {children}
    </>
  );
}