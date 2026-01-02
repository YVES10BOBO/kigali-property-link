import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// Get analytics for a specific property
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    
    const dateFrom = searchParams.get('date_from');
    const dateTo = searchParams.get('date_to');

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get property to check ownership
    const { data: property, error: propertyError } = await supabase
      .from('properties')
      .select('owner_id')
      .eq('id', id)
      .single();

    if (propertyError || !property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    // Check if user is owner or admin
    const { data: userProfile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    const isOwner = property.owner_id === user.id;
    const isAdmin = userProfile?.role === 'admin';

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized - You can only view analytics for your own properties' },
        { status: 403 }
      );
    }

    // Build date range
    const dateFromValue = dateFrom || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const dateToValue = dateTo || new Date().toISOString();

    // Get views
    let viewsQuery = supabase
      .from('property_views')
      .select('*')
      .eq('property_id', id)
      .gte('viewed_at', dateFromValue)
      .lte('viewed_at', dateToValue);

    const { data: views, error: viewsError } = await viewsQuery.order('viewed_at', { ascending: false });

    // Get inquiries
    let inquiriesQuery = supabase
      .from('inquiries')
      .select('*')
      .eq('property_id', id)
      .gte('created_at', dateFromValue)
      .lte('created_at', dateToValue);

    const { data: inquiries, error: inquiriesError } = await inquiriesQuery.order('created_at', { ascending: false });

    if (viewsError || inquiriesError) {
      return NextResponse.json(
        { error: 'Failed to fetch analytics data' },
        { status: 500 }
      );
    }

    // Calculate statistics
    const totalViews = views?.length || 0;
    const uniqueViews = new Set(views?.map(v => v.user_id || v.ip_address)).size;
    const totalInquiries = inquiries?.length || 0;

    // Views over time (group by date)
    const viewsByDate: Record<string, number> = {};
    views?.forEach((view) => {
      const date = new Date(view.viewed_at).toISOString().split('T')[0];
      viewsByDate[date] = (viewsByDate[date] || 0) + 1;
    });

    const viewsOverTime = Object.entries(viewsByDate)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Inquiries over time
    const inquiriesByDate: Record<string, number> = {};
    inquiries?.forEach((inq) => {
      const date = new Date(inq.created_at).toISOString().split('T')[0];
      inquiriesByDate[date] = (inquiriesByDate[date] || 0) + 1;
    });

    const inquiriesOverTime = Object.entries(inquiriesByDate)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Calculate conversion rate
    const conversionRate = totalViews > 0 ? (totalInquiries / totalViews) * 100 : 0;

    // Calculate average views per day
    const daysDiff = Math.ceil(
      (new Date(dateToValue).getTime() - new Date(dateFromValue).getTime()) / (1000 * 60 * 60 * 24)
    );
    const avgViewsPerDay = daysDiff > 0 ? totalViews / daysDiff : 0;

    // Get property details
    const { data: propertyData } = await supabase
      .from('properties')
      .select('title, views_count')
      .eq('id', id)
      .single();

    return NextResponse.json({
      property: {
        id,
        title: propertyData?.title,
        totalViewsCount: propertyData?.views_count || 0,
      },
      period: {
        from: dateFromValue,
        to: dateToValue,
        days: daysDiff,
      },
      statistics: {
        totalViews,
        uniqueViews,
        totalInquiries,
        conversionRate: Math.round(conversionRate * 100) / 100,
        avgViewsPerDay: Math.round(avgViewsPerDay * 100) / 100,
      },
      viewsOverTime,
      inquiriesOverTime,
      recentViews: views?.slice(0, 10) || [],
      recentInquiries: inquiries?.slice(0, 10) || [],
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An error occurred' },
      { status: 500 }
    );
  }
}
