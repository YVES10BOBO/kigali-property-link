# 📍 Location vs Address - Implementation Guide

## Overview

Your property system now has **two separate fields**:

### **1. Location** (Required, Public)
- **Purpose**: General area/neighborhood visible to everyone
- **Example**: "Kimihurura, Kigali"
- **Visibility**: Always shown to public
- **Required**: Yes

### **2. Address** (Optional, Can be Hidden)
- **Purpose**: Specific street address
- **Example**: "KG 123 St, Kimihurura"
- **Visibility**: Only shown if `show_address = true`
- **Required**: No

---

## 🎯 Best Practices

### **For Google Maps:**

**Option 1: Use Address (Recommended)**
- If address is provided and `show_address = true` → Use address for map
- More accurate pin location
- Better for navigation

**Option 2: Use Location (Fallback)**
- If no address OR `show_address = false` → Use location
- Shows general area on map
- Less specific but still useful

**Current Implementation:**
- Google Maps uses `latitude` and `longitude` coordinates
- Display text shows: `address + location` (if address visible) OR just `location`

---

## 📋 Form Fields

### **Owner/Admin Forms:**

1. **Location** (Required)
   - Label: "Location / Area"
   - Placeholder: "e.g., Kimihurura, Kigali"
   - Required: Yes
   - Always visible to public

2. **Address** (Optional)
   - Label: "Specific Address (Optional)"
   - Placeholder: "e.g., KG 123 St, Kimihurura"
   - Required: No
   - Can be left empty

3. **Show Address** (Checkbox)
   - Label: "Show this address to public"
   - Default: Unchecked (hidden)
   - If checked: Address will be visible on property page
   - If unchecked: Only location will be shown

---

## 🔒 Privacy & Security

### **Why Separate Fields?**

1. **Privacy**: Property owners may not want to reveal exact street address
2. **Security**: Prevents unwanted visitors to empty properties
3. **Flexibility**: Owners can choose what to share

### **Recommendation:**

- **For Rentals**: Usually safe to show address (tenants need to know location)
- **For Sales**: Can hide address until serious inquiry
- **For Vacant Properties**: Keep address hidden for security

---

## 🗺️ Google Maps Integration

### **What to Show on Map:**

**Display Text Below Map:**
```
If show_address = true AND address exists:
  "KG 123 St, Kimihurura, Kimihurura, Kigali"
  
If show_address = false OR no address:
  "Kimihurura, Kigali"
```

**Map Pin Location:**
- Uses `latitude` and `longitude` coordinates
- If coordinates not set, Google Maps can geocode from:
  1. Address (if available and show_address = true)
  2. Location (fallback)

---

## ✅ Migration Steps

1. **Run Migration:**
   ```sql
   -- Already created: supabase/migrations/016_add_address_field.sql
   ```

2. **Update Forms:**
   - ✅ Owner add property
   - ✅ Owner edit property
   - ✅ Admin add property
   - ✅ Admin edit property

3. **Update Display:**
   - ✅ Property detail page
   - ✅ Property cards (show location only)
   - ✅ Google Maps info window

---

## 📝 Examples

### **Example 1: Public Address**
```
Location: "Kimihurura, Kigali"
Address: "KG 123 St, Kimihurura"
Show Address: ✅ Checked

Display: "KG 123 St, Kimihurura, Kimihurura, Kigali"
```

### **Example 2: Hidden Address**
```
Location: "Kimihurura, Kigali"
Address: "KG 123 St, Kimihurura"
Show Address: ❌ Unchecked

Display: "Kimihurura, Kigali"
```

### **Example 3: No Address**
```
Location: "Kimihurura, Kigali"
Address: (empty)
Show Address: ❌ Unchecked

Display: "Kimihurura, Kigali"
```

---

## 🚀 Next Steps

1. ✅ Database migration created
2. ✅ Forms updated
3. ✅ Property display updated
4. ⏳ Update API to handle address fields
5. ⏳ Update edit forms
6. ⏳ Test Google Maps integration

---

## 💡 Recommendations

### **For Your Platform:**

1. **Keep Location Required**: Always need general area
2. **Make Address Optional**: Not everyone wants to share exact address
3. **Default to Hidden**: Keep addresses private by default (security)
4. **For Google Maps**: Use address if available, otherwise use location
5. **For Search**: Users can search by location (area), not specific address

---

**Last Updated:** January 2026
