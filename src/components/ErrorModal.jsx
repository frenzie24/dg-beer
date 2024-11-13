// src/components/ErrorModal.js

import React from 'react';

const ErrorModal = ({ errorMessage, onClose }) => {
  if (!errorMessage) return null;  // Don't render if there's no error message

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
        <h2 className="text-red-500 text-xl font-semibold mb-4">Error</h2>
        <p className="text-gray-800 mb-4">{errorMessage}</p>
        <button
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ErrorModal;
