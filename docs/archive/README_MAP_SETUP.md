# Map Integration Setup Guide

## ✅ What's Been Implemented

1. **Database Migration** - Added `latitude` and `longitude` columns to properties table
2. **PropertyMap Component** - Interactive Google Maps component
3. **Map View on Properties Page** - Toggle between list and map view
4. **Map on Property Detail Pages** - Shows property location

## 🔧 Setup Instructions

### 1. Run Database Migration

Run this SQL in your Supabase SQL Editor:
```sql
-- File: supabase/migrations/009_add_property_coordinates.sql
```

This will:
- Add `latitude` and `longitude` columns to properties
- Set approximate coordinates for existing properties based on location
- You can manually update coordinates for more accuracy

### 2. Get Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable "Maps JavaScript API"
4. Create credentials (API Key)
5. Restrict the API key to:
   - HTTP referrers: `http://localhost:3000/*` (for development)
   - Your production domain (for production)

### 3. Add API Key to Environment Variables

Add to your `.env.local` file:
```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-api-key-here
```

### 4. Update Property Coordinates

For accurate map locations, update property coordinates in Supabase:

```sql
-- Example: Update a specific property
UPDATE properties 
SET latitude = -1.9441, longitude = 30.0619
WHERE id = 'your-property-id';

-- Or use geocoding service to get coordinates from addresses
```

### 5. Geocoding Properties (Optional)

To automatically get coordinates from addresses, you can:

1. Use Google Geocoding API
2. Or manually enter coordinates in the admin dashboard (add lat/lng fields to property form)

## 🎯 Features

- **Interactive Map** - Click markers to see property info
- **List/Map Toggle** - Switch between views on properties page
- **Property Detail Map** - Shows exact property location
- **Info Windows** - Click markers for property details
- **Auto-fit Bounds** - Map adjusts to show all properties

## 📝 Notes

- Properties without coordinates won't show on map
- Map requires Google Maps API key
- Free tier: $200/month credit (usually covers ~28,000 map loads)
- Consider adding geocoding when adding/editing properties
