import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const start = searchParams.get('start');
    const end = searchParams.get('end');
    const inquiryId = searchParams.get('inquiryId');
    
    let query = supabase
      .from('calendar_events')
      .select('*, properties(title, location), inquiries(name, email, phone)')
      .order('start_time', { ascending: true });
    
    if (start) {
      query = query.gte('start_time', start);
    }
    
    if (end) {
      query = query.lte('start_time', end);
    }
    
    if (inquiryId) {
      query = query.eq('inquiry_id', inquiryId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(data || []);
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
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    
    // Get user profile for created_by
    const { data: userProfile } = await supabase
      .from('users')
      .select('id')
      .eq('email', user.email)
      .single();
    
    const eventData: any = {
      inquiry_id: body.inquiry_id || null,
      property_id: body.property_id || null,
      title: body.title,
      description: body.description || null,
      start_time: body.start_time,
      end_time: body.end_time,
      location: body.location || null,
      attendee_name: body.attendee_name || null,
      attendee_email: body.attendee_email || null,
      attendee_phone: body.attendee_phone || null,
      status: body.status || 'scheduled',
      created_by: userProfile?.id || null,
    };
    
    const { data, error } = await supabase
      .from('calendar_events')
      .insert([eventData])
      .select('*, properties(title, location), inquiries(name, email, phone)')
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
