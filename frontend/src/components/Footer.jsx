import { FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="w-full bg-[var(--bg-white)] mt-auto border-t border-[rgba(34,42,53,0.06)] dark:border-white/10 transition-colors duration-200">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col xl:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap justify-center xl:justify-start items-center gap-4 text-[12px] text-[var(--text-subtle)]">
            <span>
              Built by{" "}
              <a href="https://www.linkedin.com/in/bala-saravanan-k/" target="_blank" rel="noopener noreferrer" className="link-clean text-[var(--text-charcoal)] font-semibold hover:text-[var(--brand-main)] transition-colors">
                Bala Saravanan K
              </a>
              {" "}and{" "}
              <a href="https://www.linkedin.com/in/santhosh2673/" target="_blank" rel="noopener noreferrer" className="link-clean text-[var(--text-charcoal)] font-semibold hover:text-[var(--brand-main)] transition-colors">
                Santhosh
              </a>
            </span>
            <span className="text-[var(--text-subtle)] opacity-40">·</span>
            <span>
              Concept{" "}
              <a href="http://www.linkedin.com/in/prakathis-wararn-5672b9372" target="_blank" rel="noopener noreferrer" className="link-clean text-[var(--text-charcoal)] font-semibold hover:text-[var(--brand-main)] transition-colors">
                Prahathieswaran
              </a>
            </span>
          </div>

          <div className="flex flex-wrap flex-1 justify-center xl:justify-center items-center gap-3 text-[12px] bg-[var(--bg-off)] px-5 py-2 rounded-full border border-[rgba(34,42,53,0.06)] dark:border-white/5">
            <span className="font-bold text-[var(--text-charcoal)] mr-1">Also try:</span>
            <a href="https://trackify.arbasil.me/" target="_blank" rel="noopener noreferrer" className="link-clean font-medium text-[var(--text-mid)] hover:text-[var(--brand-main)] transition-colors">
              Trackify
            </a>
            <span className="text-[var(--text-subtle)] opacity-40">·</span>
            <a href="https://examtrackpro.vercel.app/" target="_blank" rel="noopener noreferrer" className="link-clean font-medium text-[var(--text-mid)] hover:text-[var(--brand-main)] transition-colors">
              ExamTrackPro
            </a>
            <span className="text-[var(--text-subtle)] opacity-40">·</span>
            <a href="https://labforge.baladev.me/" target="_blank" rel="noopener noreferrer" className="link-clean font-medium text-[var(--text-mid)] hover:text-[var(--brand-main)] transition-colors">
              LabForge
            </a>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/Sandy-07-Coder/EnrollMate"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[12px] text-[var(--text-subtle)] hover:text-[var(--text-charcoal)] transition-colors"
            >
              <FaGithub className="w-3.5 h-3.5" />
              GitHub
            </a>
            <span className="text-[11px] text-[var(--text-subtle)] opacity-60 flex items-center justify-center">
              © {new Date().getFullYear()} EnrollMate
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
