// routes/approval.js
// Public routes for stakeholder approval workflow (no admin auth required)

const express = require('express');
const router = express.Router();
const db = require('../models/database');

// =============================================================
// APPROVAL PAGE - Stakeholder views validation and approves
// =============================================================
router.get('/:accessCode', async (req, res) => {
    try {
        const { accessCode } = req.params;
        
        // Get approval by access code
        const approval = db.getApprovalByAccessCode(accessCode);
        if (!approval) {
            return res.render('error', {
                title: 'Invalid Link',
                message: 'This approval link is invalid or has expired.',
                layout: 'main'
            });
        }
        
        // Get submission details
        const submission = db.getSubmissionById(approval.submission_id);
        if (!submission) {
            return res.render('error', {
                title: 'Submission Not Found',
                message: 'The associated submission was not found.',
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
        
        // Calculate validation stats
        let metCount = 0, notMetCount = 0, totalCount = 0;
        Object.values(validationData).forEach(v => {
            totalCount++;
            if (v.met === 'yes') metCount++;
            else if (v.met === 'no') notMetCount++;
        });
        
        // Check if this stakeholder can approve
        const canApproveNow = db.canApprove(approval, approval.accessRole);
        
        // Check if already approved
        let alreadyApproved = false;
        let approvedAt = null;
        switch (approval.accessRole) {
            case 'client':
                alreadyApproved = !!approval.client_approved_at;
                approvedAt = approval.client_approved_at;
                break;
            case 'sponsor':
                alreadyApproved = !!approval.sponsor_approved_at;
                approvedAt = approval.sponsor_approved_at;
                break;
            case 'executive':
                alreadyApproved = !!approval.executive_approved_at;
                approvedAt = approval.executive_approved_at;
                break;
        }
        
        // Determine waiting message
        let waitingMessage = null;
        if (!canApproveNow && !alreadyApproved) {
            if (approval.accessRole === 'sponsor' && !approval.client_approved_at) {
                waitingMessage = `Waiting for ${approval.client_name} (Client) to approve first.`;
            } else if (approval.accessRole === 'executive' && !approval.sponsor_approved_at) {
                waitingMessage = `Waiting for ${approval.sponsor_name} (Project Sponsor) to approve first.`;
            }
        }
        
        res.render('approval/approve', {
            title: `Approval Request - ${submission.formName}`,
            layout: 'main',
            submission,
            approval,
            parsedData,
            validationData,
            accessCode,
            role: approval.accessRole,
            roleName: approval.accessRole === 'client' ? 'Client' : 
                      approval.accessRole === 'sponsor' ? 'Project Sponsor' : 'Executive',
            approverName: approval.accessName,
            approverEmail: approval.accessEmail,
            canApprove: canApproveNow,
            alreadyApproved,
            approvedAt,
            waitingMessage,
            stats: {
                metCount,
                notMetCount,
                totalCount,
                completionRate: totalCount > 0 ? Math.round((metCount / totalCount) * 100) : 0
            }
        });
    } catch (error) {
        console.error('Approval page error:', error);
        res.render('error', {
            title: 'Error',
            message: 'An error occurred while loading the approval page.',
            layout: 'main'
        });
    }
});

// =============================================================
// SUBMIT APPROVAL (POST)
// =============================================================
router.post('/:accessCode', async (req, res) => {
    try {
        const { accessCode } = req.params;
        const { comments } = req.body;
        
        // Submit the approval
        const result = db.submitApproval(accessCode, comments || '');
        
        if (!result.success) {
            req.flash('error', result.error);
            return res.redirect(`/approve/${accessCode}`);
        }
        
        // Redirect to confirmation page
        res.redirect(`/approve/${accessCode}/confirmed`);
    } catch (error) {
        console.error('Submit approval error:', error);
        req.flash('error', 'Error submitting approval');
        res.redirect(`/approve/${req.params.accessCode}`);
    }
});

// =============================================================
// APPROVAL CONFIRMATION PAGE
// =============================================================
router.get('/:accessCode/confirmed', async (req, res) => {
    try {
        const { accessCode } = req.params;
        
        // Get approval by access code
        const approval = db.getApprovalByAccessCode(accessCode);
        if (!approval) {
            return res.render('error', {
                title: 'Invalid Link',
                message: 'This approval link is invalid.',
                layout: 'main'
            });
        }
        
        // Get submission details
        const submission = db.getSubmissionById(approval.submission_id);
        
        // Get full approval status
        const approvalStatus = db.getApprovalStatus(approval.submission_id);
        
        res.render('approval/confirmed', {
            title: 'Approval Submitted',
            layout: 'main',
            submission,
            approval,
            approvalStatus,
            role: approval.accessRole,
            roleName: approval.accessRole === 'client' ? 'Client' : 
                      approval.accessRole === 'sponsor' ? 'Project Sponsor' : 'Executive',
            approverName: approval.accessName,
            isComplete: approvalStatus.isComplete
        });
    } catch (error) {
        console.error('Approval confirmation error:', error);
        res.render('error', {
            title: 'Error',
            message: 'An error occurred.',
            layout: 'main'
        });
    }
});

// =============================================================
// APPROVAL PDF EXPORT (for stakeholders)
// =============================================================
router.get('/:accessCode/export-pdf', async (req, res) => {
    try {
        const { accessCode } = req.params;
        
        // Get approval by access code
        const approval = db.getApprovalByAccessCode(accessCode);
        if (!approval) {
            return res.status(403).send('Invalid link');
        }
        
        // Get submission details
        const submission = db.getSubmissionById(approval.submission_id);
        if (!submission) {
            return res.status(404).send('Submission not found');
        }
        
        let PDFDocument;
        try {
            PDFDocument = require('pdfkit');
        } catch (e) {
            return res.status(500).send('PDF export not available');
        }
        
        // Parse data
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
        
        const filename = `approval-report-${submission.clientName || submission.id}-${Date.now()}.pdf`;
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        
        doc.pipe(res);
        
        // Header
        doc.fontSize(20).font('Helvetica-Bold').text('Implementation Validation Report', { align: 'center' });
        doc.fontSize(12).font('Helvetica').text(submission.formName || 'Requirements Validation', { align: 'center' });
        doc.moveDown();
        
        // Project Info
        doc.fontSize(12).font('Helvetica');
        doc.text(`Client: ${submission.clientName || 'N/A'}`);
        doc.text(`Company: ${submission.companyName || 'N/A'}`);
        doc.text(`Generated: ${new Date().toLocaleString()}`);
        doc.moveDown();
        
        // Approval Status Section
        doc.moveTo(50, doc.y).lineTo(562, doc.y).stroke();
        doc.moveDown();
        
        doc.fontSize(14).font('Helvetica-Bold').fillColor('#9b59b6').text('Project Approvals', { underline: true });
        doc.fillColor('black');
        doc.moveDown(0.5);
        
        doc.fontSize(10).font('Helvetica');
        
        // Client approval
        doc.font('Helvetica-Bold').text('1. Client: ', { continued: true });
        doc.font('Helvetica').text(approval.client_name);
        doc.text(`   Email: ${approval.client_email}`);
        doc.text(`   Status: ${approval.client_approved_at ? '✓ Approved on ' + new Date(approval.client_approved_at).toLocaleString() : '○ Pending'}`);
        if (approval.client_comments) doc.text(`   Comments: ${approval.client_comments}`);
        doc.moveDown(0.5);
        
        // Sponsor approval
        doc.font('Helvetica-Bold').text('2. Project Sponsor: ', { continued: true });
        doc.font('Helvetica').text(approval.sponsor_name);
        doc.text(`   Email: ${approval.sponsor_email}`);
        doc.text(`   Status: ${approval.sponsor_approved_at ? '✓ Approved on ' + new Date(approval.sponsor_approved_at).toLocaleString() : '○ Pending'}`);
        if (approval.sponsor_comments) doc.text(`   Comments: ${approval.sponsor_comments}`);
        doc.moveDown(0.5);
        
        // Executive approval
        doc.font('Helvetica-Bold').text('3. Executive: ', { continued: true });
        doc.font('Helvetica').text(approval.executive_name);
        doc.text(`   Email: ${approval.executive_email}`);
        doc.text(`   Status: ${approval.executive_approved_at ? '✓ Approved on ' + new Date(approval.executive_approved_at).toLocaleString() : '○ Pending'}`);
        if (approval.executive_comments) doc.text(`   Comments: ${approval.executive_comments}`);
        doc.moveDown();
        
        doc.moveTo(50, doc.y).lineTo(562, doc.y).stroke();
        doc.moveDown();
        
        // Validation Summary
        doc.fontSize(14).font('Helvetica-Bold').text('Validation Summary', { underline: true });
        doc.moveDown(0.5);
        
        let metCount = 0, notMetCount = 0, totalCount = 0;
        Object.values(validationData).forEach(v => {
            totalCount++;
            if (v.met === 'yes') metCount++;
            else if (v.met === 'no') notMetCount++;
        });
        
        doc.fontSize(10).font('Helvetica');
        doc.text(`Requirements Met: ${metCount}`);
        doc.text(`Requirements Not Met: ${notMetCount}`);
        doc.text(`Total Requirements: ${totalCount}`);
        doc.text(`Completion Rate: ${totalCount > 0 ? Math.round((metCount / totalCount) * 100) : 0}%`);
        doc.moveDown();
        
        // Requirements Detail
        doc.fontSize(14).font('Helvetica-Bold').text('Requirements Detail', { underline: true });
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
            
            if (doc.y > 700) doc.addPage();
            
            const status = fieldValidation.met === 'yes' ? '✓ Met' : 
                          fieldValidation.met === 'no' ? '✗ Not Met' : '○ N/A';
            
            doc.font('Helvetica-Bold').text(`${rowNum}. ${label}`, { continued: false });
            doc.font('Helvetica').text(`   Response: ${typeof value === 'boolean' ? (value ? 'Yes' : 'No') : (value || 'N/A')}`);
            doc.text(`   Status: ${status}`);
            if (fieldValidation.comment) doc.text(`   Comment: ${fieldValidation.comment}`);
            doc.moveDown(0.3);
        }
        
        // Footer
        doc.moveDown(2);
        doc.fontSize(8).fillColor('gray');
        doc.text(`Generated on ${new Date().toLocaleString()} by Cloudstrucc BA Forms`, { align: 'center' });
        doc.text('https://business-requirements.cloudstrucc.com', { align: 'center' });
        
        doc.end();
        
    } catch (error) {
        console.error('Approval PDF export error:', error);
        res.status(500).send('Error generating PDF');
    }
});

module.exports = router;