import React from "react";

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
}

export const SettingCheckbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  label,
  description,
  disabled = false,
}) => {
  const toggle = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      disabled={disabled}
      onClick={toggle}
      onKeyDown={(e) => {
        if (disabled) return;

        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          toggle();
        }
      }}
      className={`
        group
        flex
        w-full
        items-center
        gap-3
        rounded-xl
        p-2
        text-left
        transition-all

        ${
          disabled
            ? "cursor-not-allowed opacity-50"
            : "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
        }

        focus:outline-none
        focus-visible:ring-4
        focus-visible:ring-blue-500/20
      `}
    >
      {/* Checkbox */}
      <span
        className={`
          flex
          h-5
          w-5
          shrink-0
          items-center
          justify-center
          rounded-md
          border

          transition-all
          duration-200

          ${
            checked
              ? "border-blue-500 bg-blue-500"
              : "border-gray-300 dark:border-gray-600 bg-transparent"
          }
        `}
      >
        <svg
          viewBox="0 0 20 20"
          fill="none"
          stroke="white"
          strokeWidth="3"
          className={`
            h-3.5
            w-3.5
            transition-all
            duration-200

            ${
              checked
                ? "scale-100 opacity-100"
                : "scale-0 opacity-0"
            }
          `}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 10.5L8 14.5L16 5.5"
          />
        </svg>
      </span>


      {/* Text */}
      {(label || description) && (
        <span className="flex-1">
          {label && (
            <span className="
              block
              text-sm
              font-semibold
              text-gray-900
              dark:text-white
            ">
              {label}
            </span>
          )}

          {description && (
            <span className="
              mt-0.5
              block
              text-xs
              text-gray-500
              dark:text-gray-400
            ">
              {description}
            </span>
          )}
        </span>
      )}
    </button>
  );
};