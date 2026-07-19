"use client";

import React from "react";
import { EduFloatingDiv } from "./edu-floating-card";
import { cn } from "@/lib/utils/helper";

interface Action {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: "default" | "danger";
  disabled?: boolean; // Hii ndio tumeboresha
}

interface MoreActionsListProps {
  trigger: React.ReactNode;
  actions: Action[];
  showDisabled?: boolean;
  className?: string;
  listClasses?: string;
  dangerListClasses?: string;
  defaultListClasses?: string;
  disabledListClasses?: string;
}

/**
 * @typedef {Object} Action
 * @property {string} label - Jina la kitendo kinachoonekana kwenye orodha.
 * @property {React.ReactNode} [icon] - Icon inayotokea pembeni ya label (kama Lucide icons).
 * @property {function} onClick - Function itakayotekelezwa mtumiaji akibofya kitendo hicho.
 * @property {'default' | 'danger'} [variant] - Aina ya kitendo (default ni nyeusi, danger ni nyekundu).
 * @property {boolean} [disabled] - Ikiwa 'true', kitendo hicho hakitabonyezeka na kitakuwa na muonekano hafifu.
 */

/**
 * @typedef {Object} MoreActionsListProps
 * @property {Action[]} actions - Orodha ya vitendo vitakavyoonyeshwa kwenye popover.
 */

/**
 * ### 📁 MoreActionsList
 * Component ya orodha ya vitendo (Action Menu) inayotumia EduFloatingDiv.
 * Inatoa muonekano safi wa kitendo cha 'More' (kama 'Edit', 'Delete', n.k.)
 * * @example
 * <MoreActionsList 
 * actions={[
 * { 
 * label: "Edit Staff", 
 * onClick: () => handleEdit(staff), 
 * icon: <Edit2 size={14} /> 
 * },
 * { 
 * label: "Delete", 
 * onClick: () => handleDelete(staff), 
 * variant: "danger", 
 * disabled: staff.role === "School Director",
 * icon: <Trash2 size={14} /> 
 * }
 * ]} 
 * />
 */

export function MoreActionsList({ trigger, actions, showDisabled, className, listClasses, dangerListClasses, defaultListClasses, disabledListClasses }: MoreActionsListProps) {
  const filteredActions = showDisabled  ? actions  : actions.filter((a) => !a.disabled);
  return (
    <EduFloatingDiv trigger={<>{trigger}</>} className="p-0 border-o rounded">
      <div className={cn("w-48 bg-popover border border-border shadow-lg rounded-md p-1 overflow-hidden", className)}>
        {filteredActions.map((action, index) => (
          <button
            key={index}
            onClick={action.disabled ? undefined : action.onClick}
            disabled={action.disabled}
            className={cn(
              "w-full text-left px-4 py-2 text-sm transition-colors flex items-center gap-2 rounded-md", listClasses,
              action.disabled 
                ? `opacity-50 cursor-not-allowed ${disabledListClasses}` 
                : action.variant === "danger" 
                  ? `text-destructive hover:bg-destructive/10 ${dangerListClasses}` 
                  : `text-foreground hover:bg-foreground/10  ${defaultListClasses}`
            )}
          >
            {action.icon}
            {action.label}
          </button>
        ))}
      </div>
    </EduFloatingDiv>
  );
}