"use client";

import { useState, useEffect } from "react";
import { Property } from "@/types/property";

interface StatusHistoryEntry {
  id: string;
  property_id: string;
  old_status: string | null;
  new_status: string;
  changed_by: string | null;
  reason: string | null;
  notes: string | null;
  created_at: string;
}

interface PropertyStatusHistoryProps {
  propertyId: string;
}

export default function PropertyStatusHistory({ propertyId }: PropertyStatusHistoryProps) {
  const [history, setHistory] = useState<StatusHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, [propertyId]);

  const fetchHistory = async () => {
    try {
      const response = await fetch(`/api/properties/${propertyId}/history`);
      if (response.ok) {
        const data = await response.json();
        setHistory(data);
      }
    } catch (error) {
      console.error("Error fetching status history:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string | null) => {
    if (!status) return null;
    
    const badges: Record<string, { text: string; className: string }> = {
      pending_approval: { text: "Pending Approval", className: "bg-yellow-100 text-yellow-800" },
      available: { text: "Available", className: "bg-green-100 text-green-800" },
      reserved: { text: "Reserved", className: "bg-blue-100 text-blue-800" },
      sold: { text: "Sold", className: "bg-gray-100 text-gray-800" },
      rented: { text: "Rented", className: "bg-gray-100 text-gray-800" },
      unverified: { text: "Unverified", className: "bg-orange-100 text-orange-800" },
      rejected: { text: "Rejected", className: "bg-red-100 text-red-800" },
      needs_revision: { text: "Needs Revision", className: "bg-yellow-100 text-yellow-800" },
    };
    
    const badge = badges[status] || { text: status, className: "bg-gray-100 text-gray-800" };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.className}`}>
        {badge.text}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="text-gray-600 mt-2 text-sm">Loading history...</p>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <i className="fas fa-history text-4xl mb-2"></i>
        <p>No status history available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Status History</h3>
      <div className="space-y-3">
        {history.map((entry, index) => (
          <div
            key={entry.id}
            className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  {entry.old_status && (
                    <>
                      {getStatusBadge(entry.old_status)}
                      <i className="fas fa-arrow-right text-gray-400"></i>
                    </>
                  )}
                  {getStatusBadge(entry.new_status)}
                </div>
                
                {entry.reason && (
                  <p className="text-sm text-gray-600 mt-2">
                    <strong>Reason:</strong> {entry.reason}
                  </p>
                )}
                
                {entry.notes && (
                  <p className="text-sm text-gray-600 mt-1">
                    <strong>Notes:</strong> {entry.notes}
                  </p>
                )}
              </div>
              
              <div className="text-right text-sm text-gray-500">
                {new Date(entry.created_at).toLocaleDateString()}
                <br />
                {new Date(entry.created_at).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
