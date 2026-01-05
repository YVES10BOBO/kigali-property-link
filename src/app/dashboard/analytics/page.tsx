"use client";

import { useState, useEffect } from "react";

interface AnalyticsData {
  inquiriesOverTime: Array<{ date: string; count: number }>;
  popularProperties: Array<{ property_id: string; title: string; count: number }>;
  statusDistribution: Array<{ status: string; count: number }>;
  inquiryTypes: Array<{ type: string; count: number }>;
}

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [dateRange, setDateRange] = useState({ from: "", to: "" });

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (dateRange.from) params.append("date_from", dateRange.from);
      if (dateRange.to) params.append("date_to", dateRange.to);

      const response = await fetch(`/api/analytics?${params.toString()}`);
      if (response.ok) {
        const analyticsData = await response.json();
        setData(analyticsData);
      }
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate summary statistics
  const totalInquiries = data?.inquiriesOverTime.reduce((sum, item) => sum + item.count, 0) || 0;
  const avgPerDay = data?.inquiriesOverTime.length 
    ? (totalInquiries / data.inquiriesOverTime.length).toFixed(1) 
    : "0";
  const maxInquiries = data?.inquiriesOverTime.length 
    ? Math.max(...data.inquiriesOverTime.map(i => i.count)) 
    : 0;
  const totalProperties = data?.popularProperties.length || 0;

  // Status color mapping
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      new: "bg-blue-500",
      contacted: "bg-yellow-500",
      viewing_scheduled: "bg-purple-500",
      closed: "bg-green-500",
      lost: "bg-red-500",
    };
    return colors[status] || "bg-primary";
  };

  // Inquiry type color mapping
  const getInquiryTypeColor = (index: number) => {
    const colors = [
      "bg-gradient-to-br from-blue-500 to-blue-600",
      "bg-gradient-to-br from-green-500 to-green-600",
      "bg-gradient-to-br from-purple-500 to-purple-600",
      "bg-gradient-to-br from-orange-500 to-orange-600",
    ];
    return colors[index % colors.length];
  };

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <p className="text-gray-600">Loading analytics...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-16">
        <i className="fas fa-chart-line text-4xl text-gray-300 mb-4"></i>
        <p className="text-gray-600">No analytics data available</p>
      </div>
    );
  }

  const hasData = data.inquiriesOverTime.length > 0 || data.popularProperties.length > 0;

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dark mb-2">Analytics & Insights</h1>
        <p className="text-gray-600">Track inquiries, popular properties, and business performance</p>
      </div>

      {/* Date Range Filter */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[150px]">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <i className="fas fa-calendar-alt mr-2 text-primary"></i>From Date
            </label>
            <input
              type="date"
              value={dateRange.from}
              onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
          </div>
          <div className="flex-1 min-w-[150px]">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <i className="fas fa-calendar-check mr-2 text-primary"></i>To Date
            </label>
            <input
              type="date"
              value={dateRange.to}
              onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
          </div>
          <button
            onClick={() => setDateRange({ from: "", to: "" })}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
          >
            <i className="fas fa-times mr-2"></i>Clear
          </button>
        </div>
      </div>

      {/* Summary Statistics Cards */}
      {hasData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <i className="fas fa-envelope text-2xl opacity-80"></i>
              <span className="text-sm opacity-90">Total</span>
            </div>
            <div className="text-3xl font-bold">{totalInquiries}</div>
            <div className="text-sm opacity-90 mt-1">Inquiries</div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <i className="fas fa-chart-line text-2xl opacity-80"></i>
              <span className="text-sm opacity-90">Average</span>
            </div>
            <div className="text-3xl font-bold">{avgPerDay}</div>
            <div className="text-sm opacity-90 mt-1">Per Day</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <i className="fas fa-arrow-up text-2xl opacity-80"></i>
              <span className="text-sm opacity-90">Peak</span>
            </div>
            <div className="text-3xl font-bold">{maxInquiries}</div>
            <div className="text-sm opacity-90 mt-1">Max in One Day</div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <i className="fas fa-building text-2xl opacity-80"></i>
              <span className="text-sm opacity-90">Properties</span>
            </div>
            <div className="text-3xl font-bold">{totalProperties}</div>
            <div className="text-sm opacity-90 mt-1">With Inquiries</div>
          </div>
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inquiries Over Time - Improved Bar Chart */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-dark">
              <i className="fas fa-chart-bar mr-2 text-primary"></i>Inquiries Over Time
            </h2>
            {data.inquiriesOverTime.length > 0 && (
              <span className="text-sm text-gray-500">
                {data.inquiriesOverTime.length} days
              </span>
            )}
          </div>
          
          {data.inquiriesOverTime.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <i className="fas fa-chart-bar text-4xl mb-3"></i>
              <p>No data for selected period</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Chart Bars */}
              <div className="h-64 flex items-end justify-between gap-1">
                {data.inquiriesOverTime.map((item, index) => {
                  const maxCount = Math.max(...data.inquiriesOverTime.map((i) => i.count), 1);
                  const height = (item.count / maxCount) * 100;
                  const isMax = item.count === maxInquiries;
                  return (
                    <div 
                      key={index} 
                      className="flex-1 flex flex-col items-center gap-2 group relative"
                      title={`${item.count} inquiries on ${new Date(item.date).toLocaleDateString()}`}
                    >
                      <div className="w-full bg-gray-100 rounded-t-lg relative h-full min-h-[40px]">
                        <div
                          className={`w-full rounded-t-lg absolute bottom-0 transition-all duration-300 group-hover:opacity-80 ${
                            isMax ? "bg-gradient-to-t from-primary to-primary-dark" : "bg-primary"
                          }`}
                          style={{ height: `${Math.max(height, 5)}%` }}
                        >
                          {isMax && (
                            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-bold text-primary">
                              {item.count}
                            </div>
                          )}
                        </div>
                      </div>
                      <span className="text-xs text-gray-600 text-center font-medium">
                        {new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
                      <span className="text-xs font-semibold text-dark opacity-0 group-hover:opacity-100 transition-opacity">
                        {item.count}
                      </span>
                    </div>
                  );
                })}
              </div>
              
              {/* Chart Legend */}
              <div className="flex items-center justify-center gap-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-primary rounded"></div>
                  <span className="text-xs text-gray-600">Inquiries</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-primary-dark rounded"></div>
                  <span className="text-xs text-gray-600">Peak Day</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Status Distribution - Improved */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-dark">
              <i className="fas fa-tasks mr-2 text-primary"></i>Status Distribution
            </h2>
            {data.statusDistribution.length > 0 && (
              <span className="text-sm text-gray-500">
                {data.statusDistribution.reduce((sum, i) => sum + i.count, 0)} total
              </span>
            )}
          </div>
          
          {data.statusDistribution.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <i className="fas fa-tasks text-4xl mb-3"></i>
              <p>No status data available</p>
            </div>
          ) : (
            <div className="space-y-5">
              {data.statusDistribution
                .sort((a, b) => b.count - a.count)
                .map((item, index) => {
                  const total = data.statusDistribution.reduce((sum, i) => sum + i.count, 0);
                  const percentage = total > 0 ? (item.count / total) * 100 : 0;
                  return (
                    <div key={index} className="group">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-semibold text-dark capitalize flex items-center gap-2">
                          <span className={`w-3 h-3 rounded-full ${getStatusColor(item.status)}`}></span>
                          {item.status.replace(/_/g, " ")}
                        </span>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold text-dark">{item.count}</span>
                          <span className="text-xs text-gray-500 w-12 text-right">
                            {percentage.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                        <div
                          className={`${getStatusColor(item.status)} h-3 rounded-full transition-all duration-500 group-hover:opacity-80`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>

        {/* Popular Properties - Improved Table */}
        <div className="bg-white rounded-xl shadow-md p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-dark">
              <i className="fas fa-star mr-2 text-primary"></i>Most Popular Properties
            </h2>
            {data.popularProperties.length > 0 && (
              <span className="text-sm text-gray-500">
                Top {Math.min(data.popularProperties.length, 10)} properties
              </span>
            )}
          </div>
          
          {data.popularProperties.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <i className="fas fa-building text-4xl mb-3"></i>
              <p>No property inquiries yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-4 px-4 font-bold text-dark">Rank</th>
                    <th className="text-left py-4 px-4 font-bold text-dark">Property</th>
                    <th className="text-center py-4 px-4 font-bold text-dark">Inquiries</th>
                    <th className="text-right py-4 px-4 font-bold text-dark">Share</th>
                  </tr>
                </thead>
                <tbody>
                  {data.popularProperties.map((item, index) => {
                    const total = data.popularProperties.reduce((sum, i) => sum + i.count, 0);
                    const percentage = total > 0 ? (item.count / total) * 100 : 0;
                    return (
                      <tr 
                        key={index} 
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                              index === 0 ? "bg-yellow-100 text-yellow-600" :
                              index === 1 ? "bg-gray-100 text-gray-600" :
                              index === 2 ? "bg-orange-100 text-orange-600" :
                              "bg-gray-50 text-gray-500"
                            }`}>
                              {index + 1}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="font-semibold text-dark">{item.title || "General Inquiry"}</span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full font-bold">
                            <i className="fas fa-envelope text-xs"></i>
                            {item.count}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-end gap-3">
                            <div className="w-32 bg-gray-100 rounded-full h-2.5 overflow-hidden">
                              <div
                                className="bg-gradient-to-r from-primary to-primary-dark h-2.5 rounded-full transition-all duration-500"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-semibold text-gray-700 w-14 text-right">
                              {percentage.toFixed(1)}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Inquiry Types - Improved Cards */}
        <div className="bg-white rounded-xl shadow-md p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-dark">
              <i className="fas fa-list mr-2 text-primary"></i>Inquiry Types
            </h2>
            {data.inquiryTypes.length > 0 && (
              <span className="text-sm text-gray-500">
                {data.inquiryTypes.length} types
              </span>
            )}
          </div>
          
          {data.inquiryTypes.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <i className="fas fa-list text-4xl mb-3"></i>
              <p>No inquiry type data available</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {data.inquiryTypes.map((item, index) => (
                <div 
                  key={index} 
                  className={`${getInquiryTypeColor(index)} rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all transform hover:scale-105`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <i className="fas fa-tag text-2xl opacity-80"></i>
                    <span className="text-xs opacity-90 uppercase tracking-wide font-semibold">
                      {item.type}
                    </span>
                  </div>
                  <div className="text-4xl font-bold mb-1">{item.count}</div>
                  <div className="text-sm opacity-90">Inquiries</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
