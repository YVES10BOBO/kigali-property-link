import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// Availability confirmation endpoint
// Used when owner clicks confirmation link in email
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action'); // 'available' or 'sold'

    // Get property
    const { data: property, error: propertyError } = await supabase
      .from('properties')
      .select('*')
      .eq('id', id)
      .single();

    if (propertyError || !property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    let newStatus: string;
    let updateData: Record<string, unknown> = {};

    if (action === 'available') {
      newStatus = 'available';
      updateData.last_confirmed_at = new Date().toISOString();
      // Set next confirmation due date to 30 days from now
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 30);
      updateData.confirmation_due_date = dueDate.toISOString();
    } else if (action === 'sold') {
      newStatus = 'sold';
      // Property will be auto-hidden from public
    } else {
      return NextResponse.json(
        { error: 'Invalid action. Use ?action=available or ?action=sold' },
        { status: 400 }
      );
    }

    updateData.status = newStatus;

    // Update property
    const { data: updatedProperty, error: updateError } = await supabase
      .from('properties')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message },
        { status: 500 }
      );
    }

    // Redirect to success page or return JSON
    const redirectUrl = new URL('/owner/dashboard', request.url);
    redirectUrl.searchParams.set('confirmed', 'true');
    redirectUrl.searchParams.set('status', newStatus);

    return NextResponse.redirect(redirectUrl.toString());
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An error occurred' },
      { status: 500 }
    );
  }
}
