import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/shared/WhatsAppButton";
import BlogPostClient from "./BlogPostClient";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ slug: string }>;
}

import { absoluteUrl, defaultOgImage } from "@/lib/metadata";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  
  try {
    // Try by slug first, then by ID
    let { data: post } = await supabase
      .from('blog_posts')
      .select('title, excerpt, featured_image')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();
    
    if (!post) {
      const result = await supabase
        .from('blog_posts')
        .select('title, excerpt, featured_image')
        .eq('id', slug)
        .eq('status', 'published')
        .single();
      post = result.data;
    }

    if (!post) {
      return {
        title: "Blog Post Not Found",
        description: "The blog post you're looking for doesn't exist.",
      };
    }

    const imageUrl = post.featured_image
      ? absoluteUrl(post.featured_image)
      : defaultOgImage();

    return {
      title: `${post.title} - BridgeProperties Blog`,
      description: post.excerpt || post.title,
      openGraph: {
        title: post.title,
        description: post.excerpt || post.title,
        images: [imageUrl],
      },
    };
  } catch (error) {
    return {
      title: "Blog Post",
      description: "Read our blog post",
    };
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container-custom pt-28 pb-12">
        <BlogPostClient slug={slug} />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
