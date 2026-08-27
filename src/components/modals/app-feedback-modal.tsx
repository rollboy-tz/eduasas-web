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
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/35 backdrop-blur-md p-4 animate-in fade-in duration-200">

            <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-black/5 dark:border-white/10 bg-white/95 dark:bg-muted-900/95 shadow-2xl shadow-black/10 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">

                {/* Accent Bar */}
                <div
                    className={`h-1 w-full ${data.type === "success"
                            ? "bg-emerald-500"
                            : data.type === "error"
                                ? "bg-red-500"
                                : "bg-amber-500"
                        }`}
                />

                {/* Close */}
                {!data.isStrict && (
                    <button
                        onClick={() => setData(null)}
                        className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-all hover:bg-black/5 hover:text-foreground dark:hover:bg-white/5"
                    >
                        <X size={16} />
                    </button>
                )}

                <div className="p-6">

                    <div className="flex items-start gap-4">

                        {/* Icon */}
                        <div
                            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${data.type === "success"
                                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                    : data.type === "error"
                                        ? "bg-red-500/10 text-red-600 dark:text-red-400"
                                        : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                }`}
                        >
                            {data.type === "success" && (
                                <CheckCircle2 size={24} strokeWidth={2.2} />
                            )}

                            {data.type === "error" && (
                                <AlertCircle size={24} strokeWidth={2.2} />
                            )}

                            {data.type === "warning" && (
                                <AlertTriangle size={24} strokeWidth={2.2} />
                            )}
                        </div>

                        <div className="min-w-0 flex-1">

                            <h3 className="text-base font-semibold tracking-tight text-foreground">
                                {title}
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                {message}
                            </p>

                        </div>

                    </div>

                </div>

                {data.actions && data.actions.length > 0 && (

                    <div className="flex justify-end gap-2 border-t border-black/5 dark:border-white/10 px-6 py-4">

                        {data.actions.map((act, i) => (

                            <button
                                key={i}
                                onClick={() => {
                                    act.onClick();
                                    setData(null);
                                }}
                                className={`inline-flex h-10 items-center justify-center rounded-xl px-4 text-sm font-medium transition-all active:scale-[0.98]

                            ${act.variant === "danger"
                                        ? "bg-red-600 text-white hover:bg-red-700"
                                        : act.variant === "secondary"
                                            ? "border border-black/10 bg-transparent text-foreground hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/5"
                                            : "bg-primary text-primary-foreground hover:opacity-90"
                                    }`}
                            >
                                {act.label}
                            </button>

                        ))}

                    </div>

                )}

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