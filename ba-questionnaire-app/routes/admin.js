// routes/admin.js
// Updated with PDF export, Implementation Validation, File Attachments, Approval Workflow, and Server-side Pagination with Multi-Select Filters

const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

const db = require('../models/database');
const formLoader = require('../utils/formLoader');
const emailService = require('../utils/emailService');

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.isAdmin) {
        return next();
    }
    req.flash('error', 'Please log in to access the admin area');
    res.redirect('/admin/login');
};

// Apply authentication to all admin routes except login
router.use((req, res, next) => {
    if (req.path === '/login' || req.path === '/logout') {
        return next();
    }
    return isAuthenticated(req, res, next);
});

// Login page
router.get('/login', (req, res) => {
    if (req.session && req.session.isAdmin) {
        return res.redirect('/admin/dashboard');
    }
    res.render('admin/login', {
        title: 'Admin Login',
        layout: 'admin'
    });
});

// Login POST
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@cloudstrucc.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'dpg613';

    if (email === adminEmail && password === adminPassword) {
        req.session.isAdmin = true;
        req.session.adminEmail = email;
        req.flash('success', 'Welcome back!');
        res.redirect('/admin/dashboard');
    } else {
        req.flash('error', 'Invalid credentials');
        res.redirect('/admin/login');
    }
});

// Logout
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/admin/login');
});

// Dashboard
router.get('/dashboard', async (req, res) => {
    try {
        const stats = db.getStats();
        const recentSubmissions = db.getRecentSubmissions(5);
        const activeInvites = db.getActiveInvites();

        res.render('admin/dashboard', {
            title: 'Dashboard',
            layout: 'admin',
            stats,
            recentSubmissions,
            activeInvites
        });
    } catch (error) {
        console.error('Dashboard error:', error);
        req.flash('error', 'Error loading dashboard');
        res.render('admin/dashboard', {
            title: 'Dashboard',
            layout: 'admin',
            stats: { activeInvites: 0, totalSubmissions: 0, completedSubmissions: 0, draftSubmissions: 0 },
            recentSubmissions: [],
            activeInvites: []
        });
    }
});

// Forms management
router.get('/forms', async (req, res) => {
    try {
        const forms = formLoader.getAllForms();

        res.render('admin/forms', {
            title: 'Manage Forms',
            layout: 'admin',
            forms
        });
    } catch (error) {
        console.error('Forms error:', error);
        req.flash('error', 'Error loading forms');
        res.redirect('/admin/dashboard');
    }
});

// Form upload
router.post('/forms/upload', async (req, res) => {
    try {
        const { slug, title, description, markdownContent } = req.body;

        if (!slug || !title || !markdownContent) {
            req.flash('error', 'Slug, title, and markdown content are required');
            return res.redirect('/admin/forms');
        }

        const questionnairesDir = path.join(__dirname, '..', 'questionnaires');
        if (!fs.existsSync(questionnairesDir)) {
            fs.mkdirSync(questionnairesDir, { recursive: true });
        }

        const filename = `${slug}.md`;
        const filepath = path.join(questionnairesDir, filename);
        fs.writeFileSync(filepath, markdownContent, 'utf8');

        db.createForm({
            slug,
            title,
            description: description || '',
            markdownFile: filename
        });

        req.flash('success', `Form "${title}" created successfully`);
        res.redirect('/admin/forms');
    } catch (error) {
        console.error('Form upload error:', error);
        req.flash('error', 'Error uploading form');
        res.redirect('/admin/forms');
    }
});

// Form preview
router.get('/forms/:slug/preview', async (req, res) => {
    try {
        // Try to get form by slug - first check if getFormBySlug exists
        let form;
        if (typeof formLoader.getFormBySlug === 'function') {
            form = formLoader.getFormBySlug(req.params.slug);
        } else {
            // Fallback: get all forms and find by slug
            const forms = formLoader.getAllForms();
            form = forms.find(f => f.slug === req.params.slug);
        }
        
        if (!form) {
            req.flash('error', 'Form not found');
            return res.redirect('/admin/forms');
        }
        
        // Try to parse the form if parseForm exists
        let parsedForm = { sections: [], totalFields: 0 };
        if (typeof formLoader.parseForm === 'function') {
            try {
                parsedForm = formLoader.parseForm(form);
            } catch (e) {
                console.error('Error parsing form:', e);
            }
        } else if (typeof formLoader.getFormContent === 'function') {
            // Alternative: try to get form content
            try {
                const content = formLoader.getFormContent(form.slug || form.id);
                form.content = content;
            } catch (e) {
                console.error('Error getting form content:', e);
            }
        }
        
        // If we have a markdown file, try to read and parse it
        if (form.markdown_file && !parsedForm.sections.length) {
            try {
                const filepath = path.join(__dirname, '..', 'questionnaires', form.markdown_file);
                if (fs.existsSync(filepath)) {
                    const content = fs.readFileSync(filepath, 'utf8');
                    form.rawContent = content;
                    
                    // Simple markdown parsing to extract sections and fields
                    parsedForm = parseMarkdownForm(content);
                }
            } catch (e) {
                console.error('Error reading markdown file:', e);
            }
        }
        
        res.render('admin/form-preview', {
            title: `Preview: ${form.title}`,
            layout: 'admin',
            form,
            parsedForm,
            isPreview: true
        });
    } catch (error) {
        console.error('Form preview error:', error);
        req.flash('error', 'Error loading form preview');
        res.redirect('/admin/forms');
    }
});

