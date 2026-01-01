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
      query = query.eq('status', 'available');
    }
    
    // Apply admin filters
    if (isAdmin) {
      if (status && status !== 'all') {
        query = query.eq('status', status);
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
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    
    const { data, error } = await supabase
      .from('properties')
      .insert([body])
      .select()
      .single();
    
    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
