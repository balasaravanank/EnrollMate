# EnrollMate

Intelligent course timetable builder with a frontend-first workflow.

## Overview

EnrollMate helps students build course schedules, detect conflicts, apply filters, and export timetable views.

## Architecture

- Data source: browser-based extraction workflow
- App runtime: React + Vite frontend
- Processing: local (client-side)
- Storage: localStorage via Zustand persistence

## Repository Structure

```text
EnrollMate/
├── frontend/                     React application
│   ├── src/                      Components, pages, state, utilities
│   ├── public/                   Static assets
│   └── README.md                 Frontend-specific documentation
├── design-md/                    Design reference packs
│   └── <brand>/README.md         Brand-specific design guide
├── README.md                     This file
└── LOCAL-TESTING-GUIDE.md        Local testing instructions
```

## Core Features

- Course selection and timetable visualization
- Conflict detection based on overlapping slots
- Filtering by free days, free times, and compatibility rules
- PDF/export-ready timetable view
- Persistent local state for selected courses

## Getting Started

```bash
cd frontend
npm install
npm run dev
```

Default local URL:

```text
http://localhost:5173
```

## Usage

Use the flow below after you enter the app.

### Guide 1: Enter App and Load Courses

1. Open http://localhost:5173 in your browser.
2. If courses are auto-loaded from the extension, go to the next guide.
3. If courses are not loaded, click Paste Data and paste your course data.
4. Confirm that course cards are visible on the page.

### Guide 2: Build Your Timetable

1. Use the search box to find a course.
2. Click a course card to add it to your selected list.
3. Review conflict warnings before adding overlapping slots.
4. Use filters to remove unwanted days, times, or conflicting options.

### Guide 3: Export Final Timetable

1. Confirm your selected courses in the timetable view.
2. Click the download or export action.
3. Save the PDF and verify all selected courses are included.

## Tech Stack

- React 18
- Vite
- Zustand
- Tailwind CSS
- React Router
- React Hot Toast
- Radix UI

## Deployment

```bash
cd frontend
npm run build
```

Deploy the generated `dist/` output to your preferred static host.

## Troubleshooting

- No data loaded: verify the input format and browser console.
- Missing conflict checks: verify day/time slot formatting.
- Export issues: ensure at least one course is selected.

## License

Educational and personal use.