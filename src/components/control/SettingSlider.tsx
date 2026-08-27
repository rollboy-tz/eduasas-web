import React, { useRef } from "react";

interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  showValue?: boolean;
  disabled?: boolean;
}

export const SettingSlider: React.FC<SliderProps> = ({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  showValue = false,
  disabled = false,
}) => {
  const percentage =
    ((value - min) / (max - min)) * 100;


  return (
    <div className="flex w-full items-center gap-3">

      <div className="relative flex-1">

        {/* Track */}
        <div
          className="
            relative
            h-2
            w-full
            overflow-hidden
            rounded-full
            bg-gray-200
            dark:bg-gray-700
          "
        >

          {/* Progress */}
          <div
            style={{
              width: `${percentage}%`,
            }}
            className="
              absolute
              inset-y-0
              left-0
              rounded-full
              bg-gradient-to-r
              from-blue-500
              to-cyan-400
              transition-all
            "
          />

        </div>


        {/* Input */}
        <input
          type="range"
          value={value}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          onChange={(e) =>
            onChange(Number(e.target.value))
          }
          className="
            absolute
            inset-0
            h-2
            w-full
            cursor-pointer
            opacity-0
          "
        />


        {/* Thumb */}
        <div
          style={{
            left: `${percentage}%`,
          }}
          className="
            pointer-events-none
            absolute
            top-1/2
            h-5
            w-5
            -translate-x-1/2
            -translate-y-1/2

            rounded-full

            bg-white
            dark:bg-gray-100

            shadow-lg
            ring-1
            ring-black/10

            transition-transform
          "
        />

      </div>


      {showValue && (
        <span
          className="
            min-w-10
            text-right
            text-xs
            font-semibold
            text-gray-700
            dark:text-gray-200
          "
        >
          {value}
        </span>
      )}

    </div>
  );
};