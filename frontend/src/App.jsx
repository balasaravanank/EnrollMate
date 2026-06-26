import React, { useEffect, useRef } from "react";
import "./App.css";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LandingPage from "./pages/LandingPage";
import { useCourseStore } from "./store/courseStore";
import { Analytics } from "@vercel/analytics/react";

// Blocks access to the app until course data has been pasted.
// Direct visits to /home without data are redirected to the landing page.
function RequireCourseData({ children }) {
  const courses = useCourseStore((state) => state.courses);
  if (!courses || courses.length === 0) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function App() {
  const setCourses = useCourseStore(state => state.setCourses);
  const navigate = useNavigate();

  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    // Check localStorage for extension data
    const storedData = localStorage.getItem('enrollmate_courses');
    const timestamp = localStorage.getItem('enrollmate_timestamp');
    
    if (storedData) {
      try {
        console.log('🔍 Found extension data in localStorage');
        const coursesData = JSON.parse(storedData);
        
        if (Array.isArray(coursesData) && coursesData.length > 0) {
          console.log(`✅ Loading ${coursesData.length} courses from localStorage`);
          console.log(`📅 Data timestamp: ${timestamp}`);
          
          // Load courses into store
          setCourses(coursesData);
          
          // Navigate to home page
          navigate('/home', { replace: true });
        }
      } catch (error) {
        console.error('❌ Error parsing localStorage data:', error);
      }
    } else {
      console.log('ℹ️ No extension data found. Click the extension icon on the enrollment page.');
    }
  }, [setCourses, navigate]);

  return (
    <>
      <Routes>
        <Route
          path="/home"
          element={
            <RequireCourseData>
              <HomePage />
            </RequireCourseData>
          }
        />
        <Route path="/" element={<LandingPage />} />
      </Routes>
      <Analytics />
    </>
  );
}

export default App;
