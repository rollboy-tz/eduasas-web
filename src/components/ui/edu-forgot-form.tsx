// "use client";

// import { useState, useEffect } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { ArrowLeft, ArrowUpCircle, UserCircle } from "lucide-react";
// import { EduButton } from "@/components/buttons";
// import { EduBasicInput, PasswordField } from "@/components/inputs";
// import { api, ApiResponse } from "@/lib/api";;
// import { toast } from "sonner";
// import Link from "next/link";
// import Image from "next/image";

// export function ForgotPasswordForm() {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   // 1. Logic ya kuanzisha data bila kusababisha Loop
//   const isFromVerify = searchParams.get("verified") === "true";
//   const p_token = searchParams.get("token") || "";
//   const p_identity = searchParams.get("identity") || "";
//   const p_method = searchParams.get("method") || "";

//   const backParams = new URLSearchParams(searchParams.toString());
//   backParams.delete("token");
//   backParams.delete("verified");

//   const [isLoading, setIsLoading] = useState(false);
//   const [identity, setIdentity] = useState(p_identity);
//   const [method, setMethod] = useState(p_method || "unknown");

//   const [formData, setFormData] = useState({
//     resetToken: p_token,
//     newPassword: ""
//   });

//   const [errors, setErrors] = useState({ confirm_password: "", password: "" });

//   // 2. Regex Logic (Ipo Sawa)
//   const checkMethod = (value: string) => {
//     const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//     const phoneRegex = /^\+?[0-9]{9,15}$/;
//     if (emailRegex.test(value)) return "email";
//     if (phoneRegex.test(value)) return "phone";
//     return "unknown";
//   };

//   // 3. Update method automatically mtumiaji anapoandika identity
//   useEffect(() => {
//     if (!isFromVerify) {
//       setMethod(checkMethod(identity));
//     }
//   }, [identity, isFromVerify]);

//   // --- STEP 1: REQUEST OTP ---
//   const handleRequestOTP = async (e: React.BaseSyntheticEvent) => {
//     e.preventDefault();
//     if (!identity) return toast.error("Please enter your Email adress or Phone number");
//     if (method === "unknown") return toast.error("Invalid Email  adress or Phone number format");

//     setIsLoading(true);
//     try {
//       const res = await api.post<any, ApiResponse>("/auth/resend", {
//         identity,
//         purpose: "FORGOT_PASSWORD"
//       });
//       if (res.status === 'success') {
//         const params = new URLSearchParams();
//         params.set("method", method);
//         params.set("identity", identity);
//         params.set("action", "reset"); // Muhimu kwa verify page kuelewa

//         toast.success(`Code sent to your ${method === "email" ? "Email adress" : "Phone number"}: ${identity}`);
//         router.push(`/auth/verify?${params.toString()}`);
//       }
//     } finally { setIsLoading(false); }
//   };

//   // --- STEP 2: UPDATE PASSWORD ---
//   const handleResetPassword = async (e: React.BaseSyntheticEvent) => {
//     e.preventDefault();

//     // Validations
//     if (errors.password || errors.confirm_password) {
//       return toast.error(errors.password || errors.confirm_password);
//     }
//     if (!formData.newPassword) return toast.error("Please enter a new password");

//     // Security check ya Token
//     if (!p_token || p_token.length < 10) {
//       return toast.error("Security session expired. Please request a new code.");
//     }

//     setIsLoading(true);
//     try {
//       // Tunatuma p_token moja kwa moja kutoka URL
//       const res = await api.patch<any, ApiResponse>("/auth/reset-password", {
//         resetToken: p_token,
//         newPassword: formData.newPassword
//       });

//       if (res.status === 'success') {
//         const params = new URLSearchParams();
//         params.delete("token");
//         params.delete("verified");

//         toast.success("Security updated successfully!");
//         router.push(`/auth/sign-in?${params.toString()
//         }`);
//       }
//     } finally { setIsLoading(false); }

//   };

//   return (
//     <div className="w-full max-w-[400px] bg-[var(--card-bg)] border border-border rounded-[var(--radius-lg)] p-7 shadow-xl">

//       {/* HEADER */}
//       <div className="mb-8">
//         <div className={`h-12 w-12 flex items-center justify-center mb-4`}>
//           <Image src="/icons/logo-128.png" alt="EduAsas Logo" width={50} height={50} />
//         </div>
//         <h1 className="text-xl font-black tracking-tighter">
//           {isFromVerify ? "Set new Password." : "Forgot your Password?"}
//         </h1>
//         <p className="text-muted text-[12px] mt-1 font-boldleading-tight">
//           {isFromVerify ? (
//             <>
//               <span>Please create new strong password for your {method === 'email' ? "Email adress" : "Phone number"}:</span><br />
//               <span className="text-primary font-black not-italic mx-1">
//                 {identity}
//               </span>
//             </>
//           ) : (
//             "Provide your email or phone number to receive a reset OTP code."
//           )}
//         </p>
//       </div>

//       {!isFromVerify ? (
//         <form onSubmit={handleRequestOTP} className="space-y-6 bg-[var(--card-bg)]">
//           <EduBasicInput
//             label="Email address or Phone number"
//             variant="neon"
//             icon={UserCircle}
//             value={identity}
//             isRequired={true}
//             onChange={(e) => setIdentity(e.target.value.trim())} // Hakikisha EduBasicInput inarudisha value moja kwa moja
//           />
//           <EduButton fullWidth isLoading={isLoading} loadingText="Requesting OTP" className="h-14" icon={ArrowUpCircle}>
//             Request OTP
//           </EduButton>
//         </form>
//       ) : (
//         <form onSubmit={handleResetPassword} className="space-y-5 bg-[var(--card-bg)]">
//           <PasswordField
//             label="New password"
//             variant="neon"
//             value={formData.newPassword}
//             onChange={(val) => setFormData({ ...formData, newPassword: val })}
//             onError={(err) => setErrors(prev => ({ ...prev, password: err }))}
//           />
//           <PasswordField
//             label="Confirm password"
//             variant="neon"
//             isConfirm={true}
//             parentValue={formData.newPassword}
//             onError={(err) => setErrors(prev => ({ ...prev, confirm_password: err }))}
//           />
//           <EduButton fullWidth isLoading={isLoading} loadingText="Updating credential..." className="h-14" icon={ArrowUpCircle} textTransform="none">
//             Update password
//           </EduButton>
//         </form>
//       )}

//       <div className="mt-8 text-center border-t border-border pt-6">
//         <Link
//           href={`/auth/sign-in?${backParams.toString()}`}
//           className="inline-flex items-center text-muted hover:text-primary text-[11px] font-black uppercase"
//         >
//           <ArrowLeft size={14} className="mr-2" /> Back to login
//         </Link>
//       </div>
//     </div>
//   );
// }