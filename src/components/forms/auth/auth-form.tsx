'use client'

import { useSearchParams } from "next/navigation"
import { LoginForm, RegisterForm, ForgotForm, ResetForm, VerifyForm } from "./auth-form-components"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect, memo } from "react"
import { ShieldCheck, GraduationCap, BarChart3, Sparkles } from "lucide-react"

interface AuthFormProps {
    action: string
    bannerComponent?: React.ReactNode
}

// Data ya matangazo ya kisasa kwa ajili ya banner slider
const bannerSlides = [
    {
        badge: "Next-Gen Academic SaaS",
        title: "Streamline Your Academic Workflow",
        description: "Manage multi-tenant school operations, automated grading, and comprehensive analytics seamlessly in one secure platform.",
        icon: GraduationCap,
        highlight: "Trusted by top institutions"
    },
    {
        badge: "Real-Time Analytics",
        title: "Data-Driven Institutional Insights",
        description: "Monitor student performance, attendance tracking, and financial metrics with high-precision interactive dashboards.",
        icon: BarChart3,
        highlight: "Advanced Reporting"
    },
    {
        badge: "Enterprise Security",
        title: "Built for Absolute Reliability",
        description: "Role-based access controls, encrypted databases, and automated backups keep your academic records completely safe.",
        icon: ShieldCheck,
        highlight: "Bank-Grade Encryption"
    }
]

// 1. Tumeitenga banner kuwa independent component ili isisababishe fomu upande wa pili kurender upya
const AuthBanner = () => {
    const [currentSlide, setCurrentSlide] = useState(0)

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % bannerSlides.length)
        }, 8000)
        return () => clearInterval(timer)
    }, [])

    const ActiveIcon = bannerSlides[currentSlide].icon

    return (
        <div className="absolute inset-0 p-12 flex flex-col justify-between overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 select-none">
            {/* Decorative Glowing Orbs */}
            <div className="absolute -top-32 -left-32 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
            <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDuration: '6s' }} />

            {/* Top Header info */}
            <div className="relative z-10 flex items-center justify-between">
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/10 text-white backdrop-blur-md border border-white/15 shadow-sm">
                    <Sparkles size={13} className="text-sky-400" />
                    EduAsas Cloud
                </span>
                <span className="text-xs font-medium text-slate-400 tracking-wider uppercase">
                    Enterprise Portal
                </span>
            </div>

            {/* Animated Content Carousel */}
            <div className="relative z-10 my-auto py-8">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="space-y-6"
                    >
                        <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/15 flex items-center justify-center text-sky-400 shadow-xl">
                            <ActiveIcon className="w-7 h-7" />
                        </div>

                        <div className="space-y-2">
                            <span className="text-xs font-semibold text-sky-400 tracking-wider uppercase">
                                {bannerSlides[currentSlide].highlight}
                            </span>
                            <h2 className="text-3xl xl:text-4xl font-extrabold tracking-tight text-white leading-snug">
                                {bannerSlides[currentSlide].title}
                            </h2>
                        </div>

                        <p className="text-slate-300 text-sm leading-relaxed max-w-md font-normal">
                            {bannerSlides[currentSlide].description}
                        </p>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Footer & Carousel Indicators */}
            <div className="relative z-10 flex items-center justify-between pt-6 border-t border-white/10">
                <div className="flex items-center gap-2">
                    {bannerSlides.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentSlide(idx)}
                            className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${
                                currentSlide === idx ? "w-8 bg-sky-400 shadow-sm shadow-sky-400/50" : "w-2 bg-white/20 hover:bg-white/40"
                            }`}
                            aria-label={`Slide ${idx + 1}`}
                        />
                    ))}
                </div>
                <span className="text-xs text-slate-400 font-medium">
                    &copy; {new Date().getFullYear()} EduAsas. All rights reserved.
                </span>
            </div>
        </div>
    )
}

export const AuthForm = ({ action, bannerComponent }: AuthFormProps) => {
    const searchParams = useSearchParams()

    const RenderForm = () => {
        switch (action) {
            case "register":
                return <RegisterForm />
            case "verify":
                return <VerifyForm />
            case "reset":
                return <ResetForm />
            case "forgot":
                return <ForgotForm />
            default:
                return <LoginForm />
        }
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-tr from-slate-100 via-sky-50/50 to-indigo-100/60 px-4 sm:px-6 lg:px-8 py-6">
            <motion.div 
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="w-full max-w-5xl h-[88vh] min-h-[640px] flex rounded-3xl shadow-[0_25px_60px_-15px_rgba(79,70,229,0.12)] border border-slate-200/90 bg-white overflow-hidden"
            >
                {/* Left Creative & Animated Ad Section */}
                <div className="hidden lg:flex flex-1 h-full relative overflow-hidden bg-slate-950 select-none">
                    {bannerComponent ? bannerComponent : <AuthBanner />}
                </div>

                {/* Form Container Section */}
                <div className="flex-1 h-full flex flex-col justify-center relative overflow-y-auto px-6 sm:px-10 lg:px-14 py-8 bg-white">
                    <div className="w-full max-w-md mx-auto my-auto">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={action}
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -6 }}
                                transition={{ duration: 0.2, ease: "easeInOut" }}
                                className="w-full"
                            >
                                <RenderForm />
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}