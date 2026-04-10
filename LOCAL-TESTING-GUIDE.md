# EnrollMate Local Testing Guide

Step-by-step local testing instructions for the EnrollMate frontend workflow.

## Purpose

Use this guide to validate that local development, data loading, timetable behavior, and export flow work correctly.

## Prerequisites

- Node.js 16+
- npm
- Google Chrome (recommended)
- Local workspace cloned and opened

## Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

Expected local URL:

```text
http://localhost:5173
```

Keep this terminal running while testing.

## Testing Scenarios

### 1. App Boot Test

1. Open `http://localhost:5173`.
2. Confirm the app loads without runtime errors.
3. Open browser DevTools and verify there are no blocking errors.

Expected result:

- App is visible and interactive.
- No fatal console errors.

### 2. Data Load Test

1. Load course data through your normal local input flow.
2. Confirm parsed data appears in the UI.
3. Refresh the page.

Expected result:

- Course records are displayed.
- Data persists after refresh (localStorage-backed state).

### 3. Timetable Rendering Test

1. Select at least 3 courses with different slot patterns.
2. Verify grid placement for each day/time slot.
3. Add one overlapping course.

Expected result:

- Courses appear in correct cells.
- Overlap/conflict indicator appears for conflicting selections.

### 4. Filtering Test

1. Apply free-day filters.
2. Apply free-time filters.
3. Toggle conflict-related filters.

Expected result:

- Filtered course list updates immediately.
- Incompatible options are hidden or flagged based on filter mode.

### 5. Export Test

1. Select a valid timetable.
2. Trigger the export/download action.

Expected result:

- Export file is generated.
- Export output reflects current selected timetable.

## Quick Debug Checks

### Check App State in Browser

In DevTools Console:

```javascript
localStorage.getItem('course-storage')
```

Expected result:

- JSON string containing `courses` and selected data fields.

### Verify Course Slot Format

Expected day format:

```text
Monday, Tuesday, Wednesday, Thursday, Friday, Saturday
```

Expected time format examples:

```text
8-9, 9-10, 10-11, 11-12, 1-2, 2-3, 3-4, 4-5, 8-10, 10-12, 1-3, 3-5
```

## Common Issues

### App does not start

- Re-run `npm install` in `frontend`.
- Verify Node.js version.
- Check port conflicts on `5173`.

### No courses displayed

- Validate incoming data shape.
- Check parsing logic in `frontend/src/utils`.
- Inspect console for schema/validation errors.

### Conflicts not detected

- Verify day labels are full names.
- Verify slot strings match expected format.

### Export not working

- Confirm at least one course is selected.
- Check popup/download permissions in browser.

## Completion Checklist

- [ ] Frontend runs locally.
- [ ] Data loads successfully.
- [ ] Timetable grid renders correctly.
- [ ] Conflict detection is triggered when expected.
- [ ] Filters update results correctly.
- [ ] Export generates output.
- [ ] State persists after refresh.

## Notes

If your project includes an external browser-extension input step, test that integration separately after the frontend checks above are passing.