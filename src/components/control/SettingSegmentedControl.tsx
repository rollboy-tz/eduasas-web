import React, { useEffect, useRef, useState } from "react";

interface SegmentOption {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

interface SegmentedProps {
  value: string;
  options: SegmentOption[];
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const SettingSegmentedControl: React.FC<SegmentedProps> = ({
  value,
  options,
  onChange,
  disabled = false,
}) => {
  const activeRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [indicator, setIndicator] = useState({
    width: 0,
    left: 0,
  });

  const updateIndicator = () => {
    if (!activeRef.current || !containerRef.current) return;

    const active =
      activeRef.current.getBoundingClientRect();

    const parent =
      containerRef.current.getBoundingClientRect();

    setIndicator({
      width: active.width,
      left: active.left - parent.left,
    });
  };

  useEffect(() => {
    updateIndicator();

    window.addEventListener(
      "resize",
      updateIndicator
    );

    return () =>
      window.removeEventListener(
        "resize",
        updateIndicator
      );
  }, [value]);


  return (
    <div
      ref={containerRef}
      role="tablist"
      className="
        relative
        inline-flex
        items-center
        rounded-xl
        border
        border-gray-200
        dark:border-gray-700
        bg-gray-100
        dark:bg-gray-800
        p-1
        shadow-inner
      "
    >

      {/* Sliding background */}
      <span
        style={{
          width: indicator.width,
          transform: `translateX(${indicator.left}px)`,
        }}
        className="
          absolute
          inset-y-1
          left-0
          rounded-lg
          bg-white
          dark:bg-gray-700
          shadow-sm
          transition-all
          duration-300
          ease-[cubic-bezier(.22,1,.36,1)]
        "
      />


      {options.map((option) => {
        const active = option.value === value;

        return (
          <button
            key={option.value}
            ref={active ? activeRef : null}
            type="button"
            role="tab"
            aria-selected={active}
            disabled={disabled}
            onClick={() =>
              !disabled && onChange(option.value)
            }
            onKeyDown={(e) => {
              if (disabled) return;

              const index =
                options.findIndex(
                  (x) => x.value === value
                );

              if (e.key === "ArrowRight") {
                e.preventDefault();

                const next =
                  options[index + 1] ??
                  options[0];

                onChange(next.value);
              }

              if (e.key === "ArrowLeft") {
                e.preventDefault();

                const prev =
                  options[index - 1] ??
                  options[options.length - 1];

                onChange(prev.value);
              }
            }}
            className={`
              relative
              z-10
              flex
              items-center
              gap-1.5
              rounded-lg
              px-3
              py-1.5

              text-xs
              font-semibold

              transition-colors

              ${
                active
                  ? "text-gray-900 dark:text-white"
                  : "text-gray-500 dark:text-gray-400"
              }

              ${
                disabled
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-pointer"
              }

              focus:outline-none
            `}
          >
            {option.icon}

            {option.label}
          </button>
        );
      })}
    </div>
  );
};