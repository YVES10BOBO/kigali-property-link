# 🚀 Deployment Guide - Kigali Property Link

## 📋 Pre-Deployment Checklist

### ✅ 1. Fix CSS Error (if still present)
The CSS file looks correct, but if you still see the error:
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

### ✅ 2. Environment Variables
Make sure you have all required environment variables:

**Required Variables:**
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Resend (for emails)
RESEND_API_KEY=your_resend_api_key

# Google Translate (optional)
GOOGLE_TRANSLATE_API_KEY=your_google_api_key

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### ✅ 3. Test Build Locally
```bash
# Build the project
npm run build

# Test production build
npm start
```

---

## 🌐 Deployment Options

### **Option 1: Vercel (Recommended for Next.js)** ⭐

Vercel is the easiest and best option for Next.js applications.

#### **Step 1: Create Vercel Account**
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub/GitLab/Bitbucket

#### **Step 2: Install Vercel CLI (Optional)**
```bash
npm i -g vercel
```

#### **Step 3: Deploy via CLI**
```bash
# Login to Vercel
vercel login

# Deploy (first time)
vercel

# Deploy to production
vercel --prod
```

#### **Step 4: Deploy via Dashboard (Easier)**
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your Git repository
3. Configure project:
   - **Framework Preset:** Next.js
   - **Root Directory:** `./` (default)
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next` (default)

#### **Step 5: Add Environment Variables**
1. Go to Project Settings → Environment Variables
2. Add all your environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `RESEND_API_KEY`
   - `GOOGLE_TRANSLATE_API_KEY` (optional)
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`

#### **Step 6: Deploy**
- Click "Deploy"
- Wait for build to complete
- Your site will be live at `your-project.vercel.app`

#### **Step 7: Custom Domain (Optional)**
1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

---

### **Option 2: Netlify**

#### **Step 1: Create Netlify Account**
1. Go to [netlify.com](https://netlify.com)
2. Sign up with GitHub

#### **Step 2: Deploy**
1. Click "New site from Git"
2. Connect your repository
3. Configure build:
   - **Build command:** `npm run build`
   - **Publish directory:** `.next`
   - **Node version:** 18 or 20

#### **Step 3: Add Environment Variables**
1. Go to Site Settings → Environment Variables
2. Add all your environment variables

#### **Step 4: Deploy**
- Netlify will automatically deploy on every push

---

### **Option 3: Railway**

#### **Step 1: Create Railway Account**
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub

#### **Step 2: Deploy**
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Select your repository
4. Railway will auto-detect Next.js

#### **Step 3: Add Environment Variables**
1. Go to Variables tab
2. Add all your environment variables

#### **Step 4: Deploy**
- Railway will automatically deploy

---

### **Option 4: Self-Hosted (VPS/Server)**

#### **Step 1: Prepare Server**
```bash
# Install Node.js (v18 or v20)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 (process manager)
sudo npm install -g pm2
```

#### **Step 2: Clone Repository**
```bash
git clone your-repo-url
cd kigali-property-link
npm install
```

#### **Step 3: Create .env File**
```bash
nano .env.local
# Add all environment variables
```

#### **Step 4: Build and Start**
```bash
# Build
npm run build

# Start with PM2
pm2 start npm --name "kigali-property" -- start
pm2 save
pm2 startup
```

#### **Step 5: Setup Nginx (Reverse Proxy)**
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 🔧 Post-Deployment Steps

### **1. Test Your Deployment**
- ✅ Check homepage loads
- ✅ Test property listings
- ✅ Test authentication
- ✅ Test property creation
- ✅ Test email notifications
- ✅ Test mobile responsiveness

### **2. Setup Database Migrations**
If you haven't run migrations on production:
```bash
# Using Supabase CLI
supabase db push

# Or run migrations manually in Supabase dashboard
```

### **3. Configure CORS (if needed)**
If using external APIs, make sure CORS is configured:
- Supabase: Check allowed origins
- Cloudinary: Check allowed URLs

### **4. Setup Monitoring**
- **Vercel:** Built-in analytics
- **Sentry:** Error tracking
- **Google Analytics:** User tracking

### **5. Setup Cron Jobs**
If you have scheduled tasks (like availability confirmation):
- **Vercel:** Use Vercel Cron Jobs
- **Netlify:** Use Netlify Functions with scheduled triggers
- **Railway:** Use cron jobs or external service

---

## 📝 Quick Deployment Commands

### **Vercel (Fastest)**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### **Build Test**
```bash
# Test build locally first
npm run build
npm start
```

### **GitHub Actions (CI/CD)**
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm install
      - run: npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

---

## 🚨 Common Issues & Solutions

### **Issue 1: Build Fails**
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### **Issue 2: Environment Variables Not Working**
- Make sure variables start with `NEXT_PUBLIC_` for client-side
- Restart deployment after adding variables

### **Issue 3: Database Connection Issues**
- Check Supabase URL and keys
- Verify RLS policies
- Check network access

### **Issue 4: Images Not Loading**
- Check Cloudinary configuration
- Verify CORS settings
- Check image URLs

---

## 📊 Recommended: Vercel Deployment

**Why Vercel?**
- ✅ Built by Next.js team
- ✅ Zero configuration
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Free tier available
- ✅ Easy environment variables
- ✅ Automatic deployments from Git

**Quick Start:**
1. Push code to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy!

---

## ✅ Deployment Checklist

- [ ] Code pushed to Git repository
- [ ] Environment variables documented
- [ ] Build tested locally (`npm run build`)
- [ ] Database migrations ready
- [ ] Environment variables added to platform
- [ ] Domain configured (if custom)
- [ ] SSL certificate active
- [ ] Monitoring setup
- [ ] Error tracking configured
- [ ] Post-deployment testing completed

---

## 🎉 You're Ready to Deploy!

Choose your preferred platform and follow the steps above. **Vercel is recommended** for the easiest deployment experience.

Good luck with your deployment! 🚀
