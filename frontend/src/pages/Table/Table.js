import React, { useState, useEffect } from 'react';
import { 
  ReceiptIndianRupee, 
  FileText, 
  Calculator, 
  Users, 
  Soup, 
  TrendingUpDown,
  ChevronRight,
  Calendar,
  Filter,
  Edit,
  Trash2,
  CheckCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const OrdersTableEnhanced = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [totalSales, setTotalSales] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [billFilter, setBillFilter] = useState('today');
  const [editingOrder, setEditingOrder] = useState(null);

  const [quickStats, setQuickStats] = useState([
    { name: 'Total Sales', value: '0', icon: ReceiptIndianRupee, path: '/sale' },
    { name: 'Pending KOT', value: '0', icon: FileText, path: '/kot' },
    { name: 'Total Estimates', value: '0', icon: Calculator, path: '/estimate' },
    { name: 'Active Tables', value: '0', icon: Users, path: '/table' },
    { name: 'Items', value: '0', icon: Soup, path: '/item' },
  ]);

  const quickActions = [
    { name: 'Create Estimate', icon: TrendingUpDown, path: '/new-estimate' },
    { name: 'Add Item', icon: Soup, path: '/product' },
    { name: 'Manage Tables', icon: Users, path: '/table' }
  ];

  // Bill filtering presets
  const billFilterOptions = [
    { 
      name: 'Today', 
      value: 'today', 
      icon: Calendar,
      filter: (order) => {
        const today = new Date();
        const orderDate = new Date(order.createdAt?.$date || order.createdAt);
        return orderDate.toDateString() === today.toDateString();
      }
    },
    { 
      name: 'Yesterday', 
      value: 'yesterday', 
      icon: Calendar,
      filter: (order) => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const orderDate = new Date(order.createdAt?.$date || order.createdAt);
        return orderDate.toDateString() === yesterday.toDateString();
      }
    },
    { 
      name: 'Last 7 Days', 
      value: 'last7days', 
      icon: Calendar,
      filter: (order) => {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const orderDate = new Date(order.createdAt?.$date || order.createdAt);
        return orderDate >= sevenDaysAgo;
      }
    },
    { 
      name: 'Last Month', 
      value: 'lastMonth', 
      icon: Calendar,
      filter: (order) => {
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        const orderDate = new Date(order.createdAt?.$date || order.createdAt);
        return orderDate >= lastMonth;
      }
    },
    { 
      name: 'Custom', 
      value: 'custom', 
      icon: Filter 
    }
  ];

  // Custom date range state
  const [customDateRange, setCustomDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('https://backend1-1zr2.onrender.com/orders');
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }
        const data = await response.json();
        const ordersArray = Array.isArray(data) ? data : 
                             data.orders ? data.orders : 
                             data.data ? data.data : [];
        
        // Sort orders by most recent first
        const sortedOrders = ordersArray.sort((a, b) => {
          const dateA = new Date(a.createdAt?.$date || a.createdAt);
          const dateB = new Date(b.createdAt?.$date || b.createdAt);
          return dateB - dateA;
        });

        setOrders(sortedOrders);
        
        // Initially filter for today's orders
        const todayOrders = sortedOrders.filter(billFilterOptions[0].filter);
        setFilteredOrders(todayOrders);

        setIsLoading(false);

        // Calculate total sales for filtered orders
        const totalSalesAmount = todayOrders.reduce((total, order) => {
          return total + calculateTotal(order.items);
        }, 0);
        setTotalSales(totalSalesAmount);

        // Update quick stats with total sales
        setQuickStats(prev => 
          prev.map(stat => 
            stat.name === 'Total Sales' 
              ? { ...stat, value: `₹${totalSalesAmount.toFixed(2)}` }
              : stat
          )
        );
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Format date to a more readable format
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calculate total order price
  const calculateTotal = (items) => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Apply bill filter and update filtered orders
  const applyBillFilter = (filterValue) => {
    setBillFilter(filterValue);

    let filteredResult = orders;

    if (filterValue === 'custom') {
      // Open custom date range modal/input
      return;
    }

    const selectedFilter = billFilterOptions.find(option => option.value === filterValue);
    
    if (selectedFilter && selectedFilter.filter) {
      filteredResult = orders.filter(selectedFilter.filter);
    }

    setFilteredOrders(filteredResult);

    // Recalculate total sales for filtered orders
    const totalSalesAmount = filteredResult.reduce((total, order) => {
      return total + calculateTotal(order.items);
    }, 0);
    setTotalSales(totalSalesAmount);

    // Update quick stats with total sales
    setQuickStats(prev => 
      prev.map(stat => 
        stat.name === 'Total Sales' 
          ? { ...stat, value: `₹${totalSalesAmount.toFixed(2)}` }
          : stat
      )
    );
  };

  // Apply custom date range filter
  const applyCustomDateFilter = () => {
    const { startDate, endDate } = customDateRange;
    
    if (!startDate || !endDate) {
      alert('Please select both start and end dates');
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);  // Set end of day

    const customFilteredOrders = orders.filter(order => {
      const orderDate = new Date(order.createdAt?.$date || order.createdAt);
      return orderDate >= start && orderDate <= end;
    });

    setFilteredOrders(customFilteredOrders);
    setBillFilter('custom');

    // Recalculate total sales for filtered orders
    const totalSalesAmount = customFilteredOrders.reduce((total, order) => {
      return total + calculateTotal(order.items);
    }, 0);
    setTotalSales(totalSalesAmount);

    // Update quick stats with total sales
    setQuickStats(prev => 
      prev.map(stat => 
        stat.name === 'Total Sales' 
          ? { ...stat, value: `₹${totalSalesAmount.toFixed(2)}` }
          : stat
      )
    );
  };

 const handleGenerateBill = async (order) => {
    try {
      if (!order || !order._id) {
        throw new Error('Invalid order selected');
      }

      // Store the selected order in localStorage for bill generation page
      localStorage.setItem('selectedOrder', JSON.stringify({
        ...order,
        canEdit: isWithinEditWindow(order.createdAt)
      }));

      // Calculate order total before removing
      const orderTotal = calculateTotal(order.items);

      // Remove order from local state
      const updatedOrders = orders.filter(o => 
        (o._id?.$oid || o._id) !== (order._id?.$oid || order._id)
      );
      setOrders(updatedOrders);

      // Remove order from filtered orders
      const updatedFilteredOrders = filteredOrders.filter(o => 
        (o._id?.$oid || o._id) !== (order._id?.$oid || order._id)
      );
      setFilteredOrders(updatedFilteredOrders);

      // Recalculate total sales
      const newTotalSales = totalSales - orderTotal;
      setTotalSales(newTotalSales);

      // Update quick stats
      setQuickStats(prev => 
        prev.map(stat => 
          stat.name === 'Total Sales' 
            ? { ...stat, value: `₹${newTotalSales.toFixed(2)}` }
            : stat
        )
      );

      // Navigate to bill generation page
      navigate('/generate-bill');

    } catch (error) {
      console.error('Bill Generation Error:', error);
      alert(`Error generating bill: ${error.message}`);
    }
  };

  // Helper function to check if order is within edit window (20 minutes)
  const isWithinEditWindow = (createdAt) => {
    const orderTime = new Date(createdAt?.$date || createdAt);
    const currentTime = new Date();
    const timeDiff = (currentTime - orderTime) / (1000 * 60); // difference in minutes
    return timeDiff <= 20;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="spinner-border animate-spin text-blue-600" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        {error}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar with Quick Stats and Actions */}
      <div className="w-64 bg-white shadow-md p-4 space-y-6">
        {/* Quick Stats Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Quick Stats</h3>
          <div className="space-y-3">
            {quickStats.map((stat, index) => (
              <div 
                key={index} 
                className="flex items-center p-3 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors"
                onClick={() => navigate(stat.path)}
              >
                <div className="mr-3 text-blue-600">
                  <stat.icon size={24} />
                </div>
                <div className="flex-grow">
                  <p className="text-sm text-gray-600">{stat.name}</p>
                  <p className="font-bold text-gray-800">{stat.value}</p>
                </div>
                <ChevronRight className="text-gray-400" size={20} />
              </div>
            ))}
          </div>
        </div>
        
        {/* Quick Actions Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Quick Actions</h3>
          <div className="space-y-3">
            {quickActions.map((action, index) => (
              <button 
                key={index} 
                className="w-full flex items-center justify-between p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                onClick={() => navigate(action.path)}
              >
                <div className="flex items-center">
                  <action.icon className="mr-3" size={20} />
                  {action.name}
                </div>
                <ChevronRight size={20} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow p-6">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {/* Bill Filter Bar */}
          <div className="bg-gray-50 p-4 border-b flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">Orders</h2>
            <div className="flex space-x-2">
              {billFilterOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => option.value !== 'custom' ? applyBillFilter(option.value) : null}
                  className={`
                    flex items-center px-3 py-2 rounded-lg transition-colors
                    ${billFilter === option.value 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }
                  `}
                >
                  <option.icon className="mr-2" size={16} />
                  {option.name}
                </button>
              ))}
              {/* Custom Date Range Modal */}
              {billFilter === 'custom' && (
                <div className="flex items-center space-x-2">
                  <input 
                    type="date" 
                    value={customDateRange.startDate}
                    onChange={(e) => setCustomDateRange(prev => ({
                      ...prev, 
                      startDate: e.target.value
                    }))}
                    className="border rounded px-2 py-1"
                  />
                  <input 
                    type="date" 
                    value={customDateRange.endDate}
                    onChange={(e) => setCustomDateRange(prev => ({
                      ...prev, 
                      endDate: e.target.value
                    }))}
                    className="border rounded px-2 py-1"
                  />
                  <button 
                    onClick={applyCustomDateFilter}
                    className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600"
                  >
                    Apply
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  {['Order ID','Table Number' ,'Name' , 'Mobile Number', 'Items', 'Total Price', 'Created At','Actions'].map((header) => (
                    <th 
                      key={header} 
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr 
                    key={order._id?.$oid || order._id} 
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order._id?.$oid || order._id}
                    </td> 
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.tableNumber}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.userName}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.mobileNumber || 'Walk-in Customer'}
                    </td>
                    <td className="px-4 py-4">
                      {order.items.map((item) => (
                        <div 
                          key={item._id?.$oid || item._id} 
                          className="text-sm text-gray-600"
                        >
                          {item.name} (x{item.quantity}) - ₹{item.price}
                        </div>
                      ))}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                      ₹{calculateTotal(order.items)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(order.createdAt?.$date || order.createdAt)}
                    </td>
                    <td className="px-4 py-4">
                      <button 
                        onClick={() => handleGenerateBill(order)}
                        className="flex items-center bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 transition-colors"
                      >
                        Generate Bill
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredOrders.length === 0 && (
            <div className="text-center py-10 text-gray-500">
              No orders found for the selected period
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersTableEnhanced;