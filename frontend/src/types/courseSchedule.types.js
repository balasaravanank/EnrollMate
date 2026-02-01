export const CourseShape = {
  uniqueId: "",
  courseName: "",
  displayName: "",
  staff: "",
  credits: 0,
  slots: [
    {
      day: "",
      time: ""
    }
  ]
};

export const createCourse = (data = {}) => {
  return {
    uniqueId: data.uniqueId || "",
    courseName: data.courseName || "",
    displayName: data.displayName || "",
    staff: data.staff || "",
    credits: Number(data.credits) || 0,
    slots: Array.isArray(data.slots) ? data.slots.map(slot => ({
      day: slot.day || "",
      time: slot.time || ""
    })) : []
  };
};

export const validateCourse = (course) => {
  if (!course.uniqueId || typeof course.uniqueId !== 'string') {
    return { valid: false, error: 'uniqueId is required and must be a string' };
  }
  
  if (!course.courseName || typeof course.courseName !== 'string') {
    return { valid: false, error: 'courseName is required and must be a string' };
  }
  
  if (!course.displayName || typeof course.displayName !== 'string') {
    return { valid: false, error: 'displayName is required and must be a string' };
  }
  
  if (!course.staff || typeof course.staff !== 'string') {
    return { valid: false, error: 'staff is required and must be a string' };
  }
  
  if (typeof course.credits !== 'number' || course.credits < 0) {
    return { valid: false, error: 'credits must be a non-negative number' };
  }
  
  if (!Array.isArray(course.slots) || course.slots.length === 0) {
    return { valid: false, error: 'slots must be a non-empty array' };
  }
  
  const validDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const validTimes = ["8-9", "9-10", "10-11", "11-12", "1-2", "2-3", "3-4", "4-5", "8-10", "10-12", "1-3", "3-5"];
  
  for (const slot of course.slots) {
    if (!validDays.includes(slot.day)) {
      return { valid: false, error: `Invalid day: ${slot.day}. Must be one of ${validDays.join(', ')}` };
    }
    
    if (!validTimes.includes(slot.time)) {
      return { valid: false, error: `Invalid time: ${slot.time}. Must be one of ${validTimes.join(', ')}` };
    }
  }
  
  return { valid: true };
};
