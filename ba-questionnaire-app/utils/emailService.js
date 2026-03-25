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

  isConfigured() {
    return this.transporter !== null;
  }

  /**
   * Send invite email to client
   */
  async sendInvite({ to, clientName, inviteLink, forms, expiresAt, submissionDeadline }) {
    if (!this.transporter) {
      console.log('Email service not available. Would send invite to:', to);
      return { success: false, message: 'Email service not configured' };
    }

    const formList = forms.map(f => `<li>${f}</li>`).join('');
    const expiryDate = new Date(expiresAt).toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #0d1f3c 0%, #1a3a5c 100%); padding: 30px; text-align: center; }
    .header h1 { color: #00a8e8; margin: 15px 0 0; font-size: 24px; }
    .content { background: #fff; padding: 30px; border: 1px solid #e0e0e0; }
    .btn { display: inline-block; background: #00a8e8; color: #fff; padding: 14px 28px; text-decoration: none; border-radius: 5px; font-weight: 600; margin: 20px 0; }
    .forms-list { background: #f9f9f9; padding: 15px 20px; border-radius: 5px; margin: 20px 0; }
    .forms-list ul { margin: 10px 0; padding-left: 20px; }
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
      
      <p>You have been invited to complete a business analysis requirements questionnaire.</p>
      
      <div class="forms-list">
        <strong>Questionnaire(s) to complete:</strong>
        <ul>${formList}</ul>
      </div>
      
      <p>Click the button below to access your questionnaire:</p>
      
      <p style="text-align: center;">
        <a href="${inviteLink}" class="btn">Access Questionnaire</a>
      </p>
      
      <p><strong>This link expires:</strong> ${expiryDate}</p>
      
      <p>Best regards,<br><strong>The Cloudstrucc Team</strong></p>
    </div>
    <div class="footer">
      <p>Cloudstrucc Inc. | Cloud Solutions & Digital Transformation</p>
      <p><a href="https://www.cloudstrucc.com">www.cloudstrucc.com</a></p>
    </div>
  </div>
</body>
</html>
    `;

    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to,
        subject: `Cloudstrucc - Questionnaire Invitation`,
        html
      });
      return { success: true };
    } catch (error) {
      console.error('Failed to send invite:', error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Send confirmation email to client after submission
   */
  async sendClientConfirmation({ to, clientName, formTitle }) {
    if (!this.transporter) {
      console.log('Email service not available. Would send confirmation to:', to);
      return { success: false, message: 'Email service not configured' };
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
    .success-icon { font-size: 48px; text-align: center; color: #27ae60; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Cloudstrucc Inc.</h1>
    </div>
    <div class="content">
      <p class="success-icon">✓</p>
      
      <p>Hello <strong>${clientName}</strong>,</p>
      
      <p>Thank you for completing the <strong>${formTitle}</strong> requirements questionnaire!</p>
      
      <p>Your responses have been successfully submitted and our team will review them shortly.</p>
      
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
   * Send validation request to client
   */
  async sendValidationRequest({ to, clientName, formTitle, validationLink }) {
    if (!this.transporter) {
      console.log('Email service not available. Would send validation request to:', to);
      return { success: false, message: 'Email service not configured' };
    }

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #f5f5f5; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #0d1f3c 0%, #1a365d 100%); padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .header h2 { color: #fff; margin: 0; font-size: 24px; }
    .content { background: #fff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; }
    .highlight-box { background: #fff3cd; border-left: 4px solid #f39c12; padding: 15px; margin: 20px 0; border-radius: 0 5px 5px 0; }
    .btn { display: inline-block; background: #27ae60; color: #fff; padding: 14px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 13px; }
    .footer a { color: #00a8e8; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>📋 Validation Required</h2>
    </div>
    <div class="content">
      <p>Hello <strong>${clientName}</strong>,</p>
      
      <p>Your submission for <strong>${formTitle}</strong> is ready for validation.</p>
      
      <div class="highlight-box">
        <p style="margin: 0;"><strong>⚠️ Action Required:</strong> Please review your submission and confirm that each requirement has been met or indicate any issues.</p>
      </div>
      
      <p style="text-align: center; margin: 30px 0;">
        <a href="${validationLink}" class="btn">✓ Validate Requirements</a>
      </p>
      
      <p>Best regards,<br><strong>The Cloudstrucc Team</strong></p>
    </div>
    <div class="footer">
      <p>Cloudstrucc Inc. | Cloud Solutions & Digital Transformation</p>
      <p><a href="https://www.cloudstrucc.com">www.cloudstrucc.com</a></p>
    </div>
  </div>
</body>
</html>
    `;

    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to,
        subject: `Action Required: Validate Your ${formTitle} Submission`,
        html
      });
      return { success: true };
    } catch (error) {
      console.error('Failed to send validation request:', error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Send approval request to stakeholder
   */
  async sendApprovalRequest({ to, stakeholderName, role, formTitle, clientName, approvalLink }) {
    if (!this.transporter) {
      console.log('Email service not available. Would send approval request to:', to);
      return { success: false, message: 'Email service not configured' };
    }

    const roleColor = role === 'Client' ? '#3498db' : role === 'Project Sponsor' ? '#f39c12' : '#95a5a6';

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #f5f5f5; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%); padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .header h2 { color: #fff; margin: 0; font-size: 24px; }
    .header p { color: rgba(255,255,255,0.8); margin: 10px 0 0; }
    .content { background: #fff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; }
    .role-badge { display: inline-block; background: ${roleColor}; color: #fff; padding: 6px 16px; border-radius: 20px; font-size: 14px; font-weight: 600; margin: 10px 0; }
    .info-box { background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0; }
    .info-box p { margin: 8px 0; }
    .btn { display: inline-block; background: #9b59b6; color: #fff; padding: 16px 40px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; }
    .btn:hover { background: #8e44ad; }
    .steps { background: #fff3cd; border-radius: 8px; padding: 15px 20px; margin: 20px 0; }
    .steps h4 { margin: 0 0 10px; color: #856404; }
    .steps ol { margin: 0; padding-left: 20px; }
    .steps li { margin: 5px 0; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 13px; border-radius: 0 0 8px 8px; }
    .footer a { color: #9b59b6; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>🏆 Approval Request</h2>
      <p>Project Closure Approval Required</p>
    </div>
    <div class="content">
      <p>Hello <strong>${stakeholderName}</strong>,</p>
      
      <p>You have been identified as a key stakeholder for the following project and your approval is required:</p>
      
      <div class="info-box">
        <p><strong>Project:</strong> ${formTitle}</p>
        <p><strong>Client:</strong> ${clientName}</p>
        <p><strong>Your Role:</strong> <span class="role-badge">${role}</span></p>
      </div>
      
      <div class="steps">
        <h4>📋 What you'll need to do:</h4>
        <ol>
          <li>Review the implementation validation summary</li>
          <li>Verify that requirements have been met</li>
          <li>Add any comments or observations</li>
          <li>Click "Approve" to sign off on the project</li>
        </ol>
      </div>
      
      <p style="text-align: center; margin: 30px 0;">
        <a href="${approvalLink}" class="btn">Review & Approve</a>
      </p>
      
      <p><strong>Note:</strong> Approvals must be completed in sequence (Client → Project Sponsor → Executive). You will be able to approve once any prior approvers have completed their review.</p>
      
      <p>If you have any questions about this approval request, please contact the project administrator.</p>
      
      <p>Best regards,<br><strong>The Cloudstrucc Team</strong></p>
    </div>
    <div class="footer">
      <p>Cloudstrucc Inc. | Cloud Solutions & Digital Transformation</p>
      <p><a href="https://www.cloudstrucc.com">www.cloudstrucc.com</a></p>
    </div>
  </div>
</body>
</html>
    `;

    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to,
        subject: `Approval Required: ${formTitle} - ${clientName}`,
        html
      });
      return { success: true };
    } catch (error) {
      console.error('Failed to send approval request:', error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Send approval confirmation to stakeholder
   */
  async sendApprovalConfirmation({ to, stakeholderName, role, formTitle, clientName, isComplete }) {
    if (!this.transporter) {
      console.log('Email service not available. Would send approval confirmation to:', to);
      return { success: false, message: 'Email service not configured' };
    }

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #f5f5f5; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%); padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .header h2 { color: #fff; margin: 0; font-size: 24px; }
    .content { background: #fff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; }
    .success-icon { font-size: 64px; text-align: center; margin: 20px 0; }
    .info-box { background: #d4edda; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 13px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>✓ Approval Confirmed</h2>
    </div>
    <div class="content">
      <p class="success-icon">✅</p>
      
      <p>Hello <strong>${stakeholderName}</strong>,</p>
      
      <p>Thank you! Your approval for the following project has been recorded:</p>
      
      <div class="info-box">
        <p><strong>Project:</strong> ${formTitle}</p>
        <p><strong>Client:</strong> ${clientName}</p>
        <p><strong>Approved as:</strong> ${role}</p>
        <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
      </div>
      
      ${isComplete ? `
      <div style="background: #fff3cd; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;">
        <p style="font-size: 18px; margin: 0;"><strong>🎉 Project Fully Approved!</strong></p>
        <p style="margin: 10px 0 0;">All stakeholders have approved this project.</p>
      </div>
      ` : `
      <p>The remaining stakeholders will be notified to complete their approvals.</p>
      `}
      
      <p>Best regards,<br><strong>The Cloudstrucc Team</strong></p>
    </div>
    <div class="footer">
      <p>Cloudstrucc Inc. | Cloud Solutions & Digital Transformation</p>
      <p><a href="https://www.cloudstrucc.com" style="color: #27ae60;">www.cloudstrucc.com</a></p>
    </div>
  </div>
</body>
</html>
    `;

    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to,
        subject: `Approval Confirmed: ${formTitle} - ${clientName}`,
        html
      });
      return { success: true };
    } catch (error) {
      console.error('Failed to send approval confirmation:', error);
      return { success: false, message: error.message };
    }
  }
}

module.exports = new EmailService();