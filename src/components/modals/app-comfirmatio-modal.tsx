"use client";

import React, { useState, useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConfirmProps {
  title: string;
  message: string;
  confirmLabel?: string;
  variant: "danger" | "neutral";
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

export function AppConfirmModal() {
  const [data, setData] = useState<ConfirmProps | null>(null);

  useEffect(() => {
    const handleEvent = (e: any) => setData(e.detail);
    window.addEventListener("app:confirm", handleEvent);
    return () => window.removeEventListener("app:confirm", handleEvent);
  }, []);

  if (!data) return null;

  const handleCancel = () => {
    if (data.onCancel) data.onCancel();
    setData(null);
  };

  const handleConfirm = () => {
    data.onConfirm();
    setData(null);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-background/50 backdrop-blur-sm p-4">
      <div className="bg-card rounded-md shadow-2xl w-full max-w-sm p-6 animate-in fade-in zoom-in duration-200">
        <div className="flex items-start gap-4">
          <div className="mt-1">
            <AlertTriangle className="text-warning" size={24} />
          </div>
          <div className="flex-1">
            <h3 className="font-bold py-1.5 text-foreground mb-2">{data.title}</h3>
            <p className="text-sm text-foreground/80 mb-6">{data.message}</p>

            <div className="flex justify-end gap-2">
              <button
                onClick={handleCancel}
                className="px-4 py-2 rounded text-sm font-medium hover:bg-card-foreground/90 transition-colors"
              >
                {data.cancelLabel || "Cancel"}
              </button>
              <button
                onClick={handleConfirm}
                className={cn("px-4 py-2 rounded text-sm font-medium text-white",
                   data.variant === "danger" ? "bg-red-600" : "bg-primary",
                  "hover:opacity-900 transition-opacity duration-200")}>
                {data.confirmLabel || "Comfirm"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * @example
import { showConfirm } from "@/components/modals/AppConfirmModal";
// Kwenye delete button yako:
showConfirm({
  title: "Futa Shule",
  message: "Je, una uhakika unataka kufuta shule hii? Kitendo hiki ni cha kudumu.",
  confirmLabel: "Futa Kabisa",
  onConfirm: () => {
    // Logic yako ya DELETE hapa
    console.log("Shule imefutwa!");
  }
});
 */
export const showConfirm = (props: ConfirmProps) => {
  window.dispatchEvent(new CustomEvent("app:confirm", { detail: props }));
};