// Helper function to parse markdown form content
function parseMarkdownForm(content) {
    const sections = [];
    let currentSection = null;
    let totalFields = 0;
    
    const lines = content.split('\n');
    
    for (const line of lines) {
        // Section headers (## Section Name)
        if (line.startsWith('## ')) {
            if (currentSection) {
                sections.push(currentSection);
            }
            currentSection = {
                title: line.replace('## ', '').trim(),
                description: '',
                fields: []
            };
        }
        // Subsection or field group (### Name)
        else if (line.startsWith('### ') && currentSection) {
            // Treat as a field label
            const label = line.replace('### ', '').trim();
            currentSection.fields.push({
                label,
                type: 'text',
                required: false
            });
            totalFields++;
        }
        // List items as fields (- [ ] Field or - Field)
        else if ((line.startsWith('- [ ]') || line.startsWith('- [x]') || line.match(/^- \*\*.*\*\*/)) && currentSection) {
            let label = line.replace(/^- \[.\] /, '').replace(/^- /, '').trim();
            let type = 'yesno';
            
            // Check for specific patterns
            if (line.includes('**')) {
                label = label.replace(/\*\*/g, '');
                type = 'yesno';
            }
            
            // Check for required
            const required = label.includes('*') || label.includes('(required)');
            label = label.replace(/\*$/, '').replace(/\(required\)/gi, '').trim();
            
            if (label) {
                currentSection.fields.push({
                    label,
                    type,
                    required
                });
                totalFields++;
            }
        }
        // Regular list items
        else if (line.startsWith('- ') && currentSection && !line.startsWith('- [ ]')) {
            const label = line.replace('- ', '').replace(/\*\*/g, '').trim();
            if (label && !label.startsWith('[') && label.length > 3) {
                currentSection.fields.push({
                    label,
                    type: 'yesno',
                    required: false
                });
                totalFields++;
            }
        }
    }
    
    if (currentSection) {
        sections.push(currentSection);
    }
    
    return { sections, totalFields };
}

// Invites list
router.get('/invites', async (req, res) => {
    try {
        const invites = db.getAllInvites();
        const forms = formLoader.getAllForms();

        res.render('admin/invites', {
            title: 'Manage Invites',
            layout: 'admin',
            invites,
            forms
        });
    } catch (error) {
        console.error('Invites error:', error);
        req.flash('error', 'Error loading invites');
        res.redirect('/admin/dashboard');
    }
});

// Create new invite - show form
router.get('/invites/new', async (req, res) => {
    try {
        const forms = formLoader.getAllForms();

        res.render('admin/invite-new', {
            title: 'Create New Invite',
            layout: 'admin',
            forms
        });
    } catch (error) {
        console.error('New invite form error:', error);
        req.flash('error', 'Error loading invite form');
        res.redirect('/admin/invites');
    }
});

// Create new invite - process
router.post('/invites', async (req, res) => {
    try {
        const { clientEmail, clientName, clientCompany, formIds, expiresInDays, submissionDeadline } = req.body;

        if (!clientEmail || !clientName || !formIds || formIds.length === 0) {
            req.flash('error', 'Please fill in all required fields');
            return res.redirect('/admin/invites/new');
        }

        const crypto = require('crypto');
        const code = crypto.randomBytes(16).toString('hex');

        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + parseInt(expiresInDays || 30));

        const invite = db.createInvite({
            code,
            clientEmail,
            clientName,
            clientCompany: clientCompany || null,
            createdBy: req.session.adminId || null,
            expiresAt: expiresAt.toISOString(),
            submissionDeadline: submissionDeadline || null
        });

        const formIdArray = Array.isArray(formIds) ? formIds : [formIds];
        for (const formId of formIdArray) {
            db.addFormToInvite(invite.id, parseInt(formId));
        }

        const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;

        if (emailService.isConfigured()) {
            try {
                const forms = formIdArray.map(fid => formLoader.getAllForms().find(f => f.id == fid));
                await emailService.sendInvite({
                    to: clientEmail,
                    clientName,
                    inviteLink: `${baseUrl}/q/${code}`,
                    forms: forms.map(f => f?.title || 'Form'),
                    expiresAt: expiresAt.toLocaleDateString()
                });
                req.flash('success', `Invite sent to ${clientEmail}`);
            } catch (emailError) {
                console.error('Email send error:', emailError);
                req.flash('warning', `Invite created but email failed. Link: ${baseUrl}/q/${code}`);
            }
        } else {
            req.flash('success', `Invite created. Link: ${baseUrl}/q/${code}`);
        }

        res.redirect('/admin/invites');
    } catch (error) {
        console.error('Create invite error:', error);
        req.flash('error', 'Error creating invite');
        res.redirect('/admin/invites/new');
    }
});

// View invite details
router.get('/invites/:id', async (req, res) => {
    try {
        const invite = db.getInviteById(req.params.id);

        if (!invite) {
            req.flash('error', 'Invite not found');
            return res.redirect('/admin/invites');
        }

        const forms = db.getInviteForms(invite.id);
        const submissions = db.getAllSubmissions().filter(s => s.invite_id === invite.id);

        const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;

        res.render('admin/invite-detail', {
            title: `Invite: ${invite.client_name}`,
            layout: 'admin',
            invite,
            forms,
            submissions,
            inviteLink: `${baseUrl}/q/${invite.code}`
        });
    } catch (error) {
        console.error('Invite detail error:', error);
        req.flash('error', 'Error loading invite');
        res.redirect('/admin/invites');
    }
});

// Resend invite email
router.post('/invites/:id/resend', async (req, res) => {
    try {
        const invite = db.getInviteById(req.params.id);

        if (!invite) {
            req.flash('error', 'Invite not found');
            return res.redirect('/admin/invites');
        }

        const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
        const forms = db.getInviteForms(invite.id);

        if (emailService.isConfigured()) {
            await emailService.sendInvite({
                to: invite.client_email,
                clientName: invite.client_name,
                inviteLink: `${baseUrl}/q/${invite.code}`,
                forms: forms.map(f => f.title),
                expiresAt: new Date(invite.expires_at).toLocaleDateString()
            });
            req.flash('success', `Invite resent to ${invite.client_email}`);
        } else {
            req.flash('warning', 'Email not configured. Cannot resend.');
        }

        res.redirect(`/admin/invites/${invite.id}`);
    } catch (error) {
        console.error('Resend invite error:', error);
        req.flash('error', 'Error resending invite');
        res.redirect('/admin/invites');
    }
});

