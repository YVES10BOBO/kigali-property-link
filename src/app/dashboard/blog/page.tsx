"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  status: "draft" | "published" | "archived";
  featured: boolean;
  category: string;
  views: number;
  published_at: string | null;
  created_at: string;
  users?: { name: string; email: string } | null;
}

export default function BlogManagementPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [successMessage, setSuccessMessage] = useState<string>("");

  useEffect(() => {
    fetchPosts();
  }, [filter]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/blog?admin=true");
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

  const deletePost = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;

    try {
      const response = await fetch(`/api/blog/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setSuccessMessage("Blog post deleted successfully");
        fetchPosts();
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        alert("Failed to delete blog post");
      }
    } catch (error) {
      alert("Failed to delete blog post");
    }
  };

  const filteredPosts =
    filter === "all"
      ? posts
      : posts.filter((post) => post.status === filter);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not published";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div>
      {/* Page Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-dark mb-2">Blog Management</h1>
          <p className="text-gray-600">Create and manage blog posts</p>
        </div>
        <Link
          href="/dashboard/blog/add"
          className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors flex items-center gap-2"
        >
          <i className="fas fa-plus"></i>
          New Post
        </Link>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6">
          <i className="fas fa-check-circle mr-2"></i>
          {successMessage}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-6">
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === "all"
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All ({posts.length})
          </button>
          <button
            onClick={() => setFilter("published")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === "published"
                ? "bg-green-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Published ({posts.filter((p) => p.status === "published").length})
          </button>
          <button
            onClick={() => setFilter("draft")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === "draft"
                ? "bg-yellow-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Draft ({posts.filter((p) => p.status === "draft").length})
          </button>
          <button
            onClick={() => setFilter("archived")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === "archived"
                ? "bg-gray-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Archived ({posts.filter((p) => p.status === "archived").length})
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16">
          <i className="fas fa-spinner fa-spin text-4xl text-primary mb-4"></i>
          <p className="text-gray-600">Loading blog posts...</p>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <i className="fas fa-blog text-6xl text-gray-300 mb-4"></i>
          <h3 className="text-2xl font-bold text-dark mb-2">No Blog Posts Found</h3>
          <p className="text-gray-600 mb-6">
            {filter === "all"
              ? "You haven't created any blog posts yet."
              : `No blog posts with status "${filter}" found.`}
          </p>
          <Link
            href="/dashboard/blog/add"
            className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
          >
            Create Your First Post
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-dark mb-2">{post.title}</h3>
                      <p className="text-gray-600 mb-3 line-clamp-2">{post.excerpt}</p>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <i className="fas fa-tag"></i>
                          {post.category || "Uncategorized"}
                        </span>
                        <span className="flex items-center gap-1">
                          <i className="fas fa-eye"></i>
                          {post.views || 0} views
                        </span>
                        <span className="flex items-center gap-1">
                          <i className="far fa-calendar"></i>
                          {formatDate(post.published_at || post.created_at)}
                        </span>
                        {post.users && (
                          <span className="flex items-center gap-1">
                            <i className="fas fa-user"></i>
                            {post.users.name || post.users.email}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          post.status === "published"
                            ? "bg-green-100 text-green-700"
                            : post.status === "draft"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {post.status}
                      </span>
                      {post.featured && (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                          <i className="fas fa-star mr-1"></i>
                          Featured
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 md:w-48">
                  {post.status === "published" && (
                    <a
                      href={`/blog/${post.slug || post.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors text-center"
                    >
                      <i className="fas fa-eye mr-1"></i>
                      View
                    </a>
                  )}
                  <Link
                    href={`/dashboard/blog/edit/${post.id}`}
                    className="flex-1 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors text-center"
                  >
                    <i className="fas fa-edit mr-1"></i>
                    Edit
                  </Link>
                  <button
                    onClick={() => deletePost(post.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
