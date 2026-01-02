"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Property } from "@/types/property";

interface PropertyAnalytics {
  property: {
    id: string;
    title: string;
    totalViewsCount: number;
  };
  period: {
    from: string;
    to: string;
    days: number;
  };
  statistics: {
    totalViews: number;
    uniqueViews: number;
    totalInquiries: number;
    conversionRate: number;
    avgViewsPerDay: number;
  };
  viewsOverTime: Array<{ date: string; count: number }>;
  inquiriesOverTime: Array<{ date: string; count: number }>;
  recentViews: Array<{ viewed_at: string; ip_address?: string }>;
  recentInquiries: Array<{ created_at: string; name: string; email: string }>;
}

export default function OwnerAnalyticsPage() {
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<string>("");
  const [analytics, setAnalytics] = useState<PropertyAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [dateRange, setDateRange] = useState({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    if (selectedProperty) {
      fetchAnalytics();
    }
  }, [selectedProperty, dateRange]);

  const fetchProperties = async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push("/login?redirect=/owner/analytics");
        return;
      }

      const { data: propertiesData, error } = await supabase
        .from("properties")
        .select("*")
        .eq("owner_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching properties:", error);
      } else {
        setProperties(propertiesData || []);
        if (propertiesData && propertiesData.length > 0 && !selectedProperty) {
          setSelectedProperty(propertiesData[0].id);
        }
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    if (!selectedProperty) return;

    setAnalyticsLoading(true);
    try {
      const params = new URLSearchParams({
        date_from: dateRange.from,
        date_to: dateRange.to,
      });

      const response = await fetch(`/api/properties/${selectedProperty}/analytics?${params}`);
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      } else {
        console.error("Failed to fetch analytics");
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container-custom">
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <i className="fas fa-chart-line text-6xl text-gray-300 mb-4"></i>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Properties Yet</h3>
            <p className="text-gray-600 mb-6">List your first property to see analytics</p>
            <Link
              href="/owner/properties/add"
              className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
            >
              List Your First Property
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Property Analytics</h1>
              <p className="text-gray-600 mt-2">Track performance of your properties</p>
            </div>
            <Link
              href="/owner/dashboard"
              className="text-primary hover:text-primary-dark"
            >
              <i className="fas fa-arrow-left mr-2"></i>
              Back to Dashboard
            </Link>
          </div>
        </div>

        {/* Property Selector */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Property
          </label>
          <select
            value={selectedProperty}
            onChange={(e) => setSelectedProperty(e.target.value)}
            className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {properties.map((prop) => (
              <option key={prop.id} value={prop.id}>
                {prop.title} - {prop.location}
              </option>
            ))}
          </select>

          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                From Date
              </label>
              <input
                type="date"
                value={dateRange.from}
                onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                To Date
              </label>
              <input
                type="date"
                value={dateRange.to}
                onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Analytics */}
        {analyticsLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading analytics...</p>
          </div>
        ) : analytics ? (
          <div className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="text-2xl font-bold text-gray-900">{analytics.statistics.totalViews}</div>
                <div className="text-gray-600 text-sm">Total Views</div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="text-2xl font-bold text-blue-600">{analytics.statistics.uniqueViews}</div>
                <div className="text-gray-600 text-sm">Unique Views</div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="text-2xl font-bold text-green-600">{analytics.statistics.totalInquiries}</div>
                <div className="text-gray-600 text-sm">Inquiries</div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="text-2xl font-bold text-purple-600">{analytics.statistics.conversionRate.toFixed(1)}%</div>
                <div className="text-gray-600 text-sm">Conversion Rate</div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="text-2xl font-bold text-orange-600">{analytics.statistics.avgViewsPerDay.toFixed(1)}</div>
                <div className="text-gray-600 text-sm">Avg Views/Day</div>
              </div>
            </div>

            {/* Charts Placeholder */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Views Over Time</h3>
              {analytics.viewsOverTime.length > 0 ? (
                <div className="space-y-2">
                  {analytics.viewsOverTime.map((item) => (
                    <div key={item.date} className="flex items-center gap-4">
                      <div className="w-24 text-sm text-gray-600">{item.date}</div>
                      <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                        <div
                          className="bg-primary h-6 rounded-full flex items-center justify-end pr-2"
                          style={{
                            width: `${(item.count / Math.max(...analytics.viewsOverTime.map(v => v.count))) * 100}%`,
                          }}
                        >
                          <span className="text-white text-xs font-medium">{item.count}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No views in this period</p>
              )}
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Views</h3>
                {analytics.recentViews.length > 0 ? (
                  <div className="space-y-2">
                    {analytics.recentViews.map((view, index) => (
                      <div key={index} className="text-sm text-gray-600">
                        {new Date(view.viewed_at).toLocaleString()}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No recent views</p>
                )}
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Inquiries</h3>
                {analytics.recentInquiries.length > 0 ? (
                  <div className="space-y-3">
                    {analytics.recentInquiries.map((inq, index) => (
                      <div key={index} className="border-b border-gray-200 pb-2">
                        <div className="font-medium text-gray-900">{inq.name}</div>
                        <div className="text-sm text-gray-600">{inq.email}</div>
                        <div className="text-xs text-gray-500">{new Date(inq.created_at).toLocaleString()}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No recent inquiries</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-600">Select a property to view analytics</p>
          </div>
        )}
      </div>
    </div>
  );
}