// Revoke invite
router.post('/invites/:id/revoke', async (req, res) => {
    try {
        db.revokeInvite(req.params.id);
        req.flash('success', 'Invite revoked');
        res.redirect('/admin/invites');
    } catch (error) {
        console.error('Revoke invite error:', error);
        req.flash('error', 'Error revoking invite');
        res.redirect('/admin/invites');
    }
});

// Delete invite
router.post('/invites/:id/delete', async (req, res) => {
    try {
        db.deleteInvite(req.params.id);
        req.flash('success', 'Invite deleted');
        res.redirect('/admin/invites');
    } catch (error) {
        console.error('Delete invite error:', error);
        req.flash('error', 'Error deleting invite');
        res.redirect('/admin/invites');
    }
});

// Submissions list
router.get('/submissions', async (req, res) => {
    try {
        const submissions = db.getAllSubmissions();

        res.render('admin/submissions', {
            title: 'Submissions',
            layout: 'admin',
            submissions
        });
    } catch (error) {
        console.error('Submissions error:', error);
        req.flash('error', 'Error loading submissions');
        res.redirect('/admin/dashboard');
    }
});

// =============================================================
// SUBMISSION DETAIL VIEW
// =============================================================
router.get('/submissions/:id', async (req, res) => {
    try {
        const submission = db.getSubmissionById(req.params.id);

        if (!submission) {
            req.flash('error', 'Submission not found');
            return res.redirect('/admin/submissions');
        }

        let parsedData = {};
        try {
            parsedData = typeof submission.data === 'string' 
                ? JSON.parse(submission.data) 
                : (submission.data || {});
        } catch (e) {
            console.error('Error parsing submission data:', e);
        }

        let validationData = {};
        try {
            validationData = submission.validation_data 
                ? (typeof submission.validation_data === 'string' 
                    ? JSON.parse(submission.validation_data) 
                    : submission.validation_data)
                : {};
        } catch (e) {
            console.error('Error parsing validation data:', e);
        }

        const attachments = db.getSubmissionAttachments(req.params.id);
        
        let approvalStatus = null;
        try {
            approvalStatus = db.getApprovalStatus(req.params.id);
        } catch (e) {}
        
        let auditLog = [];
        try {
            auditLog = db.getAuditLog(req.params.id);
        } catch (e) {}
        
        let validationComplete = false;
        let metCount = 0, notMetCount = 0, totalCount = 0;
        Object.values(validationData).forEach(v => {
            totalCount++;
            if (v.met === 'yes') metCount++;
            else if (v.met === 'no') notMetCount++;
        });
        validationComplete = totalCount > 0 && (metCount + notMetCount) === totalCount;

        res.render('admin/submission-detail', {
            title: `Submission: ${submission.clientName || 'Unknown'}`,
            layout: 'admin',
            submission,
            parsedData,
            validationData,
            attachments,
            approvalStatus,
            auditLog,
            validationComplete,
            validationStats: { metCount, notMetCount, totalCount },
            dataJson: JSON.stringify(parsedData, null, 2)
        });
    } catch (error) {
        console.error('Submission detail error:', error);
        req.flash('error', 'Error loading submission');
        res.redirect('/admin/submissions');
    }
});

// =============================================================
// PDF EXPORT
// =============================================================
router.get('/submissions/:id/export-pdf', async (req, res) => {
    try {
        let PDFDocument;
        try {
            PDFDocument = require('pdfkit');
        } catch (e) {
            req.flash('error', 'PDF export requires pdfkit. Run: npm install pdfkit');
            return res.redirect(`/admin/submissions/${req.params.id}`);
        }

        const submission = db.getSubmissionById(req.params.id);

        if (!submission) {
            req.flash('error', 'Submission not found');
            return res.redirect('/admin/submissions');
        }

        let parsedData = {};
        try {
            parsedData = typeof submission.data === 'string' 
                ? JSON.parse(submission.data) 
                : (submission.data || {});
        } catch (e) {}
        
        let approvalStatus = null;
        try {
            approvalStatus = db.getApprovalStatus(req.params.id);
        } catch (e) {}

        const doc = new PDFDocument({
            size: 'LETTER',
            margins: { top: 50, bottom: 50, left: 50, right: 50 }
        });

        const filename = `submission-${submission.clientName || submission.id}-${Date.now()}.pdf`;
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

        doc.pipe(res);

        doc.fontSize(20).font('Helvetica-Bold').text('Questionnaire Submission', { align: 'center' });
        doc.moveDown();

        doc.fontSize(12).font('Helvetica');
        doc.text(`Client: ${submission.clientName || 'N/A'}`);
        doc.text(`Company: ${submission.companyName || 'N/A'}`);
        doc.text(`Email: ${submission.clientEmail || 'N/A'}`);
        doc.text(`Form: ${submission.formName || 'N/A'}`);
        doc.text(`Status: ${submission.status || 'in_progress'}`);
        doc.text(`Submitted: ${submission.submitted_at ? new Date(submission.submitted_at).toLocaleString() : 'In Progress'}`);
        doc.moveDown();
        
        if (approvalStatus) {
            doc.moveTo(50, doc.y).lineTo(562, doc.y).stroke();
            doc.moveDown();
            
            doc.fontSize(14).font('Helvetica-Bold').fillColor('#9b59b6').text('Project Approvals', { underline: true });
            doc.fillColor('black');
            doc.moveDown(0.5);
            
            doc.fontSize(10).font('Helvetica');
            
            doc.font('Helvetica-Bold').text('1. Client: ', { continued: true });
            doc.font('Helvetica').text(approvalStatus.client_name || 'N/A');
            doc.text(`   Status: ${approvalStatus.client_approved_at ? '✓ Approved' : '○ Pending'}`);
            doc.moveDown(0.5);
            
            doc.font('Helvetica-Bold').text('2. Project Sponsor: ', { continued: true });
            doc.font('Helvetica').text(approvalStatus.sponsor_name || 'N/A');
            doc.text(`   Status: ${approvalStatus.sponsor_approved_at ? '✓ Approved' : '○ Pending'}`);
            doc.moveDown(0.5);
            
            doc.font('Helvetica-Bold').text('3. Executive: ', { continued: true });
            doc.font('Helvetica').text(approvalStatus.executive_name || 'N/A');
            doc.text(`   Status: ${approvalStatus.executive_approved_at ? '✓ Approved' : '○ Pending'}`);
            doc.moveDown();
        }

        doc.moveTo(50, doc.y).lineTo(562, doc.y).stroke();
        doc.moveDown();

        doc.fontSize(14).font('Helvetica-Bold').text('Responses:', { underline: true });
        doc.moveDown(0.5);

        doc.fontSize(10).font('Helvetica');
        
        for (const [key, value] of Object.entries(parsedData)) {
            if (key.startsWith('_') || key === 'metadata') continue;

            const label = key.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim();

            if (doc.y > 700) doc.addPage();

            doc.font('Helvetica-Bold').text(label + ':');
            
            let displayValue = '';
            if (typeof value === 'object' && value !== null) {
                displayValue = JSON.stringify(value, null, 2);
            } else if (value === true || value === 'yes') {
                displayValue = 'Yes';
            } else if (value === false || value === 'no') {
                displayValue = 'No';
            } else {
                displayValue = String(value || 'N/A');
            }

            doc.font('Helvetica').text(displayValue, { indent: 20 });
            doc.moveDown(0.5);
        }

        doc.moveDown(2);
        doc.fontSize(8).fillColor('gray');
        doc.text(`Generated on ${new Date().toLocaleString()} by Cloudstrucc BA Forms`, { align: 'center' });

        doc.end();

    } catch (error) {
        console.error('PDF export error:', error);
        req.flash('error', 'Error generating PDF');
        res.redirect(`/admin/submissions/${req.params.id}`);
    }
});

