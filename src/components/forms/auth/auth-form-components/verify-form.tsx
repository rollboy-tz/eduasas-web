import Link from "next/link";
import { AlertCircle, Timer, CheckCircle, Clock, ShieldCheck, RefreshCcw, ArrowLeft } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { EduMainLoader } from "@/components/elements";
import { useEffect, useRef, useState } from "react";
import { EduButton } from "@/components/ui";
import { useToast } from "@/lib/store";
import { apiMutation } from "@/lib/api";
import { cn } from "@/lib/utils";


export const VerifyForm = () => {

    // Utilities extractions
    const searchParams = useSearchParams();
    const params = new URLSearchParams(searchParams.toString());

    //Params & Quaries extractions
    const url_tokenn = params.get("token");
    const return_url = params.get("return_url");
    const reset_token = params.get("reset_token")
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

    // 1. Security Check: Kama identity haipo, rudi mwanzo (Invalid Access)
    useEffect(() => {
        if (!identity) {
            router.back();
        }
    }, [identity, otp_reason, router]);

    // Timer logic
    useEffect(() => {
        const interval = setInterval(() => {
            setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
            setTokenTimer((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    // Auto-verify wakati namba zote zimejaa
    useEffect(() => {
        if (otpValues.every(val => val !== "") && !isLoading && tokenTimer > 0) {
            handleVerify();
        }
    }, [otpValues]);

    const getStatusStyles = () => {
        if (tokenTimer === 0) {
            return {
                container: "bg-[var(--error-bg)] border-[var(--error-border)] text-destructive",
                text: "text-destructive",
                icon: <AlertCircle size={32} />,
                label: "session expired"
            };
        }
        if (tokenTimer < 60) {
            return {
                container: "bg-amber-500/10 border-amber-500/20 text-amber-600",
                text: "text-amber-600 animate-pulse",
                icon: <Clock size={32} className="animate-pulse" />,
                label: "expiring soon"
            };
        }
        return {
            container: "bg-[var(--info-primary-bg)] border-[var(--info-primary-border)] text-primary",
            text: "text-[var(--icon-color)]",
            icon: <ShieldCheck size={32} />,
            label: "expires in"
        };
    };

    const status = getStatusStyles();

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
            pastedData.split("").forEach((num, idx) => { if (idx < 6) newOtp[idx] = num; });
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

    const handleVerify = async (e?: React.SubmitEvent) => {
        if (e) e.preventDefault();
        if (tokenTimer === 0) return toast.show({ message: "verification code has expired.", type: "error" });
        if (otpValues.includes("")) return toast.show({ message: "please enter the complete 6-digit code.", type: "error" });

        const fullOtp = `EAO-${otpValues.join("")}`;
        setIsLoading(true);

        try {
            const res = await apiMutation("post", "/auth/verify", {
                identity,
                otp: fullOtp
            });

            if (res.status === 'success') {
                const message = `${res.message || "Verified successfull!"}`;
                toast.show({ message, type: "success" });

                // 2. Hapa ndipo tunasafisha abiria ambao kazi yao imeisha
                params.delete("identity");
                params.delete("method");
                params.delete("action");
                params.set("new", "true");

                if (otp_reason === "reset") {

                    if (identity === null) return;

                    // Bind data za reset
                    params.set("identity", identity); // Rudisha identity kwa ajili ya reset page
                    params.set("token", res.data.resetToken);
                    router.replace(`/auth/forgot-password?${params.toString()}`);
                } else {
                    // Flow ya Dashboard
                    const callbackUrl = params.get("callback") || "/u";
                    params.delete("callback");

                    const remainingParams = params.toString();
                    const finalDestination = remainingParams
                        ? `${callbackUrl}?${remainingParams}`
                        : callbackUrl;

                    // Shtua auth provider kurekebisha cache kuna user mpya anakuja
                    const event = new CustomEvent("eduasas:login");
                    window.dispatchEvent(event);

                    router.replace(finalDestination);
                }
            }

            if (res.status === 'error') {
                const message = res.message || "Something went wrong. Unable to verify the OTP"
                toast.show({ message, type: "error" });
                router.back()
                    ;
            }
        } catch (error: any) {
            const message = error.message || "Error occured while verifying."
            toast.show({ message, type: "error" })
            // Error handling yako
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
            if (res.status === 'success') {
                const message = res.message || "a new code has been sent.";
                toast.show({ message, type: "success" });
                setResendTimer(180);
                setTokenTimer(300);
                setOtpValues(["", "", "", "", "", ""]);
                inputRefs.current[0]?.focus();
            }
        } catch (error) { } finally { setIsResending(false); }
    };

    // Njia ya kurudi nyuma yenye kubeba state
    const backUrl = otp_reason === "reset"  ? `/auth/forgot-password?${params.toString()}` : `/auth/sign-up?${params.toString()}`;
    const info_text = otp_reason === "reset" ? "To verify its you please enter OTP Code" : "To verify your new account enter OTP Code";
    return (
        <div className="flex flex-col items-center justify-center p-2 h-full w-full">

            <div className="flex flex-col gap-1">
                <h2 className="font-black text-lg">Verify OTP</h2>
                <p className="text-sm">{info_text}<br />Sent to: <strong>{identity}</strong></p>
            </div>

            <div className="">
                <form onSubmit={handleVerify} className="mt-10 space-y-8">
                    <div className="flex flex-col items-center gap-6">
                        <div className="flex items-center justify-center gap-3">
                            <div className="flex gap-1.5">
                                {otpValues.map((val, i) => (
                                    <input
                                        key={i}
                                        ref={(el) => { inputRefs.current[i] = el; }}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={val}
                                        disabled={tokenTimer === 0 || isLoading}
                                        onPaste={handlePaste}
                                        onChange={(e) => handleChange(i, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(i, e)}
                                        className={cn("w-10 h-10 border rounded text-center text-xl font-bold outline-none transition-all",
                                            tokenTimer === 0
                                                ? "bg-background border-border text-neutral-300"
                                                : "bg-transparent border-border focus:border-primary-500 focus:ring-1 focus:ring-primary-400"
                                        )}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className={`flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase px-4 py-1.5 rounded border border-border bg-background/50 transition-colors duration-500`}>
                            {tokenTimer > 0 ? (
                                <>
                                    <Timer size={14} className={status.text} />
                                    <span className={status.text}>{status.label}: {formatTime(tokenTimer)}</span>
                                </>
                            ) : (
                                <span className="text-destructive flex items-center gap-1.5">
                                    <AlertCircle size={14} /> Session expired
                                </span>
                            )}
                        </div>
                    </div>

                    <EduButton
                        disabled={isLoading || tokenTimer === 0}
                        isLoading={isLoading}
                        icon={CheckCircle}
                        loadingText="Verifing"
                        className="w-full h-12">
                        verify & continue
                    </EduButton>
                </form>

                <div className="mt-10 space-y-6">
                    <button
                        type="button"
                        onClick={handleResend}
                        disabled={resendTimer > 0 || isResending}
                        className={`text-[11px] font-bold flex items-center justify-center gap-2 mx-auto uppercase tracking-widest transition-all bg-transparent border-none p-0 ${resendTimer > 0 ? 'text-[var(--icon-muted)] opacity-50' : 'text-primary hover:opacity-80 cursor-pointer'}`}
                    >
                        {isResending ? <EduMainLoader size={20} /> : <RefreshCcw size={14} />}
                        {resendTimer > 0 ? `resend code (${formatTime(resendTimer)})` : "request new code"}
                    </button>

                    <div className="pt-6 border-t border-border">
                        <Link
                            href={backUrl}
                            className="text-[11px] text-[var(--icon-color)] hover:text-primary flex items-center justify-center gap-2 font-bold uppercase tracking-widest transition-colors cursor-pointer"
                        >
                            <ArrowLeft size={14} /> back to {otp_reason === "reset" ? "forgot password" : "registration"}
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    )
}