import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id } = await params;
    
    const { data, error } = await supabase
      .from('commissions')
      .select(`
        *,
        inquiries(id, name, email, phone, status),
        properties(id, title, location, price, price_type)
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    if (!data) {
      return NextResponse.json(
        { error: 'Commission not found' },
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

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id } = await params;
    const body = await request.json();
    
    // Build update object
    const updateData: any = {};
    
    if (body.amount !== undefined) {
      updateData.amount = parseFloat(body.amount);
    }
    
    if (body.status !== undefined) {
      updateData.status = body.status;
    }
    
    if (body.payment_date !== undefined) {
      updateData.payment_date = body.payment_date || null;
    }
    
    if (body.notes !== undefined) {
      updateData.notes = body.notes || null;
    }
    
    if (body.inquiry_id !== undefined) {
      updateData.inquiry_id = body.inquiry_id || null;
    }
    
    if (body.property_id !== undefined) {
      updateData.property_id = body.property_id || null;
    }
    
    const { data, error } = await supabase
      .from('commissions')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        inquiries(id, name, email, phone, status),
        properties(id, title, location, price, price_type)
      `)
      .single();
    
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

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id } = await params;
    
    const { error } = await supabase
      .from('commissions')
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


