import React, { useState } from "react";

interface InputProps {
  value: string;
  onChange: (value: string) => void;

  label?: string;
  placeholder?: string;

  description?: string;
  error?: string;

  type?: "text" | "password" | "email";

  icon?: React.ReactNode;

  disabled?: boolean;

  clearable?: boolean;
}

export const SettingInput: React.FC<InputProps> = ({
  value,
  onChange,

  label,
  placeholder,

  description,
  error,

  type = "text",

  icon,

  disabled = false,

  clearable = true,
}) => {
  const [showPassword, setShowPassword] =
    useState(false);


  const inputType =
    type === "password" && showPassword
      ? "text"
      : type;


  return (
    <div className="w-full">


      <div
        className={`
          relative

          flex
          items-center
          gap-2

          rounded-xl

          border

          bg-white
          dark:bg-gray-900

          px-3

          transition-all


          ${
            error
              ? "border-red-500 ring-4 ring-red-500/10"
              : "border-gray-200 dark:border-gray-700 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10"
          }


          ${
            disabled
              ? "cursor-not-allowed opacity-50"
              : ""
          }
        `}
      >


        {icon && (
          <span
            className="
              text-gray-400
              dark:text-gray-500
            "
          >
            {icon}
          </span>
        )}



        <div className="relative flex-1">


          {label && (
            <label
              className={`
                pointer-events-none
                absolute
                left-0

                transition-all

                ${
                  value
                    ? "-top-2 text-[10px] bg-white dark:bg-gray-900 px-1 text-blue-500"
                    : "top-1/2 -translate-y-1/2 text-xs text-gray-400"
                }
              `}
            >
              {label}
            </label>
          )}


          <input
            value={value}
            disabled={disabled}
            type={inputType}

            placeholder={
              label
                ? undefined
                : placeholder
            }

            onChange={(e) =>
              onChange(e.target.value)
            }

            className="
              w-full

              bg-transparent

              py-2

              text-sm

              text-gray-900
              dark:text-white

              outline-none

              placeholder:text-gray-400
            "
          />

        </div>



        {clearable && value && !disabled && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="
              text-gray-400
              hover:text-gray-700
              dark:hover:text-gray-200
            "
          >
            ✕
          </button>
        )}



        {type === "password" && (
          <button
            type="button"
            onClick={() =>
              setShowPassword((v) => !v)
            }
            className="
              text-xs
              font-semibold
              text-blue-500
            "
          >
            {showPassword
              ? "Hide"
              : "Show"}
          </button>
        )}

      </div>



      {error && (
        <p
          className="
            mt-1
            text-xs
            text-red-500
          "
        >
          {error}
        </p>
      )}


      {!error && description && (
        <p
          className="
            mt-1
            text-xs
            text-gray-500
          "
        >
          {description}
        </p>
      )}

    </div>
  );
};