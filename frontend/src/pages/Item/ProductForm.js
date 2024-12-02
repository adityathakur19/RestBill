import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, Save } from 'lucide-react';

const ProductForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    // Initial state for the form
    const [formData, setFormData] = useState({
        itemName: '',
        sellPrice: '',
        type: 'Veg',
        primaryUnit: '',
        customUnit: '',
        gstEnabled: false
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch product data if editing
    useEffect(() => {
        // First, check if product was passed through navigation state
        if (location.state?.product) {
            setFormData(location.state.product);
            return;
        }

        // If editing and no state, fetch the product
        if (id) {
            fetchProduct();
        }
    }, [id]);

    const fetchProduct = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`https://backenditems-3.onrender.com/api/products/${id}`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch product');
            }

            const productData = await response.json();
            setFormData(productData);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const url = id 
                ? `https://backenditems-3.onrender.com/api/products/${id}`
                : 'https://backenditems-3.onrender.com/api/products';
            
            const method = id ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    sellPrice: parseFloat(formData.sellPrice)
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to save product');
            }

            // Navigate back to items list
            navigate('/item');
        } catch (err) {
            setError(err.message);
            setIsLoading(false);
        }
    };

    return (
        <div className="p-4 max-w-2xl mx-auto">
            <div className="flex items-center mb-6">
                <button 
                    onClick={() => navigate('/items')}
                    className="mr-4 p-2 hover:bg-gray-100 rounded-full"
                >
                    <ChevronLeft size={24} />
                </button>
                <h2 className="text-2xl font-bold">
                    {id ? 'Edit Product' : 'New Product'}
                </h2>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Item Name
                    </label>
                    <input
                        type="text"
                        name="itemName"
                        value={formData.itemName}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                        placeholder="Enter item name"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Sell Price
                    </label>
                    <input
                        type="number"
                        name="sellPrice"
                        value={formData.sellPrice}
                        onChange={handleInputChange}
                        required
                        min="0"
                        step="0.01"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                        placeholder="Enter sell price"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Product Type
                    </label>
                    <select
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                    >
                        <option value="Veg">Veg</option>
                        <option value="Non-Veg">Non-Veg</option>
                        <option value="Beverage">Beverage</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Primary Unit
                    </label>
                    <select
                        name="primaryUnit"
                        value={formData.primaryUnit}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                    >
                        <option value="">Select Unit</option>
                        <option value="piece">Piece</option>
                        <option value="kg">Kg</option>
                        <option value="gram">Gram</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Custom Unit (Optional)
                    </label>
                    <input
                        type="text"
                        name="customUnit"
                        value={formData.customUnit}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                        placeholder="Enter custom unit"
                    />
                </div>

                <div className="flex items-center">
                    <input
                        type="checkbox"
                        name="gstEnabled"
                        checked={formData.gstEnabled}
                        onChange={handleInputChange}
                        className="mr-2"
                    />
                    <label className="text-sm font-medium text-gray-700">
                        Enable GST (5%)
                    </label>
                </div>

                <div className="flex justify-end">
  <button
    type="submit"
    disabled={isLoading}
    className={`px-4 py-2 rounded-lg flex items-center gap-2 
      text-white transition-all duration-300
      ${
        isLoading
          ? 'bg-gray-400 cursor-not-allowed'
          : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
      }`}
  >
    <Save size={18} />
    {isLoading ? 'Saving...' : 'Save Product'}
  </button>
</div>

            </form>
        </div>
    );
};

export default ProductForm;