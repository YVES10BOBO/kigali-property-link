# 🏠 Kigali Property Link

A professional real estate platform built with Next.js, Supabase, and Tailwind CSS. Connect property owners, agents, and clients in Kigali, Rwanda.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Database Setup](#database-setup)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Hidden Features](#hidden-features)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Full Documentation](#full-documentation)

---

## ✨ Features

### **Active Features**

#### **Property Management**
- ✅ Property listing with search and filters
- ✅ Property detail pages with image galleries
- ✅ Property types: Residential (apartment, studio, condo, house, villa, penthouse), Commercial (office, shop, showroom, warehouse, hotel, guest house, commercial building), Land (land/plot, farm, industrial land)
- ✅ Property status management (available, pending_approval, sold, rented, unverified, rejected, needs_revision)
- ✅ Property approval system (admin-only)
- ✅ Property verification system with auto-hide
- ✅ Property analytics (views, inquiries, conversion rates)
- ✅ Property favorites/bookmarks
- ✅ Property ownership system

#### **User Management**
- ✅ User registration and authentication (Supabase Auth)
- ✅ Role-based access control (admin, agent, user, owner)
- ✅ User profiles with avatar upload
- ✅ Protected routes and middleware
- ✅ Multi-language support (English/Kinyarwanda)

#### **Inquiry Management**
- ✅ Inquiry submission from property pages
- ✅ Inquiry status tracking (new, contacted, viewing_scheduled, closed, lost)
- ✅ Inquiry management dashboard
- ✅ Email notifications for new inquiries
- ✅ Inquiry export functionality

#### **Dashboard Features**
- ✅ Admin dashboard with statistics
- ✅ Owner portal (`/owner/dashboard`)
- ✅ Client dashboard (`/client`)
- ✅ Analytics dashboard with charts
- ✅ Commission tracking
- ✅ Testimonials management

#### **Additional Features**
- ✅ Responsive design (mobile-first)
- ✅ Image upload (Cloudinary integration)
- ✅ Email notifications (Resend)
- ✅ SEO optimization
- ✅ Map integration (property coordinates)

---

## 🛠️ Tech Stack

- **Framework:** Next.js 16.1.1 (App Router)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 3.4.19
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Image Storage:** Cloudinary
- **Email:** Resend API
- **Deployment:** Vercel (recommended)

---

## 🚀 Getting Started

### **Prerequisites**

- Node.js 18+ installed
- npm or yarn package manager
- Supabase account (free tier available)
- Cloudinary account (for image uploads)
- Resend account (for email notifications)

### **Installation**

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd kigali-property-link
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

   # Cloudinary
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret

   # Resend (Email)
   RESEND_API_KEY=your_resend_api_key
   ADMIN_EMAIL=your-admin-email@example.com
   NEXT_PUBLIC_APP_URL=http://localhost:3000

   # Google Translate (Optional - for auto-translation)
   GOOGLE_TRANSLATE_API_KEY=your_google_translate_api_key
   ```

4. **Set up the database**
   See [Database Setup](#database-setup) section below.

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
kigali-property-link/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (auth)/            # Authentication pages (login, register)
│   │   ├── (main)/            # Public pages (home, properties, blog, etc.)
│   │   ├── api/               # API routes
│   │   ├── dashboard/         # Admin dashboard pages
│   │   ├── owner/             # Property owner portal
│   │   ├── client/            # Client dashboard
│   │   └── properties/        # Property pages
│   ├── components/            # React components
│   │   ├── layout/           # Layout components (Navbar, Footer)
│   │   ├── property/         # Property-related components
│   │   └── ...
│   ├── lib/                   # Utility libraries
│   │   ├── supabase/         # Supabase client setup
│   │   ├── i18n/             # Internationalization
│   │   └── ...
│   └── types/                 # TypeScript type definitions
├── supabase/
│   └── migrations/            # Database migration files
├── public/                    # Static assets
└── README.md                 # This file
```

---

## 🗄️ Database Setup

### **Step 1: Create Supabase Project**

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Wait for the project to be ready

### **Step 2: Run Migrations**

Run all migration files in order in the Supabase SQL Editor:

1. Go to Supabase Dashboard → SQL Editor
2. Run migrations in this order:
   - `001_initial_schema.sql` - Base tables (properties, inquiries, users)
   - `002_add_user_profiles.sql` - User profile fields
   - `003_ensure_user_role.sql` - Role management
   - `004_add_user_avatar.sql` - Avatar support
   - `005_add_favorites_table.sql` - Favorites functionality
   - `006_add_phone_to_users.sql` - Phone number field
   - `007_fix_users_policy_recursion.sql` - Security fixes
   - `008_add_testimonials_table.sql` - Testimonials
   - `009_add_property_coordinates.sql` - Map coordinates
   - `010_fix_testimonials_policies.sql` - Testimonials security
   - `011_add_blog_posts_table.sql` - Blog system
   - `012_add_calendar_events_table.sql` - Calendar system
   - `013_property_verification_system.sql` - Verification system
   - `014_property_analytics_and_features.sql` - Analytics & views
   - `015_add_property_type.sql` - Property types

### **Step 3: Create Admin User**

After running migrations, create an admin user:

1. Register a new user through `/register`
2. Go to Supabase Dashboard → Table Editor → `users` table
3. Find your user and update `role` to `'admin'`

Or use SQL:
```sql
UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
```

### **Step 4: Verify Setup**

- Check that all tables exist in Supabase Table Editor
- Verify RLS policies are active
- Test authentication by logging in

---

## 🔐 Environment Variables

### **Required Variables**

| Variable | Description | Where to Get |
|----------|-------------|--------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Supabase Dashboard → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Supabase Dashboard → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | Supabase Dashboard → Settings → API |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | Cloudinary Dashboard |
| `CLOUDINARY_API_KEY` | Cloudinary API key | Cloudinary Dashboard |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | Cloudinary Dashboard |
| `RESEND_API_KEY` | Resend API key | Resend Dashboard |
| `ADMIN_EMAIL` | Admin email for notifications | Your email |
| `NEXT_PUBLIC_APP_URL` | Application URL | `http://localhost:3000` (dev) or your domain (prod) |

### **Optional Variables**

| Variable | Description |
|----------|-------------|
| `GOOGLE_TRANSLATE_API_KEY` | For auto-translation feature |

---

## 📡 API Documentation

### **Properties API**

- `GET /api/properties` - List all properties (with filters)
- `GET /api/properties/[id]` - Get single property
- `POST /api/properties` - Create property (authenticated)
- `PUT /api/properties/[id]` - Update property (owner/admin)
- `DELETE /api/properties/[id]` - Delete property (owner/admin)
- `GET /api/properties/[id]/analytics` - Get property analytics
- `POST /api/properties/[id]/view` - Track property view
- `POST /api/properties/[id]/favorite` - Toggle favorite
- `POST /api/properties/import` - Bulk import (CSV/JSON)

### **Inquiries API**

- `GET /api/inquiries` - List inquiries (filtered by user role)
- `GET /api/inquiries/[id]` - Get single inquiry
- `POST /api/inquiries` - Create inquiry
- `PUT /api/inquiries/[id]` - Update inquiry status
- `GET /api/inquiries/export` - Export inquiries (CSV)

### **Users API**

- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update user profile

### **Analytics API**

- `GET /api/analytics` - Get analytics data (with date filters)

### **Other APIs**

- `POST /api/upload` - Upload image to Cloudinary
- `POST /api/translate` - Translate text (if Google Translate enabled)
- `GET /api/testimonials` - Get testimonials
- `POST /api/testimonials` - Create testimonial
- `GET /api/blog` - Get blog posts
- `GET /api/calendar` - Get calendar events

---

## 🔒 Hidden Features

The following features are **built and functional** but **currently disabled** for MVP launch. They can be easily re-enabled when needed.

### **1. Property Comparison** 🔄

**Status:** Disabled (redirects to properties page)

**Location:** `src/app/properties/compare/page.tsx`

**How to Re-enable:**
1. Open `src/app/properties/compare/page.tsx`
2. Remove the redirect code and restore the comparison UI
3. Add "Compare" buttons to property cards if needed
4. The comparison hook (`src/hooks/usePropertyComparison.ts`) is already available

**Files:**
- `src/app/properties/compare/page.tsx` - Comparison page (currently redirects)
- `src/hooks/usePropertyComparison.ts` - Comparison logic (active)

---

### **2. Dark Mode** 🌙

**Status:** Removed from navigation

**Location:** `src/components/layout/Navbar.tsx`, `src/components/ThemeProvider.tsx`

**How to Re-enable:**
1. Open `src/components/layout/Navbar.tsx`
2. Uncomment/add ThemeToggle component
3. Open `src/components/ThemeProvider.tsx`
4. Remove forced light mode and restore theme toggle

**Files:**
- `src/components/ThemeProvider.tsx` - Theme provider (forced to light mode)
- Theme toggle component (if exists)

---

### **3. Blog System** 📝

**Status:** Removed from navigation (pages still exist)

**Location:** `src/app/(main)/blog/`, `src/app/dashboard/blog/`

**How to Re-enable:**
1. Open `src/components/layout/Navbar.tsx`
2. Uncomment blog link in navigation
3. Open `src/app/dashboard/layout.tsx`
4. Uncomment blog nav item (line 89)

**Files:**
- `src/app/(main)/blog/` - Public blog pages (active)
- `src/app/dashboard/blog/` - Admin blog management (active)
- `src/app/api/blog/` - Blog API (active)

---

### **4. Calendar System** 📅

**Status:** Disabled from dashboard

**Location:** `src/app/dashboard/calendar/`, `src/app/api/calendar/`

**How to Re-enable:**
1. Open `src/app/dashboard/layout.tsx`
2. Uncomment calendar nav item (line 90)
3. Open `src/app/dashboard/inquiries/page.tsx`
4. Uncomment "Schedule Viewing" button and calendar modal

**Files:**
- `src/app/dashboard/calendar/page.tsx` - Calendar page (active)
- `src/app/api/calendar/` - Calendar API (active)
- Database table: `calendar_events` (exists)

---

### **5. Bulk Import** 📤

**Status:** Disabled from dashboard

**Location:** `src/app/dashboard/properties/import/`, `src/app/api/properties/import/`

**How to Re-enable:**
1. Open `src/app/dashboard/layout.tsx`
2. Uncomment bulk import nav item (line 85)
3. Optionally add admin-only access control

**Files:**
- `src/app/dashboard/properties/import/page.tsx` - Import UI (active)
- `src/app/api/properties/import/route.ts` - Import API (active)

**Features:**
- CSV/JSON file import
- Data validation
- Batch processing
- Error reporting

---

### **Summary of Hidden Features**

| Feature | Status | Re-enable Difficulty | Files |
|---------|--------|---------------------|-------|
| Property Comparison | Redirects | Easy | `src/app/properties/compare/page.tsx` |
| Dark Mode | Removed | Easy | `src/components/layout/Navbar.tsx`, `ThemeProvider.tsx` |
| Blog System | Hidden | Very Easy | Uncomment nav links |
| Calendar System | Disabled | Easy | Uncomment nav + inquiry button |
| Bulk Import | Disabled | Very Easy | Uncomment nav link |

**Note:** All hidden features are **fully functional** - they just need to be uncommented or restored in the UI. The backend APIs and database tables are all active.

---

## 🚀 Deployment

### **Recommended: Vercel**

1. **Push code to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add all environment variables
   - Deploy!

3. **Configure Environment Variables**
   - Add all variables from `.env.local` to Vercel
   - Update `NEXT_PUBLIC_APP_URL` to your production URL

### **Alternative Platforms**

- **Netlify:** Similar process, supports Next.js
- **Railway:** Good for full-stack apps
- **Self-hosted:** Use PM2 + Nginx (see `DEPLOYMENT_GUIDE.md` in archive)

### **Post-Deployment Checklist**

- [ ] All environment variables configured
- [ ] Database migrations run on production Supabase
- [ ] Admin user created
- [ ] Email notifications tested
- [ ] Image uploads working
- [ ] SSL certificate active
- [ ] Domain configured (if custom)

---

## 🐛 Troubleshooting

### **Build Errors**

```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

### **Database Connection Issues**

- Verify Supabase URL and keys in `.env.local`
- Check RLS policies in Supabase Dashboard
- Ensure migrations are run

### **Image Upload Not Working**

- Verify Cloudinary credentials
- Check CORS settings in Cloudinary
- Ensure `CLOUDINARY_CLOUD_NAME` is correct

### **Email Not Sending**

- Verify Resend API key
- Check `ADMIN_EMAIL` is set
- Check Resend dashboard for logs

### **Authentication Issues**

- Clear browser cookies
- Verify Supabase Auth is enabled
- Check user role in database

---

## 📚 Full Documentation

For more detailed guides and historical notes, see the `docs/` folder:

- **Setup & installation**: `docs/setup.md`
- **Feature overview** (multi-currency, units, dashboards, etc.): `docs/features.md`
- **SEO & social sharing** (Open Graph, Twitter cards, sitemap): `docs/seo-social.md`
- **Troubleshooting** (extended): `docs/troubleshooting.md`
- **Older design notes & guides**: `docs/archive/`

---

## 📚 Additional Resources

- **Next.js Docs:** [nextjs.org/docs](https://nextjs.org/docs)
- **Supabase Docs:** [supabase.com/docs](https://supabase.com/docs)
- **Tailwind CSS:** [tailwindcss.com/docs](https://tailwindcss.com/docs)
- **Cloudinary Docs:** [cloudinary.com/documentation](https://cloudinary.com/documentation)

---

## 📝 License

This project is private and proprietary.

---

## 🤝 Contributing

This is a private project. For questions or issues, contact the project maintainer.

---

## 📞 Support

For setup help or questions:
- Check the troubleshooting section above
- Review archived documentation in `docs/archive/`
- Contact the development team

---

**Built with ❤️ for Kigali Property Market**
