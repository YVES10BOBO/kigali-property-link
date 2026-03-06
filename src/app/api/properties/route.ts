import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

function mapUnits(row: any) {
  if (!row) return row;
  const { property_units, ...rest } = row;
  return {
    ...rest,
    units: property_units || [],
  };
}

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    
    // Check if this is an admin request (dashboard)
    const isAdmin = searchParams.get('admin') === 'true';
    
    // Get query parameters for filtering
    const location = searchParams.get('location');
    const purpose = searchParams.get('purpose');
    const priceRange = searchParams.get('priceRange');
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const priceType = searchParams.get('price_type');
    const priceMin = searchParams.get('price_min');
    const priceMax = searchParams.get('price_max');
    const dateFrom = searchParams.get('date_from');
    const dateTo = searchParams.get('date_to');
    const propertyType = searchParams.get('property_type');
    
    // Build query - include units if they exist
    let query = supabase.from('properties').select('*, property_units(*)');
    
    // For public pages, restrict to customer-facing statuses
    // For admin dashboard, show all properties with full status filtering
    if (!isAdmin) {
      // Public site behaviour:
      // - "All" (or no status param): show available + off_plan
      // - status=off_plan: only off-plan projects
      // - status=available: only available properties
      if (!status || status === 'all') {
        query = query.in('status', ['available', 'off_plan']);
      } else if (status === 'off_plan') {
        query = query.eq('status', 'off_plan');
      } else if (status === 'available') {
        query = query.eq('status', 'available');
      } else {
        // Fallback: still hide internal statuses from public
        query = query.in('status', ['available', 'off_plan']);
      }
    } else {
      // Apply admin filters
      if (status && status !== 'all') {
        query = query.eq('status', status);
      }
      // Allow filtering by pending_approval for approvals page
      if (status === 'pending_approval') {
        query = query.eq('status', 'pending_approval');
      }
      if (priceType && priceType !== 'all') {
        query = query.eq('price_type', priceType);
      }
      if (priceMin) {
        query = query.gte('price', parseInt(priceMin));
      }
      if (priceMax) {
        query = query.lte('price', parseInt(priceMax));
      }
      if (dateFrom) {
        query = query.gte('created_at', dateFrom);
      }
      if (dateTo) {
        const endDate = new Date(dateTo);
        endDate.setHours(23, 59, 59, 999);
        query = query.lte('created_at', endDate.toISOString());
      }
      if (propertyType) {
        query = query.eq('property_type', propertyType);
      }
    }
    
    // Apply public filters
    if (location) {
      query = query.ilike('location', `%${location}%`);
    }
    
    if (purpose) {
      query = query.eq('price_type', purpose);
    }
    
    if (propertyType && !isAdmin) {
      query = query.eq('property_type', propertyType);
    }
    
    if (search) {
      query = query.or(`title.ilike.%${search}%,location.ilike.%${search}%`);
    }
    
    // Limit results (optional, for homepage)
    const limit = searchParams.get('limit');
    if (limit) {
      query = query.limit(parseInt(limit));
    }
    
    // Price range filter (public). priceRange values come from client and may include a "+"
    if (priceRange) {
      if (priceRange.endsWith('+')) {
        const min = parseInt(priceRange.slice(0, -1));
        if (!isNaN(min)) {
          query = query.gte('price', min);
        }
      } else {
        const [minStr, maxStr] = priceRange.split('-');
        const min = parseInt(minStr);
        const max = parseInt(maxStr);
        if (!isNaN(min) && !isNaN(max)) {
          query = query.gte('price', min).lte('price', max);
        }
      }
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json((data || []).map(mapUnits));
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An error occurred' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    
    // Extract units if provided
    const { units, ...propertyData } = body;
    
    // Ensure status is set (default to pending_approval for new properties)
    const propertyToInsert = {
      ...propertyData,
      status: propertyData.status || 'pending_approval',
    };
    
    const { data, error } = await supabase
      .from('properties')
      .insert([propertyToInsert])
      .select()
      .single();
    
    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    // Insert units if provided
    if (units && Array.isArray(units) && units.length > 0) {
      const unitsToInsert = units.map((unit: any) => ({
        ...unit,
        property_id: data.id,
        // Inherit currency from property if not specified in unit
        currency: unit.currency || propertyData.currency || 'RWF',
      }));
      
      const { error: unitsError } = await supabase
        .from('property_units')
        .insert(unitsToInsert);
      
      if (unitsError) {
        console.error('Error inserting units:', unitsError);
        // Don't fail the request, but log the error
      }
    }
    
    // Fetch property with units
    const { data: propertyWithUnits } = await supabase
      .from('properties')
      .select('*, property_units(*)')
      .eq('id', data.id)
      .single();
    
    // Send email notification to admin about new property pending approval
    if (data.status === 'pending_approval' && data.owner_id) {
      try {
        // Get owner information
        const { data: owner } = await supabase
          .from('users')
          .select('name')
          .eq('id', data.owner_id)
          .single();

        const { sendPropertyPendingNotification } = await import('@/lib/utils/property-email');
        
        await sendPropertyPendingNotification({
          propertyTitle: data.title,
          propertyLocation: data.location,
          ownerName: owner?.name || 'Property Owner',
          propertyId: data.id,
        });
      } catch (emailError) {
        console.error('Failed to send pending notification email:', emailError);
        // Don't fail the request if email fails
      }
    }
    
    return NextResponse.json(mapUnits(propertyWithUnits || data), { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An error occurred' },
      { status: 500 }
    );
  }
}
