// routes/admin.js
// Updated with PDF export, Implementation Validation, File Attachments, and Approval Workflow

const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

// Import modules directly
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

        // Parse the submission data
        let parsedData = {};
        try {
            parsedData = typeof submission.data === 'string' 
                ? JSON.parse(submission.data) 
                : (submission.data || {});
        } catch (e) {
            console.error('Error parsing submission data:', e);
        }

        // Parse validation data
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

        // Get attachments for this submission
        const attachments = db.getSubmissionAttachments(req.params.id);
        
        // Get approval status
        let approvalStatus = null;
        try {
            approvalStatus = db.getApprovalStatus(req.params.id);
        } catch (e) {}
        
        // Get audit log
        let auditLog = [];
        try {
            auditLog = db.getAuditLog(req.params.id);
        } catch (e) {}
        
        // Calculate if validation is complete (for showing Send for Approval button)
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
        } catch (e) {
            console.error('Error parsing submission data:', e);
        }
        
        // Get approval status for PDF
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

        // Header
        doc.fontSize(20).font('Helvetica-Bold').text('Questionnaire Submission', { align: 'center' });
        doc.moveDown();

        // Metadata
        doc.fontSize(12).font('Helvetica');
        doc.text(`Client: ${submission.clientName || 'N/A'}`);
        doc.text(`Company: ${submission.companyName || 'N/A'}`);
        doc.text(`Email: ${submission.clientEmail || 'N/A'}`);
        doc.text(`Form: ${submission.formName || 'N/A'}`);
        doc.text(`Status: ${submission.status || 'in_progress'}`);
        doc.text(`Submitted: ${submission.submitted_at ? new Date(submission.submitted_at).toLocaleString() : 'In Progress'}`);
        doc.moveDown();
        
        // APPROVAL SECTION (if approvals exist)
        if (approvalStatus) {
            doc.moveTo(50, doc.y).lineTo(562, doc.y).stroke();
            doc.moveDown();
            
            doc.fontSize(14).font('Helvetica-Bold').fillColor('#9b59b6').text('Project Approvals', { underline: true });
            doc.fillColor('black');
            doc.moveDown(0.5);
            
            doc.fontSize(10).font('Helvetica');
            
            // Client
            doc.font('Helvetica-Bold').text('1. Client: ', { continued: true });
            doc.font('Helvetica').text(approvalStatus.client_name || 'N/A');
            doc.text(`   Email: ${approvalStatus.client_email || 'N/A'}`);
            doc.text(`   Status: ${approvalStatus.client_approved_at ? '✓ Approved on ' + new Date(approvalStatus.client_approved_at).toLocaleString() : '○ Pending'}`);
            doc.moveDown(0.5);
            
            // Sponsor
            doc.font('Helvetica-Bold').text('2. Project Sponsor: ', { continued: true });
            doc.font('Helvetica').text(approvalStatus.sponsor_name || 'N/A');
            doc.text(`   Email: ${approvalStatus.sponsor_email || 'N/A'}`);
            doc.text(`   Status: ${approvalStatus.sponsor_approved_at ? '✓ Approved on ' + new Date(approvalStatus.sponsor_approved_at).toLocaleString() : '○ Pending'}`);
            doc.moveDown(0.5);
            
            // Executive
            doc.font('Helvetica-Bold').text('3. Executive: ', { continued: true });
            doc.font('Helvetica').text(approvalStatus.executive_name || 'N/A');
            doc.text(`   Email: ${approvalStatus.executive_email || 'N/A'}`);
            doc.text(`   Status: ${approvalStatus.executive_approved_at ? '✓ Approved on ' + new Date(approvalStatus.executive_approved_at).toLocaleString() : '○ Pending'}`);
            doc.moveDown();
        }

        doc.moveTo(50, doc.y).lineTo(562, doc.y).stroke();
        doc.moveDown();

        // Responses
        doc.fontSize(14).font('Helvetica-Bold').text('Responses:', { underline: true });
        doc.moveDown(0.5);

        doc.fontSize(10).font('Helvetica');
        
        for (const [key, value] of Object.entries(parsedData)) {
            if (key.startsWith('_') || key === 'metadata') continue;

            const label = key
                .replace(/_/g, ' ')
                .replace(/([A-Z])/g, ' $1')
                .replace(/^./, str => str.toUpperCase())
                .trim();

            if (doc.y > 700) doc.addPage();

            doc.font('Helvetica-Bold').text(label + ':', { continued: false });
            
            let displayValue = '';
            if (typeof value === 'object' && value !== null) {
                displayValue = JSON.stringify(value, null, 2);
            } else if (value === true || value === 'true' || value === 'yes' || value === 'Yes') {
                displayValue = 'Yes';
            } else if (value === false || value === 'false' || value === 'no' || value === 'No') {
                displayValue = 'No';
            } else {
                displayValue = String(value || 'N/A');
            }

            doc.font('Helvetica').text(displayValue, { indent: 20 });
            doc.moveDown(0.5);
        }

        // Footer
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
// IMPLEMENTATION VALIDATION PAGE
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
        
        // Get user validation data for comparison
        let userValidationData = {};
        try {
            userValidationData = db.getSubmissionUserValidation(req.params.id);
        } catch (e) {}
        
        // Get approval status
        let approvalStatus = null;
        try {
            approvalStatus = db.getApprovalStatus(req.params.id);
        } catch (e) {}
        
        // Calculate validation stats
        let metCount = 0, notMetCount = 0, totalCount = 0;
        Object.values(validationData).forEach(v => {
            totalCount++;
            if (v.met === 'yes') metCount++;
            else if (v.met === 'no') notMetCount++;
        });
        const validationComplete = totalCount > 0 && (metCount + notMetCount) === totalCount;

        res.render('admin/submission-validation', {
            title: `Validation: ${submission.clientName || 'Unknown'}`,
            layout: 'admin',
            submission,
            parsedData,
            validationData,
            userValidationData,
            approvalStatus,
            validationComplete,
            validationStats: { metCount, notMetCount, totalCount }
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
        
        // Add audit log
        let metCount = 0, notMetCount = 0;
        Object.values(parsedValidation).forEach(v => {
            if (v.met === 'yes') metCount++;
            else if (v.met === 'no') notMetCount++;
        });
        const adminEmail = req.session.adminEmail || 'admin@cloudstrucc.com';
        db.addAuditLog(req.params.id, 'admin_validated', adminEmail, 'admin', { metCount, notMetCount });

        req.flash('success', 'Validation saved successfully');
        res.redirect(`/admin/submissions/${req.params.id}/validation`);
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
            parsedData = typeof submission.data === 'string' 
                ? JSON.parse(submission.data) 
                : (submission.data || {});
        } catch (e) {}

        let validationData = {};
        try {
            validationData = submission.validation_data 
                ? (typeof submission.validation_data === 'string' 
                    ? JSON.parse(submission.validation_data) 
                    : submission.validation_data)
                : {};
        } catch (e) {}
        
        // Get approval status for PDF
        let approvalStatus = null;
        try {
            approvalStatus = db.getApprovalStatus(req.params.id);
        } catch (e) {}

        const doc = new PDFDocument({
            size: 'LETTER',
            margins: { top: 50, bottom: 50, left: 50, right: 50 }
        });

        const filename = `validation-${submission.clientName || submission.id}-${Date.now()}.pdf`;
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

        doc.pipe(res);

        // Header
        doc.fontSize(20).font('Helvetica-Bold').text('Implementation Validation Report', { align: 'center' });
        doc.fontSize(12).font('Helvetica').text(submission.formName || 'Requirements Validation', { align: 'center' });
        doc.moveDown();

        // Metadata
        doc.fontSize(12).font('Helvetica');
        doc.text(`Client: ${submission.clientName || 'N/A'}`);
        doc.text(`Company: ${submission.companyName || 'N/A'}`);
        doc.text(`Generated: ${new Date().toLocaleString()}`);
        doc.moveDown();
        
        // APPROVAL SECTION (if approvals exist)
        if (approvalStatus) {
            doc.moveTo(50, doc.y).lineTo(562, doc.y).stroke();
            doc.moveDown();
            
            doc.fontSize(14).font('Helvetica-Bold').fillColor('#9b59b6').text('Project Approvals', { underline: true });
            doc.fillColor('black');
            doc.moveDown(0.5);
            
            doc.fontSize(10).font('Helvetica');
            
            // Client
            doc.font('Helvetica-Bold').text('1. Client: ', { continued: true });
            doc.font('Helvetica').text(approvalStatus.client_name || 'N/A');
            doc.text(`   Email: ${approvalStatus.client_email || 'N/A'}`);
            doc.text(`   Status: ${approvalStatus.client_approved_at ? '✓ Approved on ' + new Date(approvalStatus.client_approved_at).toLocaleString() : '○ Pending'}`);
            if (approvalStatus.client_comments) doc.text(`   Comments: ${approvalStatus.client_comments}`);
            doc.moveDown(0.5);
            
            // Sponsor
            doc.font('Helvetica-Bold').text('2. Project Sponsor: ', { continued: true });
            doc.font('Helvetica').text(approvalStatus.sponsor_name || 'N/A');
            doc.text(`   Email: ${approvalStatus.sponsor_email || 'N/A'}`);
            doc.text(`   Status: ${approvalStatus.sponsor_approved_at ? '✓ Approved on ' + new Date(approvalStatus.sponsor_approved_at).toLocaleString() : '○ Pending'}`);
            if (approvalStatus.sponsor_comments) doc.text(`   Comments: ${approvalStatus.sponsor_comments}`);
            doc.moveDown(0.5);
            
            // Executive
            doc.font('Helvetica-Bold').text('3. Executive: ', { continued: true });
            doc.font('Helvetica').text(approvalStatus.executive_name || 'N/A');
            doc.text(`   Email: ${approvalStatus.executive_email || 'N/A'}`);
            doc.text(`   Status: ${approvalStatus.executive_approved_at ? '✓ Approved on ' + new Date(approvalStatus.executive_approved_at).toLocaleString() : '○ Pending'}`);
            if (approvalStatus.executive_comments) doc.text(`   Comments: ${approvalStatus.executive_comments}`);
            doc.moveDown();
        }

        doc.moveTo(50, doc.y).lineTo(562, doc.y).stroke();
        doc.moveDown();

        // Validation Summary
        let metCount = 0;
        let notMetCount = 0;
        let totalCount = 0;

        Object.values(validationData).forEach(v => {
            totalCount++;
            if (v.met === 'yes') metCount++;
            else if (v.met === 'no') notMetCount++;
        });

        doc.fontSize(14).font('Helvetica-Bold').text('Validation Summary:', { underline: true });
        doc.moveDown(0.5);

        doc.fontSize(12).font('Helvetica');
        doc.text(`Total Requirements: ${totalCount}`);
        doc.text(`Requirements Met: ${metCount}`);
        doc.text(`Requirements Not Met: ${notMetCount}`);
        doc.text(`Completion: ${totalCount > 0 ? Math.round(((metCount + notMetCount) / totalCount) * 100) : 0}%`);
        doc.moveDown();

        doc.moveTo(50, doc.y).lineTo(562, doc.y).stroke();
        doc.moveDown();

        // Detailed validation
        doc.fontSize(14).font('Helvetica-Bold').text('Detailed Validation:', { underline: true });
        doc.moveDown(0.5);

        doc.fontSize(9).font('Helvetica');

        let rowNum = 0;
        for (const [key, value] of Object.entries(parsedData)) {
            if (key.startsWith('_') || key === 'metadata') continue;
            rowNum++;

            const fieldValidation = validationData[key] || {};
            const label = key
                .replace(/_/g, ' ')
                .replace(/([A-Z])/g, ' $1')
                .replace(/^./, str => str.toUpperCase())
                .trim();

            if (doc.y > 680) doc.addPage();

            const status = fieldValidation.met === 'yes' ? '✓ MET' : 
                          fieldValidation.met === 'no' ? '✗ NOT MET' : '○ N/A';

            doc.font('Helvetica-Bold').text(`${rowNum}. ${label}`, { continued: false });

            let displayValue = '';
            if (typeof value === 'boolean') {
                displayValue = value ? 'Yes' : 'No';
            } else if (typeof value === 'object' && value !== null) {
                displayValue = JSON.stringify(value);
            } else {
                displayValue = String(value || 'N/A');
            }

            doc.font('Helvetica').text(`   Response: ${displayValue}`);
            doc.text(`   Status: ${status}`);
            
            if (fieldValidation.comment) {
                doc.text(`   Comment: ${fieldValidation.comment}`);
            }
            
            doc.moveDown(0.3);
        }

        // Footer
        doc.moveDown(2);
        doc.fontSize(8).fillColor('gray');
        doc.text(`Generated on ${new Date().toLocaleString()} by Cloudstrucc BA Forms`, { align: 'center' });

        doc.end();

    } catch (error) {
        console.error('Validation PDF export error:', error);
        req.flash('error', 'Error generating validation PDF');
        res.redirect(`/admin/submissions/${req.params.id}/validation`);
    }
});

