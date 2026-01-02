// Property-related email notifications
// Uses Resend API (https://resend.com)

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
