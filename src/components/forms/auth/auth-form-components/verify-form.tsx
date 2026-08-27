import Link from "next/link";
import { AlertCircle, Timer, CheckCircle, Clock, ShieldCheck, RefreshCcw, ArrowLeft } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { EduMainLoader } from "@/components/elements";
import { useEffect, useRef, useState } from "react";
import { EduButton, InputLabel } from "@/components/ui";
import { useToast } from "@/lib/store";
import { apiMutation, isApiError } from "@/lib/api";
import { cn, resetuserKey } from "@/lib/utils";

type VerifyRes = { resetToken: string } | null;

export const VerifyForm = () => {
    const searchParams = useSearchParams();
    const params = new URLSearchParams(searchParams.toString());

    const url_token = params.get("token");
    const reset_token = params.get("reset_token");
    const otp_reason = params.get("reason");
    const identity = params.get("identity");

    const toast = useToast();
    const router = useRouter();
    const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);

    const [resendTimer, setResendTimer] = useState(180);
    const [tokenTimer, setTokenTimer] = useState(300);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        if (!identity) {
            router.back();
        }
    }, [identity, otp_reason, router]);

    useEffect(() => {
        const interval = setInterval(() => {
            setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
            setTokenTimer((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (otpValues.every((val) => val !== "") && !isLoading && tokenTimer > 0) {
            handleVerify();
        }
    }, [otpValues]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        if (tokenTimer === 0) return;
        const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
        if (pastedData.length > 0) {
            const newOtp = [...otpValues];
            pastedData.split("").forEach((num, idx) => {
                if (idx < 6) newOtp[idx] = num;
            });
            setOtpValues(newOtp);
            inputRefs.current[pastedData.length < 6 ? pastedData.length : 5]?.focus();
        }
    };

    const handleChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;
        const newOtp = [...otpValues];
        newOtp[index] = value.slice(-1);
        setOtpValues(newOtp);
        if (value && index < 5) inputRefs.current[index + 1]?.focus();
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === "Backspace" && !otpValues[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerify = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (tokenTimer === 0) return toast.show({ message: "Verification code has expired.", type: "error" });
        if (otpValues.includes("")) return toast.show({ message: "Please enter the complete 6-digit code.", type: "error" });

        // Backend expects code formatted like EAO-XXXXXX or direct 6-digit depending on api schema, matching user original format
        const fullOtp = `EAO-${otpValues.join("")}`;
        setIsLoading(true);

        try {
            const res = await apiMutation<VerifyRes>("post", "/auth/verify", {
                identity,
                otp: fullOtp
            });

            if (res.status === "success") {
                const message = `${res.message || "Verified successfully!"}`;
                toast.show({ message, type: "success" });

                params.delete("identity");
                params.delete("reason");
                params.set("new", "true");

                if (otp_reason === "reset") {
                    if (!identity || !res.data) return;
                    const token = res.data.resetToken;

                    params.set("identity", identity);
                    params.set("token", token);
                    router.replace(`/auth/reset?${params.toString()}`);
                } else {
                    let return_url = params.get("return_url") || "/home";

                    if (return_url?.includes("/auth/login") || return_url?.startsWith("/auth/")) {
                        return_url = "/home";
                    }

                    const finalParams = new URLSearchParams(searchParams.toString());
                    const authParams = ["identity", "reason", "token", "return_url", "error", "code", "utm_source", "utm_campaign", "reset_token"];
                    authParams.forEach((p) => finalParams.delete(p));

                    const queryString = finalParams.toString();
                    const destination = queryString
                        ? `${return_url}${return_url.includes("?") ? "&" : "?"}${queryString}`
                        : return_url;

                    const event = new CustomEvent("eduasas:login");
                    window.dispatchEvent(event);
                    resetuserKey();

                    router.replace(destination);
                }
            } else if (res.status === "error") {
                const message = res.message || "Something went wrong. Unable to verify the OTP.";
                toast.show({ message, type: "error" });
            }
        } catch (error) {
            if (isApiError(error)) {
                const message = error.message || "Error occurred while verifying.";
                toast.show({ message, type: "error" });
            } else {
                toast.show({ message: "Network error. Please check your connection.", type: "error" });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        if (resendTimer > 0 || isResending) return;
        setIsResending(true);
        try {
            const res = await apiMutation("post", "/auth/resend", {
                identity,
                purpose: otp_reason === "reset" ? "FORGOT_PASSWORD" : "VERIFICATION"
            });
            if (res.status === "success") {
                const message = res.message || "A new code has been sent.";
                toast.show({ message, type: "success" });
                setResendTimer(180);
                setTokenTimer(300);
                setOtpValues(["", "", "", "", "", ""]);
                inputRefs.current[0]?.focus();
            }
        } catch (error) {
            if (isApiError(error)) {
                const message = error.message || "Something went wrong please retry";
                toast.show({ message, type: "error" });
            }
        } finally {
            setIsResending(false);
        }
    };

    const getCleanParams = (currentIdentity: string | null) => {
        const newParams = new URLSearchParams(searchParams.toString());
        if (currentIdentity) {
            newParams.set("identity", currentIdentity);
        } else {
            newParams.delete("identity");
        }
        newParams.delete("reason");
        return newParams.toString();
    };

    const cleanParamsString = getCleanParams(identity);
    const backUrl = otp_reason === "reset" ? `/auth/forgot?${cleanParamsString}` : `/auth/register?${cleanParamsString}`;
    const info_text = otp_reason === "reset" ? "Please enter the 6-digit OTP code to reset your password." : "Please enter the 6-digit OTP code to verify your account.";

    return (
        <div className="flex flex-col justify-center w-full max-w-[380px] mx-auto py-4">
            <div className="space-y-6">
                {/* Header Section */}
                <div className="space-y-1.5 text-center sm:text-left">
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                        Verify OTP Code
                    </h2>
                    <p className="text-sm text-slate-500">
                        {info_text} Sent to <strong className="text-slate-900">{identity}</strong>
                    </p>
                </div>

                <form onSubmit={handleVerify} className="space-y-6">
                    <div className="flex flex-col items-center gap-4">
                        {/* OTP Inputs */}
                        <div className="flex items-center justify-center gap-2">
                            {otpValues.map((val, i) => (
                                <input
                                    key={i}
                                    ref={(el) => {
                                        inputRefs.current[i] = el;
                                    }}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={val}
                                    disabled={tokenTimer === 0 || isLoading}
                                    onPaste={handlePaste}
                                    onChange={(e) => handleChange(i, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(i, e)}
                                    className={cn(
                                        "w-11 h-12 rounded-xl border text-center text-xl font-bold outline-none transition-all",
                                        tokenTimer === 0
                                            ? "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed"
                                            : "bg-slate-50/50 border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-slate-900"
                                    )}
                                />
                            ))}
                        </div>

                        {/* Timer Badge */}
                        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                            {tokenTimer > 0 ? (
                                <>
                                    <Timer size={14} className="text-indigo-600" />
                                    <span>Code expires in <strong className="text-slate-900">{formatTime(tokenTimer)}</strong></span>
                                </>
                            ) : (
                                <span className="text-red-600 flex items-center gap-1">
                                    <AlertCircle size={14} /> Session expired
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="pt-2">
                        <EduButton
                            disabled={isLoading || tokenTimer === 0}
                            isLoading={isLoading}
                            loadingText="Verifying..."
                            className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-sm transition-all cursor-pointer"
                        >
                            Verify & Continue
                        </EduButton>
                    </div>
                </form>

                {/* Resend & Back actions */}
                <div className="space-y-4 pt-2 text-center">
                    <button
                        type="button"
                        onClick={handleResend}
                        disabled={resendTimer > 0 || isResending}
                        className={cn(
                            "text-xs font-semibold flex items-center justify-center gap-1.5 mx-auto transition-colors bg-transparent border-none p-0 cursor-pointer",
                            resendTimer > 0 ? "text-slate-400 cursor-not-allowed" : "text-indigo-600 hover:text-indigo-500"
                        )}
                    >
                        {isResending ? <EduMainLoader size={16} /> : <RefreshCcw size={14} />}
                        {resendTimer > 0 ? `Resend code in (${formatTime(resendTimer)})` : "Request new code"}
                    </button>

                    <div className="pt-4 border-t border-slate-100">
                        <Link
                            href={backUrl}
                            className="text-xs font-semibold text-slate-600 hover:text-indigo-600 flex items-center justify-center gap-1.5 transition-colors"
                        >
                            <ArrowLeft size={14} /> Back to {otp_reason === "reset" ? "Forgot Password" : "Registration"}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};