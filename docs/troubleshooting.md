## Troubleshooting

Quick reference for common issues we solved while building the project.

### 1. Database constraint errors

**Error:**  
`new row for relation "properties" violates check constraint "properties_price_type_check"`

**Cause:**
- Old constraint required `price` to be non‑null when `price_type` was set.
- Multi‑unit properties now keep `price = NULL` and use `price_type` only.

**Fix:**
- Migration `020_update_properties_price_type_check_for_multi_unit.sql` relaxes the check:
  - Allows `price IS NULL` when `price_type` is one of `'rent' | 'sale' | 'rent_and_sale'`.

---

### 2. Decimal prices showing for USD

**Issue:**
- Values like `$2,999,999.98` seen in UI.

**Fix:**
- `src/lib/currency.ts`:
  - `fmt()` now formats with `maximumFractionDigits: 0` for both RWF and USD.
- All price and area inputs:
  - Use `step="1"` and `parseInt` to avoid decimals from user input.

---

### 3. Navbar hiding content

**Issue:**
- Fixed navbar overlapped page content on public pages.

**Fix:**
- Added top padding (e.g. `pt-28`) on `<main>` containers of public routes under `src/app/(main)/...`.

---

### 4. Next.js `useSearchParams` build error

**Error:**
`useSearchParams() should be wrapped in a suspense boundary at page "/reset-password"`

**Fix pattern:**

1. Create a **client** component (e.g. `ResetPasswordClient.tsx`) with `"use client"` and all hooks.
2. Keep `page.tsx` as a **server** component:
   - Import the client component.
   - Wrap it in `<Suspense fallback={...}>`.

This pattern is used for `/reset-password` and can be reused for similar pages.

---

### 5. TypeScript issues with optional data

Examples:

- `boolean | undefined is not assignable to SetStateAction<boolean>`
- Accessing missing fields like `furnished`, `parking`, `security`, `generator` on `formData`.

**Fix approach:**

- Always normalise API data before setting state (e.g. `!!(data.units && data.units.length > 0)`).
- Ensure `formData` includes all properties used in JSX and API payloads.

---

When you hit a new error, add a short section here (symptom, cause, fix). That keeps this file a living “fix history” instead of many scattered notes.