// =============================================================
// IMPLEMENTATION VALIDATION PAGE - WITH SERVER-SIDE PAGINATION & MULTI-SELECT FILTERS
// =============================================================
router.get('/submissions/:id/validation', async (req, res) => {
    try {
        const submission = db.getSubmissionById(req.params.id);

        if (!submission) {
            req.flash('error', 'Submission not found');
            return res.redirect('/admin/submissions');
        }

        let parsedData = {};
        try {
            parsedData = typeof submission.data === 'string' 
                ? JSON.parse(submission.data) 
                : (submission.data || {});
        } catch (e) {
            console.error('Error parsing submission data:', e);
        }

        let validationData = {};
        try {
            validationData = submission.validation_data 
                ? (typeof submission.validation_data === 'string' 
                    ? JSON.parse(submission.validation_data) 
                    : submission.validation_data)
                : {};
        } catch (e) {
            console.error('Error parsing validation data:', e);
        }
        
        let userValidationData = {};
        try {
            userValidationData = db.getSubmissionUserValidation(req.params.id);
        } catch (e) {}
        
        let approvalStatus = null;
        try {
            approvalStatus = db.getApprovalStatus(req.params.id);
        } catch (e) {}
        
        let auditLog = [];
        try {
            auditLog = db.getAuditLog(req.params.id);
        } catch (e) {}

        // Build requirements array with categories
        const allRequirements = [];
        let globalIndex = 0;
        
        for (const [key, value] of Object.entries(parsedData)) {
            if (key.startsWith('_') || key === 'metadata') continue;
            
            globalIndex++;
            
            const label = key.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim();
            
            // Derive category
            let category = 'General';
            const keyLower = key.toLowerCase();
            if (keyLower.includes('security') || keyLower.includes('auth') || keyLower.includes('password') || keyLower.includes('encrypt') || keyLower.includes('mfa')) {
                category = 'Security';
            } else if (keyLower.includes('perform') || keyLower.includes('speed') || keyLower.includes('load') || keyLower.includes('response')) {
                category = 'Performance';
            } else if (keyLower.includes('integrat') || keyLower.includes('api') || keyLower.includes('connect') || keyLower.includes('sync')) {
                category = 'Integration';
            } else if (keyLower.includes('complian') || keyLower.includes('audit') || keyLower.includes('regulat') || keyLower.includes('gdpr') || keyLower.includes('hipaa')) {
                category = 'Compliance';
            } else if (keyLower.includes('ui') || keyLower.includes('ux') || keyLower.includes('interface') || keyLower.includes('design') || keyLower.includes('display')) {
                category = 'UI/UX';
            } else if (keyLower.includes('data') || keyLower.includes('storage') || keyLower.includes('backup') || keyLower.includes('database')) {
                category = 'Data Management';
            } else if (keyLower.includes('report') || keyLower.includes('analytic') || keyLower.includes('dashboard') || keyLower.includes('metric')) {
                category = 'Reporting';
            } else if (keyLower.includes('user') || keyLower.includes('role') || keyLower.includes('permission') || keyLower.includes('access')) {
                category = 'User Management';
            } else if (keyLower.includes('notif') || keyLower.includes('email') || keyLower.includes('alert') || keyLower.includes('message')) {
                category = 'Notifications';
            } else if (keyLower.includes('document') || keyLower.includes('file') || keyLower.includes('attachment') || keyLower.includes('upload')) {
                category = 'Document Management';
            }
            
            const fieldValidation = validationData[key] || {};
            const userFieldValidation = userValidationData ? userValidationData[key] : null;
            
            let responseType = 'other';
            let responseDisplay = '';
            if (typeof value === 'boolean') {
                responseType = value ? 'yes' : 'no';
                responseDisplay = value ? 'Yes' : 'No';
            } else if (value) {
                responseDisplay = String(value);
            }
            
            let adminStatus = 'pending';
            if (fieldValidation.met === 'yes') adminStatus = 'met';
            else if (fieldValidation.met === 'no') adminStatus = 'not-met';
            
            let clientStatus = 'pending';
            if (userFieldValidation) {
                if (userFieldValidation.met === 'yes') clientStatus = 'met';
                else if (userFieldValidation.met === 'no') clientStatus = 'not-met';
            }
            
            allRequirements.push({
                index: globalIndex,
                key,
                label,
                category,
                value,
                responseType,
                responseDisplay,
                adminStatus,
                clientStatus,
                comment: fieldValidation.comment || '',
                clientComment: userFieldValidation ? userFieldValidation.comment : ''
            });
        }

        // =============================================================
        // QUERY PARAMETERS - HANDLE MULTI-SELECT (arrays)
        // =============================================================
        const page = parseInt(req.query.page) || 1;
        const perPage = parseInt(req.query.perPage) || 25;
        const search = (req.query.search || '').toLowerCase().trim();
        const categoryFilter = req.query.category || 'all';
        
        // Handle multi-select filters (can be string or array)
        let adminStatusList = req.query.adminStatus || [];
        if (typeof adminStatusList === 'string') {
            adminStatusList = adminStatusList ? adminStatusList.split(',') : [];
        }
        
        let clientStatusList = req.query.clientStatus || [];
        if (typeof clientStatusList === 'string') {
            clientStatusList = clientStatusList ? clientStatusList.split(',') : [];
        }
        
        let responseList = req.query.response || [];
        if (typeof responseList === 'string') {
            responseList = responseList ? responseList.split(',') : [];
        }
        
        // Create comma-separated strings for URL params
        const adminStatusStr = Array.isArray(adminStatusList) ? adminStatusList.join(',') : '';
        const clientStatusStr = Array.isArray(clientStatusList) ? clientStatusList.join(',') : '';
        const responseStr = Array.isArray(responseList) ? responseList.join(',') : '';

        // Build category stats
        const categoryStats = {};
        allRequirements.forEach(r => {
            if (!categoryStats[r.category]) {
                categoryStats[r.category] = { total: 0, met: 0, notMet: 0, pending: 0 };
            }
            categoryStats[r.category].total++;
            if (r.adminStatus === 'met') categoryStats[r.category].met++;
            else if (r.adminStatus === 'not-met') categoryStats[r.category].notMet++;
            else categoryStats[r.category].pending++;
        });
        
        const categories = Object.entries(categoryStats)
            .map(([name, stats]) => ({ name, ...stats }))
            .sort((a, b) => a.name.localeCompare(b.name));

        // Apply filters
        let filteredRequirements = allRequirements;
        
        if (categoryFilter !== 'all') {
            filteredRequirements = filteredRequirements.filter(r => r.category === categoryFilter);
        }
        
        if (search) {
            filteredRequirements = filteredRequirements.filter(r => 
                r.label.toLowerCase().includes(search) || 
                r.key.toLowerCase().includes(search) ||
                (r.responseDisplay && r.responseDisplay.toLowerCase().includes(search))
            );
        }
        
        // Multi-select: Admin status filter
        if (adminStatusList.length > 0) {
            filteredRequirements = filteredRequirements.filter(r => adminStatusList.includes(r.adminStatus));
        }
        
        // Multi-select: Client status filter
        if (clientStatusList.length > 0) {
            filteredRequirements = filteredRequirements.filter(r => clientStatusList.includes(r.clientStatus));
        }
        
        // Multi-select: Response type filter
        if (responseList.length > 0) {
            filteredRequirements = filteredRequirements.filter(r => responseList.includes(r.responseType));
        }

        // Pagination
        const totalFiltered = filteredRequirements.length;
        const totalPages = perPage === -1 ? 1 : Math.ceil(totalFiltered / perPage);
        const currentPage = Math.min(Math.max(1, page), totalPages || 1);
        
        let paginatedRequirements;
        if (perPage === -1) {
            paginatedRequirements = filteredRequirements;
        } else {
            const startIndex = (currentPage - 1) * perPage;
            paginatedRequirements = filteredRequirements.slice(startIndex, startIndex + perPage);
        }

        // Group by category
        const groupedRequirements = {};
        paginatedRequirements.forEach(r => {
            if (!groupedRequirements[r.category]) {
                groupedRequirements[r.category] = [];
            }
            groupedRequirements[r.category].push(r);
        });
        
        const categoryGroups = Object.entries(groupedRequirements)
            .map(([name, items]) => ({ name, items }))
            .sort((a, b) => a.name.localeCompare(b.name));

        // Stats
        const totalRequirements = allRequirements.length;
        let metCount = 0, notMetCount = 0;
        allRequirements.forEach(r => {
            if (r.adminStatus === 'met') metCount++;
            else if (r.adminStatus === 'not-met') notMetCount++;
        });
        const pendingCount = totalRequirements - metCount - notMetCount;
        const validationComplete = totalRequirements > 0 && pendingCount === 0;

        res.render('admin/submission-validation', {
            title: `Validation: ${submission.clientName || 'Unknown'}`,
            layout: 'admin',
            submission,
            categoryGroups,
            categories,
            pagination: {
                currentPage,
                totalPages,
                perPage,
                totalFiltered,
                totalRequirements,
                startItem: perPage === -1 ? 1 : ((currentPage - 1) * perPage) + 1,
                endItem: perPage === -1 ? totalFiltered : Math.min(currentPage * perPage, totalFiltered)
            },
            filters: {
                search,
                category: categoryFilter,
                adminStatus: adminStatusStr,
                clientStatus: clientStatusStr,
                response: responseStr,
                // Lists for checkbox checked state
                adminStatusList: adminStatusList,
                clientStatusList: clientStatusList,
                responseList: responseList
            },
            stats: {
                total: totalRequirements,
                met: metCount,
                notMet: notMetCount,
                pending: pendingCount,
                percentValidated: totalRequirements > 0 ? Math.round(((metCount + notMetCount) / totalRequirements) * 100) : 0,
                percentMet: totalRequirements > 0 ? Math.round((metCount / totalRequirements) * 100) : 0
            },
            allFieldKeys: allRequirements.map(r => r.key),
            visibleFieldKeys: filteredRequirements.map(r => r.key),
            approvalStatus,
            auditLog,
            validationComplete,
            validationData,
            userValidationData
        });
    } catch (error) {
        console.error('Validation page error:', error);
        req.flash('error', 'Error loading validation page');
        res.redirect(`/admin/submissions/${req.params.id}`);
    }
});

