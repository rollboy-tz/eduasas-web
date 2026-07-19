"use client";

import React, { ReactNode } from "react";
import { cn } from "@/lib/utils/helper";

/**
 * @typedef {Object} Column
 * @property {string} header - Jina la kichwa cha safu.
 * @property {string} [className] - Class za Tailwind za ku-customize upana (mfano: 'w-[50px]').
 * @property {boolean} [sticky] - Ikiwa 'true', safu hii itaganda upande wa kushoto wakati wa scroll.
 * @property {function(T, number): React.ReactNode} render - Function inayorejesha kile kitakachoonekana kwenye seli (cell).
 */

interface Column<T> {
  header: string;
  className?: string;
  sticky?: boolean;
  render: (item: T, index: number) => ReactNode;
}

interface SmartFlexTableProps<T> {
  data: T[];
  columns: Column<T>[];
  rowKey: keyof T | ((item: T, index: number) => string);
  selectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
  isLoading?: boolean;
  onRowClick?: (item: T) => void;
  emptyState?: ReactNode;
  className?: string;
  rowsClassName?: string;
  headerClassName?: string;
  selectedRowClassName?: string; // Class maalum kwa row iliyochaguliwa
  tableBodyClassName?: string;
}

/**
 * MFANO WA COLUMN YA SELECTION:
 * Tumia muundo huu kwenye safu ya kwanza ya columns zako ili kuwezesha 
 * mtumiaji kuchagua (select) safu mahususi za data.
 * * @example
 * const selectionColumn = {
 * header: "Select",
 * className: "w-[50px]",
 * sticky: true,
 * render: (item) => (
 * <input
 * type="checkbox"
 * className="cursor-pointer"
 * checked={selectedIds.includes(item.id)}
 * onChange={() => {
 * const newSelection = selectedIds.includes(item.id)
 * ? selectedIds.filter((id) => id !== item.id)
 * : [...selectedIds, item.id];
 * setSelectedIds(newSelection);
 * onSelectionChange?.(newSelection);
 * }}
 * />
 * ),
 * };
 */

export function SmartFlexTable<T>({
  data,
  columns,
  rowKey,
  selectedIds = [],
  onSelectionChange,
  isLoading,
  onRowClick,
  emptyState,
  className,
  rowsClassName,
  headerClassName,
  selectedRowClassName = "bg-primary/5",
  tableBodyClassName
}: SmartFlexTableProps<T>) {

  const getKey = (item: T, index: number): string =>
    typeof rowKey === "function" ? rowKey(item, index) : String(item[rowKey]);

  const [isScrolled, setIsScrolled] = React.useState(false);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setIsScrolled(e.currentTarget.scrollLeft > 0);
  };

  return (
    <div className={cn("w-full card-surface overflow-hidden bg-card border border-border/40 shadow-sm relative", className)}>
      <div className="overflow-x-auto custom-scrollbar" onScroll={handleScroll}>
        <div className="min-w-full inline-block align-middle">

          {/* HEADER */}
          <div className={cn("sticky top-0 z-20 flex bg-secondary border-b border-border", headerClassName)}>
            {columns.map((col, i) => (
              <div
                key={i}
                className={cn(
                  "py-3.5 px-5 text-[13px] font-semibold text-foreground uppercase tracking-tight",
                  col.className,
                  col.sticky && cn(
                    "sticky left-0 z-30 bg-secondary transition-shadow duration-300",
                    isScrolled && "shadow-[15px_0_20px_-10px_rgba(0,0,0,0.3)]"
                  )
                )}
              >
                {col.header}
              </div>
            ))}
          </div>

          {/* BODY */}
          <div className={cn("divide-y divide-border/40", tableBodyClassName)}>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, r) => (
                <div key={r} className="flex">
                  {columns.map((col, c) => (
                    <div key={c} className={cn("py-4 px-5 h-12 skeleton animate-shimmer", col.className)} />
                  ))}
                </div>
              ))
            ) : data.length === 0 ? (
              <div className="py-14 text-center text-muted-foreground">
                {emptyState || "Hakuna taarifa zilizopatikana."}
              </div>
            ) : (
              data.map((item, index) => {
                const id = getKey(item, index);
                const isSelected = selectedIds.includes(id);
              
                return (
                  <div
                    key={id}
                    onClick={() => {
                      // Ujanja: Ukibofya row, inatoggle selection
                      //toggleSelect(id);
                      onRowClick?.(item); // Bado inafanya kazi ya onRowClick
                    }}
                    className={cn(
                      "flex transition-colors hover:bg-item-hover",
                      isSelected && selectedRowClassName,
                      rowsClassName
                    )}
                  >
                    {columns.map((col, cIndex) => (
                      <div
                        key={cIndex}
                        className={cn(
                          "py-4 px-5 text-sm font-medium truncate bg-card",
                          col.className,
                          col.sticky && cn(
                            "sticky left-0 z-10 transition-shadow duration-300",
                            isScrolled && "shadow-[15px_0_20px_-10px_rgba(0,0,0,0.3)]"
                          )
                        )}
                      >
                        {col.render(item, index)}
                      </div>
                    ))}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}