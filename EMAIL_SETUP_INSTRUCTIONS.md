# 📧 Email Notifications Setup

## ✅ Email Feature Implemented!

The email notification system is now built and ready to use. You just need to configure it.

---

## 🚀 Setup Instructions

### **Option 1: Resend (Recommended - Free Tier Available)**

1. **Sign up for Resend:**
   - Go to https://resend.com
   - Sign up for a free account (100 emails/day free)

2. **Get your API Key:**
   - Go to API Keys section
   - Create a new API key
   - Copy the key

3. **Add to `.env.local`:**
   ```env
   RESEND_API_KEY=re_xxxxxxxxxxxxx
   ADMIN_EMAIL=your-email@example.com
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Verify Your Domain (Optional but Recommended):**
   - In Resend dashboard, go to Domains
   - Add your domain
   - Follow DNS setup instructions
   - Update the `from` email in `src/lib/utils/email.ts` to use your domain

---

### **Option 2: Use Without Email Service (Development)**

If you don't want to set up email right now:
- The system will work fine without it
- Inquiries will still be saved to the database
- You just won't get email notifications
- Check the dashboard for new inquiries

---

## 📝 Environment Variables Needed

Add these to your `.env.local` file:

```env
# Email Configuration (Optional)
RESEND_API_KEY=your_resend_api_key_here
ADMIN_EMAIL=your-email@example.com
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Note:** If these are not set, the system will skip sending emails but still save inquiries.

---

## ✉️ What Emails Will Look Like

When someone submits an inquiry, you'll receive an email with:
- Customer name, email, phone
- WhatsApp link
- Property interest (if specified)
- Message content
- Preferred viewing date (if provided)
- Link to view in dashboard

---

## 🧪 Testing

1. Submit a test inquiry from the contact form
2. Check your email inbox
3. You should receive a notification email

---

## 🔧 Customization

To customize the email template, edit:
- `src/lib/utils/email.ts` - Email content and styling

---

## ✅ Status

- ✅ Email utility created
- ✅ Connected to inquiries API
- ✅ Beautiful HTML email template
- ✅ Non-blocking (won't fail if email service is down)
- ⏳ Waiting for you to add API key

**Once you add the Resend API key, emails will start working!** 🎉


