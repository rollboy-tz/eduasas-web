'use client'
import { motion } from "framer-motion";
import { EduMainLoader } from "@/components/elements";

interface ScreenLoderProps {
  loadingText?: string;
  showBrandName?: boolean;
}

export function EduScreenLoader( { loadingText = "Please wait", showBrandName = true } : ScreenLoderProps) {
  return (
    <div className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-background overflow-hidden">
      {/* Background Glow Effect */}
      
      <div className="relative flex flex-col items-center gap-6">
        {/* Animated Logo or Icon */}
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.5, 1, 0.5] 
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="relative w-20 h-20 flex items-center justify-center"
        >
           {/* Hapa weka Logo yako au Icon ya Shule */}
           <EduMainLoader color="primary" loadingText={loadingText}/>
        </motion.div>
      </div>

      {/* Progress Bar (Optional but cool) */}
      <div className="absolute bottom-10 left-0 w-full text-center ">
        <p className="text-[11px] text-gray-500">EduaAsas &copy; 2026 </p>
        <p className="text-[10px] text-gray-500">Powered by Rollboy Services</p>
      </div>
    </div>
  );
}