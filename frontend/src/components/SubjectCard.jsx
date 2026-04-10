import React from "react";
import { ChevronRight } from "lucide-react";

const SubjectCard = ({
  courseName,
  displayName,
  credits,
  totalCourses,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="bg-[var(--bg-white)] rounded-xl p-4 hover:shadow-lg transition-all duration-200 cursor-pointer group flex items-center gap-3"
      style={{
        boxShadow: "var(--shadow-card)",
      }}
    >
      <div className="flex-1 min-w-0">
        <h4 className="text-[13px] font-semibold text-[var(--text-charcoal)] mb-0.5 line-clamp-1 group-hover:text-[var(--text-midnight)] transition-colors">
          {courseName}
        </h4>
        <p className="text-[11px] text-[var(--text-subtle)] font-medium uppercase tracking-wide mb-2">
          {displayName}
        </p>
        <div className="flex items-center gap-2">
          <span className="badge-clean text-[var(--text-charcoal)] bg-[var(--bg-white)] shadow-[var(--shadow-ring)]">{credits} credits</span>
          <span className="badge-clean badge-clean-dark text-[var(--bg-white)] bg-[var(--text-midnight)] shadow-[var(--shadow-ring)]">{totalCourses} sections</span>
        </div>
      </div>
      <ChevronRight size={16} className="text-[var(--text-subtle)] group-hover:text-[var(--text-mid)] shrink-0 transition-colors" />
    </div>
  );
};

export default SubjectCard;
