import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { action, notes, rejection_reason } = body;

    // Await params (Next.js 15+ requirement)
    const { id } = await params;

    // Get current user (admin)
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

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
    let updateData: any = {
      admin_notes: notes || null,
      approved_by: user.id,
    };

    switch (action) {
      case 'approve':
        newStatus = 'available';
        updateData.approved_at = new Date().toISOString();
        updateData.last_confirmed_at = new Date().toISOString();
        // Set confirmation due date to 30 days from now
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 30);
        updateData.confirmation_due_date = dueDate.toISOString();
        break;
      case 'reject':
        newStatus = 'rejected';
        updateData.rejection_reason = rejection_reason || notes;
        break;
      case 'request_revision':
        newStatus = 'needs_revision';
        updateData.rejection_reason = notes;
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
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

    // Send email notification to owner
    if (property.owner_id) {
      try {
        // Get owner information
        const { data: owner } = await supabase
          .from('users')
          .select('email, name')
          .eq('id', property.owner_id)
          .single();

        if (owner) {
          const { sendPropertyApprovalNotification } = await import('@/lib/utils/property-email');
          
          await sendPropertyApprovalNotification({
            ownerEmail: owner.email,
            ownerName: owner.name || 'Property Owner',
            propertyTitle: property.title,
            propertyId: property.id,
            action: action as 'approved' | 'rejected' | 'needs_revision',
            reason: rejection_reason || notes,
            notes: notes,
          });
        }
      } catch (emailError) {
        console.error('Failed to send approval email:', emailError);
        // Don't fail the request if email fails
      }
    }

    return NextResponse.json(updatedProperty);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
