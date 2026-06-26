import React, { useEffect, useLayoutEffect, useState, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MousePointer2, X, ArrowRight, ArrowLeft } from "lucide-react";

/**
 * A lightweight guided tour: dims the page, spotlights the current target
 * element, shows a tooltip, and animates a cursor that taps the target.
 *
 * Props:
 *   steps   – array of { selector, title, text, placement?, spotlightPadding? }
 *   onClose – called when the tour is dismissed or finished
 *   stepIndex / setStepIndex – controlled step state
 */
const GuidedTour = ({ steps, stepIndex, setStepIndex, onClose }) => {
  const [rect, setRect] = useState(null);
  const [tipSize, setTipSize] = useState({ width: 0, height: 0 });
  const tipRef = useRef(null);
  const step = steps[stepIndex];

  // Measure the current target so the spotlight + tooltip can follow it.
  const measure = useCallback(() => {
    if (!step) return;
    const el = document.querySelector(step.selector);
    if (el) {
      el.scrollIntoView({ block: "center", behavior: "smooth" });
      const r = el.getBoundingClientRect();
      setRect({ top: r.top, left: r.left, width: r.width, height: r.height });
    } else {
      setRect(null); // target not on screen → center the tooltip
    }
  }, [step]);

  // Fire any side effect tied to this step (e.g. open a modal), then measure.
  useEffect(() => {
    if (step?.onEnter) step.onEnter();
    // small delay lets newly-opened UI (modals) render before measuring
    const t = setTimeout(measure, 60);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepIndex]);

  useLayoutEffect(() => {
    measure();
  }, [measure, stepIndex]);

  // Measure the tooltip itself so we can clamp it inside the viewport.
  useLayoutEffect(() => {
    if (tipRef.current) {
      const r = tipRef.current.getBoundingClientRect();
      if (r.height && r.height !== tipSize.height) {
        setTipSize({ width: r.width, height: r.height });
      }
    }
  });

  // Keep the spotlight aligned while the user scrolls / resizes, and poll
  // briefly so targets that mount slightly later (modals) get picked up.
  useEffect(() => {
    measure();
    const onChange = () => measure();
    window.addEventListener("resize", onChange);
    window.addEventListener("scroll", onChange, true);
    const poll = setInterval(measure, 400);
    return () => {
      window.removeEventListener("resize", onChange);
      window.removeEventListener("scroll", onChange, true);
      clearInterval(poll);
    };
  }, [measure]);

  if (!step) return null;

  const isLast = stepIndex === steps.length - 1;
  const pad = step.spotlightPadding ?? 8;

  // Spotlight box geometry (falls back to screen center when no target).
  const spot = rect
    ? {
        top: rect.top - pad,
        left: rect.left - pad,
        width: rect.width + pad * 2,
        height: rect.height + pad * 2,
      }
    : null;

  // Decide tooltip placement relative to the target, then clamp fully
  // inside the viewport so the card is never cut off.
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const margin = 16;
  const tooltipW = Math.min(320, vw - margin * 2);
  const tipH = tipSize.height || 220;

  const clampLeft = (l) => Math.min(Math.max(l, margin), vw - tooltipW - margin);
  const clampTop = (t) => Math.min(Math.max(t, margin), vh - tipH - margin);

  let tipStyle;
  let cursorStyle;
  if (spot) {
    const placement =
      step.placement || (spot.top > vh / 2 ? "top" : "bottom");
    const centerX = spot.left + spot.width / 2;
    const centerY = spot.top + spot.height / 2;

    let top;
    let left;
    if (placement === "bottom") {
      top = spot.top + spot.height + 14;
      left = centerX - tooltipW / 2;
    } else if (placement === "top") {
      top = spot.top - tipH - 14;
      left = centerX - tooltipW / 2;
    } else if (placement === "left") {
      top = centerY - tipH / 2;
      left = spot.left - tooltipW - 14;
    } else {
      top = centerY - tipH / 2;
      left = spot.left + spot.width + 14;
    }

    tipStyle = { top: clampTop(top), left: clampLeft(left) };

    // Animated cursor sits on the target (clamped to stay visible).
    cursorStyle = {
      top: Math.min(Math.max(centerY, margin), vh - margin),
      left: Math.min(Math.max(centerX, margin), vw - margin),
    };
  } else {
    tipStyle = {
      top: clampTop(vh / 2 - tipH / 2),
      left: clampLeft(vw / 2 - tooltipW / 2),
    };
  }

  const handleNext = () => {
    if (isLast) onClose();
    else setStepIndex(stepIndex + 1);
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999]" style={{ pointerEvents: "none" }}>
      {/* Dim layer with a spotlight cut-out via large box-shadow */}
      {spot ? (
        <motion.div
          key={`spot-${stepIndex}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute rounded-xl"
          style={{
            top: spot.top,
            left: spot.left,
            width: spot.width,
            height: spot.height,
            boxShadow: "0 0 0 9999px rgba(15,18,24,0.62)",
            transition: "all 0.35s cubic-bezier(0.16,1,0.3,1)",
            pointerEvents: "none",
          }}
        >
          {/* pulsing ring */}
          <span className="absolute inset-0 rounded-xl ring-2 ring-white/80 animate-pulse" />
        </motion.div>
      ) : (
        <div
          className="absolute inset-0"
          style={{ background: "rgba(15,18,24,0.62)", pointerEvents: "none" }}
        />
      )}

      {/* Animated pointing cursor */}
      {cursorStyle && (
        <motion.div
          key={`cursor-${stepIndex}`}
          className="absolute"
          style={{ ...cursorStyle, pointerEvents: "none" }}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{
            opacity: 1,
            scale: [1, 0.82, 1],
            y: [0, 6, 0],
            x: [0, 4, 0],
          }}
          transition={{
            opacity: { duration: 0.3 },
            scale: { repeat: Infinity, duration: 1.3, ease: "easeInOut" },
            y: { repeat: Infinity, duration: 1.3, ease: "easeInOut" },
            x: { repeat: Infinity, duration: 1.3, ease: "easeInOut" },
          }}
        >
          {/* tap ripple */}
          <motion.span
            className="absolute -top-1 -left-1 w-9 h-9 rounded-full bg-[var(--color-brand,#3b5bff)]/30"
            animate={{ scale: [0.4, 1.6], opacity: [0.6, 0] }}
            transition={{ repeat: Infinity, duration: 1.3, ease: "easeOut" }}
          />
          <MousePointer2
            size={26}
            className="text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] fill-[var(--color-brand,#3b5bff)]"
          />
        </motion.div>
      )}

      {/* Tooltip card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`tip-${stepIndex}`}
          ref={tipRef}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="absolute bg-white dark:bg-[#1c1f26] rounded-xl p-4 shadow-[0_12px_40px_rgba(0,0,0,0.35)]"
          style={{ ...tipStyle, width: tooltipW, pointerEvents: "auto" }}
        >
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-[var(--text-subtle,#9aa0aa)] hover:text-[var(--text-charcoal,#222)] transition-colors"
            aria-label="Skip tour"
          >
            <X size={15} />
          </button>

          <div className="flex items-center gap-1.5 mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-brand,#3b5bff)]">
              Step {stepIndex + 1} of {steps.length}
            </span>
          </div>

          <h3 className="font-display text-[15px] font-bold text-[var(--text-charcoal,#222)] dark:text-white mb-1 pr-5">
            {step.title}
          </h3>
          <p className="text-[13px] leading-relaxed text-[var(--text-mid,#5a616b)] dark:text-gray-300 mb-3">
            {step.text}
          </p>

          {/* progress dots */}
          <div className="flex items-center gap-1 mb-3">
            {steps.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === stepIndex
                    ? "w-5 bg-[var(--color-brand,#3b5bff)]"
                    : "w-1.5 bg-[var(--text-subtle,#cbd0d8)]/40"
                }`}
              />
            ))}
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={onClose}
              className="text-[12px] font-medium text-[var(--text-subtle,#9aa0aa)] hover:text-[var(--text-mid,#5a616b)] transition-colors"
            >
              Skip
            </button>
            <div className="flex items-center gap-2">
              {stepIndex > 0 && (
                <button
                  onClick={() => setStepIndex(stepIndex - 1)}
                  className="inline-flex items-center gap-1 h-8 px-3 rounded-lg text-[12px] font-medium text-[var(--text-mid,#5a616b)] hover:bg-[var(--bg-subtle,#f1f2f4)] transition-colors"
                >
                  <ArrowLeft size={13} />
                  Back
                </button>
              )}
              <button
                onClick={handleNext}
                className="btn-brand inline-flex items-center gap-1.5 h-8 px-4 rounded-lg text-[12px] font-semibold"
              >
                {isLast ? "Got it" : "Next"}
                {!isLast && <ArrowRight size={13} />}
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>,
    document.body
  );
};

export default GuidedTour;
