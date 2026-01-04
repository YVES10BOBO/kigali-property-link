# 🚀 Quick Deployment Steps

## ⚡ Fastest Way: Vercel (5 minutes)

### Step 1: Fix Build Issue (if needed)
```powershell
# Clear Next.js cache
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
npm run build
```

### Step 2: Push to GitHub
```powershell
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 3: Deploy to Vercel

**Option A: Via Website (Easiest)**
1. Go to [vercel.com/new](https://vercel.com/new)
2. Click "Import Git Repository"
3. Select your GitHub repository
4. Click "Deploy"

**Option B: Via CLI**
```powershell
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### Step 4: Add Environment Variables
1. Go to your project on Vercel
2. Settings → Environment Variables
3. Add these variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_value
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_value
SUPABASE_SERVICE_ROLE_KEY=your_value
RESEND_API_KEY=your_value
CLOUDINARY_CLOUD_NAME=your_value
CLOUDINARY_API_KEY=your_value
CLOUDINARY_API_SECRET=your_value
GOOGLE_TRANSLATE_API_KEY=your_value (optional)
```

### Step 5: Redeploy
- After adding variables, click "Redeploy"
- Your site will be live at `your-project.vercel.app`

---

## ✅ Pre-Deployment Checklist

- [ ] Test build: `npm run build`
- [ ] Code pushed to GitHub
- [ ] Environment variables ready
- [ ] Database migrations applied
- [ ] All features tested locally

---

## 🎯 That's It!

Your site will be live in minutes! 🎉
