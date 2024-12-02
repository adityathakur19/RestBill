import React, { useState, useEffect } from 'react';
import { ArrowLeft, Trash2, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Estimate = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [dateRange, setDateRange] = useState({
        from: '',
        to: ''
    });
    const [selectedPeriod, setSelectedPeriod] = useState('');
    const [estimates, setEstimates] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showBin, setShowBin] = useState(false);
    const [selectedEstimates, setSelectedEstimates] = useState([]);
    const [todayEstimateCount, setTodayEstimateCount] = useState(0);

    const getDateRangeForPeriod = (period) => {
        const today = new Date();
        let fromDate = new Date(today);
        let toDate = new Date(today);

        // Important: Reset hours to start and end of day for precise filtering
        fromDate.setHours(0, 0, 0, 0);
        toDate.setHours(23, 59, 59, 999);

        switch (period) {
            case 'today':
                // Today's date range remains the same
                break;
            case '7days':
                fromDate.setDate(today.getDate() - 6); // Include today
                fromDate.setHours(0, 0, 0, 0); // Reset to start of the day
                break;
            case '30days':
                fromDate.setDate(today.getDate() - 29); // Include today
                fromDate.setHours(0, 0, 0, 0); // Reset to start of the day
                break;
            case 'month':
                fromDate.setDate(1); // First day of current month
                fromDate.setHours(0, 0, 0, 0);
                toDate = new Date(today.getFullYear(), today.getMonth() + 1, 0); // Last day of current month
                toDate.setHours(23, 59, 59, 999);
                break;
            case 'year':
                fromDate = new Date(today.getFullYear(), 0, 1); // First day of current year
                fromDate.setHours(0, 0, 0, 0);
                toDate = new Date(today.getFullYear(), 11, 31); // Last day of current year
                toDate.setHours(23, 59, 59, 999);
                break;
            default:
                break;
        }

        const formatDate = (date) => {
            return date.toISOString().split('T')[0]; // Use only date part
        };

        return {
            from: formatDate(fromDate),
            to: formatDate(toDate)
        };
    };

    const fetchEstimates = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch('http://localhost:5000/api/estimates', {
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch estimates: ${response.status}`);
            }

            const data = await response.json();
            const estimatesData = Array.isArray(data) ? data : (data.data || []);
            setEstimates(estimatesData);

            // Calculate today's estimates with precise date matching
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const todayEnd = new Date();
            todayEnd.setHours(23, 59, 59, 999);

            const todayCount = estimatesData.filter(estimate => {
                const estimateDate = new Date(estimate.createdAt);
                return estimateDate >= today && 
                       estimateDate <= todayEnd && 
                       !estimate.isDeleted;
            }).length;
            
            setTodayEstimateCount(todayCount);
        } catch (err) {
            console.error('Error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteEstimates = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:5000/api/estimates/bulk-delete', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ids: selectedEstimates })
            });

            if (!response.ok) {
                throw new Error(`Failed to delete estimates: ${response.status}`);
            }

            // Refresh estimates after deletion
            await fetchEstimates();
            
            // Clear selected estimates
            setSelectedEstimates([]);
        } catch (err) {
            console.error('Error deleting estimates:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const toggleEstimateSelection = (estimateId) => {
        setSelectedEstimates(prev => 
            prev.includes(estimateId)
                ? prev.filter(id => id !== estimateId)
                : [...prev, estimateId]
        );
    };

    useEffect(() => {
        fetchEstimates();
        // Set initial date range to today when component mounts
        const todayRange = getDateRangeForPeriod('today');
        setDateRange(todayRange);
        setSelectedPeriod('today');
    }, []);

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleDateRangeChange = (type, value) => {
        setDateRange(prev => ({
            ...prev,
            [type]: value
        }));
    };

    const handlePeriodSelect = (period) => {
        setSelectedPeriod(period);
        const newDateRange = getDateRangeForPeriod(period);
        setDateRange(newDateRange);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    };

    const filteredEstimates = estimates.filter(estimate => {
        // Search filtering
        const matchesSearch = !searchQuery || 
            estimate.party?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            estimate.party?.businessName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            estimate.estimateNo?.toString().includes(searchQuery);
        
        // Bin filtering
        const matchesBin = showBin ? estimate.isDeleted : !estimate.isDeleted;
        
        // Date range filtering
        // If no period or date range selected, show all estimates
        if (!selectedPeriod && (!dateRange.from || !dateRange.to)) return true;

        // Robust date comparison
        const matchesDateRange = 
            new Date(estimate.createdAt).setHours(0,0,0,0) >= new Date(dateRange.from).setHours(0,0,0,0) && 
            new Date(estimate.createdAt).setHours(0,0,0,0) <= new Date(dateRange.to).setHours(0,0,0,0);

        return matchesSearch && matchesBin && matchesDateRange;
    });

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="w-full max-w-7xl mx-auto p-4">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                    <ArrowLeft 
                        className="h-6 w-6 cursor-pointer hover:text-blue-600" 
                        onClick={() => navigate(-1)} 
                    />
                    <h1 className="text-2xl font-bold">Estimate List</h1>
                    <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                        Today's Estimates: {todayEstimateCount}
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    {selectedEstimates.length > 0 && (
                        <button
                            onClick={handleDeleteEstimates}
                            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                        >
                            <Trash2 className="h-5 w-5" />
                            Delete {selectedEstimates.length} Estimate(s)
                        </button>
                    )}
                    <div className="flex items-center gap-2">
                        <span>Bin List</span>
                        <input 
                            type="checkbox" 
                            className="w-4 h-4" 
                            checked={showBin}
                            onChange={(e) => setShowBin(e.target.checked)}
                        />
                    </div>
                    <button 
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        onClick={() => navigate('/new-estimate')}
                    >
                        + New Estimate
                    </button>
                </div>
            </div>
            {/* Search Section */}
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search estimates..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchQuery}
                    onChange={handleSearch}
                />
            </div>

            {/* Date Range Section */}
            <div className="mb-6">
                <div className="flex gap-4 mb-4">
                    {['today', '7days', '30days', 'month', 'year', 'custom'].map((period) => (
                        <button
                            key={period}
                            onClick={() => handlePeriodSelect(period)}
                            className={`px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors ${
                                selectedPeriod === period ? 'bg-blue-100 border-blue-500' : ''
                            }`}
                        >
                            {period.charAt(0).toUpperCase() + period.slice(1)}
                        </button>
                    ))}
                </div>
                <div className="flex gap-4">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={dateRange.from}
                            onChange={(e) => {
                                handleDateRangeChange('from', e.target.value);
                                setSelectedPeriod('custom');
                            }}
                        />
                    </div>
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={dateRange.to}
                            onChange={(e) => {
                                handleDateRangeChange('to', e.target.value);
                                setSelectedPeriod('custom');
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Estimates List Section */}
            <div className="space-y-4">
                {loading && (
                    <div className="text-center py-8">
                        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
                        <p className="mt-2 text-gray-600">Loading estimates...</p>
                    </div>
                )}
                {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600">Error: {error}</p>
                        <button 
                            onClick={fetchEstimates}
                            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Retry
                        </button>
                    </div>
                )}
              {!loading && !error && filteredEstimates.length > 0 && (
                    <div className="space-y-4">
                        {filteredEstimates.map((estimate) => (
                            <div 
                                key={estimate._id}
                                className={`border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow bg-white 
                                    ${selectedEstimates.includes(estimate._id) ? 'bg-blue-50 border-blue-300' : ''}`}
                            >
                                   {/* Checkbox for selection */}
                                   <div 
                                    className="absolute top-2 right-2 cursor-pointer"
                                    onClick={() => toggleEstimateSelection(estimate._id)}
                                >
                                    {selectedEstimates.includes(estimate._id) ? (
                                        <CheckCircle className="h-6 w-6 text-blue-600" />
                                    ) : (
                                        <input 
                                            type="checkbox" 
                                            className="w-5 h-5 cursor-pointer"
                                        />
                                    )}
                                </div>



                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-xl font-semibold">
                                                {estimate.party?.businessName || estimate.party?.name}
                                            </h3>
                                            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                                #{estimate.estimateNo}
                                            </span>
                                        </div>
                                        <div className="space-y-1 text-gray-600">
                                            <p>Client: {estimate.party?.name}</p>
                                            <p>Business: {estimate.party?.businessName}</p>
                                            <p>Phone: {estimate.party?.phone}</p>
                                            <p>Created: {formatDate(estimate.createdAt)}</p>
                                            <p>Category: {estimate.party?.category}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-green-600">
                                            {formatCurrency(estimate.totalAmount || 0)}
                                        </p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            {estimate.items?.length || 0} items
                                        </p>
                                    </div>
                                </div>
                                {/* Generate Bill Button */}
                                <div className="mt-4 flex justify-end">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/bill-generator/${estimate._id}`);
                                        }}
                                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                    >
                                        Generate Bill
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Estimate;