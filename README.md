# 🎓 EnrollMate

> **Intelligent Course Timetable Builder**  
> Frontend-only React app + Chrome Extension for effortless course scheduling

---

## 🏗️ Architecture Overview

```
┌─────────────────────┐
│  Chrome Extension   │  Extract course data from enrollment website
└──────────┬──────────┘
           │ JSON via URL query params
           ↓
┌─────────────────────┐
│   React Frontend    │  Parse, validate, and process locally
│   (Vite + Zustand)  │
└──────────┬──────────┘
           │
           ↓
┌─────────────────────┐
│  Interactive UI     │  Timetable + Conflict Detection + PDF Export
└─────────────────────┘
```

**✅ No Backend** | **✅ No Database** | **✅ No API Calls** | **✅ 100% Client-Side**

---

## 📁 Project Structure

```
EnrollMate/
├── EnrollMate-Extension/       # Chrome Extension (Manifest V3)
│   ├── manifest.json           # Extension configuration
│   ├── background.js           # Service worker for data extraction
│   ├── icons/                  # Extension icons
│   └── README.md               # Extension documentation
│
├── frontend/                   # React Application (Vite)
│   ├── src/
│   │   ├── components/         # UI components
│   │   ├── pages/              # Landing & Home pages
│   │   ├── store/              # Zustand state management
│   │   ├── utils/              # Helpers (time slots, conflicts, parsing)
│   │   ├── types/              # Course data schemas
│   │   ├── Modals/             # Filter, Download, Conflicts modals
│   │   └── libs/               # downloadPDF utility
│   ├── public/                 # Static assets
│   ├── package.json
│   └── README.md               # Frontend documentation
│
└── README.md                   # This file
```

---

## ✨ Key Features

### 🔌 Extension Integration
- One-click course data extraction from enrollment website
- Automatic JSON encoding and URL parameter passing
- Seamless handoff to React app

### 📊 Smart Timetable
- **1-hour & 2-hour slots**: Supports both slot types
- **Split-cell rendering**: 1-hour courses appear in left/right halves
- **Visual grid**: Monday-Friday, 8 AM - 5 PM
- **Color-coded courses**: Easy visual identification

### ⚠️ Conflict Detection
- Real-time schedule conflict checking
- Time overlap detection algorithm
- Prevents duplicate course selection
- Same-subject filtering

### 🎯 Advanced Filtering
- **Free Days**: Hide courses on specific days
- **Free Times**: Avoid specific time blocks
- **No Conflicts**: Show only compatible courses
- **No Same Subject**: Hide duplicate subjects

### 📥 PDF Export
- Beautiful HTML timetable generation
- Dark-themed design
- Split-cell visual representation
- Course details summary included

### 💾 Local Storage
- Persistent state with Zustand + localStorage
- No server dependency
- Works offline after data load

---

## 🚀 Getting Started

### 1️⃣ Install Chrome Extension

```bash
cd EnrollMate-Extension
```

1. Open Chrome: `chrome://extensions/`
2. Enable **Developer Mode**
3. Click **Load unpacked**
4. Select `EnrollMate-Extension` folder

Extension is now active! 🎉

### 2️⃣ Run Frontend App

```bash
cd frontend
npm install
npm run dev
```

App runs at: `http://localhost:5173`

---

## 📖 Usage Workflow

### Step-by-Step

1. **Navigate** to your university's enrollment website
   ```
   https://your-university-enrollment-site.com
   ```

2. **Click** the EnrollMate extension icon in Chrome toolbar

3. **Extension automatically**:
   - Extracts all course cards from DOM
   - Parses course details (name, staff, slots, credits)
   - Converts to JSON array
   - Opens React app with encoded data:
   ```
   http://localhost:5173/?data=<encoded_json>
   ```

4. **React app automatically**:
   - Detects URL parameter
   - Parses and validates JSON
   - Loads courses into Zustand store
   - Cleans URL (removes `?data=...`)
   - Redirects to `/home`

5. **You can now**:
   - View all extracted courses
   - Select courses for your schedule
   - See conflicts in real-time
   - Apply filters (free days/times)
   - Download PDF timetable

---

## 🔧 Technical Stack

### Frontend
- **React 18** - Modern UI library
- **Vite** - Fast build tool and dev server
- **Zustand** - Lightweight state management
- **Tailwind CSS** - Utility-first styling
- **React Router** - Client-side routing
- **React Hot Toast** - Beautiful notifications
- **Radix UI** - Accessible components

### Chrome Extension
- **Manifest V3** - Latest extension format
- **Service Worker** - Background script for extraction
- **DOM Parsing** - Intelligent data extraction

---

