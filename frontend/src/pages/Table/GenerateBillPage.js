  import React, { useState, useEffect } from 'react';
  import { Printer, Download, Share2 } from 'lucide-react';
  import { useNavigate } from 'react-router-dom';

  const GenerateBillPage = () => {
    const [order, setOrder] = useState(null);
    const [printMode, setPrintMode] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
      // Retrieve order from localStorage
      const storedOrder = localStorage.getItem('selectedOrder');
      if (storedOrder) {
        setOrder(JSON.parse(storedOrder));
      } else {
        // Redirect if no order is found
        navigate('/');
      }
    }, [navigate]);

    // Calculation functions
    const calculateItemTotal = (item) => {
      return item.price * item.quantity;
    };

    const calculateSubTotal = () => {
      return order?.items.reduce((total, item) => total + calculateItemTotal(item), 0) || 0;
    };

    const calculateTax = () => {
      const subTotal = calculateSubTotal();
      return subTotal * 0.05; // 5% tax
    };

    const calculateGrandTotal = () => {
      return calculateSubTotal() + calculateTax();
    };

    const handlePrint = () => {
      setPrintMode(true);
      setTimeout(() => {
        window.print();
        setPrintMode(false);
      }, 100);
    };

    const handleDownload = () => {
      // Implement PDF download logic
      alert('Download functionality to be implemented');
    };

    const handleShare = () => {
      // Implement share functionality
      alert('Share functionality to be implemented');
    };

    if (!order) {
      return <div>Loading...</div>;
    }

    return (
      <div className={`container mx-auto p-6 ${printMode ? 'print-mode' : ''}`}>
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Bill Actions */}
          {!printMode && (
            <div className="flex justify-end p-4 bg-gray-100 space-x-4">
              <button 
                onClick={handlePrint}
                className="flex items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                <Printer className="mr-2" size={20} /> Print
              </button>
              <button 
                onClick={handleDownload}
                className="flex items-center bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                <Download className="mr-2" size={20} /> Download
              </button>
              <button 
                onClick={handleShare}
                className="flex items-center bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
              >
                <Share2 className="mr-2" size={20} /> Share
              </button>
            </div>
          )}

          {/* Bill Content */}
          <div className="p-6">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold">TEST </h1>
              <p className="text-gray-600">BILL</p>
            </div>

            {/* Bill Details */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p><strong>Bill To:</strong></p>
                <p>{order.userName}</p>
                <p>{order.mobileNumber || 'Walk-in Customer'}</p>
                <p>Table: {order.tableNumber}</p>
                
              </div>
              <div className="text-right">
                <p><strong>Invoice No:</strong> {order._id?.$oid || order._id}</p>
                <p><strong>Date:</strong> {new Date(order.createdAt?.$date || order.createdAt).toLocaleString()}</p>
              </div>
            </div>

            {/* Item Details */}
            <table className="w-full mb-6">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 text-left">Item</th>
                  <th className="p-2 text-right">Quantity</th>
                  <th className="p-2 text-right">Rate</th>
                  <th className="p-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-2">{item.name}</td>
                    <td className="p-2 text-right">{item.quantity}</td>
                    <td className="p-2 text-right">₹{item.price.toFixed(2)}</td>
                    <td className="p-2 text-right">₹{calculateItemTotal(item).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Bill Summary */}
            <div className="ml-auto w-1/2">
              <div className="flex justify-between mb-2">
                <span>Sub Total</span>
                <span>₹{calculateSubTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>CGST (2.5%) + SGST (2.5%)</span>
                <span>₹{calculateTax().toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Grand Total</span>
                <span>₹{calculateGrandTotal().toFixed(2)}</span>
              </div>
            </div>

            {/* Bill Footer */}
            <div className="text-center mt-6 text-sm text-gray-600">
              <p>Thank you for your business!</p>
              <p>No exchange or refund</p>
            </div>
          </div>
        </div>

        {/* Print-specific styles */}
        <style jsx global>{`
          @media print {
            body * {
              visibility: hidden;
            }
            .print-mode, .print-mode * {
              visibility: visible;
            }
            .print-mode {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
            }
          }
        `}</style>
      </div>
    );
  };

  export default GenerateBillPage;