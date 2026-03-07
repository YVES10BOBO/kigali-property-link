## Feature Overview

This document summarizes the main features of **Kigali Property Link**, based on the root `README.md` and later improvements.

### Property Management

- Property listing with search and advanced filters (type, location, purpose, price range)
- Property detail pages with image galleries
- Support for **single properties** and **multi‑unit buildings**
- Property types:
  - Residential: apartment, studio, condo, house, villa, penthouse
  - Commercial: office, shop, showroom, warehouse, hotel, guest house, commercial building
  - Land: land / plot, farm, industrial land
- Property status management:
  - `available`, `pending_approval`, `sold`, `rented`, `unverified`, `rejected`, `needs_revision`
- Property approval & verification (admin‑only) with auto‑hide for unverified listings
- Property analytics (views, inquiries, conversion rates)
- Property favorites / bookmarks
- Ownership system linking properties to owners

### Multi‑currency & Units

- Global support for **RWF** and **USD**:
  - Currency selection on property and unit forms
  - Price ranges for both currencies
  - Consistent formatting (no decimals, whole numbers only)
- Buildings with multiple units:
  - Per‑unit prices for rent, sale, or rent & sale
  - Per‑unit currency (RWF / USD)
  - Optional unit details (unit number, area, bedrooms, bathrooms)
  - Property cards show first unit’s summary; details page shows full unit table

### User & Access Management

- Supabase Auth for registration and login
- Role‑based access: `admin`, `owner`, `agent`, `user`
- User profiles with avatar upload
- Protected routes via Next.js middleware
- Multi‑language support (English / Kinyarwanda)

### Inquiries & Communication

- Inquiry form on property pages
- Inquiry status tracking: `new`, `contacted`, `viewing_scheduled`, `closed`, `lost`
- Inquiry management dashboard
- Email notifications for new inquiries
- Export inquiries for reporting

### Dashboards

- Admin dashboard with KPIs and charts
- Owner portal (`/owner/dashboard`) for managing owned properties & units
- Client dashboard (`/client`) for saved properties and activity
- Commission tracking and reporting
- Testimonials management

### UX, SEO & Marketing

- Responsive, mobile‑first UI built with Tailwind CSS
- Modern property cards and details views
- SEO‑friendly metadata and Open Graph tags
- Sitemap and robots configuration for search engines
- Social sharing cards (WhatsApp, Facebook, Twitter/X, LinkedIn)

For implementation details of specific areas (like multi‑currency or unit handling), see the code in `src/types/property.ts`, `src/lib/currency.ts`, and the components under `src/components/property/`.



This document summarizes the main product features and some of the important implementation details.

### 1. Properties & units

- Single properties (house, apartment, land, etc.) and **multi‑unit buildings** (e.g. apartments with many units).
- Unit manager with optional fields:
  - Unit number
  - Bedrooms, bathrooms, area (optional; hidden on cards when `0`)
  - Per‑unit rent and/or sale price
  - Per‑unit **currency** (`RWF` or `USD`)
- Property card:
  - Shows the **first unit's** price and key features for buildings
  - Uses `price_type` badge: `For Rent`, `For Sale`, or `For Rent & Sale`
- Property detail page:
  - Shows overall summary price (`From ...` when there are units)
  - Full units table with features + prices (rent/sale) and correct currency.

### 2. Currency handling

- Supported currencies: **RWF** and **USD**.
- Currency can be set on:
  - The property itself
  - Each individual unit (overrides property currency)
- `src/lib/currency.ts` formats prices as whole numbers (no decimals) to avoid confusing values like `$2,999,999.98`.
- All price/area inputs use `step="1"` and are parsed as integers.

### 3. Search & filters

- Home page hero search:
  - Property type
  - Location
  - Purpose (`For Rent`, `For Sale`)
  - Price range (RWF, using constants from `src/lib/constants/price-ranges.ts`)
- Properties listing page (`/properties`):
  - Server‑rendered shell + client component with filters and pagination.

### 4. Dashboards

- **Admin dashboard**
  - Approve / reject properties
  - Commission tracking
  - Analytics (views, inquiries)
  - Testimonials management
- **Owner dashboard**
  - Manage own properties and units
  - Edit property details and pricing
- **Client dashboard**
  - Track inquiries and saved properties.

### 5. Content & marketing

- Blog system (with SEO metadata per post).
- Testimonials carousel on the home page.
- Stats section showing properties, clients, experience, support.
- Contact / services / about pages styled to work with fixed navbar spacing.

### 6. UX & visuals

- Modern Tailwind‑based design:
  - Hero section with gradient overlay and background image
  - Animated badges (“Verified Listings”, “Free Listing”, “24/7 Support”)
- Fixed navbar with consistent top padding on public pages.
- WhatsApp floating button for quick contact.

If you add larger new features (e.g. new dashboards, payment integration), add a short subsection here and link to any deeper docs you create in `docs/`.