// Save validation
router.post('/submissions/:id/validation', async (req, res) => {
    try {
        const { validationData } = req.body;

        let parsedValidation = {};
        try {
            parsedValidation = typeof validationData === 'string' 
                ? JSON.parse(validationData) 
                : (validationData || {});
        } catch (e) {
            console.error('Error parsing validation data:', e);
        }

        db.updateSubmissionValidation(req.params.id, parsedValidation);
        
        let metCount = 0, notMetCount = 0;
        Object.values(parsedValidation).forEach(v => {
            if (v.met === 'yes') metCount++;
            else if (v.met === 'no') notMetCount++;
        });
        const adminEmail = req.session.adminEmail || 'admin@cloudstrucc.com';
        db.addAuditLog(req.params.id, 'admin_validated', adminEmail, 'admin', { metCount, notMetCount });

        req.flash('success', 'Validation saved successfully');
        
        // Preserve query params
        const queryString = req.url.split('?')[1] || '';
        res.redirect(`/admin/submissions/${req.params.id}/validation${queryString ? '?' + queryString : ''}`);
    } catch (error) {
        console.error('Save validation error:', error);
        req.flash('error', 'Error saving validation');
        res.redirect(`/admin/submissions/${req.params.id}/validation`);
    }
});

// Validation PDF Export
router.get('/submissions/:id/validation/export-pdf', async (req, res) => {
    try {
        let PDFDocument;
        try {
            PDFDocument = require('pdfkit');
        } catch (e) {
            req.flash('error', 'PDF export requires pdfkit');
            return res.redirect(`/admin/submissions/${req.params.id}/validation`);
        }

        const submission = db.getSubmissionById(req.params.id);
        if (!submission) {
            req.flash('error', 'Submission not found');
            return res.redirect('/admin/submissions');
        }

        let parsedData = {};
        try {
            parsedData = typeof submission.data === 'string' ? JSON.parse(submission.data) : (submission.data || {});
        } catch (e) {}

        let validationData = {};
        try {
            validationData = submission.validation_data 
                ? (typeof submission.validation_data === 'string' ? JSON.parse(submission.validation_data) : submission.validation_data)
                : {};
        } catch (e) {}
        
        let approvalStatus = null;
        try { approvalStatus = db.getApprovalStatus(req.params.id); } catch (e) {}

        const doc = new PDFDocument({ size: 'LETTER', margins: { top: 50, bottom: 50, left: 50, right: 50 } });

        const filename = `validation-${submission.clientName || submission.id}-${Date.now()}.pdf`;
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

        doc.pipe(res);

        doc.fontSize(20).font('Helvetica-Bold').text('Implementation Validation Report', { align: 'center' });
        doc.fontSize(12).font('Helvetica').text(submission.formName || 'Requirements Validation', { align: 'center' });
        doc.moveDown();

        doc.fontSize(12).font('Helvetica');
        doc.text(`Client: ${submission.clientName || 'N/A'}`);
        doc.text(`Company: ${submission.companyName || 'N/A'}`);
        doc.text(`Generated: ${new Date().toLocaleString()}`);
        doc.moveDown();

        if (approvalStatus) {
            doc.moveTo(50, doc.y).lineTo(562, doc.y).stroke();
            doc.moveDown();
            doc.fontSize(14).font('Helvetica-Bold').fillColor('#9b59b6').text('Project Approvals', { underline: true });
            doc.fillColor('black');
            doc.moveDown(0.5);
            doc.fontSize(10).font('Helvetica');
            
            doc.font('Helvetica-Bold').text('1. Client: ', { continued: true });
            doc.font('Helvetica').text(approvalStatus.client_name || 'N/A');
            doc.text(`   Status: ${approvalStatus.client_approved_at ? '✓ Approved' : '○ Pending'}`);
            doc.moveDown(0.5);
            
            doc.font('Helvetica-Bold').text('2. Sponsor: ', { continued: true });
            doc.font('Helvetica').text(approvalStatus.sponsor_name || 'N/A');
            doc.text(`   Status: ${approvalStatus.sponsor_approved_at ? '✓ Approved' : '○ Pending'}`);
            doc.moveDown(0.5);
            
            doc.font('Helvetica-Bold').text('3. Executive: ', { continued: true });
            doc.font('Helvetica').text(approvalStatus.executive_name || 'N/A');
            doc.text(`   Status: ${approvalStatus.executive_approved_at ? '✓ Approved' : '○ Pending'}`);
            doc.moveDown();
        }

        doc.moveTo(50, doc.y).lineTo(562, doc.y).stroke();
        doc.moveDown();

        let metCount = 0, notMetCount = 0, totalCount = 0;
        Object.values(validationData).forEach(v => {
            totalCount++;
            if (v.met === 'yes') metCount++;
            else if (v.met === 'no') notMetCount++;
        });

        doc.fontSize(14).font('Helvetica-Bold').text('Summary:', { underline: true });
        doc.moveDown(0.5);
        doc.fontSize(12).font('Helvetica');
        doc.text(`Total: ${totalCount} | Met: ${metCount} | Not Met: ${notMetCount} | Completion: ${totalCount > 0 ? Math.round(((metCount + notMetCount) / totalCount) * 100) : 0}%`);
        doc.moveDown();

        doc.moveTo(50, doc.y).lineTo(562, doc.y).stroke();
        doc.moveDown();

        doc.fontSize(14).font('Helvetica-Bold').text('Details:', { underline: true });
        doc.moveDown(0.5);
        doc.fontSize(9).font('Helvetica');

        let rowNum = 0;
        for (const [key, value] of Object.entries(parsedData)) {
            if (key.startsWith('_') || key === 'metadata') continue;
            rowNum++;

            const fieldValidation = validationData[key] || {};
            const label = key.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim();

            if (doc.y > 680) doc.addPage();

            const status = fieldValidation.met === 'yes' ? '✓ MET' : fieldValidation.met === 'no' ? '✗ NOT MET' : '○ N/A';

            doc.font('Helvetica-Bold').text(`${rowNum}. ${label}`);

            let displayValue = typeof value === 'boolean' ? (value ? 'Yes' : 'No') : 
                              typeof value === 'object' ? JSON.stringify(value) : String(value || 'N/A');

            doc.font('Helvetica').text(`   Response: ${displayValue}`);
            doc.text(`   Status: ${status}`);
            if (fieldValidation.comment) doc.text(`   Comment: ${fieldValidation.comment}`);
            doc.moveDown(0.3);
        }

        doc.moveDown(2);
        doc.fontSize(8).fillColor('gray').text(`Generated by Cloudstrucc BA Forms`, { align: 'center' });
        doc.end();

    } catch (error) {
        console.error('Validation PDF export error:', error);
        req.flash('error', 'Error generating PDF');
        res.redirect(`/admin/submissions/${req.params.id}/validation`);
    }
});

