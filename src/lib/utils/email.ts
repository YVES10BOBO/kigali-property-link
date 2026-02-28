// Email utility for sending notifications
// Uses Resend API (https://resend.com)

interface InquiryEmailData {
  name: string;
  email: string;
  phone: string;
  message?: string;
  inquiry_type: string;
  preferred_date?: string;
  property_title?: string;
  property_location?: string;
}

export async function sendInquiryNotification(data: InquiryEmailData) {
  // Get email settings from environment variables
  const resendApiKey = process.env.RESEND_API_KEY;
  const adminEmail = process.env.ADMIN_EMAIL || process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  
  // If Resend is not configured, skip sending email (don't fail)
  if (!resendApiKey || !adminEmail) {
    console.log('Email not configured. Skipping email notification.');
    return { success: false, message: 'Email not configured' };
  }

  try {
    // Build email content
    const propertyInfo = data.property_title 
      ? `<p><strong>Property:</strong> ${data.property_title}${data.property_location ? ` (${data.property_location})` : ''}</p>`
      : '<p><strong>Property:</strong> General Inquiry</p>';

    const preferredDate = data.preferred_date
      ? `<p><strong>Preferred Viewing Date:</strong> ${new Date(data.preferred_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>`
      : '';

    const messageContent = data.message
      ? `<p><strong>Message:</strong><br>${data.message}</p>`
      : '';

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #0d9488, #0f766e); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background: #f8f9fa; padding: 20px; border-radius: 0 0 8px 8px; }
            .info-box { background: white; padding: 15px; margin: 10px 0; border-radius: 5px; border-left: 4px solid #0d9488; }
            .button { display: inline-block; background: #0d9488; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin-top: 10px; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🏠 New Property Inquiry</h1>
              <p>You have a new inquiry from a potential client!</p>
            </div>
            <div class="content">
              <div class="info-box">
                <h2>Customer Information</h2>
                <p><strong>Name:</strong> ${data.name}</p>
                <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
                <p><strong>Phone:</strong> <a href="tel:${data.phone}">${data.phone}</a></p>
                <p><strong>WhatsApp:</strong> <a href="https://wa.me/${data.phone.replace(/\D/g, '')}">Click to chat on WhatsApp</a></p>
              </div>
              
              <div class="info-box">
                <h2>Inquiry Details</h2>
                <p><strong>Type:</strong> ${data.inquiry_type}</p>
                ${propertyInfo}
                ${preferredDate}
                ${messageContent}
              </div>
              
              <div style="text-align: center; margin-top: 20px;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/inquiries" class="button">
                  View in Dashboard →
                </a>
              </div>
            </div>
            <div class="footer">
              <p>This is an automated notification from Kigali Property Link</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const textContent = `
New Property Inquiry

Customer Information:
- Name: ${data.name}
- Email: ${data.email}
- Phone: ${data.phone}
- WhatsApp: https://wa.me/${data.phone.replace(/\D/g, '')}

Inquiry Details:
- Type: ${data.inquiry_type}
- Property: ${data.property_title || 'General Inquiry'}${data.property_location ? ` (${data.property_location})` : ''}
${data.preferred_date ? `- Preferred Date: ${new Date(data.preferred_date).toLocaleDateString()}` : ''}
${data.message ? `- Message: ${data.message}` : ''}

View in Dashboard: ${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/inquiries
    `;

    // Send email using Resend API
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: 'Kigali Property Link <notifications@resend.dev>', // Change this to your verified domain
        to: [adminEmail],
        subject: `🏠 New Inquiry: ${data.name} - ${data.property_title || 'General Inquiry'}`,
        html: htmlContent,
        text: textContent,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Failed to send email:', error);
      return { success: false, message: error.message || 'Failed to send email' };
    }

    const result = await response.json();
    return { success: true, messageId: result.id };
  } catch (error: any) {
    console.error('Error sending email:', error);
    return { success: false, message: error.message || 'Failed to send email' };
  }
}

// Email notification to client when inquiry status changes
interface StatusUpdateEmailData {
  name: string;
  email: string;
  inquiry_type: string;
  status: string;
  property_title?: string;
  property_location?: string;
  preferred_date?: string;
  message?: string;
}

export async function sendStatusUpdateNotification(data: StatusUpdateEmailData) {
  const resendApiKey = process.env.RESEND_API_KEY;
  
  if (!resendApiKey) {
    console.log('Email not configured. Skipping status update email.');
    return { success: false, message: 'Email not configured' };
  }

  try {
    const statusMessages: { [key: string]: { title: string; message: string; color: string } } = {
      new: {
        title: 'Inquiry Received',
        message: 'We have received your inquiry and will get back to you soon!',
        color: '#3b82f6',
      },
      contacted: {
        title: 'We\'ve Contacted You',
        message: 'Our team has reached out regarding your inquiry. Please check your messages.',
        color: '#eab308',
      },
      viewing_scheduled: {
        title: 'Viewing Scheduled',
        message: 'Great news! A viewing has been scheduled for your inquiry.',
        color: '#a855f7',
      },
      closed: {
        title: 'Inquiry Closed',
        message: 'Your inquiry has been successfully closed. Thank you for your interest!',
        color: '#22c55e',
      },
      lost: {
        title: 'Inquiry Status Update',
        message: 'Your inquiry status has been updated. Please contact us if you have any questions.',
        color: '#ef4444',
      },
    };

    const statusInfo = statusMessages[data.status] || {
      title: 'Status Updated',
      message: 'Your inquiry status has been updated.',
      color: '#6b7280',
    };

    const propertyInfo = data.property_title
      ? `<p><strong>Property:</strong> ${data.property_title}${data.property_location ? ` (${data.property_location})` : ''}</p>`
      : '<p><strong>Property:</strong> General Inquiry</p>';

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, ${statusInfo.color}, ${statusInfo.color}dd); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
            .info-box { background: white; padding: 20px; margin: 15px 0; border-radius: 5px; border-left: 4px solid ${statusInfo.color}; }
            .button { display: inline-block; background: ${statusInfo.color}; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin-top: 15px; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            .status-badge { display: inline-block; background: ${statusInfo.color}20; color: ${statusInfo.color}; padding: 8px 16px; border-radius: 20px; font-weight: bold; margin: 10px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>${statusInfo.title}</h1>
              <p>${statusInfo.message}</p>
            </div>
            <div class="content">
              <div class="info-box">
                <h2>Hello ${data.name},</h2>
                <p>Your inquiry status has been updated:</p>
                <div class="status-badge">${data.status.replace('_', ' ').toUpperCase()}</div>
              </div>
              
              <div class="info-box">
                <h2>Inquiry Details</h2>
                <p><strong>Type:</strong> ${data.inquiry_type}</p>
                ${propertyInfo}
                ${data.preferred_date ? `<p><strong>Preferred Date:</strong> ${new Date(data.preferred_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>` : ''}
                ${data.message ? `<p><strong>Your Message:</strong><br>${data.message}</p>` : ''}
              </div>
              
              <div style="text-align: center; margin-top: 20px;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/client" class="button">
                  View My Inquiries →
                </a>
              </div>
              
              <div style="margin-top: 20px; padding: 15px; background: #fff3cd; border-radius: 5px; border-left: 4px solid #ffc107;">
                <p style="margin: 0; color: #856404;"><strong>Need help?</strong> Contact us at <a href="mailto:info@bridgeproperties.rw" style="color: #856404;">info@bridgeproperties.rw</a> or reply to this email.</p>
              </div>
            </div>
            <div class="footer">
              <p>This is an automated notification from Kigali Property Link</p>
              <p>You're receiving this because you submitted an inquiry on our website.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const textContent = `
${statusInfo.title}

Hello ${data.name},

${statusInfo.message}

Your inquiry status: ${data.status.replace('_', ' ').toUpperCase()}

Inquiry Details:
- Type: ${data.inquiry_type}
- Property: ${data.property_title || 'General Inquiry'}${data.property_location ? ` (${data.property_location})` : ''}
${data.preferred_date ? `- Preferred Date: ${new Date(data.preferred_date).toLocaleDateString()}` : ''}
${data.message ? `- Your Message: ${data.message}` : ''}

View your inquiries: ${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/client

Need help? Contact us at info@bridgeproperties.rw

---
This is an automated notification from Kigali Property Link
    `;

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: 'Kigali Property Link <notifications@resend.dev>',
        to: [data.email],
        subject: `📧 ${statusInfo.title}: ${data.property_title || 'Your Inquiry'}`,
        html: htmlContent,
        text: textContent,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Failed to send status update email:', error);
      return { success: false, message: error.message || 'Failed to send email' };
    }

    const result = await response.json();
    return { success: true, messageId: result.id };
  } catch (error: any) {
    console.error('Error sending status update email:', error);
    return { success: false, message: error.message || 'Failed to send email' };
  }
}

// Property-related email notifications
interface PropertyApprovalEmailData {
  ownerEmail: string;
  ownerName: string;
  propertyTitle: string;
  propertyId: string;
  action: 'approved' | 'rejected' | 'needs_revision';
  reason?: string;
  notes?: string;
}

export async function sendPropertyApprovalNotification(data: PropertyApprovalEmailData) {
  const resendApiKey = process.env.RESEND_API_KEY;
  
  if (!resendApiKey) {
    console.log('Email not configured. Skipping property approval email.');
    return { success: false, message: 'Email not configured' };
  }

  try {
    const actionMessages: { [key: string]: { title: string; message: string; color: string; icon: string } } = {
      approved: {
        title: '🎉 Your Property Has Been Approved!',
        message: 'Great news! Your property listing has been approved and is now live on our website.',
        color: '#22c55e',
        icon: '✅',
      },
      rejected: {
        title: 'Property Listing Needs Changes',
        message: 'Your property listing requires changes before it can be approved.',
        color: '#ef4444',
        icon: '❌',
      },
      needs_revision: {
        title: 'Property Needs Revision',
        message: 'Your property listing needs some revisions before it can be approved.',
        color: '#eab308',
        icon: '⚠️',
      },
    };

    const actionInfo = actionMessages[data.action] || {
      title: 'Property Status Update',
      message: 'Your property status has been updated.',
      color: '#6b7280',
      icon: '📧',
    };

    const reasonSection = data.reason
      ? `<div style="background: #fff3cd; padding: 15px; border-radius: 5px; border-left: 4px solid #ffc107; margin: 15px 0;">
          <p style="margin: 0; color: #856404;"><strong>${data.action === 'rejected' ? 'Rejection Reason:' : 'Revision Notes:'}</strong></p>
          <p style="margin: 5px 0 0 0; color: #856404;">${data.reason}</p>
        </div>`
      : '';

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, ${actionInfo.color}, ${actionInfo.color}dd); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
            .info-box { background: white; padding: 20px; margin: 15px 0; border-radius: 5px; border-left: 4px solid ${actionInfo.color}; }
            .button { display: inline-block; background: ${actionInfo.color}; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin-top: 15px; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>${actionInfo.icon} ${actionInfo.title}</h1>
              <p>${actionInfo.message}</p>
            </div>
            <div class="content">
              <div class="info-box">
                <h2>Hello ${data.ownerName},</h2>
                <p>Your property "<strong>${data.propertyTitle}</strong>" status has been updated.</p>
                ${reasonSection}
              </div>
              
              <div class="info-box">
                <h2>Next Steps</h2>
                ${data.action === 'approved' 
                  ? '<p>Your property is now visible to potential clients on our website. You can manage it from your dashboard.</p>'
                  : data.action === 'rejected'
                  ? '<p>Please review the rejection reason above and make the necessary changes. You can resubmit your property listing from your dashboard.</p>'
                  : '<p>Please review the revision notes above and update your property listing. Once updated, it will be resubmitted for approval.</p>'
                }
              </div>
              
              <div style="text-align: center; margin-top: 20px;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/owner/dashboard" class="button">
                  View My Properties →
                </a>
              </div>
            </div>
            <div class="footer">
              <p>This is an automated notification from Kigali Property Link</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const textContent = `
${actionInfo.title}

Hello ${data.ownerName},

${actionInfo.message}

Property: ${data.propertyTitle}
${data.reason ? `\n${data.action === 'rejected' ? 'Rejection Reason:' : 'Revision Notes:'} ${data.reason}` : ''}

${data.action === 'approved' 
  ? 'Your property is now visible to potential clients on our website.'
  : data.action === 'rejected'
  ? 'Please review the rejection reason and make the necessary changes. You can resubmit from your dashboard.'
  : 'Please review the revision notes and update your property listing.'
}

View your properties: ${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/owner/dashboard

---
This is an automated notification from Kigali Property Link
    `;

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: 'Kigali Property Link <notifications@resend.dev>',
        to: [data.ownerEmail],
        subject: `${actionInfo.icon} ${actionInfo.title}: ${data.propertyTitle}`,
        html: htmlContent,
        text: textContent,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Failed to send property approval email:', error);
      return { success: false, message: error.message || 'Failed to send email' };
    }

    const result = await response.json();
    return { success: true, messageId: result.id };
  } catch (error: any) {
    console.error('Error sending property approval email:', error);
    return { success: false, message: error.message || 'Failed to send email' };
  }
}

// Notification to admin when new property is pending
interface PropertyPendingEmailData {
  propertyTitle: string;
  propertyLocation: string;
  ownerName: string;
  propertyId: string;
}

export async function sendPropertyPendingNotification(data: PropertyPendingEmailData) {
  const resendApiKey = process.env.RESEND_API_KEY;
  const adminEmail = process.env.ADMIN_EMAIL || process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  
  if (!resendApiKey || !adminEmail) {
    console.log('Email not configured. Skipping property pending notification.');
    return { success: false, message: 'Email not configured' };
  }

  try {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #eab308, #ca8a04); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
            .info-box { background: white; padding: 20px; margin: 15px 0; border-radius: 5px; border-left: 4px solid #eab308; }
            .button { display: inline-block; background: #eab308; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin-top: 15px; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🏠 New Property Pending Approval</h1>
              <p>A new property listing requires your review</p>
            </div>
            <div class="content">
              <div class="info-box">
                <h2>Property Details</h2>
                <p><strong>Title:</strong> ${data.propertyTitle}</p>
                <p><strong>Location:</strong> ${data.propertyLocation}</p>
                <p><strong>Owner:</strong> ${data.ownerName}</p>
              </div>
              
              <div style="text-align: center; margin-top: 20px;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/properties/approvals" class="button">
                  Review Property →
                </a>
              </div>
            </div>
            <div class="footer">
              <p>This is an automated notification from Kigali Property Link</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const textContent = `
New Property Pending Approval

A new property listing requires your review:

Property: ${data.propertyTitle}
Location: ${data.propertyLocation}
Owner: ${data.ownerName}

Review Property: ${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/properties/approvals

---
This is an automated notification from Kigali Property Link
    `;

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: 'Kigali Property Link <notifications@resend.dev>',
        to: [adminEmail],
        subject: `🏠 New Property Pending: ${data.propertyTitle}`,
        html: htmlContent,
        text: textContent,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Failed to send property pending email:', error);
      return { success: false, message: error.message || 'Failed to send email' };
    }

    const result = await response.json();
    return { success: true, messageId: result.id };
  } catch (error: any) {
    console.error('Error sending property pending email:', error);
    return { success: false, message: error.message || 'Failed to send email' };
  }
}

// Availability confirmation email
interface AvailabilityConfirmationEmailData {
  ownerEmail: string;
  ownerName: string;
  propertyTitle: string;
  propertyId: string;
  confirmationLink: string;
}

export async function sendAvailabilityConfirmationEmail(data: AvailabilityConfirmationEmailData) {
  const resendApiKey = process.env.RESEND_API_KEY;
  
  if (!resendApiKey) {
    console.log('Email not configured. Skipping availability confirmation email.');
    return { success: false, message: 'Email not configured' };
  }

  try {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
            .info-box { background: white; padding: 20px; margin: 15px 0; border-radius: 5px; border-left: 4px solid #3b82f6; }
            .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 10px 5px; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            .warning { background: #fff3cd; padding: 15px; border-radius: 5px; border-left: 4px solid #ffc107; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>⏰ Confirm Your Property Availability</h1>
              <p>Is your property still available?</p>
            </div>
            <div class="content">
              <div class="info-box">
                <h2>Hello ${data.ownerName},</h2>
                <p>We need to confirm that your property "<strong>${data.propertyTitle}</strong>" is still available.</p>
              </div>
              
              <div class="warning">
                <p style="margin: 0; color: #856404;"><strong>Important:</strong> If you don't respond within 7 days, your property will be automatically hidden from our website.</p>
              </div>
              
              <div style="text-align: center; margin-top: 20px;">
                <a href="${data.confirmationLink}&action=available" class="button" style="background: #22c55e;">
                  ✅ Yes, Still Available
                </a>
                <a href="${data.confirmationLink}&action=sold" class="button" style="background: #6b7280;">
                  ❌ No, Sold/Rented
                </a>
              </div>
              
              <div style="text-align: center; margin-top: 20px;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/owner/dashboard" style="color: #3b82f6; text-decoration: underline;">
                  Or manage your property from the dashboard →
                </a>
              </div>
            </div>
            <div class="footer">
              <p>This is an automated notification from Kigali Property Link</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const textContent = `
Confirm Your Property Availability

Hello ${data.ownerName},

We need to confirm that your property "${data.propertyTitle}" is still available.

IMPORTANT: If you don't respond within 7 days, your property will be automatically hidden from our website.

Confirm availability:
- Yes, Still Available: ${data.confirmationLink}&action=available
- No, Sold/Rented: ${data.confirmationLink}&action=sold

Or manage your property: ${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/owner/dashboard

---
This is an automated notification from Kigali Property Link
    `;

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: 'Kigali Property Link <notifications@resend.dev>',
        to: [data.ownerEmail],
        subject: `⏰ Confirm Availability: ${data.propertyTitle}`,
        html: htmlContent,
        text: textContent,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Failed to send availability confirmation email:', error);
      return { success: false, message: error.message || 'Failed to send email' };
    }

    const result = await response.json();
    return { success: true, messageId: result.id };
  } catch (error: any) {
    console.error('Error sending availability confirmation email:', error);
    return { success: false, message: error.message || 'Failed to send email' };
  }
}
