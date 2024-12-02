import React, { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Party = () => {
  const [showGSTAddress, setShowGSTAddress] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    type: 'Customer',
    phone: '',
    category: '',
    gstin: '',
    billType: '',
    billingTerm: '',
    dateOfBirth: '',
    businessName: '',
    email: '',
    billingAddress: '',
    billingState: '',
    billingPincode: '',
    deliveryAddress: '',
    deliveryState: '',
    deliveryPincode: '',
    whatsappAlerts: 'Yes'
  });

  const navigate = useNavigate();

  // Validation rules
  const validateForm = () => {
    const newErrors = {};
    
    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    // Phone validation
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Enter valid 10-digit phone number';
    }

    // Category validation
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    // Email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Enter valid email address';
    }

    // GSTIN validation (if provided)
    if (formData.gstin && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(formData.gstin)) {
      newErrors.gstin = 'Enter valid GSTIN';
    }

    // Bill Type validation
    if (!formData.billType) {
      newErrors.billType = 'Bill type is required';
    }

    // Billing Term validation
    if (!formData.billingTerm) {
      newErrors.billingTerm = 'Billing term is required';
    }

    // Business Name validation
    if (!formData.businessName) {
      newErrors.businessName = 'Business name is required';
    }

    // Address validations
    if (!formData.billingAddress) {
      newErrors.billingAddress = 'Billing address is required';
    }

    if (!formData.billingState) {
      newErrors.billingState = 'Billing state is required';
    }

    if (!formData.billingPincode) {
      newErrors.billingPincode = 'Billing pincode is required';
    } else if (!/^\d{6}$/.test(formData.billingPincode)) {
      newErrors.billingPincode = 'Enter valid 6-digit pincode';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleTypeChange = (newType) => {
    setFormData(prev => ({
      ...prev,
      type: newType
    }));
  };

  const handleWhatsAppChange = (value) => {
    setFormData(prev => ({
      ...prev,
      whatsappAlerts: value
    }));
  };

  const saveParty = async () => {
    if (!validateForm()) {
      // Scroll to first error
      const firstError = document.querySelector('.error-message');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    try {
      setLoading(true);

      const response = await fetch('http://localhost:5000/api/parties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save party');
      }

      navigate('/Table');
    } catch (err) {
      setErrors(prev => ({
        ...prev,
        submit: err.message
      }));
    } finally {
      setLoading(false);
    }
  };

  const CustomInput = ({ 
    label, 
    type = 'text', 
    name,
    placeholder, 
    value, 
    onChange,
    required = false,
    error
  }) => (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-4 py-2 rounded-lg border ${
          error 
            ? 'border-red-500 focus:ring-red-200' 
            : 'border-gray-300 focus:ring-blue-200'
        } focus:border-blue-500 focus:ring-2 transition-all duration-200 outline-none`}
      />
      {error && (
        <span className="text-red-500 text-sm error-message">{error}</span>
      )}
    </div>
  );

  const CustomSelect = ({
    label,
    name,
    value,
    onChange,
    options,
    required = false,
    error
  }) => (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-2 rounded-lg border ${
          error 
            ? 'border-red-500 focus:ring-red-200' 
            : 'border-gray-300 focus:ring-blue-200'
        } focus:border-blue-500 focus:ring-2 transition-all duration-200 outline-none bg-white`}
      >
        <option value="">Select {label}</option>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <span className="text-red-500 text-sm error-message">{error}</span>
      )}
    </div>
  );

  const CustomTextArea = ({
    label,
    name,
    value,
    onChange,
    placeholder,
    required = false,
    error
  }) => (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows="3"
        className={`w-full px-4 py-2 rounded-lg border ${
          error 
            ? 'border-red-500 focus:ring-red-200' 
            : 'border-gray-300 focus:ring-blue-200'
        } focus:border-blue-500 focus:ring-2 transition-all duration-200 outline-none resize-none`}
      />
      {error && (
        <span className="text-red-500 text-sm error-message">{error}</span>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-500 text-white p-4 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <button
            onClick={() => navigate('/Table')}
            className="hover:bg-blue-600 p-2 rounded-full transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-medium">Create New Party</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
          {errors.submit && (
            <div className="bg-red-50 text-red-500 p-4 rounded-lg border border-red-200">
              {errors.submit}
            </div>
          )}

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CustomInput
              label="Customer/Supplier Name"
              name="name"
              required
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter name"
              error={errors.name}
            />
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Type</label>
              <div className="flex gap-2">
                {['Customer', 'Supplier'].map(type => (
                  <button
                    key={type}
                    onClick={() => handleTypeChange(type)}
                    className={`flex-1 py-2 px-4 rounded-lg transition-all duration-200 ${
                      formData.type === type
                        ? 'bg-blue-500 text-white shadow-md'
                        : 'bg-white border border-gray-300 text-gray-700 hover:border-blue-500'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CustomInput
              label="Phone Number"
              name="phone"
              required
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Enter 10-digit phone number"
              error={errors.phone}
            />
            <CustomSelect
              label="Category"
              name="category"
              required
              value={formData.category}
              onChange={handleInputChange}
              options={[
                { value: 'VEG', label: 'VEG' },
                { value: 'NON-VEG', label: 'NON-VEG' }
              ]}
              error={errors.category}
            />
          </div>

          {/* GST & Address Section */}
          <div className="border-t pt-6">
            <button
              onClick={() => setShowGSTAddress(!showGSTAddress)}
              className="flex items-center gap-2 text-blue-500 hover:text-blue-600 font-medium px-4 py-2 rounded-lg border border-blue-200 hover:border-blue-300 transition-colors bg-blue-50"
            >
              GST & ADDRESS {showGSTAddress ? '▼' : '▶'}
            </button>

            {showGSTAddress && (
              <div className="mt-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <CustomInput
                    label="GSTIN"
                    name="gstin"
                    value={formData.gstin}
                    onChange={handleInputChange}
                    placeholder="Enter GSTIN"
                    error={errors.gstin}
                  />
                  <CustomSelect
                    label="Bill Type"
                    name="billType"
                    required
                    value={formData.billType}
                    onChange={handleInputChange}
                    options={[
                      { value: 'Online', label: 'Online Delivery Price' },
                      { value: 'AC', label: 'AC Sell Price' },
                      { value: 'NonAC', label: 'Non AC Sell Price' },
                      { value: 'Regular', label: 'Regular Price (Sell Price)' }
                    ]}
                    error={errors.billType}
                  />
                  <CustomSelect
                    label="Billing Term"
                    name="billingTerm"
                    required
                    value={formData.billingTerm}
                    onChange={handleInputChange}
                    options={[
                      { value: 'NET30', label: 'Net 30' },
                      { value: 'NET60', label: 'Net 60' }
                    ]}
                    error={errors.billingTerm}
                  />
                  <CustomInput
                    type="date"
                    label="Date of Birth"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <CustomInput
                    label="Business Name"
                    name="businessName"
                    required
                    value={formData.businessName}
                    onChange={handleInputChange}
                    placeholder="Enter business name"
                    error={errors.businessName}
                  />
                  <CustomInput
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter email"
                    error={errors.email}
                  />
                </div>

                {/* Billing Address */}
                <div className="space-y-6">
                  <CustomTextArea
                    label="Billing Address"
                    name="billingAddress"
                    required
                    value={formData.billingAddress}
                    onChange={handleInputChange}
                    placeholder="Enter billing address"
                    error={errors.billingAddress}
                  />
                  <div className="grid grid-cols-2 gap-6">
                    <CustomSelect
                      label="Billing State"
                      name="billingState"
                      required
                      value={formData.billingState}
                      onChange={handleInputChange}
                      options={[
                        { value: 'HP', label: 'Himachal Pradesh' },
                        { value: 'DL', label: 'Delhi' },
                        { value: 'HR', label: 'Haryana' },
                        { value: 'PB', label: 'Punjab' },
                        { value: 'UP', label: 'Uttar Pradesh' },
                        { value: 'UK', label: 'Uttarakhand' },
                        { value: 'RJ', label: 'Rajasthan' }
                      ]}
                      error={errors.billingState}
                    />
                    <CustomInput
                      label="Billing Pincode"
                      name="billingPincode"
                      required
                      value={formData.billingPincode}
                      onChange={handleInputChange}
                      placeholder="Enter 6-digit pincode"
                      error={errors.billingPincode}
                    />
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">Delivery Address</h3>
                    <button
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          deliveryAddress: formData.billingAddress,
                          deliveryState: formData.billingState,
                          deliveryPincode: formData.billingPincode
                        }));
                      }}
                      type="button"
                      className="text-sm text-blue-500 hover:text-blue-600 font-medium"
                    >
                      Same as Billing Address
                    </button>
                  </div>
                  
                  <CustomTextArea
                    label="Delivery Address"
                    name="deliveryAddress"
                    value={formData.deliveryAddress}
                    onChange={handleInputChange}
                    placeholder="Enter delivery address"
                  />
                  <div className="grid grid-cols-2 gap-6">
                    <CustomSelect
                      label="Delivery State"
                      name="deliveryState"
                      value={formData.deliveryState}
                      onChange={handleInputChange}
                      options={[
                        { value: 'HP', label: 'Himachal Pradesh' },
                        { value: 'DL', label: 'Delhi' },
                        { value: 'HR', label: 'Haryana' },
                        { value: 'PB', label: 'Punjab' },
                        { value: 'UP', label: 'Uttar Pradesh' },
                        { value: 'UK', label: 'Uttarakhand' },
                        { value: 'RJ', label: 'Rajasthan' }
                      ]}
                    />
                    <CustomInput
                      label="Delivery Pincode"
                      name="deliveryPincode"
                      value={formData.deliveryPincode}
                      onChange={handleInputChange}
                      placeholder="Enter 6-digit pincode"
                    />
                  </div>
                </div>

                {/* WhatsApp Alerts */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Enable WhatsApp Alerts
                  </label>
                  <div className="flex gap-2">
                    {['Yes', 'No'].map(option => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => handleWhatsAppChange(option)}
                        className={`flex-1 py-2 px-4 rounded-lg transition-all duration-200 ${
                          formData.whatsappAlerts === option
                            ? 'bg-blue-500 text-white shadow-md'
                            : 'bg-white border border-gray-300 text-gray-700 hover:border-blue-500'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-4 border-t pt-6">
            <button
              type="button"
              onClick={() => navigate('/Table')}
              className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:border-gray-400 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={saveParty}
              disabled={loading}
              className={`px-6 py-2 rounded-lg bg-blue-500 text-white transition-all duration-200 ${
                loading 
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-blue-600 active:bg-blue-700'
              }`}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </div>
              ) : (
                'Save Party'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Party;