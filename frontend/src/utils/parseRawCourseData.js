// Parses raw CAMU enrollment text into EnrollMate course format.
//
// The CAMU "Full Registration" page copies as ONE continuous string with no
// line breaks (everything glued together). So we first normalise the text by
// inserting line breaks before the key anchors (course headers, section rows,
// dates and day rows), then parse it line by line.

const VALID_TIMES = ["8-9", "9-10", "10-11", "11-12", "1-2", "2-3", "3-4", "4-5", "8-10", "10-12", "1-3", "3-5"];

function convertHour(h) {
  return h >= 13 ? h - 12 : h;
}

function parseTimeSlotsFromLine(timeStr) {
  const segments = [];
  const regex = /(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/g;
  let match;
  while ((match = regex.exec(timeStr)) !== null) {
    const start = parseInt(match[1]);
    const end = parseInt(match[3]);
    if (start < 8 || start >= 20 || end <= 8 || end > 17) continue;
    if (!segments.find(s => s.start === start && s.end === end)) {
      segments.push({ start, end });
    }
  }

  segments.sort((a, b) => a.start - b.start);

  // Merge consecutive 1-hour segments into 2-hour blocks
  const merged = [];
  let i = 0;
  while (i < segments.length) {
    if (i + 1 < segments.length && segments[i].end === segments[i + 1].start) {
      merged.push({ start: segments[i].start, end: segments[i + 1].end });
      i += 2;
    } else {
      merged.push(segments[i]);
      i++;
    }
  }

  return merged
    .map(s => `${convertHour(s.start)}-${convertHour(s.end)}`)
    .filter(t => VALID_TIMES.includes(t));
}

// Insert line breaks before the structural anchors so the glued, single-line
// CAMU paste can be parsed line by line. Also works if the source already has
// line breaks (extra blank lines are skipped later).
function normalizeRawText(raw) {
  return raw
    // Course header: e.g. "19ME533 [4 Credits]"
    .replace(/(\d{2}[A-Z]{2,4}\d{3}\s*\[\s*\d+\s*Credits?\s*\])/g, "\n$1\n")
    // Section/subject overview marker
    .replace(/Course overview/gi, "\nCourse overview\n")
    // Section rows: e.g. "UG - 04, T1-B9, MECH - Sellakumar S"
    .replace(/(UG\s*-\s*\d+\s*,)/g, "\n$1")
    // Date ranges
    .replace(/(Date\s*:)/g, "\n$1")
    // Day rows
    .replace(/(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday)\s*:/g, "\n$1:");
}

export function parseRawCourseData(rawText) {
  const normalized = normalizeRawText(rawText);
  const lines = normalized.split(/\r?\n/).map(l => l.trim());
  const coursesMap = new Map();

  let courseCode = '';
  let credits = 0;
  let displayName = '';
  let section = '';
  let staff = '';
  let slots = [];
  let expectName = false;

  function saveSection() {
    if (section && slots.length > 0 && courseCode) {
      const uid = `priceTab_${courseCode}_${section}`;
      if (!coursesMap.has(uid)) {
        coursesMap.set(uid, {
          uniqueId: uid,
          courseName: `${courseCode} ${displayName} [${credits} Credits]`,
          displayName: displayName || courseCode,
          staff,
          credits,
          slots: [...slots]
        });
      }
    }
    section = '';
    staff = '';
    slots = [];
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (!line || /^(Full Registration|Courses offered|All Enrolled|Type a subject|No\. of attempts)/.test(line)) continue;

    // Course code line: "19ME533 [4 Credits]..."
    const cm = line.match(/^(\d{2}[A-Z]{2,4}\d{3})\s*\[\s*(\d+)\s*Credits?\s*\]/i);
    if (cm) {
      saveSection();
      courseCode = cm[1];
      credits = parseInt(cm[2]);
      displayName = '';
      expectName = false;
      continue;
    }

    if (line === 'Course overview') { expectName = true; continue; }

    // Section row: "UG - 04, T1-B9, MECH - Sellakumar S"
    // Group 1 = section code, group 2 = "DEPT - STAFF"
    const sm = line.match(/^UG\s*-\s*\d+\s*,\s*([A-Za-z0-9][A-Za-z0-9-]*)\s*,\s*(.+)$/);
    if (sm) {
      saveSection();
      section = sm[1].trim();
      const rest = sm[2].trim();          // e.g. "MECH - Sellakumar S"
      const dashIdx = rest.indexOf(' - ');
      staff = dashIdx >= 0 ? rest.slice(dashIdx + 3).trim() : rest;
      slots = [];
      // Skip the bogus "PHASE-1" enlistment rows (they carry no real timetable)
      if (/^PHASE/i.test(section)) {
        section = '';
        staff = '';
      }
      continue;
    }

    if (line.startsWith('Date:') || /^Date\s*:/.test(line)) continue;

    // Display name line (right after "Course overview")
    if (expectName && !/^UG\s*-/.test(line) && !/^Date\s*:/.test(line)) {
      displayName = line;
      expectName = false;
      continue;
    }

    // Day line: "Monday: 10:00 - 11:0011:00 - 12:00"
    const dm = line.match(/^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday)\s*:\s*(.+)$/);
    if (dm && section) {
      const day = dm[1];
      const times = parseTimeSlotsFromLine(dm[2]);
      for (const time of times) {
        if (!slots.find(s => s.day === day && s.time === time)) {
          slots.push({ day, time });
        }
      }
    }
  }

  saveSection();
  return Array.from(coursesMap.values());
}
