import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

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
    
    // Build query
    let query = supabase.from('properties').select('*');
    
    // For public pages, only show available properties
    // For admin dashboard, show all properties
    if (!isAdmin) {
      // Only show 'available' status to public
      // Hide: pending_approval, sold, rented, unverified, rejected, needs_revision
      query = query.eq('status', 'available');
    }
    
    // Apply admin filters
    if (isAdmin) {
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
    
    // Price range filter (public)
    if (priceRange) {
      if (priceRange === '1200+') {
        query = query.gte('price', 1200);
      } else {
        const [min, max] = priceRange.split('-');
        if (min && max) {
          query = query.gte('price', parseInt(min)).lte('price', parseInt(max));
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
    
    return NextResponse.json(data);
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
    
    // Ensure status is set (default to pending_approval for new properties)
    const propertyData = {
      ...body,
      status: body.status || 'pending_approval',
    };
    
    const { data, error } = await supabase
      .from('properties')
      .insert([propertyData])
      .select()
      .single();
    
    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
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
    
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An error occurred' },
      { status: 500 }
    );
  }
}
