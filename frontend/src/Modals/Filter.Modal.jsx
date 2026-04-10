import React, { useEffect, useState } from "react";
import * as Checkbox from "@radix-ui/react-checkbox";
import { Check, X, SlidersHorizontal, ArrowLeft, HelpCircle, Search } from "lucide-react";
import { useCourseStore } from "../store/courseStore";
import SubjectCard from "../components/SubjectCard";
import CourseCard from "../components/CourseCard";
import { showConflictToast } from "../utils/toasts/conflict.toast";
import { showDuplicateToast } from "../utils/toasts/duplicate.toast";
import { showSameSubjectToast } from "../utils/toasts/sameSubject.toast";
import { showSuccessToast } from "../utils/toasts/success.toast";

const FilterModal = ({ isFilterModalOpen, setIsFilterModalOpen }) => {
  const {
    filterOptions, filteredCourses, filterCourses, setFilterOptions,
    subjectDetails, getSubjectDetails, getCourseByName, courseByName, addSelectedCourses,
  } = useCourseStore();

  const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const TIME_SLOTS = ["8-10", "10-12", "1-3", "3-5"];

  const [selectedDays, setSelectedDays] = useState(filterOptions.days || []);
  const [selectedTimes, setSelectedTimes] = useState(filterOptions.times || []);
  const [notConflict, setNotConflict] = useState(filterOptions.notConflict || false);
  const [notSameSubject, setNotSameSubject] = useState(filterOptions.notSameSubject || false);
  const [showCourses, setShowCourses] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [searchText, setSearchText] = useState("");

  useEffect(() => { getSubjectDetails(filteredCourses); }, [filteredCourses, getSubjectDetails]);
  useEffect(() => { handleApplyFilters(); }, [isFilterModalOpen]);

  const handleDayChange = (day, checked) => {
    setSelectedDays(checked ? [...selectedDays, day] : selectedDays.filter((d) => d !== day));
  };
  const handleTimeChange = (time, checked) => {
    setSelectedTimes(checked ? [...selectedTimes, time] : selectedTimes.filter((t) => t !== time));
  };

  const handleApplyFilters = () => {
    setFilterOptions(selectedDays, selectedTimes, notConflict, notSameSubject);
    filterCourses();
  };

  const handleResetFilters = () => {
    setSelectedDays([]); setSelectedTimes([]); setNotConflict(false); setNotSameSubject(false);
    setFilterOptions([], [], false); filterCourses(); handleBackToSubjects();
  };

  const handleSubjectClick = (courseName) => {
    setSelectedSubject(courseName); getCourseByName(courseName); setShowCourses(true);
  };
  const handleBackToSubjects = () => { setShowCourses(false); setSelectedSubject(null); setSearchText(""); };

  const handleAddCourse = (uniqueId) => {
    const result = addSelectedCourses(uniqueId);
    if (result.isDuplicate) { showDuplicateToast(); return; }
    if (result.isSameSubjects) { showSameSubjectToast(); return; }
    if (result.isConflict) { showConflictToast(() => console.log(result.conflicts)); return; }
    showSuccessToast(); handleBackToSubjects(); handleApplyFilters();
  };

  const filteredSubjectsToRender = subjectDetails.filter(s => 
    s.courseName.toLowerCase().includes(searchText.toLowerCase()) || 
    s.displayName?.toLowerCase().includes(searchText.toLowerCase())
  );
  
  const filteredCoursesToRender = courseByName?.filter(c => 
    c.staff.toLowerCase().includes(searchText.toLowerCase()) || 
    c.uniqueId?.includes(searchText)
  ) || [];

  const CheckboxItem = ({ id, checked, onChange, label }) => (
    <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-[var(--bg-off)] transition-colors group cursor-pointer" onClick={() => onChange(!checked)}>
      <Checkbox.Root
        checked={checked}
        onCheckedChange={onChange}
        className="w-4 h-4 bg-[var(--bg-white)] rounded flex items-center justify-center transition-all shrink-0"
        style={{ boxShadow: "var(--shadow-ring)", backgroundColor: checked ? "var(--color-brand)" : "var(--bg-white)" }}
        id={id}
      >
        <Checkbox.Indicator>
          <Check className="text-white" size={11} strokeWidth={3} />
        </Checkbox.Indicator>
      </Checkbox.Root>
      <label htmlFor={id} className="text-[13px] text-[var(--text-mid)] cursor-pointer flex-1 select-none group-hover:text-[var(--text-charcoal)] transition-colors">
        {label}
      </label>
    </div>
  );

  return (
    <div className="modal-overlay" onClick={() => setIsFilterModalOpen(false)}>
      <div
        className="modal-content w-full max-w-4xl max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 shrink-0 border-b border-[rgba(34,42,53,0.06)] dark:border-white/10">
          <div className="flex items-center gap-2.5">
            <SlidersHorizontal size={18} className="text-[var(--text-mid)]" />
            <h2 className="font-display text-[14px] font-bold text-[var(--text-charcoal)]">Filters</h2>
          </div>
          <button
            onClick={() => setIsFilterModalOpen(false)}
            className="p-1.5 rounded-md hover:bg-[var(--bg-subtle)] transition-colors"
          >
            <X size={16} className="text-[var(--text-subtle)]" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-5">
            {/* Left — Filters */}
            <div className="space-y-5">
              {/* Filter Guide */}
              <div className="bg-[var(--bg-subtle)] border border-[rgba(34,42,53,0.08)] dark:border-white/10 rounded-lg p-3 text-[11.5px] leading-relaxed text-[var(--text-charcoal)] shadow-sm">
                <strong className="flex items-center gap-1.5 text-[var(--text-midnight)] font-bold text-[12px] mb-1.5">
                  <HelpCircle size={13} className="text-[var(--text-midnight)]" />
                  Filter Guide
                </strong>
                Select your free days or times to hide clashing subjects. Use <span className="font-bold text-[var(--text-midnight)]">Non-conflicting</span> to see only courses that fit your current schedule seamlessly.
              </div>

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-[var(--text-subtle)] mb-2.5 px-1">Free Days</p>
                <div className="flex flex-wrap gap-2">
                  {DAYS.map((day) => {
                    const isSelected = selectedDays.includes(day);
                    return (
                      <button
                        key={day}
                        onClick={() => handleDayChange(day, !isSelected)}
                        className={`h-8 px-3 rounded-lg text-[12px] font-medium transition-all ${
                          isSelected
                            ? "bg-[var(--text-midnight)] text-[var(--bg-white)] shadow-md"
                            : "bg-[var(--bg-white)] text-[var(--text-mid)] border border-[var(--bg-subtle)] hover:border-[var(--text-subtle)] hover:text-[var(--text-charcoal)]"
                        }`}
                      >
                        {day.substring(0, 3)}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="h-px bg-[rgba(34,42,53,0.06)] dark:bg-white/10" />

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-[var(--text-subtle)] mb-2.5 px-1">Free Hours</p>
                <div className="flex flex-wrap gap-2">
                  {TIME_SLOTS.map((time) => {
                    const isSelected = selectedTimes.includes(time);
                    return (
                      <button
                        key={time}
                        onClick={() => handleTimeChange(time, !isSelected)}
                        className={`h-8 px-3 rounded-lg text-[12px] font-medium font-mono transition-all ${
                          isSelected
                            ? "bg-[var(--text-midnight)] text-[var(--bg-white)] shadow-md"
                            : "bg-[var(--bg-white)] text-[var(--text-mid)] border border-[var(--bg-subtle)] hover:border-[var(--text-subtle)] hover:text-[var(--text-charcoal)]"
                        }`}
                      >
                        {time}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="h-px bg-[rgba(34,42,53,0.06)] dark:bg-white/10" />

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-[var(--text-subtle)] mb-2 px-1">Options</p>
                <div className="space-y-0.5">
                  <CheckboxItem id="not-conflict" checked={notConflict} onChange={setNotConflict} label="Non-conflicting only" />
                  <CheckboxItem id="not-same-subject" checked={notSameSubject} onChange={setNotSameSubject} label="Non-selected subjects only" />
                </div>
              </div>
            </div>

            {/* Right — Results */}
            <div className="bg-[var(--bg-off)] rounded-xl p-4 flex flex-col min-h-[300px]" style={{ boxShadow: "var(--shadow-ring)" }}>
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  {showCourses && (
                    <button onClick={handleBackToSubjects} className="p-1 rounded hover:bg-[var(--bg-subtle)] transition-colors">
                      <ArrowLeft size={15} className="text-[var(--text-mid)]" />
                    </button>
                  )}
                  <h3 className="text-[13px] font-semibold text-[var(--text-charcoal)]">
                    {showCourses ? selectedSubject : "Results"}
                  </h3>
                  <span className="text-[11px] text-[var(--text-subtle)] font-normal">
                    {showCourses ? `${filteredCoursesToRender.length} sections` : `${filteredSubjectsToRender.length} subjects`}
                  </span>
                </div>
                
                <div className="relative w-full sm:w-48 ml-auto">
                  <input
                    type="text"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    placeholder={showCourses ? "Search prof or ID..." : "Search subjects..."}
                    className="w-full h-8 pl-8 pr-3 text-[12px] bg-[var(--bg-white)] border-none rounded-md outline-none text-[var(--text-charcoal)] placeholder-[var(--text-subtle)] transition-shadow focus:shadow-[0_0_0_2px_var(--color-brand-subtle)]"
                    style={{ boxShadow: "var(--shadow-ring)" }}
                  />
                  <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-subtle)]" />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto pr-1">
                {showCourses ? (
                  filteredCoursesToRender.length > 0 ? (
                    <div className="space-y-2">
                      {filteredCoursesToRender.map((course, i) => <CourseCard key={i} course={course} onAdd={handleAddCourse} />)}
                    </div>
                  ) : (
                    <EmptyResults message="No courses found" sub={searchText ? `No matches for "${searchText}"` : undefined} />
                  )
                ) : filteredSubjectsToRender.length > 0 ? (
                  <div className="space-y-2">
                    {filteredSubjectsToRender.map((s, i) => (
                      <SubjectCard key={i} courseName={s.courseName} displayName={s.displayName} credits={s.credits} totalCourses={s.totalCourses} onClick={() => handleSubjectClick(s.courseName)} />
                    ))}
                  </div>
                ) : (
                  <EmptyResults message="No results" sub={searchText ? `No matches for "${searchText}"` : "Apply filters to see courses"} />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 bg-[var(--bg-off)] border-t border-[rgba(34,42,53,0.06)] dark:border-white/10 shrink-0">
          <button onClick={handleResetFilters} className="text-[12px] font-medium text-[var(--text-subtle)] hover:text-[var(--text-mid)] transition-colors">
            Reset all
          </button>
          <div className="flex gap-2">
            <button onClick={() => setIsFilterModalOpen(false)} className="h-8 px-3 text-[13px] text-[var(--text-mid)] hover:text-[var(--text-charcoal)] hover:bg-[var(--bg-subtle)] rounded-lg transition-all font-medium">
              Close
            </button>
            <button
              onClick={handleApplyFilters}
              className="btn-brand h-8 px-4 text-[13px] font-semibold rounded-lg"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const EmptyResults = ({ message, sub }) => (
  <div className="text-center py-12">
    <SlidersHorizontal className="mx-auto text-[var(--text-subtle)] mb-2" size={28} />
    <p className="text-[14px] text-[var(--text-mid)] font-medium">{message}</p>
    {sub && <p className="text-[12px] text-[var(--text-subtle)] mt-0.5">{sub}</p>}
  </div>
);

export default FilterModal;
