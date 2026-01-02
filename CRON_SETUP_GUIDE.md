# ⏰ Scheduled Confirmation Reminders Setup Guide

## ✅ What's Built

The cron endpoint is ready at: `/api/cron/check-confirmations`

**What it does:**
- Checks properties with `confirmation_due_date` <= today
- Sends confirmation emails to owners
- After 7 days of no response → Marks as "unverified" (auto-hide)

---

## 🚀 Setup Options

### **Option 1: Vercel Cron Jobs** (Recommended if using Vercel)

1. **Create `vercel.json` in project root:**
```json
{
  "crons": [
    {
      "path": "/api/cron/check-confirmations",
      "schedule": "0 9 * * *"
    }
  ]
}
```

**Schedule:** Runs daily at 9:00 AM UTC
- `0 9 * * *` = Every day at 9 AM
- Change to your preferred time

2. **Add CRON_SECRET to environment variables:**
```env
CRON_SECRET=your-random-secret-key-here
```

3. **Deploy to Vercel:**
- Vercel will automatically set up the cron job
- Check Vercel dashboard → Cron Jobs section

---

### **Option 2: External Cron Service** (Works with any hosting)

#### **A. cron-job.org** (Free)
1. Sign up at https://cron-job.org
2. Create new cron job:
   - **URL:** `https://your-domain.com/api/cron/check-confirmations`
   - **Schedule:** Daily at your preferred time
   - **Method:** GET
   - **Headers:** `Authorization: Bearer YOUR_CRON_SECRET`
3. Save and activate

#### **B. EasyCron** (Free tier available)
1. Sign up at https://www.easycron.com
2. Create cron job with same settings
3. Set up authentication header

#### **C. GitHub Actions** (Free)
Create `.github/workflows/daily-confirmations.yml`:
```yaml
name: Daily Property Confirmations
on:
  schedule:
    - cron: '0 9 * * *'  # Daily at 9 AM UTC
  workflow_dispatch:  # Allow manual trigger

jobs:
  check-confirmations:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Confirmation Check
        run: |
          curl -X GET \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}" \
            https://your-domain.com/api/cron/check-confirmations
```

---

### **Option 3: Manual Trigger** (For Testing)

1. **Create Admin Button** (Optional):
   - Add button in admin dashboard
   - Calls the endpoint manually
   - Good for testing

2. **Or use curl/Postman:**
```bash
curl -X GET \
  -H "Authorization: Bearer YOUR_CRON_SECRET" \
  https://your-domain.com/api/cron/check-confirmations
```

---

## 🔒 Security

### **Protect Your Cron Endpoint:**

1. **Set CRON_SECRET:**
```env
CRON_SECRET=generate-a-random-secret-key-here
```

2. **The endpoint checks:**
- Authorization header matches CRON_SECRET
- If not set, endpoint still works (for testing)
- For production, always set CRON_SECRET

---

## 🧪 Testing

### **Test the Endpoint:**

1. **Without authentication (testing):**
```bash
curl http://localhost:3000/api/cron/check-confirmations
```

2. **With authentication:**
```bash
curl -H "Authorization: Bearer YOUR_CRON_SECRET" \
  http://localhost:3000/api/cron/check-confirmations
```

3. **Check response:**
```json
{
  "success": true,
  "message": "Processed X properties",
  "results": {
    "sent": 5,
    "failed": 0,
    "skipped": 0,
    "details": [...]
  }
}
```

---

## 📋 How It Works

### **Daily Process:**

1. **Cron job runs** (daily at scheduled time)
2. **Finds properties** where:
   - Status = "available"
   - `confirmation_due_date` <= today
3. **Sends emails** to property owners
4. **After 7 days** of no response:
   - Status → "unverified"
   - Property hidden from public

### **Email Flow:**

1. Owner gets email: "Is your property still available?"
2. Owner clicks:
   - ✅ "Yes, Still Available" → Status confirmed, next check in 30 days
   - ❌ "No, Sold/Rented" → Status → "sold", property hidden
3. If no response after 7 days → Status → "unverified", property hidden

---

## ✅ Checklist

- [ ] Choose cron service (Vercel/external/manual)
- [ ] Set up CRON_SECRET in environment variables
- [ ] Configure cron job schedule
- [ ] Test endpoint manually
- [ ] Verify emails are sent
- [ ] Monitor cron job execution

---

## 🎯 Recommended Setup

**For Production:**
1. Use Vercel Cron (if on Vercel) OR
2. Use cron-job.org (free, reliable)
3. Set CRON_SECRET
4. Schedule for daily at 9 AM (or your preferred time)
5. Monitor execution logs

**For Testing:**
1. Use manual trigger
2. Test with a property that has `confirmation_due_date` = today
3. Verify email is sent
4. Test confirmation link

---

**The cron endpoint is ready! Just set up the scheduling.** 🚀
