import React from "react";
import { X, AlertTriangle, User, Hash } from "lucide-react";

const ShowConflictsModal = ({ closeConflictModal, conflictData }) => {
  return (
    <div className="modal-overlay" onClick={closeConflictModal}>
      <div
        className="modal-content w-full max-w-md max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(34,42,53,0.06)] dark:border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
              <AlertTriangle size={16} className="text-red-500" />
            </div>
            <h2 className="font-display text-[14px] font-bold text-[var(--text-charcoal)]">Schedule Conflict</h2>
          </div>
          <button onClick={closeConflictModal} className="p-1.5 rounded-md hover:bg-[var(--bg-subtle)] transition-colors">
            <X size={16} className="text-[var(--text-subtle)]" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          <p className="text-[14px] text-[var(--text-mid)] mb-4 leading-relaxed">
            {conflictData?.message?.split("due to conflicts:")[0]}
            <span className="text-red-500 font-medium">due to conflicts:</span>
          </p>

          <div className="space-y-2.5">
            {conflictData?.conflicts?.map((conflict, index) => {
              const match = conflict.message?.match(/on (\w+) at ([\d-]+)/);
              const day = match?.[1] || "—";
              const time = match?.[2] || "—";
              return (
                <div key={index} className="bg-red-500/5 border border-red-500/10 rounded-xl p-4" style={{ boxShadow: "var(--shadow-ring)" }}>
                  <h4 className="text-[13px] font-semibold text-[var(--text-charcoal)] mb-1">
                    {conflict.confictingCourse?.courseName}
                  </h4>
                  <div className="flex items-center gap-3 text-[11px] text-[var(--text-mid)] mb-2">
                    <span className="flex items-center gap-1"><User size={10} />{conflict.confictingCourse?.staff}</span>
                    <span className="flex items-center gap-1 font-mono text-[var(--text-subtle)]"><Hash size={10} />{conflict.confictingCourse?.uniqueId}</span>
                  </div>
                  <div className="text-[12px] text-red-500 font-medium bg-red-500/10 px-2.5 py-1 rounded-md inline-block border border-red-500/20">
                    {day} at {time}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-[var(--bg-off)] border-t border-[rgba(34,42,53,0.06)] dark:border-white/10">
          <button
            onClick={closeConflictModal}
            className="btn-brand w-full h-9 text-[13px] font-semibold rounded-lg"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShowConflictsModal;
