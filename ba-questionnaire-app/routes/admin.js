// routes/admin.js
// Updated with PDF export, Implementation Validation, and File Attachments features

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

// Reload forms
router.post('/forms/reload', async (req, res) => {
    try {
        formLoader.reloadForms();
        req.flash('success', 'Forms reloaded successfully');
    } catch (error) {
        console.error('Reload forms error:', error);
        req.flash('error', 'Error reloading forms');
    }
    res.redirect('/admin/forms');
});

// Invites list
router.get('/invites', async (req, res) => {
    try {
        const invites = db.getAllInvites();

        res.render('admin/invites', {
            title: 'Manage Invites',
            layout: 'admin',
            invites
        });
    } catch (error) {
        console.error('Invites error:', error);
        req.flash('error', 'Error loading invites');
        res.redirect('/admin/dashboard');
    }
});

// New invite form
router.get('/invites/new', async (req, res) => {
    try {
        // First, sync forms from formLoader to database if needed
        const loadedForms = formLoader.getAllForms();
        console.log('Forms from formLoader:', loadedForms.length);
        
        for (const form of loadedForms) {
            const existing = db.getFormBySlug(form.slug);
            if (!existing) {
                console.log('Creating form in DB:', form.slug, form.title);
                db.createForm({
                    slug: form.slug,
                    title: form.title,
                    description: form.description || '',
                    markdownFile: form.filename || form.relativePath || ''
                });
            }
        }
        
        // Now get forms from database (with numeric IDs)
        const forms = db.getAllForms();
        console.log('Forms from database:', forms.length, forms.map(f => ({ id: f.id, slug: f.slug })));

        res.render('admin/invite-new', {
            title: 'Create Invite',
            layout: 'admin',
            forms
        });
    } catch (error) {
        console.error('New invite error:', error);
        req.flash('error', 'Error loading form');
        res.redirect('/admin/invites');
    }
});

// Create invite POST - matches your form action="/admin/invites/create"
router.post('/invites/create', async (req, res) => {
    try {
        const { clientName, clientEmail, clientCompany, forms, expiresAt, submissionDeadline, sendEmail } = req.body;

        console.log('Creating invite for:', clientName);
        console.log('Selected forms from request:', forms);

        // Generate access code
        const accessCode = generateAccessCode();

        // Create invite
        const invite = db.createInvite({
            code: accessCode,
            clientEmail,
            clientName,
            clientCompany: clientCompany || null,
            expiresAt: expiresAt,
            submissionDeadline: submissionDeadline || null
        });

        console.log('Created invite:', invite);

        // Add forms to invite
        if (forms) {
            const formIds = Array.isArray(forms) ? forms : [forms];
            console.log('Form IDs to add:', formIds);
            for (const formId of formIds) {
                const parsedId = parseInt(formId);
                console.log('Adding form ID:', parsedId, 'to invite ID:', invite.id);
                db.addFormToInvite(invite.id, parsedId);
            }
            
            // Verify forms were added
            const addedForms = db.getInviteForms(invite.id);
            console.log('Forms after adding:', addedForms);
        }

        // Send email if requested
        if (sendEmail === 'on' && clientEmail) {
            try {
                const inviteForms = db.getInviteForms(invite.id);
                await emailService.sendInvite({
                    to: clientEmail,
                    clientName,
                    inviteCode: accessCode,
                    forms: inviteForms,
                    expiresAt: expiresAt,
                    submissionDeadline: submissionDeadline
                });
                req.flash('success', `Invite created and email sent to ${clientEmail}. Access code: ${accessCode}`);
            } catch (emailError) {
                console.error('Email error:', emailError);
                req.flash('warning', `Invite created but email failed to send. Access code: ${accessCode}`);
            }
        } else {
            req.flash('success', `Invite created successfully! Access code: ${accessCode}`);
        }

        res.redirect('/admin/invites');
    } catch (error) {
        console.error('Create invite error:', error);
        req.flash('error', 'Error creating invite: ' + error.message);
        res.redirect('/admin/invites/new');
    }
});

// Delete invite
router.post('/invites/:id/delete', async (req, res) => {
    try {
        db.deleteInvite(req.params.id);
        req.flash('success', 'Invite deleted');
    } catch (error) {
        console.error('Delete invite error:', error);
        req.flash('error', 'Error deleting invite');
    }
    res.redirect('/admin/invites');
});

// View invite details
router.get('/invites/:id', async (req, res) => {
    try {
        const invite = db.getInviteById(req.params.id);
        
        if (!invite) {
            req.flash('error', 'Invite not found');
            return res.redirect('/admin/invites');
        }
        
        const forms = db.getInviteForms(req.params.id);
        const submissions = db.getAllSubmissions().filter(s => s.invite_id == req.params.id);
        
        res.render('admin/invite-detail', {
            title: `Invite: ${invite.client_name}`,
            layout: 'admin',
            invite,
            forms,
            submissions
        });
    } catch (error) {
        console.error('Invite detail error:', error);
        req.flash('error', 'Error loading invite');
        res.redirect('/admin/invites');
    }
});

