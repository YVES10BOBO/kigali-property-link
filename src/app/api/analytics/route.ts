import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    
    const dateFrom = searchParams.get('date_from');
    const dateTo = searchParams.get('date_to');
    
    // Build base query
    let query = supabase.from('inquiries').select('*, properties(title)');
    
    if (dateFrom) {
      query = query.gte('created_at', dateFrom);
    }
    
    if (dateTo) {
      const endDate = new Date(dateTo);
      endDate.setHours(23, 59, 59, 999);
      query = query.lte('created_at', endDate.toISOString());
    }
    
    const { data: inquiries, error } = await query;
    
    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    if (!inquiries || inquiries.length === 0) {
      return NextResponse.json({
        inquiriesOverTime: [],
        popularProperties: [],
        statusDistribution: [],
        inquiryTypes: [],
      });
    }
    
    // Process inquiries over time (group by date)
    const inquiriesByDate: Record<string, number> = {};
    inquiries.forEach((inq) => {
      const date = new Date(inq.created_at).toISOString().split('T')[0];
      inquiriesByDate[date] = (inquiriesByDate[date] || 0) + 1;
    });
    
    const inquiriesOverTime = Object.entries(inquiriesByDate)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-30); // Last 30 days
    
    // Popular properties
    const propertyCounts: Record<string, { title: string; count: number }> = {};
    inquiries.forEach((inq) => {
      const propId = inq.property_id || 'general';
      const title = inq.properties?.title || 'General Inquiry';
      if (!propertyCounts[propId]) {
        propertyCounts[propId] = { title, count: 0 };
      }
      propertyCounts[propId].count++;
    });
    
    const popularProperties = Object.entries(propertyCounts)
      .map(([property_id, data]) => ({ property_id, ...data }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
    
    // Status distribution
    const statusCounts: Record<string, number> = {};
    inquiries.forEach((inq) => {
      statusCounts[inq.status] = (statusCounts[inq.status] || 0) + 1;
    });
    
    const statusDistribution = Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count,
    }));
    
    // Inquiry types
    const typeCounts: Record<string, number> = {};
    inquiries.forEach((inq) => {
      typeCounts[inq.inquiry_type] = (typeCounts[inq.inquiry_type] || 0) + 1;
    });
    
    const inquiryTypes = Object.entries(typeCounts).map(([type, count]) => ({
      type,
      count,
    }));
    
    return NextResponse.json({
      inquiriesOverTime,
      popularProperties,
      statusDistribution,
      inquiryTypes,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
