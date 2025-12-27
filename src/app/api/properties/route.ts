import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    
    // Get query parameters for filtering
    const location = searchParams.get('location');
    const purpose = searchParams.get('purpose');
    const priceRange = searchParams.get('priceRange');
    const search = searchParams.get('search');
    
    // Build query
    let query = supabase
      .from('properties')
      .select('*')
      .eq('status', 'available'); // Only show available properties
    
    // Apply filters
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
    
    // Price range filter
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
