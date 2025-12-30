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

  if (loading) {
    return (
      <div className="text-center py-16">
        <i className="fas fa-spinner fa-spin text-4xl text-primary mb-4"></i>
        <p className="text-gray-600">Loading analytics...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-600">No analytics data available</p>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dark mb-2">Analytics & Insights</h1>
        <p className="text-gray-600">Track inquiries, popular properties, and business performance</p>
      </div>

      {/* Date Range Filter */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-6">
        <div className="flex gap-4 items-end">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">From Date</label>
            <input
              type="date"
              value={dateRange.from}
              onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
              className="px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-primary outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">To Date</label>
            <input
              type="date"
              value={dateRange.to}
              onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
              className="px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-primary outline-none"
            />
          </div>
          <button
            onClick={() => setDateRange({ from: "", to: "" })}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inquiries Over Time */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-dark mb-4">Inquiries Over Time</h2>
          <div className="h-64 flex items-end justify-between gap-2">
            {data.inquiriesOverTime.map((item, index) => {
              const maxCount = Math.max(...data.inquiriesOverTime.map((i) => i.count), 1);
              const height = (item.count / maxCount) * 100;
              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-gray-100 rounded-t-lg relative" style={{ height: "200px" }}>
                    <div
                      className="w-full bg-primary rounded-t-lg absolute bottom-0 transition-all"
                      style={{ height: `${height}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-600 text-center">
                    {new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                  <span className="text-sm font-semibold text-dark">{item.count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-dark mb-4">Status Distribution</h2>
          <div className="space-y-4">
            {data.statusDistribution.map((item, index) => {
              const total = data.statusDistribution.reduce((sum, i) => sum + i.count, 0);
              const percentage = total > 0 ? (item.count / total) * 100 : 0;
              return (
                <div key={index}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-dark capitalize">
                      {item.status.replace("_", " ")}
                    </span>
                    <span className="text-sm text-gray-600">
                      {item.count} ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Popular Properties */}
        <div className="bg-white rounded-xl shadow-md p-6 lg:col-span-2">
          <h2 className="text-xl font-bold text-dark mb-4">Most Popular Properties</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-dark">Property</th>
                  <th className="text-right py-3 px-4 font-semibold text-dark">Inquiries</th>
                  <th className="text-right py-3 px-4 font-semibold text-dark">Percentage</th>
                </tr>
              </thead>
              <tbody>
                {data.popularProperties.map((item, index) => {
                  const total = data.popularProperties.reduce((sum, i) => sum + i.count, 0);
                  const percentage = total > 0 ? (item.count / total) * 100 : 0;
                  return (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <span className="font-medium text-dark">{item.title || "General Inquiry"}</span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="font-semibold text-primary">{item.count}</span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-24 bg-gray-100 rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600 w-12 text-right">
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
        </div>

        {/* Inquiry Types */}
        <div className="bg-white rounded-xl shadow-md p-6 lg:col-span-2">
          <h2 className="text-xl font-bold text-dark mb-4">Inquiry Types</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {data.inquiryTypes.map((item, index) => (
              <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-3xl font-bold text-primary mb-2">{item.count}</div>
                <div className="text-sm text-gray-600 capitalize">{item.type}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
