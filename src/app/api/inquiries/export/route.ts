import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    
    // Get filter parameters (same as main inquiries API)
    const email = searchParams.get('email');
    const status = searchParams.get('status');
    const propertyId = searchParams.get('property_id');
    const dateFrom = searchParams.get('date_from');
    const dateTo = searchParams.get('date_to');
    const search = searchParams.get('search');
    const inquiryType = searchParams.get('inquiry_type');
    const format = searchParams.get('format') || 'csv'; // csv or excel
    
    let query = supabase
      .from('inquiries')
      .select('*, properties(title, location)')
      .order('created_at', { ascending: false });
    
    // Apply filters (same logic as main API)
    if (email) query = query.eq('email', email);
    if (status && status !== 'all') query = query.eq('status', status);
    if (propertyId) query = query.eq('property_id', propertyId);
    if (dateFrom) query = query.gte('created_at', dateFrom);
    if (dateTo) {
      const endDate = new Date(dateTo);
      endDate.setHours(23, 59, 59, 999);
      query = query.lte('created_at', endDate.toISOString());
    }
    if (inquiryType) query = query.eq('inquiry_type', inquiryType);
    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%,message.ilike.%${search}%`);
    }
    
    const { data: inquiries, error } = await query;
    
    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    if (!inquiries || inquiries.length === 0) {
      return NextResponse.json(
        { error: 'No inquiries found to export' },
        { status: 404 }
      );
    }
    
    // Convert to CSV
    const headers = [
      'ID',
      'Name',
      'Email',
      'Phone',
      'Property',
      'Location',
      'Inquiry Type',
      'Status',
      'Message',
      'Preferred Date',
      'Created At',
    ];
    
    const rows = inquiries.map((inq) => [
      inq.id,
      inq.name,
      inq.email,
      inq.phone,
      inq.properties?.title || 'General Inquiry',
      inq.properties?.location || '',
      inq.inquiry_type,
      inq.status,
      inq.message || '',
      inq.preferred_date || '',
      new Date(inq.created_at).toLocaleString(),
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
    
    const filename = `inquiries-export-${new Date().toISOString().split('T')[0]}.csv`;
    
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
