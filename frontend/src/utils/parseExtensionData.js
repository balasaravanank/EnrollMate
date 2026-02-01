import { createCourse, validateCourse } from '../types/courseSchedule.types';

export const parseExtensionData = () => {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const encodedData = urlParams.get('data');
    
    if (!encodedData) {
      console.warn('No data parameter found in URL');
      return { success: false, courses: [], error: 'No data parameter in URL' };
    }
    
    const decodedData = decodeURIComponent(encodedData);
    const parsedData = JSON.parse(decodedData);
    
    if (!Array.isArray(parsedData)) {
      console.error('Data is not an array:', parsedData);
      return { success: false, courses: [], error: 'Data must be an array of courses' };
    }
    
    const courses = [];
    const errors = [];
    
    for (let i = 0; i < parsedData.length; i++) {
      const courseData = parsedData[i];
      const course = createCourse(courseData);
      const validation = validateCourse(course);
      
      if (validation.valid) {
        courses.push(course);
      } else {
        errors.push({
          index: i,
          data: courseData,
          error: validation.error
        });
        console.warn(`Course at index ${i} failed validation:`, validation.error);
      }
    }
    
    if (errors.length > 0) {
      console.warn(`${errors.length} courses failed validation:`, errors);
    }
    
    return {
      success: true,
      courses,
      errors: errors.length > 0 ? errors : null,
      total: parsedData.length,
      valid: courses.length
    };
    
  } catch (error) {
    console.error('Error parsing extension data:', error);
    return {
      success: false,
      courses: [],
      error: error.message
    };
  }
};

export const hasExtensionData = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.has('data');
};

export const clearExtensionDataFromURL = () => {
  if (window.history && window.history.replaceState) {
    const url = new URL(window.location);
    url.searchParams.delete('data');
    window.history.replaceState({}, document.title, url.toString());
  }
};
