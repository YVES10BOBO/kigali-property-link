"use client";

import { useState, useEffect } from "react";
import type { Commission } from "@/types/commission";

export default function CommissionsPage() {
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCommission, setEditingCommission] = useState<Commission | null>(null);
  const [formData, setFormData] = useState({
    inquiry_id: "",
    property_id: "",
    amount: "",
    status: "pending" as "pending" | "paid" | "cancelled",
    payment_date: "",
    notes: "",
  });
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [successMessage, setSuccessMessage] = useState<string>("");

  useEffect(() => {
    fetchCommissions();
    fetchInquiries();
    fetchProperties();
  }, [statusFilter]);

  const fetchCommissions = async () => {
    try {
      const url = statusFilter === "all" 
        ? "/api/commissions" 
        : `/api/commissions?status=${statusFilter}`;
      
      const res = await fetch(url);
      const data = await res.json();
      setCommissions(data);
    } catch (error) {
      console.error("Failed to fetch commissions:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchInquiries = async () => {
    try {
      const res = await fetch("/api/inquiries");
      const data = await res.json();
      setInquiries(data);
    } catch (error) {
      console.error("Failed to fetch inquiries:", error);
    }
  };

  const fetchProperties = async () => {
    try {
      const res = await fetch("/api/properties");
      const data = await res.json();
      setProperties(data);
    } catch (error) {
      console.error("Failed to fetch properties:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingCommission 
        ? `/api/commissions/${editingCommission.id}`
        : "/api/commissions";
      
      const method = editingCommission ? "PUT" : "POST";
      
      const payload = {
        inquiry_id: formData.inquiry_id || null,
        property_id: formData.property_id || null,
        amount: parseFloat(formData.amount),
        status: formData.status,
        payment_date: formData.payment_date || null,
        notes: formData.notes || null,
      };
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to save commission");
      }
      
      setSuccessMessage(
        editingCommission 
          ? "Commission updated successfully!" 
          : "Commission added successfully!"
      );
      setShowAddModal(false);
      setEditingCommission(null);
      resetForm();
      fetchCommissions();
      
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error: any) {
      alert(error.message || "Failed to save commission");
    }
  };

  const handleEdit = (commission: Commission) => {
    setEditingCommission(commission);
    setFormData({
      inquiry_id: commission.inquiry_id || "",
      property_id: commission.property_id || "",
      amount: commission.amount.toString(),
      status: commission.status,
      payment_date: commission.payment_date || "",
      notes: commission.notes || "",
    });
    setShowAddModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this commission?")) return;
    
    try {
      const res = await fetch(`/api/commissions/${id}`, { method: "DELETE" });
      
      if (!res.ok) {
        throw new Error("Failed to delete commission");
      }
      
      setSuccessMessage("Commission deleted successfully!");
      fetchCommissions();
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error: any) {
      alert(error.message || "Failed to delete commission");
    }
  };

  const resetForm = () => {
    setFormData({
      inquiry_id: "",
      property_id: "",
      amount: "",
      status: "pending",
      payment_date: "",
      notes: "",
    });
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingCommission(null);
    resetForm();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Calculate stats
  const totalCommissions = commissions.reduce((sum, c) => sum + c.amount, 0);
  const paidCommissions = commissions
    .filter((c) => c.status === "paid")
    .reduce((sum, c) => sum + c.amount, 0);
  const pendingCommissions = commissions
    .filter((c) => c.status === "pending")
    .reduce((sum, c) => sum + c.amount, 0);

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
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-dark mb-2">Commission Tracking</h1>
          <p className="text-gray-600">Track your earnings from property deals</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors flex items-center gap-2"
        >
          <i className="fas fa-plus"></i>
          Add Commission
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-primary">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">Total Commissions</p>
              <p className="text-3xl font-bold text-dark">{formatCurrency(totalCommissions)}</p>
            </div>
            <div className="bg-primary/10 p-4 rounded-lg">
              <i className="fas fa-dollar-sign text-2xl text-primary"></i>
            </div>
          </div>
          <p className="text-gray-500 text-sm mt-4">{commissions.length} total</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">Paid</p>
              <p className="text-3xl font-bold text-dark">{formatCurrency(paidCommissions)}</p>
            </div>
            <div className="bg-green-500/10 p-4 rounded-lg">
              <i className="fas fa-check-circle text-2xl text-green-500"></i>
            </div>
          </div>
          <p className="text-gray-500 text-sm mt-4">
            {commissions.filter((c) => c.status === "paid").length} paid
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">Pending</p>
              <p className="text-3xl font-bold text-dark">{formatCurrency(pendingCommissions)}</p>
            </div>
            <div className="bg-yellow-500/10 p-4 rounded-lg">
              <i className="fas fa-clock text-2xl text-yellow-500"></i>
            </div>
          </div>
          <p className="text-gray-500 text-sm mt-4">
            {commissions.filter((c) => c.status === "pending").length} pending
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex items-center gap-4">
          <label className="text-gray-700 font-medium">Filter by Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Commissions Table */}
      <div className="bg-white rounded-xl shadow-md p-6">
        {loading ? (
          <div className="text-center py-16">
            <i className="fas fa-spinner fa-spin text-4xl text-primary mb-4"></i>
            <p className="text-gray-600">Loading commissions...</p>
          </div>
        ) : commissions.length === 0 ? (
          <div className="text-center py-12">
            <i className="fas fa-dollar-sign text-4xl text-gray-300 mb-4"></i>
            <p className="text-gray-600 mb-4">No commissions yet</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
            >
              Add Your First Commission
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Client</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Property</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Amount</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Payment Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Created</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {commissions.map((commission) => (
                  <tr
                    key={commission.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-4 px-4">
                      {commission.inquiries ? (
                        <div>
                          <p className="font-medium text-dark">{commission.inquiries.name}</p>
                          <p className="text-sm text-gray-500">{commission.inquiries.email}</p>
                        </div>
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      {commission.properties ? (
                        <div>
                          <p className="font-medium text-dark">{commission.properties.title}</p>
                          <p className="text-sm text-gray-500">{commission.properties.location}</p>
                        </div>
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-bold text-primary text-lg">
                        {formatCurrency(commission.amount)}
                      </p>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          commission.status === "paid"
                            ? "bg-green-100 text-green-700"
                            : commission.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {commission.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-600 text-sm">
                      {formatDate(commission.payment_date)}
                    </td>
                    <td className="py-4 px-4 text-gray-600 text-sm">
                      {formatDate(commission.created_at)}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(commission)}
                          className="text-primary hover:underline text-sm font-medium"
                        >
                          <i className="fas fa-edit mr-1"></i>
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(commission.id)}
                          className="text-red-500 hover:underline text-sm font-medium"
                        >
                          <i className="fas fa-trash mr-1"></i>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-dark">
                {editingCommission ? "Edit Commission" : "Add New Commission"}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Inquiry */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Related Inquiry (Optional)
                  </label>
                  <select
                    value={formData.inquiry_id}
                    onChange={(e) => setFormData({ ...formData, inquiry_id: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select Inquiry</option>
                    {inquiries.map((inquiry) => (
                      <option key={inquiry.id} value={inquiry.id}>
                        {inquiry.name} - {inquiry.properties?.title || "General"}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Property */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Property (Optional)
                  </label>
                  <select
                    value={formData.property_id}
                    onChange={(e) => setFormData({ ...formData, property_id: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select Property</option>
                    {properties.map((property) => (
                      <option key={property.id} value={property.id}>
                        {property.title} - {property.location}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Commission Amount <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="0.00"
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
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

                {/* Payment Date */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Payment Date</label>
                  <input
                    type="date"
                    value={formData.payment_date}
                    onChange={(e) => setFormData({ ...formData, payment_date: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Notes */}
              <div className="mt-6">
                <label className="block text-gray-700 font-medium mb-2">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Additional notes about this commission..."
                />
              </div>

              {/* Form Actions */}
              <div className="mt-6 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors"
                >
                  {editingCommission ? "Update Commission" : "Add Commission"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


