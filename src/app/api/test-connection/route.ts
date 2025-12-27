import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createClient();
    
    // Test query - try to fetch from properties table
    const { data, error } = await supabase
      .from('properties')
      .select('count')
      .limit(1);

    if (error) {
      return NextResponse.json(
        { 
          success: false, 
          error: error.message,
          details: error
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Database connection successful!',
      data: data,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Connection failed',
        details: 'Check your .env.local file and Supabase credentials'
      },
      { status: 500 }
    );
  }
}

