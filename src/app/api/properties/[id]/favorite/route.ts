import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// Add/remove property from favorites
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id } = await params;
    const body = await request.json();
    const { action } = body; // 'add' or 'remove'

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (action === 'add') {
      // Check if already favorited
      const { data: existing } = await supabase
        .from('property_favorites')
        .select('id')
        .eq('property_id', id)
        .eq('user_id', user.id)
        .single();

      if (existing) {
        return NextResponse.json({ success: true, message: 'Already in favorites' });
      }

      // Add to favorites
      const { data, error } = await supabase
        .from('property_favorites')
        .insert({
          property_id: id,
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
    } else if (action === 'remove') {
      // Remove from favorites
      const { error } = await supabase
        .from('property_favorites')
        .delete()
        .eq('property_id', id)
        .eq('user_id', user.id);

      if (error) {
        return NextResponse.json(
          { error: error.message },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true, message: 'Removed from favorites' });
    } else {
      return NextResponse.json(
        { error: 'Invalid action. Use "add" or "remove"' },
        { status: 400 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An error occurred' },
      { status: 500 }
    );
  }
}

// Check if property is favorited
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id } = await params;

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ isFavorited: false });
    }

    // Check if favorited
    const { data, error } = await supabase
      .from('property_favorites')
      .select('id')
      .eq('property_id', id)
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ isFavorited: !!data });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An error occurred' },
      { status: 500 }
    );
  }
}
