# 📧 Complete Email Setup Guide for Kigali Property Link

## 🎯 Overview

Your website uses **Resend** (a modern email service) instead of traditional SMTP. This is **much easier** to set up and more reliable!

---

## 📋 What Email Addresses Do You Need?

### **Option 1: Professional Setup (Recommended for Business)**

You need **ONE professional email address** for receiving notifications:

**Recommended Email:**
- `info@kigalipropertieslink.com` (or your domain)
- `admin@kigalipropertieslink.com`
- `notifications@kigalipropertieslink.com`

**Why Professional?**
- ✅ More trustworthy to clients
- ✅ Better for business branding
- ✅ Professional appearance
- ✅ Can use your own domain

### **Option 2: Personal Email (Quick Start)**

You can use your **personal email** for now:
- `yourname@gmail.com`
- `yourname@yahoo.com`
- Any email you check regularly

**Note:** You can always upgrade to a professional email later!

---

## 🔑 What Credentials Do You Need?

### **You DON'T Need:**
- ❌ SMTP server
- ❌ SMTP host
- ❌ SMTP username
- ❌ SMTP password
- ❌ SMTP port

### **You DO Need:**
- ✅ **Resend API Key** (one key, that's it!)
- ✅ **Your email address** (where you want to receive notifications)

---

## 🚀 Step-by-Step Setup Guide

### **Step 1: Sign Up for Resend (FREE)**

1. Go to **https://resend.com**
2. Click **"Sign Up"** (top right)
3. Sign up with your email (can be personal or professional)
4. Verify your email address

**Free Tier Includes:**
- ✅ 100 emails per day (FREE)
- ✅ 3,000 emails per month (FREE)
- ✅ Perfect for starting out!

---

### **Step 2: Get Your API Key**

1. After logging in, go to **"API Keys"** in the left sidebar
2. Click **"Create API Key"**
3. Give it a name: `Kigali Property Link`
4. Select **"Sending access"** (default)
5. Click **"Add"**
6. **Copy the API key** (starts with `re_...`)
   - ⚠️ **Important:** Copy it now! You won't see it again!

---

### **Step 3: Add to Your Project**

1. Open your `.env.local` file (in the root of your project)
2. Add these lines:

```env
# Email Configuration
RESEND_API_KEY=re_your_api_key_here
ADMIN_EMAIL=your-email@example.com
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Replace:**
- `re_your_api_key_here` → Your actual Resend API key
- `your-email@example.com` → Your email address (where you want notifications)

**Example:**
```env
RESEND_API_KEY=re_abc123xyz789
ADMIN_EMAIL=info@kigalipropertieslink.com
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

### **Step 4: Verify Your Domain (Optional but Recommended)**

**For Professional Setup:**

1. In Resend dashboard, go to **"Domains"**
2. Click **"Add Domain"**
3. Enter your domain: `kigalipropertieslink.com`
4. Follow the DNS setup instructions:
   - Add TXT records to your domain
   - Add SPF record
   - Add DKIM record
5. Wait for verification (usually 5-10 minutes)
6. Once verified, update your email code to use your domain

**Benefits:**
- ✅ Emails come from `notifications@kigalipropertieslink.com`
- ✅ Better deliverability (less spam)
- ✅ More professional

**Note:** You can skip this for now and use the default `notifications@resend.dev` address.

---

## 📧 What Emails Will Be Sent?

### **1. To You (Admin):**
- ✅ New property inquiries from clients
- ✅ New property listings pending approval
- ✅ Property status updates

### **2. To Property Owners:**
- ✅ Property approval/rejection notifications
- ✅ Property availability confirmation requests

### **3. To Clients:**
- ✅ Inquiry status updates
- ✅ Confirmation emails (future)

---

## 🎯 How Many Email Addresses Do You Need?

### **Minimum Setup:**
- **1 email address** (your admin email)

### **Recommended Setup:**
- **1 admin email** (for receiving notifications)
- **1 support email** (for client inquiries: `info@kigalipropertieslink.com`)
- **1 notifications email** (for automated emails: `notifications@kigalipropertieslink.com`)

**But you can start with just ONE!**

---

## 💰 Cost Breakdown

### **Resend Pricing:**
- **Free Tier:** 100 emails/day, 3,000/month
- **Pro Plan:** $20/month (50,000 emails)
- **Business Plan:** Custom pricing

**For starting out:** FREE tier is perfect!

---

## 🔒 Security Best Practices

1. **Never commit `.env.local` to GitHub**
   - ✅ Already in `.gitignore` (safe!)

2. **Keep your API key secret**
   - ✅ Don't share it publicly
   - ✅ Don't put it in code

3. **Rotate keys if compromised**
   - Go to Resend → API Keys → Delete old key → Create new one

---

## ✅ Testing Your Setup

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Submit a test inquiry:**
   - Go to your contact form
   - Fill it out and submit
   - Check your email inbox!

3. **Check the console:**
   - If email is configured: You'll see success messages
   - If not configured: You'll see "Email not configured" (but site still works!)

---

## 🆘 Troubleshooting

### **Problem: Emails not sending**

**Check:**
1. ✅ Is `RESEND_API_KEY` in `.env.local`?
2. ✅ Is `ADMIN_EMAIL` in `.env.local`?
3. ✅ Did you restart your dev server after adding env variables?
4. ✅ Is your API key correct? (starts with `re_`)
5. ✅ Check Resend dashboard for errors

### **Problem: "Email not configured" message**

**Solution:**
- Add `RESEND_API_KEY` and `ADMIN_EMAIL` to `.env.local`
- Restart your dev server

### **Problem: Emails going to spam**

**Solution:**
- Verify your domain in Resend
- Use a professional email address
- Add SPF/DKIM records

---

## 📝 Summary

### **What You Need:**
1. ✅ Resend account (free)
2. ✅ One API key
3. ✅ One email address (for receiving notifications)

### **What You DON'T Need:**
- ❌ SMTP server
- ❌ SMTP credentials
- ❌ Email hosting
- ❌ Complex setup

### **Quick Start:**
1. Sign up at https://resend.com
2. Get API key
3. Add to `.env.local`
4. Done! 🎉

---

## 🚀 Next Steps

1. **Set up Resend account** (5 minutes)
2. **Add credentials to `.env.local`** (2 minutes)
3. **Test with a contact form submission** (1 minute)
4. **Verify domain** (optional, 10 minutes)

**Total time: ~8 minutes!**

---

## 📞 Need Help?

- **Resend Documentation:** https://resend.com/docs
- **Resend Support:** support@resend.com
- **Your Project Docs:** See `EMAIL_SETUP_INSTRUCTIONS.md`

---

**That's it! Your email system is ready to go! 🎉**