## 📊 Data Schema

Courses follow this structure:

```javascript
{
  uniqueId: "priceTab_101",           // Unique identifier
  courseName: "CS101 [3 Credits]",    // Full course name
  displayName: "Data Structures",     // Short name
  staff: "Dr. John Doe",              // Instructor
  credits: 3,                         // Credit hours
  slots: [                            // Schedule
    { day: "Monday", time: "8-10" },
    { day: "Wednesday", time: "10-12" }
  ]
}
```

**Valid Days**: `Monday`, `Tuesday`, `Wednesday`, `Thursday`, `Friday`, `Saturday`  
**Valid Times**: `8-9`, `9-10`, `10-11`, `11-12`, `1-2`, `2-3`, `3-4`, `4-5`, `8-10`, `10-12`, `1-3`, `3-5`

---

## 🎯 Core Algorithms

### Time Overlap Detection

```javascript
function doSlotsOverlap(slot1, slot2) {
  const time1 = parseTimeSlot(slot1); // { start: 8, end: 10 }
  const time2 = parseTimeSlot(slot2); // { start: 9, end: 11 }
  
  return time1.start < time2.end && time2.start < time1.end;
  // Returns true if slots overlap
}
```

### Conflict Detection

```javascript
// Check if new course conflicts with selected courses
for (const selectedCourse of selectedCourses) {
  for (const slot1 of newCourse.slots) {
    for (const slot2 of selectedCourse.slots) {
      if (slot1.day === slot2.day && doSlotsOverlap(slot1.time, slot2.time)) {
        return { conflict: true };
      }
    }
  }
}
```

---

## 🚢 Deployment

### Frontend Deployment (Vercel)

```bash
cd frontend
npm run build
vercel --prod
```

### Alternative Static Hosts
- **Netlify**: Drop `dist/` folder
- **GitHub Pages**: Push `dist/` to `gh-pages` branch
- **Cloudflare Pages**: Connect GitHub repo

### Extension Distribution
1. Zip `EnrollMate-Extension` folder
2. Upload to Chrome Web Store (requires developer account)
3. Or share unpacked folder for manual installation

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| **No courses loaded** | Ensure extension extracted data, check console for errors |
| **Extension doesn't activate** | Verify you're on the correct enrollment website URL |
| **Conflicts not detected** | Check time slot format matches schema |
| **PDF download fails** | Ensure courses are selected, check browser download permissions |
| **App won't start** | Run `npm install` again, check Node.js version (16+) |

---

## 📝 Development

### Adding New Features

1. **State logic**: Update `frontend/src/store/courseStore.js`
2. **UI components**: Create in `frontend/src/components/`
3. **Utilities**: Add to `frontend/src/utils/`
4. **Types**: Define in `frontend/src/types/`

### Extension Customization

If your enrollment website has different DOM structure:

```javascript
// Edit background.js selectors
const courseNameElement = card.querySelector('.your-course-name-class');
const staffElement = card.querySelector('.your-staff-class');
// ... etc
```

---

## 🗂️ File Inventory

### Created Files (Frontend-Only Refactor)
- ✅ `frontend/src/types/courseSchedule.types.js` - Course schema and validators
- ✅ `frontend/src/utils/parseExtensionData.js` - URL query param parser
- ✅ `frontend/README.md` - Updated frontend documentation

### Modified Files
- ✅ `frontend/src/store/courseStore.js` - Replaced API calls with extension data loading
- ✅ `frontend/src/App.jsx` - Added URL parsing and auto-navigation
- ✅ `frontend/src/pages/HomePage.jsx` - Removed server fetch logic

### Deleted Files
- ❌ `backend/` (entire folder)
- ❌ `docker-compose.yaml`
- ❌ `frontend/src/libs/axios.js`

---

## 🎓 Educational Use Case

Perfect for:
- University students managing course enrollment
- Academic advisors helping students plan schedules
- Department coordinators tracking course offerings
- Anyone needing visual schedule management

---

## 👥 Team

- 💡 **Concept**: Prahathieswaran
- 💻 **Built by**: Santhosh
- 🏫 **Supported by**: Tech Society

---

## 📄 License

Educational and personal use.

---

## 🔗 Quick Links

- **Extension README**: `EnrollMate-Extension/README.md`
- **Frontend README**: `frontend/README.md`
- **Chrome Extension Guide**: [Chrome Developer Docs](https://developer.chrome.com/docs/extensions/)
- **React Docs**: [react.dev](https://react.dev)
- **Vite Docs**: [vitejs.dev](https://vitejs.dev)

---

**Built with ❤️ for seamless course enrollment**

🌟 Star this repo if it helped you!
