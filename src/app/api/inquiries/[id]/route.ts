import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { sendStatusUpdateNotification } from '@/lib/utils/email';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const body = await request.json();
    
    // Validate status if provided
    const validStatuses = ['new', 'contacted', 'viewing_scheduled', 'closed', 'lost'];
    if (body.status && !validStatuses.includes(body.status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be one of: ' + validStatuses.join(', ') },
        { status: 400 }
      );
    }
    
    // Build update object
    const updateData: any = {};
    if (body.status) updateData.status = body.status;
    if (body.notes !== undefined) updateData.notes = body.notes;
    
    // Get the inquiry before updating to check if status changed
    const { data: oldInquiry } = await supabase
      .from('inquiries')
      .select('*, properties(title, location)')
      .eq('id', id)
      .single();

    const { data, error } = await supabase
      .from('inquiries')
      .update(updateData)
      .eq('id', id)
      .select('*, properties(title, location)')
      .single();
    
    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    // Send email notification to client if status changed
    if (body.status && oldInquiry && oldInquiry.status !== body.status && data.email) {
      try {
        await sendStatusUpdateNotification({
          name: data.name,
          email: data.email,
          inquiry_type: data.inquiry_type,
          status: data.status,
          property_title: data.properties?.title,
          property_location: data.properties?.location,
          preferred_date: data.preferred_date || undefined,
          message: data.message || undefined,
        });
      } catch (emailError) {
        // Don't fail the request if email fails
        console.error('Failed to send status update email:', emailError);
      }
    }
    
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    
    const { error } = await supabase
      .from('inquiries')
      .delete()
      .eq('id', id);
    
    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('inquiries')
      .select('*, properties(title, location)')
      .eq('id', id)
      .single();
    
    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
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


