import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/shared/WhatsAppButton";
import Link from "next/link";

export default function BlogPage() {
  // Sample blog posts - in the future, these can come from a database
  const blogPosts = [
    {
      id: 1,
      title: "Top 5 Neighborhoods to Live in Kigali in 2025",
      excerpt: "Discover the best areas in Kigali for renting or buying property, from Kimihurura to Nyarutarama.",
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
      date: "January 15, 2025",
      category: "Location Guide",
      readTime: "5 min read"
    },
    {
      id: 2,
      title: "Understanding Rental Prices in Kigali: A Complete Guide",
      excerpt: "Everything you need to know about rental prices, what affects them, and how to find the best deals.",
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
      date: "January 10, 2025",
      category: "Market Insights",
      readTime: "7 min read"
    },
    {
      id: 3,
      title: "Greenland Plaza: Why It's Kigali's Most Sought-After Property",
      excerpt: "Explore what makes Greenland Plaza one of the most desirable residential complexes in Kigali.",
      image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
      date: "January 5, 2025",
      category: "Property Spotlight",
      readTime: "6 min read"
    },
    {
      id: 4,
      title: "First-Time Renter's Guide to Kigali",
      excerpt: "Essential tips and advice for first-time renters in Kigali, from documentation to what to look for.",
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
      date: "December 28, 2024",
      category: "Tips & Advice",
      readTime: "8 min read"
    },
    {
      id: 5,
      title: "Investment Opportunities in Kigali Real Estate",
      excerpt: "Why Kigali is becoming a hotspot for real estate investment and what opportunities exist for investors.",
      image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
      date: "December 20, 2024",
      category: "Investment",
      readTime: "10 min read"
    },
    {
      id: 6,
      title: "Furnished vs Unfurnished: Which is Right for You?",
      excerpt: "A comprehensive comparison to help you decide between furnished and unfurnished properties in Kigali.",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
      date: "December 15, 2024",
      category: "Tips & Advice",
      readTime: "6 min read"
    }
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="container-custom py-24">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-dark mb-4">Our Blog</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Stay updated with the latest real estate news, tips, and insights about Kigali's property market
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {blogPosts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {post.category}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                  <span className="flex items-center gap-1">
                    <i className="far fa-calendar"></i>
                    {post.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <i className="far fa-clock"></i>
                    {post.readTime}
                  </span>
                </div>
                
                <h2 className="text-2xl font-bold text-dark mb-3 hover:text-primary transition-colors">
                  <Link href={`/blog/${post.id}`}>{post.title}</Link>
                </h2>
                
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                
                <Link
                  href={`/blog/${post.id}`}
                  className="text-primary font-semibold hover:text-primary-dark transition-colors inline-flex items-center gap-2"
                >
                  Read More
                  <i className="fas fa-arrow-right"></i>
                </Link>
              </div>
            </article>
          ))}
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
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}


