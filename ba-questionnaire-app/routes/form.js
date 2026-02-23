// routes/form.js
// Public form routes for clients accessing questionnaires

const express = require('express');
const router = express.Router();
const db = require('../models/database');
const formLoader = require('../utils/formLoader');
const { marked } = require('marked');

// =============================================================
// FORM PORTAL - Show available forms and submissions for an invite code
// =============================================================
router.get('/:code', async (req, res) => {
    try {
        const { code } = req.params;
        
        // Validate invite
        const invite = db.getInviteByCode(code);
        if (!invite) {
            return res.render('error', {
                title: 'Invalid Code',
                message: 'This access code is invalid or has expired.',
                layout: 'main'
            });
        }
        
        // Check if expired
        if (new Date(invite.expires_at) < new Date()) {
            return res.render('error', {
                title: 'Link Expired',
                message: 'This access link has expired. Please contact the administrator for a new invite.',
                layout: 'main'
            });
        }
        
        // Check if revoked
        if (invite.is_revoked) {
            return res.render('error', {
                title: 'Access Revoked',
                message: 'This access link has been revoked. Please contact the administrator.',
                layout: 'main'
            });
        }
        
        // Mark invite as accessed
        db.markInviteAccessed(code);
        
        // Get forms assigned to this invite
        const inviteForms = db.getInviteForms(invite.id);
        
        // Get all submissions for this invite with validation status
        const allSubmissions = db.getAllSubmissions().filter(s => s.invite_id === invite.id);
        
        // Add validation_status to each submission
        const submissions = allSubmissions.map(s => {
            const validationStatus = db.getSubmissionValidationStatus(s.id);
            return {
                ...s,
                validation_status: validationStatus,
                formSlug: s.formSlug
            };
        });
        
        // Find forms that don't have submissions yet
        const submittedFormIds = submissions.map(s => s.form_id);
        const availableForms = inviteForms.filter(f => !submittedFormIds.includes(f.id));
        
        res.render('form/portal', {
            title: 'Your Questionnaires',
            layout: 'main',
            invite,
            submissions,
            availableForms,
            inviteForms
        });
    } catch (error) {
        console.error('Form portal error:', error);
        res.render('error', {
            title: 'Error',
            message: 'An error occurred. Please try again.',
            layout: 'main'
        });
    }
});

// =============================================================
// START/CONTINUE FORM
// =============================================================
router.get('/:code/:formSlug', async (req, res) => {
    try {
        const { code, formSlug } = req.params;
        
        // Validate invite
        const invite = db.getInviteByCode(code);
        if (!invite) {
            return res.render('error', {
                title: 'Invalid Code',
                message: 'This access code is invalid or has expired.',
                layout: 'main'
            });
        }
        
        // Check expiration
        if (new Date(invite.expires_at) < new Date()) {
            return res.render('error', {
                title: 'Link Expired',
                message: 'This access link has expired.',
                layout: 'main'
            });
        }
        
        // Get form from database
        const form = db.getFormBySlug(formSlug);
        if (!form) {
            return res.render('error', {
                title: 'Form Not Found',
                message: 'The requested form was not found.',
                layout: 'main'
            });
        }
        
        // Check if form is assigned to this invite
        const inviteForms = db.getInviteForms(invite.id);
        const isAssigned = inviteForms.some(f => f.id === form.id);
        if (!isAssigned) {
            return res.render('error', {
                title: 'Access Denied',
                message: 'You do not have access to this form.',
                layout: 'main'
            });
        }
        
        // Get or create submission
        let submission = db.getSubmissionByInviteAndForm(invite.id, form.id);
        if (!submission) {
            const result = db.createSubmission(invite.id, form.id, '{}');
            submission = db.getSubmissionById(result.id);
        }
        
        // If already submitted, redirect to view
        if (submission.status === 'submitted') {
            return res.redirect(`/validate/submission/${code}/${submission.id}`);
        }
        
        // Get form content from formLoader
        const formContent = formLoader.getFormContent(formSlug);
        let htmlContent = '';
        if (formContent) {
            htmlContent = marked(formContent);
        }
        
        // Parse existing data
        let existingData = {};
        try {
            existingData = submission.data ? JSON.parse(submission.data) : {};
        } catch (e) {}
        
        res.render('form/questionnaire', {
            title: form.title,
            layout: 'main',
            invite,
            form,
            submission,
            htmlContent,
            existingData: JSON.stringify(existingData),
            formSlug
        });
    } catch (error) {
        console.error('Form view error:', error);
        res.render('error', {
            title: 'Error',
            message: 'An error occurred loading the form.',
            layout: 'main'
        });
    }
});

// =============================================================
// SAVE FORM (Auto-save / Draft)
// =============================================================
router.post('/:code/:formSlug/save', async (req, res) => {
    try {
        const { code, formSlug } = req.params;
        const { data, progress } = req.body;
        
        const invite = db.getInviteByCode(code);
        if (!invite) {
            return res.status(403).json({ error: 'Invalid code' });
        }
        
        const form = db.getFormBySlug(formSlug);
        if (!form) {
            return res.status(404).json({ error: 'Form not found' });
        }
        
        let submission = db.getSubmissionByInviteAndForm(invite.id, form.id);
        if (!submission) {
            const result = db.createSubmission(invite.id, form.id, data);
            submission = { id: result.id };
        } else {
            db.updateSubmissionData(submission.id, data, progress || 0);
        }
        
        res.json({ success: true, submissionId: submission.id });
    } catch (error) {
        console.error('Save form error:', error);
        res.status(500).json({ error: 'Error saving form' });
    }
});

// =============================================================
// SUBMIT FORM
// =============================================================
router.post('/:code/:formSlug/submit', async (req, res) => {
    try {
        const { code, formSlug } = req.params;
        const { data } = req.body;
        
        const invite = db.getInviteByCode(code);
        if (!invite) {
            req.flash('error', 'Invalid access code');
            return res.redirect(`/form/${code}`);
        }
        
        const form = db.getFormBySlug(formSlug);
        if (!form) {
            req.flash('error', 'Form not found');
            return res.redirect(`/form/${code}`);
        }
        
        let submission = db.getSubmissionByInviteAndForm(invite.id, form.id);
        if (!submission) {
            const result = db.createSubmission(invite.id, form.id, data);
            submission = { id: result.id };
        } else {
            db.updateSubmissionData(submission.id, data, 100);
        }
        
        // Mark as submitted
        db.submitSubmission(submission.id);
        
        // Send confirmation email if configured
        try {
            const emailService = require('../utils/emailService');
            await emailService.sendClientConfirmation({
                to: invite.client_email,
                clientName: invite.client_name,
                formTitle: form.title
            });
        } catch (emailError) {
            console.error('Email error:', emailError);
        }
        
        req.flash('success', 'Your questionnaire has been submitted successfully!');
        res.redirect(`/validate/submission/${code}/${submission.id}`);
    } catch (error) {
        console.error('Submit form error:', error);
        req.flash('error', 'Error submitting form');
        res.redirect(`/form/${req.params.code}`);
    }
});

module.exports = router;
