"use client";

import { useState } from "react";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";

export interface Unit {
  id?: string;
  unit_number: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  rent_price?: number | null;
  sale_price?: number | null;
  currency?: "RWF" | "USD"; // Currency for this unit
  status: "available" | "reserved" | "sold" | "rented";
  furnished: boolean;
  description?: string;
  images?: string[];
}

interface UnitsManagerProps {
  units: Unit[];
  onChange: (units: Unit[]) => void;
  defaultCurrency?: "RWF" | "USD"; // Default currency from property
}

export default function UnitsManager({ units, onChange, defaultCurrency = "RWF" }: UnitsManagerProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const addUnit = () => {
    const newUnit: Unit = {
      unit_number: "",
      bedrooms: 0,
      bathrooms: 0,
      area: 0,
      rent_price: null,
      sale_price: null,
      currency: defaultCurrency,
      status: "available",
      furnished: false,
    };
    onChange([...units, newUnit]);
    setEditingIndex(units.length);
    setShowAddForm(true);
  };

  const updateUnit = (index: number, field: keyof Unit, value: any) => {
    const updated = [...units];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const removeUnit = (index: number) => {
    if (confirm("Are you sure you want to remove this unit?")) {
      onChange(units.filter((_, i) => i !== index));
      if (editingIndex === index) {
        setEditingIndex(null);
        setShowAddForm(false);
      }
    }
  };

  const saveUnit = (index: number) => {
    // All fields are optional now - just save the unit
    setEditingIndex(null);
    setShowAddForm(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-dark">Units</h3>
        <button
          type="button"
          onClick={addUnit}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          <FaPlus /> Add Unit
        </button>
      </div>

      {units.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500 mb-4">No units added yet</p>
          <button
            type="button"
            onClick={addUnit}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            Add First Unit
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {units.map((unit, index) => (
            <div
              key={index}
              className={`border-2 rounded-lg p-4 ${
                editingIndex === index
                  ? "border-primary bg-primary/5"
                  : "border-gray-200 bg-white"
              }`}
            >
              {editingIndex === index ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Unit Number (Optional)
                      </label>
                      <input
                        type="text"
                        value={unit.unit_number}
                        onChange={(e) => updateUnit(index, "unit_number", e.target.value)}
                        placeholder="e.g., A1, Studio 3, Unit 101"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={unit.status}
                        onChange={(e) => updateUnit(index, "status", e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        <option value="available">Available</option>
                        <option value="reserved">Reserved</option>
                        <option value="sold">Sold</option>
                        <option value="rented">Rented</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bedrooms (Optional)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={unit.bedrooms || ""}
                        onChange={(e) => updateUnit(index, "bedrooms", e.target.value ? parseInt(e.target.value) : 0)}
                        placeholder="0"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bathrooms (Optional)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={unit.bathrooms || ""}
                        onChange={(e) => updateUnit(index, "bathrooms", e.target.value ? parseInt(e.target.value) : 0)}
                        placeholder="0"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Area (m²) (Optional)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={unit.area || ""}
                        onChange={(e) => updateUnit(index, "area", e.target.value ? parseInt(e.target.value) : 0)}
                        placeholder="0"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Currency
                      </label>
                      <select
                        value={unit.currency || defaultCurrency}
                        onChange={(e) => updateUnit(index, "currency", e.target.value as "RWF" | "USD")}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        <option value="RWF">RWF (Rwandan Franc)</option>
                        <option value="USD">USD (US Dollar)</option>
                      </select>
                    </div>

                    <div>
                      <label className="flex items-center gap-2 mt-6">
                        <input
                          type="checkbox"
                          checked={unit.furnished}
                          onChange={(e) => updateUnit(index, "furnished", e.target.checked)}
                          className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                        />
                        <span className="text-sm text-gray-700">Furnished</span>
                      </label>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Pricing (Optional)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <span className="text-primary font-semibold">For Rent</span> ({(unit.currency || defaultCurrency) === "USD" ? "$" : "RWF"}/month)
                        </label>
                        <input
                          type="number"
                          min="0"
                        step="1"
                          value={unit.rent_price || ""}
                          onChange={(e) =>
                            updateUnit(
                              index,
                              "rent_price",
                              e.target.value ? parseFloat(e.target.value) : null
                            )
                          }
                          placeholder={`Enter monthly rent (optional)`}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                        <p className="text-xs text-gray-500 mt-1">Leave empty if this unit is not for rent</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <span className="text-secondary font-semibold">For Sale</span> ({(unit.currency || defaultCurrency) === "USD" ? "$" : "RWF"})
                        </label>
                        <input
                          type="number"
                          min="0"
                        step="1"
                          value={unit.sale_price || ""}
                          onChange={(e) =>
                            updateUnit(
                              index,
                              "sale_price",
                              e.target.value ? parseFloat(e.target.value) : null
                            )
                          }
                          placeholder={`Enter sale price (optional)`}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                        <p className="text-xs text-gray-500 mt-1">Leave empty if this unit is not for sale</p>
                      </div>
                    </div>
                    <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
                      <i className="fas fa-info-circle mr-1"></i>
                      You can set both rent and sale prices, or just one of them. All pricing fields are optional.
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => saveUnit(index)}
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                    >
                      Save Unit
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingIndex(null);
                        setShowAddForm(false);
                      }}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4">
                      <span className="font-semibold text-dark">{unit.unit_number || "Unnamed Unit"}</span>
                      <span className="text-sm text-gray-600">
                        {unit.bedrooms > 0 ? `${unit.bedrooms} BR` : unit.bedrooms === 0 ? "Studio" : ""} 
                        {unit.bedrooms > 0 || unit.bedrooms === 0 ? " | " : ""}
                        {unit.bathrooms > 0 ? `${unit.bathrooms} Bath` : ""}
                        {(unit.bedrooms > 0 || unit.bedrooms === 0) && unit.bathrooms > 0 ? " | " : ""}
                        {unit.area > 0 ? `${unit.area} m²` : ""}
                      </span>
                      {unit.furnished && (
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">Furnished</span>
                      )}
                    </div>
                    <div className="mt-1 flex gap-4 text-sm text-gray-600">
                      {unit.rent_price && (
                        <span>Rent: {(unit.currency || defaultCurrency) === "USD" ? "$" : "RWF"} {unit.rent_price.toLocaleString()}/month</span>
                      )}
                      {unit.sale_price && (
                        <span>Sale: {(unit.currency || defaultCurrency) === "USD" ? "$" : "RWF"} {unit.sale_price.toLocaleString()}</span>
                      )}
                      {!unit.rent_price && !unit.sale_price && (
                        <span className="text-gray-400">No prices set</span>
                      )}
                    </div>
                    <span
                      className={`inline-block mt-2 px-2 py-1 rounded text-xs font-semibold ${
                        unit.status === "available"
                          ? "bg-green-100 text-green-800"
                          : unit.status === "reserved"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {unit.status.charAt(0).toUpperCase() + unit.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingIndex(index);
                        setShowAddForm(true);
                      }}
                      className="p-2 text-primary hover:bg-primary/10 rounded transition-colors"
                      title="Edit unit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeUnit(index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors"
                      title="Remove unit"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
