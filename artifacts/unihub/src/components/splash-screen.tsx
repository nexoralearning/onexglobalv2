import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Pre-computed ray endpoints (sun center at 50,44 in 100×90 viewBox)
// 9 rays fanning from -70° to +70° from vertical, inner r=8, outer r=36
const RAYS = [
  { x1: 42.5, y1: 41.3, x2: 16.2,  y2: 31.7, delay: 0.98 },
  { x1: 43.7, y1: 39.1, x2: 21.5,  y2: 22.1, delay: 0.86 },
  { x1: 45.4, y1: 37.5, x2: 29.4,  y2: 14.5, delay: 0.74 },
  { x1: 47.6, y1: 36.4, x2: 39.2,  y2:  9.7, delay: 0.62 },
  { x1: 50.0, y1: 36.0, x2: 50.0,  y2:  8.0, delay: 0.50 }, // center
  { x1: 52.4, y1: 36.4, x2: 60.8,  y2:  9.7, delay: 0.62 },
  { x1: 54.6, y1: 37.5, x2: 70.6,  y2: 14.5, delay: 0.74 },
  { x1: 56.3, y1: 39.1, x2: 78.5,  y2: 22.1, delay: 0.86 },
  { x1: 57.5, y1: 41.3, x2: 83.8,  y2: 31.7, delay: 0.98 },
];

// 3 horizontal lines below the sun, tapering from wide to narrow
const LINES = [
  { y: 56, x1: 12, x2: 88, delay: 1.15 },
  { y: 65, x1: 20, x2: 80, delay: 1.26 },
  { y: 74, x1: 29, x2: 71, delay: 1.37 },
];

interface SplashScreenProps {
  onDone?: () => void;
}

export function SplashScreen({ onDone }: SplashScreenProps) {
  const [visible, setVisible] = useState(() => {
    return !sessionStorage.getItem("nexora_splash_shown");
  });

  useEffect(() => {
    if (!visible) {
      // Splash was already shown in a previous session; fire callback immediately
      onDone?.();
      return;
    }
    sessionStorage.setItem("nexora_splash_shown", "1");
    const timer = setTimeout(() => {
      setVisible(false);
      // Fire after the exit animation completes (~800ms)
      setTimeout(() => onDone?.(), 820);
    }, 3600);
    return () => clearTimeout(timer);
  }, [visible]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="splash"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{ background: "#080808" }}
        >
          {/* Subtle dot-grid texture */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(255,255,255,0.055) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />

          {/* ── Logo lockup ── */}
          <div className="relative z-10 flex items-center" style={{ gap: "36px" }}>

            {/* Icon */}
            <motion.svg
              viewBox="0 0 100 90"
              width="110"
              height="99"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.01, delay: 0.3 }}
            >
              {/* Sun rays — draw in from center outward */}
              {RAYS.map((r, i) => (
                <motion.line
                  key={`ray-${i}`}
                  x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2}
                  stroke="white"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{
                    pathLength: { delay: r.delay, duration: 0.32, ease: "easeOut" },
                    opacity:   { delay: r.delay, duration: 0.1 },
                  }}
                />
              ))}

              {/* Sun circle — pops in first */}
              <motion.circle
                cx="50" cy="44" r="4.5"
                fill="white"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.38, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                style={{ transformOrigin: "50px 44px" }}
              />

              {/* Three horizontal lines — expand from center */}
              {LINES.map((ln, i) => (
                <motion.line
                  key={`line-${i}`}
                  x1={ln.x1} y1={ln.y} x2={ln.x2} y2={ln.y}
                  stroke="white"
                  strokeWidth="3.8"
                  strokeLinecap="round"
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: 1 }}
                  transition={{ delay: ln.delay, duration: 0.38, ease: "easeOut" }}
                  style={{ transformOrigin: `50px ${ln.y}px` }}
                />
              ))}
            </motion.svg>

            {/* Vertical divider */}
            <motion.div
              initial={{ scaleY: 0, opacity: 0 }}
              animate={{ scaleY: 1, opacity: 0.45 }}
              transition={{ delay: 1.55, duration: 0.38, ease: "easeOut" }}
              style={{
                width: "1.5px",
                height: "62px",
                background: "white",
                transformOrigin: "top center",
                borderRadius: "1px",
              }}
            />

            {/* Text */}
            <div className="flex flex-col leading-none" style={{ gap: "6px" }}>
              <motion.span
                initial={{ opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.65, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "2.75rem",
                  fontWeight: 900,
                  color: "#ffffff",
                  letterSpacing: "0.04em",
                  lineHeight: 1,
                }}
              >
                ONEX
              </motion.span>
              <motion.span
                initial={{ opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.82, duration: 0.4, ease: "easeOut" }}
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "1rem",
                  fontWeight: 400,
                  color: "rgba(255,255,255,0.85)",
                  letterSpacing: "0.18em",
                  lineHeight: 1,
                }}
              >
                GLOBAL
              </motion.span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
