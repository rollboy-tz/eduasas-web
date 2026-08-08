"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils/helper";
import { useAppStore } from "@/store/layout";
import { CollectionHelper } from "@/lib/utils";

/**
 * Mfumo wa usanidi wa safu (Column Configuration) ya SmartResponsiveList.
 * @template T Aina ya data inayowekwa kwenye list/table.
 */
export interface ResponsiveListColumn<T> {
  /** Jina au anwani ya safu inayotokea kwenye header */
  header: string;

  /** ClassName za Tailwind kwa ajili ya kuseti upana au mtindo wa column kwny Desktop */
  className?: string;

  /** 
   * Ikiwa `true`, data hii itatumika kama kichwa kikuu cha kadi kwenye mwonekano wa simu (Mobile Card Header).
   */
  isPrimary?: boolean;

  /** 
   * Ikiwa `true`, data hii itawekwa pembeni ya kichwa kikuu kwenye mwonekano wa simu (mf. Status Badge).
   */
  isSecondary?: boolean;

  /** 
   * Ikiwa `true`, itachukuliwa kama kitufe cha vitendo (Action Button) kwenye kadi ya simu na kuwekwa kulia juu.
   */
  isAction?: boolean;

  /** 
   * Inafafanua jinsi safu inavyoonekana kwenye mwonekano wa simu:
   * - `summary`: Itaonekana mara moja.
   * - `expanded`: Itafichwa hadi mtumiaji abonyeze "View more".
   */
  mobileMode?: "summary" | "expanded";

  /** ClassName za Tailwind kwa ajili ya kisanduku cha data (Data cell) kwenye mwonekano wa kadi */
  dataCellClasses?: string;

  /** ClassName za Tailwind kwa ajili ya lebo ya header kwenye mwonekano wa kadi */
  headerCellClasses?: string;

  /** ClassName za Tailwind kwa ajili ya safu nzima ya kadi (Card Row) */
  cardRowClasses?: string;

  /** 
   * Function inayorejesha Element ya React/JSX ya kutoa data husika kwenye seli.
   * @param item Object ya data husika.
   * @param index Nambari ya nafasi ya data kwenye mfululizo.
   */
  render: (item: T, index: number) => React.ReactNode;
}

/**
 * Props za component ya SmartResponsiveList.
 * @template T Aina ya data inayowekwa kwenye mfululizo.
 */
interface SmartResponsiveListProps<T> {
  /** Mfululizo wa data unaotakiwa kuonyeshwa */
  data: T[];

  /** Usanidi wa safu (Columns Configuration) */
  columns: ResponsiveListColumn<T>[];

  /** 
   * Ufunguo wa kipekee kwa kila safu. Inaweza kuwa jina la field mf. `"id"` au function `.
   */
  rowKey: keyof T | ((item: T, index: number) => string);

  /** Hali ya upakiaji wa data (Loading State) */
  isLoading?: boolean;

  /** Tendo linalotokea mtumiaji akibonyeza safu/kadi */
  onRowClick?: (item: T) => void;

  /** ClassName za ziada kwa ajili ya mwili wa table (Table Body) */
  bodyClassName?: string;

  /** ClassName za ziada kwa ajili ya kila safu (Table Row) kwenye Desktop */
  rowClassName?: string;

  /** ClassName za ziada kwa ajili ya muundo wa kadi kwenye simu */
  cardClassName?: string;

  /** ClassName za ziada kwa ajili ya sehemu ya juu ya kadi (Card Header) */
  cardHeaderClassName?: string;

  /** ClassName za ziada kwa ajili ya mstari wa data kwenye kadi */
  cardRowsClassName?: string;

  /** ClassName za ziada kwa ajili ya Header iliyoganda juu (Sticky Header) */
  stickyHeaderClassName?: string;

  /** ClassName kuu ya kontena zima */
  className?: string;

  /** Ikiwa `true`, italazimisha mwonekano wa Kadi (Mobile View) bila kujali ukubwa wa skrini */
  disAbleTable?: boolean;

  /** Component ya kuonyesha iwapo hakuna data iliyopatikana */
  EmptyState?: React.ReactNode;
}

/**
 * Component inayobadilika kiotomatiki kati ya Table (kwa skrini kubwa) na Cards (kwa skrini ndogo/simu).
 * 
 * @example
 * ```tsx
 * <SmartResponsiveList * columns="{userColumns}" data="{users}" rowKey="id"/>
 * ```
 */
