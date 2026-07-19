'use client'
import { motion } from "framer-motion";
import { EduMainLoader } from "@/components/elements";

export function EduScreenLoader() {
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
           <EduMainLoader />
        </motion.div>

        {/* Loading Text */}
        <div className="flex flex-col items-center">
          <h2 className="text-foreground font-bold tracking-[0.1em]">EduAsas</h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-primary-foreground/80 text-[12px] mt-2"
          >
            Making things best for you...
          </motion.p>
        </div>
      </div>

      {/* Progress Bar (Optional but cool) */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-primary/5">
        <motion.div 
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 3, ease: "easeInOut" }}
          className="h-full bg-primary)]"
        />
      </div>
    </div>
  );
}