// Revoke invite
router.post('/invites/:id/revoke', async (req, res) => {
    try {
        db.revokeInvite(req.params.id);
        req.flash('success', 'Invite revoked');
    } catch (error) {
        console.error('Revoke invite error:', error);
        req.flash('error', 'Error revoking invite');
    }
    res.redirect('/admin/invites');
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

        res.render('admin/submission-detail', {
            title: `Submission: ${submission.clientName || 'Unknown'}`,
            layout: 'admin',
            submission,
            parsedData,
            validationData,
            attachments,
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

        res.render('admin/submission-validation', {
            title: `Validation: ${submission.clientName || 'Unknown'}`,
            layout: 'admin',
            submission,
            parsedData,
            validationData
        });
    } catch (error) {
        console.error('Validation page error:', error);
        req.flash('error', 'Error loading validation page');
        res.redirect('/admin/submissions');
    }
});

// Save validation data
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
        req.flash('success', 'Validation saved successfully');
        res.redirect(`/admin/submissions/${req.params.id}/validation`);
    } catch (error) {
        console.error('Save validation error:', error);
        req.flash('error', 'Error saving validation');
        res.redirect(`/admin/submissions/${req.params.id}/validation`);
    }
});

// Export validation as PDF
router.get('/submissions/:id/validation/export-pdf', async (req, res) => {
    try {
        let PDFDocument;
        try {
            PDFDocument = require('pdfkit');
        } catch (e) {
            req.flash('error', 'PDF export requires pdfkit. Run: npm install pdfkit');
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
        doc.moveDown();

        // Metadata
        doc.fontSize(12).font('Helvetica');
        doc.text(`Client: ${submission.clientName || 'N/A'}`);
        doc.text(`Company: ${submission.companyName || 'N/A'}`);
        doc.text(`Form: ${submission.formName || 'N/A'}`);
        doc.text(`Validation Date: ${new Date().toLocaleString()}`);
        doc.moveDown();

        doc.moveTo(50, doc.y).lineTo(562, doc.y).stroke();
        doc.moveDown();

        // Validation results
        doc.fontSize(14).font('Helvetica-Bold').text('Validation Results:', { underline: true });
        doc.moveDown(0.5);

        doc.fontSize(10).font('Helvetica');

        let totalItems = 0;
        let metCount = 0;
        let notMetCount = 0;

        for (const [key, value] of Object.entries(parsedData)) {
            if (key.startsWith('_') || key === 'metadata') continue;

            totalItems++;

            const label = key
                .replace(/_/g, ' ')
                .replace(/([A-Z])/g, ' $1')
                .replace(/^./, str => str.toUpperCase())
                .trim();

            if (doc.y > 650) doc.addPage();

            const fieldValidation = validationData[key] || {};
            const isMet = fieldValidation.met === 'yes';
            const comment = fieldValidation.comment || '';

            if (isMet) metCount++;
            else if (fieldValidation.met === 'no') notMetCount++;

            doc.font('Helvetica-Bold').text(label + ':', { continued: false });
            
            let displayValue = '';
            if (typeof value === 'object' && value !== null) {
                displayValue = JSON.stringify(value, null, 2);
            } else {
                displayValue = String(value || 'N/A');
            }
            doc.font('Helvetica').text(`Response: ${displayValue}`, { indent: 20 });
            
            const statusColor = isMet ? 'green' : 'red';
            const statusText = isMet ? 'REQUIREMENT MET' : 'REQUIREMENT NOT MET';
            doc.fillColor(statusColor).text(statusText, { indent: 20 });
            doc.fillColor('black');

            if (comment) {
                doc.font('Helvetica-Oblique').text(`Comment: ${comment}`, { indent: 20 });
            }

            doc.moveDown(0.5);
        }

        // Summary
        doc.addPage();
        doc.fontSize(16).font('Helvetica-Bold').text('Summary', { align: 'center' });
        doc.moveDown();
        
        doc.fontSize(12).font('Helvetica');
        doc.text(`Total Requirements: ${totalItems}`);
        doc.fillColor('green').text(`Requirements Met: ${metCount}`);
        doc.fillColor('red').text(`Requirements Not Met: ${notMetCount}`);
        doc.fillColor('black');
        
        const percentage = totalItems > 0 ? Math.round((metCount / totalItems) * 100) : 0;
        doc.moveDown();
        doc.fontSize(14).font('Helvetica-Bold').text(`Completion Rate: ${percentage}%`);

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
// FILE ATTACHMENTS (URL-based)
// =============================================================
router.post('/submissions/:id/attachments', async (req, res) => {
    try {
        const { fileName, fileUrl, description } = req.body;

        if (!fileName || !fileUrl) {
            return res.status(400).json({ error: 'File name and URL are required' });
        }

        try {
            new URL(fileUrl);
        } catch (e) {
            return res.status(400).json({ error: 'Invalid URL format' });
        }

        const attachment = db.addSubmissionAttachment(req.params.id, {
            fileName,
            fileUrl,
            description,
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
    } catch (error) {
        console.error('Delete submission error:', error);
        req.flash('error', 'Error deleting submission');
    }
    res.redirect('/admin/submissions');
});

// Helper function to generate access code
function generateAccessCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

// =============================================================
// SETTINGS PAGE
// =============================================================
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

module.exports = router;
