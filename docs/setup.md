## Setup & Installation

This is a concise setup guide. For the full step-by-step text you can still refer to the root `README.md`, but this file is the single source of truth.

### 1. Requirements

- Node.js 18+
- npm or yarn
- Supabase project
- Cloudinary account
- Resend account (for emails)

### 2. Install & run

```bash
git clone <your-repo-url>
cd kigali-property-link
npm install
npm run dev
```

The app runs at `http://localhost:3000` by default.

### 3. Environment variables

Create `.env.local` in the project root:

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

# App URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SITE_URL=https://bridgeproperties.rw

# Open Graph default image (for social sharing cards)
NEXT_PUBLIC_OG_IMAGE=/images/Greenland_property_images/greenlandplaza.jpg

# Optional
GOOGLE_TRANSLATE_API_KEY=your_google_translate_api_key
```

Restart the dev server after changing env vars.

### 4. Database migrations (Supabase)

1. Open Supabase Dashboard → **SQL Editor**
2. Run all SQL files in `supabase/migrations` in order (from `001_...` upwards)
3. After migrations, create an admin user:

```sql
UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
```

### 5. First login

1. Start dev server: `npm run dev`
2. Register via `/register`
3. Promote your user to `admin` in Supabase (as above)
4. Login and access the admin dashboard.


---

This file is meant to stay short and practical. If you add new services or env vars, update **this** file and link to it from `README.md`.



This is a focused version of the setup information from the root `README.md`.

### Prerequisites

- Node.js 18+ installed  
- npm or yarn package manager  
- Supabase account (free tier)  
- Cloudinary account (for image uploads)  
- Resend account (for transactional email)

### 1. Clone & install

```bash
git clone <your-repo-url>
cd kigali-property-link
npm install
```

### 2. Environment variables

Create a `.env.local` in the project root:

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

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Optional – auto translation
GOOGLE_TRANSLATE_API_KEY=your_google_translate_api_key
```

You can also add production‑only variables here:

```env
NEXT_PUBLIC_SITE_URL=https://bridgeproperties.rw
NEXT_PUBLIC_OG_IMAGE=/images/Greenland_property_images/greenlandplaza.jpg
```

### 3. Database / Supabase

1. Create a new Supabase project.  
2. In Supabase SQL Editor, run all migration files in `supabase/migrations` in order:
   - `001_initial_schema.sql`
   - `002_add_user_profiles.sql`
   - `003_ensure_user_role.sql`
   - …
3. After migrations, create an admin user:

```sql
UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
```

### 4. Run the app

```bash
npm run dev
```

Then open `http://localhost:3000` in your browser.

