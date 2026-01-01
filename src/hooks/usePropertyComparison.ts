"use client";

import { useState, useEffect } from "react";

const MAX_COMPARISON = 3;

export function usePropertyComparison() {
  const [comparisonProperties, setComparisonProperties] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("propertyComparison");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setComparisonProperties(parsed.slice(0, MAX_COMPARISON));
        }
      } catch (e) {
        // Invalid data, ignore
      }
    }
  }, []);

  useEffect(() => {
    if (comparisonProperties.length > 0) {
      localStorage.setItem("propertyComparison", JSON.stringify(comparisonProperties));
    } else {
      localStorage.removeItem("propertyComparison");
    }
  }, [comparisonProperties]);

  const addToComparison = (propertyId: string) => {
    if (comparisonProperties.includes(propertyId)) {
      return false;
    }
    if (comparisonProperties.length >= MAX_COMPARISON) {
      return false;
    }
    setComparisonProperties([...comparisonProperties, propertyId]);
    return true;
  };

  const removeFromComparison = (propertyId: string) => {
    setComparisonProperties(comparisonProperties.filter((id) => id !== propertyId));
  };

  const clearComparison = () => {
    setComparisonProperties([]);
  };

  const isInComparison = (propertyId: string) => {
    return comparisonProperties.includes(propertyId);
  };

  return {
    comparisonProperties,
    addToComparison,
    removeFromComparison,
    clearComparison,
    isInComparison,
    canAddMore: comparisonProperties.length < MAX_COMPARISON,
    count: comparisonProperties.length,
  };
}
