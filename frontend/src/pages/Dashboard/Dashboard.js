import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Users,
  TrendingUpDown,
  Soup,
  ReceiptIndianRupee,
  FileText,
  Calculator,
  ShoppingCart,
  ShoppingBag,
  DollarSign,
  LogOut,
  Home,
  Menu,
  BarChart2,
  Settings,
} from 'lucide-react';

const Dashboard = () => {
  const [quickStats, setQuickStats] = useState([
    { name: 'Total Sales', value: '0', icon: ReceiptIndianRupee, path: '/sale' },
    { name: 'Pending KOT', value: '0', icon: FileText, path: '/kot' },
    { name: 'Total Estimates', value: '0', icon: Calculator, path: '/estimate' },
    { name: 'Active Tables', value: '0', icon: Users, path: '/table' },
    { name: 'Items', value: '0', icon: Soup, path: '/item' },
  ]);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const quickActions = [
    { name: 'Create Estimate', icon: TrendingUpDown, path: '/new-estimate' },
    { name: 'Add Item', icon: Soup, path: '/product' },
    { name: 'Manage Tables', icon: Users, path: '/table' }
  ];

  const recentActivities = [
    { type: 'Sale', description: 'No recent sales', date: new Date() },
    { type: 'Estimate', description: 'No recent estimates', date: new Date() },
    { type: 'KOT', description: 'No recent kitchen orders', date: new Date() }
  ];

  const sidebarItems = [
    { name: 'Dashboard', icon: Home, path: '/' },
    { name: 'Reports', icon: BarChart2, path: '/report' },
    { name: 'Settings', icon: Settings, path: '/settings' },
  ];

  const handleLogout = () => {
    // Clear authentication tokens and state
    localStorage.removeItem('token');
    localStorage.removeItem('isAuthenticated');
    
    // Redirect to login page
    navigate('/login');
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className={`bg-white shadow-md h-screen transition-all duration-300 ${
        isSidebarOpen ? 'w-64' : 'w-20'
      } fixed left-0 top-0 z-50`}>
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className={`text-xl font-bold transition-opacity ${
            isSidebarOpen ? 'opacity-100' : 'opacity-0'
          }`}>
            Restaurant App
          </h2>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded"
          >
            <Menu />
          </button>
        </div>
        
        <nav className="mt-4">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                className="flex items-center p-4 hover:bg-gray-100 transition"
              >
                <Icon className="w-6 h-6 mr-4" />
                <span className={`transition-opacity ${
                  isSidebarOpen ? 'opacity-100' : 'opacity-0 hidden'
                }`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
          
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center p-4 hover:bg-gray-100 transition"
          >
            <LogOut className="w-6 h-6 mr-4" />
            <span className={`transition-opacity ${
              isSidebarOpen ? 'opacity-100' : 'opacity-0 hidden'
            }`}>
              Logout
            </span>
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${
        isSidebarOpen ? 'ml-64' : 'ml-20'
      } p-6`}>
        <div className="space-y-6">
          {/* Quick Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickStats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Link 
                  key={stat.name} 
                  to={stat.path} 
                  className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-gray-100">
                      <Icon className="w-6 h-6 text-gray-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                      <p className="text-lg font-semibold text-gray-900">{stat.value}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

      {/* Quick Actions and Recent Activity Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Actions */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <Link
                      key={action.name}
                      to={action.path}
                      className="bg-gray-100 hover:bg-gray-200 rounded-lg p-4 flex flex-col items-center justify-center space-y-2 transition"
                    >
                      <Icon className="w-6 h-6 text-gray-600" />
                      <span className="text-sm text-center">{action.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div 
                    key={index} 
                    className="border-b pb-3 last:border-b-0 hover:bg-gray-50 p-2 rounded transition"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-gray-800">{activity.type}</p>
                        <p className="text-xs text-gray-500">{activity.description}</p>
                      </div>
                      <span className="text-xs text-gray-400">
                        {activity.date.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Reporting and Analytics Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Reports</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link 
                to="/report" 
                className="bg-blue-50 hover:bg-blue-100 rounded-lg p-4 flex items-center justify-between transition"
              >
                <div>
                  <p className="text-sm font-medium text-blue-800">Daily Report</p>
                  <p className="text-xs text-blue-600">View today's summary</p>
                </div>
                <Calculator className="w-5 h-5 text-blue-500" />
              </Link>
              <Link 
                to="/report" 
                className="bg-green-50 hover:bg-green-100 rounded-lg p-4 flex items-center justify-between transition"
              >
                <div>
                  <p className="text-sm font-medium text-green-800">Sales Report</p>
                  <p className="text-xs text-green-600">Analyze sales performance</p>
                </div>
                <DollarSign className="w-5 h-5 text-green-500" />
              </Link>
              <Link 
                to="/report" 
                className="bg-purple-50 hover:bg-purple-100 rounded-lg p-4 flex items-center justify-between transition"
              >
                <div>
                  <p className="text-sm font-medium text-purple-800">Inventory Report</p>
                  <p className="text-xs text-purple-600">Check stock levels</p>
                </div>
                <ShoppingBag className="w-5 h-5 text-purple-500" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;