// =============================================================
// ATTACHMENTS
// =============================================================
router.post('/submissions/:id/attachments', async (req, res) => {
    try {
        const { fileName, fileUrl, description } = req.body;
        if (!fileName || !fileUrl) return res.status(400).json({ error: 'File name and URL required' });

        const attachment = db.addSubmissionAttachment(req.params.id, {
            fileName, fileUrl, description: description || null,
            addedBy: req.session.adminEmail || 'admin',
            addedAt: new Date().toISOString()
        });

        res.json({ success: true, attachment });
    } catch (error) {
        console.error('Add attachment error:', error);
        res.status(500).json({ error: 'Error adding attachment' });
    }
});

router.delete('/submissions/:id/attachments/:attachmentId', async (req, res) => {
    try {
        db.deleteSubmissionAttachment(req.params.id, req.params.attachmentId);
        res.json({ success: true });
    } catch (error) {
        console.error('Delete attachment error:', error);
        res.status(500).json({ error: 'Error deleting attachment' });
    }
});

router.post('/submissions/:id/delete', async (req, res) => {
    try {
        db.deleteSubmission(req.params.id);
        req.flash('success', 'Submission deleted');
        res.redirect('/admin/submissions');
    } catch (error) {
        console.error('Delete submission error:', error);
        req.flash('error', 'Error deleting submission');
        res.redirect('/admin/submissions');
    }
});

