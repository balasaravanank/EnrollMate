import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Routes, Route, useNavigate } from "react-router";
import HomePage from "./pages/HomePage";
import LandingPage from "./pages/LandingPage";
import { useCourseStore } from "./store/courseStore";

function App() {
  const setCourses = useCourseStore(state => state.setCourses);
  const navigate = useNavigate();

  useEffect(() => {
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
