"use client";

import React, { useState } from "react";
import { useFloating, useClick, useDismiss, useInteractions, offset, flip, shift, autoUpdate } from "@floating-ui/react";
import { ChevronDown, Check, AlertCircle, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils/helper";

interface EduSelectProps<T> {
    options: T[];
    labelKey: keyof T;
    valueKey: keyof T;
    iconKey?: keyof T; // Key inayobeba icon component kwenye data yako
    startIcon?: React.ReactNode; // Icon ya nje ya container nzima
    label: string;
    placeholder?: string;
    onChange?: (item: T) => void;
    error?: string;
    size?: "sm" | "md" | "lg";
    labelStrategy?: "floating" | "fixed" | "none";
    className?: string;
    itemsContainerClassName?: string;
    itemClassName?: string;
    selectedClassName?: string;
    unSelectedClassName?: string;
}

export const SmartSelect = <T extends Record<string, any>>({
    options, labelKey, valueKey, iconKey, startIcon, label, placeholder = "Select...",
    onChange, error, size = "md", labelStrategy = "floating", unSelectedClassName,
    className, itemsContainerClassName, itemClassName, selectedClassName
}: EduSelectProps<T>) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState<T | null>(null);

    const { refs, floatingStyles, context } = useFloating({
        open: isOpen, onOpenChange: setIsOpen,
        middleware: [offset(8), flip(), shift()],
        whileElementsMounted: autoUpdate,
    });

    const click = useClick(context);
    const dismiss = useDismiss(context);
    const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss]);

    const sizeClasses = {
        sm: "h-9 text-xs rounded",
        md: "h-11 text-sm rounded-md",
        lg: "h-14 text-[15px] rounded-lg",
    };

    const floatingLabelLabel = () => {
        if(startIcon !== undefined && !isOpen) return "left-8";
        if(startIcon !== undefined && !selected) return "left-8"
        return "left-3"
    }

    // Render icon ya item kama ipo
    const renderItemIcon = (item: T) => {
        if (!iconKey || !item[iconKey]) return null;
        const IconComponent = item[iconKey] as LucideIcon;
        return <IconComponent size={16} className="mr-2" />;
    };

    return (
        <div className="relative w-full mb-1">
            {/* TRIGGER AREA */}
            <div
                ref={refs.setReference}
                {...getReferenceProps()}
                className={cn(
                    "flex items-center justify-between px-4 border cursor-pointer bg-card transition-all relative",
                    sizeClasses[size], isOpen ? "select-focus" : "",
                    error ? "border-red-500" : "border-slate-500/30 hover:border-primary",
                    startIcon ? "pl-10" : "pl-4", // Padding ya kushoto inategemea icon
                    className
                )}
            >
                {/* ICON YA NJE */}
                {startIcon && (
                    <span className="absolute left-3 text-muted pointer-events-none flex items-center">
                        {startIcon}
                    </span>
                )}

                <div className="flex items-center overflow-hidden w-full">
                    <span className={cn(selected ? "text-foreground" : "text-muted-foreground", "truncate")}>
                        {selected ? String(selected[labelKey]) : (labelStrategy === "floating" ? " " : placeholder)}
                    </span>
                </div>
                <ChevronDown size={16} className={cn("text-muted transition-transform ml-2", isOpen && "rotate-180")} />
            </div>

            {/* FLOATING LABEL */}
            {labelStrategy === "floating" && (
                <label className={cn(
                    "absolute px-1 bg-card transition-all pointer-events-none text-muted",
                    startIcon ? "left-8" : "left-3", // Label inahama kulingana na icon
                    (isOpen || selected) 
                        ? "-top-2.5 left-3 text-[11px] font-bold text-primary-foreground" 
                        : "top-1/2 -translate-y-1/2 text-sm"
                )}>
                    {label}
                </label>
            )}

            {isOpen && (
                <div
                    ref={refs.setFloating}
                    style={{ ...floatingStyles, width: refs.reference.current?.getBoundingClientRect().width }}
                    {...getFloatingProps()}
                    className={cn("z-[9999] bg-card border border-border rounded-md shadow-2xl p-1.5", itemsContainerClassName)}
                >
                    {options.map((item, idx) => {
                        const isSelected = selected?.[valueKey] === item[valueKey];
                        return (
                            <div key={idx} onClick={() => { setSelected(item); setIsOpen(false); onChange?.(item); }}
                                className={cn("p-2 cursor-pointer rounded-md flex items-center justify-between text-sm transition-all",
                                    isSelected ? `bg-ring text-primary-foreground font-semibold ${selectedClassName}` : `hover:bg-muted/20 ${unSelectedClassName}`,
                                    itemClassName
                                )}
                            >
                                <div className="flex items-center">
                                    {renderItemIcon(item)}
                                    {String(item[labelKey])}
                                </div>
                                {isSelected && <Check size={16} />}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};