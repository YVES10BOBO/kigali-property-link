import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    
    // Try to get by ID first, then by slug
    let query = supabase
      .from('blog_posts')
      .select('*, users(name, email)')
      .eq('id', id)
      .eq('status', 'published')
      .single();
    
    let { data, error } = await query;
    
    // If not found by ID, try slug
    if (error && error.code === 'PGRST116') {
      query = supabase
        .from('blog_posts')
        .select('*, users(name, email)')
        .eq('slug', id)
        .eq('status', 'published')
        .single();
      
      const result = await query;
      data = result.data;
      error = result.error;
    }
    
    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      );
    }
    
    // Increment views
    if (data) {
      await supabase
        .from('blog_posts')
        .update({ views: (data.views || 0) + 1 })
        .eq('id', data.id);
    }
    
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    
    const updateData: any = {};
    if (body.title) updateData.title = body.title;
    if (body.slug) updateData.slug = body.slug;
    if (body.excerpt !== undefined) updateData.excerpt = body.excerpt;
    if (body.content) updateData.content = body.content;
    if (body.featured_image !== undefined) updateData.featured_image = body.featured_image;
    if (body.category) updateData.category = body.category;
    if (body.tags) updateData.tags = body.tags;
    if (body.status) {
      updateData.status = body.status;
      if (body.status === 'published' && !body.published_at) {
        updateData.published_at = new Date().toISOString();
      }
    }
    if (body.featured !== undefined) updateData.featured = body.featured;
    if (body.published_at) updateData.published_at = body.published_at;
    
    const { data, error } = await supabase
      .from('blog_posts')
      .update(updateData)
      .eq('id', id)
      .select('*, users(name, email)')
      .single();
    
    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);
    
    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
