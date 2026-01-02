import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// Get all favorites for current user
export async function GET() {
  try {
    const supabase = await createClient();
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json(
        { favorites: [] },
        { status: 200 }
      );
    }

    // Get favorite property IDs
    const { data, error } = await supabase
      .from('property_favorites')
      .select('property_id')
      .eq('user_id', user.id);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    const favorites = data?.map(f => f.property_id) || [];
    return NextResponse.json({ favorites });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An error occurred' },
      { status: 500 }
    );
  }
}

// Add property to favorites
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { property_id } = body;

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (!property_id) {
      return NextResponse.json(
        { error: 'property_id is required' },
        { status: 400 }
      );
    }

    // Check if already favorited
    const { data: existing } = await supabase
      .from('property_favorites')
      .select('id')
      .eq('property_id', property_id)
      .eq('user_id', user.id)
      .single();

    if (existing) {
      return NextResponse.json({ success: true, message: 'Already in favorites' });
    }

    // Add to favorites
    const { data, error } = await supabase
      .from('property_favorites')
      .insert({
        property_id,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, favorite: data });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An error occurred' },
      { status: 500 }
    );
  }
}

// Remove property from favorites
export async function DELETE(request: Request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const property_id = searchParams.get('property_id');

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (!property_id) {
      return NextResponse.json(
        { error: 'property_id is required' },
        { status: 400 }
      );
    }

    // Remove from favorites
    const { error } = await supabase
      .from('property_favorites')
      .delete()
      .eq('property_id', property_id)
      .eq('user_id', user.id);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: 'Removed from favorites' });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An error occurred' },
      { status: 500 }
    );
  }
}
