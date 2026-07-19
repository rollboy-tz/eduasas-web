"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  EduEmailField,
  PasswordField,
  EduPhoneField,
  NameField
} from "@/components/inputs";
import { EduButton, EduSocialButton } from "@/components/buttons";
import { EduAuthTabs } from "@/components/tabs";
import {
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { triggerGoogleAuth } from "@/lib/helpers/googleOAuth";
import { toast } from "sonner";
import Image from "next/image";
import { api, ApiResponse } from "@/lib/api";;

export function RegisterForm() {
  const router = useRouter(); // Import hii kutoka next/navigation
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());

  const callBackUrl = params.get("callbackUrl") || "/home";
  const source = params.get("src") || "self";

  const [step, setStep] = useState(1);
  const [method, setMethod] = useState("email");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    comfirm_password: ""
  });
  let confirmValidated: () => boolean = () => true;

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: ""
  });

  const nextStep = () => {
    if (!formData.firstName || !formData.lastName) {
      toast.error("Please provide both your First and Last names.");
      return;
    }
    if (errors.firstName || errors.lastName) {
      toast.error(errors.firstName || errors.lastName);
      return;
    }
    setStep(2);
  };

  const handleRegister = async (e: React.SubmitEvent) => {
    e.preventDefault();

    //Check confirm pass input errors
    if (!confirmValidated()) return;
    // Final security check before API call
    const hasErrors = Object.values(errors).some((msg) => msg);

    if (errors.email && errors.phone) {
      toast.error(errors.email || errors.phone);
      return;
    }

    if (hasErrors) {
      Object.values(errors).forEach((msg) => {
        if (msg) toast.error(msg);
      });
      return;
    }


    if (method === 'email' && !formData.email || 
        method === 'phone' && !formData.phone) {
      toast.error(`Please provide your ${method === 'email' ? 'Email adress' : 'Phone number'}!`);
      return;
    }

    if (!formData.password) {
      toast.error("Please create a password first!")
    }

    setIsLoading(true);
    const identity = method === "email" ? formData.email : formData.phone;
    try {
      // API integration point
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        [method === "email" ? "email" : "phone"]: identity,
        password: formData.password
      };

      const res = await api.post<any, ApiResponse>("/auth/register", payload);

      if (res.status === 'success') {
        toast.success(res.message || `Account created successufull! OTP code sent tou your ${method} ${identity}`)
  
        // Tunaongeza data za lazima kwa ajili ya Verify page
        params.delete('src');
        params.set("method", method);
        params.set("identity", identity);
        params.set("action", "signup");

        // Safiri na msafara wote (callback, src, role, n.k.)
        router.push(`/auth/verify?${params.toString()}`);
      }

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[420px] bg-[var(--card-bg)] border border-border rounded-[var(--radius-lg)] p-7 shadow-2xl">

      {/* Header Logic */}
      <div className="mb-8 flex flex-col">
        <Image src="/icons/logo-128.png" alt="EduAsas Logo" width={50} height={50} />
        <h1 className="text-xl font-black tracking-tighter">
          Create an account.
        </h1>

        {step === 1 ? (
          <span className="text-muted text-[12px] ">
            Enter your your First and Last given names.
          </span>
        ) : (
          <span className="text-muted text-[12px]">
            Enter your email or phone number then Create strong password to continue.
          </span>
        )}

      </div>

      <form onSubmit={handleRegister} className="bg-inherit">
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 15 }}
              className="space-y-3 bg-inherit"
            >
              <NameField
                label="First Name"
                variant="neon" size="lg"
                labelStrategy="floating"
                value={formData.firstName}
                onChange={(val) => setFormData({ ...formData, firstName: val })}
                onError={(val) => setErrors(prev => ({ ...prev, firstName: val }))}
              />
              <NameField
                label="Last Name"
                variant="neon"
                size="lg"
                labelStrategy="floating"
                value={formData.lastName}
                onChange={(val) => setFormData({ ...formData, lastName: val })}
                onError={(val) => setErrors(prev => ({ ...prev, lastName: val }))}
                className="mt-5"
              />

              <EduButton fullWidth type="button"
                iconPosition="right"
                children={"Proceed"}
                onClick={nextStep}
                icon={ArrowRight}
              />



              {/* Social Login: Exclusive to Step 01 */}
              <div className="pt-2">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-[1px] flex-1 bg-border opacity-30" />
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">OR</span>
                  <div className="h-[1px] flex-1 bg-border opacity-30" />
                </div>
                <EduSocialButton text="Continue with Google" iconPath="/icons/google.png" className="w-full h-12" onClick={() => triggerGoogleAuth("register")}/>
              </div>
              <div className="mt-2 border-opacity-20 flex px-5">
                <p className="text-center text-wrap text-[10px] text-muted font-bold">
                  By creating an account, You agree to our
                  <Link
                    href="https://www.eduasas.co.tz/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary font-black ml-1.5 hover:underline"
                  >Terms
                  </Link> and
                  <Link
                    href="https://www.eduasas.co.tz/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary font-black ml-1.5 hover:underline"
                  >Privacy Policy</Link>
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              className="space-y-3 bg-inherit"
            >
              <EduAuthTabs
                options={[{ value: "email", label: "Email" }, { value: "phone", label: "Phone" }]}
                onValueChange={(val) => {
                  setMethod(val);

                  if (val === "email") {
                    setErrors((prev) => ({
                      ...prev,
                      phone: "",
                    }));
                  } else {
                    setErrors((prev) => ({
                      ...prev,
                      email: "",
                    }));
                  }
                }}
                defaultValue="email"
              />

              <div className="min-h-[80px] bg-inherit">
                {method === "email" ? (
                  <EduEmailField
                    label="Email Address" variant="neon" size="lg" labelStrategy="floating"
                    onChange={(val) => setFormData({ ...formData, email: val })}
                    onError={(val) => setErrors(prev => ({ ...prev, email: val }))}
                  />
                ) : (
                  <EduPhoneField
                    label="Phone Number" variant="neon" size="lg" labelStrategy="floating"
                    onChange={(v) => setFormData({ ...formData, phone: v })}
                    onError={(val) => setErrors(prev => ({ ...prev, phone: val }))}
                  />
                )}
              </div>

              <div className="grid grid-cols-1 gap-3 bg-inherit">
                <PasswordField
                  label="Access Key"
                  variant="neon"
                  size="lg"
                  labelStrategy="floating"
                  value={formData.password}
                  onChange={(val) => setFormData({ ...formData, password: val })}
                  onError={(val) => setErrors(prev => ({ ...prev, password: val }))}
                />
                <PasswordField
                  label="Confirm Access Key"
                  variant="neon"
                  isConfirm={true}
                  parentValue={formData.password}
                  size="lg"
                  labelStrategy="floating"
                  onValidate={(fn) => confirmValidated = fn }
                  onError={(val) => setErrors(prev => ({ ...prev, comfirm_password: val }))}
                />
              </div>

              <div className="flex gap-3 pt-2 bg-inherit">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-14 h-13 flex items-center justify-center rounded-xl border border-border text-muted hover:bg-slate-500/5 transition-all"
                >
                  <ArrowLeft size={20} />
                </button>
                <EduButton
                  fullWidth
                  type="submit"
                  isLoading={isLoading}
                  size="md"
                >
                  Create Account
                </EduButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>

      {/* Footer Redirect */}
      <div className="mt-5 pt-6 border-t border-border border-opacity-20">
        <p className="text-center text-[11px] text-muted font-bold tracking-tight">
          Already have an account? <Link href="/auth/sign-in" className="text-primary font-black ml-1.5 hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
}