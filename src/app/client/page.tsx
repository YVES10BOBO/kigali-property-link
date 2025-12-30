"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { PropertyCardFromDB } from "@/components/property/PropertyCard";
import { Property } from "@/types/property";

interface ClientInquiry {
  id: string;
  property_id: string | null;
  name: string;
  email: string;
  phone: string;
  message: string | null;
  status: string;
  inquiry_type: string;
  preferred_date: string | null;
  created_at: string;
  properties?: {
    title: string;
    location: string;
  } | null;
}

type TabType = "inquiries" | "favorites" | "profile";

export default function ClientDashboardPage() {
  const [activeTab, setActiveTab] = useState<TabType>("inquiries");
  const [inquiries, setInquiries] = useState<ClientInquiry[]>([]);
  const [favoriteProperties, setFavoriteProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user?.email) {
          setError("You must be logged in to view your account.");
          setLoading(false);
          return;
        }

        // Load inquiries
        const inquiriesRes = await fetch(`/api/inquiries?email=${encodeURIComponent(user.email)}`);
        if (inquiriesRes.ok) {
          const inquiriesData = await inquiriesRes.json();
          setInquiries(inquiriesData);
        }

        // Load favorites
        const favoritesRes = await fetch("/api/favorites");
        if (favoritesRes.ok) {
          const favoritesData = await favoritesRes.json();
          const propertyIds = favoritesData.favorites || [];

          if (propertyIds.length > 0) {
            // Fetch each property
            const propertyPromises = propertyIds.map(async (id: string) => {
              const propRes = await fetch(`/api/properties/${id}`);
              if (propRes.ok) {
                return await propRes.json();
              }
              return null;
            });

            const properties = await Promise.all(propertyPromises);
            setFavoriteProperties(properties.filter((p) => p !== null));
          }
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to load data";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-4">
          <button
            onClick={() => setActiveTab("inquiries")}
            className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
              activeTab === "inquiries"
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <i className="fas fa-envelope mr-2" />
            My Inquiries
          </button>
          <button
            onClick={() => setActiveTab("favorites")}
            className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
              activeTab === "favorites"
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <i className="fas fa-heart mr-2" />
            My Favorites
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
              activeTab === "profile"
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <i className="fas fa-user mr-2" />
            My Profile
          </button>
        </nav>
      </div>

      {/* Content */}
      {loading && (
        <div className="flex items-center gap-2 text-gray-500">
          <i className="fas fa-spinner fa-spin" />
          <span>Loading...</span>
        </div>
      )}

      {error && !loading && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <i className="fas fa-exclamation-circle"></i>
          <span>{error}</span>
        </div>
      )}

      {/* Inquiries Tab */}
      {!loading && !error && activeTab === "inquiries" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-dark mb-2">My Inquiries</h2>
            <p className="text-gray-600 text-sm">
              Track all the inquiries and booking requests you have sent through Kigali PropertiesLink.
            </p>
          </div>

          {inquiries.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-envelope-open text-blue-500 text-4xl"></i>
                </div>
                <h3 className="text-xl font-bold text-dark mb-2">No Inquiries Yet</h3>
                <p className="text-gray-600 mb-6">
                  When you submit an inquiry about a property or contact us, it will appear here so you can track its status.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link
                    href="/properties"
                    className="inline-flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
                  >
                    <i className="fas fa-search"></i>
                    Browse Properties
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center gap-2 bg-secondary text-white px-6 py-3 rounded-lg font-semibold hover:bg-secondary-dark transition-colors"
                  >
                    <i className="fas fa-envelope"></i>
                    Contact Us
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
          {inquiries.map((inq) => (
            <div
              key={inq.id}
              className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3 hover:shadow-md transition-shadow"
            >
                  <div className="space-y-1">
                    <div className="font-semibold text-dark flex items-center gap-2">
                      <i className="fas fa-home text-primary" />
                      <span>
                        {inq.properties?.title || "Property inquiry"}
                        {inq.properties?.location && (
                          <span className="text-gray-500 text-sm"> · {inq.properties.location}</span>
                        )}
                      </span>
                    </div>
                    <div className="text-gray-600 text-sm">
                      <span className="capitalize">{inq.inquiry_type}</span>
                      <span className="mx-2">·</span>
                      <span>
                        Sent on {new Date(inq.created_at).toLocaleDateString()} at{" "}
                        {new Date(inq.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    {inq.message && (
                      <p className="text-gray-700 text-sm mt-1 line-clamp-2">{inq.message}</p>
                    )}
                  </div>

                  <div className="flex flex-col items-start md:items-end gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                        inq.status === "new"
                          ? "bg-blue-50 text-blue-700"
                          : inq.status === "contacted"
                          ? "bg-yellow-50 text-yellow-700"
                          : inq.status === "viewing_scheduled"
                          ? "bg-purple-50 text-purple-700"
                          : inq.status === "closed"
                          ? "bg-green-50 text-green-700"
                          : inq.status === "lost"
                          ? "bg-red-50 text-red-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {inq.status.replace("_", " ")}
                    </span>
                    {inq.preferred_date && (
                      <span className="text-xs text-gray-500">
                        Preferred date: {new Date(inq.preferred_date).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Favorites Tab */}
      {!loading && !error && activeTab === "favorites" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-dark mb-2">My Favorites</h2>
            <p className="text-gray-600 text-sm">
              Properties you've saved for later. Click the heart icon on any property to add it here.
            </p>
          </div>

          {favoriteProperties.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-heart text-red-500 text-4xl"></i>
                </div>
                <h3 className="text-xl font-bold text-dark mb-2">No Favorites Yet</h3>
                <p className="text-gray-600 mb-2">
                  Start building your wishlist! Click the heart icon on any property to save it here.
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  Your favorites are saved and will be available when you return.
                </p>
                <Link
                  href="/properties"
                  className="inline-flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
                >
                  <i className="fas fa-search"></i>
                  Browse Properties
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteProperties.map((property) => (
                <PropertyCardFromDB key={property.id} property={property} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Profile Tab */}
      {!loading && !error && activeTab === "profile" && (
        <ClientProfileTab />
      )}
    </div>
  );
}

// Client Profile Tab Component
function ClientProfileTab() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    avatar_url: "",
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const supabase = createClient();
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser();

        if (!authUser) {
          setError("You must be logged in to view your profile.");
          setLoading(false);
          return;
        }

        // Fetch profile from API
        const res = await fetch("/api/users/profile");
        if (res.ok) {
          const data = await res.json();
          const profile = data.user || {};
          setUser(authUser);
          setProfileData({
            name: profile.name || authUser.email?.split("@")[0] || "",
            email: authUser.email || "",
            phone: profile.phone || "",
            avatar_url: profile.avatar_url || authUser.user_metadata?.avatar_url || "",
          });
        } else {
          // Fallback to auth user data
          setUser(authUser);
          setProfileData({
            name: authUser.user_metadata?.name || authUser.email?.split("@")[0] || "",
            email: authUser.email || "",
            phone: "",
            avatar_url: authUser.user_metadata?.avatar_url || "",
          });
        }
      } catch (err) {
        setError("Failed to load profile");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSaving(true);

    try {
      // Update profile via API
      const res = await fetch("/api/users/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profileData.name,
          phone: profileData.phone,
          avatar_url: profileData.avatar_url || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update profile");
      }

      // Update auth user metadata
      const supabase = createClient();
      await supabase.auth.updateUser({
        data: {
          name: profileData.name,
          avatar_url: profileData.avatar_url || null,
        },
      });

      setSuccess("Profile updated successfully!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = (url: string) => {
    // Update state immediately to show the new avatar
    setProfileData((prev) => ({ ...prev, avatar_url: url }));
    
    // Also auto-save the avatar URL to the profile (optional - you can remove this if you want manual save)
    // This ensures the avatar is saved immediately after upload
    if (url) {
      // Save immediately in the background
      fetch("/api/users/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profileData.name,
          phone: profileData.phone,
          avatar_url: url,
        }),
      }).then(async (res) => {
        if (res.ok) {
          // Also update auth metadata
          const supabase = createClient();
          await supabase.auth.updateUser({
            data: {
              avatar_url: url,
            },
          });
          console.log("Avatar saved successfully");
        }
      }).catch((err) => {
        console.error("Failed to auto-save avatar:", err);
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-gray-500">
        <i className="fas fa-spinner fa-spin" />
        <span>Loading profile...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-dark mb-2">My Profile</h2>
        <p className="text-gray-600 text-sm">
          Update your personal information and profile picture.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <i className="fas fa-exclamation-circle mr-2" />
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          <i className="fas fa-check-circle mr-2" />
          {success}
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar */}
          <div>
            <label className="block font-semibold mb-2 text-dark">Profile Picture</label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200 flex items-center justify-center flex-shrink-0">
                {profileData.avatar_url ? (
                  <img
                    key={profileData.avatar_url} // Force re-render when URL changes
                    src={profileData.avatar_url}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback if image fails to load
                      console.error("Failed to load avatar image:", profileData.avatar_url);
                      e.currentTarget.style.display = 'none';
                    }}
                    onLoad={() => {
                      // Image loaded successfully
                      console.log("Avatar image loaded:", profileData.avatar_url);
                    }}
                  />
                ) : (
                  <i className="fas fa-user text-gray-400 text-3xl"></i>
                )}
              </div>
              <div className="flex-1">
                <AvatarUpload
                  currentUrl={profileData.avatar_url}
                  onUrlChange={handleAvatarChange}
                />
              </div>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block font-semibold mb-2 text-dark">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={profileData.name}
              onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary outline-none"
              placeholder="Your full name"
            />
          </div>

          {/* Email (read-only) */}
          <div>
            <label className="block font-semibold mb-2 text-dark">Email Address</label>
            <input
              type="email"
              value={profileData.email}
              disabled
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
            />
            <p className="text-sm text-gray-500 mt-1">
              Email cannot be changed. Contact support if you need to update it.
            </p>
          </div>

          {/* Phone */}
          <div>
            <label className="block font-semibold mb-2 text-dark">Phone Number</label>
            <input
              type="tel"
              value={profileData.phone}
              onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary outline-none"
              placeholder="0788 XXX XXX"
            />
            <p className="text-sm text-gray-500 mt-1">
              Your phone number helps us contact you about your inquiries.
            </p>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={saving}
              className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {saving ? (
                <>
                  <i className="fas fa-spinner fa-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <i className="fas fa-save" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Simple Avatar Upload Component
function AvatarUpload({
  currentUrl,
  onUrlChange,
}: {
  currentUrl: string;
  onUrlChange: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5MB");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "kigali-property-link/avatars");

      // Create an AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        let errorMessage = "Upload failed";
        try {
          const errorData = await res.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          // If JSON parsing fails, use status text
          errorMessage = res.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
      
      if (!data.url) {
        throw new Error("Upload succeeded but no URL returned");
      }
      
      onUrlChange(data.url);
    } catch (err: any) {
      let errorMessage = "Failed to upload image. Please try again.";
      
      if (err.name === 'AbortError' || err.message?.includes('timeout') || err.message?.includes('Timeout')) {
        errorMessage = "Upload timed out. The file might be too large or your connection is slow. Please try a smaller image or check your internet connection.";
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      alert(errorMessage);
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async () => {
    if (!currentUrl) return;

    try {
      // Extract public_id from URL if it's a Cloudinary URL
      const urlParts = currentUrl.split("/");
      const publicIdIndex = urlParts.findIndex((part) => part === "upload") + 1;
      if (publicIdIndex > 0) {
        const publicId = urlParts.slice(publicIdIndex + 1).join("/").split(".")[0];
        
        await fetch("/api/upload", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ public_id: publicId }),
        });
      }
    } catch (err) {
      console.error("Failed to delete old image:", err);
    }

    onUrlChange("");
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          {uploading ? (
            <>
              <i className="fas fa-spinner fa-spin mr-2" />
              Uploading...
            </>
          ) : (
            <>
              <i className="fas fa-upload mr-2" />
              {currentUrl ? "Change Picture" : "Upload Picture"}
            </>
          )}
        </button>
        {currentUrl && (
          <button
            type="button"
            onClick={handleRemove}
            className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors text-sm"
          >
            <i className="fas fa-trash mr-2" />
            Remove
          </button>
        )}
      </div>
      <input
        id="avatar-upload"
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        ref={fileInputRef}
      />
      <p className="text-xs text-gray-500">
        JPG, PNG or WebP. Max size 5MB.
      </p>
    </div>
  );
}