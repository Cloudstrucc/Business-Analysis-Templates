const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = null;
    this.initialized = false;
  }

  initialize() {
    if (this.initialized) return;

    const host = process.env.SMTP_HOST || 'smtp.office365.com';
    const port = parseInt(process.env.SMTP_PORT || '587');
    const secure = process.env.SMTP_SECURE === 'true';
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    // In your emailService.js, the "from" should be the shared mailbox
    const mailOptions = {
      from: process.env.SMTP_FROM,  // "Cloudstrucc Requirements" <business-requirements@cloudstrucc.com>
      to: recipient,
      subject: subject,
      html: htmlContent
    };

    if (!user || !pass) {
      console.warn('Email service not configured. Set SMTP_USER and SMTP_PASS environment variables.');
      return;
    }

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
      tls: {
        ciphers: 'SSLv3',
        rejectUnauthorized: false
      }
    });

    this.initialized = true;
    console.log('Email service initialized');
  }

  /**
   * Send invite email to client
   */
  async sendInvite({ to, clientName, inviteCode, forms, expiresAt, submissionDeadline }) {
    if (!this.transporter) {
      console.log('Email service not available. Would send invite to:', to);
      return { success: false, message: 'Email service not configured' };
    }

    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    const inviteLink = `${baseUrl}/form/${inviteCode}`;
    
    const formList = forms.map(f => `<li>${f.title}</li>`).join('');
    const expiryDate = new Date(expiresAt).toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
    const deadlineDate = submissionDeadline ? new Date(submissionDeadline).toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    }) : null;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #0d1f3c 0%, #1a3a5c 100%); padding: 30px; text-align: center; }
    .header img { max-width: 180px; }
    .header h1 { color: #00a8e8; margin: 15px 0 0; font-size: 24px; }
    .content { background: #fff; padding: 30px; border: 1px solid #e0e0e0; }
    .btn { display: inline-block; background: #00a8e8; color: #fff; padding: 14px 28px; text-decoration: none; border-radius: 5px; font-weight: 600; margin: 20px 0; }
    .btn:hover { background: #0090c9; }
    .code-box { background: #f5f5f5; border: 2px dashed #00a8e8; padding: 15px; text-align: center; margin: 20px 0; border-radius: 8px; }
    .code { font-family: monospace; font-size: 24px; color: #0d1f3c; font-weight: bold; letter-spacing: 2px; }
    .forms-list { background: #f9f9f9; padding: 15px 20px; border-radius: 5px; margin: 20px 0; }
    .forms-list ul { margin: 10px 0; padding-left: 20px; }
    .deadline { background: #fff3cd; border-left: 4px solid #ffc107; padding: 12px 15px; margin: 20px 0; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
    .footer a { color: #00a8e8; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Cloudstrucc Inc.</h1>
      <p style="color: #ccc; margin-top: 5px;">Business Analysis Requirements</p>
    </div>
    <div class="content">
      <p>Hello <strong>${clientName}</strong>,</p>
      
      <p>You have been invited to complete a business analysis requirements questionnaire as part of your project with Cloudstrucc Inc.</p>
      
      <div class="forms-list">
        <strong>Questionnaire(s) to complete:</strong>
        <ul>${formList}</ul>
      </div>
      
      <p>Click the button below to access your questionnaire:</p>
      
      <p style="text-align: center;">
        <a href="${inviteLink}" class="btn">Access Questionnaire</a>
      </p>
      
      <div class="code-box">
        <p style="margin: 0 0 5px; color: #666; font-size: 14px;">Your Access Code:</p>
        <span class="code">${inviteCode}</span>
        <p style="margin: 5px 0 0; font-size: 12px; color: #888;">Use this code to return to your questionnaire at any time</p>
      </div>
      
      <p><strong>Direct Link:</strong> <a href="${inviteLink}">${inviteLink}</a></p>
      
      ${deadlineDate ? `
      <div class="deadline">
        <strong>⏰ Submission Deadline:</strong> ${deadlineDate}
      </div>
      ` : ''}
      
      <p><strong>Link Expires:</strong> ${expiryDate}</p>
      
      <p>Your progress is automatically saved, so you can complete the questionnaire across multiple sessions using the same access code.</p>
      
      <p>If you have any questions, please don't hesitate to reach out.</p>
      
      <p>Best regards,<br><strong>Cloudstrucc Inc.</strong></p>
    </div>
    <div class="footer">
      <p>Cloudstrucc Inc. | Cloud Solutions & Digital Transformation</p>
      <p><a href="https://www.cloudstrucc.com">www.cloudstrucc.com</a></p>
    </div>
  </div>
</body>
</html>
    `;

    const textVersion = `
Hello ${clientName},

You have been invited to complete a business analysis requirements questionnaire.

Access your questionnaire here: ${inviteLink}

Your Access Code: ${inviteCode}

${deadlineDate ? `Submission Deadline: ${deadlineDate}` : ''}
Link Expires: ${expiryDate}

Best regards,
Cloudstrucc Inc.
    `;

    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to,
        subject: 'Cloudstrucc - Business Analysis Requirements Questionnaire',
        text: textVersion,
        html
      });
      return { success: true };
    } catch (error) {
      console.error('Failed to send invite email:', error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Send submission confirmation to client
   */
  async sendClientConfirmation({ to, clientName, formTitle }) {
    if (!this.transporter) {
      console.log('Email service not available. Would send confirmation to:', to);
      return { success: false };
    }

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #0d1f3c 0%, #1a3a5c 100%); padding: 30px; text-align: center; }
    .header h1 { color: #00a8e8; margin: 0; font-size: 24px; }
    .content { background: #fff; padding: 30px; border: 1px solid #e0e0e0; }
    .success-box { background: #d4edda; border: 1px solid #c3e6cb; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; }
    .success-box .icon { font-size: 48px; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Cloudstrucc Inc.</h1>
    </div>
    <div class="content">
      <div class="success-box">
        <div class="icon">✅</div>
        <h2 style="color: #155724; margin: 10px 0;">Submission Received!</h2>
      </div>
      
      <p>Hello <strong>${clientName}</strong>,</p>
      
      <p>Thank you for completing the <strong>${formTitle}</strong> requirements questionnaire!</p>
      
      <p>Your responses have been successfully submitted and our team will review them shortly. We'll be in touch soon to discuss the next steps for your project.</p>
      
      <p>If you have any questions or need to make any changes to your submission, please don't hesitate to contact us.</p>
      
      <p>We appreciate your time and look forward to working with you!</p>
      
      <p>Best regards,<br><strong>The Cloudstrucc Team</strong></p>
    </div>
    <div class="footer">
      <p>Cloudstrucc Inc. | Cloud Solutions & Digital Transformation</p>
      <p><a href="https://www.cloudstrucc.com" style="color: #00a8e8;">www.cloudstrucc.com</a></p>
    </div>
  </div>
</body>
</html>
    `;

    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to,
        subject: `Cloudstrucc - ${formTitle} Questionnaire Submitted`,
        html
      });
      return { success: true };
    } catch (error) {
      console.error('Failed to send client confirmation:', error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Send submission notification to admin
   */
  async sendAdminNotification({ clientName, clientEmail, clientCompany, formTitle, submissionId }) {
    if (!this.transporter) {
      console.log('Email service not available. Would send admin notification');
      return { success: false };
    }

    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    const adminLink = `${baseUrl}/admin/submissions/${submissionId}`;
    const responseEmail = process.env.RESPONSE_EMAIL || 'responses@cloudstrucc.com';

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #0d1f3c; padding: 20px; text-align: center; color: #fff; }
    .content { background: #fff; padding: 30px; border: 1px solid #e0e0e0; }
    .info-box { background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0; }
    .btn { display: inline-block; background: #00a8e8; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: 600; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2 style="margin: 0;">📋 New Questionnaire Submission</h2>
    </div>
    <div class="content">
      <p>A client has submitted a requirements questionnaire:</p>
      
      <div class="info-box">
        <p><strong>Form:</strong> ${formTitle}</p>
        <p><strong>Client:</strong> ${clientName}</p>
        <p><strong>Email:</strong> ${clientEmail}</p>
        ${clientCompany ? `<p><strong>Company:</strong> ${clientCompany}</p>` : ''}
        <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
      </div>
      
      <p style="text-align: center; margin-top: 25px;">
        <a href="${adminLink}" class="btn">View Submission</a>
      </p>
    </div>
  </div>
</body>
</html>
    `;

    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: responseEmail,
        subject: `New Submission: ${formTitle} - ${clientName}`,
        html
      });
      return { success: true };
    } catch (error) {
      console.error('Failed to send admin notification:', error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Send analytics digest to admin
   */
  async sendAnalyticsDigest(analyticsData) {
    if (!this.transporter) {
      console.log('Email service not available. Would send analytics digest');
      return { success: false };
    }

    const responseEmail = process.env.RESPONSE_EMAIL || 'responses@cloudstrucc.com';
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';

    const invitesHtml = analyticsData.activeInvites.map(inv => `
      <tr>
        <td>${inv.client_name}</td>
        <td>${inv.client_company || '-'}</td>
        <td>${inv.form_count} form(s)</td>
        <td>${inv.progress || 0}%</td>
        <td>${inv.last_accessed_at ? new Date(inv.last_accessed_at).toLocaleDateString() : 'Never'}</td>
      </tr>
    `).join('') || '<tr><td colspan="5">No active invites</td></tr>';

    const recentSubmissionsHtml = analyticsData.recentSubmissions.map(sub => `
      <tr>
        <td>${sub.client_name}</td>
        <td>${sub.form_title}</td>
        <td>${new Date(sub.submitted_at).toLocaleDateString()}</td>
      </tr>
    `).join('') || '<tr><td colspan="3">No recent submissions</td></tr>';

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 700px; margin: 0 auto; padding: 20px; }
    .header { background: #0d1f3c; padding: 20px; text-align: center; color: #fff; }
    .content { background: #fff; padding: 30px; border: 1px solid #e0e0e0; }
    .stats { display: flex; justify-content: space-around; margin: 20px 0; }
    .stat-box { text-align: center; padding: 15px; background: #f8f9fa; border-radius: 8px; min-width: 100px; }
    .stat-number { font-size: 28px; font-weight: bold; color: #00a8e8; }
    .stat-label { font-size: 12px; color: #666; }
    table { width: 100%; border-collapse: collapse; margin: 15px 0; }
    th, td { padding: 10px; text-align: left; border-bottom: 1px solid #eee; }
    th { background: #f8f9fa; font-weight: 600; }
    .btn { display: inline-block; background: #00a8e8; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2 style="margin: 0;">📊 BA Questionnaire Analytics</h2>
      <p style="margin: 5px 0 0; opacity: 0.8;">${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
    </div>
    <div class="content">
      <div class="stats">
        <div class="stat-box">
          <div class="stat-number">${analyticsData.totalInvites}</div>
          <div class="stat-label">Active Invites</div>
        </div>
        <div class="stat-box">
          <div class="stat-number">${analyticsData.inProgress}</div>
          <div class="stat-label">In Progress</div>
        </div>
        <div class="stat-box">
          <div class="stat-number">${analyticsData.completedThisPeriod}</div>
          <div class="stat-label">Completed (72h)</div>
        </div>
        <div class="stat-box">
          <div class="stat-number">${analyticsData.expiringSoon}</div>
          <div class="stat-label">Expiring Soon</div>
        </div>
      </div>
      
      <h3>Active Invites & Progress</h3>
      <table>
        <tr>
          <th>Client</th>
          <th>Company</th>
          <th>Forms</th>
          <th>Progress</th>
          <th>Last Activity</th>
        </tr>
        ${invitesHtml}
      </table>
      
      <h3>Recent Submissions</h3>
      <table>
        <tr>
          <th>Client</th>
          <th>Form</th>
          <th>Submitted</th>
        </tr>
        ${recentSubmissionsHtml}
      </table>
      
      <p style="text-align: center; margin-top: 25px;">
        <a href="${baseUrl}/admin/dashboard" class="btn">Go to Admin Dashboard</a>
      </p>
    </div>
  </div>
</body>
</html>
    `;

    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: responseEmail,
        subject: `BA Questionnaire Analytics - ${new Date().toLocaleDateString()}`,
        html
      });
      return { success: true };
    } catch (error) {
      console.error('Failed to send analytics digest:', error);
      return { success: false, message: error.message };
    }
  }

  
}

module.exports = new EmailService();
