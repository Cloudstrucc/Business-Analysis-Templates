// routes/validation.js
// Public routes for user validation workflow (no admin auth required)

const express = require('express');
const router = express.Router();
const db = require('../models/database');
const formLoader = require('../utils/formLoader');

// =============================================================
// USER SUBMISSION VIEW (after submission is complete)
// =============================================================
router.get('/submission/:code/:submissionId', async (req, res) => {
    try {
        const { code, submissionId } = req.params;
        
        // Verify invite code is valid
        const invite = db.getInviteByCode(code);
        if (!invite) {
            return res.render('error', {
                title: 'Invalid Link',
                message: 'This link is invalid or has expired.',
                layout: 'main'
            });
        }
        
        // Get submission
        const submission = db.getSubmissionById(submissionId);
        if (!submission || submission.invite_id !== invite.id) {
            return res.render('error', {
                title: 'Submission Not Found',
                message: 'The requested submission was not found.',
                layout: 'main'
            });
        }
        
        // Parse submission data
        let parsedData = {};
        try {
            parsedData = typeof submission.data === 'string' 
                ? JSON.parse(submission.data) 
                : (submission.data || {});
        } catch (e) {
            console.error('Error parsing submission data:', e);
        }
        
        // Get validation status
        const validationStatus = db.getSubmissionValidationStatus(submissionId);
        
        // Get user validation data if exists
        let userValidationData = {};
        try {
            userValidationData = db.getSubmissionUserValidation(submissionId);
        } catch (e) {
            console.error('Error getting user validation:', e);
        }
        
        // Get attachments
        const attachments = db.getSubmissionAttachments(submissionId);
        
        res.render('user/submission-view', {
            title: `Submission: ${submission.formName}`,
            layout: 'main',
            submission,
            invite,
            parsedData,
            validationStatus,
            userValidationData,
            attachments,
            canValidate: validationStatus === 'pending_user_validation' || submission.status === 'waiting_for_validation',
            isReadOnly: validationStatus === 'user_submitted' && submission.status === 'submitted',
            dataJson: JSON.stringify(parsedData, null, 2)
        });
    } catch (error) {
        console.error('User submission view error:', error);
        res.render('error', {
            title: 'Error',
            message: 'An error occurred while loading the submission.',
            layout: 'main'
        });
    }
});

// =============================================================
// USER VALIDATION PAGE
// =============================================================
router.get('/submission/:code/:submissionId/validate', async (req, res) => {
    try {
        const { code, submissionId } = req.params;
        
        // Verify invite code
        const invite = db.getInviteByCode(code);
        if (!invite) {
            return res.render('error', {
                title: 'Invalid Link',
                message: 'This link is invalid or has expired.',
                layout: 'main'
            });
        }
        
        // Get submission
        const submission = db.getSubmissionById(submissionId);
        if (!submission || submission.invite_id !== invite.id) {
            return res.render('error', {
                title: 'Submission Not Found',
                message: 'The requested submission was not found.',
                layout: 'main'
            });
        }
        
        // Check if validation is allowed
        const validationStatus = db.getSubmissionValidationStatus(submissionId);
        if (validationStatus !== 'pending_user_validation') {
            // Also check by main status
            if (submission.status !== 'waiting_for_validation') {
                return res.render('error', {
                    title: 'Validation Not Available',
                    message: validationStatus === 'user_submitted' || submission.status === 'submitted'
                        ? 'You have already submitted your validation. Please wait for admin review.'
                        : 'Validation is not currently available for this submission.',
                    layout: 'main'
                });
            }
        }
        
        // Parse submission data
        let parsedData = {};
        try {
            parsedData = typeof submission.data === 'string' 
                ? JSON.parse(submission.data) 
                : (submission.data || {});
        } catch (e) {
            console.error('Error parsing submission data:', e);
        }
        
        // Get filtered fields (if admin selected specific fields)
        let filteredFields = null;
        try {
            filteredFields = db.getSubmissionFilteredFields(submissionId);
        } catch (e) {}
        
        // If filtered fields exist, filter the parsedData to only show those fields
        if (filteredFields && Array.isArray(filteredFields) && filteredFields.length > 0) {
            const filteredData = {};
            filteredFields.forEach(field => {
                if (parsedData.hasOwnProperty(field)) {
                    filteredData[field] = parsedData[field];
                }
            });
            parsedData = filteredData;
        }
        
        // Get existing user validation data
        let userValidationData = {};
        try {
            userValidationData = db.getSubmissionUserValidation(submissionId);
        } catch (e) {}
        
        // Get admin comments/replies
        let adminComments = {};
        try {
            adminComments = db.getSubmissionAdminComments(submissionId);
        } catch (e) {}
        
        res.render('user/submission-validation', {
            title: `Validate: ${submission.formName}`,
            layout: 'main',
            submission,
            invite,
            parsedData,
            userValidationData,
            adminComments,
            code,
            isFiltered: filteredFields && filteredFields.length > 0
        });
    } catch (error) {
        console.error('User validation page error:', error);
        res.render('error', {
            title: 'Error',
            message: 'An error occurred while loading the validation page.',
            layout: 'main'
        });
    }
});

