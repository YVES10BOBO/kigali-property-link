# 🗺️ Google Maps Coordinates Guide

## Overview

Your property system uses **latitude and longitude coordinates** to show exact property locations on Google Maps.

---

## 📋 Field Requirements

### **Owner Forms:**
- **Latitude**: Optional
- **Longitude**: Optional
- **Note**: Owner can provide approximate coordinates, but admin will verify and finalize

### **Admin Forms:**
- **Latitude**: **Required** ⚠️
- **Longitude**: **Required** ⚠️
- **Note**: Admin must verify exact property location before finalizing

---

## 🎯 How It Works

### **1. Property Display:**

**Map Pin Location:**
- Uses `latitude` and `longitude` coordinates
- Shows exact property location on Google Maps
- Only displays if coordinates are provided

**Display Text Below Map:**
```
If show_address = true AND address exists:
  "KG 123 St, Kimihurura, Kimihurura, Kigali"
  
If show_address = false OR no address:
  "Kimihurura, Kigali"
```

### **2. Security & Privacy:**

- **Location** (public): Always visible → "Kimihurura, Kigali"
- **Address** (optional): Can be hidden → "KG 123 St"
- **Coordinates** (internal): Used for map pin, not shown to public

---

## 📍 How to Get Coordinates

### **Method 1: Google Maps (Recommended)**

1. **Open Google Maps**: https://www.google.com/maps

2. **Search for Property**:
   - Type the property address or location
   - Example: "KG 123 St, Kimihurura, Kigali"

3. **Find Exact Location**:
   - Zoom in to find the exact property
   - Use satellite view for better accuracy

4. **Get Coordinates**:
   - **Option A**: Right-click on the exact property location
     - Click "What's here?"
     - Coordinates appear at the bottom
   - **Option B**: Click on the property marker
     - Coordinates appear in the info box
   - **Option C**: Look at the URL
     - Format: `@-1.9441,30.0619,15z`
     - First number = Latitude
     - Second number = Longitude

5. **Copy Values**:
   - Latitude: `-1.9441` (negative for Southern Hemisphere)
   - Longitude: `30.0619` (positive for Eastern Hemisphere)

### **Method 2: Google Maps Mobile App**

1. Open Google Maps app
2. Long-press on the exact property location
3. Coordinates appear at the bottom
4. Tap to copy

### **Method 3: GPS Device**

- Use a GPS device at the property location
- Record latitude and longitude values

---

## ✅ Verification Checklist (Admin)

Before finalizing coordinates, verify:

- [ ] Property location matches the address
- [ ] Coordinates are accurate (check on Google Maps)
- [ ] Pin shows correct building/plot
- [ ] Location is searchable and accessible
- [ ] Address visibility is set correctly (show/hide)

---

## 📝 Example Coordinates (Kigali, Rwanda)

### **Common Areas:**

| Area | Latitude | Longitude |
|------|----------|-----------|
| Kimihurura | -1.9441 | 30.0619 |
| Nyarutarama | -1.9300 | 30.0800 |
| Kacyiru | -1.9500 | 30.0700 |
| Kigali City Center | -1.9441 | 30.0619 |
| Remera | -1.9400 | 30.0700 |
| Kicukiro | -1.9600 | 30.0800 |

**Note**: These are approximate. Always verify exact property location!

---

## 🔧 Troubleshooting

### **Map Not Showing:**

1. **Check API Key**:
   - Ensure `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is set in `.env.local`
   - Verify API key is valid and billing is enabled

2. **Check Coordinates**:
   - Ensure latitude and longitude are provided
   - Verify coordinates are valid numbers
   - Check format: Latitude (-90 to 90), Longitude (-180 to 180)

3. **Check Browser Console**:
   - Open browser developer tools (F12)
   - Check for Google Maps API errors
   - Common errors:
     - "This page didn't load Google Maps correctly"
     - "API key not valid"
     - "Billing not enabled"

### **Wrong Location on Map:**

1. **Verify Coordinates**:
   - Check if coordinates match actual property
   - Use Google Maps to verify location

2. **Update Coordinates**:
   - Edit property
   - Update latitude/longitude values
   - Save changes

### **Address Not Showing:**

1. **Check Show Address**:
   - Ensure "Show this address to public" is checked
   - Verify address field is filled

2. **Check Display Logic**:
   - Address only shows if `show_address = true` AND `address` exists
   - Otherwise, only location is shown

---

## 🚀 Best Practices

### **For Owners:**

1. **Provide Location**: Always fill in location (required)
2. **Optional Address**: Can provide address if comfortable
3. **Optional Coordinates**: Can provide approximate coordinates
4. **Privacy**: Keep address hidden if concerned about security

### **For Admins:**

1. **Verify Location**: Always verify property location before approving
2. **Set Coordinates**: Required to set accurate coordinates
3. **Check Map**: Verify pin shows correct location
4. **Security**: Decide if address should be public or hidden
5. **Accuracy**: Use satellite view for better accuracy

---

## 📱 Quick Reference

### **Coordinates Format:**

```
Latitude:  -1.9441  (negative for South)
Longitude: 30.0619  (positive for East)
```

### **Kigali, Rwanda Coordinates:**

- **Latitude Range**: -1.95 to -1.90 (approximately)
- **Longitude Range**: 30.05 to 30.10 (approximately)

### **Common Mistakes:**

❌ **Wrong**: Latitude = 1.9441 (missing negative)
✅ **Correct**: Latitude = -1.9441

❌ **Wrong**: Coordinates swapped (lat/lng reversed)
✅ **Correct**: Latitude first, then Longitude

❌ **Wrong**: Using street address instead of coordinates
✅ **Correct**: Use actual GPS coordinates

---

## 🔐 Security Notes

1. **Coordinates are Internal**: Not displayed to public, only used for map pin
2. **Address Can Be Hidden**: Keep address private if needed
3. **Location is Public**: General area is always visible
4. **Admin Verification**: Admin must verify coordinates before finalizing

---

## ✅ Summary

- **Location** = Public area (required) → "Kimihurura, Kigali"
- **Address** = Specific street (optional) → "KG 123 St"
- **Coordinates** = Map pin location (owner optional, admin required)
- **Show Address** = Control address visibility (default: hidden)

**For Google Maps:**
- Pin uses `latitude` and `longitude` coordinates
- Display text shows address (if visible) or location
- Only shows map if coordinates are provided

---

**Last Updated:** January 2026
