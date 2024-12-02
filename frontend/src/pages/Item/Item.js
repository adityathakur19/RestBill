import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, Trash2, ChevronDown, ChevronUp, Edit2 } from 'lucide-react';
import DeleteModal from './DeleteModal';
import ConfirmationModal from './ConfirmationModal';

const Item = () => {
const [products, setProducts] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const [searchTerm, setSearchTerm] = useState("");
const [expandedItems, setExpandedItems] = useState({});
const [selectedProducts, setSelectedProducts] = useState([]);
const [deleteModalOpen, setDeleteModalOpen] = useState(false);
const [bulkDeleteModalOpen, setBulkDeleteModalOpen] = useState(false);
const [isDeleting, setIsDeleting] = useState(false);
const [currentProduct, setCurrentProduct] = useState(null);

const navigate = useNavigate();

useEffect(() => {
fetchProducts();
    }, []);

const fetchProducts = async () => {
try {
setLoading(true);
const response = await fetch('https://backenditems-3.onrender.com/api/products');
if (!response.ok) throw new Error('Failed to fetch products');
const data = await response.json();
setProducts(data.products || data);
        } catch (err) {
setError(err.message);
        } finally {
setLoading(false);
        }
    };

const handleNewItemClick = () => {
navigate("/product");
    };

const toggleExpand = (productId) => {
setExpandedItems(prev => ({
...prev,
            [productId]: !prev[productId]
        }));
    };

const handleEditProduct = (product) => {
navigate(`/product/${product._id}`, { state: { product } });
    };

const handleDeleteProduct = async (productId) => {
try {
setIsDeleting(true);
const response = await fetch(`https://backenditems-3.onrender.com/api/products/${productId}`, {
                method: 'DELETE'
            });

if (!response.ok) {
throw new Error('Failed to delete product');
            }

// Remove the deleted product from the list
setProducts(prev => prev.filter(p => p._id !== productId));
setDeleteModalOpen(false);
        } catch (err) {
setError(err.message);
        } finally {
setIsDeleting(false);
        }
    };

const handleBulkDelete = async () => {
try {
setIsDeleting(true);
const deletePromises = selectedProducts.map(productId => 
fetch(`https://backenditems-3.onrender.com/api/products/${productId}`, {
                    method: 'DELETE'
                })
            );

const responses = await Promise.all(deletePromises);
// Check if all deletions were successful
const failedDeletions = responses.filter(response => !response.ok);
if (failedDeletions.length > 0) {
throw new Error('Some products could not be deleted');
            }

// Remove deleted products from the list
setProducts(prev => prev.filter(p => !selectedProducts.includes(p._id)));
setSelectedProducts([]);
setBulkDeleteModalOpen(false);
        } catch (err) {
setError(err.message);
        } finally {
setIsDeleting(false);
        }
    };

const toggleProductSelection = (productId) => {
setSelectedProducts(prev => 
            prev.includes(productId)
? prev.filter(id => id !== productId)
: [...prev, productId]
        );
    };

const filteredProducts = products.filter(product =>
        product.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.type && product.type.toLowerCase().includes(searchTerm.toLowerCase()))
    );

const handleSelectAll = () => {
if (selectedProducts.length === filteredProducts.length) {
setSelectedProducts([]);
        } else {
setSelectedProducts(filteredProducts.map(p => p._id));
        }
    };

