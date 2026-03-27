// routes/approve.js
// Public routes for external approvers to view and approve/return validation summaries

const express = require('express');
const router = express.Router();
const db = require('../models/database');
const emailService = require('../utils/emailService');

// GET Approver view page
router.get('/:token', async (req, res) => {
    try {
        const approver = db.getApproverByToken(req.params.token);
        
        if (!approver) {
            return res.status(404).render('error', {
                title: 'Not Found',
                message: 'This approval link is invalid or has expired.',
                layout: false
            });
        }

        const submission = db.getSubmissionById(approver.submission_id);
        if (!submission) {
            return res.status(404).render('error', {
                title: 'Not Found',
                message: 'The associated submission was not found.',
                layout: false
            });
        }

        const parsedData = typeof submission.data === 'string' ? JSON.parse(submission.data) : (submission.data || {});
        const validationData = db.getValidationData(approver.submission_id) || {};
        const allApprovers = db.getApprovers(approver.submission_id) || [];
        
        // Get met requirements only
        const metRequirements = [];
        let totalRequirements = 0;
        let metCount = 0;

        for (const [key, value] of Object.entries(parsedData)) {
            if (key.startsWith('_') || key === 'metadata') continue;
            
            totalRequirements++;
            
            const fieldValidation = validationData[key] || {};
            
            if (fieldValidation.met === 'yes') {
                metCount++;
                
                const label = key
                    .replace(/_/g, ' ')
                    .replace(/([A-Z])/g, ' $1')
                    .replace(/^./, str => str.toUpperCase())
                    .trim();
                
                // Determine category
                const keyLower = key.toLowerCase();
                let category = 'General';
                if (keyLower.includes('security') || keyLower.includes('auth')) category = 'Security';
                else if (keyLower.includes('perform')) category = 'Performance';
                else if (keyLower.includes('integrat') || keyLower.includes('api')) category = 'Integration';
                else if (keyLower.includes('ui') || keyLower.includes('ux')) category = 'UI/UX';
                else if (keyLower.includes('data') || keyLower.includes('storage')) category = 'Data Management';
                
                let responseType = 'other';
                let responseDisplay = '';
                if (typeof value === 'boolean') {
                    responseType = value ? 'yes' : 'no';
                    responseDisplay = value ? 'Yes' : 'No';
                } else if (value) {
                    responseDisplay = String(value);
                }
                
                metRequirements.push({
                    label,
                    category,
                    responseType,
                    responseDisplay,
                    comment: fieldValidation.comment || ''
                });
            }
        }

        // Get other approvers (excluding current)
        const otherApprovers = allApprovers.filter(a => a.id !== approver.id);

        // Check project status
        const projectClosed = submission.status === 'closed';
        const alreadyApproved = !!approver.approved_at;
        const alreadyReturned = !!approver.returned_at;

        res.render('approver-view', {
            title: `Approval Request - ${submission.formName}`,
            layout: false,
            submission,
            approver,
            metRequirements,
            otherApprovers,
            projectClosed,
            alreadyApproved,
            alreadyReturned,
            stats: {
                total: totalRequirements,
                met: metCount,
                percentMet: totalRequirements > 0 ? Math.round((metCount / totalRequirements) * 100) : 0
            }
        });
    } catch (error) {
        console.error('Approver view error:', error);
        res.status(500).render('error', {
            title: 'Error',
            message: 'An error occurred loading the approval page.',
            layout: false
        });
    }
});

// POST Submit approval or return
router.post('/:token/submit', async (req, res) => {
    try {
        const approver = db.getApproverByToken(req.params.token);
        
        if (!approver) {
            return res.status(404).json({ success: false, error: 'Invalid approval link' });
        }

        const submission = db.getSubmissionById(approver.submission_id);
        if (!submission) {
            return res.status(404).json({ success: false, error: 'Submission not found' });
        }

        // Check if project is closed
        if (submission.status === 'closed') {
            return res.status(400).json({ success: false, error: 'This project is already closed' });
        }

        const { action, reason } = req.body;

        if (action === 'approve') {
            db.updateApproverStatus(approver.id, {
                approved_at: new Date().toISOString(),
                returned_at: null,
                return_reason: null
            });

            db.addAuditLog(approver.submission_id, 'approved', approver.email, 'approver', {
                approverName: approver.name,
                approverRole: approver.role
            });

            // Check if all approvers have approved
            const allApprovers = db.getApprovers(approver.submission_id) || [];
            const allApproved = allApprovers.every(a => a.approved_at || a.id === approver.id);

            if (allApproved) {
                // Close the project
                db.updateSubmissionStatus(approver.submission_id, 'closed', new Date().toISOString());
                db.addAuditLog(approver.submission_id, 'project_closed', 'system', 'system', {
                    reason: 'All approvers approved'
                });

                // Notify admin
                // TODO: Send email notification to admin
            }

            res.json({ success: true, allApproved });
        } else if (action === 'return') {
            if (!reason) {
                return res.status(400).json({ success: false, error: 'Return reason is required' });
            }

            db.updateApproverStatus(approver.id, {
                returned_at: new Date().toISOString(),
                return_reason: reason,
                approved_at: null
            });

            db.addAuditLog(approver.submission_id, 'returned', approver.email, 'approver', {
                approverName: approver.name,
                approverRole: approver.role,
                reason
            });

            // TODO: Send email notification to admin about the return

            res.json({ success: true });
        } else {
            res.status(400).json({ success: false, error: 'Invalid action' });
        }
    } catch (error) {
        console.error('Submit approval error:', error);
        res.status(500).json({ success: false, error: 'Error processing approval' });
    }
});

