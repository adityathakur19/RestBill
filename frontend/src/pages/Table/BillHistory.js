import React, { useState, useEffect } from 'react';
import { Eye, Printer, Download, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BillHistory = () => {
  const [bills, setBills] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const response = await fetch('https://backend1-1zr2.onrender.com/bills');
        if (!response.ok) {
          throw new Error('Failed to fetch bills');
        }
        const data = await response.json();
        setBills(data);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchBills();
  }, []);

  const handleViewBill = (bill) => {
    // Check if within edit window
    const orderTime = new Date(bill.createdAt);
    const currentTime = new Date();
    const timeDiff = (currentTime - orderTime) / (1000 * 60); // difference in minutes
    const canEdit = timeDiff <= 20;

    // Store bill in localStorage with edit permission
    localStorage.setItem('selectedBill', JSON.stringify({
      ...bill,
      canEdit: canEdit
    }));
    navigate('/generate-bill');
  };

  const handleEditBill = async (bill) => {
    // Check if within edit window
    const orderTime = new Date(bill.createdAt);
    const currentTime = new Date();
    const timeDiff = (currentTime - orderTime) / (1000 * 60); // difference in minutes
    
    if (timeDiff > 20) {
      alert('Edit window has expired. Cannot modify bill.');
      return;
    }

    try {
      // API call to update bill
      const response = await fetch(`https://backend1-1zr2.onrender.com/orders/${bill._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bill)
      });

      if (!response.ok) {
        throw new Error('Failed to update bill');
      }

      alert('Bill updated successfully');
    } catch (error) {
      console.error('Error updating bill:', error);
      alert('Failed to update bill');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
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
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Bill History</h1>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              {['Phone Number', 'Date', 'Total Amount', 'Actions'].map((header) => (
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
            {bills.map((bill) => {
              const orderTime = new Date(bill.createdAt);
              const currentTime = new Date();
              const timeDiff = (currentTime - orderTime) / (1000 * 60); // difference in minutes
              const canEdit = timeDiff <= 20;

              return (
                <tr key={bill._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {bill.customerPhone || 'N/A'}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(bill.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                    ₹{bill.totalAmount.toFixed(2)}
                  </td>
                  <td className="px-4 py-4 flex space-x-2">
                    <button 
                      onClick={() => handleViewBill(bill)}
                      className="text-blue-500 hover:text-blue-700"
                      title="View Bill"
                    >
                      <Eye size={20} />
                    </button>
                    {canEdit && (
                      <button 
                        onClick={() => handleEditBill(bill)}
                        className="text-green-500 hover:text-green-700"
                        title="Edit Bill"
                      >
                        <Edit size={20} />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {bills.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            No bills found
          </div>
        )}
      </div>
    </div>
  );
};

export default BillHistory;