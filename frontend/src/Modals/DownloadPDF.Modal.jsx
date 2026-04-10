import React, { useState } from "react";
import { X, Download, Loader2 } from "lucide-react";
import { downloadTimetablePDF } from "../libs/downloadPDF";
import { useCourseStore } from "../store/courseStore";
import toast from "react-hot-toast";

const DownloadPDFModal = ({ closeModal }) => {
  const { selectedCourses } = useCourseStore();
  const [filename, setFilename] = useState("my-timetable");
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!filename.trim()) { toast.error("Enter a filename"); return; }
    if (!selectedCourses.length) { toast.error("No courses selected"); return; }
    setIsDownloading(true);
    try {
      const result = await downloadTimetablePDF(selectedCourses, filename);
      if (result.success) { toast.success("Downloaded!"); closeModal(); }
      else toast.error(`Failed: ${result.error}`);
    } catch { toast.error("Download failed"); }
    finally { setIsDownloading(false); }
  };

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-content max-w-sm w-full p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: "var(--color-brand)" }}>
              <Download size={15} className="text-white" />
            </div>
            <h2 className="font-display text-[14px] font-bold text-[var(--text-charcoal)]">Download</h2>
          </div>
          <button onClick={closeModal} className="p-1.5 rounded-md hover:bg-[var(--bg-subtle)] transition-colors" disabled={isDownloading}>
            <X size={16} className="text-[var(--text-subtle)]" />
          </button>
        </div>

        {/* Input */}
        <div>
          <label htmlFor="fn" className="block text-[12px] font-medium text-[var(--text-mid)] mb-1.5">File name</label>
          <input
            id="fn" type="text" value={filename}
            onChange={(e) => setFilename(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !isDownloading) handleDownload(); if (e.key === "Escape") closeModal(); }}
            className="w-full h-9 bg-[var(--bg-white)] rounded-lg px-3 text-[13px] text-[var(--text-charcoal)] placeholder-[var(--text-subtle)] focus:outline-none transition-all"
            style={{ boxShadow: "var(--shadow-ring), var(--shadow-inset)" }}
            onFocus={(e) => e.target.style.boxShadow = "var(--shadow-ring), 0px 0px 0px 3px rgba(36,36,36,0.08)"}
            onBlur={(e) => e.target.style.boxShadow = "var(--shadow-ring), var(--shadow-inset)"}
            disabled={isDownloading} autoFocus
          />
          <p className="text-[11px] text-[var(--text-subtle)] mt-1">Saves as <span className="font-mono">{filename || "..."}.pdf</span></p>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <button
            onClick={closeModal}
            className="flex-1 h-9 bg-[var(--bg-white)] text-[13px] font-medium text-[var(--text-mid)] rounded-lg hover:text-[var(--text-charcoal)] transition-all"
            style={{ boxShadow: "var(--shadow-card)" }}
            disabled={isDownloading}
          >
            Cancel
          </button>
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="btn-brand flex-1 h-9 disabled:opacity-30 text-[13px] font-semibold rounded-lg flex items-center justify-center gap-1.5"
          >
            {isDownloading ? <><Loader2 size={14} className="animate-spin" /> Saving...</> : <><Download size={14} /> Download</>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DownloadPDFModal;
