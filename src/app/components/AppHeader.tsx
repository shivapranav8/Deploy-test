import React from 'react';
import { LogOut, User, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface AppHeaderProps {
  username: string;
  onSignOut: () => void;
}

export function AppHeader({ username, onSignOut }: AppHeaderProps) {
  const handleSignOut = () => {
    toast.success('Successfully signed out');
    onSignOut();
  };

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo & App Name */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg shadow">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg text-gray-900">ZA - PM Co Pilot</h1>
              <p className="text-xs text-gray-500">AI-Powered Product Management Hub</p>
            </div>
          </div>

          {/* User Info & Sign Out */}
          <div className="flex items-center gap-4">
            {/* User Greeting */}
            <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="text-left">
                <p className="text-xs text-gray-500">Welcome back</p>
                <p className="text-sm font-medium text-gray-900">{username}</p>
              </div>
            </div>

            {/* Sign Out Button */}
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