return (
<div className="p-4 max-w-7xl mx-auto">
{/* Title Bar */}
<div className="flex justify-between items-center mb-6">
<div>
<h2 className="text-2xl font-bold">Items</h2>
<p className="text-sm text-gray-500">
                        Last Sync: {new Date().toLocaleString()}
</p>
</div>
<div className="flex flex-wrap gap-2">
{selectedProducts.length > 0 && (
<button
className="px-4 py-2 bg-red-500 text-white rounded-lg flex items-center gap-2 hover:bg-red-600"
onClick={() => setBulkDeleteModalOpen(true)}
>
<Trash2 size={18} />
                            Bulk Delete ({selectedProducts.length})
</button>
                    )}
<button
className={`px-4 py-2 rounded-lg flex items-center gap-2 
    text-white transition-all duration-300 
    bg-green-600 hover:bg-green-700 active:bg-green-800 focus:ring-2 focus:ring-green-400`}
onClick={handleNewItemClick}
>
<Plus size={18} />
  New Item
</button>

</div>
</div>

{/* Search and Filters */}
<div className="flex flex-col md:flex-row gap-4 mb-6">
<div className="flex-1 relative">
<input
type="text"
placeholder="Search by item name or type..."
className="w-full pl-10 pr-4 py-2 border rounded-lg"
value={searchTerm}
onChange={(e) => setSearchTerm(e.target.value)}
/>
<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
</div>
</div>

{/* Product List */}
{loading ? (
<div className="text-center py-8">Loading...</div>
            ) : error ? (
<div className="text-center py-8 text-red-600">{error}</div>
            ) : (
<div className="space-y-4">
{/* Select All Checkbox */}
{filteredProducts.length > 0 && (
<div className="flex items-center mb-4">
<input
type="checkbox"
checked={selectedProducts.length === filteredProducts.length}
onChange={handleSelectAll}
className="mr-2"
/>
<span>Select All</span>
</div>
                    )}

{filteredProducts.map((product) => (
<div 
key={product._id} 
className="border rounded-lg p-4 bg-white shadow-sm flex items-center"
>
{/* Checkbox for selection */}
<input
type="checkbox"
checked={selectedProducts.includes(product._id)}
onChange={() => toggleProductSelection(product._id)}
className="mr-4"
/>

<div className="flex-1">
<div className="flex justify-between items-start">
<div className="flex-1">
<div className="flex items-center gap-4">
{product.image && (
<div className="w-16 h-16 rounded-lg overflow-hidden">
<img 
src={product.image} 
alt={product.itemName} 
className="w-full h-full object-cover"
/>
</div>
)}
<div>
<div className="flex items-center gap-2">
<h3 className="text-lg font-semibold">{product.itemName}</h3>
{product.type && (
<span className="text-sm text-gray-500">
                                                    ({product.type})
</span>
                                            )}
</div>
<div className="mt-2 grid grid-cols-3 gap-4">
<div>
<p className="text-sm text-gray-500">Total Price</p>
<p className="font-medium">₹{product.totalPrice}</p>
</div>
<div>
<p className="text-sm text-gray-500">Primary Unit</p>
<p className="font-medium">{product.primaryUnit || '-'}</p>
</div>
<div>
<p className="text-sm text-gray-500">Custom Unit</p>
<p className="font-medium">{product.customUnit || '-'}</p>
</div>
</div>
</div>
</div>
</div>
<div className="flex items-center space-x-2">
<button
onClick={() => handleEditProduct(product)}
className="p-2 hover:bg-gray-100 rounded-full"
>
<Edit2 size={20} />
</button>
<button
onClick={() => {
setCurrentProduct(product);
setDeleteModalOpen(true);
                                            }}
className="p-2 hover:bg-red-100 rounded-full text-red-500"
>
<Trash2 size={20} />
</button>
<button
onClick={() => toggleExpand(product._id)}
className="p-2 hover:bg-gray-100 rounded-full"
>
{expandedItems[product._id] ? (
<ChevronUp size={20} />
                                            ) : (
<ChevronDown size={20} />
                                            )}
</button>
</div>
</div>

{expandedItems[product._id] && (
<div className="mt-4 pt-4 border-t">
<div className="grid grid-cols-3 gap-4">
{product.gstEnabled && (
<>
<div>
<p className="text-sm text-gray-500">Base Price</p>
<p>₹{product.sellPrice}</p>
</div>
<div>
<p className="text-sm text-gray-500">GST Amount (5%)</p>
<p>₹{product.gstAmount}</p>
</div>
<div>
<p className="text-sm text-gray-500">Sell Price</p>
<p>₹{product.sellPrice}</p>
</div>
</>
                                            )}
</div>
</div>
                                )}
</div>
</div>
                    ))}
</div>
            )}

{/* Delete Confirmation Modal for Single Product */}
<DeleteModal
isOpen={deleteModalOpen}
onClose={() => setDeleteModalOpen(false)}
onConfirmDelete={() => handleDeleteProduct(currentProduct?._id)}
itemName={currentProduct?.itemName}
isDeleting={isDeleting}
/>

{/* Bulk Delete Confirmation Modal */}
<ConfirmationModal
isOpen={bulkDeleteModalOpen}
onClose={() => setBulkDeleteModalOpen(false)}
onConfirm={handleBulkDelete}
title="Bulk Delete"
message={`Are you sure you want to delete ${selectedProducts.length} selected items?`}
confirmText="Delete"
cancelText="Cancel"
/>
</div>
    );
};

export default Item;