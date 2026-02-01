# 🧪 EnrollMate Local Testing Guide

Complete step-by-step guide for testing the Chrome Extension + React App integration locally.

---

## 📋 Prerequisites Checklist

- [ ] Node.js 16+ installed
- [ ] Google Chrome browser
- [ ] Access to CAMU enrollment page: `https://www.mycamu.co.in/#/home/feed/enrolement`
- [ ] CAMU login credentials

---

## 🚀 Setup Instructions

### Step 1: Install Frontend Dependencies

```bash
cd /path/to/EnrollMate/frontend
npm install
```

### Step 2: Start React Development Server

```bash
npm run dev
```

**Expected Output:**
```
VITE v5.x.x  ready in XXX ms

➜  Local:   http://localhost:5173/
➜  Network: http://192.168.x.x:5173/
```

✅ **Keep this terminal running**

### Step 3: Load Chrome Extension

1. Open Chrome and navigate to:
   ```
   chrome://extensions/
   ```

2. **Enable "Developer mode"** (toggle in top-right)

3. Click **"Load unpacked"** button

4. Select the folder:
   ```
   /path/to/EnrollMate/EnrollMate-Extension
   ```

5. **Verify** extension appears with blue "E" icon

6. **Pin extension** to toolbar (puzzle icon → pin)

---

## 🧪 Testing Workflow

### Test 1: Basic Extraction

1. **Navigate to CAMU:**
   ```
   https://www.mycamu.co.in/#/home/feed/enrolement
   ```

2. **Login** if required

3. **Wait** for course cards to load completely

4. **Open DevTools** (F12) → Console tab

5. **Verify course cards exist:**
   ```javascript
   document.querySelectorAll('[id^="priceTab_"]').length
   // Should return a number > 0
   ```

6. **Click** the EnrollMate extension icon (blue "E")

7. **Expected Result:**
   - Alert shows "Extracted X courses"
   - New tab opens with React app
   - URL has `?data=...` parameter (briefly)
   - App navigates to `/home`
   - Courses appear in timetable

### Test 2: Check Extension Console

1. Go to `chrome://extensions/`

2. Find EnrollMate extension

3. Click **"service worker"** link (under extension name)

4. **Background console** opens showing logs:
   ```
   🔍 Extracting course data from CAMU...
   ✅ Extracted 15 courses
   🚀 Opened React app with course data
   ```

### Test 3: Verify React Data Flow

1. In React app, open DevTools Console

2. You should see:
   ```
   🔍 Extension data detected in URL
   ✅ Successfully loaded 15 courses
   ```

3. **Check Zustand store:**
   ```javascript
   // In console
   localStorage.getItem('course-storage')
   // Should show JSON with courses
   ```

4. **Verify courses render** in timetable grid

### Test 4: Test Without Extension Data

1. Navigate to:
   ```
   http://localhost:5173/
   ```

2. Should show **Landing Page**

3. No errors in console

4. Clicking on page should work normally

---

## 🐛 Troubleshooting

### Extension Icon Grayed Out / Disabled

**Problem:** Extension not active on current page

**Solution:**
- Verify you're on `https://www.mycamu.co.in/*`
- Check `manifest.json` has correct `host_permissions`
- Reload extension in `chrome://extensions/`

### No Alert After Clicking Extension

**Debug Steps:**

1. **Check background console:**
   ```
   chrome://extensions/ → service worker
   ```

2. **Look for errors** like:
   - Permission denied
   - Script injection failed
   - No course cards found

3. **Verify DOM structure:**
   ```javascript
   // In CAMU page console
   document.querySelectorAll('[id^="priceTab_"]')
   ```

### React App Shows No Courses

**Possible Causes:**

1. **URL param missing:**
   - Check if URL has `?data=...` when opened
   - Extension might not have extracted data

2. **JSON parse error:**
   - Open React console
   - Look for parsing errors

3. **Validation errors:**
   - Some courses may have failed validation
   - Check console for validation warnings

**Debug:**
```javascript
// In React console
const params = new URLSearchParams(window.location.search);
console.log(params.get('data')); // Should show encoded string
```

### Courses Not Rendering in Timetable

**Check:**

1. **Courses loaded in state:**
   ```javascript
   // In React console
   JSON.parse(localStorage.getItem('course-storage')).state.courses
   ```

2. **Time slot format:**
   - Should be `"8-10"`, `"10-12"`, etc.
   - Not `"08:00-10:00"`

3. **Day format:**
   - Should be full day names: `"Monday"`, `"Tuesday"`
   - Not abbreviated: `"Mon"`, `"Tue"`

### Extension Extracts Wrong Data

**Common Issues:**