// =============================================================
// SAVE USER VALIDATION (POST)
// =============================================================
router.post('/submission/:code/:submissionId/validate', async (req, res) => {
    try {
        const { code, submissionId } = req.params;
        const { validationData } = req.body;
        
        // Verify invite code
        const invite = db.getInviteByCode(code);
        if (!invite) {
            return res.status(403).json({ error: 'Invalid link' });
        }
        
        // Get submission
        const submission = db.getSubmissionById(submissionId);
        if (!submission || submission.invite_id !== invite.id) {
            return res.status(404).json({ error: 'Submission not found' });
        }
        
        // Check if validation is allowed
        const validationStatus = db.getSubmissionValidationStatus(submissionId);
        if (validationStatus !== 'pending_user_validation' && submission.status !== 'waiting_for_validation') {
            return res.status(403).json({ error: 'Validation not allowed' });
        }
        
        // Parse validation data
        let parsedValidation = {};
        try {
            parsedValidation = typeof validationData === 'string' 
                ? JSON.parse(validationData) 
                : (validationData || {});
        } catch (e) {
            console.error('Error parsing validation data:', e);
        }
        
        // Save user validation (with actor = client email)
        db.updateSubmissionUserValidation(submissionId, parsedValidation, invite.client_email || 'user');
        
        req.flash('success', 'Your validation has been submitted successfully!');
        res.redirect(`/validate/submission/${code}/${submissionId}`);
    } catch (error) {
        console.error('Save user validation error:', error);
        req.flash('error', 'Error saving validation');
        res.redirect(`/validate/submission/${req.params.code}/${req.params.submissionId}/validate`);
    }
});

// =============================================================
// USER PDF EXPORT
// =============================================================
router.get('/submission/:code/:submissionId/export-pdf', async (req, res) => {
    try {
        const { code, submissionId } = req.params;
        
        // Verify invite code
        const invite = db.getInviteByCode(code);
        if (!invite) {
            return res.status(403).send('Invalid link');
        }
        
        // Get submission
        const submission = db.getSubmissionById(submissionId);
        if (!submission || submission.invite_id !== invite.id) {
            return res.status(404).send('Submission not found');
        }
        
        let PDFDocument;
        try {
            PDFDocument = require('pdfkit');
        } catch (e) {
            return res.status(500).send('PDF export not available');
        }
        
        let parsedData = {};
        try {
            parsedData = typeof submission.data === 'string' 
                ? JSON.parse(submission.data) 
                : (submission.data || {});
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
            } else if (value === true || value === 'true' || value === 'yes') {
                displayValue = 'Yes';
            } else if (value === false || value === 'false' || value === 'no') {
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
        console.error('User PDF export error:', error);
        res.status(500).send('Error generating PDF');
    }
});

module.exports = router;
