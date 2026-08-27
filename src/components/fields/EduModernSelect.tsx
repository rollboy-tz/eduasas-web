import React, {
    JSX,
    useEffect,
    useMemo,
    useRef,
    useState
} from "react";
import {
    ChevronDown,
    Check,
    AlertCircle,
    LucideIcon
} from "lucide-react";
import { cn } from "@/lib/utils/helper";

/**
 * Props definition for the EduModernSelect component.
 *
 * @template T - The shape of the data objects passed into the options array.
 */
interface EduModernSelectProps<T> {
    /** Array of selectable option objects */
    options: T[];
    /** The currently selected value or array of values (controlled state) */
    value?: any;
    /** Callback triggered when the selection changes */
    onChange?: (item: T) => void;
    /** Key in object `T` to be displayed as the option label */
    labelKey: keyof T;
    /** Key in object `T` used as the unique identifier/value */
    valueKey: keyof T;
    /** Optional key in object `T` referencing a Lucide icon component */
    iconKey?: keyof T;
    /** Placeholder text displayed when no option is selected */
    placeholder?: string;
    /** Error message string to display below the input */
    error?: string;
    /** Disables interaction when true */
    disabled?: boolean;
    /** Enables search/filter input inside the dropdown dropdown */
    searchable?: boolean;
    /** Allows selecting multiple options if true */
    multiple?: boolean;
    /** Custom CSS class names applied to the container wrapper */
    className?: string;
}

/**
 * `EduModernSelect` is a customizable and accessible dropdown selection component.
 * Supports single/multiple selection, dynamic filtering/searching, custom icon rendering, 
 * and custom underline animations.
 *
 * @template T - The shape of the data objects inside the options list.
 * @param props - The properties required to render the select component.
 * @returns {JSX.Element} The rendered dropdown component.
 */
export const EduModernSelect = <T extends Record<string, any>>({
    options,
    value,
    onChange,
    labelKey,
    valueKey,
    iconKey,
    placeholder = "Select option",
    error,
    disabled,
    searchable = false,
    multiple = false,
    className
}: EduModernSelectProps<T>): JSX.Element => {
    // State management
    const [open, setOpen] = useState(false);
    const [focused, setFocused] = useState(false);
    const [selected, setSelected] = useState<T[]>([]);
    const [search, setSearch] = useState("");

    // Reference to container element for outside-click detection
    const ref = useRef<HTMLDivElement>(null);

    /**
     * Effect: Handles clicks outside of the dropdown container to close the menu automatically.
     */
    useEffect(() => {
        const close = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", close);
        return () => {
            document.removeEventListener("mousedown", close);
        };
    }, []);

    /**
     * Effect: Synchronizes internal selection state whenever external `value` prop or `options` change.
     */
    useEffect(() => {
        if (value === undefined) return;

        const found = options.filter(item =>
            Array.isArray(value)
                ? value.includes(item[valueKey])
                : item[valueKey] === value
        );

        setSelected(found);
    }, [value, options, valueKey]);

    /**
     * Memoized filtered list of options based on the search query.
     */
    const filtered = useMemo(() => {
        if (!searchable || !search) return options;

        return options.filter(item =>
            String(item[labelKey])
                .toLowerCase()
                .includes(search.toLowerCase())
        );
    }, [options, search, searchable, labelKey]);

    /**
     * Checks if a given option item is currently selected.
     *
     * @param {T} item - Option item to check.
     * @returns {boolean} True if the item is in the current selection, false otherwise.
     */
    const active = (item: T): boolean => {
        return selected.some(x => x[valueKey] === item[valueKey]);
    };

    /**
     * Handles selection of an option item (single or multiple modes).
     *
     * @param {T} item - Option item selected by the user.
     */
    const choose = (item: T) => {
        let result: T[];

        if (multiple) {
            if (active(item)) {
                result = selected.filter(x => x[valueKey] !== item[valueKey]);
            } else {
                result = [...selected, item];
            }

            setSelected(result);
            onChange?.(result as any);
        } else {
            setSelected([item]);
            setOpen(false);
            onChange?.(item);
        }
    };

    /**
     * Text representation displayed in the main select input box.
     */
    const display =
        selected.length === 0
            ? placeholder
            : multiple
                ? `${selected.length} selected`
                : String(selected[0][labelKey]);

    return (
        <div ref={ref} className="relative w-full">
            {/* Input Trigger Box */}

            <div
                onClick={() => {
                    if (!disabled) setOpen(v => !v);
                }}
                className={cn(
                    "group flex flex-col w-full",
                    "rounded-sm relative overflow-hidden",
                    "bg-white",
                    "cursor-pointer",
                    focused && "bg-muted-800",
                    disabled && "opacity-60 cursor-not-allowed",
                    className
                )}>

                <div className="px-2 w-full flex items-center">
                    <div
                        className={cn(
                            "flex-1",
                            "py-2",
                            "text-sm",
                            selected.length ? "" : "text-muted-500"
                        )}
                    >
                        {display}
                    </div>

                    <ChevronDown
                        size={18}
                        className={cn(
                            "text-primary-400",
                            "transition-transform",
                            open && "rotate-180"
                        )}
                    />
                </div>

                {/* Underline Indicator */}
                <div className="relative h-[2px]">
                    <div className="absolute inset-0 bg-blue-500" />
                    <div
                        className={cn(
                            "absolute inset-y-0 left-1/2 -translate-x-1/2",
                            "bg-blue-900 transition-all duration-300",
                            open || focused ? "w-full" : "w-0 group-hover:w-full"
                        )}
                    />
                </div>
            </div>

            {/* Dropdown Options List */}
            {open && (
                <div
                    className="absolute z-[100] mt-2 w-full max-h-64 overflow-y-auto 
                    overflow-x-hidden rounded-sm border border-muted-700 bg-muted-900 shadow-2xl"
                >
                    {searchable && (
                        <input
                            autoFocus
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search..."
                            className="w-full border-b border-muted-700 bg-transparent px-3 py-2
                            text-sm text-white outline-none"
                        />
                    )}

                    {filtered.map(item => {
                        const Icon = iconKey && (item[iconKey] as LucideIcon);
                        return (
                            <button
                                key={String(item[valueKey])}
                                type="button"
                                onClick={() => choose(item)}
                                className="flex w-full items-center justify-between px-3 py-2.5 text-sm text-white hover:bg-white/5 transition"
                            >
                                <div className="flex items-center gap-2 truncate">
                                    {Icon && <Icon size={16} />}
                                    <span className="truncate">
                                        {String(item[labelKey])}
                                    </span>
                                </div>

                                {active(item) && (
                                    <Check
                                        size={16}
                                        className="text-primary-400"
                                    />
                                )}
                            </button>
                        );
                    })}
                </div>
            )}

            {/* Error Message Display */}
            {error && (
                <div className="mt-1 flex items-center gap-1 text-red-500 text-[10px]">
                    <AlertCircle size={11} />
                    {error}
                </div>
            )}
        </div>
    );
};