// Settings
router.get('/settings', async (req, res) => {
    try {
        res.render('admin/settings', {
            title: 'Settings',
            layout: 'admin',
            settings: {
                adminEmail: process.env.ADMIN_EMAIL || 'admin@cloudstrucc.com',
                smtpHost: process.env.SMTP_HOST || 'smtp.office365.com',
                smtpPort: process.env.SMTP_PORT || '587',
                smtpFrom: process.env.SMTP_FROM || '',
                baseUrl: process.env.BASE_URL || 'http://localhost:3000',
                analyticsInterval: process.env.ANALYTICS_INTERVAL_HOURS || '72'
            }
        });
    } catch (error) {
        console.error('Settings error:', error);
        req.flash('error', 'Error loading settings');
        res.redirect('/admin/dashboard');
    }
});

// =============================================================
// USER VALIDATION VIEW
// =============================================================
router.get('/submissions/:id/user-validation', async (req, res) => {
    try {
        const submission = db.getSubmissionById(req.params.id);
        if (!submission) {
            req.flash('error', 'Submission not found');
            return res.redirect('/admin/submissions');
        }
        
        let parsedData = {};
        try { parsedData = typeof submission.data === 'string' ? JSON.parse(submission.data) : (submission.data || {}); } catch (e) {}
        
        let userValidationData = {};
        try { userValidationData = db.getSubmissionUserValidation(req.params.id); } catch (e) {}
        
        let adminValidationData = {};
        try { adminValidationData = db.getSubmissionValidation(req.params.id); } catch (e) {}
        
        let adminComments = {};
        try { adminComments = db.getSubmissionAdminComments(req.params.id); } catch (e) {}
        
        let auditLog = [];
        try { auditLog = db.getAuditLog(req.params.id); } catch (e) {}
        
        res.render('admin/user-validation-view', {
            title: `Client Validation: ${submission.clientName}`,
            layout: 'admin',
            submission, parsedData, userValidationData, adminValidationData, adminComments, auditLog
        });
    } catch (error) {
        console.error('User validation view error:', error);
        req.flash('error', 'Error loading validation data');
        res.redirect(`/admin/submissions/${req.params.id}`);
    }
});

router.get('/submissions/:id/audit-log', async (req, res) => {
    try {
        const auditLog = db.getAuditLog(req.params.id);
        res.json({ success: true, auditLog });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Error fetching audit log' });
    }
});

router.post('/submissions/:id/admin-comments', async (req, res) => {
    try {
        const { comments } = req.body;
        const adminEmail = req.session.adminEmail || 'admin@cloudstrucc.com';
        db.updateSubmissionAdminComments(req.params.id, comments, adminEmail);
        res.json({ success: true, message: 'Admin comments saved' });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Error saving comments' });
    }
});

