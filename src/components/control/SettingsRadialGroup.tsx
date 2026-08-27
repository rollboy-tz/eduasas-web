import React from "react";

interface RadioOption {
  label: string;
  value: string;
  description?: string;
}

interface RadioGroupProps {
  value: string;
  options: RadioOption[];
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const SettingRadioGroup: React.FC<RadioGroupProps> = ({
  value,
  options,
  onChange,
  disabled = false,
}) => {
  return (
    <div
      role="radiogroup"
      className="space-y-2"
    >
      {options.map((option) => {
        const active = option.value === value;

        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            disabled={disabled}
            onClick={() => !disabled && onChange(option.value)}
            onKeyDown={(e) => {
              if (
                !disabled &&
                (e.key === "Enter" || e.key === " ")
              ) {
                e.preventDefault();
                onChange(option.value);
              }
            }}
            className={`
              group
              flex
              w-full
              items-center
              gap-3
              rounded-2xl
              border
              p-3
              text-left
              transition-all
              duration-300

              ${
                active
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-500/10 shadow-md"
                  : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-blue-300"
              }

              ${
                disabled
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-pointer"
              }

              focus:outline-none
              focus-visible:ring-4
              focus-visible:ring-blue-500/20
            `}
          >
            {/* Indicator */}
            <div
              className={`
                flex
                h-5
                w-5
                items-center
                justify-center
                rounded-full
                border-2
                transition-all

                ${
                  active
                    ? "border-blue-500"
                    : "border-gray-400 dark:border-gray-600"
                }
              `}
            >
              <div
                className={`
                  h-2.5
                  w-2.5
                  rounded-full
                  bg-blue-500
                  transition-all
                  duration-200

                  ${
                    active
                      ? "scale-100 opacity-100"
                      : "scale-0 opacity-0"
                  }
                `}
              />
            </div>

            {/* Text */}
            <div className="flex-1">
              <div className="text-sm font-semibold text-gray-900 dark:text-white">
                {option.label}
              </div>

              {option.description && (
                <div className="mt-0.5 text-xs text-gray-500">
                  {option.description}
                </div>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
};