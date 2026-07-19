/**
 * @fileoverview SelectoList Wrapper
 * @description Headless wrapper inayotoa uwezo wa Drag, Select, na Long-Press.
 * Haijumuishi CSS yoyote ya ndani, hivyo inatoa uhuru kamili wa UI.
 */

"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface SelectoListProps<T> {
  /** Data ya kitu husika */
  item: T;
  /** Unique ID kwa ajili ya DND na Selection */
  id: string;
  /** Hali ya kuchaguliwa */
  isSelected: boolean;
  /** Kama kadi imefungwa (disabled) */
  disabled?: boolean;
  /** Callback pale kadi inapobonyezwa */
  onToggle: (id: string) => void;
  /** Callback pale kadi inapobonyezwa kwa muda mrefu (Mobile) */
  onLongPress: (id: string) => void;
  /** Render prop function inayotoa control kamili ya UI */
  children: (props: {
    item: T;
    attributes: any;
    listeners: any;
    setNodeRef: (node: HTMLElement | null) => void;
    style: React.CSSProperties;
    isSelected: boolean;
    isDragging: boolean;
  }) => React.ReactNode;
}

/**
 * SelectoList - Wrapper inayoweza kuburutika na kuchaguliwa.
 * * @example
 * <SelectoList 
 * item={subject}
 * id={subject.id}
 * isSelected={selectedIds.includes(subject.id)}
 * onToggle={handleToggle}
 * onLongPress={handleLongPress}>
 * {(props) => (
 * <div 
 *  // Lazima upachike attributes na listeners ili Drag ifanye kazi
 *  {...props.attributes} 
 *  {...props.listeners} 
 *  // Hapa una apply style za SelectoList (kama transform ya DND)
 *  style={props.style}
 *  // Hapa una-customize UI yako kulingana na props za ndani
 *  className={`p-4 rounded border transition-colors ${
 *   props.isSelected ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200'
 *  }`}>
 *  <div className="flex items-center">
 *  <h3>{subject.name}</h3>
 *  <p>{subject.code}</p>
 *  </div>
 *  )}
 *  </SelectoList>
 */
export function SelectoList<T>({ 
  item, id, isSelected, disabled = false, onToggle, onLongPress, children 
}: SelectoListProps<T>) {
  
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: disabled ? 'not-allowed' : 'grab',
  };

  const [timer, setTimer] = React.useState<NodeJS.Timeout | null>(null);

  const startPress = () => !disabled && setTimer(setTimeout(() => onLongPress(id), 500));
  const cancelPress = () => timer && clearTimeout(timer);

  return (
    <div
      ref={setNodeRef}
      data-selecto-target={id}
      onClick={() => !disabled && onToggle(id)}
      onMouseDown={startPress}
      onMouseUp={cancelPress}
      onTouchStart={startPress}
      onTouchEnd={cancelPress}
      className="select-none"
    >
      {children({
        item,
        attributes,
        listeners,
        setNodeRef,
        style,
        isSelected,
        isDragging
      })}
    </div>
  );
}