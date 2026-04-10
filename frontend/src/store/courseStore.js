import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import findConflictingCourses from '../utils/findConfictingCourse';
import hasSameSubjects from '../utils/hasSameSubject';
import filterByFreeDaysAndTimes from '../utils/filterByFreeDaysAndTimes';
import filterByNotConflict from '../utils/filterByNotConflict';
import findSubjectDetails from '../utils/findSubjectDetails';
import { parseExtensionData } from '../utils/parseExtensionData';

export const useCourseStore = create(
    persist(
        (set, get) => ({
            // === State ===
            courses: [],
            selectedCourses: [],
            searchedCourses: [],
            subjectDetails: [],
            savedSchedules: [],
            filterOptions: {
                days: [],
                times: [],
                notConflict: false,
                notSameSubject: false
            },
            filteredCourses: [],
            coursesByName: [],


            // Load courses from Chrome extension data
            loadCoursesFromExtension: () => {
                const result = parseExtensionData();
                
                if (result.success && result.courses.length > 0) {
                    set({ courses: result.courses });
                    console.log(`✅ Loaded ${result.valid} courses from extension`);
                    
                    if (result.errors) {
                        console.warn(`⚠️ ${result.errors.length} courses failed validation`);
                    }
                    
                    return {
                        success: true,
                        loaded: result.valid,
                        failed: result.errors?.length || 0
                    };
                } else {
                    console.warn('❌ No valid courses found in extension data');
                    return {
                        success: false,
                        error: result.error || 'No courses found'
                    };
                }
            },

            // Set courses directly (for manual data loading)
            setCourses: (courses) => {
                if (Array.isArray(courses)) {
                    set({ courses });
                }
            },

            // Search by courseName, staff, or uniqueId
            searchCourses: (query) => {
                const q = query.toLowerCase();
                const { courses } = get();

                const results = courses.filter(course =>
                    course.courseName.toLowerCase().includes(q) ||
                    course.staff.toLowerCase().includes(q) ||
                    course.uniqueId.toLowerCase().includes(q)
                );

                set({ searchedCourses: results });
            },

            // Clear search results
            removeSearchedCourses: () => set({ searchedCourses: [] }),

            // Add a course to selectedCourses (prevent duplicates)
            addSelectedCourses: (uniqueId) => {
                const { courses, selectedCourses } = get();
                const course = courses.find(c => c.uniqueId === uniqueId);
                if (!course) return { isError: true, message: "Course not found" };

                // prevent duplicates
                const alreadySelected = selectedCourses.some(c => c.uniqueId === uniqueId);
                if (alreadySelected) return { isDuplicate: true }

                // prevent same subjects

                const isSameSubjects = hasSameSubjects(course, selectedCourses);
                if (isSameSubjects) return { isSameSubjects: true }

                // find all conflicts
                const conflicts = findConflictingCourses(course, selectedCourses);

                if (conflicts.length > 0) {
                    const message = conflicts.map(c => c.message).join('\n');

                    return {
                        isConflict: true,
                        conflicts: conflicts,
                        message: `Cannot add "${course.courseName} due to conflicts:\n\n${message} "`
                    }
                }

                set({ selectedCourses: [...selectedCourses, course] });
                return { isConflict: false, isDuplicate: false, isSameSubjects: false };
            },

            removeSelectedCourse: (uniqueId) => {
                const { selectedCourses } = get();
                const filtered = selectedCourses.filter(c => c.uniqueId !== uniqueId);
                set({ selectedCourses: filtered });
            },

            clearSelectedCourses: () => {
                set({ selectedCourses: [] });
            },

            // Get Subject details

            getSubjectDetails: (courses) => {

                const subjectDetails = findSubjectDetails(courses);
                set({ subjectDetails: subjectDetails });
            },

            // Filtering Courses

            filterCourses: () => {
                const { courses, selectedCourses, filterOptions } = get();
                const { days, times, notConflict, notSameSubject } = filterOptions;

                let filteredCourses = filterByFreeDaysAndTimes(days, courses, times);

                // Apply conflict filter if enabled
                if (notConflict) {
                    filteredCourses = filteredCourses.filter((course) =>
                        findConflictingCourses(course, selectedCourses).length === 0
                    );
                }

                if(notSameSubject){
                    filteredCourses = filteredCourses.filter((course) =>
                        !hasSameSubjects(course, selectedCourses)
                    );
                }

                set({ filteredCourses: filteredCourses });

            },

            // Set filter options
            setFilterOptions: (days, times, notConflict,notSameSubject) => {
                set({ filterOptions: { days, times, notConflict, notSameSubject } });
            },

            getCourseByName: (courseName) => {
                const { filteredCourses } = get();
                const courseByName = filteredCourses.filter(course => course.courseName === courseName);
                console.log("Course by Name  ", courseByName);

                set({ courseByName: courseByName });

            },

            // === Saved Schedules ===
            saveCurrentSchedule: (name) => {
                const { selectedCourses, savedSchedules } = get();
                if (selectedCourses.length === 0) return { success: false, message: "No courses to save" };
                
                const newSchedule = {
                    id: Date.now().toString(),
                    name: name || `Schedule ${savedSchedules.length + 1}`,
                    courses: [...selectedCourses],
                    createdAt: new Date().toISOString()
                };
                
                set({ savedSchedules: [...savedSchedules || [], newSchedule] });
                return { success: true, message: "Schedule saved successfully" };
            },
            
            loadSchedule: (id) => {
                const { savedSchedules } = get();
                const schedule = (savedSchedules || []).find(s => s.id === id);
                if (schedule) {
                    set({ selectedCourses: [...schedule.courses] });
                    return { success: true };
                }
                return { success: false, message: "Schedule not found" };
            },
            
            deleteSchedule: (id) => {
                const { savedSchedules } = get();
                set({ savedSchedules: (savedSchedules || []).filter(s => s.id !== id) });
            }

        }),

        {
            name: "course-storage", // localStorage key
            partialize: (state) => ({
                courses: state.courses,
                selectedCourses: state.selectedCourses,
                savedSchedules: state.savedSchedules || [],
            }),
        }
    )
);
