import React from "react";
import { Download } from "lucide-react";

const DownloadPDFBtn = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="btn-brand w-full h-9 text-[13px] font-semibold rounded-lg flex items-center justify-center gap-2"
      aria-label="Download Timetable"
    >
      <Download size={14} />
      Download Timetable
    </button>
  );
};

export default DownloadPDFBtn;
