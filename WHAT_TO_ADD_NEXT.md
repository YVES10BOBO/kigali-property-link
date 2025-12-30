# 📋 What to Add Next

## ✅ What's Complete
- ✅ Navbar with Services & Blog
- ✅ Services & Blog pages
- ✅ Dashboard Overview
- ✅ Inquiries Management (viewing)
- ✅ Properties Management (viewing, delete)
- ✅ Basic Authentication for Admin/Agents
- ✅ Role-based access (admin, agent, user)
- ✅ Client account dashboard at `/client` (view own inquiries)

---

## 🔨 What's Missing (Priority Order)

### **1. Update Inquiry Status API** ⚠️ HIGH PRIORITY
**Problem:** The status dropdown in inquiries page doesn't save to database
**Location:** `src/app/dashboard/inquiries/page.tsx` (line 45-55)
**Fix:** Create API endpoint `/api/inquiries/[id]/route.ts` with PUT method

**Impact:** Status changes are lost on page refresh

---

### **2. Add Property Form** ⚠️ HIGH PRIORITY
**Problem:** "Add Property" button doesn't work
**Location:** `src/app/dashboard/properties/add/page.tsx` (currently empty)
**Fix:** Build form to add new properties

**Features needed:**
- Title, description, price, price_type
- Location, bedrooms, bathrooms, area
- Furnished, parking, security, generator checkboxes
- Amenities (array)
- Images (array of URLs)
- Status dropdown

---

### **3. Edit Property Form** ⚠️ HIGH PRIORITY
**Problem:** "Edit" button doesn't work
**Location:** `src/app/dashboard/properties/edit/[id]/page.tsx` (currently empty)
**Fix:** Build form to edit existing properties

**Features needed:**
- Pre-fill form with existing data
- Same fields as Add Property
- Update via PUT to `/api/properties/[id]`

---

### **4. Connect "List Property" Button** ⚠️ MEDIUM PRIORITY
**Problem:** Navbar "List Property" button does nothing
**Location:** `src/components/layout/Navbar.tsx` (line 36-38)
**Fix:** Link to `/dashboard/properties/add` or open modal

---

### **5. Email Notifications** ⚠️ MEDIUM PRIORITY
**Problem:** No email when new inquiry is submitted
**Location:** `src/app/api/inquiries/route.ts` (line 64 - TODO)
**Fix:** Integrate email service (Resend, SendGrid, etc.)

---

### **6. Profile Page** ⚠️ LOW PRIORITY
**Problem:** Profile page is empty
**Location:** `src/appyes /dashboard/profile/page.tsx`
**Fix:** Build user profile management

---

### **7. Client Account Improvements** ⚠️ LOW PRIORITY
**Done now:** Basic client dashboard to view own inquiries at `/client`
**Future:** 
- Add modal login/register for clients when they click \"Track my inquiry\" or \"My Account\"
- Add client profile editing (name, phone)
- Add saved properties / favorites

---

## 🎯 Recommended Order

1. **Update Inquiry Status API** (5 min) - Quick fix, high impact
2. **Add Property Form** (30 min) - Essential feature
3. **Edit Property Form** (30 min) - Essential feature
4. **Connect List Property Button** (2 min) - Quick fix
5. **Email Notifications** (1 hour) - Nice to have
6. **Profile Page** (30 min) - Optional
7. **Client Account Enhancements** (1–2 hours) - Better UX for clients

---

## 💡 Quick Wins (Do These First!)

1. **Update Inquiry Status API** - Makes status changes persistent
2. **Connect List Property Button** - Makes navbar functional

---

**Which one should I build first?** 🚀


