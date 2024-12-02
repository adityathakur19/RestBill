import React, { useState } from 'react';
import { ArrowLeft, Settings, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import "../../styles/Product.css";

const Product = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [formData, setFormData] = useState({
    itemName: '',
    sellPrice: '',
    primaryUnit: '',
    customUnit: '',
    type: 'Veg',  // Default type remains Veg
    totalPrice: 0
  });

  // Handle input changes for form fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let updatedFormData = { ...formData, [name]: value };
    
    // Calculate total price if sell price is changed
    if (name === 'sellPrice') {
      const sellPrice = parseFloat(value);
      const totalPrice = parseFloat(sellPrice); // No GST applied now
      updatedFormData = {
        ...updatedFormData,
        totalPrice
      };
    }
    setFormData(updatedFormData);
  };

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type and size
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(file.type)) {
        alert('Please upload a valid image (JPEG, PNG, or GIF)');
        return;
      }

      if (file.size > maxSize) {
        alert('Image size should be less than 5MB');
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle product type change (Veg/Non-Veg)
  const handleTypeChange = (type) => {
    setFormData({ ...formData, type });
  };

  // Save product with image upload
  const handleSave = async () => {
    // Validate required fields
    if (!formData.itemName) {
      setError('Item name is required');
      return;
    }

    if (!formData.sellPrice) {
      setError('Sell price is required');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      // Create FormData for multipart/form-data upload
      const formDataToSubmit = new FormData();
      // Append product details
      Object.keys(formData).forEach(key => {
        formDataToSubmit.append(key, formData[key]);
      });
      // Append image if exists
      if (imageFile) {
        formDataToSubmit.append('image', imageFile);
      }
      const response = await fetch('https://backenditems-3.onrender.com/api/products', {
        method: 'POST',
        body: formDataToSubmit, // Note: No need to set Content-Type, it will be set automatically
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to save product');
      }
      // Reset form after successful submission
      setFormData({
        itemName: '',
        sellPrice: '',
        primaryUnit: '',
        customUnit: '',
        type: 'Veg',
        totalPrice: 0
      });
      setImagePreview(null);
      setImageFile(null);
      alert('Product saved successfully!');
      navigate('/item');
    } catch (err) {
      setError(err.message);
      alert('Failed to save product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Navigate back to items page
  const handleBack = () => {
    navigate('/item');
  };

  return (
    <div className="product-container">
      {/* Header Section */}
      <div className="product-header">
        <div className="header-left">
          <ArrowLeft className="back-icon" onClick={handleBack} />
          <h1>Create Item</h1>
        </div>
        <Settings className="settings-icon" />
      </div>

      <div className="product-form">
        {/* Error Message */}
        {error && (
          <div className="error-message bg-red-50 text-red-500 p-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Image Upload Section */}
        <div className="form-row image-upload">
          <div className="form-group">
            <label>Item Picture</label>
            <div className="image-upload-container">
              <input 
                type="file" 
                id="imageUpload" 
                accept="image/jpeg,image/png,image/gif" 
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
              <label htmlFor="imageUpload" className="image-upload-label">
                <Upload className="upload-icon" />
                <span>Upload Item Picture</span>
              </label>
              {imagePreview && (
                <div className="image-preview">
                  <img src={imagePreview} alt="Preview" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Item Name and Type Selector */}
        <div className="form-row">
          <div className="form-group required">
            <label>Item Name</label>
            <input 
              type="text" 
              name="itemName" 
              placeholder="Example: Samosa" 
              value={formData.itemName}
              onChange={handleInputChange} 
              required
            />
          </div>
          <div className="form-group type-selector">
            <div className="type-options">
              <button 
                className={`type-btn ${formData.type === 'Veg' ? 'active' : ''}`}
                onClick={() => handleTypeChange('Veg')}
              >
                Veg
              </button>
              <button 
                className={`type-btn ${formData.type === 'Non-Veg' ? 'active' : ''}`}
                onClick={() => handleTypeChange('Non-Veg')}
              >
                Non-Veg
              </button>
              <button 
                className={`type-btn ${formData.type === 'Beverage' ? 'active' : ''}`}
                onClick={() => handleTypeChange('Beverage')}
              >
                Beverage
              </button>
            </div>
          </div>
        </div>

        {/* Sell Price and Units */}
        <div className="form-row">
          <div className="form-group required">
            <label>Sell Price</label>
            <input 
              type="number" 
              name="sellPrice" 
              placeholder="Example: ₹25.00" 
              value={formData.sellPrice}
              onChange={handleInputChange} 
              required
              min="0"
              step="0.01"
            />
          </div>
          <div className="form-group">
            <label>Primary Unit</label>
            <select 
              name="primaryUnit" 
              value={formData.primaryUnit}
              onChange={handleInputChange}
            >
              <option value="">Select Unit</option>
              <option value="piece">Piece</option>
              <option value="kg">KG</option>
              <option value="gram">Gram</option>
            </select>
          </div>
          <div className="form-group">
            <label>Add Custom Unit</label>
            <div className="input-with-button">
              <input 
                type="text" 
                name="customUnit" 
                placeholder="Example: Grams" 
                value={formData.customUnit}
                onChange={handleInputChange} 
              />
              <button className="add-btn">Add</button>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="form-footer">
          <button 
            className="save-btn" 
            onClick={handleSave}
            disabled={loading || !formData.itemName || !formData.sellPrice}
          >
            {loading ? 'SAVING...' : 'SAVE ITEM'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Product;
