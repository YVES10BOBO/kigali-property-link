import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { sendAvailabilityConfirmationEmail } from '@/lib/utils/property-email';

// Cron job endpoint to check and send availability confirmation reminders
// Should be called daily (e.g., via Vercel Cron, external cron service, or manually)
export async function GET(request: Request) {
  try {
    // Optional: Add authentication/authorization for cron jobs
    // For Vercel Cron, you can check the Authorization header
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const supabase = await createClient();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find properties that need confirmation:
    // 1. Status is 'available'
    // 2. confirmation_due_date is today or in the past
    // 3. Haven't been confirmed recently (last_confirmed_at is old or null)
    const { data: properties, error } = await supabase
      .from('properties')
      .select('*, owner_id, users!properties_owner_id_fkey(email, name)')
      .eq('status', 'available')
      .lte('confirmation_due_date', today.toISOString())
      .order('confirmation_due_date', { ascending: true });

    if (error) {
      console.error('Error fetching properties:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    if (!properties || properties.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No properties need confirmation at this time',
        count: 0,
      });
    }

    const results = {
      sent: 0,
      failed: 0,
      skipped: 0,
      details: [] as Array<{ propertyId: string; propertyTitle: string; status: string }>,
    };

    // Send confirmation emails
    for (const property of properties) {
      try {
        // Check if owner exists and has email
        const owner = property.users as { email: string; name: string } | null;
        
        if (!owner || !owner.email) {
          console.log(`Skipping property ${property.id}: No owner email`);
          results.skipped++;
          results.details.push({
            propertyId: property.id,
            propertyTitle: property.title,
            status: 'skipped_no_email',
          });
          continue;
        }

        // Build confirmation link
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const confirmationLink = `${baseUrl}/api/properties/${property.id}/confirm?token=${property.id}`;

        // Send email
        const emailResult = await sendAvailabilityConfirmationEmail({
          ownerEmail: owner.email,
          ownerName: owner.name || 'Property Owner',
          propertyTitle: property.title,
          propertyId: property.id,
          confirmationLink,
        });

        if (emailResult.success) {
          results.sent++;
          results.details.push({
            propertyId: property.id,
            propertyTitle: property.title,
            status: 'email_sent',
          });
        } else {
          results.failed++;
          results.details.push({
            propertyId: property.id,
            propertyTitle: property.title,
            status: 'email_failed',
          });
        }
      } catch (err) {
        console.error(`Error processing property ${property.id}:`, err);
        results.failed++;
        results.details.push({
          propertyId: property.id,
          propertyTitle: property.title,
          status: 'error',
        });
      }
    }

    // After 7 days of no response, mark as unverified
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    // Find properties that were due for confirmation more than 7 days ago
    const { data: unverifiedProperties, error: unverifiedError } = await supabase
      .from('properties')
      .select('id, title')
      .eq('status', 'available')
      .lte('confirmation_due_date', sevenDaysAgo.toISOString());

    if (!unverifiedError && unverifiedProperties && unverifiedProperties.length > 0) {
      // Mark as unverified
      const { error: updateError } = await supabase
        .from('properties')
        .update({ status: 'unverified' })
        .in('id', unverifiedProperties.map(p => p.id));

      if (!updateError) {
        results.details.push(
          ...unverifiedProperties.map(p => ({
            propertyId: p.id,
            propertyTitle: p.title,
            status: 'marked_unverified',
          }))
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: `Processed ${properties.length} properties`,
      results,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error in confirmation cron job:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'An error occurred',
      },
      { status: 500 }
    );
  }
}
