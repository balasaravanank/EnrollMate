# EnrollMate Frontend

Frontend application for timetable creation, filtering, conflict detection, and export.

## Overview

This app runs fully on the client side and is designed for a fast local workflow.

## Features

- Timetable grid rendering for course slots
- Conflict detection for overlapping schedules
- Course filtering (days, time windows, compatibility)
- Export-ready timetable output
- Persistent state with localStorage

## Quick Start

```bash
cd frontend
npm install
npm run dev
```

Local development URL:

```text
http://localhost:5173
```

## Project Structure

```text
frontend/
├── src/
│   ├── components/               UI components
│   ├── pages/                    Route pages
│   ├── store/                    Zustand state
│   ├── utils/                    Parsing and conflict helpers
│   ├── types/                    Data schemas
│   ├── Modals/                   Modal components
│   └── libs/                     Utility libraries
├── public/                       Static assets
└── package.json
```

## Data Flow

1. Course data is loaded into app state.
2. The store normalizes and persists records.
3. UI components render timetable and conflict markers.
4. Filters update visible/eligible course sets.
5. Export utilities generate downloadable output.

## Scripts

```bash
npm run dev       # Start dev server
npm run build     # Build production assets
npm run preview   # Preview production build
```

## Troubleshooting

- App fails to start: confirm Node.js and reinstall dependencies.
- No timetable rows: verify parsed course slot format.
- Export not available: confirm selected course data exists.

## License

Educational and personal use.