import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    
    // Get filter parameters
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const priceType = searchParams.get('price_type');
    const priceMin = searchParams.get('price_min');
    const priceMax = searchParams.get('price_max');
    const dateFrom = searchParams.get('date_from');
    const dateTo = searchParams.get('date_to');
    const propertyType = searchParams.get('property_type');
    
    let query = supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false });
    
    // Apply filters
    if (status && status !== 'all') query = query.eq('status', status);
    if (priceType && priceType !== 'all') query = query.eq('price_type', priceType);
    if (priceMin) query = query.gte('price', parseInt(priceMin));
    if (priceMax) query = query.lte('price', parseInt(priceMax));
    if (dateFrom) query = query.gte('created_at', dateFrom);
    if (dateTo) {
      const endDate = new Date(dateTo);
      endDate.setHours(23, 59, 59, 999);
      query = query.lte('created_at', endDate.toISOString());
    }
    if (propertyType) query = query.eq('property_type', propertyType);
    if (search) {
      query = query.or(`title.ilike.%${search}%,location.ilike.%${search}%`);
    }
    
    const { data: properties, error } = await query;
    
    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    if (!properties || properties.length === 0) {
      return NextResponse.json(
        { error: 'No properties found to export' },
        { status: 404 }
      );
    }
    
    // Convert to CSV
    const headers = [
      'ID',
      'Title',
      'Location',
      'Property Type',
      'Price Type',
      'Price',
      'Bedrooms',
      'Bathrooms',
      'Area (m²)',
      'Status',
      'Description',
      'Created At',
    ];
    
    const rows = properties.map((prop) => [
      prop.id,
      prop.title,
      prop.location,
      prop.property_type || '',
      prop.price_type,
      prop.price,
      prop.bedrooms || '',
      prop.bathrooms || '',
      prop.area || '',
      prop.status,
      (prop.description || '').replace(/\n/g, ' ').substring(0, 100),
      new Date(prop.created_at).toLocaleString(),
    ]);
    
    // Escape CSV values
    const escapeCsv = (value: any) => {
      if (value === null || value === undefined) return '';
      const str = String(value);
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };
    
    const csvContent = [
      headers.map(escapeCsv).join(','),
      ...rows.map((row) => row.map(escapeCsv).join(',')),
    ].join('\n');
    
    // Add BOM for Excel compatibility
    const bom = '\uFEFF';
    const csvWithBom = bom + csvContent;
    
    const filename = `properties-export-${new Date().toISOString().split('T')[0]}.csv`;
    
    return new NextResponse(csvWithBom, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
