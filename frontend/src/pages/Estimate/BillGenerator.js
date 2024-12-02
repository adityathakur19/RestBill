import React, { useState, useEffect, useCallback } from "react";
import { ArrowLeft } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";

const useFetchEstimate = (estimateId, companyInfo) => {
  const [estimate, setEstimate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const fetchEstimate = async () => {
      if (!estimateId) {
        navigate("/estimates");
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`http://localhost:5000/api/estimates/${estimateId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch estimate: ${response.status}`);
        }

        const { success, data } = await response.json();
        if (!success || !data) {
          throw new Error("Invalid response format from server");
        }

        if (isMounted) {
          const transformedData = {
            ...data,
            ...companyInfo,
            items: data.items.map((item) => ({
              name: item.itemName,
              quantity: item.quantity,
              rate: item.sellPrice,
            })),
          };
          setEstimate(transformedData);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "An unexpected error occurred");
          setLoading(false);
        }
      }
    };

    fetchEstimate();

    return () => {
      isMounted = false;
    };
  }, [estimateId, companyInfo, navigate]);

  return { estimate, loading, error };
};

const BillGenerator = () => {
  const { estimateId } = useParams();
  const navigate = useNavigate();
  const [paperSize, setPaperSize] = useState("modern");
  const [isPrinting, setIsPrinting] = useState(false);

  const companyInfo = React.useMemo(
    () => ({
      companyName: "Aditya",
      companyAddress: "123 Cool Street",
      companyCity: "COOL City, ST 12345",
      companyGST: "GST123456789",
      companyPhone: "+91 1234567890",
      companyEmail: "cool@nice.com",
    }),
    []
  );

  const { estimate, loading, error } = useFetchEstimate(estimateId, companyInfo);

  const calculateTotal = useCallback(
    (items) => items?.reduce((sum, item) => sum + item.rate * item.quantity, 0) || 0,
    []
  );

  const calculateGST = useCallback((total) => total * 0.18, []);
  const formatCurrency = useCallback(
    (amount) =>
      new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2,
      }).format(amount),
    []
  );

  // Updated print handler
  const handlePrint = useCallback(() => {
    // Prevent multiple clicks
    if (isPrinting) return;
    setIsPrinting(true);
  
    try {
      // Create a new window
      const printWindow = window.open('', '_blank', 'width=800,height=800');
      const printableContent = document.getElementById("printable-content");
  
      if (!printWindow || !printableContent) {
        throw new Error('Could not initialize print window or content missing');
      }
  
      // Write the content
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Print Bill</title>
            <style>
              @page {
                size: ${paperSize === '2-inch' ? '58mm' : paperSize === '3-inch' ? '80mm' : 'A4'};
                margin: ${paperSize === 'modern' ? '20mm' : '2mm'};
              }
              body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              .print-modern {
                width: 100%;
                max-width: 800px;
                margin: 0 auto;
              }
              .print-2-inch {
                width: 58mm;
                padding: 2mm;
              }
              .print-3-inch {
                width: 80mm;
                padding: 2mm;
              }
              table {
                width: 100%;
                border-collapse: collapse;
              }
              th, td {
                border: 1px solid #ddd;
                padding: 8px;
                text-align: left;
              }
              @media print {
                body {
                  padding: 0;
                }
                .no-print {
                  display: none !important;
                }
              }
            </style>
          </head>
          <body>
            ${printableContent.innerHTML}
          </body>
        </html>
      `);
  
      // Close the document writing
      printWindow.document.close();
  
      // Wait for resources to load
      printWindow.onload = () => {
        try {
          // Focus the window
          printWindow.focus();
  
          // Trigger print after a delay to ensure styles are applied
          setTimeout(() => {
            printWindow.print();
  
            // Close window only after print dialog is closed
            printWindow.onafterprint = () => {
              printWindow.close();
              setIsPrinting(false);
            };
          }, 500); // Increased delay to ensure print is initialized correctly
        } catch (err) {
          console.error('Print error:', err);
          printWindow.close();
          setIsPrinting(false);
        }
      };
  
    } catch (err) {
      console.error('Print initialization error:', err);
      setIsPrinting(false);
    }
  }, [paperSize, isPrinting]);
  

  const ModernBillTemplate = ({ estimate, total }) => (
    <div className="bg-white p-4 max-w-md mx-auto">
      <div className="text-center mb-4">
        <h2 className="font-bold text-xl mb-1">Bill</h2>
        <p className="text-sm">Phone: {companyInfo.companyPhone}</p>
        <p>Aditya</p>
      <p>      COOL City, ST 12345<br></br>
      +91 1234567890<br></br>
      cool@nice.com
      </p>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm">
          <span>Bill No:</span>
          <span>INV_{String(estimateId).padStart(3, '0')}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Created on:</span>
          <span>{new Date().toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Bill To:</span>
          <span>{estimate.party?.name || 'Customer'}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Billing Address:</span>
          <span>{estimate?.billingAddress || 'Address'}</span>
        </div>
      </div>

      <div className="mb-4">
        <div className="grid grid-cols-4 gap-2 text-sm font-bold mb-2">
          <div>Item Name</div>
          <div className="text-right">Qty</div>
          <div className="text-right">Rate</div>
          <div className="text-right">Total</div>
        </div>
        {estimate?.items?.map((item, index) => (
          <div key={index} className="grid grid-cols-4 gap-2 text-sm">
            <div>{item.name}</div>
            <div className="text-right">{item.quantity}</div>
            <div className="text-right">{item.rate}</div>
            <div className="text-right">{item.rate * item.quantity}</div>
          </div>
        ))}
      </div>

      <div className="border-t pt-2">
        <div className="text-sm">
          <div className="flex justify-between">
            <span>Total Items:</span>
            <span>{estimate?.items?.length || 0}</span>
          </div>
          <div className="flex justify-between">
            <span>Total Quantity:</span>
            <span>{estimate?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0}</span>
          </div>
          <div className="flex justify-between">
            <span>Sub Total (without tax):</span>
            <span>{total}</span>
          </div>
          <div className="flex justify-between font-bold">
            <span>Total:</span>
            <span>{total}</span>
          </div>
        </div>
      </div>

      <div className="text-center mt-4 text-sm">
        Thank You! Visit Again!
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => navigate("/estimates")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Return to Estimates
          </button>
        </div>
      </div>
    );
  }

  const total = calculateTotal(estimate?.items);
  const gst = calculateGST(total);
  const grandTotal = total + gst;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8 no-print">
          <ArrowLeft
            className="h-6 w-6 cursor-pointer hover:text-blue-600"
            onClick={() => navigate("/estimates")}
          />
          <h1 className="text-2xl font-bold">Bill Generator</h1>
        </div>

        <div className="mb-4 no-print">
          <label htmlFor="paperSize" className="block mb-2 text-sm font-medium text-gray-700">
            Select Format:
          </label>
          <select
            id="paperSize"
            value={paperSize}
            onChange={(e) => setPaperSize(e.target.value)}
            className="block w-full p-2 border border-gray-300 rounded-lg"
          >
            <option value="modern">Modern</option>
            <option value="2-inch">2-inch</option>
            <option value="3-inch">3-inch</option>
          </select>
        </div>

        <div id="printable-content" className={`print-${paperSize}`}>
          {paperSize === 'modern' ? (
            <ModernBillTemplate estimate={estimate} total={total} />
          ) : (
            <div className="bg-white p-4">
              <h2 className="text-xl font-bold text-center">{companyInfo.companyName}</h2>
              <p className="text-center">{companyInfo.companyAddress}</p>
              <p className="text-center">{companyInfo.companyCity}</p>
              <div className="mt-4">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="border border-gray-300 px-2 py-1">#</th>
                      <th className="border border-gray-300 px-2 py-1">Description</th>
                      <th className="border border-gray-300 px-2 py-1">Qty</th>
                      <th className="border border-gray-300 px-2 py-1">Rate</th>
                      <th className="border border-gray-300 px-2 py-1">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {estimate?.items?.map((item, index) => (
                      <tr key={index}>
                        <td className="border border-gray-300 px-2 py-1">{index + 1}</td>
                        <td className="border border-gray-300 px-2 py-1">{item.name}</td>
                        <td className="border border-gray-300 px-2 py-1">{item.quantity}</td>
                        <td className="border border-gray-300 px-2 py-1">
                          {formatCurrency(item.rate)}
                        </td>
                        <td className="border border-gray-300 px-2 py-1">
                          {formatCurrency(item.rate * item.quantity)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 text-right">
                <p>Subtotal: {formatCurrency(total)}</p>
                <p>GST (18%): {formatCurrency(gst)}</p>
                <h4 className="font-bold">Total: {formatCurrency(grandTotal)}</h4>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end mt-4 no-print">
          <button
            onClick={handlePrint}
            disabled={isPrinting}
            className={`px-4 py-2 bg-blue-600 text-white rounded-lg ${
              isPrinting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
            }`}
          >
                      {isPrinting ? 'Printing...' : 'Print'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BillGenerator;