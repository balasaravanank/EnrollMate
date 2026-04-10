import React, { useState } from 'react';
import { useCourseStore } from '../store/courseStore';
import { Save, FolderOpen, Trash2, X, RefreshCw, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

const SaveLoadSchedule = () => {
    const { saveCurrentSchedule, savedSchedules, loadSchedule, deleteSchedule, selectedCourses, clearSelectedCourses } = useCourseStore();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
    const [isResetModalOpen, setIsResetModalOpen] = useState(false);
    const [scheduleName, setScheduleName] = useState('');

    const handleSave = () => {
        if (!scheduleName.trim()) {
            toast.error("Please enter a name");
            return;
        }
        const res = saveCurrentSchedule(scheduleName.trim());
        if (res.success) {
            toast.success(res.message);
            setIsSaveModalOpen(false);
            setScheduleName('');
        } else {
            toast.error(res.message);
        }
    };

    const handleLoad = (id) => {
        const res = loadSchedule(id);
        if (res.success) {
            toast.success("Schedule loaded");
            setIsMenuOpen(false);
        } else {
            toast.error(res.message || "Failed to load schedule");
        }
    };

    const handleReset = () => {
        setIsResetModalOpen(true);
    };

    const confirmReset = () => {
        clearSelectedCourses();
        toast.success("Schedule cleared");
        setIsResetModalOpen(false);
    };

    return (
        <div className="relative flex items-center gap-2">
            <button
                onClick={() => setIsSaveModalOpen(true)}
                disabled={selectedCourses.length === 0}
                className="flex items-center gap-2 px-3 py-2 text-[13px] font-bold text-[var(--text-charcoal)] bg-[var(--bg-white)] border border-[rgba(34,42,53,0.1)] dark:border-white/10 rounded-lg hover:border-[var(--brand-main)] hover:text-[var(--brand-main)] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                title="Save Schedule"
            >
                <Save size={16} />
                <span className="hidden sm:inline">Save</span>
            </button>

            <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-2 px-3 py-2 text-[13px] font-bold text-[var(--text-charcoal)] bg-[var(--bg-white)] border border-[rgba(34,42,53,0.1)] dark:border-white/10 rounded-lg hover:border-[var(--brand-main)] hover:text-[var(--brand-main)] transition-all shadow-sm relative"
                title="Load Schedule"
            >
                <FolderOpen size={16} />
                <span className="hidden sm:inline">Load</span>
                {savedSchedules?.length > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[var(--brand-main)] text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                        {savedSchedules.length}
                    </span>
                )}
            </button>

            <button
                onClick={handleReset}
                disabled={selectedCourses.length === 0}
                className="flex items-center gap-2 px-3 py-2 text-[13px] font-bold text-[#ef4444] bg-[var(--bg-white)] border border-[rgba(34,42,53,0.1)] dark:border-white/10 rounded-lg hover:border-[#ef4444] hover:bg-red-500/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                title="Reset Schedule"
            >
                <RefreshCw size={16} />
                <span className="hidden sm:inline">Reset</span>
            </button>

            {/* Load Menu */}
            {isMenuOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsMenuOpen(false)}></div>
                    <div className="absolute left-0 sm:left-auto sm:right-0 top-full mt-2 w-[280px] sm:w-64 bg-[var(--bg-white)] rounded-xl shadow-xl border border-[rgba(34,42,53,0.1)] dark:border-white/10 z-50 flex flex-col max-h-[300px]">
                        <div className="px-4 py-3 border-b border-[rgba(34,42,53,0.06)] dark:border-white/5 bg-[var(--bg-off)] font-bold text-[13px] text-[var(--text-charcoal)] rounded-t-xl">
                            Saved Schedules
                        </div>
                        <div className="overflow-y-auto flex-1 p-2">
                            {savedSchedules?.length > 0 ? (
                                savedSchedules.map((schedule) => (
                                    <div key={schedule.id} className="flex items-center justify-between p-2 hover:bg-[var(--bg-off)] rounded-lg group">
                                        <button 
                                            onClick={() => handleLoad(schedule.id)}
                                            className="flex-1 text-left"
                                        >
                                            <div className="text-[13px] font-bold text-[var(--text-midnight)] mb-0.5 truncate">{schedule.name}</div>
                                            <div className="text-[11px] text-[var(--text-subtle)]">{schedule.courses.length} courses</div>
                                        </button>
                                        <button 
                                            onClick={() => deleteSchedule(schedule.id)}
                                            className="p-1.5 text-[var(--text-subtle)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                                            title="Delete saved schedule"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div className="p-4 text-center text-[12px] text-[var(--text-subtle)] flex flex-col items-center gap-2">
                                    <FolderOpen size={24} className="opacity-20" />
                                    <span>No saved schedules</span>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}

            {/* Save Modal */}
            {isSaveModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="w-full max-w-sm bg-[var(--bg-white)] rounded-2xl shadow-2xl overflow-hidden border border-white/10">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-[rgba(34,42,53,0.06)] dark:border-white/10">
                            <h3 className="font-bold text-[16px] text-[var(--text-charcoal)]">Save Schedule</h3>
                            <button 
                                onClick={() => setIsSaveModalOpen(false)}
                                className="p-1 text-[var(--text-subtle)] hover:bg-[var(--bg-off)] rounded-md transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>
                        <div className="p-5">
                            <label className="block text-[13px] font-bold text-[var(--text-midnight)] mb-2">Schedule Name</label>
                            <input
                                type="text"
                                autoFocus
                                value={scheduleName}
                                onChange={(e) => setScheduleName(e.target.value)}
                                placeholder="e.g. Fall 2026 Primary"
                                className="w-full bg-[var(--bg-off)] border border-[rgba(34,42,53,0.1)] dark:border-white/10 rounded-xl px-4 py-2.5 text-[14px] text-[var(--text-midnight)] outline-none focus:border-[var(--brand-main)] focus:ring-1 focus:ring-[var(--brand-main)] transition-all"
                                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                            />
                            <div className="flex items-center justify-end gap-3 mt-5">
                                <button 
                                    onClick={() => setIsSaveModalOpen(false)}
                                    className="px-4 py-2 text-[13px] font-bold text-[var(--text-mid)] hover:bg-[var(--bg-off)] rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleSave}
                                    className="px-4 py-2 text-[13px] font-bold text-white bg-[var(--brand-main)] hover:bg-opacity-90 rounded-lg transition-all"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Reset Confirmation Modal */}
            {isResetModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[rgba(15,23,42,0.6)] backdrop-blur-sm p-4 animate-fade-in">
                    <div className="w-full max-w-md bg-[var(--bg-white)] rounded-2xl shadow-2xl overflow-hidden border border-[rgba(34,42,53,0.1)] dark:border-white/10 animate-scale-up">
                        <div className="p-6 sm:p-8">
                            <div className="w-14 h-14 bg-red-50 dark:bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-5">
                                <AlertTriangle className="w-7 h-7 text-red-500" strokeWidth={2} />
                            </div>
                            <h3 className="text-[18px] sm:text-[20px] font-bold text-center text-[var(--text-charcoal)] mb-2 group-hover:text-red-500 transition-colors">
                                Clear Schedule?
                            </h3>
                            <p className="text-[14px] text-center text-[var(--text-mid)] max-w-[280px] mx-auto leading-relaxed">
                                This will remove all currently selected courses. This action cannot be undone unless you have saved it previously.
                            </p>
                            <div className="flex items-center gap-3 mt-8">
                                <button 
                                    onClick={() => setIsResetModalOpen(false)}
                                    className="flex-1 py-3 px-4 text-[14px] font-bold text-[var(--text-charcoal)] bg-[var(--bg-off)] hover:bg-[rgba(34,42,53,0.06)] dark:hover:bg-white/5 rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={confirmReset}
                                    className="flex-1 py-3 px-4 text-[14px] font-bold text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors shadow-sm shadow-red-500/20"
                                >
                                    Yes, clear it
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SaveLoadSchedule;