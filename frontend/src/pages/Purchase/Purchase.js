import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronLeft, Plus } from 'lucide-react';
import { format } from 'date-fns';

const Purchase = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedFilter, setSelectedFilter] = React.useState('Today');
  const [dateRange, setDateRange] = React.useState({
    from: format(new Date(), 'dd MMM yyyy'),
    to: format(new Date(), 'dd MMM yyyy')
  });
  
  // Sample purchase data - in real app, this would come from your backend
  const [purchases] = React.useState([
    { id: 1, amount: 1800.00, date: new Date() }
  ]);

  const handleNewPurchase = () => {
    navigate('/new-purchase');
  };

  const handleBack = () => {
    navigate(-1);
  };

  const filters = ['Today', '7 Days', '30 Days', 'Month', 'Year', 'Custom'];

  const totalAmount = purchases.reduce((sum, purchase) => sum + purchase.amount, 0);
  const purchaseCount = purchases.length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-500 text-white p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <button onClick={handleBack} className="mr-4">
              <ChevronLeft size={24} />
            </button>
            <div>
              <h1 className="text-xl font-semibold">Purchase List</h1>
              <p className="text-sm">
                Last Sync at {format(new Date(), 'EEE MMM dd yyyy HH:mm:ss')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="bg-red-500 px-4 py-2 rounded">
              Bulk Delete
            </button>
            <div className="flex items-center gap-2">
              <span>Bin List</span>
              <div className="w-12 h-6 bg-gray-200 rounded-full p-1">
                <div className="w-4 h-4 bg-white rounded-full"></div>
              </div>
            </div>
            <button
              onClick={handleNewPurchase}
              className="bg-white text-blue-500 px-4 py-2 rounded flex items-center gap-2"
            >
              <Plus size={18} />
              New Purchase
            </button>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-2 flex items-center">
          <Search className="text-gray-400 w-5 h-5 mx-2" />
          <input
            type="text"
            placeholder="Search"
            className="w-full outline-none text-gray-700"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="p-4">
        <div className="flex gap-4 mb-4">
          {filters.map((filter) => (
            <button
              key={filter}
              className={`px-4 py-2 rounded-full ${
                selectedFilter === filter
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-600'
              }`}
              onClick={() => setSelectedFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Date Range */}
        <div className="flex gap-4">
          <div className="bg-white p-4 rounded">
            <span className="text-gray-600 mr-2">From</span>
            <input
              type="text"
              value={dateRange.from}
              readOnly
              className="outline-none"
            />
          </div>
          <div className="bg-white p-4 rounded">
            <span className="text-gray-600 mr-2">To</span>
            <input
              type="text"
              value={dateRange.to}
              readOnly
              className="outline-none"
            />
          </div>
        </div>
      </div>

      {/* Purchase Count and Amount */}
      <div className="px-4">
        <div className="bg-white p-4 rounded">
          <div className="text-gray-600">
            Count: {purchaseCount} | Amount: ₹{totalAmount.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Purchase;