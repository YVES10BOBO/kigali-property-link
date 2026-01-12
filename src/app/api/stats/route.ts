import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createClient();

    // Fetch all statistics in parallel for better performance
    const [propertiesResult, inquiriesResult, usersResult] = await Promise.all([
      // Count total properties (all statuses for accurate count)
      supabase
        .from('properties')
        .select('id, status, created_at', { count: 'exact', head: false }),
      
      // Count total inquiries (represents client interactions)
      supabase
        .from('inquiries')
        .select('id, email, created_at', { count: 'exact', head: false }),
      
      // Count total users (registered users)
      supabase
        .from('users')
        .select('id', { count: 'exact', head: false }),
    ]);

    // Handle errors
    if (propertiesResult.error) {
      console.error('Error fetching properties:', propertiesResult.error);
    }
    if (inquiriesResult.error) {
      console.error('Error fetching inquiries:', inquiriesResult.error);
    }
    if (usersResult.error) {
      console.error('Error fetching users:', usersResult.error);
    }

    // Calculate statistics
    const totalProperties = propertiesResult.data?.length || 0;
    const availableProperties = propertiesResult.data?.filter(
      (p) => p.status === 'available'
    ).length || 0;
    
    // Count unique clients (unique email addresses from inquiries)
    const uniqueClients = new Set(
      inquiriesResult.data?.map((i) => i.email.toLowerCase()) || []
    ).size;
    const totalInquiries = inquiriesResult.data?.length || 0;
    
    // Use total inquiries as "happy clients" (more accurate representation)
    // Or use unique clients if preferred
    const happyClients = totalInquiries; // Can change to uniqueClients if preferred
    
    // Calculate years of experience from first property created date
    // Or use platform launch date (January 2025 as example)
    const platformLaunchDate = new Date('2025-01-01'); // Update this to your actual launch date
    const propertiesData = propertiesResult.data || [];
    const firstPropertyDate = propertiesData.length > 0
      ? new Date(
          Math.min(
            ...(propertiesData
              .map((p) => new Date(p.created_at).getTime())
              .filter((d) => !isNaN(d)))
          )
        )
      : platformLaunchDate;
    
    const yearsExperience = Math.max(
      1,
      Math.floor(
        (Date.now() - Math.min(firstPropertyDate.getTime(), platformLaunchDate.getTime())) /
        (1000 * 60 * 60 * 24 * 365)
      )
    );

    // Support available (static but can be made configurable)
    const supportAvailable = '24/7';

    return NextResponse.json({
      propertiesListed: totalProperties,
      availableProperties,
      happyClients,
      uniqueClients, // Also provide unique clients count
      totalInquiries, // Also provide total inquiries
      yearsExperience,
      supportAvailable,
      success: true,
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    return NextResponse.json(
      {
        propertiesListed: 0,
        availableProperties: 0,
        happyClients: 0,
        uniqueClients: 0,
        totalInquiries: 0,
        yearsExperience: 1,
        supportAvailable: '24/7',
        success: false,
        error: 'Failed to fetch statistics',
      },
      { status: 500 }
    );
  }
}
