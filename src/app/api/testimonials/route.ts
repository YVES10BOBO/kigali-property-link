import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    
    const propertyId = searchParams.get('property_id');
    const featured = searchParams.get('featured');
    const limit = searchParams.get('limit');
    
    let query = supabase
      .from('testimonials')
      .select('*')
      .eq('status', 'approved')
      .order('created_at', { ascending: false });
    
    if (propertyId) {
      query = query.eq('property_id', propertyId);
    }
    
    if (featured === 'true') {
      query = query.eq('featured', true);
    }
    
    if (limit) {
      query = query.limit(parseInt(limit));
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Testimonials fetch error:', error);
      // If table doesn't exist, return empty array instead of error
      if (error.code === 'PGRST116' || error.message?.includes('does not exist')) {
        return NextResponse.json([]);
      }
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(data || []);
  } catch (error: any) {
    console.error('Testimonials API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch testimonials' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.rating || !body.review) {
      return NextResponse.json(
        { error: 'Name, rating, and review are required' },
        { status: 400 }
      );
    }
    
    // Validate rating
    if (body.rating < 1 || body.rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }
    
    // Get user email if authenticated
    const { data: { user } } = await supabase.auth.getUser();
    
    const { data, error } = await supabase
      .from('testimonials')
      .insert([{
        name: body.name,
        email: body.email || user?.email || null,
        rating: body.rating,
        review: body.review,
        property_id: body.property_id || null,
        status: 'pending', // Requires admin approval
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Testimonials insert error:', error);
      return NextResponse.json(
        { 
          error: error.message,
          details: error.code === 'PGRST116' ? 'Table does not exist. Please run the migration.' : error.message
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    console.error('Testimonials API error:', error);
    return NextResponse.json(
      { 
        error: error.message || 'Failed to submit testimonial',
        details: 'Please check if the testimonials table exists in your database.'
      },
      { status: 500 }
    );
  }
}