1. **DOM selectors don't match CAMU structure**

   **Solution:** Inspect CAMU page HTML:
   ```javascript
   // Find a course card
   const card = document.querySelector('[id^="priceTab_"]');
   
   // Check structure
   console.log(card.innerHTML);
   
   // Test selectors
   console.log(card.querySelector('.course-name'));
   console.log(card.querySelector('.staff'));
   ```

2. **Update `background.js` selectors** to match CAMU's actual HTML

---

## ✅ Success Criteria

All of these should work:

- [ ] Extension icon is active on CAMU page
- [ ] Clicking extension shows alert with course count
- [ ] New tab opens with React app
- [ ] React app shows "Loaded X courses" in console
- [ ] Courses appear in timetable grid
- [ ] Can select/deselect courses
- [ ] Conflict detection works
- [ ] Can download PDF timetable
- [ ] localStorage persists courses on refresh

---

## 📊 Sample Test Data

If CAMU is not accessible, create a test HTML file:

**`test-camu-page.html`:**
```html
<!DOCTYPE html>
<html>
<head>
  <title>Test CAMU Page</title>
</head>
<body>
  <h1>Test Course Cards</h1>
  
  <div id="priceTab_CS101">
    <h3 class="course-name">CS101 Introduction to Computing [3 Credits]</h3>
    <div class="display-name">Intro to CS</div>
    <span class="staff">Dr. John Doe</span>
    <div class="credits">3 Credits</div>
    <div class="slot">Monday 8-10</div>
    <div class="slot">Wednesday 10-12</div>
  </div>

  <div id="priceTab_MATH201">
    <h3 class="course-name">MATH201 Calculus II [4 Credits]</h3>
    <div class="display-name">Calc II</div>
    <span class="staff">Prof. Jane Smith</span>
    <div class="credits">4 Credits</div>
    <div class="slot">Tuesday 8-10</div>
    <div class="slot">Thursday 1-3</div>
    <div class="slot">Friday 10-12</div>
  </div>

  <div id="priceTab_PHY101">
    <h3 class="course-name">PHY101 Physics Fundamentals [3 Credits]</h3>
    <div class="display-name">Physics</div>
    <span class="staff">Dr. Albert Einstein</span>
    <div class="credits">3 Credits</div>
    <div class="slot">Monday 1-3</div>
    <div class="slot">Wednesday 3-5</div>
  </div>

</body>
</html>
```

1. Save as `test-camu-page.html`
2. **Update manifest.json** temporarily:
   ```json
   "host_permissions": [
     "file:///*"
   ]
   ```
3. Open `test-camu-page.html` in Chrome
4. Click extension icon
5. Should extract 3 test courses

**Remember to revert manifest.json back to CAMU domain after testing!**

---

## 📝 Testing Checklist

### Extension Tests

- [ ] Extension loads without errors
- [ ] Icon appears in toolbar
- [ ] Icon is active on CAMU page
- [ ] Click triggers extraction
- [ ] Background console shows logs
- [ ] Opens React app in new tab
- [ ] Alert shows correct course count

### React App Tests

- [ ] Dev server runs on port 5173
- [ ] Landing page loads correctly
- [ ] Extension data is detected
- [ ] URL param is parsed
- [ ] Courses load into state
- [ ] URL is cleaned (param removed)
- [ ] Navigates to `/home`
- [ ] Timetable renders courses
- [ ] Can select courses
- [ ] Conflict detection works
- [ ] Filtering works (days, times)
- [ ] PDF download works
- [ ] Data persists on refresh

### Integration Tests

- [ ] Full flow works end-to-end
- [ ] No console errors
- [ ] No network errors
- [ ] No CORS issues
- [ ] Performance is acceptable
- [ ] Works with large datasets (50+ courses)

---

## 🎯 Performance Benchmarks

**Acceptable Performance:**

- Extension extraction: < 2 seconds
- React data parsing: < 1 second
- Timetable rendering: < 1 second
- Total flow: < 5 seconds

**If slower:**
- Check for large DOM trees
- Optimize React rendering
- Reduce validation overhead

---

## 🔄 Reload/Refresh Guide

### Reload Extension (After Code Changes)

```
chrome://extensions/ → Click refresh icon on EnrollMate card
```

### Restart React Dev Server

```bash
Ctrl+C  # Stop server
npm run dev  # Restart
```

### Clear Cached Data

```javascript
// In React console
localStorage.clear();
location.reload();
```

---

## 📞 Support

**If tests fail:**

1. Check all prerequisites are met
2. Follow troubleshooting steps above
3. Inspect browser console for errors
4. Verify CAMU page structure hasn't changed
5. Update DOM selectors in `background.js`

---

**Ready to Test!** 🚀

Follow the steps above and verify each test passes. Good luck!
