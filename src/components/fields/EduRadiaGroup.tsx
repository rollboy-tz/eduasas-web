"use client";

import React, { JSX } from "react";
import { Check } from "lucide-react";

/**
 * Props definition for the AppleRadioGroup component.
 *
 * @template T - The shape of the data objects inside the options array.
 * @template K - The specific key of object T used as the value identifier.
 * 
 * @example
 * interface SetupOption {
  id: string;
  name: string;
  description: string;
  isRecommended?: boolean;
  price?: string;
  tag?: string;
}

const options: SetupOption[] = [
  {
    id: "basic",
    name: "Standard Academic Setup",
    description: "Configures basic terms and class streams.",
    price: "Free",
  },
  {
    id: "pro",
    name: "Advanced Foundation Setup",
    description: "Includes auto-grading rules, subjects & staff assignment.",
    isRecommended: true,
    tag: "Recommended",
    price: "$49",
  },
];

export function ExampleUsage() {
  const [selected, setSelected] = React.useState("pro");

  return (
    <AppleRadioGroup
      options={options}
      value={selected}
      onChange={(val) => setSelected(val)}
      valueKey="id"
      labelKey="name"
      descriptionKey="description"
      
      // 1. Render Function ya Badge (Inaauni conditions nyingi)
      renderBadge={(item) => {
        if (item.isRecommended) {
          return (
            <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary border border-primary/20">
              {item.tag}
            </span>
          );
        }
        return null;
      }}
      
      // 2. Render Function ya Upande wa Kulia (Mfano: Presa au Text ya Ziada)
      renderRight={(item, selected) => (
        <span className={`text-xs font-semibold ${selected ? "text-primary" : "text-muted-foreground"}`}>
          {item.price}
        </span>
      )}
    />
  );
}
 */
export interface RadioGroupProps<
    T extends Record<string, any>,
    K extends keyof T = keyof T
> {
    /** Array of option items */
    options: T[];
    /** Currently selected value */
    value?: T[K];
    /** Callback triggered when a radio option is selected */
    onChange: (item: T) => void;

    /** Property key in object T representing the unique value */
    valueKey: K;
    /** Property key in object T representing the option label */
    labelKey?: keyof T;
    /** Optional property key in object T representing a sub-description */
    descriptionKey?: keyof T;

    /** Custom render function for rendering badges or tags dynamically */
    renderBadge?: (item: T, selected: boolean) => React.ReactNode;
    /** Custom render function for rendering additional content on the right side */
    renderRight?: (item: T, selected: boolean) => React.ReactNode;
    /** Custom render function for full label section customization */
    renderLabel?: (item: T, selected: boolean) => React.ReactNode;

    /** Disables interaction with all radio options when true */
    disabled?: boolean;
    /** Custom CSS class names applied to the wrapper container */
    className?: string;
    /** Custom CSS class names for individual option buttons */
    itemClassName?: string;
}

/**
 * `AppleRadioGroup` is a highly customizable, accessible, and clean radio selection group.
 * Designed with modern UI standards, supporting generics, custom render functions, and badges.
 */
export function EduRadioGroup<
    T extends Record<string, any>,
    K extends keyof T = keyof T
>({
    options,
    value,
    onChange,
    valueKey,
    labelKey,
    descriptionKey,
    renderBadge,
    renderRight,
    renderLabel,
    disabled,
    className = "",
    itemClassName = "",
}: RadioGroupProps<T, K>): JSX.Element {
    return (
        <div
            role="radiogroup"
            className={`w-full divide-y divide-border/60 ${className}`}
        >
            {options.map((item) => {
                const itemValue = item[valueKey] as T[K];
                const selected = itemValue === value;

                return (
                    <button
                        key={String(itemValue)}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        disabled={disabled}
                        onClick={() => onChange(itemValue)}
                        className={`
              group flex w-full items-center justify-between py-4 text-left transition-all outline-none focus-visible:ring-1 focus-visible:ring-primary/50
              ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
              ${itemClassName}
            `}
                    >
                        {/* Main Content Area: Label, Badges & Description */}
                        <div className="flex-1 pr-3">
                            {renderLabel ? (
                                renderLabel(item, selected)
                            ) : (
                                <>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        {labelKey && (
                                            <span
                                                className={`
                                            text-sm font-medium tracking-tight transition-colors
                                            ${selected ? "text-primary font-semibold" : "text-foreground"}
                                            `}
                                            >
                                                {String(item[labelKey])}
                                            </span>
                                        )}

                                        {/* Custom Badge via Render Function */}
                                        {renderBadge && renderBadge(item, selected)}
                                    </div>

                                    {descriptionKey && item[descriptionKey] && (
                                        <div className="mt-1 text-xs leading-5 text-muted-foreground">
                                            {String(item[descriptionKey])}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Right Side Content + Radio Indicator */}
                        <div className="flex items-center gap-3 shrink-0">
                            {/* Optional Custom Content on the Right (e.g., Price, Icons) */}
                            {renderRight && renderRight(item, selected)}

                            {/* Pro Apple Radio Circle Indicator */}
                            <div
                                className={`
                                flex h-5 w-5 items-center justify-center rounded-full border transition-all duration-200
                                ${selected
                                        ? "border-primary bg-primary text-primary-foreground shadow-sm scale-105"
                                        : "border-muted-foreground/30 bg-transparent group-hover:border-muted-foreground/60"
                                    }
                                `}
                            >
                                {selected && (
                                    <Check size={12} strokeWidth={3} className="text-current" />
                                )}
                            </div>
                        </div>
                    </button>
                );
            })}
        </div>
    );
}