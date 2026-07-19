"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils/helper";
import { useAppStore } from "@/store/layout"; // Hakikisha path ni sahihi
import { CollectionHelper } from "@/lib/utils";

export interface Column<T> {
  header: string;
  /** Class name ya colum */
  className?: string;
  /** Hii hutumika na vitu vyenye priority ya pili kwanza ni hama main title status */
  isPrimary?: boolean;
  /** Hii hutumika na vitu vyenye priority ya pili kama status */
  isSecondary?: boolean;
  /** Pitisha true ni muhimu kwa ajili ya mpangilio wa card view hii itatuonesha kuwa ni action button */
  isAction?: boolean;
  /** Pitisha primary ikiwa data hii sio lazima kuonekana kwenye card mode itaweka vie more */
  mobileMode?: "summary" | "expanded";
  /** ClassName za data cells wakati wa card view */
  dataCellClasses?: string;
  /** ClassName za header cells wakati wa card view */
  headerCellClasses?: string;
  /** ClassName za date rows za card view wakati column zip in card mode*/
  cardRowClasses?: string;
  /** Remder vell contents */
  render: (item: T, index: number) => React.ReactNode;
}

interface SmartResponsiveListProps<T> {
  data: T[];
  columns: Column<T>[];
  rowKey: keyof T | ((item: T, index: number) => string);
  isLoading?: boolean;
  onRowClick?: (item: T) => void;
  /** Table body / card wrapper bo effect kwe vioo vidogo */
  bodyClassName?: string;
  /** Table-row kwa vifaa vikubwa */
  rowClassName?: string;
  /** Card view classname in small device */
  cardClassName?: string;
  /** card header point classNames */
  cardHeaderClassName?: string;
  /** Card rows classes */
  cardRowsClassName?: string;
  /** Card class name */
  stickyHeaderClassName?: string;
  /** Container class name */
  className?: string;
  /** Dis-Able table */
  disAbleTable?: boolean;
  /** Empty state content */
  EmptyState?: React.ReactNode;
}

export function SmartResponsiveList<T>({
  data, columns, rowKey, isLoading, onRowClick, disAbleTable,
  bodyClassName, rowClassName, stickyHeaderClassName, className,
  EmptyState, cardClassName, cardHeaderClassName, cardRowsClassName
}: SmartResponsiveListProps<T>) {

  const isMobile = disAbleTable ?? useAppStore((state) => state.isMobileView);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  const getKey = (item: T, index: number) => typeof rowKey === "function" ? rowKey(item, index) : String(item[rowKey]);

  // Render Skeleton
  if (isLoading) {
    return (
      <div className={cn("w-full card-surface bg-card border border-border/40 shadow-sm", className)}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center py-4 px-5 gap-4 border-b border-border">
            {columns.map((col, j) => <div key={j} className={cn("h-4 rounded skeleton animate-shimmer", col.className || "flex-1")} />)}
          </div>
        ))}
      </div>
    );
  }

  if (!isLoading && (!data || data.length === 0)) {
    return <>{EmptyState ? EmptyState : <div className="bg-card w-full h-full p-10 grid place-items-center text-center text-lg font-bold text-primary-foreground">No Data Found!</div>}</>
  }

  // CARD VIEW (Mobile Mode)
  if (isMobile) {
    return (
      <div className={cn("flex flex-col gap-3")}>
        {data.map((item, index) => {
          const id = getKey(item, index);
          const isExpanded = expanded[id];
          const primary = columns.find(c => c.isPrimary);
          const secondary = columns.find(c => c.isSecondary);
          const action = columns.find(c => c.isAction);
          const hasSummary = columns.some(c => c.mobileMode === "summary");

          return (
            <div key={id} onClick={() => onRowClick?.(item)} className={cn("bg-card border border-border p-1 rounded shadow-sm", cardClassName)}>
              {/* Header: Primary, Secondary, Action */}
              <div className={cn("flex justify-between items-center mb-4", cardHeaderClassName)}>
                <div className="font-bold flex-1">{primary?.render(item, index)}</div>
                <div className="flex items-center gap-3">
                  {secondary?.render(item, index)}
                  {action?.render(item, index)}
                </div>
              </div>

              {/* Data Grid */}
              <div className="space-y-2">
                {columns
                  .filter((c) => {
                    if (c.isPrimary || c.isSecondary || c.isAction) return false;
                    if (isExpanded) { return true } else { return c.mobileMode !== "summary" }
                  })
                  .map((col, i, filteredArray) => (
                    <div key={i} className={
                      cn("flex justify-between border-b border-border py-1",
                      CollectionHelper.isLast(filteredArray, i) && "border-b-0",
                      cardRowsClassName, col.cardRowClasses
                      )}>
                      <span className={cn("flex-1 text-sm font-medium", col.headerCellClasses)}>
                        {col.header}
                      </span>
                      <span className={cn("flex-1 text-sm font-medium", col.dataCellClasses)}>
                        {col.render(item, index)}
                      </span>
                    </div>
                  ))}
              </div>

              {hasSummary && (
                <div className="w-full flex items-center justify-center p-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleExpand(id); }}
                    className={cn(
                      "text-sm font-medium rounded-full px-3 py-1.5 text-center",
                      "text-primary-foreground/90 hover:text-primary-foreground ",
                      "hover:bg-ring hover:shadow-sm transision-all duration-300"
                    )}>
                    {isExpanded ? "View less" : "View more"}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  // DESKTOP/TABLET VIEW (Sticky Column Table)
  return (
    <div className={cn("w-full card-surface overflow-hidden bg-card border border-border/40 shadow-sm", className)}>
      <div className={cn("sticky top-0 z-20 flex items-center bg-secondary border-b border-border py-3.5 px-5", stickyHeaderClassName)}>
        {columns.map((col, i) => <div key={i} className={cn("text-[13px] font-semibold uppercase opacity-80", col.className || "flex-1")}>{col.header}</div>)}
      </div>

      <div className={cn("w-full divide-y border-t border-border", bodyClassName)}>
        {data.map((item, index) => (
          <div key={getKey(item, index)} onClick={() => onRowClick?.(item)} className={cn("flex items-center py-4 px-5 hover:bg-item-hover", rowClassName)}>
            {columns.map((col, i) => <div key={i} className={cn("min-w-0 truncate", col.className || "flex-1")}>{col.render(item, index)}</div>)}
          </div>
        ))}
      </div>
    </div>
  );
}