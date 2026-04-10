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
    }
    .page {
      max-width: 1220px;
      margin: 0 auto;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      border-bottom: 2px solid #151515;
      padding-bottom: 14px;
      margin-bottom: 18px;
    }
    .title {
      font-size: 28px;
      font-weight: 700;
      letter-spacing: 0.2px;
      margin: 0;
    }
    .meta {
      text-align: right;
      font-size: 12px;
      color: #333333;
    }
    .stats {
      display: flex;
      gap: 18px;
      margin: 14px 0 22px;
      font-size: 13px;
    }
    .stat {
      border: 1px solid #cdcdcd;
      padding: 8px 12px;
      border-radius: 8px;
    }
    .section-title {
      font-size: 16px;
      font-weight: 700;
      margin: 20px 0 10px;
      letter-spacing: 0.3px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th, td {
      border: 1px solid #d7d7d7;
      padding: 8px 10px;
      vertical-align: top;
      font-size: 12px;
    }
    th {
      background: #f5f5f5;
      color: #111111;
      text-align: left;
      font-weight: 700;
    }
    .day-cell {
      font-weight: 600;
      width: 108px;
      white-space: nowrap;
    }
    .slot-entry {
      border: 1px solid #e2e2e2;
      border-radius: 6px;
      padding: 5px 6px;
      margin-bottom: 5px;
    }
    .slot-entry:last-child { margin-bottom: 0; }
    .slot-code {
      font-weight: 800;
      font-size: 11px;
      letter-spacing: 0.2px;
    }
    .slot-name {
      font-size: 11px;
      color: #222222;
      margin-top: 2px;
    }
    .empty {
      color: #9a9a9a;
      font-size: 11px;
    }
    .code-strong {
      font-weight: 800;
      letter-spacing: 0.2px;
    }
  </style>
</head>
<body>
  <div class="page">
    <div class="header">
      <h1 class="title">EnrollMate Course Timetable</h1>
      <div class="meta">
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
            <td>${safeText(course?.courseName || '-')}</td>
            <td>${safeText(course?.credits || 0)}</td>
            <td>${safeText(course?.staff || '-')}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
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
