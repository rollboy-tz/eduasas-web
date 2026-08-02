"use client";

import * as Icons from "lucide-react";

/**
 * Props zinazohitajika na component ya `SidebarDynamicIcon`.
 */
interface Props {
  /** Jina la ikoni inayotakiwa kutoka `lucide-react` (mfano: "Home", "User", "Settings") */
  name: string;
  /** Ukubwa wa ikoni kwa pixels (default: 20) */
  size?: number;
  /** CSS classes za ziada za Tailwind (optional) */
  className?: string;
}

/**
 * Component inayoweka na kuonyesha ikoni kwa njia ya dynamic kulingana na jina (`name`) lililotolewa.
 * 
 * Ikiwa jina la ikoni halitapatikana kwenye maktaba ya `lucide-react`,
 * component hii itarudisha ikoni ya mbadala (`Icons.HelpCircle`).
 */
export function SidebarDynamicIcon({
  name,
  size = 20,
  className,
}: Props) {
  const IconComponent = (
    Icons as unknown as Record<string, React.ElementType>
  )[name];

  if (!IconComponent) {
    const Fallback = Icons.HelpCircle;

    return (
      <Fallback
        size={size}
        className={className}
      />
    );
  }

  return (
    <IconComponent
      size={size}
      className={className}
    />
  );
}