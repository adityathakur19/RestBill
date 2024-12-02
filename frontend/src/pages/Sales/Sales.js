import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';



const Sales = () => {
  const [sales, setSales] = useState([]);
  const [newSale, setNewSale] = useState({
    saleNo: '',
    billDate: '',
    dueDate: '',
    billingTerm: '',
    total: 0,
    gstin: '',
    deliveryState: '',
  });
  const [error, setError] = useState(null);

  // Fetch sales from the API
  useEffect(() => {
    const fetchSales = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/sales');
        if (!response.ok) {
          throw new Error('Error fetching sales data');
        }
        const data = await response.json();
        setSales(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchSales();
  }, []);


  // Handle input changes
  const handleInputChange = (e) => {
    setNewSale({ ...newSale, [e.target.name]: e.target.value });
  };

  // Create a new sale
  const handleCreateSale = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/sales', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSale),
      });
      if (!response.ok) {
        throw new Error('Error creating sale');
      }
      const newSaleData = await response.json();
      setSales([...sales, newSaleData]);
      setNewSale({
        saleNo: '',
        billDate: '',
        dueDate: '',
        billingTerm: '',
        total: 0,
        gstin: '',
        deliveryState: '',
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const navigate = useNavigate();

  const goToDashboard = () => {
    navigate('/');
  };


  return (
    <div className="container mx-auto my-8">
      
      {/* DASHBoARD Button */}
       <button
      onClick={goToDashboard}
      className="px-4 py-2 text-white bg-blue-600 
      hover:bg-blue-700 transition-colors duration-200 
      rounded font-medium text-sm shadow-md"
    >
      Go to Dashboard
    </button>
    {/*Ends Here*/}

      <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">Sales Management</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 text-center">
          {error}
        </div>
      )}
      {/* New Sale Form */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-700">Create New Sale</h2>
        <form className="grid grid-cols-2 gap-4">
          {[
            { name: 'saleNo', placeholder: 'Sale No.', type: 'text' },
            { name: 'billDate', placeholder: '', type: 'date' },
            { name: 'dueDate', placeholder: '', type: 'date' },
            { name: 'billingTerm', placeholder: 'Billing Term', type: 'text' },
            { name: 'total', placeholder: 'Total', type: 'number' },
            { name: 'gstin', placeholder: 'GSTIN', type: 'text' },
            { name: 'deliveryState', placeholder: 'Delivery State', type: 'text' },
          ].map(({ name, placeholder, type }) => (
            <input
              key={name}
              type={type}
              name={name}
              placeholder={placeholder}
              value={newSale[name]}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ))}
        </form>
        <button
          onClick={handleCreateSale}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 w-full"
        >
          Create Sale
        </button>
      </div>

      {/* Sales Table */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-700">All Sales</h2>
        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 text-left">Sale No.</th>
              <th className="px-4 py-2 text-left">Bill Date</th>
              <th className="px-4 py-2 text-left">Due Date</th>
              <th className="px-4 py-2 text-left">Billing Term</th>
              <th className="px-4 py-2 text-left">Total</th>
              <th className="px-4 py-2 text-left">GSTIN</th>
              <th className="px-4 py-2 text-left">Delivery State</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale) => (
              <tr key={sale._id} className="border-b">
                <td className="px-4 py-2">{sale.saleNo}</td>
                <td className="px-4 py-2">
                  {format(new Date(sale.billDate), 'MMM d, yyyy')}
                </td>
                <td className="px-4 py-2">
                  {format(new Date(sale.dueDate), 'MMM d, yyyy')}
                </td>
                <td className="px-4 py-2">{sale.billingTerm}</td>
                <td className="px-4 py-2">{sale.total}</td>
                <td className="px-4 py-2">{sale.gstin}</td>
                <td className="px-4 py-2">{sale.deliveryState}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Sales;
