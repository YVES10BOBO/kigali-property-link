"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Stats {
  totalProperties: number;
  totalInquiries: number;
  newInquiries: number;
  availableProperties: number;
  totalCommissions: number;
  paidCommissions: number;
  pendingCommissions: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    totalProperties: 0,
    totalInquiries: 0,
    newInquiries: 0,
    availableProperties: 0,
    totalCommissions: 0,
    paidCommissions: 0,
    pendingCommissions: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentInquiries, setRecentInquiries] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch statistics
        const [propertiesRes, inquiriesRes, commissionsRes] = await Promise.all([
          fetch("/api/properties"),
          fetch("/api/inquiries"),
          fetch("/api/commissions"),
        ]);

        const properties = await propertiesRes.json();
        const inquiries = await inquiriesRes.json();
        const commissions = await commissionsRes.json();

        // Calculate stats
        const newInquiries = inquiries.filter((i: any) => i.status === "new").length;
        const availableProperties = properties.filter((p: any) => p.status === "available").length;
        
        // Calculate commission stats
        const totalCommissions = commissions.reduce((sum: number, c: any) => sum + c.amount, 0);
        const paidCommissions = commissions
          .filter((c: any) => c.status === "paid")
          .reduce((sum: number, c: any) => sum + c.amount, 0);
        const pendingCommissions = commissions
          .filter((c: any) => c.status === "pending")
          .reduce((sum: number, c: any) => sum + c.amount, 0);

        setStats({
          totalProperties: properties.length,
          totalInquiries: inquiries.length,
          newInquiries,
          availableProperties,
          totalCommissions,
          paidCommissions,
          pendingCommissions,
        });

        // Get recent inquiries (last 5)
        setRecentInquiries(inquiries.slice(0, 5));
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dark mb-2">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your properties.</p>
      </div>

      {loading ? (
        <div className="text-center py-16">
          <i className="fas fa-spinner fa-spin text-4xl text-primary mb-4"></i>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {/* Total Properties */}
            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-primary">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">Total Properties</p>
                  <p className="text-3xl font-bold text-dark">{stats.totalProperties}</p>
                </div>
                <div className="bg-primary/10 p-4 rounded-lg">
                  <i className="fas fa-home text-2xl text-primary"></i>
                </div>
              </div>
              <Link
                href="/dashboard/properties"
                className="text-primary text-sm font-medium mt-4 inline-block hover:underline"
              >
                View all →
              </Link>
            </div>

            {/* Available Properties */}
            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">Available</p>
                  <p className="text-3xl font-bold text-dark">{stats.availableProperties}</p>
                </div>
                <div className="bg-green-500/10 p-4 rounded-lg">
                  <i className="fas fa-check-circle text-2xl text-green-500"></i>
                </div>
              </div>
              <p className="text-gray-500 text-sm mt-4">
                {stats.totalProperties > 0
                  ? Math.round((stats.availableProperties / stats.totalProperties) * 100)
                  : 0}
                % of total
              </p>
            </div>

            {/* Total Inquiries */}
            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-secondary">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">Total Inquiries</p>
                  <p className="text-3xl font-bold text-dark">{stats.totalInquiries}</p>
                </div>
                <div className="bg-secondary/10 p-4 rounded-lg">
                  <i className="fas fa-envelope text-2xl text-secondary"></i>
                </div>
              </div>
              <Link
                href="/dashboard/inquiries"
                className="text-secondary text-sm font-medium mt-4 inline-block hover:underline"
              >
                View all →
              </Link>
            </div>

            {/* New Inquiries */}
            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">New Inquiries</p>
                  <p className="text-3xl font-bold text-dark">{stats.newInquiries}</p>
                </div>
                <div className="bg-red-500/10 p-4 rounded-lg">
                  <i className="fas fa-bell text-2xl text-red-500"></i>
                </div>
              </div>
              {stats.newInquiries > 0 && (
                <Link
                  href="/dashboard/inquiries?status=new"
                  className="text-red-500 text-sm font-medium mt-4 inline-block hover:underline"
                >
                  Review now →
                </Link>
              )}
            </div>
          </div>

          {/* Commission Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Total Commissions */}
            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-primary">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">Total Commissions</p>
                  <p className="text-3xl font-bold text-dark">
                    ${stats.totalCommissions.toLocaleString()}
                  </p>
                </div>
                <div className="bg-primary/10 p-4 rounded-lg">
                  <span className="text-2xl text-primary font-semibold">RWF</span>
                </div>
              </div>
              <Link
                href="/dashboard/commissions"
                className="text-primary text-sm font-medium mt-4 inline-block hover:underline"
              >
                View all →
              </Link>
            </div>

            {/* Paid Commissions */}
            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">Paid</p>
                  <p className="text-3xl font-bold text-dark">
                    ${stats.paidCommissions.toLocaleString()}
                  </p>
                </div>
                <div className="bg-green-500/10 p-4 rounded-lg">
                  <i className="fas fa-check-circle text-2xl text-green-500"></i>
                </div>
              </div>
              <p className="text-gray-500 text-sm mt-4">
                {stats.totalCommissions > 0
                  ? Math.round((stats.paidCommissions / stats.totalCommissions) * 100)
                  : 0}
                % of total
              </p>
            </div>

            {/* Pending Commissions */}
            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">Pending</p>
                  <p className="text-3xl font-bold text-dark">
                    ${stats.pendingCommissions.toLocaleString()}
                  </p>
                </div>
                <div className="bg-yellow-500/10 p-4 rounded-lg">
                  <i className="fas fa-clock text-2xl text-yellow-500"></i>
                </div>
              </div>
              <p className="text-gray-500 text-sm mt-4">
                {stats.totalCommissions > 0
                  ? Math.round((stats.pendingCommissions / stats.totalCommissions) * 100)
                  : 0}
                % of total
              </p>
            </div>
          </div>

          {/* Recent Inquiries */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-dark">Recent Inquiries</h2>
              <Link
                href="/dashboard/inquiries"
                className="text-primary font-medium hover:underline"
              >
                View all →
              </Link>
            </div>

            {recentInquiries.length === 0 ? (
              <div className="text-center py-12">
                <i className="fas fa-inbox text-4xl text-gray-300 mb-4"></i>
                <p className="text-gray-600">No inquiries yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Property</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Type</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentInquiries.map((inquiry) => (
                      <tr key={inquiry.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-medium text-dark">{inquiry.name}</p>
                            <p className="text-sm text-gray-500">{inquiry.email}</p>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          {inquiry.properties ? (
                            <span className="text-gray-700">
                              {inquiry.properties.title || "N/A"}
                            </span>
                          ) : (
                            <span className="text-gray-400">General Inquiry</span>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                            {inquiry.inquiry_type || "general"}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              inquiry.status === "new"
                                ? "bg-red-100 text-red-700"
                                : inquiry.status === "contacted"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            {inquiry.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-gray-600 text-sm">
                          {formatDate(inquiry.created_at)}
                        </td>
                        <td className="py-4 px-4">
                          <Link
                            href={`/dashboard/inquiries#${inquiry.id}`}
                            className="text-primary hover:underline text-sm font-medium"
                          >
                            View →
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
