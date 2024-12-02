import React, { useState } from 'react';
import { Trash2, X } from 'lucide-react';

const DeleteModal = ({ 
    isOpen, 
    onClose, 
    onConfirmDelete, 
    itemName,
    isDeleting = false 
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl w-96 p-6 relative">
                {/* Close Button */}
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                    disabled={isDeleting}
                >
                    <X size={24} />
                </button>

                {/* Modal Header */}
                <div className="flex items-center mb-4">
                    <Trash2 className="text-red-500 mr-3" size={24} />
                    <h2 className="text-xl font-semibold text-gray-800">
                        Confirm Delete
                    </h2>
                </div>

                {/* Modal Message */}
                <p className="text-gray-600 mb-6">
                    Are you sure you want to delete 
                    <span className="font-bold ml-1">{itemName}</span>?
                </p>

                {/* Warning Text */}
                <div className="bg-red-50 border border-red-200 p-3 rounded mb-6">
                    <p className="text-red-700 text-sm">
                        This action cannot be undone. The item will be permanently removed.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-4">
                    <button 
                        onClick={onClose}
                        disabled={isDeleting}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={onConfirmDelete}
                        disabled={isDeleting}
                        className={`
                            px-4 py-2 
                            ${isDeleting 
                                ? 'bg-red-300 cursor-not-allowed' 
                                : 'bg-red-500 hover:bg-red-600'
                            } 
                            text-white rounded-md transition flex items-center
                        `}
                    >
                        {isDeleting ? 'Deleting...' : 'Delete'}
                        {isDeleting && (
                            <span className="ml-2 animate-spin">
                                ↻
                            </span>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteModal;