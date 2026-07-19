import * as Icons from "lucide-react";

/**
 * - This helper utils used in eduasas to change any string to realy icon.
 * @param param { name: string, size?: number, className?: string } 
 * @returns Lucide Icone
 */
export const SidebarDynamicIcon = ({ name, size = 18, className }: { name: string, size?: number, className?: string }) => {
  // Tunachukua icon kutoka kwenye library ya Lucide kwa jina lake
  const IconComponent = (Icons as any)[name];

  if (!IconComponent) {
    return <Icons.HelpCircle size={size} />; // Fallback icon kama jina halipo
  }

  return <IconComponent size={size} className={className} />;
};