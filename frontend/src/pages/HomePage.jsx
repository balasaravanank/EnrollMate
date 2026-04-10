import React, { useState } from "react";
import Header from "../components/Header";
import TimeTable from "../components/TimeTable";
import SelectedCoursesBox from "../components/SelectedCoursesBox";
import ShowConflictsModal from "../Modals/ShowConflicts.Modal";
import FilterModal from "../Modals/Filter.Modal";
import DownloadPDFModal from "../Modals/DownloadPDF.Modal";
import { useCourseStore } from "../store/courseStore";
import { Toaster } from "react-hot-toast";
import Footer from "../components/Footer";

const HomePage = () => {
  const [isConflictModalOpen, setIsConflictModalOpen] = useState(false);
  const [conflictData, setConflictData] = useState(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

  const openConflictModal = (conflicts) => {
    setConflictData(conflicts);
    setIsConflictModalOpen(true);
  };

  const closeConflictModal = () => {
    setIsConflictModalOpen(false);
    setConflictData(null);
  };

  const openDownloadModal = () => {
    setIsDownloadModalOpen(true);
  };

  const closeDownloadModal = () => {
    setIsDownloadModalOpen(false);
  };

  return (
    <>
      <main className="min-h-screen bg-[var(--bg-off)] transition-colors duration-200">
        <Header
          openConflictModal={openConflictModal}
          isFilterModalOpen={isFilterModalOpen}
          setIsFilterModalOpen={setIsFilterModalOpen}
        />

        <Toaster
          toastOptions={{
            duration: 3000,
            style: {
              marginTop: "56px",
              background: "var(--bg-white)",
              color: "var(--text-charcoal)",
              borderRadius: "10px",
              boxShadow: "var(--shadow-card)",
              fontSize: "13px",
              fontWeight: "500",
              padding: "10px 14px",
              border: "none",
            },
            success: {
              iconTheme: { primary: "#16a34a", secondary: "#fff" },
            },
            error: {
              iconTheme: { primary: "#dc2626", secondary: "#fff" },
            },
          }}
          position="top-center"
        />

        {/* Main Content */}
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-5 lg:py-6">
          <section className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-5 min-h-[calc(100vh-130px)]">
            {/* Timetable */}
            <div
              className="bg-[var(--bg-white)] rounded-xl overflow-hidden animate-fade-in transition-colors duration-200"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <TimeTable />
            </div>

            {/* Sidebar */}
            <div className="h-fit sticky top-20 animate-fade-in" style={{ animationDelay: '0.08s' }}>
              <SelectedCoursesBox onDownloadClick={openDownloadModal} />
            </div>
          </section>
        </div>

        {isConflictModalOpen && (
          <ShowConflictsModal
            closeConflictModal={closeConflictModal}
            conflictData={conflictData}
          />
        )}

        {isFilterModalOpen && (
          <FilterModal
            isFilterModalOpen={isFilterModalOpen}
            setIsFilterModalOpen={setIsFilterModalOpen}
          />
        )}

        {isDownloadModalOpen && (
          <DownloadPDFModal closeModal={closeDownloadModal} />
        )}

        <Footer />
      </main>
    </>
  );
};

export default HomePage;
