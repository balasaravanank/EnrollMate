import React, { useEffect, useRef } from "react";
import "./App.css";
import { Routes, Route, useNavigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LandingPage from "./pages/LandingPage";
import { useCourseStore } from "./store/courseStore";

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
        <Route path="/home" element={<HomePage />} />
        <Route path="/" element={<LandingPage />} />
      </Routes>
    </>
  );
}

export default App;
