import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Card, CardHeader, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { RootState } from "../../app/store";
import { User, Mail, Calendar, Shield } from "lucide-react";
import { ChangePasswordModal } from "../../components/auth/ChangePasswordModal";

const ProfilePage = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Profile
        </h1>
        <p className="text-gray-500 font-medium mt-1">
          Manage your account information and preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-gray-100 shadow-sm rounded-2xl">
            <CardHeader className="border-b border-gray-50">
              <h2 className="text-lg font-bold text-gray-900">
                Personal Information
              </h2>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    First Name
                  </label>
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl">
                    <p className="text-sm font-medium text-gray-900">
                      {user.firstName}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Last Name
                  </label>
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl">
                    <p className="text-sm font-medium text-gray-900">
                      {user.lastName}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Email Address
                </label>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl flex items-center gap-3">
                  <Mail size={16} className="text-gray-400" />
                  <p className="text-sm font-medium text-gray-900">
                    {user.email}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                {/* User ID display removed for security */}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-indigo-100 shadow-sm rounded-2xl bg-indigo-50/50">
            <CardContent className="p-6 space-y-4">
              <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white mb-2">
                <User size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  {user.firstName} {user.lastName}
                </h3>
                <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider mt-1">
                  {user.role}
                </p>
              </div>
              <div className="pt-4 border-t border-indigo-100 space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar size={14} className="text-indigo-500" />
                  <span className="text-xs font-medium">
                    Joined{" "}
                    {new Date(user.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-100 shadow-sm rounded-2xl">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-gray-600">
                  <Shield size={20} />
                </div>
                <h3 className="text-base font-bold text-gray-900">Security</h3>
              </div>
              <Button
                variant="outline"
                className="w-full rounded-xl h-10 text-sm font-bold"
                onClick={() => setIsChangePasswordOpen(true)}
              >
                Change Password
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
      />
    </div>
  );
};

export default ProfilePage;
