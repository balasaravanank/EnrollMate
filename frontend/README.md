# EnrollMate - Frontend Only

> 🎓 **Intelligent Course Timetable Builder**  
> A frontend-only React application that works seamlessly with a Chrome Extension to help students create optimal course schedules.

---

## 🏗️ Architecture

```
Chrome Extension → Extract DOM → JSON → React App → Local Processing
```

**No Backend** | **No Database** | **No API Calls**

---

## ✨ Features

- 🔌 **Extension Integration**: Automatically receives course data from Chrome Extension via URL query params
- 📊 **Smart Timetable**: Visual grid with 1-hour and 2-hour slot support, split-cell rendering
- ⚠️ **Conflict Detection**: Real-time detection of schedule conflicts
- 🎯 **Advanced Filtering**: Filter by free days, times, conflicts, and duplicate subjects
- 📥 **PDF Export**: Download beautifully formatted HTML timetable
- 💾 **Persistent Storage**: Local state management with Zustand + localStorage
- 🎨 **Modern UI**: Dark theme with Tailwind CSS and responsive design

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- Chrome Extension installed (see `EnrollMate-Extension` folder)

### Installation

```bash
cd frontend
npm install
npm run dev
```

App runs at: `http://localhost:5173`

---

## 📖 Usage Flow

1. **Navigate** to your university's enrollment website
2. **Click** the EnrollMate Chrome Extension icon
3. **Extension extracts** course data and opens React app with encoded JSON
4. **React app** automatically:
   - Parses the URL query parameter
   - Validates and loads courses
   - Redirects to `/home`
   - Displays interactive timetable
5. **Select courses**, check conflicts, and download your timetable!

---

## 🗂️ Project Structure

```
frontend/
├── src/
│   ├── components/          # UI components (TimeTable, CourseCard, etc.)
│   ├── pages/              # Landing page and Home page
│   ├── store/              # Zustand state management
│   ├── utils/              # Helper functions and utilities
│   │   ├── parseExtensionData.js    # Parse URL query params
│   │   ├── timeSlots.js            # Time overlap detection
│   │   ├── hasConflict.js          # Conflict checking
│   │   └── toasts/                 # Toast notifications
│   ├── types/              # Course data schemas
│   ├── Modals/             # Modal dialogs (Filter, Download, Conflicts)
│   └── libs/               # Library utilities (downloadPDF)
├── public/                 # Static assets
└── package.json
```

---

## 🔧 Key Technologies

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Zustand** - State management with persistence
- **Tailwind CSS** - Utility-first styling
- **React Router** - Navigation
- **React Hot Toast** - Notifications
- **Radix UI** - Accessible components

---

## 📊 Data Flow

### Extension → App

1. Chrome Extension extracts course data:
```javascript
[
  {
    uniqueId: "priceTab_101",
    courseName: "CS101 [3 Credits]",
    displayName: "Data Structures",
    staff: "Dr. John",
    credits: 3,
    slots: [
      { day: "Monday", time: "8-10" },
      { day: "Wednesday", time: "10-12" }
    ]
  }
]
```

2. Extension encodes and opens:
```
http://localhost:5173/?data=<encodeURIComponent(JSON)>
```

3. App parses in `App.jsx`:
```javascript
useEffect(() => {
  if (hasExtensionData()) {
    loadCoursesFromExtension();
    clearExtensionDataFromURL();
    navigate('/home');
  }
}, []);
```

---

## 🎯 Core Features Explained

### 1️⃣ Time Slot System
- Supports **1-hour** slots: `8-9`, `9-10`, `10-11`, etc.
- Supports **2-hour** slots: `8-10`, `10-12`, `1-3`, `3-5`
- **Split-cell rendering**: 1-hour courses appear in left/right halves of grid cells

### 2️⃣ Conflict Detection
- Uses time overlap algorithm: `start1 < end2 AND start2 < end1`
- Checks same day AND overlapping time
- Prevents adding conflicting courses

### 3️⃣ Filtering Options
- **Free Days**: Hide courses on selected days
- **Free Times**: Hide courses overlapping selected time blocks
- **No Conflicts**: Only show courses compatible with selected ones
- **No Same Subject**: Hide duplicate subject courses

### 4️⃣ PDF Export
- Generates standalone HTML file
- Dark-themed table with course colors
- Split-cell visual for 1-hour courses
- Course details list included

---

## 🚢 Deployment

### Vercel (Recommended)

```bash
npm run build
vercel --prod
```

### Other Static Hosts
```bash
npm run build
# Upload `dist/` folder to:
# - Netlify
# - GitHub Pages
# - Cloudflare Pages
```

---

## 🔒 Environment Variables

Create `.env` file (optional):

```env
# No backend URLs needed!
# Add any frontend-only configs here
VITE_APP_NAME=EnrollMate
```

---

## 🐛 Troubleshooting

**No courses loaded?**
- Verify Chrome Extension extracted data
- Check browser console for parsing errors
- Ensure URL has `?data=...` parameter

**Conflicts not detected?**
- Check time slot format matches schema
- Verify days are valid: Monday-Saturday

**PDF download not working?**
- Ensure courses are selected
- Check browser allows file downloads

---

## 📝 Development Notes

### State Management
- **Zustand** store at `src/store/courseStore.js`
- Persists `courses` and `selectedCourses` to localStorage
- Actions: `loadCoursesFromExtension()`, `addSelectedCourses()`, `filterCourses()`

### Adding New Features
1. Update `courseStore.js` for state logic
2. Create components in `src/components/`
3. Add utilities to `src/utils/`
4. Update types in `src/types/`

---

## 👥 Credits

- 💡 **Concept**: Prahathieswaran
- 💻 **Development**: Santhosh
- 🏫 **Supported by**: Tech Society

---

## 📄 License

Educational and personal use.

---

**Built with ❤️ for seamless course enrollment**
