import React, { useState } from 'react';
import { ArrowLeft, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import "../../styles/Sales.css";

const Sales = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showTransportDetails, setShowTransportDetails] = useState(true);
    const [formData, setFormData] = useState({
        saleNo: '',
        billDate: new Date().toISOString().split('T')[0],
        billingTerm: '',
        dueDate: new Date().toISOString().split('T')[0],
        deliveryState: '',
        transportDetails: {
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
        },
        termsAndConditions: '',
        cashDiscount: {
            percentage: '',
            amount: '',
        },
        serviceCharge: {
            percentage: '',
            amount: '',
        },
        totalAmount: '',
        amountReceived: '',
        previousBalance: '',
        saleNote: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch('http://localhost:5000/api/sales', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to save sale');
            }

            alert('Sale saved successfully!');
            navigate('/'); // Adjust path as needed

        } catch (err) {
            setError(err.message);
            alert('Failed to save sale. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        navigate('/'); // Adjust path as needed
    };

    return (
        <div className="sales-container">
            <div className="sales-header">
                <div className="header-left">
                    <ArrowLeft className="back-icon" onClick={handleBack} />
                    <h1>Create Sale</h1>
                </div>
                <div className="header-right">
                    <div className="scanner-mode">
                        <span>Barcode Scanner Mode</span>
                        <input type="checkbox" className="toggle-switch" />
                    </div>
                    <Settings className="settings-icon" />
                </div>
            </div>

            <div className="sales-form">
                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                {/* Transport Details Section */}
                <div className="section-header" onClick={() => setShowTransportDetails(!showTransportDetails)}>
                    <h2>{showTransportDetails ? 'LESS' : 'MORE'} TRANSPORT DETAILS</h2>
                </div>

                {showTransportDetails && (
                    <div className="transport-details">
                        <div className="form-row">
                            <div className="form-group">
                                <label>Labour/Transport Charges</label>
                                <input
                                    type="number"
                                    name="transportDetails.labourCharges"
                                    value={formData.transportDetails.labourCharges}
                                    onChange={handleInputChange}
                                    placeholder="Enter charges"
                                />
                            </div>
                            <div className="form-group">
                                <label>Purchase Order Number</label>
                                <input
                                    type="text"
                                    name="transportDetails.purchaseOrderNumber"
                                    value={formData.transportDetails.purchaseOrderNumber}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Challan Number</label>
                                <input
                                    type="text"
                                    name="transportDetails.challanNumber"
                                    value={formData.transportDetails.challanNumber}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Transporter Name</label>
                                <input
                                    type="text"
                                    name="transportDetails.transporterName"
                                    value={formData.transportDetails.transporterName}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>E Way Bill Number</label>
                                <input
                                    type="text"
                                    name="transportDetails.eWayBillNumber"
                                    value={formData.transportDetails.eWayBillNumber}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Vehicle Number</label>
                                <input
                                    type="text"
                                    name="transportDetails.vehicleNumber"
                                    value={formData.transportDetails.vehicleNumber}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>E Way Bill Date</label>
                                <input
                                    type="date"
                                    name="transportDetails.eWayBillDate"
                                    value={formData.transportDetails.eWayBillDate}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Transport Distance</label>
                                <input
                                    type="text"
                                    name="transportDetails.transportDistance"
                                    value={formData.transportDetails.transportDistance}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Delivery Location</label>
                                <input
                                    type="text"
                                    name="transportDetails.deliveryLocation"
                                    value={formData.transportDetails.deliveryLocation}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Delivery Date</label>
                                <input
                                    type="date"
                                    name="transportDetails.deliveryDate"
                                    value={formData.transportDetails.deliveryDate}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Terms & Conditions */}
                <div className="form-group">
                    <label>Terms & Conditions</label>
                    <textarea
                        name="termsAndConditions"
                        value={formData.termsAndConditions}
                        onChange={handleInputChange}
                        placeholder="Write Your Terms & Conditions Here"
                    />
                </div>

                {/* Financial Details */}
                <div className="financial-details">
                    <div className="form-row">
                        <div className="form-group">
                            <label>Cash Discount (In %)</label>
                            <input
                                type="number"
                                name="cashDiscount.percentage"
                                value={formData.cashDiscount.percentage}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Cash Discount (In ₹)</label>
                            <input
                                type="number"
                                name="cashDiscount.amount"
                                value={formData.cashDiscount.amount}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Service Charge Percentage</label>
                            <input
                                type="number"
                                name="serviceCharge.percentage"
                                value={formData.serviceCharge.percentage}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Service Charge Amount</label>
                            <input
                                type="number"
                                name="serviceCharge.amount"
                                value={formData.serviceCharge.amount}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Total Amount</label>
                            <input
                                type="number"
                                name="totalAmount"
                                value={formData.totalAmount}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Amount Received</label>
                            <input
                                type="number"
                                name="amountReceived"
                                value={formData.amountReceived}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Previous Balance</label>
                        <input
                            type="number"
                            name="previousBalance"
                            value={formData.previousBalance}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>

                {/* Sale Note */}
                <div className="form-group">
                    <label>Sale Note</label>
                    <textarea
                        name="saleNote"
                        value={formData.saleNote}
                        onChange={handleInputChange}
                        placeholder="Write Your Note Here"
                    />
                </div>

                <div className="form-footer">
                    <button 
                        className="next-btn" 
                        onClick={handleSave}
                        disabled={loading}
                    >
                        NEXT {loading ? '...' : '()'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Sales;