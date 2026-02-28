"use client";

import { useState, useEffect } from "react";

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string | null;
  inquiry_type: string;
  status: string;
  preferred_date: string | null;
  created_at: string;
  property_id?: string | null;
  properties: {
    id: string;
    title: string;
    location: string;
  } | null;
}

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [allInquiries, setAllInquiries] = useState<Inquiry[]>([]); // Store all for counts
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [showCommissionModal, setShowCommissionModal] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [commissionFormData, setCommissionFormData] = useState({
    amount: "",
    status: "pending" as "pending" | "paid" | "cancelled",
    payment_date: "",
    notes: "",
  });
  const [calendarFormData, setCalendarFormData] = useState({
    title: "",
    description: "",
    start_time: "",
    end_time: "",
    location: "",
  });
  const [successMessage, setSuccessMessage] = useState<string>("");
  
  // Advanced filters
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    propertyId: "",
    inquiryType: "",
    dateFrom: "",
    dateTo: "",
  });
  const [properties, setProperties] = useState<Array<{ id: string; title: string }>>([]);
  
  // Bulk actions
  const [selectedInquiries, setSelectedInquiries] = useState<Set<string>>(new Set());
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [bulkStatus, setBulkStatus] = useState<string>("");

  useEffect(() => {
    fetchInquiries();
    fetchProperties();
  }, []);

  useEffect(() => {
    // Debounce search
    const timer = setTimeout(() => {
      fetchInquiries();
    }, 300);
    return () => clearTimeout(timer);
  }, [filters]);

  const fetchProperties = async () => {
    try {
      const response = await fetch("/api/properties?limit=1000");
      if (response.ok) {
        const data = await response.json();
        setProperties(data.map((p: any) => ({ id: p.id, title: p.title })));
      }
    } catch (error) {
      console.error("Failed to fetch properties:", error);
    }
  };

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (filters.search) params.append('search', filters.search);
      if (filters.status && filters.status !== 'all') params.append('status', filters.status);
      if (filters.propertyId) params.append('property_id', filters.propertyId);
      if (filters.inquiryType) params.append('inquiry_type', filters.inquiryType);
      if (filters.dateFrom) params.append('date_from', filters.dateFrom);
      if (filters.dateTo) params.append('date_to', filters.dateTo);
      
      const queryString = params.toString();
      const url = `/api/inquiries${queryString ? `?${queryString}` : ''}`;
      
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setInquiries(data);
        // Store all for counts if no filters applied
        if (!filters.search && filters.status === 'all' && !filters.propertyId && !filters.inquiryType && !filters.dateFrom && !filters.dateTo) {
          setAllInquiries(data);
        }
      }
    } catch (error) {
      console.error("Failed to fetch inquiries:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/inquiries/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        const updatedInquiry = await response.json();
        // Update local state
        setInquiries(
          inquiries.map((inq) => (inq.id === id ? { ...inq, status: newStatus } : inq))
        );
      } else {
        const error = await response.json();
        alert(`Failed to update status: ${error.error}`);
      }
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Failed to update status. Please try again.");
    }
  };

  const handleCreateCommission = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    setCommissionFormData({
      amount: "",
      status: "pending",
      payment_date: "",
      notes: `Commission for inquiry from ${inquiry.name}`,
    });
    setShowCommissionModal(true);
  };

  const handleScheduleViewing = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    const defaultStart = new Date();
    defaultStart.setHours(10, 0, 0, 0);
    const defaultEnd = new Date(defaultStart);
    defaultEnd.setHours(11, 0, 0, 0);
    
    setCalendarFormData({
      title: `Property Viewing - ${inquiry.properties?.title || 'Property'}`,
      description: `Viewing appointment for ${inquiry.name}`,
      start_time: defaultStart.toISOString().slice(0, 16),
      end_time: defaultEnd.toISOString().slice(0, 16),
      location: inquiry.properties?.location || "",
    });
    setShowCalendarModal(true);
  };

  const handleSubmitCalendar = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedInquiry) return;
    
    try {
      const response = await fetch("/api/calendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inquiry_id: selectedInquiry.id,
          property_id: selectedInquiry.property_id,
          title: calendarFormData.title,
          description: calendarFormData.description,
          start_time: new Date(calendarFormData.start_time).toISOString(),
          end_time: new Date(calendarFormData.end_time).toISOString(),
          location: calendarFormData.location,
          attendee_name: selectedInquiry.name,
          attendee_email: selectedInquiry.email,
          attendee_phone: selectedInquiry.phone,
          status: "scheduled",
        }),
      });

      if (response.ok) {
        // Update inquiry status to viewing_scheduled
        await fetch(`/api/inquiries/${selectedInquiry.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "viewing_scheduled" }),
        });
        
        setSuccessMessage("Viewing appointment scheduled successfully!");
        setShowCalendarModal(false);
        setSelectedInquiry(null);
        fetchInquiries();
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        const error = await response.json();
        alert(error.error || "Failed to schedule viewing");
      }
    } catch (error) {
      alert("Failed to schedule viewing. Please try again.");
    }
  };

  const handleSubmitCommission = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedInquiry) return;
    
    try {
      const response = await fetch("/api/commissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inquiry_id: selectedInquiry.id,
          property_id: selectedInquiry.property_id || null,
          amount: parseFloat(commissionFormData.amount),
          status: commissionFormData.status,
          payment_date: commissionFormData.payment_date || null,
          notes: commissionFormData.notes || null,
        }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create commission");
      }
      
      setSuccessMessage("Commission created successfully!");
      setShowCommissionModal(false);
      setSelectedInquiry(null);
      setCommissionFormData({
        amount: "",
        status: "pending",
        payment_date: "",
        notes: "",
      });
      
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error: any) {
      alert(error.message || "Failed to create commission");
    }
  };

  // Since we're filtering on the server, inquiries are already filtered
  const filteredInquiries = inquiries;
  
  const clearFilters = () => {
    setFilters({
      search: "",
      status: "all",
      propertyId: "",
      inquiryType: "",
      dateFrom: "",
      dateTo: "",
    });
    setFilter("all");
  };
  
  const hasActiveFilters = filters.search || filters.status !== 'all' || filters.propertyId || filters.inquiryType || filters.dateFrom || filters.dateTo;

  // Bulk actions
  const toggleSelectInquiry = (id: string) => {
    const newSelected = new Set(selectedInquiries);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedInquiries(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedInquiries.size === filteredInquiries.length) {
      setSelectedInquiries(new Set());
    } else {
      setSelectedInquiries(new Set(filteredInquiries.map((inq) => inq.id)));
    }
  };

  const handleBulkStatusUpdate = async () => {
    if (!bulkStatus || selectedInquiries.size === 0) return;

    try {
      const updates = Array.from(selectedInquiries).map((id) =>
        fetch(`/api/inquiries/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: bulkStatus }),
        })
      );

      await Promise.all(updates);
      setSuccessMessage(`Updated ${selectedInquiries.size} inquiry status to ${bulkStatus}`);
      setSelectedInquiries(new Set());
      setBulkStatus("");
      fetchInquiries();
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      alert("Failed to update inquiries. Please try again.");
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedInquiries.size} inquiry(ies)? This action cannot be undone.`)) {
      return;
    }

    try {
      const deletes = Array.from(selectedInquiries).map((id) =>
        fetch(`/api/inquiries/${id}`, {
          method: "DELETE",
        })
      );

      await Promise.all(deletes);
      setSuccessMessage(`Deleted ${selectedInquiries.size} inquiry(ies)`);
      setSelectedInquiries(new Set());
      fetchInquiries();
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      alert("Failed to delete inquiries. Please try again.");
    }
  };

  const handleExport = async () => {
    try {
      // Build query params from current filters
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.status && filters.status !== 'all') params.append('status', filters.status);
      if (filters.propertyId) params.append('property_id', filters.propertyId);
      if (filters.inquiryType) params.append('inquiry_type', filters.inquiryType);
      if (filters.dateFrom) params.append('date_from', filters.dateFrom);
      if (filters.dateTo) params.append('date_to', filters.dateTo);
      
      const response = await fetch(`/api/inquiries/export?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Export failed');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `inquiries-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      setSuccessMessage('Inquiries exported successfully!');
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      alert('Failed to export inquiries. Please try again.');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const statusColors: Record<string, string> = {
    new: "bg-red-100 text-red-700 border-red-200",
    contacted: "bg-yellow-100 text-yellow-700 border-yellow-200",
    viewing_scheduled: "bg-blue-100 text-blue-700 border-blue-200",
    closed: "bg-green-100 text-green-700 border-green-200",
    lost: "bg-gray-100 text-gray-700 border-gray-200",
  };

  return (
    <div>
      {/* Success Message */}
      {successMessage && (
        <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
          <i className="fas fa-check-circle mr-2"></i>
          {successMessage}
        </div>
      )}

      {/* Page Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-dark mb-2">Inquiries & Leads</h1>
          <p className="text-gray-600">Manage all customer inquiries and track their status</p>
        </div>
        <button
          onClick={handleExport}
          className="px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center gap-2"
        >
          <i className="fas fa-download"></i>
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-6 space-y-4">
        {/* Search and Quick Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <input
                type="text"
                placeholder="Search by name, email, phone, or message..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary outline-none"
              />
            </div>
          </div>
          
          {/* Quick Status Filters */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => {
                setFilters({ ...filters, status: "all" });
                setFilter("all");
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filters.status === "all"
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All ({allInquiries.length || inquiries.length})
            </button>
            <button
              onClick={() => {
                setFilters({ ...filters, status: "new" });
                setFilter("new");
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filters.status === "new"
                  ? "bg-red-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              New ({allInquiries.filter((i) => i.status === "new").length || inquiries.filter((i) => i.status === "new").length})
            </button>
            <button
              onClick={() => {
                setFilters({ ...filters, status: "contacted" });
                setFilter("contacted");
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filters.status === "contacted"
                  ? "bg-yellow-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Contacted ({allInquiries.filter((i) => i.status === "contacted").length || inquiries.filter((i) => i.status === "contacted").length})
            </button>
            <button
              onClick={() => {
                setFilters({ ...filters, status: "viewing_scheduled" });
                setFilter("viewing_scheduled");
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filters.status === "viewing_scheduled"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Scheduled ({allInquiries.filter((i) => i.status === "viewing_scheduled").length || inquiries.filter((i) => i.status === "viewing_scheduled").length})
            </button>
            <button
              onClick={() => {
                setFilters({ ...filters, status: "closed" });
                setFilter("closed");
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filters.status === "closed"
                  ? "bg-green-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Closed ({allInquiries.filter((i) => i.status === "closed").length || inquiries.filter((i) => i.status === "closed").length})
            </button>
          </div>
        </div>

        {/* Advanced Filters Toggle */}
        <div className="flex items-center justify-between border-t pt-4">
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="text-primary hover:text-primary-dark font-medium flex items-center gap-2"
          >
            <i className={`fas fa-chevron-${showAdvancedFilters ? 'up' : 'down'}`}></i>
            Advanced Filters
            {hasActiveFilters && (
              <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">
                Active
              </span>
            )}
          </button>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-gray-600 hover:text-gray-800 text-sm flex items-center gap-2"
            >
              <i className="fas fa-times"></i>
              Clear All
            </button>
          )}
        </div>

        {/* Advanced Filters Panel */}
        {showAdvancedFilters && (
          <div className="border-t pt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Property Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Property</label>
              <select
                value={filters.propertyId}
                onChange={(e) => setFilters({ ...filters, propertyId: e.target.value })}
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-primary outline-none"
              >
                <option value="">All Properties</option>
                {properties.map((prop) => (
                  <option key={prop.id} value={prop.id}>
                    {prop.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Inquiry Type Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Inquiry Type</label>
              <select
                value={filters.inquiryType}
                onChange={(e) => setFilters({ ...filters, inquiryType: e.target.value })}
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-primary outline-none"
              >
                <option value="">All Types</option>
                <option value="general">General</option>
                <option value="viewing">Viewing</option>
                <option value="purchase">Purchase</option>
                <option value="rental">Rental</option>
              </select>
            </div>

            {/* Date From */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Date From</label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-primary outline-none"
              />
            </div>

            {/* Date To */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Date To</label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-primary outline-none"
              />
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <div className="text-center py-16">
          <i className="fas fa-spinner fa-spin text-4xl text-primary mb-4"></i>
          <p className="text-gray-600">Loading inquiries...</p>
        </div>
      ) : filteredInquiries.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <i className="fas fa-inbox text-6xl text-gray-300 mb-4"></i>
          <h3 className="text-2xl font-bold text-dark mb-2">No Inquiries Found</h3>
          <p className="text-gray-600">
            {filter === "all"
              ? "No inquiries have been submitted yet."
              : `No inquiries with status "${filter}" found.`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Bulk Actions Toolbar */}
          {selectedInquiries.size > 0 && (
            <div className="bg-primary/10 border-2 border-primary rounded-xl p-4 flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <span className="font-semibold text-dark">
                  {selectedInquiries.size} inquiry(ies) selected
                </span>
                <button
                  onClick={() => setSelectedInquiries(new Set())}
                  className="text-gray-600 hover:text-gray-800 text-sm"
                >
                  Clear selection
                </button>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <select
                  value={bulkStatus}
                  onChange={(e) => setBulkStatus(e.target.value)}
                  className="px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-primary outline-none"
                >
                  <option value="">Change status to...</option>
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="viewing_scheduled">Viewing Scheduled</option>
                  <option value="closed">Closed</option>
                  <option value="lost">Lost</option>
                </select>
                <button
                  onClick={handleBulkStatusUpdate}
                  disabled={!bulkStatus}
                  className="px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <i className="fas fa-sync mr-2"></i>
                  Update Status
                </button>
                <button
                  onClick={handleBulkDelete}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors"
                >
                  <i className="fas fa-trash mr-2"></i>
                  Delete
                </button>
              </div>
            </div>
          )}

          {/* Select All Checkbox */}
          <div className="bg-white rounded-xl shadow-md p-4 flex items-center gap-3">
            <input
              type="checkbox"
              checked={selectedInquiries.size === filteredInquiries.length && filteredInquiries.length > 0}
              onChange={toggleSelectAll}
              className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
            />
            <label className="font-semibold text-dark">
              Select all ({filteredInquiries.length} inquiries)
            </label>
          </div>

          {filteredInquiries.map((inquiry) => (
            <div
              key={inquiry.id}
              className={`bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow ${
                selectedInquiries.has(inquiry.id) ? "ring-2 ring-primary" : ""
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Checkbox */}
                <input
                  type="checkbox"
                  checked={selectedInquiries.has(inquiry.id)}
                  onChange={() => toggleSelectInquiry(inquiry.id)}
                  className="mt-1 w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
                />
                
                <div className="flex-1 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  {/* Left Side - Inquiry Info */}
                  <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-dark mb-1">{inquiry.name}</h3>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <i className="fas fa-envelope"></i>
                          {inquiry.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <i className="fas fa-phone"></i>
                          {inquiry.phone}
                        </span>
                        <span className="flex items-center gap-1">
                          <i className="far fa-calendar"></i>
                          {formatDate(inquiry.created_at)}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${
                        statusColors[inquiry.status] || statusColors.new
                      }`}
                    >
                      {inquiry.status.replace("_", " ")}
                    </span>
                  </div>

                  {inquiry.properties && (
                    <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Property Interest:</p>
                      <p className="font-semibold text-dark">{inquiry.properties.title}</p>
                      <p className="text-sm text-gray-600">{inquiry.properties.location}</p>
                    </div>
                  )}

                  {inquiry.message && (
                    <div className="mb-3">
                      <p className="text-sm text-gray-600 mb-1">Message:</p>
                      <p className="text-gray-700">{inquiry.message}</p>
                    </div>
                  )}

                  {inquiry.preferred_date && (
                    <div className="mb-3">
                      <p className="text-sm text-gray-600 mb-1">Preferred Viewing Date:</p>
                      <p className="text-gray-700 font-medium">
                        {new Date(inquiry.preferred_date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  )}

                  <div className="mt-3">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                      {inquiry.inquiry_type}
                    </span>
                  </div>
                </div>

                {/* Right Side - Actions */}
                <div className="flex flex-col gap-2 md:w-48">
                  <label className="text-sm font-medium text-gray-700 mb-1">Update Status:</label>
                  <select
                    value={inquiry.status}
                    onChange={(e) => updateStatus(inquiry.id, e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="viewing_scheduled">Viewing Scheduled</option>
                    <option value="closed">Closed</option>
                    <option value="lost">Lost</option>
                  </select>

                  <div className="flex gap-2 mt-2">
                    <a
                      href={`mailto:${inquiry.email}`}
                      className="flex-1 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors text-center"
                    >
                      <i className="fas fa-envelope mr-1"></i>
                      Email
                    </a>
                    <a
                      href={`tel:${inquiry.phone}`}
                      className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors text-center"
                    >
                      <i className="fas fa-phone mr-1"></i>
                      Call
                    </a>
                  </div>
                  <a
                    href={`https://wa.me/${inquiry.phone.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#25d366] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#20ba5a] transition-colors text-center"
                  >
                    <i className="fab fa-whatsapp mr-1"></i>
                    WhatsApp
                  </a>
                  
                  <div className="flex flex-col gap-2 mt-2">
                    {/* Calendar/Viewing scheduling disabled for MVP - can re-enable later */}
                    {/* {inquiry.status !== "closed" && inquiry.status !== "lost" && (
                      <button
                        onClick={() => handleScheduleViewing(inquiry)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors text-center"
                      >
                        <i className="fas fa-calendar mr-1"></i>
                        Schedule Viewing
                      </button>
                    )} */}
                    {inquiry.status === "closed" && (
                      <button
                        onClick={() => handleCreateCommission(inquiry)}
                        className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors text-center"
                      >
                        <span className="mr-1 font-semibold">RWF</span>
                        Create Commission
                      </button>
                    )}
                  </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Commission Modal */}
      {showCommissionModal && selectedInquiry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-dark">Create Commission</h2>
              <p className="text-gray-600 text-sm mt-1">
                For inquiry from {selectedInquiry.name}
              </p>
            </div>
            <form onSubmit={handleSubmitCommission} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Commission Amount <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={commissionFormData.amount}
                    onChange={(e) =>
                      setCommissionFormData({ ...commissionFormData, amount: e.target.value })
                    }
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={commissionFormData.status}
                    onChange={(e) =>
                      setCommissionFormData({
                        ...commissionFormData,
                        status: e.target.value as "pending" | "paid" | "cancelled",
                      })
                    }
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Payment Date</label>
                  <input
                    type="date"
                    value={commissionFormData.payment_date}
                    onChange={(e) =>
                      setCommissionFormData({ ...commissionFormData, payment_date: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Notes</label>
                  <textarea
                    value={commissionFormData.notes}
                    onChange={(e) =>
                      setCommissionFormData({ ...commissionFormData, notes: e.target.value })
                    }
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Additional notes..."
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCommissionModal(false);
                    setSelectedInquiry(null);
                  }}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors"
                >
                  Create Commission
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Schedule Viewing Modal - Disabled for MVP */}
      {/* {showCalendarModal && selectedInquiry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-dark">Schedule Viewing</h2>
              <p className="text-gray-600 text-sm mt-1">
                For inquiry from {selectedInquiry.name}
              </p>
            </div>
            <form onSubmit={handleSubmitCalendar} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={calendarFormData.title}
                    onChange={(e) => setCalendarFormData({ ...calendarFormData, title: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Description
                  </label>
                  <textarea
                    value={calendarFormData.description}
                    onChange={(e) => setCalendarFormData({ ...calendarFormData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Start Time <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={calendarFormData.start_time}
                      onChange={(e) => setCalendarFormData({ ...calendarFormData, start_time: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      End Time <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={calendarFormData.end_time}
                      onChange={(e) => setCalendarFormData({ ...calendarFormData, end_time: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={calendarFormData.location}
                    onChange={(e) => setCalendarFormData({ ...calendarFormData, location: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary outline-none"
                    placeholder={selectedInquiry.properties?.location || "Property address"}
                  />
                </div>
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowCalendarModal(false);
                    setSelectedInquiry(null);
                  }}
                  className="flex-1 px-6 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors"
                >
                  Schedule Viewing
                </button>
              </div>
            </form>
          </div>
        </div>
      )} */}
    </div>
  );
}