// =============================================================
// SEND FOR RE-VALIDATION
// =============================================================
router.post('/submissions/:id/send-for-validation', async (req, res) => {
    try {
        const submission = db.getSubmissionById(req.params.id);
        
        if (!submission) {
            return res.status(404).json({ success: false, error: 'Submission not found' });
        }
        
        let filteredFields = [];
        let message = '';
        
        if (req.body.filteredFields) {
            try {
                filteredFields = typeof req.body.filteredFields === 'string' 
                    ? JSON.parse(req.body.filteredFields) 
                    : req.body.filteredFields;
            } catch (e) {
                console.error('Error parsing filtered fields:', e);
            }
        }
        
        if (req.body.message) {
            message = req.body.message;
        }
        
        const adminEmail = req.session.adminEmail || 'admin@cloudstrucc.com';
        
        db.updateSubmissionValidationStatus(req.params.id, 'pending_user_validation', adminEmail, filteredFields);
        
        db.addAuditLog(req.params.id, 'sent_for_revalidation', adminEmail, 'admin', {
            filteredFieldCount: Array.isArray(filteredFields) ? filteredFields.length : 0,
            message: message || ''
        });
        
        if (submission.clientEmail && emailService.isConfigured()) {
            try {
                const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
                await emailService.sendValidationRequest({
                    to: submission.clientEmail,
                    clientName: submission.clientName,
                    formTitle: submission.formName,
                    validationLink: `${baseUrl}/validate/submission/${submission.inviteCode}/${submission.id}/validate`,
                    message,
                    fieldCount: Array.isArray(filteredFields) ? filteredFields.length : 0
                });
            } catch (emailError) {
                console.error('Email error:', emailError);
            }
        }
        
        if (req.xhr || req.headers.accept?.includes('application/json')) {
            return res.json({ 
                success: true, 
                message: 'Re-validation request sent',
                fieldCount: Array.isArray(filteredFields) ? filteredFields.length : 0
            });
        }
        
        req.flash('success', `Re-validation request sent for ${filteredFields.length} items`);
        res.redirect(`/admin/submissions/${req.params.id}`);
    } catch (error) {
        console.error('Send for validation error:', error);
        
        if (req.xhr || req.headers.accept?.includes('application/json')) {
            return res.status(500).json({ success: false, error: 'Server error' });
        }
        
        req.flash('error', 'Error sending for validation');
        res.redirect(`/admin/submissions/${req.params.id}`);
    }
});

// =============================================================
// APPROVAL WORKFLOW
// =============================================================
router.get('/submissions/:id/approval', async (req, res) => {
    try {
        const approvalStatus = db.getApprovalStatus(req.params.id);
        const submission = db.getSubmissionById(req.params.id);
        
        let validationData = {};
        try {
            validationData = submission.validation_data 
                ? (typeof submission.validation_data === 'string' ? JSON.parse(submission.validation_data) : submission.validation_data)
                : {};
        } catch (e) {}
        
        let metCount = 0, notMetCount = 0, totalCount = 0;
        Object.values(validationData).forEach(v => {
            totalCount++;
            if (v.met === 'yes') metCount++;
            else if (v.met === 'no') notMetCount++;
        });
        const canInitiate = totalCount > 0 && (metCount + notMetCount) === totalCount && !approvalStatus;
        
        res.json({ success: true, hasApproval: !!approvalStatus, approval: approvalStatus, canInitiate });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Error fetching approval status' });
    }
});

router.post('/submissions/:id/approval', async (req, res) => {
    try {
        const submission = db.getSubmissionById(req.params.id);
        if (!submission) return res.status(404).json({ success: false, error: 'Submission not found' });
        
        const existingApproval = db.getApprovalBySubmissionId(req.params.id);
        if (existingApproval) return res.status(400).json({ success: false, error: 'Approval already initiated' });
        
        const { sponsorName, sponsorEmail, executiveName, executiveEmail } = req.body;
        if (!sponsorName || !sponsorEmail || !executiveName || !executiveEmail) {
            return res.status(400).json({ success: false, error: 'All fields required' });
        }
        
        const adminEmail = req.session.adminEmail || 'admin@cloudstrucc.com';
        const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
        
        const approval = db.createApproval(req.params.id, {
            clientName: submission.clientName,
            clientEmail: submission.clientEmail,
            sponsorName, sponsorEmail, executiveName, executiveEmail,
            initiatedBy: adminEmail
        });
        
        const approvalLinks = {
            client: { name: submission.clientName, email: submission.clientEmail, link: `${baseUrl}/approve/${approval.clientAccessCode}`, role: 'Client' },
            sponsor: { name: sponsorName, email: sponsorEmail, link: `${baseUrl}/approve/${approval.sponsorAccessCode}`, role: 'Sponsor' },
            executive: { name: executiveName, email: executiveEmail, link: `${baseUrl}/approve/${approval.executiveAccessCode}`, role: 'Executive' }
        };
        
        if (emailService.isConfigured()) {
            try {
                await emailService.sendApprovalRequest({
                    to: submission.clientEmail,
                    stakeholderName: submission.clientName,
                    role: 'Client',
                    formTitle: submission.formName,
                    clientName: submission.clientName,
                    approvalLink: approvalLinks.client.link
                });
            } catch (e) { console.error('Approval email error:', e); }
        }
        
        res.json({ success: true, message: 'Approval initiated', approvalLinks });
    } catch (error) {
        console.error('Create approval error:', error);
        res.status(500).json({ success: false, error: 'Error initiating approval' });
    }
});

router.post('/submissions/:id/approval/resend/:role', async (req, res) => {
    try {
        const approval = db.getApprovalBySubmissionId(req.params.id);
        if (!approval) return res.status(404).json({ success: false, error: 'No approval found' });
        
        const submission = db.getSubmissionById(req.params.id);
        const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
        const role = req.params.role;
        
        let to, name, link;
        switch (role) {
            case 'client': to = approval.client_email; name = approval.client_name; link = `${baseUrl}/approve/${approval.client_access_code}`; break;
            case 'sponsor': to = approval.sponsor_email; name = approval.sponsor_name; link = `${baseUrl}/approve/${approval.sponsor_access_code}`; break;
            case 'executive': to = approval.executive_email; name = approval.executive_name; link = `${baseUrl}/approve/${approval.executive_access_code}`; break;
            default: return res.status(400).json({ success: false, error: 'Invalid role' });
        }
        
        if (emailService.isConfigured()) {
            await emailService.sendApprovalRequest({
                to, stakeholderName: name,
                role: role === 'client' ? 'Client' : role === 'sponsor' ? 'Project Sponsor' : 'Executive',
                formTitle: submission.formName,
                clientName: submission.clientName,
                approvalLink: link
            });
            res.json({ success: true, message: `Email sent to ${to}` });
        } else {
            res.json({ success: true, message: 'Email not configured', link });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: 'Error resending email' });
    }
});

module.exports = router;