import { FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="w-full bg-[var(--bg-white)] mt-auto border-t border-[rgba(34,42,53,0.06)] dark:border-white/10 transition-colors duration-200">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-4 text-[12px] text-[var(--text-subtle)]">
            <span>
              Built by{" "}
              <a href="https://www.linkedin.com/in/santhosh2673/" target="_blank" rel="noopener noreferrer" className="link-clean text-[var(--text-charcoal)]">
                Santhosh
              </a>
            </span>
            <span className="text-[var(--text-subtle)] opacity-40">·</span>
            <span>
              Built by{" "}
              <a href="https://www.linkedin.com/in/bala-saravanan-k/" target="_blank" rel="noopener noreferrer" className="link-clean text-[var(--text-charcoal)]">
                Bala Saravanan K
              </a>
            </span>
            <span className="text-[var(--text-subtle)] opacity-40">·</span>
            <span>
              Concept{" "}
              <a href="http://www.linkedin.com/in/prakathis-wararn-5672b9372" target="_blank" rel="noopener noreferrer" className="link-clean text-[var(--text-charcoal)]">
                Prahathieswaran
              </a>
            </span>
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
