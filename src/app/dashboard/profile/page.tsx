"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import ImageUpload from "@/components/forms/ImageUpload";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [profileData, setProfileData] = useState({
    email: "",
    name: "",
    avatar_url: "" as string,
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUser(user);
        setProfileData({
          email: user.email || "",
          name: user.user_metadata?.name || user.email?.split("@")[0] || "",
          avatar_url: user.user_metadata?.avatar_url || "",
        });
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSaving(true);

    try {
      const supabase = createClient();

      // Update user metadata (name + avatar_url)
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          name: profileData.name,
          avatar_url: profileData.avatar_url || null,
        },
      });

      if (updateError) throw updateError;

      // Update email if changed
      if (profileData.email !== user?.email) {
        const { error: emailError } = await supabase.auth.updateUser({
          email: profileData.email,
        });

        if (emailError) throw emailError;
        setSuccess("Email update requested. Please check your email to confirm the change.");
      } else {
        setSuccess("Profile updated successfully!");
      }

      // Ensure profile row in public.users is created/updated (for role, avatar, etc.)
      try {
        await fetch("/api/users/profile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: profileData.name,
            avatar_url: profileData.avatar_url || null,
          }),
        });
      } catch (profileError) {
        console.error("Failed to sync profile table:", profileError);
      }

      // Refresh user data
      const {
        data: { user: updatedUser },
      } = await supabase.auth.getUser();
      if (updatedUser) {
        setUser(updatedUser);
      }
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setSaving(true);

    try {
      const supabase = createClient();

      // Update password
      const { error: passwordError } = await supabase.auth.updateUser({
        password: passwordData.newPassword,
      });

      if (passwordError) throw passwordError;

      setSuccess("Password changed successfully!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err: any) {
      setError(err.message || "Failed to change password");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-16">
        <i className="fas fa-spinner fa-spin text-4xl text-primary mb-4"></i>
        <p className="text-gray-600">Loading profile...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dark mb-2">Profile Settings</h1>
        <p className="text-gray-600">Manage your account information and preferences</p>
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
          <i className="fas fa-exclamation-circle mr-2"></i>
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6">
          <i className="fas fa-check-circle mr-2"></i>
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Information */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-dark mb-4 flex items-center gap-2">
            <i className="fas fa-user text-primary"></i>
            Profile Information
          </h2>

          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div className="space-y-4">
              {/* Avatar Upload */}
              <div>
                <label className="block font-semibold mb-2 text-dark">Profile Picture</label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center">
                    {profileData.avatar_url ? (
                      <img
                        src={profileData.avatar_url}
                        alt="Profile avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <i className="fas fa-user text-gray-400 text-2xl"></i>
                    )}
                  </div>
                  <div className="flex-1">
                    <ImageUpload
                      images={profileData.avatar_url ? [profileData.avatar_url] : []}
                      maxImages={1}
                      onImagesChange={(images) =>
                        setProfileData((prev) => ({
                          ...prev,
                          avatar_url: images[0] || "",
                        }))
                      }
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-2 text-dark">Full Name</label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) =>
                    setProfileData({ ...profileData, name: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary outline-none"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block font-semibold mb-2 text-dark">Email Address</label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) =>
                    setProfileData({ ...profileData, email: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary outline-none"
                  placeholder="your@email.com"
                />
                <p className="text-sm text-gray-500 mt-1">
                  If you change your email, you'll need to confirm the new address
                </p>
              </div>

              <div>
                <label className="block font-semibold mb-2 text-dark">User ID</label>
                <input
                  type="text"
                  value={user?.id || ""}
                  disabled
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-500"
                />
                <p className="text-sm text-gray-500 mt-1">
                  This is your unique user identifier
                </p>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Saving...
                  </>
                ) : (
                  <>
                    <i className="fas fa-save mr-2"></i>
                    Update Profile
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Change Password */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-dark mb-4 flex items-center gap-2">
            <i className="fas fa-lock text-primary"></i>
            Change Password
          </h2>

          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block font-semibold mb-2 text-dark">New Password</label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, newPassword: e.target.value })
                }
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary outline-none"
                placeholder="Enter new password"
                required
                minLength={6}
              />
            </div>

            <div>
              <label className="block font-semibold mb-2 text-dark">Confirm New Password</label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                }
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary outline-none"
                placeholder="Confirm new password"
                required
                minLength={6}
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
              <p>
                <i className="fas fa-info-circle mr-2"></i>
                Password must be at least 6 characters long
              </p>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-secondary text-white px-6 py-3 rounded-lg font-semibold hover:bg-secondary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Changing Password...
                </>
              ) : (
                <>
                  <i className="fas fa-key mr-2"></i>
                  Change Password
                </>
              )}
            </button>
          </form>
        </div>

        {/* Account Information */}
        <div className="bg-white rounded-xl shadow-md p-6 lg:col-span-2">
          <h2 className="text-xl font-bold text-dark mb-4 flex items-center gap-2">
            <i className="fas fa-info-circle text-primary"></i>
            Account Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-2 text-gray-600">Account Created</label>
              <p className="text-dark">
                {user?.created_at
                  ? new Date(user.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "N/A"}
              </p>
            </div>

            <div>
              <label className="block font-semibold mb-2 text-gray-600">Last Sign In</label>
              <p className="text-dark">
                {user?.last_sign_in_at
                  ? new Date(user.last_sign_in_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "Never"}
              </p>
            </div>

            <div>
              <label className="block font-semibold mb-2 text-gray-600">Email Verified</label>
              <p className="text-dark">
                {user?.email_confirmed_at ? (
                  <span className="text-green-600">
                    <i className="fas fa-check-circle mr-1"></i>
                    Verified
                  </span>
                ) : (
                  <span className="text-yellow-600">
                    <i className="fas fa-exclamation-circle mr-1"></i>
                    Not Verified
                  </span>
                )}
              </p>
            </div>

            <div>
              <label className="block font-semibold mb-2 text-gray-600">Authentication Method</label>
              <p className="text-dark">
                <i className="fas fa-envelope mr-1"></i>
                Email & Password
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
