import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home,
  Users,
  Soup,
  FileText,
  Calculator,
  ShoppingCart,
  ShoppingBag,
  DollarSign,
  Settings
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const navigationItems = [
    { path: '/', name: 'Dashboard', icon: Home },
    { path: '/Report', name: 'Report', icon: Calculator },
    { path: '/table', name: 'Table', icon: Users },
    { path: '/item', name: 'Item', icon: Soup },
    { path: '/kot', name: 'KOT', icon: FileText },
    { path: '/estimate', name: 'Estimate', icon:  DollarSign},
    { path: '/sale', name: 'Sale', icon: ShoppingCart },
    { path: '/purchase', name: 'Purchase', icon: ShoppingBag },
    { path: '/settings', name: 'Settings', icon: Settings },
  ];

  return (
    <aside className="bg-gray-800 w-64 h-screen flex-shrink-0 hidden md:block">
      {/* Logo Section */}
      <div className="h-16 bg-gray-900 flex items-center justify-center">
        <span className="text-white text-xl font-bold">Restaurant Manager</span>
      </div>

      {/* Navigation Menu */}
      <nav className="mt-4">
        <div className="px-4 space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center px-4 py-3 text-sm rounded-lg
                  ${isActive 
                    ? 'bg-gray-900 text-white' 
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'}
                  transition-colors duration-200
                `}
              >
                <Icon className="w-5 h-5 mr-3" />
                <span>{item.name}</span>
                
                {/* Active Indicator */}
                {isActive && (
                  <div className="ml-auto">
                    <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Bottom Section - Optional */}
      <div className="absolute bottom-0 w-64 bg-gray-900 p-4">
        <div className="flex items-center text-gray-300">
          <img 
            src="/api/placeholder/32/32"
            alt="Restaurant Logo"
            className="h-8 w-8 rounded-full"
          />
          <div className="ml-3">
            <p className="text-sm font-medium">Restaurant Name</p>
            <p className="text-xs">Manage Restaurant</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;