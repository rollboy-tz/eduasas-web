import Link from "next/link";
import { EduButton } from "@/components/ui";
import { LogIn, UserPlus, ShieldCheck, GraduationCap, ArrowRight } from "lucide-react";

export const AuthIndex = () => {
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-tr from-slate-100 via-sky-50/50 to-indigo-100/60 px-4 sm:px-6 lg:px-8 py-6">
            <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 rounded-3xl shadow-[0_25px_60px_-15px_rgba(79,70,229,0.12)] border border-slate-200/90 bg-white overflow-hidden">
                
                {/* Left Side: Brand & Welcome Info (Mini Landing Banner) */}
                <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-between bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white relative overflow-hidden">
                    {/* Background Glows */}
                    <div className="absolute -top-24 -left-24 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10 space-y-6">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/10 text-white backdrop-blur-md border border-white/15 shadow-sm">
                            <GraduationCap size={16} className="text-sky-400" />
                            EduAsas Academic Cloud
                        </div>

                        <div className="space-y-3">
                            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight text-white">
                                Institutional Management Simplified.
                            </h1>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                Access your multi-tenant school operations, automated grading, timetables, and secure portals in one unified high-end platform.
                            </p>
                        </div>
                    </div>

                    <div className="relative z-10 pt-8 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                        <span className="flex items-center gap-1.5">
                            <ShieldCheck size={14} className="text-sky-400" /> Secure Enterprise Access
                        </span>
                        <span>&copy; {new Date().getFullYear()} EduAsas</span>
                    </div>
                </div>

                {/* Right Side: Quick Action Choices */}
                <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-center bg-white">
                    <div className="w-full max-w-sm mx-auto space-y-6">
                        <div className="space-y-2 text-center lg:text-left">
                            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                                Get Started
                            </h2>
                            <p className="text-sm text-slate-500">
                                Choose how you would like to proceed with your institutional account.
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3 pt-2">
                            <Link href="/auth/login" className="block">
                                <EduButton 
                                    className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-sm transition-all flex items-center justify-between px-5 cursor-pointer group"
                                >
                                    <span className="flex items-center gap-2.5">
                                        <LogIn size={18} /> Sign In to Portal
                                    </span>
                                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                                </EduButton>
                            </Link>

                            <Link href="/auth/register" className="block">
                                <EduButton 
                                    className="w-full h-12 bg-slate-50 hover:bg-slate-100 text-slate-900 rounded-xl font-semibold transition-all flex items-center justify-between px-5 cursor-pointer border border-slate-200/80 group"
                                >
                                    <span className="flex items-center gap-2.5">
                                        <UserPlus size={18} className="text-slate-600" /> Register Institution
                                    </span>
                                    <ArrowRight size={16} className="text-slate-400 transition-transform group-hover:translate-x-1" />
                                </EduButton>
                            </Link>
                        </div>

                        {/* Additional Links / Help */}
                        <div className="pt-6 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-slate-500">
                            <Link href="/auth/forgot" className="hover:text-indigo-600 transition-colors">
                                Forgot password?
                            </Link>
                            <Link href="/" className="hover:text-indigo-600 transition-colors">
                                Back to Home
                            </Link>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default AuthIndex;