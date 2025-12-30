import { NextResponse } from 'next/server';

// Health check endpoint to verify Supabase connection
export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const checks = {
    supabaseUrlConfigured: !!supabaseUrl,
    supabaseKeyConfigured: !!supabaseKey,
    supabaseUrlFormat: supabaseUrl?.startsWith('https://') && supabaseUrl?.includes('.supabase.co'),
    timestamp: new Date().toISOString(),
  };

  if (!checks.supabaseUrlConfigured || !checks.supabaseKeyConfigured) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Supabase environment variables are not configured',
        checks,
        help: 'Please check your .env.local file and ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.',
      },
      { status: 500 }
    );
  }

  if (!checks.supabaseUrlFormat) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Supabase URL format is incorrect',
        checks,
        help: 'NEXT_PUBLIC_SUPABASE_URL should be in format: https://xxxxx.supabase.co',
      },
      { status: 500 }
    );
  }

  // Try to connect to Supabase
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: 'GET',
      headers: {
        'apikey': supabaseKey!,
        'Authorization': `Bearer ${supabaseKey}`,
      },
    });

    return NextResponse.json({
      status: response.ok ? 'healthy' : 'error',
      message: response.ok ? 'Supabase connection successful' : 'Supabase connection failed',
      checks: {
        ...checks,
        supabaseReachable: response.ok,
        supabaseStatus: response.status,
      },
      supabaseUrl: supabaseUrl?.replace(/https?:\/\/([^.]+)\.supabase\.co.*/, '$1'), // Show only project ID
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Cannot reach Supabase',
        error: error.message,
        checks: {
          ...checks,
          supabaseReachable: false,
        },
        help: 'Check if your Supabase project is active and the URL is correct. The project might be paused.',
      },
      { status: 500 }
    );
  }
}
