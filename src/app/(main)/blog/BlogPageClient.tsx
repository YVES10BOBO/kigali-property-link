"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import LoadingSpinner from "@/components/LoadingSpinner";
import AutoTranslatedText from "@/components/property/AutoTranslatedText";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featured_image: string | null;
  category: string | null;
  tags: string[] | null;
  published_at: string;
  views: number;
  users: { name: string; email: string } | null;
}

export default function BlogPageClient() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/blog");
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      }
    } catch (error) {
      console.error("Failed to fetch blog posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading blog posts..." />;
  }

  return (
    <>
      {/* Blog Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {posts.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <i className="fas fa-blog text-6xl text-gray-300 mb-4"></i>
            <h3 className="text-2xl font-bold text-dark mb-2">No Blog Posts Yet</h3>
            <p className="text-gray-600">Check back soon for new articles!</p>
          </div>
        ) : (
          posts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="relative h-48 overflow-hidden">
                {post.featured_image ? (
                  <img
                    src={post.featured_image}
                    alt={post.title}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
                    <i className="fas fa-blog text-6xl text-white opacity-50"></i>
                  </div>
                )}
                {post.category && (
                  <div className="absolute top-4 left-4">
                    <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {post.category}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                  <span className="flex items-center gap-1">
                    <i className="far fa-calendar"></i>
                    {formatDate(post.published_at)}
                  </span>
                  <span className="flex items-center gap-1">
                    <i className="fas fa-eye"></i>
                    {post.views || 0}
                  </span>
                </div>
                
                <h2 className="text-2xl font-bold text-dark mb-3 hover:text-primary transition-colors">
                  <Link href={`/blog/${post.slug || post.id}`}>
                    <AutoTranslatedText text={post.title} from="en" />
                  </Link>
                </h2>
                
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.excerpt ? (
                    <AutoTranslatedText text={post.excerpt} from="en" />
                  ) : (
                    "No excerpt available"
                  )}
                </p>
                
                <Link
                  href={`/blog/${post.slug || post.id}`}
                  className="text-primary font-semibold hover:text-primary-dark transition-colors inline-flex items-center gap-2"
                >
                  Read More
                  <i className="fas fa-arrow-right"></i>
                </Link>
              </div>
            </article>
          ))
        )}
      </div>

      {/* Newsletter Signup */}
      <div className="bg-gradient-to-br from-primary to-primary-dark rounded-2xl p-12 text-center text-white">
        <h2 className="text-4xl font-bold mb-4">Stay Updated</h2>
        <p className="text-xl text-gray-100 mb-8 max-w-2xl mx-auto">
          Subscribe to our newsletter to get the latest property listings, market insights, and real estate tips delivered to your inbox.
        </p>
        <form className="max-w-md mx-auto flex gap-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-6 py-3 rounded-lg text-dark focus:outline-none focus:ring-2 focus:ring-white"
          />
          <button
            type="submit"
            className="bg-secondary text-white px-8 py-3 rounded-lg font-semibold hover:bg-secondary-dark transition-colors"
          >
            Subscribe
          </button>
        </form>
      </div>
    </>
  );
}
