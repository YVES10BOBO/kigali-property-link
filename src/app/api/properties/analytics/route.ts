import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    
    const dateFrom = searchParams.get('date_from');
    const dateTo = searchParams.get('date_to');
    
    // Get all properties
    let propertiesQuery = supabase.from('properties').select('id, title, status, created_at');
    
    if (dateFrom) {
      propertiesQuery = propertiesQuery.gte('created_at', dateFrom);
    }
    
    if (dateTo) {
      const endDate = new Date(dateTo);
      endDate.setHours(23, 59, 59, 999);
      propertiesQuery = propertiesQuery.lte('created_at', endDate.toISOString());
    }
    
    const { data: properties, error: propertiesError } = await propertiesQuery;
    
    if (propertiesError) {
      return NextResponse.json(
        { error: propertiesError.message },
        { status: 500 }
      );
    }
    
    if (!properties || properties.length === 0) {
      return NextResponse.json({
        propertiesWithInquiries: [],
        statusDistribution: [],
        priceTypeDistribution: [],
        propertiesOverTime: [],
      });
    }
    
    // Get inquiries per property
    let inquiriesQuery = supabase
      .from('inquiries')
      .select('property_id, status, created_at');
    
    if (dateFrom) {
      inquiriesQuery = inquiriesQuery.gte('created_at', dateFrom);
    }
    
    if (dateTo) {
      const endDate = new Date(dateTo);
      endDate.setHours(23, 59, 59, 999);
      inquiriesQuery = inquiriesQuery.lte('created_at', endDate.toISOString());
    }
    
    const { data: inquiries, error: inquiriesError } = await inquiriesQuery;
    
    if (inquiriesError) {
      return NextResponse.json(
        { error: inquiriesError.message },
        { status: 500 }
      );
    }
    
    // Count inquiries per property
    const propertyInquiryCounts: Record<string, number> = {};
    if (inquiries) {
      inquiries.forEach((inq) => {
        const propId = inq.property_id || 'general';
        propertyInquiryCounts[propId] = (propertyInquiryCounts[propId] || 0) + 1;
      });
    }
    
    // Combine properties with inquiry counts
    const propertiesWithInquiries = properties.map((prop) => ({
      id: prop.id,
      title: prop.title,
      status: prop.status,
      inquiryCount: propertyInquiryCounts[prop.id] || 0,
      created_at: prop.created_at,
    })).sort((a, b) => b.inquiryCount - a.inquiryCount);
    
    // Status distribution
    const statusCounts: Record<string, number> = {};
    properties.forEach((prop) => {
      statusCounts[prop.status] = (statusCounts[prop.status] || 0) + 1;
    });
    
    const statusDistribution = Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count,
    }));
    
    // Get price type distribution (need to fetch full property data)
    const { data: fullProperties } = await supabase
      .from('properties')
      .select('price_type');
    
    const priceTypeCounts: Record<string, number> = {};
    if (fullProperties) {
      fullProperties.forEach((prop) => {
        priceTypeCounts[prop.price_type] = (priceTypeCounts[prop.price_type] || 0) + 1;
      });
    }
    
    const priceTypeDistribution = Object.entries(priceTypeCounts).map(([type, count]) => ({
      type,
      count,
    }));
    
    // Properties over time (group by date)
    const propertiesByDate: Record<string, number> = {};
    properties.forEach((prop) => {
      const date = new Date(prop.created_at).toISOString().split('T')[0];
      propertiesByDate[date] = (propertiesByDate[date] || 0) + 1;
    });
    
    const propertiesOverTime = Object.entries(propertiesByDate)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-30); // Last 30 days
    
    return NextResponse.json({
      propertiesWithInquiries,
      statusDistribution,
      priceTypeDistribution,
      propertiesOverTime,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
