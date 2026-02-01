# EnrollMate – Frontend‑Only Refactor Prompt (Copilot / ChatGPT)

Use this prompt to refactor the existing MERN project into a **frontend-only architecture** and integrate directly with a Chrome Extension.

---

## 🎯 Goal

Convert the project into:

Chrome Extension → Extract DOM → JSON → React App → Local Processing

❌ No backend  
❌ No Express  
❌ No MongoDB  
❌ No Mongoose  
❌ No APIs  

Everything must run fully in the frontend.

---

## 📌 Instructions for Copilot

Refactor my existing project by removing all backend and database logic and converting the application into a frontend-only system.

### Current structure includes:
- backend (Express + Mongo + Mongoose)
- controllers
- routes
- models
- axios calls
- docker-compose

### I want:
A static React (Vite) app that directly receives structured JSON from a Chrome extension and processes everything locally.

---

## 🔥 Step-by-Step Requirements

### 1️⃣ Delete completely
Remove these folders/files:

backend/  
docker-compose.yaml  
controllers/  
routers/  
models/  
mongoose usage  
axios API calls  
.env backend configs  
Docker backend files  

---

### 2️⃣ Replace Mongoose model with plain JS schema

Delete:
courseSchedule.model.js

Create:
src/types/courseSchedule.types.js

Use plain JS object structure:

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

No database or validation logic.

---

### 3️⃣ Remove axios/backend communication

Delete:
src/libs/axios.js

Remove all:
- fetch
- axios
- API URLs

All data must come from:
URL query parameter

Example:
http://localhost:5173/?data=<encoded_json>

---

### 4️⃣ Add extension data parser

Create:
src/utils/parseExtensionData.js

Function should:
- read query param
- decodeURIComponent
- JSON.parse
- return course array

---

### 5️⃣ Load courses directly into Zustand store

When app loads:
- parse extension JSON
- store in Zustand
- render timetable

No network requests.

---

### 6️⃣ Final architecture

New structure:

EnrollMate/
├── extension/        (Chrome extension)
├── frontend/         (React only)
└── README.md

---

### 7️⃣ Expected behavior

User clicks extension  
→ extension extracts DOM  
→ converts to JSON  
→ opens React with encoded data  
→ React parses  
→ timetable renders  
→ user downloads PDF  

---

### 8️⃣ Output Requirements

Generate:
- updated folder structure
- list of deleted files
- list of new files
- updated React code
- migration steps
- clean, production-ready code

App must be deployable on:
Vercel (static hosting only)

---

## ✅ Rules

- No backend code
- No Express
- No Mongo
- No axios/fetch
- Only local state
- Clean modular React architecture

---

End of prompt.
