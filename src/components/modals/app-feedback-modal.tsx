"use client";

import { useState, useEffect } from "react";
import { X, AlertCircle, CheckCircle2, AlertTriangle } from "lucide-react";

export type FeedbackType = "success" | "error" | "warning";

interface FeedbackAction {
    label: string;
    onClick: () => void;
    variant?: "primary" | "secondary" | "danger";
}

interface FeedbackProps {
    type: FeedbackType;
    title?: string;
    message: string;
    isStrict?: boolean;
    actions?: FeedbackAction[];
}

export function AppFeedbackModal() {
    const [data, setData] = useState<FeedbackProps | null>(null);

    useEffect(() => {
        const handleEvent = (e: any) => setData(e.detail);
        window.addEventListener("app:feedback", handleEvent);
        return () => window.removeEventListener("app:feedback", handleEvent);
    }, []);

    if (!data) return null;

    const resolveContent = () => {
        if (data.title) return { title: data.title, message: data.message };
        if (data.message.includes(":")) {
            const [title, ...rest] = data.message.split(":");
            return {
                title: title.trim(),
                message: rest.join(":").trim()
            };
        }
        const defaults = { error: "Error", success: "Success", warning: "Warning" };
        return { title: defaults[data.type], message: data.message };
    };

    const { title, message } = resolveContent();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/50 backdrop-blur-sm p-4">
            <div className="bg-card rounded-md shadow-2xl w-full max-w-sm p-3.5 relative animate-in fade-in zoom-in duration-200">

                {/* Close Button as X Icon */}
                {!data.isStrict && (
                    <button
                        onClick={() => setData(null)}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={20} />
                    </button>
                )}

                <div className="flex items-start gap-4">
                    {/* Icon kulingana na type */}
                    <div className="mt-1">
                        {data.type === "error" && <AlertCircle className="text-destructive" />}
                        {data.type === "success" && <CheckCircle2 className="text-sucess" />}
                        {data.type === "warning" && <AlertTriangle className="text-warning" />}
                    </div>

                    <div className="flex-1">
                        <h3 className="font-bold text-foreground/80 mb-1">{title}</h3>
                        <p className="text-sm text-muted-foreground mb-6">{message}</p>

                        <div className="flex justify-end gap-2">
                            {data.actions?.map((act, i) => (
                                <button
                                    key={i}
                                    onClick={act.onClick}
                                    className={`px-4 py-2 rounded text-sm font-medium transition-colors duration-200 ${act.variant === "danger" ? "bg-red-600 text-white hover:bg-red-700" : "bg-primary text-white hover:bg-primary/700"
                                        }`}
                                >
                                    {act.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

/**
 * @example
 * import { showFeedback } from "@/components/modals/AppFeedbackModal";

// Pale kwenye catch block:
catch (error: any) {
  showFeedback({
    type: "error",
    message: error.message || "Mutation failed", // Modal itajitengenezea Title yenyewe
    actions: [{ label: "OK", onClick: () => {} }]
  });
  throw error;
}
 */
export const showFeedback = (props: FeedbackProps) => {
    window.dispatchEvent(new CustomEvent("app:feedback", { detail: props }));
};