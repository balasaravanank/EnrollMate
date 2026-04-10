import React from "react";
import { Clock, User, Terminal } from "lucide-react";

const CourseCard = ({ course, onAdd }) => {
  return (
    <div
      className="bg-[var(--bg-white)] rounded-xl p-4 hover:shadow-lg transition-all duration-200 group"
      style={{
        boxShadow: "var(--shadow-card)",
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h5 className="text-[14px] font-bold text-[var(--text-midnight)] mb-1 line-clamp-2 leading-snug break-words">
            {course.courseName}
          </h5>
          <p className="text-[12px] text-[var(--text-mid)] font-medium uppercase tracking-wide">
            {course.displayName}
          </p>
        </div>
      </div>

      <div className="space-y-2.5 mb-4">
        <div className="flex items-center flex-wrap gap-2">
          <span className="flex items-center gap-1.5 px-2 py-1 bg-[var(--bg-white)] border border-[rgba(34,42,53,0.08)] dark:border-white/10 rounded-md text-[12px] font-medium text-[var(--text-charcoal)] shadow-sm">
            <User size={12} className="text-[var(--text-mid)]" />
            <span className="truncate max-w-[140px]">{course.staff}</span>
          </span>
          <span className="flex items-center gap-1.5 px-2.5 py-1 bg-[var(--text-midnight)] border border-[var(--text-charcoal)] rounded-md text-[12px] font-mono font-bold text-[var(--bg-white)] shadow-sm">
            <Terminal size={12} className="text-[var(--bg-subtle)]" />
            {course.uniqueId?.split('_').pop()}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[12px] text-[var(--text-mid)] pl-1">
          <Clock size={12} className="text-[var(--text-subtle)] shrink-0" />
          <span className="truncate">
            {course.slots?.map((slot, idx) => (
              <span key={idx}>
                {slot.day?.substring(0, 3)} {slot.time}
                {idx < course.slots.length - 1 && ", "}
              </span>
            ))}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2.5 border-t border-[rgba(34,42,53,0.06)] dark:border-white/10">
        <span className="flex items-center gap-1 px-2 py-1 bg-[var(--bg-subtle)] border border-[rgba(34,42,53,0.08)] dark:border-white/10 rounded-md text-[12px] font-bold text-[var(--text-midnight)] shadow-sm">
          {course.credits} credits
        </span>
        <button
          onClick={() => onAdd(course.uniqueId)}
          className="btn-brand h-7 px-3 text-[12px] font-medium rounded-md"
        >
          + Add
        </button>
      </div>
    </div>
  );
};

export default CourseCard;
