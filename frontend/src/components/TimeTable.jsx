import React from "react";
import { useCourseStore } from "../store/courseStore";
import { doSlotsOverlap, getSlotDuration } from "../utils/timeSlots";

const TimeTable = () => {
  const { selectedCourses } = useCourseStore();
  const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const TIME_SLOTS = ["8-10", "10-12", "1-3", "3-5"];
  const DAY_SHORT = { Monday: "Mon", Tuesday: "Tue", Wednesday: "Wed", Thursday: "Thu", Friday: "Fri", Saturday: "Sat" };

  const courseColors = [
    "var(--color-brand)", "#0099ff", "#16a34a", "#d97706",
    "#dc2626", "#0891b2", "#7c3aed", "#0d9488",
    "#be185d", "#ea580c",
  ];

  const getCourseColor = (uniqueId) => {
    if (!uniqueId) return courseColors[0];
    const sorted = selectedCourses.map((c) => c.uniqueId).sort();
    const idx = sorted.indexOf(uniqueId);
    return idx !== -1 ? courseColors[idx % courseColors.length] : courseColors[0];
  };

  const getCoursesForBlock = (day, blockSlot) => {
    if (!selectedCourses?.length) return { left: null, right: null, full: null };
    const result = { left: null, right: null, full: null };
    const [blockStart, blockEnd] = blockSlot.split('-').map(s => parseInt(s, 10));
    const leftSlot = `${blockStart}-${blockStart + 1}`;
    const rightSlot = `${blockStart + 1}-${blockEnd}`;

    selectedCourses.forEach((course) => {
      if (!course.slots?.length) return;
      course.slots.forEach((slot) => {
        if (slot.day !== day) return;
        const duration = getSlotDuration(slot.time);
        if (doSlotsOverlap(slot.time, blockSlot)) {
          if (duration === 2 && slot.time === blockSlot) result.full = course;
          else if (duration === 1) {
            if (slot.time === leftSlot || doSlotsOverlap(slot.time, leftSlot)) result.left = course;
            else if (slot.time === rightSlot || doSlotsOverlap(slot.time, rightSlot)) result.right = course;
          }
        }
      });
    });
    return result;
  };

  const CourseBlock = ({ course, compact = false }) => {
    const bg = getCourseColor(course.uniqueId);
    return (
      <div
        className={`${compact ? 'px-1 py-0.5' : 'px-2 py-1.5'} rounded-lg w-full h-full text-center flex flex-col items-center justify-center cursor-default transition-all duration-150`}
        style={{ backgroundColor: bg }}
        title={`${course.courseName} — ${course.staff} (${course.uniqueId})`}
      >
        <div className={`font-semibold text-white ${compact ? 'text-[8px] sm:text-[10px]' : 'text-[10px] sm:text-[12px]'} truncate w-full leading-snug`}>
          {course.displayName?.toUpperCase() || course.courseName}
        </div>
        <div className={`text-white/70 ${compact ? 'text-[7px] sm:text-[8px]' : 'text-[8px] sm:text-[10px]'} truncate w-full mt-px`}>
          {course.staff}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full bg-[var(--bg-white)] p-4 sm:p-6 lg:p-8 transition-colors duration-200">
      {/* Header */}
      <div className="flex items-baseline justify-between mb-5 sm:mb-6">
        <div>
          <h2 className="font-display text-[18px] sm:text-[20px] font-bold text-[var(--text-charcoal)] tracking-tight">
            Schedule
          </h2>
          <p className="text-[12px] text-[var(--text-subtle)] mt-0.5">
            {selectedCourses.length > 0
              ? `${selectedCourses.length} course${selectedCourses.length > 1 ? 's' : ''} on your timetable`
              : 'Search and add courses to see them here'}
          </p>
        </div>
        {selectedCourses.length > 0 && (
          <div className="flex gap-1.5">
            {selectedCourses.map((c) => (
              <div
                key={c.uniqueId}
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: getCourseColor(c.uniqueId) }}
                title={c.displayName?.toUpperCase() || c.courseName}
              />
            ))}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto">
        <table className="w-full border-separate border-spacing-0 text-sm" style={{ minWidth: "100%" }}>
          <thead>
            <tr>
              <th className="w-[13%] px-3 py-2.5 text-left text-[11px] font-semibold text-[var(--text-mid)] uppercase tracking-wider bg-[var(--bg-off)] rounded-tl-lg border-b border-r border-[rgba(34,42,53,0.08)] dark:border-white/10"
              >
                Day
              </th>
              {TIME_SLOTS.map((slot, i) => (
                <th
                  key={slot}
                  className={`px-3 py-2.5 text-center text-[11px] font-semibold text-[var(--text-mid)] uppercase tracking-wider bg-[var(--bg-off)] border-b border-[rgba(34,42,53,0.08)] dark:border-white/10 ${i === TIME_SLOTS.length - 1 ? 'rounded-tr-lg' : 'border-r'} ${i < TIME_SLOTS.length - 1 ? 'border-[rgba(34,42,53,0.06)] dark:border-white/10' : ''}`}
                  style={{
                    width: `${87 / TIME_SLOTS.length}%`,
                  }}
                >
                  {slot}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DAYS.map((day, dayIdx) => (
              <tr key={day} className="group/row">
                <td
                  className={`px-3 py-1 text-[13px] font-medium text-[var(--text-mid)] group-hover/row:bg-[var(--bg-off)] transition-colors border-r border-[rgba(34,42,53,0.06)] dark:border-white/10 ${dayIdx === DAYS.length - 1 ? 'rounded-bl-lg' : 'border-b border-[rgba(34,42,53,0.04)] dark:border-white/5'}`}
                >
                  <span className="sm:hidden">{DAY_SHORT[day]}</span>
                  <span className="hidden sm:inline">{day}</span>
                </td>
                {TIME_SLOTS.map((slot, slotIdx) => {
                  const { left, right, full } = getCoursesForBlock(day, slot);
                  const isLast = slotIdx === TIME_SLOTS.length - 1;
                  const isLastRow = dayIdx === DAYS.length - 1;
                  return (
                    <td
                      key={`${day}-${slot}`}
                      className={`px-1 py-1 group-hover/row:bg-[var(--bg-off)] transition-colors ${isLastRow && isLast ? 'rounded-br-lg' : ''} ${!isLastRow ? 'border-b border-[rgba(34,42,53,0.04)] dark:border-white/5' : ''} ${!isLast ? 'border-r border-[rgba(34,42,53,0.06)] dark:border-white/10' : ''}`}
                    >
                      <div className="min-h-[52px] sm:min-h-[60px] flex items-center justify-center">
                        {full ? (
                          <CourseBlock course={full} />
                        ) : (left || right) ? (
                          <div className="flex w-full h-full gap-0.5">
                            <div className="flex-1 flex items-center justify-center">
                              {left ? <CourseBlock course={left} compact /> : <span className="text-[var(--text-subtle)] opacity-40 text-xs">—</span>}
                            </div>
                            <div className="flex-1 flex items-center justify-center">
                              {right ? <CourseBlock course={right} compact /> : <span className="text-[var(--text-subtle)] opacity-40 text-xs">—</span>}
                            </div>
                          </div>
                        ) : (
                          <span className="text-[var(--text-subtle)] opacity-40 text-xs select-none">—</span>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TimeTable;
