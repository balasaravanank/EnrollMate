import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export const downloadTimetablePDF = async (selectedCourses, filename = 'timetable') => {
    try {
        // Helper functions for time slot parsing and overlap detection
        const parseTimeSlot = (slotString) => {
            const [startStr, endStr] = slotString.split('-').map(s => s.trim());
            let start = parseInt(startStr, 10);
            let end = parseInt(endStr, 10);
            if (start >= 1 && start <= 5) start += 12;
            if (end >= 1 && end <= 5) end += 12;
            return { start, end };
        };

        const doSlotsOverlap = (slot1, slot2) => {
            const time1 = parseTimeSlot(slot1);
            const time2 = parseTimeSlot(slot2);
            return time1.start < time2.end && time2.start < time1.end;
        };

        const getSlotDuration = (slotString) => {
            const { start, end } = parseTimeSlot(slotString);
            return end - start;
        };

        // Days and 2-hour time blocks (matching the UI)
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
        const timeSlots = [
            { label: '8:00 AM - 10:00 AM', value: '8-10' },
            { label: '10:00 AM - 12:00 PM', value: '10-12' },
            { label: '1:00 PM - 3:00 PM', value: '1-3' },
            { label: '3:00 PM - 5:00 PM', value: '3-5' }
        ];

        // Create timetable grid - each block can have left, right, or full course
        const timetableGrid = {};
        days.forEach(day => {
            timetableGrid[day] = {};
            timeSlots.forEach(slot => {
                timetableGrid[day][slot.value] = { left: null, right: null, full: null };
            });
        });

        // Fill timetable with courses
        selectedCourses.forEach(course => {
            if (course.slots && Array.isArray(course.slots)) {
                course.slots.forEach(slot => {
                    if (!timetableGrid[slot.day]) return;

                    const duration = getSlotDuration(slot.time);
                    const [slotStart] = slot.time.split('-').map(s => parseInt(s, 10));

                    // Find which 2-hour block this course belongs to
                    timeSlots.forEach(block => {
                        if (doSlotsOverlap(slot.time, block.value)) {
                            const [blockStart, blockEnd] = block.value.split('-').map(s => parseInt(s, 10));
                            
                            if (duration === 2 && slot.time === block.value) {
                                // Full 2-hour course
                                timetableGrid[slot.day][block.value].full = course;
                            } else if (duration === 1) {
                                // 1-hour course - determine if left or right half
                                const leftSlot = `${blockStart}-${blockStart + 1}`;
                                const rightSlot = `${blockStart + 1}-${blockEnd}`;
                                
                                if (slot.time === leftSlot || doSlotsOverlap(slot.time, leftSlot)) {
                                    timetableGrid[slot.day][block.value].left = course;
                                } else if (slot.time === rightSlot || doSlotsOverlap(slot.time, rightSlot)) {
                                    timetableGrid[slot.day][block.value].right = course;
                                }
                            }
                        }
                    });
                });
            }
        });

        // Generate color for each course
        const courseColors = {};
        const colors = [
            '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
            '#EC4899', '#14B8A6', '#F97316', '#06B6D4', '#84CC16'
        ];
        selectedCourses.forEach((course, index) => {
            courseColors[course.uniqueId] = colors[index % colors.length];
        });

        // Calculate total credits
        const totalCredits = selectedCourses.reduce((sum, course) => sum + (course?.credits || 0), 0);

        // Generate HTML content
        const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Courses</title>
  <style>
    body {
      font-family: 'Fira Code', 'Courier New', monospace;
      background: #0d1117;
      color: #c9d1d9;
      margin: 0;
      padding: 60px;
    }
    .header {
      border-bottom: 2px solid #30363d;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    h1 {
      font-size: 32px;
      color: #58a6ff;
      margin: 0 0 10px 0;
      letter-spacing: -0.5px;
    }
    .subtitle {
      font-size: 14px;
      color: #8b949e;
      display: flex;
      gap: 20px;
    }
    .subtitle span {
      background: #21262d;
      padding: 4px 8px;
      border-radius: 4px;
      border: 1px solid #30363d;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 30px;
    }
    th, td {
      border-bottom: 1px solid #21262d;
      padding: 16px 12px;
      text-align: left;
      font-size: 14px;
    }
    th {
      color: #8b949e;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
      font-size: 12px;
      border-bottom: 2px solid #30363d;
    }
    .course-code {
      font-weight: 700;
      color: #7ee787;
      background: rgba(46, 160, 67, 0.1);
      padding: 6px 10px;
      border-radius: 6px;
      border: 1px solid rgba(46, 160, 67, 0.4);
      display: inline-block;
      font-size: 15px;
    }
    tr:hover {
      background-color: #161b22;
    }
    .footer {
      margin-top: 60px;
      padding-top: 20px;
      border-top: 1px dashed #30363d;
      font-size: 12px;
      color: #484f58;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>> ./enrollmate_courses.sh</h1>
    <div class="subtitle">
      <span>Total Courses: <b>${selectedCourses.length}</b></span>
      <span>Total Credits: <b>${totalCredits}</b></span>
      <span style="color: #ff7b72;">[ SYSTEM: ONLINE ]</span>
    </div>
  </div>
  
  <table>
    <thead>
      <tr>
        <th width="20%">COURSE_CODE</th>
        <th width="45%">COURSE_NAME</th>
        <th width="20%">FACULTY_ID</th>
        <th width="15%">CREDITS</th>
      </tr>
    </thead>
    <tbody>
      ${selectedCourses.map(course => {
        const codeOnly = course.uniqueId ? course.uniqueId.split('_').pop() : '-';
        return `
        <tr>
          <td><span class="course-code">${codeOnly}</span></td>
          <td style="color: #c9d1d9; font-weight: 500;">${course.courseName || '-'}</td>
          <td style="color: #a5d6ff;">${course.staff || '-'}</td>
          <td style="color: #d2a8ff; font-weight: bold;">${course.credits || '0'}cr</td>
        </tr>
      `}).join('')}
    </tbody>
  </table>
  
  <div class="footer">
    <p>/* Execution successful. Generated by EnrollMate Kernel. */</p>
  </div>
</body>
</html>
    `;

        // Create PDF from HTML content using iframe and html2canvas
        const iframe = document.createElement('iframe');
        iframe.style.position = 'absolute';
        iframe.style.width = '1400px';
        iframe.style.height = '2000px';
        iframe.style.left = '-9999px';
        document.body.appendChild(iframe);
        
        const doc = iframe.contentWindow.document;
        doc.open();
        doc.write(htmlContent);
        doc.close();

        // Wait rendering
        await new Promise(resolve => setTimeout(resolve, 500));

        const bodyHeight = doc.body.scrollHeight;
        iframe.style.height = `${bodyHeight + 50}px`;

        const canvas = await html2canvas(doc.body, {
            scale: 2,
            useCORS: true,
            windowWidth: 1400,
            logging: false
        });

        document.body.removeChild(iframe);

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        let heightLeft = pdfHeight;
        let position = 0;
        const pageHeight = pdf.internal.pageSize.getHeight();

        // Add first page
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;

        // Add subsequent pages if content overflows
        while (heightLeft > 0) {
            position -= pageHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
            heightLeft -= pageHeight;
        }

        pdf.save(`${filename}.pdf`);

        return { success: true };
    } catch (error) {
        console.error('Error generating PDF:', error);
        return { success: false, error: error.message };
    }
};
