const { marked } = require('marked');
const fs = require('fs');
const path = require('path');

/**
 * Parse markdown business analysis templates and convert to form structure
 */
class MarkdownFormParser {
  constructor() {
    this.forms = new Map();
  }

  /**
   * Load a markdown file and parse it into a form structure
   */
  parseFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const filename = path.basename(filePath, '.md');
    return this.parse(content, filename);
  }

  /**
   * Parse markdown content into a form structure
   */
  parse(markdown, formId) {
    const lines = markdown.split('\n');
    const form = {
      id: formId,
      title: '',
      description: '',
      header: {
        fields: []
      },
      sections: [],
      glossary: [],
      appendix: []
    };

    let currentSection = null;
    let currentSubsection = null;
    let currentTable = null;
    let inTable = false;
    let tableHeaders = [];
    let inCodeBlock = false;
    let inGlossary = false;
    let inAppendix = false;
    let inSignOff = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();

      // Skip code blocks
      if (trimmed.startsWith('```')) {
        inCodeBlock = !inCodeBlock;
        continue;
      }
      if (inCodeBlock) continue;

      // Main title (H1)
      if (trimmed.startsWith('# ') && !trimmed.startsWith('## ')) {
        form.title = trimmed.substring(2).trim();
        continue;
      }

      // Header fields (Client Name, etc.)
      if (trimmed.startsWith('**Client Name:**') || 
          trimmed.startsWith('**Project Start Date:**') ||
          trimmed.startsWith('**Target Go-Live Date:**') ||
          trimmed.startsWith('**Prepared By:**')) {
        const fieldMatch = trimmed.match(/\*\*(.+?):\*\*/);
        if (fieldMatch) {
          form.header.fields.push({
            name: fieldMatch[1].toLowerCase().replace(/\s+/g, '_'),
            label: fieldMatch[1],
            type: fieldMatch[1].toLowerCase().includes('date') ? 'date' : 'text',
            required: true
          });
        }
        continue;
      }

      // Check for special sections
      if (trimmed.match(/^##\s*\d*\.?\s*(Sign-Off|Approval)/i)) {
        inSignOff = true;
        inGlossary = false;
        inAppendix = false;
        currentSection = {
          id: 'sign_off',
          title: 'Sign-Off & Approval',
          type: 'signoff',
          subsections: [],
          fields: []
        };
        form.sections.push(currentSection);
        continue;
      }

      if (trimmed.match(/^##\s*(Glossary|Appendix)/i)) {
        if (trimmed.includes('Glossary')) {
          inGlossary = true;
          inAppendix = false;
        } else {
          inAppendix = true;
          inGlossary = false;
        }
        inSignOff = false;
        continue;
      }

      // Section header (H2)
      if (trimmed.startsWith('## ') && !inGlossary && !inAppendix) {
        inSignOff = false;
        const match = trimmed.match(/^##\s*(\d+)?\.\s*(.+)$/);
        if (match) {
          currentSection = {
            id: `section_${match[1] || form.sections.length + 1}`,
            number: match[1] || form.sections.length + 1,
            title: match[2].trim(),
            description: '',
            subsections: [],
            fields: [],
            tables: []
          };
          form.sections.push(currentSection);
          currentSubsection = null;
        }
        continue;
      }

      // Subsection header (H3)
      if (trimmed.startsWith('### ') && currentSection && !inGlossary && !inAppendix) {
        const title = trimmed.substring(4).trim();
        currentSubsection = {
          id: `${currentSection.id}_${title.toLowerCase().replace(/[^a-z0-9]+/g, '_')}`,
          title: title,
          description: '',
          fields: [],
          tables: []
        };
        currentSection.subsections.push(currentSubsection);
        continue;
      }

      // Table detection
      if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
        if (!inTable) {
          inTable = true;
          // Parse header row
          tableHeaders = trimmed.split('|')
            .filter(h => h.trim())
            .map(h => h.trim());
          continue;
        }
        
        // Skip separator row
        if (trimmed.match(/^\|[\s\-:|]+\|$/)) {
          continue;
        }

        // Parse data row
        const cells = trimmed.split('|')
          .filter(c => c.trim() !== '')
          .map(c => c.trim());

        if (cells.length > 0 && tableHeaders.length > 0) {
          const tableRow = this.parseTableRow(tableHeaders, cells);
          if (tableRow) {
            const target = currentSubsection || currentSection;
            if (target) {
              if (!target.tables) target.tables = [];
              
              // Find or create table
              let table = target.tables[target.tables.length - 1];
              if (!table || table.finalized) {
                table = {
                  headers: tableHeaders,
                  rows: [],
                  fields: []
                };
                target.tables.push(table);
              }
              table.rows.push(tableRow);
              
              // Extract fields from table
              const fields = this.extractFieldsFromRow(tableHeaders, cells, currentSection?.id, currentSubsection?.id);
              fields.forEach(f => table.fields.push(f));
            }
          }
        }
        continue;
      } else if (inTable) {
        // End of table
        inTable = false;
        const target = currentSubsection || currentSection;
        if (target && target.tables && target.tables.length > 0) {
          target.tables[target.tables.length - 1].finalized = true;
        }
        tableHeaders = [];
      }

      // Description text
      if (trimmed && !trimmed.startsWith('#') && !trimmed.startsWith('|') && !trimmed.startsWith('---')) {
        if (currentSubsection) {
          if (currentSubsection.description) {
            currentSubsection.description += ' ' + trimmed;
          } else {
            currentSubsection.description = trimmed;
          }
        } else if (currentSection) {
          if (!currentSection.description) {
            currentSection.description = trimmed;
          }
        }
      }
    }

    return form;
  }

  /**
   * Parse a table row into structured data
   */
  parseTableRow(headers, cells) {
    const row = {};
    headers.forEach((header, index) => {
      row[header.toLowerCase().replace(/[^a-z0-9]+/g, '_')] = cells[index] || '';
    });
    return row;
  }

  /**
   * Extract form fields from table row
   */
  extractFieldsFromRow(headers, cells, sectionId, subsectionId) {
    const fields = [];
    const lowerHeaders = headers.map(h => h.toLowerCase());
    
    // Check for decision columns
    const decisionIdx = lowerHeaders.findIndex(h => 
      h.includes('decision') || h.includes('your choice') || h.includes('enable') || h.includes('include')
    );
    
    const notesIdx = lowerHeaders.findIndex(h => h.includes('notes') || h.includes('your answer'));
    const featureIdx = lowerHeaders.findIndex(h => 
      h.includes('feature') || h.includes('setting') || h.includes('question') || 
      h.includes('metric') || h.includes('element') || h.includes('requirement') ||
      h.includes('type') || h.includes('capability') || h.includes('role') ||
      h.includes('provider') || h.includes('tool') || h.includes('test') ||
      h.includes('channel') || h.includes('queue') || h.includes('sla')
    );

    // Get the feature/question name
    let fieldLabel = cells[featureIdx] || cells[0] || '';
    fieldLabel = fieldLabel.replace(/\*\*/g, '').trim();
    
    // Skip empty or placeholder rows
    if (!fieldLabel || fieldLabel.startsWith('_') || fieldLabel === '|') {
      return fields;
    }

    const fieldId = `${sectionId || 'form'}_${subsectionId || 'main'}_${fieldLabel.toLowerCase().replace(/[^a-z0-9]+/g, '_')}`.substring(0, 80);

    // Determine field type based on decision column content
    if (decisionIdx >= 0) {
      const decisionContent = cells[decisionIdx] || '';
      
      // Checkbox options (☐ patterns)
      if (decisionContent.includes('☐')) {
        const options = decisionContent.match(/☐\s*([^☐]+)/g);
        if (options) {
          const cleanOptions = options.map(opt => 
            opt.replace(/☐\s*/, '').trim()
          ).filter(o => o);
          
          if (cleanOptions.length > 0) {
            // Check if this is a binary choice (Yes/No, OOB/CUSTOMIZE, Enable/Disable, etc.)
            const isBinaryChoice = this.isBinaryChoice(cleanOptions);
            
            fields.push({
              id: fieldId,
              name: fieldId,
              label: fieldLabel,
              type: isBinaryChoice ? 'radio_group' : 'checkbox_group',
              options: cleanOptions,
              section: sectionId,
              subsection: subsectionId
            });
          }
        }
      }
    }

    // Notes/Answer field
    if (notesIdx >= 0) {
      const notesFieldId = `${fieldId}_notes`;
      fields.push({
        id: notesFieldId,
        name: notesFieldId,
        label: `${fieldLabel} - Notes`,
        type: 'textarea',
        placeholder: 'Enter additional details...',
        section: sectionId,
        subsection: subsectionId
      });
    }

    // Questions with Your Answer column
    if (lowerHeaders.includes('your_answer') || lowerHeaders.includes('your answer')) {
      const answerIdx = lowerHeaders.findIndex(h => h.includes('your_answer') || h.includes('your answer'));
      const answerContent = cells[answerIdx] || '';
      
      if (answerContent.includes('☐')) {
        const options = answerContent.match(/☐\s*([^☐]+)/g);
        if (options) {
          const cleanOptions = options.map(opt => 
            opt.replace(/☐\s*/, '').trim()
          ).filter(o => o);
          
          if (cleanOptions.length > 0) {
            // Check if this is a binary choice
            const isBinaryChoice = this.isBinaryChoice(cleanOptions);
            
            fields.push({
              id: fieldId,
              name: fieldId,
              label: fieldLabel,
              type: isBinaryChoice ? 'radio_group' : 'checkbox_group',
              options: cleanOptions,
              section: sectionId,
              subsection: subsectionId
            });
          }
        }
      } else if (!fields.some(f => f.id === fieldId)) {
        fields.push({
          id: fieldId,
          name: fieldId,
          label: fieldLabel,
          type: 'textarea',
          placeholder: 'Enter your answer...',
          section: sectionId,
          subsection: subsectionId
        });
      }
    }

    return fields;
  }

  /**
   * Check if options represent a binary/mutually exclusive choice
   */
  isBinaryChoice(options) {
    if (options.length !== 2) return false;
    
    const normalized = options.map(o => o.toLowerCase().trim());
    
    // Common binary patterns
    const binaryPatterns = [
      ['yes', 'no'],
      ['oob', 'customize'],
      ['oob', 'disable'],
      ['enable', 'disable'],
      ['enabled', 'disabled'],
      ['on', 'off'],
      ['true', 'false'],
      ['include', 'exclude'],
      ['active', 'inactive'],
      ['required', 'optional'],
      ['standard', 'custom'],
      ['default', 'custom'],
      ['use', 'skip'],
      ['accept', 'reject'],
      ['approve', 'reject'],
      ['allow', 'deny'],
      ['show', 'hide'],
      ['visible', 'hidden']
    ];
    
    for (const pattern of binaryPatterns) {
      if ((normalized.includes(pattern[0]) && normalized.includes(pattern[1])) ||
          (normalized[0] === pattern[0] && normalized[1] === pattern[1]) ||
          (normalized[0] === pattern[1] && normalized[1] === pattern[0])) {
        return true;
      }
    }
    
    // Also check for N/A patterns
    if (normalized.some(o => o === 'n/a' || o === 'na' || o === 'not applicable')) {
      return true;
    }
    
    return false;
  }

  /**
   * Generate HTML form from parsed structure using Bootstrap 5 Accordion
   */
  generateFormHtml(formStructure) {
    let html = '';
    
    formStructure.sections.forEach((section, sectionIndex) => {
      // Skip sign-off section - it will be handled separately in the template
      if (section.type === 'signoff') {
        html += this.renderSignOffSection(section, sectionIndex);
        return;
      }
      
      const sectionId = `section-${(section.id || 'sec-' + (sectionIndex + 1)).replace(/[^a-z0-9-]/gi, '-')}`;
      const collapseId = `collapse-${(section.id || 'sec-' + (sectionIndex + 1)).replace(/[^a-z0-9-]/gi, '-')}`;
      const headingId = `heading-${(section.id || 'sec-' + (sectionIndex + 1)).replace(/[^a-z0-9-]/gi, '-')}`;
      const isFirst = sectionIndex === 0;
      const icon = this.getIconForSection(section.title);
      
      html += `
        <div class="accordion-item" id="${sectionId}">
          <h2 class="accordion-header" id="${headingId}">
            <button class="accordion-button${isFirst ? '' : ' collapsed'}" type="button" data-bs-toggle="collapse" data-bs-target="#${collapseId}" aria-expanded="${isFirst ? 'true' : 'false'}" aria-controls="${collapseId}">
              <span class="section-number me-3"><i class="bi ${icon}"></i></span>
              <span class="section-title-text">${section.title}</span>
            </button>
          </h2>
          <div id="${collapseId}" class="accordion-collapse collapse${isFirst ? ' show' : ''}" aria-labelledby="${headingId}" data-bs-parent="#questionnaireAccordion">
            <div class="accordion-body">
              ${section.description ? `<p class="section-description text-muted mb-4">${this.cleanMarkdown(section.description)}</p>` : ''}
      `;

      // Render subsections
      section.subsections.forEach(subsection => {
        html += `
          <div class="subsection" data-subsection="${subsection.id}">
            <h3 class="subsection-title">${subsection.title}</h3>
            ${subsection.description ? `<p class="subsection-description text-muted small">${this.cleanMarkdown(subsection.description)}</p>` : ''}
        `;

        // Render tables as form groups
        if (subsection.tables) {
          subsection.tables.forEach(table => {
            html += this.renderTableAsForm(table);
          });
        }

        html += '</div>';
      });

      // Section-level tables
      if (section.tables) {
        section.tables.forEach(table => {
          html += this.renderTableAsForm(table);
        });
      }

      html += `
            </div>
          </div>
        </div>
      `;
    });

    return html;
  }

  /**
   * Render a proper sign-off section with approval fields
   */
  renderSignOffSection(section, sectionIndex) {
    const sectionId = 'section-sign-off';
    const collapseId = 'collapse-sign-off';
    const headingId = 'heading-sign-off';
    
    return `
      <div class="accordion-item" id="${sectionId}">
        <h2 class="accordion-header" id="${headingId}">
          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#${collapseId}" aria-expanded="false" aria-controls="${collapseId}">
            <span class="section-number me-3"><i class="bi bi-pen"></i></span>
            <span class="section-title-text">Sign-Off & Approval</span>
          </button>
        </h2>
        <div id="${collapseId}" class="accordion-collapse collapse" aria-labelledby="${headingId}" data-bs-parent="#questionnaireAccordion">
          <div class="accordion-body">
            
            <!-- Implementation Checklist -->
            <div class="subsection" data-subsection="implementation-checklist">
              <h3 class="subsection-title">Implementation Checklist Completion</h3>
              <p class="text-muted small mb-3">Please confirm you have reviewed and completed all applicable sections of this questionnaire.</p>
              
              <div class="mb-4 form-field">
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" name="signoff_checklist_complete" id="signoff_checklist_complete" value="yes">
                  <label class="form-check-label" for="signoff_checklist_complete">
                    <strong>I confirm that I have completed all applicable sections of this implementation questionnaire</strong>
                  </label>
                </div>
              </div>
              
              <div class="mb-4 form-field">
                <label class="form-label fw-semibold" for="signoff_completion_notes">Additional Notes or Exceptions</label>
                <textarea class="form-control" id="signoff_completion_notes" name="signoff_completion_notes" rows="2" placeholder="Note any sections that were not applicable or require follow-up..."></textarea>
              </div>
            </div>
            
            <!-- Business Owner Approval -->
            <div class="subsection" data-subsection="business-owner-approval">
              <h3 class="subsection-title">Business Owner / Project Sponsor Approval</h3>
              
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label fw-semibold" for="signoff_business_owner_name">Full Name <span class="text-danger">*</span></label>
                  <input type="text" class="form-control" id="signoff_business_owner_name" name="signoff_business_owner_name" placeholder="Enter full name" required>
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-semibold" for="signoff_business_owner_title">Title / Role</label>
                  <input type="text" class="form-control" id="signoff_business_owner_title" name="signoff_business_owner_title" placeholder="e.g., Project Sponsor, Business Owner">
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-semibold" for="signoff_business_owner_email">Email</label>
                  <input type="email" class="form-control" id="signoff_business_owner_email" name="signoff_business_owner_email" placeholder="email@company.com">
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-semibold" for="signoff_business_owner_date">Date</label>
                  <input type="date" class="form-control" id="signoff_business_owner_date" name="signoff_business_owner_date">
                </div>
                <div class="col-12">
                  <div class="form-check">
                    <input class="form-check-input" type="checkbox" name="signoff_business_owner_approve" id="signoff_business_owner_approve" value="approved">
                    <label class="form-check-label" for="signoff_business_owner_approve">
                      <strong>I Approve</strong> - I have reviewed and approve the requirements captured in this document
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- IT/Technical Lead Approval -->
            <div class="subsection" data-subsection="technical-lead-approval">
              <h3 class="subsection-title">IT / Technical Lead Approval</h3>
              
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label fw-semibold" for="signoff_tech_lead_name">Full Name</label>
                  <input type="text" class="form-control" id="signoff_tech_lead_name" name="signoff_tech_lead_name" placeholder="Enter full name">
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-semibold" for="signoff_tech_lead_title">Title / Role</label>
                  <input type="text" class="form-control" id="signoff_tech_lead_title" name="signoff_tech_lead_title" placeholder="e.g., IT Manager, Technical Lead">
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-semibold" for="signoff_tech_lead_email">Email</label>
                  <input type="email" class="form-control" id="signoff_tech_lead_email" name="signoff_tech_lead_email" placeholder="email@company.com">
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-semibold" for="signoff_tech_lead_date">Date</label>
                  <input type="date" class="form-control" id="signoff_tech_lead_date" name="signoff_tech_lead_date">
                </div>
                <div class="col-12">
                  <div class="form-check">
                    <input class="form-check-input" type="checkbox" name="signoff_tech_lead_approve" id="signoff_tech_lead_approve" value="approved">
                    <label class="form-check-label" for="signoff_tech_lead_approve">
                      <strong>I Approve</strong> - I have reviewed and approve the technical requirements in this document
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Implementation Partner -->
            <div class="subsection" data-subsection="partner-approval">
              <h3 class="subsection-title">Implementation Partner (Cloudstrucc Inc.)</h3>
              
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label fw-semibold" for="signoff_partner_name">Consultant Name</label>
                  <input type="text" class="form-control" id="signoff_partner_name" name="signoff_partner_name" placeholder="Enter consultant name">
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-semibold" for="signoff_partner_date">Date</label>
                  <input type="date" class="form-control" id="signoff_partner_date" name="signoff_partner_date">
                </div>
                <div class="col-12">
                  <div class="form-check">
                    <input class="form-check-input" type="checkbox" name="signoff_partner_acknowledge" id="signoff_partner_acknowledge" value="acknowledged">
                    <label class="form-check-label" for="signoff_partner_acknowledge">
                      <strong>Acknowledged</strong> - Requirements have been documented and reviewed with the client
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="alert alert-info mt-4">
              <i class="bi bi-info-circle me-2"></i>
              <em>Document prepared by Cloudstrucc Inc. For questions or assistance, contact your assigned consultant.</em>
            </div>
            
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Get appropriate icon for section based on title
   */
  getIconForSection(title) {
    const titleLower = title.toLowerCase();
    if (titleLower.includes('project') || titleLower.includes('information') || titleLower.includes('overview')) return 'bi-building';
    if (titleLower.includes('sign') || titleLower.includes('approval')) return 'bi-pen';
    if (titleLower.includes('case') || titleLower.includes('ticket')) return 'bi-ticket-detailed';
    if (titleLower.includes('queue') || titleLower.includes('routing')) return 'bi-diagram-3';
    if (titleLower.includes('sla') || titleLower.includes('entitlement')) return 'bi-clock-history';
    if (titleLower.includes('knowledge') || titleLower.includes('article')) return 'bi-book';
    if (titleLower.includes('email')) return 'bi-envelope';
    if (titleLower.includes('chat') || titleLower.includes('message') || titleLower.includes('channel')) return 'bi-chat-dots';
    if (titleLower.includes('voice') || titleLower.includes('phone') || titleLower.includes('call')) return 'bi-telephone';
    if (titleLower.includes('report') || titleLower.includes('analytic') || titleLower.includes('dashboard')) return 'bi-graph-up';
    if (titleLower.includes('security') || titleLower.includes('role') || titleLower.includes('permission')) return 'bi-shield-lock';
    if (titleLower.includes('integrat') || titleLower.includes('connect')) return 'bi-link-45deg';
    if (titleLower.includes('workflow') || titleLower.includes('automat') || titleLower.includes('flow')) return 'bi-gear';
    if (titleLower.includes('user') || titleLower.includes('agent') || titleLower.includes('team')) return 'bi-people';
    if (titleLower.includes('train') || titleLower.includes('document') || titleLower.includes('guide')) return 'bi-mortarboard';
    if (titleLower.includes('custom') || titleLower.includes('config')) return 'bi-sliders';
    if (titleLower.includes('data') || titleLower.includes('migrat')) return 'bi-database';
    if (titleLower.includes('test') || titleLower.includes('quality')) return 'bi-check2-square';
    if (titleLower.includes('deploy') || titleLower.includes('release')) return 'bi-rocket-takeoff';
    if (titleLower.includes('portal') || titleLower.includes('self-service')) return 'bi-window';
    if (titleLower.includes('mobile') || titleLower.includes('app')) return 'bi-phone';
    if (titleLower.includes('ai') || titleLower.includes('copilot') || titleLower.includes('intelligence')) return 'bi-robot';
    if (titleLower.includes('feedback') || titleLower.includes('survey')) return 'bi-star';
    if (titleLower.includes('schedule') || titleLower.includes('calendar')) return 'bi-calendar-event';
    if (titleLower.includes('resource') || titleLower.includes('capacity')) return 'bi-boxes';
    return 'bi-list-check';
  }

  /**
   * Render a table as form fields
   */
  renderTableAsForm(table) {
    if (!table.fields || table.fields.length === 0) {
      return '';
    }

    let html = '<div class="form-table-group">';
    
    table.fields.forEach(field => {
      html += this.renderField(field);
    });

    html += '</div>';
    return html;
  }

  /**
   * Render a single form field
   */
  renderField(field) {
    const id = field.id;
    const name = field.name;
    const label = field.label;

    switch (field.type) {
      case 'checkbox_group':
        return `
          <div class="mb-4 form-field" data-field="${id}">
            <label class="form-label fw-semibold">${label}</label>
            <div class="checkbox-group">
              ${field.options.map((opt, idx) => `
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="checkbox" 
                    name="${name}" value="${opt}" id="${id}_${idx}">
                  <label class="form-check-label" for="${id}_${idx}">${opt}</label>
                </div>
              `).join('')}
            </div>
          </div>
        `;

      case 'radio_group':
        // Check if this is an enable/disable type field
        const isEnableDisableField = field.options.some(opt => 
          ['enable', 'disable', 'n/a', 'na', 'enabled', 'disabled', 'oob', 'customize', 'yes', 'no'].includes(opt.toLowerCase().trim())
        );
        const enableValues = field.options.filter(opt => 
          ['enable', 'enabled', 'oob', 'customize', 'yes', 'use', 'include', 'active', 'on', 'true', 'show', 'visible'].includes(opt.toLowerCase().trim())
        ).map(o => o);
        const disableValues = field.options.filter(opt => 
          ['disable', 'disabled', 'n/a', 'na', 'no', 'skip', 'exclude', 'inactive', 'off', 'false', 'hide', 'hidden', 'not applicable'].includes(opt.toLowerCase().trim())
        ).map(o => o);
        
        return `
          <div class="mb-4 form-field" data-field="${id}" ${isEnableDisableField ? `data-toggle-field="true" data-enable-values="${enableValues.join(',')}" data-disable-values="${disableValues.join(',')}"` : ''}>
            <label class="form-label fw-semibold">${label}</label>
            <div class="radio-group">
              ${field.options.map((opt, idx) => {
                const isDisableOption = ['disable', 'disabled', 'n/a', 'na', 'no', 'skip', 'exclude', 'inactive', 'off', 'false', 'hide', 'hidden', 'not applicable'].includes(opt.toLowerCase().trim());
                return `
                <div class="form-check form-check-inline">
                  <input class="form-check-input${isEnableDisableField ? ' toggle-trigger' : ''}" type="radio" 
                    name="${name}" value="${opt}" id="${id}_${idx}"
                    ${isEnableDisableField ? `data-action="${isDisableOption ? 'disable' : 'enable'}"` : ''}>
                  <label class="form-check-label" for="${id}_${idx}">${opt}</label>
                </div>
              `}).join('')}
            </div>
          </div>
        `;

      case 'textarea':
        return `
          <div class="mb-4 form-field" data-field="${id}">
            <label class="form-label fw-semibold" for="${id}">${label}</label>
            <textarea class="form-control" id="${id}" name="${name}" 
              rows="3" placeholder="${field.placeholder || ''}"></textarea>
          </div>
        `;

      case 'text':
      default:
        return `
          <div class="mb-4 form-field" data-field="${id}">
            <label class="form-label fw-semibold" for="${id}">${label}</label>
            <input type="text" class="form-control" id="${id}" name="${name}" 
              placeholder="${field.placeholder || ''}">
          </div>
        `;
    }
  }

  /**
   * Clean markdown formatting from text
   */
  cleanMarkdown(text) {
    if (!text) return '';
    return text
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank">$1</a>')
      .replace(/📖/g, '📖')
      .trim();
  }
}

module.exports = MarkdownFormParser;
