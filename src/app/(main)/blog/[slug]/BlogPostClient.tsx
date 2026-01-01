"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import LoadingSpinner from "@/components/LoadingSpinner";
import AutoTranslatedText from "@/components/property/AutoTranslatedText";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string | null;
  category: string | null;
  tags: string[] | null;
  published_at: string;
  views: number;
  users: { name: string; email: string } | null;
}

interface BlogPostClientProps {
  slug: string;
}

export default function BlogPostClient({ slug }: BlogPostClientProps) {
  const { t } = useLanguage();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPost();
  }, [slug]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/blog/${slug}`);
      if (response.ok) {
        const data = await response.json();
        setPost(data);
      } else {
        setError("Blog post not found");
      }
    } catch (error) {
      setError("Failed to load blog post");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading blog post..." />;
  }

  if (error || !post) {
    return (
      <div className="text-center py-16">
        <i className="fas fa-exclamation-circle text-6xl text-gray-300 mb-4"></i>
        <h2 className="text-2xl font-bold text-dark mb-2">Blog Post Not Found</h2>
        <p className="text-gray-600 mb-6">{error || "The blog post you're looking for doesn't exist."}</p>
        <Link
          href="/blog"
          className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
        >
          Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto">
      {/* Back Button */}
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-primary transition-colors mb-6"
      >
        <i className="fas fa-arrow-left"></i>
        Back to Blog
      </Link>

      {/* Featured Image */}
      {post.featured_image && (
        <div className="mb-8 rounded-2xl overflow-hidden">
          <img
            src={post.featured_image}
            alt={post.title}
            className="w-full h-96 object-cover"
          />
        </div>
      )}

      {/* Post Header */}
      <header className="mb-8">
        {post.category && (
          <span className="inline-block bg-primary text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
            {post.category}
          </span>
        )}
        <h1 className="text-4xl md:text-5xl font-bold text-dark mb-4">
          <AutoTranslatedText text={post.title} from="en" />
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
          {post.users && (
            <span className="flex items-center gap-2">
              <i className="fas fa-user"></i>
              {post.users.name || post.users.email}
            </span>
          )}
          <span className="flex items-center gap-2">
            <i className="far fa-calendar"></i>
            {formatDate(post.published_at)}
          </span>
          <span className="flex items-center gap-2">
            <i className="fas fa-eye"></i>
            {post.views || 0} views
          </span>
        </div>
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* Post Content */}
      <div className="prose prose-lg max-w-none mb-12">
        <AutoTranslatedText 
          text={post.content} 
          from="en"
        />
      </div>

      {/* Share Section */}
      <div className="bg-light rounded-xl p-6 mb-12">
        <h3 className="text-xl font-bold text-dark mb-4">Share this post</h3>
        <div className="flex gap-4">
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <i className="fab fa-facebook mr-2"></i>
            Facebook
          </a>
          <a
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-400 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition-colors"
          >
            <i className="fab fa-twitter mr-2"></i>
            Twitter
          </a>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(post.title + ' ' + window.location.href)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#25d366] text-white px-4 py-2 rounded-lg hover:bg-[#20ba5a] transition-colors"
          >
            <i className="fab fa-whatsapp mr-2"></i>
            WhatsApp
          </a>
        </div>
      </div>

      {/* Back to Blog */}
      <div className="text-center">
        <Link
          href="/blog"
          className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
        >
          <i className="fas fa-arrow-left mr-2"></i>
          Back to Blog
        </Link>
      </div>
    </article>
  );
}
