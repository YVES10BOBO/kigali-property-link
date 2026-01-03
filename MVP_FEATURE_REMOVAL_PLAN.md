# 🎯 MVP Feature Removal Plan

## ✅ Features to Remove/Postpone for MVP

### **1. Dark Mode** ❌ Remove
- Remove ThemeToggle component from Navbar
- Keep ThemeProvider but force light mode only
- Remove dark mode classes (optional - can keep for future)

### **2. Blog System** ❌ Remove/Postpone
- Remove blog link from Navbar
- Remove blog from dashboard navigation
- Keep blog pages/files (can re-enable later)
- Or redirect blog to a simple static page

### **3. Calendar System** ❌ Remove/Simplify
- Remove calendar from dashboard navigation
- Keep calendar API/files (can re-enable later)
- Remove "Schedule Viewing" button from inquiries (or simplify)

### **4. Bulk Import** ❌ Disable
- Remove bulk import from dashboard navigation
- Keep import API/files (can re-enable later)
- Add admin-only access control

### **5. Property Comparison** ❌ Remove
- Remove comparison page
- Keep favorites (as requested)
- Remove any comparison buttons/links

---

## 📋 Implementation Steps

### **Step 1: Remove Dark Mode**
- Remove ThemeToggle from Navbar
- Force light mode in ThemeProvider

### **Step 2: Remove Blog**
- Remove blog link from Navbar
- Remove blog from dashboard nav
- Option: Create simple static blog page

### **Step 3: Remove Calendar**
- Remove calendar from dashboard nav
- Remove "Schedule Viewing" from inquiries (or keep simple)

### **Step 4: Disable Bulk Import**
- Remove from dashboard nav
- Add admin-only check (can re-enable later)

### **Step 5: Remove Comparison**
- Remove comparison page
- Keep favorites functionality

---

## 🎯 Files to Modify

1. `src/components/layout/Navbar.tsx` - Remove ThemeToggle, Blog link
2. `src/app/dashboard/layout.tsx` - Remove Blog, Calendar, Bulk Import from nav
3. `src/components/ThemeProvider.tsx` - Force light mode
4. `src/app/dashboard/inquiries/page.tsx` - Remove/Simplify calendar integration
5. `src/app/properties/compare/page.tsx` - Remove or redirect
6. `src/components/property/PropertyCard.tsx` - Remove comparison button if exists

---

## ✅ What We'll Keep

- ✅ Favorites (as requested)
- ✅ All core property features
- ✅ Owner portal
- ✅ Admin dashboard
- ✅ Property verification
- ✅ Analytics
- ✅ Multi-language
- ✅ All other essential features

---

## 🔄 Re-enabling Later

All removed features will be kept in codebase, just hidden/disabled. Can re-enable easily:
- Uncomment navigation items
- Re-enable components
- Add back to UI
