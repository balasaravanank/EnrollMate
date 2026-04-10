import React from "react";
import { useCourseStore } from "../store/courseStore";
import DownloadPDFBtn from "./DownloadPDFBtn";
import { X as XIcon, User, Terminal, BookOpen, Clock } from "lucide-react";
import toast from "react-hot-toast";

const SelectedCoursesBox = ({ onDownloadClick }) => {
  const { selectedCourses, removeSelectedCourse } = useCourseStore();

  const totalCredits = selectedCourses.reduce(
    (sum, course) => sum + (course?.credits || 0),
    0
  );

  return (
    <div
      className="bg-[var(--bg-white)] rounded-xl overflow-hidden transition-colors duration-200"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      {/* Header */}
      <div className="px-5 py-4 border-b border-[rgba(34,42,53,0.06)] dark:border-white/10">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-[14px] font-bold text-[var(--text-charcoal)]">Selected</h3>
          <div className="flex items-center gap-3 text-[12px] text-[var(--text-subtle)]">
            <span><span className="font-semibold text-[var(--text-charcoal)]">{selectedCourses.length}</span> courses</span>
            <span className="text-[var(--text-subtle)] opacity-40">|</span>
            <span><span className="font-semibold text-[var(--text-charcoal)]">{totalCredits}</span> credits</span>
          </div>
        </div>
      </div>

      {/* Course List */}
      <div className="max-h-[420px] overflow-y-auto">
        {selectedCourses.length > 0 ? (
          <div>
            {selectedCourses.map((course, index) => (
              <div
                key={course._id || index}
                className="group px-5 py-4 hover:bg-[var(--bg-off)] border-b border-[rgba(34,42,53,0.04)] dark:border-white/5 transition-colors duration-100 animate-fade-in"
                style={{
                  animationDelay: `${index * 0.03}s`,
                }}
              >
                <div className="flex justify-between items-start gap-2 mb-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[14px] font-bold text-[var(--text-midnight)] leading-snug break-words">
                      {course.courseName}
                    </h4>
                    <span className="text-[12px] text-[var(--text-mid)] font-medium mt-0.5 block">
                      {course.displayName?.toUpperCase()}
                    </span>
                  </div>
                  <button
                    onClick={() => removeSelectedCourse(course.uniqueId)}
                    className="opacity-0 group-hover:opacity-100 text-[var(--text-subtle)] hover:text-[#ef4444] p-1.5 rounded-md hover:bg-red-500/10 transition-all duration-150 shrink-0 -mr-1.5 mt-[-4px]"
                    aria-label="Remove course"
                  >
                    <XIcon size={14} strokeWidth={2.5} />
                  </button>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1.5 px-2 py-1 bg-[var(--bg-white)] border border-[rgba(34,42,53,0.08)] dark:border-white/10 rounded-md text-[12px] font-medium text-[var(--text-charcoal)] shadow-sm">
                      <User size={12} className="text-[var(--text-mid)]" />
                      {course.staff}
                    </span>
                    <button 
                      onClick={() => {
                        const code = course.uniqueId?.split('_').pop();
                        if (code) {
                          navigator.clipboard.writeText(code);
                          toast.success("Code copied!");
                        }
                      }}
                      title="Copy course code"
                      className="flex items-center gap-1.5 px-2.5 py-1 bg-[var(--text-midnight)] border border-[var(--text-charcoal)] rounded-md text-[12px] font-mono font-bold text-[var(--bg-white)] shadow-sm hover:scale-105 active:scale-95 transition-all cursor-copy"
                    >
                      <Terminal size={12} className="text-[var(--bg-subtle)]" />
                      {course.uniqueId?.split('_').pop()}
                    </button>
                  </div>
                  <span className="flex items-center gap-1 px-2 py-1 bg-[var(--bg-subtle)] border border-[rgba(34,42,53,0.08)] dark:border-white/10 rounded-md text-[12px] font-bold text-[var(--text-midnight)] shadow-sm">
                    {course.credits}cr
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-6">
            <div className="w-12 h-12 mx-auto rounded-xl bg-[var(--bg-subtle)] flex items-center justify-center mb-3">
              <BookOpen size={20} className="text-[var(--text-subtle)]" />
            </div>
            <p className="text-[14px] text-[var(--text-mid)] font-medium">No courses yet</p>
            <p className="text-[12px] text-[var(--text-subtle)] mt-1 max-w-[200px] mx-auto leading-relaxed">
              Use the search bar or filters to find and add courses
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      {selectedCourses.length > 0 && (
        <div className="px-5 py-3 bg-[var(--bg-off)] border-t border-[rgba(34,42,53,0.06)] dark:border-white/10">
          <DownloadPDFBtn onClick={onDownloadClick} />
        </div>
      )}
    </div>
  );
};

export default SelectedCoursesBox;
