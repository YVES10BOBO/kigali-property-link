"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

interface FavoriteButtonProps {
  propertyId: string;
  className?: string;
}

export default function FavoriteButton({ propertyId, className = "" }: FavoriteButtonProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkFavoriteStatus();
    checkUser();
  }, [propertyId]);

  const checkUser = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const checkFavoriteStatus = async () => {
    try {
      const response = await fetch(`/api/properties/${propertyId}/favorite`);
      if (response.ok) {
        const data = await response.json();
        setIsFavorited(data.isFavorited);
      }
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  const handleToggleFavorite = async () => {
    if (!user) {
      // Redirect to login
      window.location.href = `/login?redirect=/properties/${propertyId}`;
      return;
    }

    setLoading(true);
    try {
      const action = isFavorited ? 'remove' : 'add';
      const response = await fetch(`/api/properties/${propertyId}/favorite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      });

      if (response.ok) {
        setIsFavorited(!isFavorited);
      } else {
        alert('Failed to update favorite');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      alert('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggleFavorite}
      disabled={loading}
      className={`${className} ${isFavorited ? 'text-red-500' : 'text-gray-400 hover:text-red-500'} transition-colors disabled:opacity-50`}
      title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
    >
      <i className={`fas fa-heart ${isFavorited ? 'fas' : 'far'}`}></i>
    </button>
  );
}
