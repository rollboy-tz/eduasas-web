"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api, ApiResponse } from "@/lib/api";;
import { toast } from "sonner";
import { EduMainLoader } from "@/components/elements";
import { Loader2, ShieldCheck, ArrowLeft, RefreshCcw, Timer, AlertCircle, Clock, CheckCircle } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { EduButton } from "@/components/buttons";
import { getUserKey, resetuserKey } from "@/lib/utils";

function VerifyOTPContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString())
  
  // Maelezo kutoka URL
  const identity = params.get("identity") || "";
  const action = params.get("action") || "register"; 
  const method = params.get("method") || "email";

  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  
  const [resendTimer, setResendTimer] = useState(180);
  const [tokenTimer, setTokenTimer] = useState(300);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // 1. Security Check: Kama identity haipo, rudi mwanzo (Invalid Access)
  useEffect(() => {
    if (!identity) {
      const fallback = action === "reset" ? "/auth/forgot-password" : "/auth/register";
      router.replace(fallback);
    }
  }, [identity, action, router]);

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
    if (tokenTimer === 0) return toast.error("verification code has expired.");
    if (otpValues.includes("")) return toast.error("please enter the complete 6-digit code.");

    const fullOtp = `EAO-${otpValues.join("")}`;
    setIsLoading(true);
    
    try {
      const res = await api.post<any, ApiResponse>("/auth/verify", { 
        identity, 
        otp: fullOtp
      });

      if (res.status === 'success') {
        toast.success(res.message || "Verified successfull!");

        // 2. Hapa ndipo tunasafisha abiria ambao kazi yao imeisha
        params.delete("identity");
        params.delete("method");
        params.delete("action");
        params.set("new", "true");

        if (action === "reset") {
          // Bind data za reset
          params.set("identity", identity); // Rudisha identity kwa ajili ya reset page
          params.set("token", res.data.resetToken);
          params.set("method", method);
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
          resetuserKey();
    
          router.replace(finalDestination);
        }
      }
    } catch (error) {
       // Error handling yako
    } finally { 
      setIsLoading(false); 
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0 || isResending) return;
    setIsResending(true);
    try {
      const res = await api.post<any, ApiResponse>("/auth/resend", { 
        identity, 
        purpose: action === "reset" ? "FORGOT_PASSWORD" : "VERIFICATION" 
      });
      if (res.status === 'success') {
        toast.success(res.message || "a new code has been sent.");
        setResendTimer(180); 
        setTokenTimer(300);
        setOtpValues(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      }
    } catch (error) {} finally { setIsResending(false); }
  };

  // Njia ya kurudi nyuma yenye kubeba state
  const backUrl = action === "reset" 
    ? `/auth/forgot-password?${params.toString()}`
    : `/auth/sign-up?${params.toString()}`;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 text-foreground font-sans">
      <div className="w-full max-w-[420px] text-center border border-border rounded-[var(--radius)] p-6 sm:p-10 bg-[var(--card-bg)] shadow-sm relative overflow-hidden">
        
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary opacity-[0.03] blur-[60px] rounded-full pointer-events-none" />

        <div className="flex justify-center mb-6">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`h-16 w-16 rounded-[var(--radius)] flex items-center justify-center border transition-all duration-500 ${status.container}`}
          >
            {status.icon}
          </motion.div>
        </div>

        <h1 className="text-xl font-bold tracking-tight">OTP Verification</h1>
        <p className="text-muted text-[12px] mt-2 leading-relaxed">
          Please enter 6 digits code sent to {method === "email" ? "your email" : "your phone number"} :<br />
          <span className="text-primary font-bold break-all text-[13px]">{identity}</span>
        </p>

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
                    className={`w-10 h-12 border rounded-[var(--radius)] text-center text-xl font-bold outline-none transition-all 
                      ${tokenTimer === 0 
                        ? "bg-background border-border text-[var(--icon-muted)]" 
                        : "bg-transparent border-border focus:border-primary focus:ring-1 focus:ring-primary/20 text-foreground"
                      }`}
                  />
                ))}
              </div>
            </div>

            <div className={`flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase px-4 py-1.5 rounded-[var(--radius)] border border-border bg-background/50 transition-colors duration-500`}>
               {tokenTimer > 0 ? (
                 <>
                   <Timer size={14} className={status.text} />
                   <span className={status.text}>{status.label}: {formatTime(tokenTimer)}</span>
                 </>
               ) : (
                 <span className="text-destructive flex items-center gap-1.5">
                   <AlertCircle size={14} /> session expired
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
              <ArrowLeft size={14} /> back to {action === "reset" ? "forgot password" : "registration"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyOTPPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <VerifyOTPContent />
    </Suspense>
  );
}