// GET Download PDF for approver
router.get('/:token/pdf', async (req, res) => {
    try {
        const PDFDocument = require('pdfkit');
        const approver = db.getApproverByToken(req.params.token);
        
        if (!approver) {
            return res.status(404).send('Invalid approval link');
        }

        const submission = db.getSubmissionById(approver.submission_id);
        if (!submission) {
            return res.status(404).send('Submission not found');
        }

        const parsedData = typeof submission.data === 'string' ? JSON.parse(submission.data) : (submission.data || {});
        const validationData = db.getValidationData(approver.submission_id) || {};
        const allApprovers = db.getApprovers(approver.submission_id) || [];
        
        // Get met requirements
        const metRequirements = [];
        let totalRequirements = 0;
        let metCount = 0;

        for (const [key, value] of Object.entries(parsedData)) {
            if (key.startsWith('_') || key === 'metadata') continue;
            totalRequirements++;
            
            const fieldValidation = validationData[key] || {};
            if (fieldValidation.met === 'yes') {
                metCount++;
                const label = key.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim();
                let responseDisplay = '';
                if (typeof value === 'boolean') responseDisplay = value ? 'Yes' : 'No';
                else if (value) responseDisplay = String(value);
                
                metRequirements.push({
                    label,
                    responseDisplay,
                    comment: fieldValidation.comment || ''
                });
            }
        }

        const doc = new PDFDocument({ size: 'LETTER', margins: { top: 50, bottom: 50, left: 50, right: 50 } });
        const filename = `approval-summary-${submission.clientName || submission.id}.pdf`;
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        doc.pipe(res);

        // Header
        doc.fontSize(20).font('Helvetica-Bold').text('Approval Summary Report', { align: 'center' });
        doc.fontSize(12).font('Helvetica').text(submission.formName || 'Requirements Validation', { align: 'center' });
        doc.moveDown();

        // Client info
        doc.fontSize(12).font('Helvetica');
        doc.text(`Client: ${submission.clientName || 'N/A'}`);
        doc.text(`Company: ${submission.companyName || 'N/A'}`);
        doc.text(`Generated: ${new Date().toLocaleString()}`);
        doc.moveDown();

        // Stats
        doc.moveTo(50, doc.y).lineTo(562, doc.y).stroke();
        doc.moveDown();
        doc.fontSize(14).font('Helvetica-Bold').text('Summary:', { underline: true });
        doc.moveDown(0.5);
        doc.fontSize(12).font('Helvetica');
        doc.text(`Total Requirements: ${totalRequirements}`);
        doc.text(`Met Requirements: ${metCount}`);
        doc.text(`Completion Rate: ${totalRequirements > 0 ? Math.round((metCount / totalRequirements) * 100) : 0}%`);
        doc.moveDown();

        // Approvers
        if (allApprovers.length > 0) {
            doc.moveTo(50, doc.y).lineTo(562, doc.y).stroke();
            doc.moveDown();
            doc.fontSize(14).font('Helvetica-Bold').text('Approvers:', { underline: true });
            doc.moveDown(0.5);
            doc.fontSize(10).font('Helvetica');
            
            allApprovers.forEach((app, idx) => {
                const status = app.approved_at ? '✓ Approved' : app.returned_at ? '✗ Returned' : '○ Pending';
                doc.text(`${idx + 1}. ${app.name} (${app.email}) - ${status}`);
            });
            doc.moveDown();
        }

        // Met Requirements
        doc.moveTo(50, doc.y).lineTo(562, doc.y).stroke();
        doc.moveDown();
        doc.fontSize(14).font('Helvetica-Bold').fillColor('#198754').text('Met Requirements:', { underline: true });
        doc.fillColor('black');
        doc.moveDown(0.5);
        doc.fontSize(9).font('Helvetica');

        metRequirements.forEach((req, idx) => {
            if (doc.y > 680) doc.addPage();
            
            doc.font('Helvetica-Bold').text(`${idx + 1}. ${req.label}`);
            if (req.responseDisplay) {
                doc.font('Helvetica').text(`   Response: ${req.responseDisplay}`, { width: 500 });
            }
            if (req.comment) {
                doc.fillColor('#0066cc').text(`   Comment: ${req.comment}`, { width: 500 });
                doc.fillColor('black');
            }
            doc.moveDown(0.3);
        });

        doc.moveDown(2);
        doc.fontSize(8).fillColor('gray').text(`Generated by Cloudstrucc BA Forms`, { align: 'center' });
        doc.end();

    } catch (error) {
        console.error('Approver PDF error:', error);
        res.status(500).send('Error generating PDF');
    }
});

module.exports = router;