export function SmartResponsiveList<T>({
  data,
  columns,
  rowKey,
  isLoading,
  onRowClick,
  disAbleTable,
  bodyClassName,
  rowClassName,
  stickyHeaderClassName,
  className,
  EmptyState,
  cardClassName,
  cardHeaderClassName,
  cardRowsClassName,
}: SmartResponsiveListProps<T>) {
  const isMobile = disAbleTable ?? useAppStore((state) => state.isMobileView);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  const getKey = (item: T, index: number) =>
    typeof rowKey === "function" ? rowKey(item, index) : String(item[rowKey]);

  // Loading Skeleton
  if (isLoading) {
    return (
      <div className={cn("card-surface bg-card border-border/40 w-full border shadow-sm", className)}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="border-border flex items-center gap-4 border-b px-5 py-4">
            {columns.map((col, j) => (
              <div
                key={j}
                className={cn("skeleton animate-shimmer h-4 rounded", col.className || "flex-1")}
              />
            ))}
          </div>
        ))}
      </div>
    );
  }

  // Empty State
  if (!isLoading && (!data || data.length === 0)) {
    return (
      <>
        {EmptyState ? (
          EmptyState
        ) : (
          <div className="bg-card text-primary-foreground grid h-full w-full place-items-center p-10 text-center text-lg font-bold">
            No Data Found!
          </div>
        )}
      </>
    );
  }

  // MOBILE CARD VIEW
  if (isMobile) {
    return (
      <div className="flex flex-col gap-3">
        {data.map((item, index) => {
          const id = getKey(item, index);
          const isExpanded = expanded[id];
          const primary = columns.find((c) => c.isPrimary);
          const secondary = columns.find((c) => c.isSecondary);
          const action = columns.find((c) => c.isAction);
          const hasExpandedFields = columns.some((c) => c.mobileMode === "expanded");

          return (
            <div
              key={id}
              onClick={() => onRowClick?.(item)}
              className={cn("bg-card border-border p-3 rounded-lg border shadow-sm", cardClassName)}
            >
              {/* Header: Primary Title, Secondary Badge, Action */}
              <div className={cn("mb-3 flex items-center justify-between gap-2", cardHeaderClassName)}>
                <div className="font-bold flex-1 truncate">{primary?.render(item, index)}</div>
                <div className="flex items-center gap-2">
                  {secondary?.render(item, index)}
                  {action?.render(item, index)}
                </div>
              </div>

              {/* Data Rows */}
              <div className="space-y-2">
                {columns
                  .filter((c) => {
                    if (c.isPrimary || c.isSecondary || c.isAction) return false;
                    return isExpanded ? true : c.mobileMode !== "expanded";
                  })
                  .map((col, i, filteredArray) => (
                    <div
                      key={i}
                      className={cn(
                        "border-border flex justify-between py-1.5 border-b text-sm",
                        CollectionHelper.isLast(filteredArray, i) && "border-b-0",
                        cardRowsClassName,
                        col.cardRowClasses
                      )}
                    >
                      <span className={cn("text-muted-foreground font-medium", col.headerCellClasses)}>
                        {col.header}
                      </span>
                      <span className={cn("font-medium text-right", col.dataCellClasses)}>
                        {col.render(item, index)}
                      </span>
                    </div>
                  ))}
              </div>

              {/* View More / View Less Toggle */}
              {hasExpandedFields && (
                <div className="mt-2 flex w-full items-center justify-center pt-1">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExpand(id);
                    }}
                    className={cn(
                      "text-xs font-semibold rounded-full px-3 py-1 transition-all duration-200",
                      "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    )}
                  >
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

  // DESKTOP TABLE VIEW
  return (
    <div className={cn("card-surface bg-card border-border/40 w-full overflow-hidden rounded-lg border shadow-sm", className)}>
      {/* Sticky Header */}
      <div className={cn("bg-secondary border-border sticky top-0 z-20 flex items-center border-b px-5 py-3.5", stickyHeaderClassName)}>
        {columns.map((col, i) => (
          <div
            key={i}
            className={cn("text-[13px] font-semibold uppercase opacity-80", col.className || "flex-1")}
          >
            {col.header}
          </div>
        ))}
      </div>

      {/* Body Rows */}
      <div className={cn("border-border divide-y border-t w-full", bodyClassName)}>
        {data.map((item, index) => (
          <div
            key={getKey(item, index)}
            onClick={() => onRowClick?.(item)}
            className={cn("hover:bg-accent/50 flex items-center px-5 py-4 transition-colors cursor-pointer", rowClassName)}
          >
            {columns.map((col, i) => (
              <div key={i} className={cn("min-w-0 truncate", col.className || "flex-1")}>
                {col.render(item, index)}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}