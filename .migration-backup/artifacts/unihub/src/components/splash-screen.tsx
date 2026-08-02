import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function SplashScreen() {
  const [visible, setVisible] = useState(() => {
    // Show once per browser session
    return !sessionStorage.getItem("nexora_splash_shown");
  });

  useEffect(() => {
    if (!visible) return;
    sessionStorage.setItem("nexora_splash_shown", "1");
    const timer = setTimeout(() => setVisible(false), 3200);
    return () => clearTimeout(timer);
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="splash"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6, ease: "easeInOut" } }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
          style={{ background: "linear-gradient(135deg, #0d0515 0%, #1a0733 50%, #0d0515 100%)" }}
        >
          {/* Radial glow behind logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
            className="absolute w-80 h-80 rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(139,92,246,0.25) 0%, transparent 70%)",
              filter: "blur(24px)",
            }}
          />

          {/* N logo */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 flex items-center justify-center w-28 h-28 rounded-3xl mb-6"
            style={{
              background: "linear-gradient(145deg, #7c3aed, #a855f7)",
              boxShadow: "0 0 60px rgba(139,92,246,0.5), 0 0 120px rgba(139,92,246,0.2)",
            }}
          >
            <span
              className="text-white font-black select-none"
              style={{ fontSize: "4rem", lineHeight: 1, letterSpacing: "-0.04em" }}
            >
              N
            </span>
          </motion.div>

          {/* NEXORA wordmark */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.5, ease: "easeOut" }}
            className="relative z-10 text-white font-black tracking-[0.25em] text-4xl select-none"
          >
            NEXORA
          </motion.h1>

          {/* Tagline slides up from under the wordmark */}
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.25, duration: 0.5, ease: "easeOut" }}
            className="relative z-10 mt-3 text-sm font-semibold tracking-[0.3em] uppercase select-none"
            style={{ color: "rgba(216,180,254,0.8)" }}
          >
            The Future of Learning
          </motion.p>

          {/* Thin purple line under tagline */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ delay: 1.55, duration: 0.6, ease: "easeOut" }}
            className="relative z-10 mt-5 h-px w-32 origin-left"
            style={{ background: "linear-gradient(90deg, transparent, #a855f7, transparent)" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
