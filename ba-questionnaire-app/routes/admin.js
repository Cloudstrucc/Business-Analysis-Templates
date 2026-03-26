// =====================================================
// VALIDATION ROUTE WITH SERVER-SIDE PAGINATION
// Replace the existing router.get('/submissions/:id/validation') route
// =====================================================

router.get('/submissions/:id/validation', async (req, res) => {
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
        
        // Get user validation data
        let userValidationData = {};
        try {
            userValidationData = db.getSubmissionUserValidation(req.params.id);
        } catch (e) {}
        
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

        // =====================================================
        // BUILD REQUIREMENTS ARRAY WITH CATEGORIES
        // =====================================================
        const allRequirements = [];
        let globalIndex = 0;
        
        for (const [key, value] of Object.entries(parsedData)) {
            if (key.startsWith('_') || key === 'metadata') continue;
            
            globalIndex++;
            
            // Derive label from key
            const label = key
                .replace(/_/g, ' ')
                .replace(/([A-Z])/g, ' $1')
                .replace(/^./, str => str.toUpperCase())
                .trim();
            
            // Derive category from key prefix or default
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
            
            // Get validation status
            const fieldValidation = validationData[key] || {};
            const userFieldValidation = userValidationData ? userValidationData[key] : null;
            
            // Determine response type
            let responseType = 'other';
            let responseDisplay = '';
            if (typeof value === 'boolean') {
                responseType = value ? 'yes' : 'no';
                responseDisplay = value ? 'Yes' : 'No';
            } else if (value) {
                responseDisplay = String(value);
            }
            
            // Determine admin status
            let adminStatus = 'pending';
            if (fieldValidation.met === 'yes') adminStatus = 'met';
            else if (fieldValidation.met === 'no') adminStatus = 'not-met';
            
            // Determine client validation status
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

        // =====================================================
        // QUERY PARAMETERS FOR FILTERING & PAGINATION
        // =====================================================
        const page = parseInt(req.query.page) || 1;
        const perPage = parseInt(req.query.perPage) || 25;
        const search = (req.query.search || '').toLowerCase().trim();
        const categoryFilter = req.query.category || 'all';
        const responseFilter = req.query.response || 'all'; // yes,no,other or 'all'
        const adminStatusFilter = req.query.adminStatus || 'all'; // met,not-met,pending or 'all'
        const clientStatusFilter = req.query.clientStatus || 'all'; // met,not-met,pending or 'all'

        // =====================================================
        // BUILD CATEGORY STATS (before filtering)
        // =====================================================
        const categoryStats = {};
        allRequirements.forEach(req => {
            if (!categoryStats[req.category]) {
                categoryStats[req.category] = { total: 0, met: 0, notMet: 0, pending: 0 };
            }
            categoryStats[req.category].total++;
            if (req.adminStatus === 'met') categoryStats[req.category].met++;
            else if (req.adminStatus === 'not-met') categoryStats[req.category].notMet++;
            else categoryStats[req.category].pending++;
        });
        
        // Convert to array and sort
        const categories = Object.entries(categoryStats)
            .map(([name, stats]) => ({ name, ...stats }))
            .sort((a, b) => a.name.localeCompare(b.name));

        // =====================================================
        // APPLY FILTERS
        // =====================================================
        let filteredRequirements = allRequirements;
        
        // Category filter
        if (categoryFilter !== 'all') {
            filteredRequirements = filteredRequirements.filter(r => r.category === categoryFilter);
        }
        
        // Search filter
        if (search) {
            filteredRequirements = filteredRequirements.filter(r => 
                r.label.toLowerCase().includes(search) || 
                r.key.toLowerCase().includes(search) ||
                (r.responseDisplay && r.responseDisplay.toLowerCase().includes(search))
            );
        }
        
        // Response filter
        if (responseFilter !== 'all') {
            const responseTypes = responseFilter.split(',');
            filteredRequirements = filteredRequirements.filter(r => responseTypes.includes(r.responseType));
        }
        
        // Admin status filter
        if (adminStatusFilter !== 'all') {
            const statuses = adminStatusFilter.split(',');
            filteredRequirements = filteredRequirements.filter(r => statuses.includes(r.adminStatus));
        }
        
        // Client status filter
        if (clientStatusFilter !== 'all') {
            const statuses = clientStatusFilter.split(',');
            filteredRequirements = filteredRequirements.filter(r => statuses.includes(r.clientStatus));
        }

        // =====================================================
        // PAGINATION
        // =====================================================
        const totalFiltered = filteredRequirements.length;
        const totalPages = perPage === -1 ? 1 : Math.ceil(totalFiltered / perPage);
        const currentPage = Math.min(Math.max(1, page), totalPages || 1);
        
        let paginatedRequirements;
        if (perPage === -1) {
            // Show all
            paginatedRequirements = filteredRequirements;
        } else {
            const startIndex = (currentPage - 1) * perPage;
            paginatedRequirements = filteredRequirements.slice(startIndex, startIndex + perPage);
        }

        // =====================================================
        // GROUP PAGINATED RESULTS BY CATEGORY
        // =====================================================
        const groupedRequirements = {};
        paginatedRequirements.forEach(req => {
            if (!groupedRequirements[req.category]) {
                groupedRequirements[req.category] = [];
            }
            groupedRequirements[req.category].push(req);
        });
        
        // Convert to array for template
        const categoryGroups = Object.entries(groupedRequirements)
            .map(([name, items]) => ({ name, items }))
            .sort((a, b) => a.name.localeCompare(b.name));

        // =====================================================
        // OVERALL STATS
        // =====================================================
        const totalRequirements = allRequirements.length;
        let metCount = 0, notMetCount = 0;
        allRequirements.forEach(r => {
            if (r.adminStatus === 'met') metCount++;
            else if (r.adminStatus === 'not-met') notMetCount++;
        });
        const pendingCount = totalRequirements - metCount - notMetCount;
        const validationComplete = totalRequirements > 0 && pendingCount === 0;

        // =====================================================
        // RENDER
        // =====================================================
        res.render('admin/submission-validation', {
            title: `Validation: ${submission.clientName || 'Unknown'}`,
            layout: 'admin',
            submission,
            
            // Paginated & grouped data
            categoryGroups,
            categories,
            
            // Pagination info
            pagination: {
                currentPage,
                totalPages,
                perPage,
                totalFiltered,
                totalRequirements,
                startItem: perPage === -1 ? 1 : ((currentPage - 1) * perPage) + 1,
                endItem: perPage === -1 ? totalFiltered : Math.min(currentPage * perPage, totalFiltered)
            },
            
            // Current filters
            filters: {
                search,
                category: categoryFilter,
                response: responseFilter,
                adminStatus: adminStatusFilter,
                clientStatus: clientStatusFilter
            },
            
            // Stats
            stats: {
                total: totalRequirements,
                met: metCount,
                notMet: notMetCount,
                pending: pendingCount,
                percentValidated: totalRequirements > 0 ? Math.round(((metCount + notMetCount) / totalRequirements) * 100) : 0,
                percentMet: totalRequirements > 0 ? Math.round((metCount / totalRequirements) * 100) : 0
            },
            
            // For client-side saving (need all keys)
            allFieldKeys: allRequirements.map(r => r.key),
            
            // For re-validation (visible field keys)
            visibleFieldKeys: filteredRequirements.map(r => r.key),
            
            // Other data
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

// =====================================================
// SEND FOR RE-VALIDATION (updated to accept visible fields)
// =====================================================
router.post('/submissions/:id/send-for-validation', async (req, res) => {
    try {
        const { filteredFields, message } = req.body;
        
        const submission = db.getSubmissionById(req.params.id);
        if (!submission) {
            return res.status(404).json({ success: false, error: 'Submission not found' });
        }
        
        // Generate validation access code
        const accessCode = require('crypto').randomBytes(32).toString('hex');
        
        // Store filtered fields for this validation request
        db.run(`
            UPDATE submissions 
            SET validation_access_code = ?,
                validation_filtered_fields = ?,
                validation_message = ?,
                validation_sent_at = datetime('now'),
                status = 'pending_validation'
            WHERE id = ?
        `, [accessCode, JSON.stringify(filteredFields), message || '', req.params.id]);
        
        // Send email to client
        const validationLink = `${process.env.BASE_URL || 'http://localhost:3000'}/validate/${accessCode}`;
        
        try {
            await emailService.sendValidationRequest({
                to: submission.clientEmail,
                clientName: submission.clientName,
                formTitle: submission.formName || 'Requirements',
                validationLink,
                message,
                fieldCount: Array.isArray(filteredFields) ? filteredFields.length : 0
            });
        } catch (emailError) {
            console.error('Email send error:', emailError);
        }
        
        // Add audit log
        const adminEmail = req.session.adminEmail || 'admin@cloudstrucc.com';
        db.addAuditLog(req.params.id, 'sent_for_revalidation', adminEmail, 'admin', {
            filteredFieldCount: Array.isArray(filteredFields) ? filteredFields.length : 0,
            message: message || ''
        });
        
        res.json({ 
            success: true, 
            validationLink,
            fieldCount: Array.isArray(filteredFields) ? filteredFields.length : 0
        });
    } catch (error) {
        console.error('Send for validation error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});
