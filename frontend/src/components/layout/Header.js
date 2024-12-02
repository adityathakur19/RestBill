// src/components/layout/Header.js
import React from 'react';
import { Bell } from 'lucide-react';
import SearchBar from '../common/SearchBar';

const Header = () => {
  return (
    <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6">
      <div className="flex items-center flex-1">
        <div className="md:hidden">
          {/* Logo for mobile */}
          <span className="text-xl font-bold">RM</span>
        </div>
        <div className="max-w-md w-full ml-4 hidden md:block">
          <SearchBar />
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <button className="p-2 hover:bg-gray-100 rounded-full relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>
        
        {/* User Menu */}
        <div className="flex items-center space-x-2">
          <button className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg">
            <img
              src="/api/placeholder/32/32"
              alt="User"
              className="h-8 w-8 rounded-full"
            />
            <span className="hidden md:inline-block">Admin User</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;