import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const limit = searchParams.get('limit');
    const search = searchParams.get('search');
    const admin = searchParams.get('admin') === 'true';
    
    let query = supabase
      .from('blog_posts')
      .select('*, users(name, email)')
      .order('published_at', { ascending: false });
    
    // For public, only show published posts
    if (!admin) {
      query = query.eq('status', 'published');
    }
    
    if (category) {
      query = query.eq('category', category);
    }
    
    if (featured === 'true') {
      query = query.eq('featured', true);
    }
    
    if (search) {
      query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%,content.ilike.%${search}%`);
    }
    
    if (limit) {
      query = query.limit(parseInt(limit));
    }
    
    const { data, error } = await query;
    
    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(data || []);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    
    // Generate slug from title if not provided
    const slug = body.slug || body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    
    // Get author_id from users table
    const { data: userProfile } = await supabase
      .from('users')
      .select('id')
      .eq('email', user.email)
      .single();
    
    const postData: any = {
      title: body.title,
      slug: slug,
      excerpt: body.excerpt || null,
      content: body.content,
      featured_image: body.featured_image || null,
      author_id: userProfile?.id || null,
      category: body.category || null,
      tags: body.tags || [],
      status: body.status || 'draft',
      featured: body.featured || false,
    };
    
    if (body.status === 'published' && !body.published_at) {
      postData.published_at = new Date().toISOString();
    } else if (body.published_at) {
      postData.published_at = body.published_at;
    }
    
    const { data, error } = await supabase
      .from('blog_posts')
      .insert([postData])
      .select('*, users(name, email)')
      .single();
    
    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
