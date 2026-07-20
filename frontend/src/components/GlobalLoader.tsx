"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
const logoImg = "/logo.png";

export function GlobalLoader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Artificial delay for the beautiful loading sequence
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="global-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#07120E] overflow-hidden"
        >
          {/* Subtle glowing ambient background */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
          >
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px]"
              style={{
                background: "radial-gradient(circle, rgba(244,185,66,0.08) 0%, transparent 60%)",
                filter: "blur(60px)",
              }}
            />
          </motion.div>

          {/* Logo animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 flex flex-col items-center"
          >
            <Image
              src={logoImg}
              alt="Nomadic Ventures"
              width={220}
              height={100}
              className="object-contain"
              priority
            />
            
            {/* Elegant loading bar underneath */}
            <motion.div 
              className="w-[120px] h-[1px] mt-8 bg-white/10 relative overflow-hidden rounded-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <motion.div
                className="absolute inset-y-0 left-0 bg-[#F4B942]"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.5, ease: "easeInOut", delay: 0.6 }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
