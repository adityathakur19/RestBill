import React, { useState, useEffect } from 'react';
import { ArrowLeft, Settings, Plus, ChevronUp, ChevronDown, X } from 'lucide-react';

// PartySelectionModal component
const PartySelectionModal = ({ isOpen, onClose, onSelectParty }) => {
  const [parties, setParties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  useEffect(() => {
    const fetchParties = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/parties');
        const data = await response.json();
        setParties(data.data);
      } catch (error) {
        console.error('Error fetching parties:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchParties();
    }
  }, [isOpen]);

  const filteredParties = parties.filter(party => {
    const matchesSearch = party.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (party.phone || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter ? party.category === categoryFilter : true;
    return matchesSearch && matchesCategory;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Select Party</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Search parties..."
            className="w-full p-2 border rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          {loading ? (
            <div className="text-center py-4">Loading parties...</div>
          ) : (
            filteredParties.map((party) => (
              <div
                key={party._id}
                className="border rounded p-3 hover:bg-gray-50 cursor-pointer"
                onClick={() => onSelectParty(party)}
              >
                <div className="font-medium">{party.name}</div>
                <div className="text-sm text-gray-600">
                  {party.businessName && `${party.businessName} • `}
                  {party.phone && `📱 ${party.phone}`}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// ItemSelectionModal component
const ItemSelectionModal = ({ isOpen, onClose, onSelectItem, items }) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filteredItems = items.filter(item =>
    item.itemName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Select Item</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Search items..."
            className="w-full p-2 border rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="border rounded p-3 hover:bg-gray-50 cursor-pointer"
              onClick={() => onSelectItem(item)}
            >
              <div className="font-medium">{item.itemName}</div>
              <div className="text-sm text-gray-600">₹{item.sellPrice}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const NewPurchase = () => {
  const [showPartyModal, setShowPartyModal] = useState(false);
  const [showItemsModal, setShowItemsModal] = useState(false);
  const [selectedParty, setSelectedParty] = useState(null);
  const [showTransport, setShowTransport] = useState(false);
  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [transportDetails, setTransportDetails] = useState({
    labourCharges: '',
    purchaseOrderNumber: '',
    challanNumber: '',
    eWayBillNumber: '',
    eWayBillDate: new Date().toISOString().split('T')[0],
    transporterName: '',
    vehicleNumber: '',
    transportDistance: '',
    deliveryLocation: '',
    deliveryDate: new Date().toISOString().split('T')[0],
    termsConditions: ''
  });

  const [formData, setFormData] = useState({
    purchaseNo: 'EST_' + Date.now(),
    billingTerm: '',
    billDate: new Date().toISOString().split('T')[0],
    dueDate: new Date().toISOString().split('T')[0],
    deliveryState: '',
    cashDiscountPercentage: '',
    cashDiscountAmount: '',
    serviceChargePercentage: '',
    serviceChargeAmount: '',
    totalAmount: '0.00',
    purchaseNote: ''
  });

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products');
        const data = await response.json();
        setItems(data);
      } catch (err) {
        console.error('Error fetching items:', err);
        setError('Failed to load items. Please try again.');
      }
    };
    fetchItems();
  }, []);

  const handlePartySelect = (party) => {
    setSelectedParty(party);
    setShowPartyModal(false);
  };

  const handleItemSelect = (item) => {
    setSelectedItems(prev => [...prev, { ...item, quantity: 1 }]);
    setShowItemsModal(false);
  };

  const handleDeleteItem = (itemId) => {
    setSelectedItems(prev => prev.filter(item => item.id !== itemId));
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    const quantity = parseInt(newQuantity);
    if (quantity > 0) {
      setSelectedItems(prev =>
        prev.map(item =>
          item.id === itemId ? { ...item, quantity } : item
        )
      );
    }
  };

  const calculateTotal = () => {
    const itemsTotal = selectedItems.reduce((sum, item) => sum + (item.sellPrice * item.quantity), 0);
    const laborCharges = parseFloat(transportDetails.labourCharges) || 0;
    return (itemsTotal + laborCharges).toFixed(2);
  };

  const validatePurchase = (purchaseData) => {
    if (!purchaseData.party?._id) {
      throw new Error('Please select a party');
    }
    if (!purchaseData.items?.length) {
      throw new Error('Please add at least one item');
    }
    if (!purchaseData.billDate) {
      throw new Error('Bill date is required');
    }
    return true;
  };

  const handleSavePurchase = async () => {
    try {
        // Set the submitting state and clear any existing errors
        setIsSubmitting(true);
        setError(null);

        // Prepare the purchase data
        const purchaseData = {
            purchaseNo: formData.purchaseNo,
            party: {
                name: selectedParty?.name,
                phone: selectedParty?.phone,
                businessName: selectedParty?.businessName,
                category: selectedParty?.category,
                _id: selectedParty?._id
            },
            items: selectedItems.map(item => ({
                itemName: item.itemName,
                sellPrice: parseFloat(item.sellPrice),
                quantity: parseInt(item.quantity, 10),
                id: item.id
            })),
            billingTerm: formData.billingTerm,
            billDate: formData.billDate,
            dueDate: formData.dueDate,
            deliveryState: formData.deliveryState,
            cashDiscountPercentage: parseFloat(formData.cashDiscountPercentage) || 0,
            cashDiscountAmount: parseFloat(formData.cashDiscountAmount) || 0,
            serviceChargePercentage: parseFloat(formData.serviceChargePercentage) || 0,
            serviceChargeAmount: parseFloat(formData.serviceChargeAmount) || 0,
            totalAmount: parseFloat(calculateTotal()),
            purchaseNote: formData.purchaseNote,
            transport: transportDetails
        };

        // Optional: Validate purchase data before making the API call
        validatePurchase(purchaseData);

        // Send the POST request to save the purchase
        const response = await fetch('http://localhost:5000/api/purchases/purchases', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              // Required when using credentials: 'include'
              'Accept': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(purchaseData),
          });

        // Check if the response is OK
        if (!response.ok) {
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to save purchase');
            } else {
                throw new Error(`Server error: ${response.status}`);
            }
        }

        // Parse the response
        const data = await response.json();

        // Handle success or error based on API response
        if (data.success) {
            alert('Purchase saved successfully!');
            window.location.href = '/purchase';
        } else {
            throw new Error(data.message || 'Failed to save purchase');
        }
    } catch (error) {
        // Log and display the error
        console.error('Error saving purchase:', error);
        setError(error.message || 'Error saving purchase');
    } finally {
        // Reset the submitting state
        setIsSubmitting(false);
    }
};


  return (
    <div className="p-4">
      <header className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <button onClick={() => window.history.back()} className="p-2">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">Create Purchase</h1>
        </div>
        <button className="p-2">
          <Settings size={24} />
        </button>
      </header>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {/* Party Selection */}
        <div className="border rounded-lg p-4">
          {selectedParty ? (
            <div className="space-y-2">
              <div className="flex justify-between">
                <h3 className="font-medium">{selectedParty.name}</h3>
                <button
                  onClick={() => setShowPartyModal(true)}
                  className="text-blue-600 text-sm"
                >
                  Change Party
                </button>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Phone: </span>
                  <span>{selectedParty.phone || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-gray-500">Category: </span>
                  <span>{selectedParty.category || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-gray-500">Business: </span>
                  <span>{selectedParty.businessName || 'N/A'}</span>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowPartyModal(true)}
              className="w-full py-2 border-2 border-dashed rounded-lg text-gray-600 hover:bg-gray-50"
            >
              Select Existing Party
            </button>
          )}
        </div>

        {/* Items Section */}
        <div className="border rounded-lg p-4">
          <button
            onClick={() => setShowItemsModal(true)}
            className="w-full py-2 text-blue-600 border rounded hover:bg-blue-50"
          >
            <Plus size={20} className="inline mr-2" />
            Add Items
          </button>

          {selectedItems.length > 0 && (
            <div className="mt-4 space-y-2">
              {selectedItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center p-2 border rounded">
                  <div>
                    <div className="font-medium">{item.itemName}</div>
                    <div className="text-sm text-gray-600">₹{item.sellPrice}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                      className="w-20 p-1 border rounded"
                    />
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              <div className="text-right font-bold">
                Total: ₹{calculateTotal()}
              </div>
            </div>
          )}
        </div>

        {/* Transport Details */}
        <div className="border rounded-lg overflow-hidden">
          <div
            className="p-4 bg-gray-50 flex justify-between items-center cursor-pointer"
            onClick={() => setShowTransport(!showTransport)}
          >
            <span className="font-medium">
              {showTransport ? 'Less Transport Details' : 'More Transport Details'}
            </span>
            {showTransport ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
{/* Continuing from the previous transport section */}
{showTransport && (
            <div className="p-4 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Labour Charges (₹)
                </label>
                <input
                  type="number"
                  value={transportDetails.labourCharges}
                  onChange={(e) => setTransportDetails(prev => ({
                    ...prev,
                    labourCharges: e.target.value
                  }))}
                  className="w-full p-2 border rounded"
                  placeholder="Enter labour charges"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Purchase Order Number
                </label>
                <input
                  type="text"
                  value={transportDetails.purchaseOrderNumber}
                  onChange={(e) => setTransportDetails(prev => ({
                    ...prev,
                    purchaseOrderNumber: e.target.value
                  }))}
                  className="w-full p-2 border rounded"
                  placeholder="Enter PO number"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Challan Number
                </label>
                <input
                  type="text"
                  value={transportDetails.challanNumber}
                  onChange={(e) => setTransportDetails(prev => ({
                    ...prev,
                    challanNumber: e.target.value
                  }))}
                  className="w-full p-2 border rounded"
                  placeholder="Enter challan number"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  E-Way Bill Number
                </label>
                <input
                  type="text"
                  value={transportDetails.eWayBillNumber}
                  onChange={(e) => setTransportDetails(prev => ({
                    ...prev,
                    eWayBillNumber: e.target.value
                  }))}
                  className="w-full p-2 border rounded"
                  placeholder="Enter e-way bill number"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  E-Way Bill Date
                </label>
                <input
                  type="date"
                  value={transportDetails.eWayBillDate}
                  onChange={(e) => setTransportDetails(prev => ({
                    ...prev,
                    eWayBillDate: e.target.value
                  }))}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Transporter Name
                </label>
                <input
                  type="text"
                  value={transportDetails.transporterName}
                  onChange={(e) => setTransportDetails(prev => ({
                    ...prev,
                    transporterName: e.target.value
                  }))}
                  className="w-full p-2 border rounded"
                  placeholder="Enter transporter name"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Vehicle Number
                </label>
                <input
                  type="text"
                  value={transportDetails.vehicleNumber}
                  onChange={(e) => setTransportDetails(prev => ({
                    ...prev,
                    vehicleNumber: e.target.value
                  }))}
                  className="w-full p-2 border rounded"
                  placeholder="Enter vehicle number"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Transport Distance (km)
                </label>
                <input
                  type="number"
                  value={transportDetails.transportDistance}
                  onChange={(e) => setTransportDetails(prev => ({
                    ...prev,
                    transportDistance: e.target.value
                  }))}
                  className="w-full p-2 border rounded"
                  placeholder="Enter distance"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Delivery Location
                </label>
                <input
                  type="text"
                  value={transportDetails.deliveryLocation}
                  onChange={(e) => setTransportDetails(prev => ({
                    ...prev,
                    deliveryLocation: e.target.value
                  }))}
                  className="w-full p-2 border rounded"
                  placeholder="Enter delivery location"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Delivery Date
                </label>
                <input
                  type="date"
                  value={transportDetails.deliveryDate}
                  onChange={(e) => setTransportDetails(prev => ({
                    ...prev,
                    deliveryDate: e.target.value
                  }))}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm text-gray-600 mb-1">
                  Terms & Conditions
                </label>
                <textarea
                  value={transportDetails.termsConditions}
                  onChange={(e) => setTransportDetails(prev => ({
                    ...prev,
                    termsConditions: e.target.value
                  }))}
                  className="w-full p-2 border rounded h-24"
                  placeholder="Enter terms and conditions"
                />
              </div>
            </div>
          )}
        </div>

        {/* Billing Details */}
        <div className="border rounded-lg p-4">
          <h3 className="font-medium mb-4">Billing Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Purchase Number
              </label>
              <input
                type="text"
                value={formData.purchaseNo}
                readOnly
                className="w-full p-2 border rounded bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Billing Term
              </label>
              <input
                type="text"
                value={formData.billingTerm}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  billingTerm: e.target.value
                }))}
                className="w-full p-2 border rounded"
                placeholder="Enter billing term"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Bill Date
              </label>
              <input
                type="date"
                value={formData.billDate}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  billDate: e.target.value
                }))}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Due Date
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  dueDate: e.target.value
                }))}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Delivery State
              </label>
              <input
                type="text"
                value={formData.deliveryState}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  deliveryState: e.target.value
                }))}
                className="w-full p-2 border rounded"
                placeholder="Enter delivery state"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Cash Discount (%)
              </label>
              <input
                type="number"
                value={formData.cashDiscountPercentage}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  cashDiscountPercentage: e.target.value,
                  cashDiscountAmount: ((parseFloat(e.target.value) || 0) * parseFloat(calculateTotal()) / 100).toFixed(2)
                }))}
                className="w-full p-2 border rounded"
                placeholder="Enter discount percentage"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Cash Discount Amount
              </label>
              <input
                type="number"
                value={formData.cashDiscountAmount}
                readOnly
                className="w-full p-2 border rounded bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Service Charge (%)
              </label>
              <input
                type="number"
                value={formData.serviceChargePercentage}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  serviceChargePercentage: e.target.value,
                  serviceChargeAmount: ((parseFloat(e.target.value) || 0) * parseFloat(calculateTotal()) / 100).toFixed(2)
                }))}
                className="w-full p-2 border rounded"
                placeholder="Enter service charge percentage"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Service Charge Amount
              </label>
              <input
                type="number"
                value={formData.serviceChargeAmount}
                readOnly
                className="w-full p-2 border rounded bg-gray-50"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm text-gray-600 mb-1">
                Any Note
              </label>
              <textarea
                value={formData.purchaseNote}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  purchaseNote: e.target.value
                }))}
                className="w-full p-2 border rounded h-24"
                placeholder="Enter any additional notes"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <button
            onClick={() => window.history.back()}
            className="px-6 py-2 border rounded hover:bg-gray-50"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            onClick={handleSavePurchase}
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
          >
            {isSubmitting ? 'Saving...' : 'Save Purchase'}
          </button>
        </div>
      </div>

      {/* Modals */}
      <PartySelectionModal
        isOpen={showPartyModal}
        onClose={() => setShowPartyModal(false)}
        onSelectParty={handlePartySelect}
      />

      <ItemSelectionModal
        isOpen={showItemsModal}
        onClose={() => setShowItemsModal(false)}
        onSelectItem={handleItemSelect}
        items={items}
      />
    </div>
  );
};

export default NewPurchase;