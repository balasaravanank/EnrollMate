import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export const downloadTimetablePDF = async (selectedCourses, filename = 'timetable') => {
  try {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const timeSlots = [
      { label: '8-10', value: '8-10' },
      { label: '10-12', value: '10-12' },
      { label: '1-3', value: '1-3' },
      { label: '3-5', value: '3-5' }
    ];

    const normalizeHour = (hour) => {
      if (hour >= 1 && hour <= 5) return hour + 12;
      return hour;
    };

    const parseRange = (slotString = '') => {
      const [startRaw, endRaw] = slotString.split('-').map((value) => Number.parseInt(value, 10));
      if (Number.isNaN(startRaw) || Number.isNaN(endRaw)) return null;
      return {
        start: normalizeHour(startRaw),
        end: normalizeHour(endRaw)
      };
    };

    const overlap = (a, b) => a && b && a.start < b.end && b.start < a.end;

    const shortCode = (course) => {
      if (!course?.uniqueId) return '-';
      return course.uniqueId.split('_').pop() || course.uniqueId;
    };

    const safeText = (value) => String(value ?? '-')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');

    const timetableGrid = {};
    days.forEach((day) => {
      timetableGrid[day] = {};
      timeSlots.forEach((slot) => {
        timetableGrid[day][slot.value] = [];
      });
    });

    selectedCourses.forEach((course) => {
      (course?.slots || []).forEach((slot) => {
        if (!timetableGrid[slot?.day]) return;
        const slotRange = parseRange(slot?.time);
        timeSlots.forEach((block) => {
          const blockRange = parseRange(block.value);
          if (overlap(slotRange, blockRange)) {
            timetableGrid[slot.day][block.value].push(course);
          }
        });
      });
    });

    const totalCredits = selectedCourses.reduce((sum, course) => sum + (course?.credits || 0), 0);
    const generatedOn = new Date().toLocaleString();
    const generatedYear = new Date().getFullYear();
    const cleanFilename = (filename || 'timetable').trim() || 'timetable';

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>EnrollMate Timetable</title>
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 42px;
      background: #ffffff;
      color: #111111;
      font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
      line-height: 1.35;
      font-size: 14px;
    }
    .page {
      max-width: 1220px;
      margin: 0 auto;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      border-bottom: 2px solid #2563eb;
      padding-bottom: 14px;
      margin-bottom: 18px;
    }
    .title {
      font-size: 34px;
      font-weight: 800;
      letter-spacing: 0.2px;
      margin: 0;
      color: #111111;
    }
    .subtitle {
      margin-top: 4px;
      font-size: 14px;
      color: #2563eb;
      font-weight: 700;
      letter-spacing: 0.2px;
    }
    .meta {
      text-align: right;
      font-size: 14px;
      color: #333333;
      font-weight: 600;
    }
    .stats {
      display: flex;
      gap: 18px;
      margin: 14px 0 22px;
      font-size: 15px;
    }
    .stat {
      border: 1px solid #cfdcf9;
      background: #eff6ff;
      padding: 8px 12px;
      border-radius: 8px;
      font-weight: 600;
    }
    .section-title {
      font-size: 20px;
      font-weight: 800;
      margin: 20px 0 10px;
      letter-spacing: 0.3px;
      color: #1e40af;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th, td {
      border: 1px solid #d7d7d7;
      padding: 10px 12px;
      vertical-align: top;
      font-size: 14px;
    }
    th {
      background: #eff6ff;
      color: #111111;
      text-align: left;
      font-weight: 800;
    }
    .day-cell {
      font-weight: 700;
      width: 108px;
      white-space: nowrap;
      background: #f8fbff;
      font-size: 15px;
    }
    .slot-entry {
      border: 1px solid #e2e2e2;
      border-radius: 6px;
      padding: 7px 8px;
      margin-bottom: 7px;
    }
    .slot-entry:last-child { margin-bottom: 0; }
    .slot-code {
      font-weight: 800;
      font-size: 14px;
      letter-spacing: 0.2px;
      color: #1d4ed8;
    }
    .slot-name {
      font-size: 13px;
      color: #222222;
      margin-top: 2px;
      font-weight: 700;
    }
    .empty {
      color: #9a9a9a;
      font-size: 13px;
    }
    .code-strong {
      font-weight: 800;
      font-size: 15px;
      letter-spacing: 0.2px;
      color: #1d4ed8;
    }
    .footer-note {
      margin-top: 14px;
      padding-top: 10px;
      border-top: 1px solid #dbeafe;
      font-size: 13px;
      color: #1f2937;
      display: flex;
      justify-content: space-between;
      gap: 16px;
      flex-wrap: wrap;
    }
    .footer-note strong {
      color: #1d4ed8;
    }
  </style>
</head>
<body>
  <div class="page">
    <div class="header">
      <div>
        <h1 class="title">EnrollMate Course Timetable</h1>
        <div class="subtitle">Clean Planner Export</div>
      </div>
      <div class="meta">
        <div>Platform: EnrollMate</div>
        <div>Generated: ${safeText(generatedOn)}</div>
      </div>
    </div>

    <div class="stats">
      <div class="stat">Courses: <strong>${selectedCourses.length}</strong></div>
      <div class="stat">Credits: <strong>${totalCredits}</strong></div>
    </div>

    <div class="section-title">Timetable</div>
    <table>
      <thead>
        <tr>
          <th>Day</th>
          ${timeSlots.map((slot) => `<th>${slot.label}</th>`).join('')}
        </tr>
      </thead>
      <tbody>
        ${days.map((day) => `
          <tr>
            <td class="day-cell">${day}</td>
            ${timeSlots.map((slot) => {
              const entries = timetableGrid[day][slot.value];
              if (!entries.length) return '<td><span class="empty">-</span></td>';
              return `<td>${entries.map((course) => `
                <div class="slot-entry">
                  <div class="slot-code">${safeText(shortCode(course))}</div>
                  <div class="slot-name">${safeText(course?.courseName || '-')}</div>
                </div>
              `).join('')}</td>`;
            }).join('')}
          </tr>
        `).join('')}
      </tbody>
    </table>

    <div class="section-title">Course List</div>
    <table>
      <thead>
        <tr>
          <th style="width: 18%;">Code</th>
          <th style="width: 52%;">Course Name</th>
          <th style="width: 15%;">Credits</th>
          <th style="width: 15%;">Faculty</th>
        </tr>
      </thead>
      <tbody>
        ${selectedCourses.map((course) => `
          <tr>
            <td><span class="code-strong">${safeText(shortCode(course))}</span></td>
            <td><strong>${safeText(course?.courseName || '-')}</strong></td>
            <td><strong>${safeText(course?.credits || 0)}</strong></td>
            <td>${safeText(course?.staff || '-')}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <div class="footer-note">
      <div><strong>Built by:</strong> Santhosh, Bala Saravanan K</div>
      <div><strong>Concept:</strong> Prahathieswaran</div>
      <div>© ${generatedYear} EnrollMate</div>
    </div>
  </div>
</body>
</html>
    `;

    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.left = '-99999px';
    iframe.style.width = '1260px';
    iframe.style.height = '1000px';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(htmlContent);
    doc.close();

    await new Promise((resolve) => setTimeout(resolve, 250));
    iframe.style.height = `${doc.body.scrollHeight + 60}px`;

    const canvas = await html2canvas(doc.body, {
      scale: 2,
      backgroundColor: '#ffffff',
      useCORS: true,
      windowWidth: 1260,
      logging: false
    });

    document.body.removeChild(iframe);

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 8;
    const printableWidth = pageWidth - margin * 2;
    const printableHeight = pageHeight - margin * 2;
    const renderedHeight = (canvas.height * printableWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', margin, margin, printableWidth, renderedHeight);

    let heightLeft = renderedHeight - printableHeight;
    let yPosition = margin - printableHeight;

    while (heightLeft > 0) {
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', margin, yPosition, printableWidth, renderedHeight);
      yPosition -= printableHeight;
      heightLeft -= printableHeight;
    }

    pdf.save(`${cleanFilename}.pdf`);

    return { success: true };
  } catch (error) {
    console.error('Error generating PDF:', error);
    return { success: false, error: error.message };
  }
};
