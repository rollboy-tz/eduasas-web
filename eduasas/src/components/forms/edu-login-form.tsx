"use client";

import Image from "next/image";
import Link from "next/link";

import { api, ApiResponse } from "@/lib/api";; 

import { toast } from "sonner";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { EduEmailField, PasswordField, EduPhoneField } from "@/components/inputs";
import { EduButton, EduSocialButton } from "@/components/buttons";
import { EduAuthTabs } from "@/components/elements";
import { triggerGoogleAuth } from "@/lib/helpers/googleOAuth";
import { resetuserKey } from "@/lib/utils";

export function LoginForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [method, setMethod] = useState(searchParams.get("method") || "email");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    identity: searchParams.get("identity") || "", // Akili kubwa: Jaza hapa moja kwa moja!
    password: ""
  });

  const [errors, setErrors] = useState({ identity: "", password: "" });

  // Function ya kutengeneza params kwa ajili ya safari (Links/Redirects)
  const getCleanParams = (currentIdentity: string, currentMethod: string) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("method", currentMethod);
    newParams.set("identity", currentIdentity);
    newParams.delete("verified");
    return newParams.toString();
  };

  const authOptions = [
    { value: "email", label: "Email" },
    { value: "phone", label: "Phone" },
  ];

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!formData.identity || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    if (errors.identity || errors.password) {
      toast.error(errors.identity || errors.password);
    }

    setIsLoading(true);
    try {
      const res = await api.post<any, ApiResponse>("/auth/login", formData, { _noToast: true } as any);
      
      if (res.status === 'success') {
        toast.success(res.message || "Welcome back!");
        
        // 1. Pata callback asilia
        let callbackUrl = searchParams.get("callback") || "/u/home";
    
        // 2. MTEGO WA LOOP: Zuia callback isijielekeze kwenye login tena
        if (callbackUrl.includes("/auth/sign-in") || callbackUrl === "/") {
          callbackUrl = "/u/home";
        }
    
        // 3. SAFISHA PARAMS (Don't carry over auth-specific params)
        const finalParams = new URLSearchParams(searchParams.toString());
        const authParams = ["identity", "method", "callback", "error", "code"];
        authParams.forEach(p => finalParams.delete(p));
    
        // 4. JENGA DESTINATION SAHIHI
        const queryString = finalParams.toString();
        const destination = queryString 
          ? `${callbackUrl}${callbackUrl.includes('?') ? '&' : '?'}${queryString}`
          : callbackUrl;
        
        // 5. SHTUA EVENT LISTENA KUFUTA DATA KWENYE CACHE KUNA USER MPYA
        const event = new CustomEvent("eduasas:login");
        window.dispatchEvent(event);
        resetuserKey();

        // Tumia replace badala ya push ili kufuta historia ya login loop
        router.replace(destination);
      }
      else if(res.status === 'error') {
        toast.error(res.message || "Login failed");
      }
    } catch (err: any) {
      // Catch error hapa ili kuzuia page isihang
      toast.error("Login failed. Please check internet connection.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="w-full max-w-[390px] bg-[var(--card-bg)] border border-border rounded-[var(--radius-lg)] p-6 sm:p-7 shadow-xl">
      
      {/* Header: Reduced space slightly */}
      <div className="mb-5 flex w-full flex-col">
        <div className="w-full grid place-center">
          <Image src="/icons/logo-128.png" alt="EduAsas Logo" width={50} height={50} />
        </div>
          <h1 className="text-lg w-full text-start font-black tracking-tighter">Wellcome Back!</h1>
          <span className="text-[12px] text-muted">Enter your credential below to Sign In</span>
      </div>

      <EduAuthTabs 
        options={authOptions} 
        defaultValue={ method }
        onValueChange={(val) => {
          setMethod(val);
          setFormData(prev => ({ ...prev, identity: "" })); // Clear unapo-switch
        }} 
      />

      <form onSubmit={handleLogin} className="space-y-4 bg-inherit mt-2">
        {/* Identity Input: Min-height reduced for minimization */}
        <div className="min-h-[78px] bg-inherit mb-1">
          {method === "email" ? (
            <EduEmailField 
              label="Email Address"
              variant="neon"
              size="lg"
              onError={(val) => setErrors(prev => ({ ...prev, identity: val }))}
              labelStrategy="floating"
              value={formData.identity}
              onChange={(val) => setFormData({ ...formData, identity: val })}
              placeholder="name@example.com"
            />
          ) : (
            <EduPhoneField
              label="Phone Number"
              variant="neon"
              size="lg"
              onError={(val) => setErrors(prev => ({ ...prev, identity: val }))}
              labelStrategy="floating"
              value={formData.identity}
              onChange={(val) => setFormData({ ...formData, identity: val })}
            />
          )}
        </div>

        {/* Password Section */}
        <div className="space-y-1 bg-inherit">
          <PasswordField 
            label="Password"
            variant="neon"
            size="lg"
            labelStrategy="floating"
            onError={(val) => setErrors(prev => ({ ...prev, password: val }))}
            value={formData.password}
            onChange={(val) => setFormData({ ...formData, password: val })}
            placeholder="••••••••"
          />
          <div className="flex justify-end pr-0.5">
            <Link href={`/auth/forgot-password?${getCleanParams(formData.identity, method)}`} className="text-[10px] font-black text-primary  tracking-tight">
              Forgot?
            </Link>
          </div>
        </div>

        {/* Submit Button */}
        <EduButton 
          fullWidth 
          size="md"
          type="button"
          isLoading={isLoading} 
          loadingText="Auntheticating"
          onClick={handleLogin}
        >
          Sign In
        </EduButton>
      </form>

      {/* Divider */}
      <div className="my-5 flex items-center gap-3">
        <div className="h-[1px] flex-1 bg-border " />
        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">OR</span>
        <div className="h-[1px] flex-1 bg-border " />
      </div>

      <EduSocialButton 
        text="Continue with Google" 
        iconPath="/icons/google.png" 
        onClick={() => triggerGoogleAuth("login")}
        size="md"
        className="w-full h-12"
      />

      <p className="mt-8 text-center text-[11px] text-muted font-bold tracking-tight">
        New to EduAsas? 
        <Link href={`/auth/sign-up?${getCleanParams(formData.identity, method)}`} className="text-primary font-black ml-1.5 hover:underline">
          Create Account
        </Link>
      </p>
    </div>
  );
}