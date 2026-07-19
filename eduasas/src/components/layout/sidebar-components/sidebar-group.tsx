import { SidebarGroupSeparetor } from "./sidebar-group-label";

export const SidebarGroup = ({ label, children }: { label?: string; children: React.ReactNode }) => {
  return (
    <div className="flex flex-col mb-1 last:mb-0 w-full overflow-hidden group/sgroup">
      {/* Tunatumia CSS class maalum hapa ili kuitambua separator */}
      {label && (
        <div className="group-first/sgroup:hidden"> 
           <SidebarGroupSeparetor title={label} />
        </div>
      )}
      
      <div className="flex flex-col">
        {children}
      </div>
    </div>
  );
};