const PDFDocument = require('pdfkit');

/**
 * Generate PDF from submission data
 */
async function generateSubmissionPdf(submission, invite, form, responses) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 50, bottom: 50, left: 50, right: 50 },
        bufferPages: true
      });

      const chunks = [];
      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Colors
      const colors = {
        primary: '#2c3e50',
        accent: '#3498db',
        text: '#333333',
        muted: '#666666',
        light: '#f8f9fa',
        border: '#e0e0e0',
        success: '#27ae60',
        warning: '#f39c12'
      };

      const pageWidth = doc.page.width - 100; // Account for margins

      // === HEADER ===
      doc.rect(0, 0, doc.page.width, 120).fill(colors.primary);
      
      doc.fillColor('#ffffff')
         .fontSize(24)
         .font('Helvetica-Bold')
         .text(form.title, 50, 40, { width: pageWidth });
      
      doc.fontSize(12)
         .font('Helvetica')
         .fillColor('rgba(255,255,255,0.9)')
         .text('Questionnaire Submission', 50, 75);

      // === META INFO BOX ===
      const metaY = 140;
      doc.rect(50, metaY, pageWidth, 80)
         .fillAndStroke(colors.light, colors.border);
      
      // Left accent bar
      doc.rect(50, metaY, 4, 80).fill(colors.accent);

      // Meta info columns
      const metaItems = [
        { label: 'Client', value: invite.client_name },
        { label: 'Company', value: invite.client_company || 'N/A' },
        { label: 'Email', value: invite.client_email },
        { label: 'Status', value: submission.status === 'submitted' ? 'Submitted' : 'In Progress' },
        { label: 'Progress', value: `${submission.progress || 0}%` },
        { label: 'Date', value: formatDate(submission.submitted_at || submission.updated_at) }
      ];

      const colWidth = (pageWidth - 20) / 3;
      metaItems.forEach((item, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        const x = 60 + (col * colWidth);
        const y = metaY + 12 + (row * 35);

        doc.fontSize(8)
           .font('Helvetica')
           .fillColor(colors.muted)
           .text(item.label.toUpperCase(), x, y);
        
        doc.fontSize(10)
           .font('Helvetica-Bold')
           .fillColor(colors.primary)
           .text(item.value, x, y + 12, { width: colWidth - 10 });
      });

      // === SECTIONS ===
      let currentY = metaY + 100;
      const sections = groupResponsesBySection(responses);

      sections.forEach((section, sectionIndex) => {
        // Check if we need a new page
        if (currentY > doc.page.height - 150) {
          doc.addPage();
          currentY = 50;
        }

        // Section header
        currentY += 15;
        
        // Section number circle
        doc.circle(65, currentY + 8, 12).fill(colors.accent);
        doc.fillColor('#ffffff')
           .fontSize(10)
           .font('Helvetica-Bold')
           .text(String(sectionIndex + 1), 60, currentY + 4, { width: 10, align: 'center' });

        // Section title
        doc.fillColor(colors.primary)
           .fontSize(14)
           .font('Helvetica-Bold')
           .text(section.title, 85, currentY, { width: pageWidth - 35 });

        // Section underline
        currentY += 25;
        doc.moveTo(50, currentY).lineTo(50 + pageWidth, currentY).strokeColor(colors.accent).lineWidth(2).stroke();
        currentY += 15;

        // Fields
        section.fields.forEach(field => {
          // Check if we need a new page
          const estimatedHeight = estimateFieldHeight(doc, field, pageWidth - 40);
          if (currentY + estimatedHeight > doc.page.height - 70) {
            doc.addPage();
            currentY = 50;
          }

          // Field label
          doc.fontSize(8)
             .font('Helvetica')
             .fillColor(colors.muted)
             .text(field.label.toUpperCase(), 60, currentY, { width: pageWidth - 40 });
          
          currentY += 12;

          // Field value box
          const valueText = formatFieldValueForPdf(field.value);
          const textHeight = doc.heightOfString(valueText, { width: pageWidth - 60 });
          const boxHeight = Math.max(textHeight + 16, 30);

          // Value background
          doc.rect(60, currentY, pageWidth - 20, boxHeight)
             .fillAndStroke('#fafafa', colors.border);
          
          // Left accent on value box
          doc.rect(60, currentY, 3, boxHeight).fill('#e0e0e0');

          // Value text
          doc.fontSize(10)
             .font('Helvetica')
             .fillColor(field.value ? colors.text : colors.muted)
             .text(valueText, 72, currentY + 8, { 
               width: pageWidth - 50,
               lineGap: 3
             });

          currentY += boxHeight + 12;
        });

        currentY += 10;
      });

      // === FOOTER ===
      const footerY = doc.page.height - 40;
      doc.fontSize(8)
         .font('Helvetica')
         .fillColor(colors.muted)
         .text(
           `Generated on ${formatDate(new Date())} | Cloudstrucc Inc. BA Forms`,
           50, footerY,
           { width: pageWidth, align: 'center' }
         );

      // Add page numbers
      const pages = doc.bufferedPageRange();
      for (let i = 0; i < pages.count; i++) {
        doc.switchToPage(i);
        doc.fontSize(8)
           .font('Helvetica')
           .fillColor(colors.muted)
           .text(
             `Page ${i + 1} of ${pages.count}`,
             50, doc.page.height - 40,
             { width: pageWidth, align: 'right' }
           );
      }

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Group flat responses into sections
 */
function groupResponsesBySection(responses) {
  const sectionMap = {};
  const sections = [];

  Object.entries(responses).forEach(([key, value]) => {
    // Skip empty values
    if (value === null || value === undefined || value === '' ||
        (Array.isArray(value) && value.length === 0)) {
      return;
    }

    // Determine section name from key
    const parts = key.split('_');
    let sectionName;

    if (parts[0] === 'header') {
      sectionName = 'Project Information';
    } else if (parts[0] === 'signoff') {
      sectionName = 'Sign-Off';
    } else {
      sectionName = parts.slice(0, 2)
        .join(' ')
        .replace(/_/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());
    }

    if (!sectionMap[sectionName]) {
      sectionMap[sectionName] = { title: sectionName, fields: [] };
      sections.push(sectionMap[sectionName]);
    }

    const label = key
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());

    sectionMap[sectionName].fields.push({ label, value });
  });

  return sections;
}

/**
 * Format field value for PDF display
 */
function formatFieldValueForPdf(value) {
  if (value === null || value === undefined || value === '') {
    return 'No response';
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return 'No selections';
    }
    return value.map(v => `• ${v}`).join('\n');
  }

  return String(value);
}

/**
 * Estimate field height for page break calculation
 */
function estimateFieldHeight(doc, field, width) {
  const valueText = formatFieldValueForPdf(field.value);
  const textHeight = doc.heightOfString(valueText, { width: width - 20 });
  return 12 + Math.max(textHeight + 16, 30) + 12; // label + value box + spacing
}

/**
 * Format date for display
 */
function formatDate(dateInput) {
  const date = new Date(dateInput);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

module.exports = { generateSubmissionPdf };