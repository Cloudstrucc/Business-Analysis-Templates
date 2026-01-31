const puppeteer = require('puppeteer');

/**
 * Generate PDF from submission data
 */
async function generateSubmissionPdf(submission, invite, form, responses) {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  // Build HTML content
  const html = buildSubmissionHtml(submission, invite, form, responses);
  
  await page.setContent(html, { waitUntil: 'networkidle0' });
  
  const pdfBuffer = await page.pdf({
    format: 'A4',
    margin: {
      top: '20mm',
      right: '15mm',
      bottom: '20mm',
      left: '15mm'
    },
    printBackground: true
  });
  
  await browser.close();
  
  return pdfBuffer;
}

/**
 * Build styled HTML for the submission
 */
function buildSubmissionHtml(submission, invite, form, responses) {
  const submittedDate = new Date(submission.submitted_at || submission.updated_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  // Group responses by section
  const sections = groupResponsesBySection(responses);
  
  // Build sections HTML
  let sectionsHtml = '';
  sections.forEach((section, index) => {
    sectionsHtml += `
      <div class="section">
        <div class="section-header">
          <span class="section-number">${index + 1}</span>
          <span class="section-title">${section.title}</span>
        </div>
        <div class="section-content">
          ${section.fields.map(field => `
            <div class="field">
              <div class="field-label">${field.label}</div>
              <div class="field-value">${formatFieldValue(field.value)}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  });

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${form.title} - ${invite.client_name}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      font-size: 11pt;
      line-height: 1.5;
      color: #333;
      padding: 0;
    }
    
    .header {
      background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
      color: white;
      padding: 30px;
      margin: -20mm -15mm 20px -15mm;
      padding: 30px calc(15mm + 10px);
    }
    
    .header h1 {
      font-size: 22pt;
      margin-bottom: 5px;
      font-weight: 600;
    }
    
    .header .subtitle {
      font-size: 12pt;
      opacity: 0.9;
    }
    
    .meta-info {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
      background: #f8f9fa;
      padding: 15px 20px;
      border-radius: 8px;
      margin-bottom: 25px;
      border-left: 4px solid #3498db;
    }
    
    .meta-item {
      flex: 1;
      min-width: 150px;
    }
    
    .meta-label {
      font-size: 9pt;
      text-transform: uppercase;
      color: #666;
      letter-spacing: 0.5px;
      margin-bottom: 3px;
    }
    
    .meta-value {
      font-size: 11pt;
      font-weight: 600;
      color: #2c3e50;
    }
    
    .section {
      margin-bottom: 25px;
      page-break-inside: avoid;
    }
    
    .section-header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 15px;
      padding-bottom: 8px;
      border-bottom: 2px solid #3498db;
    }
    
    .section-number {
      background: #3498db;
      color: white;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12pt;
      font-weight: 600;
    }
    
    .section-title {
      font-size: 14pt;
      font-weight: 600;
      color: #2c3e50;
    }
    
    .section-content {
      padding-left: 38px;
    }
    
    .field {
      margin-bottom: 12px;
      page-break-inside: avoid;
    }
    
    .field-label {
      font-size: 9pt;
      text-transform: uppercase;
      color: #666;
      letter-spacing: 0.3px;
      margin-bottom: 3px;
    }
    
    .field-value {
      font-size: 11pt;
      color: #333;
      background: #fafafa;
      padding: 8px 12px;
      border-radius: 4px;
      border-left: 3px solid #e0e0e0;
    }
    
    .field-value.empty {
      color: #999;
      font-style: italic;
    }
    
    .field-value ul {
      margin: 0;
      padding-left: 20px;
    }
    
    .field-value li {
      margin-bottom: 3px;
    }
    
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #ddd;
      font-size: 9pt;
      color: #666;
      text-align: center;
    }
    
    .status-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 10pt;
      font-weight: 600;
    }
    
    .status-submitted {
      background: #d4edda;
      color: #155724;
    }
    
    .status-in_progress {
      background: #fff3cd;
      color: #856404;
    }
    
    @media print {
      .section {
        page-break-inside: avoid;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>${form.title}</h1>
    <div class="subtitle">Questionnaire Submission</div>
  </div>
  
  <div class="meta-info">
    <div class="meta-item">
      <div class="meta-label">Client</div>
      <div class="meta-value">${invite.client_name}</div>
    </div>
    ${invite.client_company ? `
    <div class="meta-item">
      <div class="meta-label">Company</div>
      <div class="meta-value">${invite.client_company}</div>
    </div>
    ` : ''}
    <div class="meta-item">
      <div class="meta-label">Email</div>
      <div class="meta-value">${invite.client_email}</div>
    </div>
    <div class="meta-item">
      <div class="meta-label">Status</div>
      <div class="meta-value">
        <span class="status-badge status-${submission.status}">${submission.status === 'submitted' ? 'Submitted' : 'In Progress'}</span>
      </div>
    </div>
    <div class="meta-item">
      <div class="meta-label">Date</div>
      <div class="meta-value">${submittedDate}</div>
    </div>
    <div class="meta-item">
      <div class="meta-label">Progress</div>
      <div class="meta-value">${submission.progress || 0}%</div>
    </div>
  </div>
  
  ${sectionsHtml}
  
  <div class="footer">
    Generated on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
    &nbsp;|&nbsp; Cloudstrucc Inc. BA Forms
  </div>
</body>
</html>
  `;
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
      // Convert first two parts to section name
      sectionName = parts.slice(0, 2)
        .join(' ')
        .replace(/_/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());
    }
    
    // Create section if doesn't exist
    if (!sectionMap[sectionName]) {
      sectionMap[sectionName] = { title: sectionName, fields: [] };
      sections.push(sectionMap[sectionName]);
    }
    
    // Format label from key
    const label = key
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
    
    sectionMap[sectionName].fields.push({ label, value });
  });
  
  return sections;
}

/**
 * Format field value for display
 */
function formatFieldValue(value) {
  if (value === null || value === undefined || value === '') {
    return '<span class="empty">No response</span>';
  }
  
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return '<span class="empty">No selections</span>';
    }
    return '<ul>' + value.map(v => `<li>${escapeHtml(v)}</li>`).join('') + '</ul>';
  }
  
  // Handle long text with line breaks
  if (typeof value === 'string' && value.includes('\n')) {
    return escapeHtml(value).replace(/\n/g, '<br>');
  }
  
  return escapeHtml(String(value));
}

/**
 * Escape HTML entities
 */
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

module.exports = { generateSubmissionPdf };