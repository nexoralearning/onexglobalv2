import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Brain, Users, Zap, Shield, FileText } from "lucide-react";

interface LandingPageProps {
  onGetStarted: () => void;
}

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] },
});

const features = [
  {
    icon: Brain,
    title: "AI-Powered Learning",
    desc: "Smart study tools that adapt to your pace — AI summaries, content scanning, and personalised revision plans.",
  },
  {
    icon: BookOpen,
    title: "Past Papers & Notes",
    desc: "A growing library of past exam papers and community notes, organised by subject and year.",
  },
  {
    icon: Users,
    title: "Study Groups",
    desc: "Connect with classmates, form study groups, and stay accountable with a built-in leaderboard.",
  },
  {
    icon: Zap,
    title: "Focus Mode",
    desc: "Distraction-free Pomodoro timer with session tracking so you can study smarter, not longer.",
  },
];

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-[#060608] text-white overflow-y-auto">
      {/* ── Dot-grid texture ── */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* ── Glow blobs ── */}
      <div
        className="fixed top-[-180px] left-1/2 -translate-x-1/2 w-[720px] h-[420px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(139,92,246,0.18) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 pb-24">
        {/* ── Nav ── */}
        <motion.nav
          {...fadeUp(0.1)}
          className="flex items-center justify-between py-8"
        >
          <div className="flex items-center gap-3">
            {/* Mini logo mark */}
            <svg viewBox="0 0 100 90" width="32" height="29" fill="none">
              {[
                [42.5,41.3,16.2,31.7],[43.7,39.1,21.5,22.1],[45.4,37.5,29.4,14.5],
                [47.6,36.4,39.2,9.7],[50,36,50,8],[52.4,36.4,60.8,9.7],
                [54.6,37.5,70.6,14.5],[56.3,39.1,78.5,22.1],[57.5,41.3,83.8,31.7],
              ].map(([x1,y1,x2,y2], i) => (
                <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="white" strokeWidth="3" strokeLinecap="round" />
              ))}
              <circle cx="50" cy="44" r="4.5" fill="white" />
              {[[56,12,88],[65,20,80],[74,29,71]].map(([y,x1,x2],i) => (
                <line key={i} x1={x1} y1={y} x2={x2} y2={y} stroke="white" strokeWidth="4" strokeLinecap="round" />
              ))}
            </svg>
            <span style={{ fontWeight: 800, fontSize: "1.05rem", letterSpacing: "0.08em" }}>
              ONEX <span style={{ fontWeight: 400, opacity: 0.7, letterSpacing: "0.15em", fontSize: "0.85rem" }}>GLOBAL</span>
            </span>
          </div>
          <button
            onClick={onGetStarted}
            className="flex items-center gap-2 text-sm font-medium text-white/60 hover:text-white transition-colors"
          >
            Enter app <ArrowRight className="w-4 h-4" />
          </button>
        </motion.nav>

        {/* ── Hero ── */}
        <section className="pt-16 pb-24 text-center">
          <motion.div {...fadeUp(0.2)} className="mb-5">
            <span
              className="inline-block text-xs font-semibold tracking-[0.22em] uppercase px-3 py-1 rounded-full"
              style={{ background: "rgba(139,92,246,0.15)", color: "rgba(167,139,250,1)", border: "1px solid rgba(139,92,246,0.3)" }}
            >
              Student Platform
            </span>
          </motion.div>

          <motion.h1
            {...fadeUp(0.3)}
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 900,
              fontSize: "clamp(4.5rem, 14vw, 10rem)",
              lineHeight: 0.92,
              letterSpacing: "0.02em",
              background: "linear-gradient(160deg, #ffffff 40%, rgba(167,139,250,0.85) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            ONEX
          </motion.h1>

          <motion.p
            {...fadeUp(0.42)}
            className="mt-6 text-base md:text-lg text-white/55 max-w-xl mx-auto leading-relaxed"
          >
            The all-in-one academic workspace for university students. AI tools, past papers, study groups, and a focus timer — everything you need, in one place.
          </motion.p>

          <motion.div {...fadeUp(0.54)} className="mt-10">
            <button
              onClick={onGetStarted}
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-xl font-semibold text-base transition-all duration-200 hover:scale-[1.03] active:scale-[0.98]"
              style={{
                background: "linear-gradient(135deg, hsl(270,90%,62%) 0%, hsl(260,80%,52%) 100%)",
                boxShadow: "0 0 32px rgba(139,92,246,0.45), 0 4px 24px rgba(0,0,0,0.4)",
              }}
            >
              Get Started
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </motion.div>
        </section>

        {/* ── What we do ── */}
        <motion.section
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="py-16"
        >
          <h2
            className="text-center text-xs font-semibold tracking-[0.22em] uppercase mb-12"
            style={{ color: "rgba(167,139,250,0.8)" }}
          >
            What we do
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {features.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.75 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-2xl p-6"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.25)" }}
                >
                  <Icon className="w-5 h-5" style={{ color: "rgba(167,139,250,1)" }} />
                </div>
                <h3 className="font-semibold text-base text-white mb-2">{title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ── Divider ── */}
        <div className="border-t border-white/[0.06] my-4" />

        {/* ── Privacy Policy ── */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="py-16"
          id="privacy"
        >
          <div className="flex items-center gap-3 mb-8">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.22)" }}
            >
              <Shield className="w-4.5 h-4.5" style={{ color: "rgba(167,139,250,1)" }} />
            </div>
            <h2 className="text-xl font-bold text-white">Privacy Policy</h2>
          </div>

          <div className="space-y-5 text-sm text-white/55 leading-relaxed">
            <p>
              <span className="text-white/80 font-medium">Last updated: July 2025.</span> Onex Global ("we", "us", or "our") is committed to protecting your personal data. This policy explains what information we collect, how we use it, and your rights.
            </p>

            <div>
              <h3 className="text-white/80 font-semibold mb-1.5">Data we collect</h3>
              <p>
                We collect information you provide directly — such as your name, email address, and academic details when you create an account. We also collect usage data (pages visited, features used, time spent) to improve the platform. No sensitive personal data is collected without your explicit consent.
              </p>
            </div>

            <div>
              <h3 className="text-white/80 font-semibold mb-1.5">How we use your data</h3>
              <p>
                Your data is used to provide and personalise your experience on Onex Global, send important account communications, and improve our services. We do not sell your data to third parties, ever.
              </p>
            </div>

            <div>
              <h3 className="text-white/80 font-semibold mb-1.5">Data storage & security</h3>
              <p>
                All data is stored on secure, encrypted servers. We use industry-standard practices including TLS in transit and AES-256 at rest. Access is restricted to authorised personnel only.
              </p>
            </div>

            <div>
              <h3 className="text-white/80 font-semibold mb-1.5">Your rights</h3>
              <p>
                You have the right to access, correct, or delete your personal data at any time from your account settings. To exercise any other rights or make a data request, contact us at{" "}
                <span className="text-purple-400">privacy@onexglobal.com</span>.
              </p>
            </div>

            <div>
              <h3 className="text-white/80 font-semibold mb-1.5">Cookies</h3>
              <p>
                We use essential cookies to keep you signed in and remember your preferences. No third-party advertising cookies are placed on your device.
              </p>
            </div>
          </div>
        </motion.section>

        {/* ── Divider ── */}
        <div className="border-t border-white/[0.06] my-4" />

        {/* ── Terms / Policy ── */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="py-16"
          id="terms"
        >
          <div className="flex items-center gap-3 mb-8">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.22)" }}
            >
              <FileText className="w-4.5 h-4.5" style={{ color: "rgba(167,139,250,1)" }} />
            </div>
            <h2 className="text-xl font-bold text-white">Terms & Conditions</h2>
          </div>

          <div className="space-y-5 text-sm text-white/55 leading-relaxed">
            <p>
              <span className="text-white/80 font-medium">Last updated: July 2025.</span> By using Onex Global you agree to these terms. Please read them carefully.
            </p>

            <div>
              <h3 className="text-white/80 font-semibold mb-1.5">Eligibility</h3>
              <p>
                Onex Global is intended for students aged 16 and above. By creating an account you confirm you meet this requirement and that the information you provide is accurate.
              </p>
            </div>

            <div>
              <h3 className="text-white/80 font-semibold mb-1.5">Acceptable use</h3>
              <p>
                You may use Onex Global for lawful, personal, non-commercial academic purposes. You must not upload content that infringes copyright, contains illegal material, or is intended to harass other users. We reserve the right to remove content or suspend accounts that violate these terms.
              </p>
            </div>

            <div>
              <h3 className="text-white/80 font-semibold mb-1.5">Intellectual property</h3>
              <p>
                All platform design, code, and original content is the property of Onex Global. User-submitted content (notes, posts, uploads) remains yours — by submitting it you grant us a non-exclusive licence to display and distribute it within the platform.
              </p>
            </div>

            <div>
              <h3 className="text-white/80 font-semibold mb-1.5">Subscriptions & payments</h3>
              <p>
                Some features require a paid plan. Subscriptions renew automatically unless cancelled before the renewal date. Refunds are handled on a case-by-case basis in line with applicable consumer law.
              </p>
            </div>

            <div>
              <h3 className="text-white/80 font-semibold mb-1.5">Limitation of liability</h3>
              <p>
                Onex Global is provided "as is". We aim for high availability but cannot guarantee uninterrupted service. We are not liable for any academic decisions made based on content found on the platform.
              </p>
            </div>

            <div>
              <h3 className="text-white/80 font-semibold mb-1.5">Changes to these terms</h3>
              <p>
                We may update these terms from time to time. We'll notify you of significant changes via email or an in-app notice. Continued use of the platform after changes constitutes acceptance.
              </p>
            </div>

            <p>
              Questions? Reach us at{" "}
              <span className="text-purple-400">legal@onexglobal.com</span>.
            </p>
          </div>
        </motion.section>

        {/* ── Footer CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.3, ease: [0.22, 1, 0.36, 1] }}
          className="text-center pt-8 pb-4"
        >
          <button
            onClick={onGetStarted}
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-xl font-semibold text-base transition-all duration-200 hover:scale-[1.03] active:scale-[0.98]"
            style={{
              background: "linear-gradient(135deg, hsl(270,90%,62%) 0%, hsl(260,80%,52%) 100%)",
              boxShadow: "0 0 32px rgba(139,92,246,0.45), 0 4px 24px rgba(0,0,0,0.4)",
            }}
          >
            Get Started
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
          </button>
          <p className="mt-6 text-xs text-white/25">© 2025 Onex Global. All rights reserved.</p>
        </motion.div>
      </div>
    </div>
  );
}
