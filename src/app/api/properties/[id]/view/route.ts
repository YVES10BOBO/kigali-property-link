import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

// Track property view
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id } = await params;

    // Get current user (if logged in)
    const { data: { user } } = await supabase.auth.getUser();

    // Get IP address and user agent
    const headersList = await headers();
    const ipAddress = headersList.get('x-forwarded-for') || 
                      headersList.get('x-real-ip') || 
                      'unknown';
    const userAgent = headersList.get('user-agent') || 'unknown';

    // Record view
    const { data, error } = await supabase
      .from('property_views')
      .insert({
        property_id: id,
        user_id: user?.id || null,
        ip_address: ipAddress,
        user_agent: userAgent,
      })
      .select()
      .single();

    if (error) {
      // Don't fail the request if view tracking fails
      console.error('Failed to track view:', error);
      return NextResponse.json({ success: false, message: error.message });
    }

    // Update property views_count (trigger should handle this, but ensure it's updated)
    try {
      await supabase.rpc('update_property_views_count_manual', { p_property_id: id });
    } catch (rpcError) {
      // If function doesn't exist or RPC fails, fall back to fetching and incrementing
      try {
        const { data: propData, error: propErr } = await supabase
          .from('properties')
          .select('views_count')
          .eq('id', id)
          .single();

        if (!propErr && propData) {
          const newCount = (propData.views_count ?? 0) + 1;
          await supabase.from('properties').update({ views_count: newCount }).eq('id', id);
        }
      } catch (fallbackErr) {
        // swallow fallback errors — view tracking shouldn't block the response
        console.error('Failed to increment views_count fallback:', fallbackErr);
      }
    }

    return NextResponse.json({ success: true, view: data });
  } catch (error) {
    // Don't fail the request if view tracking fails
    console.error('Error tracking view:', error);
    return NextResponse.json({ 
      success: false, 
      message: error instanceof Error ? error.message : 'An error occurred' 
    });
  }
}
