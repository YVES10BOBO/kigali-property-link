import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// Get current user's profile
export async function GET() {
  try {
    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error('Supabase environment variables not configured');
      return NextResponse.json(
        { error: 'Database connection not configured. Please check your environment variables.' },
        { status: 500 }
      );
    }

    const supabase = await createClient();
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user profile from public.users table
    const { data: profile, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', user.email)
      .maybeSingle();

    // If there's any error, log it but don't block the UI
    if (error) {
      console.error('Error fetching user profile:', error);
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        ...profile,
      },
    });
  } catch (error: any) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    
    // Check if it's a network/DNS error
    if (error.cause?.code === 'ENOTFOUND' || error.message?.includes('getaddrinfo')) {
      console.error('Supabase connection error:', error);
      return NextResponse.json(
        { 
          error: 'Cannot connect to database. Please check your Supabase configuration.',
          details: 'The Supabase URL might be incorrect or the project might be paused.',
          help: 'Visit /api/health to check your configuration.'
        },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

// Create or update user profile
export async function POST(request: Request) {
  try {
    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error('Supabase environment variables not configured');
      return NextResponse.json(
        { error: 'Database connection not configured. Please check your environment variables.' },
        { status: 500 }
      );
    }

    const supabase = await createClient();
    const adminEmail = process.env.ADMIN_EMAIL;
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, role, avatar_url, phone } = body;

    // Decide role:
    // - If matches ADMIN_EMAIL env → admin
    // - Else use provided role or default to 'user'
    const userRole =
      adminEmail && user.email === adminEmail ? 'admin' : (role || 'user');

    // Insert or update user profile
    // Use INSERT with ON CONFLICT since upsert might not work with RLS
    const { data: existingProfile } = await supabase
      .from('users')
      .select('*')
      .eq('email', user.email)
      .single();

    let profile;
    let error;

    if (existingProfile) {
      // Update existing profile
      const { data, error: updateError } = await supabase
        .from('users')
        .update({
          name: name || existingProfile.name,
          avatar_url: avatar_url ?? existingProfile.avatar_url,
          phone: phone ?? existingProfile.phone,
          role: existingProfile.role || userRole, // Don't change role if already set
        })
        .eq('email', user.email)
        .select()
        .single();
      profile = data;
      error = updateError;
    } else {
      // Insert new profile
      const { data, error: insertError } = await supabase
        .from('users')
        .insert({
          id: user.id,
          email: user.email,
          name: name || user.email,
          avatar_url: avatar_url ?? null,
          phone: phone ?? null,
          role: userRole,
        })
        .select()
        .single();
      profile = data;
      error = insertError;
    }

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      profile,
    });
  } catch (error: any) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    
    // Check if it's a network/DNS error
    if (error.cause?.code === 'ENOTFOUND' || error.message?.includes('getaddrinfo')) {
      console.error('Supabase connection error:', error);
      return NextResponse.json(
        { 
          error: 'Cannot connect to database. Please check your Supabase configuration.',
          details: 'The Supabase URL might be incorrect or the project might be paused.',
          help: 'Visit /api/health to check your configuration.'
        },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

