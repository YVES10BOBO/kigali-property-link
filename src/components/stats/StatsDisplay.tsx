"use client";

import { useState, useEffect } from "react";

interface Stats {
  propertiesListed: number;
  happyClients: number;
  yearsExperience: number;
  supportAvailable: string;
}

interface StatsDisplayProps {
  variant?: "home" | "about";
  showSupport?: boolean;
}

export default function StatsDisplay({ variant = "home", showSupport = true }: StatsDisplayProps) {
  const [stats, setStats] = useState<Stats>({
    propertiesListed: 0,
    happyClients: 0,
    yearsExperience: 1,
    supportAvailable: '24/7',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/stats");
        if (response.ok) {
          const data = await response.json();
          setStats({
            propertiesListed: data.propertiesListed || 0,
            happyClients: data.happyClients || 0,
            yearsExperience: data.yearsExperience || 1,
            supportAvailable: data.supportAvailable || '24/7',
          });
        }
      } catch (error) {
        console.error("Failed to fetch statistics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Format number with "+" suffix for display
  const formatStat = (value: number): string => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}k+`;
    }
    return `${value}+`;
  };

  if (variant === "about") {
    return (
      <div className="bg-gradient-to-br from-primary to-primary-dark p-8 rounded-2xl text-white">
        <div className="space-y-6">
          <div>
            {loading ? (
              <div className="text-5xl font-bold mb-2 animate-pulse">...</div>
            ) : (
              <div className="text-5xl font-bold mb-2">
                {formatStat(stats.propertiesListed)}
              </div>
            )}
            <div className="text-xl">Properties Listed</div>
          </div>
          <div>
            {loading ? (
              <div className="text-5xl font-bold mb-2 animate-pulse">...</div>
            ) : (
              <div className="text-5xl font-bold mb-2">
                {formatStat(stats.happyClients)}
              </div>
            )}
            <div className="text-xl">Happy Clients</div>
          </div>
          <div>
            {loading ? (
              <div className="text-5xl font-bold mb-2 animate-pulse">...</div>
            ) : (
              <div className="text-5xl font-bold mb-2">
                {stats.yearsExperience}+
              </div>
            )}
            <div className="text-xl">Years of Experience</div>
          </div>
        </div>
      </div>
    );
  }

  // Home variant (default)
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
      <div>
        {loading ? (
          <h3 className="text-4xl font-bold text-primary mb-2 animate-pulse">...</h3>
        ) : (
          <h3 className="text-4xl font-bold text-primary mb-2">
            {formatStat(stats.propertiesListed)}
          </h3>
        )}
        <p className="text-gray-600 font-medium">Properties Listed</p>
      </div>
      <div>
        {loading ? (
          <h3 className="text-4xl font-bold text-primary mb-2 animate-pulse">...</h3>
        ) : (
          <h3 className="text-4xl font-bold text-primary mb-2">
            {formatStat(stats.happyClients)}
          </h3>
        )}
        <p className="text-gray-600 font-medium">Happy Clients</p>
      </div>
      <div>
        {loading ? (
          <h3 className="text-4xl font-bold text-primary mb-2 animate-pulse">...</h3>
        ) : (
          <h3 className="text-4xl font-bold text-primary mb-2">
            {stats.yearsExperience}+
          </h3>
        )}
        <p className="text-gray-600 font-medium">Years Experience</p>
      </div>
      {showSupport && (
        <div>
          <h3 className="text-4xl font-bold text-primary mb-2">
            {stats.supportAvailable}
          </h3>
          <p className="text-gray-600 font-medium">Support Available</p>
        </div>
      )}
    </div>
  );
}
