import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { sendInquiryNotification } from '@/lib/utils/email';

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    
    // Get filter parameters
    const email = searchParams.get('email');
    const status = searchParams.get('status');
    const propertyId = searchParams.get('property_id');
    const dateFrom = searchParams.get('date_from');
    const dateTo = searchParams.get('date_to');
    const search = searchParams.get('search'); // Search in name, email, phone, message
    const inquiryType = searchParams.get('inquiry_type');
    
    let query = supabase
      .from('inquiries')
      .select('*, properties(title, location)')
      .order('created_at', { ascending: false });
    
    // Apply filters
    if (email) {
      query = query.eq('email', email);
    }
    
    if (status && status !== 'all') {
      query = query.eq('status', status);
    }
    
    if (propertyId) {
      query = query.eq('property_id', propertyId);
    }
    
    if (dateFrom) {
      query = query.gte('created_at', dateFrom);
    }
    
    if (dateTo) {
      // Add 23:59:59 to include the entire end date
      const endDate = new Date(dateTo);
      endDate.setHours(23, 59, 59, 999);
      query = query.lte('created_at', endDate.toISOString());
    }
    
    if (inquiryType) {
      query = query.eq('inquiry_type', inquiryType);
    }
    
    if (search) {
      // Search in name, email, phone, or message
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%,message.ilike.%${search}%`);
    }
    
    const { data, error } = await query;
    
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
    
    // Validate required fields
    if (!body.name || !body.email || !body.phone) {
      return NextResponse.json(
        { error: 'Name, email, and phone are required' },
        { status: 400 }
      );
    }
    
    const { data, error } = await supabase
      .from('inquiries')
      .insert([{
        property_id: body.property_id || null,
        name: body.name,
        email: body.email,
        phone: body.phone,
        message: body.message || null,
        inquiry_type: body.inquiry_type || 'general',
        preferred_date: body.preferred_date || null,
        status: 'new'
      }])
      .select()
      .single();
    
    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    // Send email notification (non-blocking)
    try {
      // Fetch property details if property_id exists
      let propertyTitle = null;
      let propertyLocation = null;
      
      if (data.property_id) {
        const propertyResponse = await supabase
          .from('properties')
          .select('title, location')
          .eq('id', data.property_id)
          .single();
        
        if (propertyResponse.data) {
          propertyTitle = propertyResponse.data.title;
          propertyLocation = propertyResponse.data.location;
        }
      }
      
      await sendInquiryNotification({
        name: data.name,
        email: data.email,
        phone: data.phone,
        message: data.message || undefined,
        inquiry_type: data.inquiry_type,
        preferred_date: data.preferred_date || undefined,
        property_title: propertyTitle || undefined,
        property_location: propertyLocation || undefined,
      });
    } catch (emailError) {
      // Don't fail the request if email fails
      console.error('Failed to send email notification:', emailError);
    }
    
    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