// =============================================================
// ATTACHMENTS
// =============================================================
router.post('/submissions/:id/attachments', async (req, res) => {
    try {
        const { fileName, fileUrl, description } = req.body;

        if (!fileName || !fileUrl) {
            return res.status(400).json({ error: 'File name and URL are required' });
        }

        const attachment = db.addSubmissionAttachment(req.params.id, {
            fileName,
            fileUrl,
            description: description || null,
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

// Delete submission
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

// Settings page
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
// VIEW USER'S VALIDATION DATA
// =============================================================
router.get('/submissions/:id/user-validation', async (req, res) => {
    try {
        const submission = db.getSubmissionById(req.params.id);
        
        if (!submission) {
            req.flash('error', 'Submission not found');
            return res.redirect('/admin/submissions');
        }
        
        // Parse submission data
        let parsedData = {};
        try {
            parsedData = typeof submission.data === 'string' 
                ? JSON.parse(submission.data) 
                : (submission.data || {});
        } catch (e) {}
        
        // Get user validation data
        let userValidationData = {};
        try {
            userValidationData = db.getSubmissionUserValidation(req.params.id);
        } catch (e) {}
        
        // Get admin validation data
        let adminValidationData = {};
        try {
            adminValidationData = db.getSubmissionValidation(req.params.id);
        } catch (e) {}
        
        // Get admin comments/replies
        let adminComments = {};
        try {
            adminComments = db.getSubmissionAdminComments(req.params.id);
        } catch (e) {}
        
        // Get audit log
        let auditLog = [];
        try {
            auditLog = db.getAuditLog(req.params.id);
        } catch (e) {}
        
        res.render('admin/user-validation-view', {
            title: `Client Validation: ${submission.clientName}`,
            layout: 'admin',
            submission,
            parsedData,
            userValidationData,
            adminValidationData,
            adminComments,
            auditLog
        });
    } catch (error) {
        console.error('User validation view error:', error);
        req.flash('error', 'Error loading validation data');
        res.redirect(`/admin/submissions/${req.params.id}`);
    }
});

// =============================================================
// GET AUDIT LOG (JSON endpoint for modal)
// =============================================================
router.get('/submissions/:id/audit-log', async (req, res) => {
    try {
        const auditLog = db.getAuditLog(req.params.id);
        res.json({ success: true, auditLog });
    } catch (error) {
        console.error('Audit log error:', error);
        res.status(500).json({ success: false, error: 'Error fetching audit log' });
    }
});

// =============================================================
// SAVE ADMIN COMMENTS/REPLIES
// =============================================================
router.post('/submissions/:id/admin-comments', async (req, res) => {
    try {
        const { comments } = req.body;
        const adminEmail = req.session.adminEmail || 'admin@cloudstrucc.com';
        
        db.updateSubmissionAdminComments(req.params.id, comments, adminEmail);
        
        res.json({ success: true, message: 'Admin comments saved' });
    } catch (error) {
        console.error('Save admin comments error:', error);
        res.status(500).json({ success: false, error: 'Error saving comments' });
    }
});

// =============================================================
// VALIDATION WORKFLOW - Send back to user for validation
// =============================================================
router.post('/submissions/:id/send-for-validation', async (req, res) => {
    try {
        const submission = db.getSubmissionById(req.params.id);
        
        if (!submission) {
            req.flash('error', 'Submission not found');
            return res.redirect('/admin/submissions');
        }
        
        // Get filtered fields from request body (if any)
        let filteredFields = null;
        if (req.body.filteredFields) {
            try {
                filteredFields = typeof req.body.filteredFields === 'string' 
                    ? JSON.parse(req.body.filteredFields) 
                    : req.body.filteredFields;
            } catch (e) {
                console.error('Error parsing filtered fields:', e);
            }
        }
        
        const adminEmail = req.session.adminEmail || 'admin@cloudstrucc.com';
        
        // Update submission status to allow user validation (with filtered fields)
        db.updateSubmissionValidationStatus(req.params.id, 'pending_user_validation', adminEmail, filteredFields);
        
        // Send email notification to user if email service is configured
        if (submission.clientEmail) {
            try {
                const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
                await emailService.sendValidationRequest({
                    to: submission.clientEmail,
                    clientName: submission.clientName,
                    formTitle: submission.formName,
                    validationLink: `${baseUrl}/validate/submission/${submission.inviteCode}/${submission.id}/validate`
                });
                req.flash('success', `Validation request sent to ${submission.clientEmail}`);
            } catch (emailError) {
                console.error('Email error:', emailError);
                req.flash('warning', 'Submission opened for validation but email notification failed');
            }
        } else {
            req.flash('success', 'Submission opened for user validation');
        }
        
        res.redirect(`/admin/submissions/${req.params.id}`);
    } catch (error) {
        console.error('Send for validation error:', error);
        req.flash('error', 'Error sending for validation');
        res.redirect(`/admin/submissions/${req.params.id}`);
    }
});

// =============================================================
// APPROVAL WORKFLOW - Initiate approval process
// =============================================================
router.get('/submissions/:id/approval', async (req, res) => {
    try {
        const approvalStatus = db.getApprovalStatus(req.params.id);
        const submission = db.getSubmissionById(req.params.id);
        
        // Check if validation is complete
        let validationData = {};
        try {
            validationData = submission.validation_data 
                ? (typeof submission.validation_data === 'string' 
                    ? JSON.parse(submission.validation_data) 
                    : submission.validation_data)
                : {};
        } catch (e) {}
        
        let metCount = 0, notMetCount = 0, totalCount = 0;
        Object.values(validationData).forEach(v => {
            totalCount++;
            if (v.met === 'yes') metCount++;
            else if (v.met === 'no') notMetCount++;
        });
        const canInitiate = totalCount > 0 && (metCount + notMetCount) === totalCount && !approvalStatus;
        
        res.json({ 
            success: true, 
            hasApproval: !!approvalStatus, 
            approval: approvalStatus,
            canInitiate
        });
    } catch (error) {
        console.error('Get approval status error:', error);
        res.status(500).json({ success: false, error: 'Error fetching approval status' });
    }
});

router.post('/submissions/:id/approval', async (req, res) => {
    try {
        const submission = db.getSubmissionById(req.params.id);
        
        if (!submission) {
            return res.status(404).json({ success: false, error: 'Submission not found' });
        }
        
        // Check if approval already exists
        const existingApproval = db.getApprovalBySubmissionId(req.params.id);
        if (existingApproval) {
            return res.status(400).json({ success: false, error: 'Approval workflow already initiated' });
        }
        
        const { sponsorName, sponsorEmail, executiveName, executiveEmail } = req.body;
        
        if (!sponsorName || !sponsorEmail || !executiveName || !executiveEmail) {
            return res.status(400).json({ success: false, error: 'All stakeholder fields are required' });
        }
        
        const adminEmail = req.session.adminEmail || 'admin@cloudstrucc.com';
        const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
        
        // Create approval record
        const approval = db.createApproval(req.params.id, {
            clientName: submission.clientName,
            clientEmail: submission.clientEmail,
            sponsorName,
            sponsorEmail,
            executiveName,
            executiveEmail,
            initiatedBy: adminEmail
        });
        
        // Generate approval links
        const approvalLinks = {
            client: {
                name: submission.clientName,
                email: submission.clientEmail,
                link: `${baseUrl}/approve/${approval.clientAccessCode}`,
                role: 'Client'
            },
            sponsor: {
                name: sponsorName,
                email: sponsorEmail,
                link: `${baseUrl}/approve/${approval.sponsorAccessCode}`,
                role: 'Project Sponsor'
            },
            executive: {
                name: executiveName,
                email: executiveEmail,
                link: `${baseUrl}/approve/${approval.executiveAccessCode}`,
                role: 'Executive'
            }
        };
        
        // Try to send email to client (first approver)
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
            } catch (emailError) {
                console.error('Approval email error:', emailError);
            }
        }
        
        res.json({ 
            success: true, 
            message: 'Approval workflow initiated',
            approvalLinks
        });
    } catch (error) {
        console.error('Create approval error:', error);
        res.status(500).json({ success: false, error: 'Error initiating approval' });
    }
});

// Resend approval email
router.post('/submissions/:id/approval/resend/:role', async (req, res) => {
    try {
        const approval = db.getApprovalBySubmissionId(req.params.id);
        if (!approval) {
            return res.status(404).json({ success: false, error: 'No approval found' });
        }
        
        const submission = db.getSubmissionById(req.params.id);
        const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
        const role = req.params.role;
        
        let to, name, link;
        switch (role) {
            case 'client':
                to = approval.client_email;
                name = approval.client_name;
                link = `${baseUrl}/approve/${approval.client_access_code}`;
                break;
            case 'sponsor':
                to = approval.sponsor_email;
                name = approval.sponsor_name;
                link = `${baseUrl}/approve/${approval.sponsor_access_code}`;
                break;
            case 'executive':
                to = approval.executive_email;
                name = approval.executive_name;
                link = `${baseUrl}/approve/${approval.executive_access_code}`;
                break;
            default:
                return res.status(400).json({ success: false, error: 'Invalid role' });
        }
        
        if (emailService.isConfigured()) {
            await emailService.sendApprovalRequest({
                to,
                stakeholderName: name,
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
        console.error('Resend approval email error:', error);
        res.status(500).json({ success: false, error: 'Error resending email' });
    }
});

module.exports = router;