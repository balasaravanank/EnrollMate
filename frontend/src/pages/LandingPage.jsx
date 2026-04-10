import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PasteDataModal from "../Modals/PasteDataModal";
import { motion } from "framer-motion";
import {
  FaGithub,
  FaPaste,
  FaArrowRight,
} from "react-icons/fa";
import {
  CalendarDays,
  AlertTriangle,
  BookOpen,
  Users,
  Smartphone,
  Download,
} from "lucide-react";

const LandingPage = () => {
  const navigate = useNavigate();
  const [isPasteModalOpen, setIsPasteModalOpen] = useState(false);

  const goToHomePage = () => navigate("/home");

  const features = [
    {
      icon: CalendarDays,
      title: "Visual Timetable",
      desc: "Your weekly schedule in a clean grid. No drag, no fuss — just clarity.",
    },
    {
      icon: AlertTriangle,
      title: "Conflict Detection",
      desc: "Overlapping courses flagged instantly. Never double-book a slot.",
    },
    {
      icon: BookOpen,
      title: "Course Browser",
      desc: "Search and filter by name, instructor, or time. Find what fits.",
    },
    {
      icon: Users,
      title: "Faculty Info",
      desc: "See who teaches each section before you commit.",
    },
    {
      icon: Smartphone,
      title: "Works Everywhere",
      desc: "Responsive from laptop to phone. Plan anywhere.",
    },
    {
      icon: Download,
      title: "Export Ready",
      desc: "Download your finalized timetable as HTML. Save it, share it.",
    },
  ];

  const sectionAnim = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const stagger = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
  };

  const cardAnim = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <div className="min-h-screen bg-[var(--bg-white)] transition-colors duration-200">

      {/* ─── NAV ─── */}
      <nav className="sticky top-0 z-50 bg-[var(--bg-white)]/95 backdrop-blur-sm transition-colors duration-200">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo-transparent.png" alt="EnrollMate" className="h-12 w-12 object-contain bg-transparent" />
            <span className="font-display text-[17px] font-bold text-[var(--text-midnight)] tracking-tight">
              EnrollMate
            </span>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="https://github.com/Sandy-07-Coder/EnrollMate"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 text-[13px] font-medium text-[var(--text-mid)] hover:text-[var(--text-charcoal)] transition-colors px-3 py-2"
            >
              <FaGithub className="w-4 h-4" />
              GitHub
            </a>
            <button
              onClick={goToHomePage}
              className="btn-brand h-9 px-5 text-[13px] font-semibold rounded-lg"
            >
              Open App
            </button>
          </div>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section className="pt-20 sm:pt-28 pb-20 sm:pb-24">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={sectionAnim}
            className="max-w-3xl"
          >
            {/* Overline */}
            <p className="text-[13px] font-medium text-[var(--text-mid)] tracking-wide mb-6">
              Open source · Built for students
            </p>

            {/* Headline — massive, tight, monochrome */}
            <h1 className="font-display text-[clamp(40px,7vw,72px)] font-bold text-[var(--text-charcoal)] leading-[1.05] tracking-[-0.03em] mb-6">
              Plan your
              <br />
              perfect semester.
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-[var(--text-mid)] leading-relaxed max-w-xl mb-10">
              Pick courses, detect conflicts, and build your timetable
               - all in one clean interface.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={goToHomePage}
                className="btn-brand group inline-flex items-center gap-2.5 h-12 px-7 text-[15px] font-semibold rounded-lg"
              >
                Get Started
                <FaArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={() => setIsPasteModalOpen(true)}
                className="inline-flex items-center gap-2 h-12 px-6 bg-[var(--bg-white)] text-[var(--text-charcoal)] text-[15px] font-medium rounded-lg transition-all"
                style={{
                  boxShadow: "var(--shadow-card)",
                }}
              >
                <FaPaste className="w-3.5 h-3.5 text-[var(--text-mid)]" />
                Paste Course Data
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section className="py-24 sm:py-28">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={sectionAnim}
            className="mb-16"
          >
            <p className="text-[13px] font-medium text-[var(--text-mid)] tracking-wide mb-3">
              Features
            </p>
            <h2 className="font-display text-[clamp(28px,4vw,48px)] font-bold text-[var(--text-charcoal)] leading-[1.10] tracking-[-0.02em]">
              Everything you need,
              <br className="hidden sm:block" />
              nothing you don't.
            </h2>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={i}
                  variants={cardAnim}
                  className="group bg-[var(--bg-white)] rounded-xl p-6 cursor-default transition-shadow duration-200"
                  style={{
                    boxShadow: "var(--shadow-card)",
                  }}
                >
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: "var(--color-brand)" }}>
                    <Icon size={16} className="text-white" strokeWidth={2} />
                  </div>
                  <h3 className="font-display text-[15px] font-bold text-[var(--text-charcoal)] mb-1.5">
                    {f.title}
                  </h3>
                  <p className="text-[14px] text-[var(--text-mid)] leading-relaxed">
                    {f.desc}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="py-24 sm:py-28 bg-[var(--bg-off)] border-t border-b border-[var(--shadow-ring)] transition-colors duration-200">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={sectionAnim}
            className="mb-16"
          >
            <p className="text-[13px] font-medium text-[var(--text-mid)] tracking-wide mb-3">
              How it works
            </p>
            <h2 className="font-display text-[clamp(28px,4vw,48px)] font-bold text-[var(--text-charcoal)] leading-[1.10] tracking-[-0.02em]">
              Three steps.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-8">
            {[
              {
                num: "01",
                title: "Paste or Browse",
                desc: "Copy your enrollment page and paste it in, or use filters to browse the catalog.",
              },
              {
                num: "02",
                title: "Pick Courses",
                desc: "Select courses from search results. Conflicts are flagged instantly.",
              },
              {
                num: "03",
                title: "View & Export",
                desc: "See your timetable come together. Download as HTML when you're done.",
              },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="font-display text-[56px] sm:text-[64px] font-bold leading-none select-none block mb-2 text-[var(--text-subtle)] opacity-40">
                  {step.num}
                </span>
                <h3 className="font-display text-[17px] font-bold text-[var(--text-charcoal)] mb-1.5">
                  {step.title}
                </h3>
                <p className="text-[14px] text-[var(--text-mid)] leading-relaxed">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CREDITS ─── */}
      <section className="py-20 border-t" style={{ borderColor: 'var(--shadow-ring)' }}>
        <div className="max-w-[1200px] mx-auto px-6 sm:px-8 text-center">
          <p className="text-[13px] font-medium text-[var(--text-subtle)] mb-6">Built with care</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 sm:gap-8 text-[14px]">
            <CreditLink label="Concept" name="Prakathiswararn" href="http://www.linkedin.com/in/prakathis-wararn-5672b9372" />
            <Dot />
            <CreditLink label="Built by" name="Santhosh Sandy" href="https://www.linkedin.com/in/santhosh2673/" />
            <Dot />
            <CreditLink label="Built by" name="Bala Saravanan K" href="https://www.linkedin.com/in/bala-saravanan-k/" />
            <Dot />
            <CreditLink label="Via" name="Tech Society" href="https://techsociety.saveetha.in/" />
          </div>
        </div>
      </section>

      {/* ─── FOOTER CTA ─── */}
      <section className="py-24 sm:py-28 bg-[var(--text-charcoal)] text-[var(--bg-white)] transition-colors duration-200">
        <div className="max-w-2xl mx-auto px-6 sm:px-8 text-center">
          <h2 className="font-display text-[clamp(28px,5vw,48px)] font-bold leading-[1.10] tracking-[-0.02em] mb-4">
            Ready to plan<br className="sm:hidden" /> your schedule?
          </h2>
          <p className="text-[var(--text-mid)] text-base mb-10 max-w-md mx-auto">
            Stop guessing. Start enrolling with confidence.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={goToHomePage}
              className="btn-brand group h-12 px-8 text-[15px] font-semibold rounded-lg inline-flex items-center gap-2"
            >
              Launch App
              <FaArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </button>
            <a
              href="https://github.com/Sandy-07-Coder/EnrollMate"
              target="_blank"
              rel="noopener noreferrer"
              className="h-12 px-6 text-[15px] font-medium text-[#898989] hover:text-white rounded-lg inline-flex items-center gap-2 transition-colors border border-[rgba(255,255,255,0.12)] hover:border-[rgba(255,255,255,0.25)]"
            >
              <FaGithub className="w-4 h-4" />
              Star on GitHub
            </a>
          </div>
        </div>
      </section>

      <PasteDataModal isOpen={isPasteModalOpen} onClose={() => setIsPasteModalOpen(false)} />
    </div>
  );
};

/* ─── Helpers ─── */

const CreditLink = ({ label, name, href }) => (
  <span>
    <span className="text-[var(--text-subtle)]">{label} </span>
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="link-clean text-[var(--text-charcoal)]"
    >
      {name}
    </a>
  </span>
);

const Dot = () => <span className="hidden sm:block text-[var(--text-subtle)]">·</span>;

export default LandingPage;
