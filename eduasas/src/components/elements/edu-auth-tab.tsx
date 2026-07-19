"use client";

import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface TabOption {
  value: string;
  label: string;
}

interface EduAuthTabsProps {
  options: TabOption[];
  defaultValue?: string;
  onValueChange: (value: string) => void;
  className?: string;
}

export const EduAuthTabs = ({
  options,
  defaultValue,
  onValueChange,
  className,
}: EduAuthTabsProps) => {
  return (
    <Tabs 
      defaultValue={defaultValue} 
      onValueChange={onValueChange} 
      className={cn("w-full bg-inherit", className)}
    >
      <TabsList className="flex w-full bg-inherit  rounded-none p-0 h-auto mb-6">
        {options.map((option) => (
          <TabsTrigger
            key={option.value}
            value={option.value}
            className={cn(
              "flex-1 py-3 text-[11px] font-bold uppercase tracking-wider transition-all rounded-none bg-inherit outline-none",
              "text-slate-400 data-[state=active]:text-primary",
              "border-b-2 border-transparent",
              "data-[state=active]:border-b-primary",
              "dark:data-[state=active]:border-b-primary",
              "data-[state=active]:shadow-none shadow-none hover:shadow-none"
            )}
          >
            {option.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};