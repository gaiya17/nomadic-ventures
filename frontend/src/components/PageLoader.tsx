import { motion } from "motion/react";
import Image from "next/image";
const logoImg = "/logo.png";

export function PageLoader() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#07120E] overflow-hidden">
      {/* Subtle glowing ambient background */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut", repeat: Infinity, repeatType: "reverse" }}
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
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeInOut" }}
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
        
        {/* Continuous elegant loading bar */}
        <div className="w-[120px] h-[1px] mt-8 bg-white/10 relative overflow-hidden rounded-full">
          <motion.div
            className="absolute inset-y-0 left-0 bg-[#F4B942]"
            initial={{ width: "0%", left: "0%" }}
            animate={{ width: ["0%", "50%", "0%"], left: ["0%", "50%", "100%"] }}
            transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity }}
          />
        </div>
      </motion.div>
    </div>
  );
}
