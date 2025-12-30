"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

export function useFavorites() {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load favorites on mount
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          // User is logged in - fetch from database
          setIsAuthenticated(true);
          const response = await fetch("/api/favorites");
          if (response.ok) {
            const data = await response.json();
            setFavorites(new Set(data.favorites || []));
          }
        } else {
          // Guest - load from localStorage
          setIsAuthenticated(false);
          const stored = localStorage.getItem("favorites");
          if (stored) {
            try {
              const parsed = JSON.parse(stored);
              setFavorites(new Set(Array.isArray(parsed) ? parsed : []));
            } catch (e) {
              // Invalid JSON, start fresh
              setFavorites(new Set());
            }
          }
        }
      } catch (error) {
        console.error("Error loading favorites:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, []);

  // Toggle favorite
  const toggleFavorite = useCallback(
    async (propertyId: string) => {
      const isFavorited = favorites.has(propertyId);
      const newFavorites = new Set(favorites);

      if (isFavorited) {
        newFavorites.delete(propertyId);
      } else {
        newFavorites.add(propertyId);
      }

      // Optimistic update
      setFavorites(newFavorites);

      try {
        if (isAuthenticated) {
          // Save to database
          if (isFavorited) {
            await fetch(`/api/favorites?property_id=${propertyId}`, {
              method: "DELETE",
            });
          } else {
            await fetch("/api/favorites", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ property_id: propertyId }),
            });
          }
        } else {
          // Save to localStorage
          localStorage.setItem("favorites", JSON.stringify(Array.from(newFavorites)));
        }
      } catch (error) {
        // Revert on error
        setFavorites(favorites);
        console.error("Error toggling favorite:", error);
      }
    },
    [favorites, isAuthenticated]
  );

  // Check if property is favorited
  const isFavorited = useCallback(
    (propertyId: string) => {
      return favorites.has(propertyId);
    },
    [favorites]
  );

  return {
    favorites: Array.from(favorites),
    isFavorited,
    toggleFavorite,
    loading,
    isAuthenticated,
  };
}

