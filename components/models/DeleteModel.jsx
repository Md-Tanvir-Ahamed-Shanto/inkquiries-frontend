"use client"
import React from 'react'

const DeleteModel = ({isOpen, onClose, onDelete}) => {
  return (
        <Modal isOpen={isOpen} onClose={onClose}>
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-4">Delete Portfolio Item</h3>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete this portfolio item? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={onDelete}
              className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 disabled:bg-red-400"
              disabled={loading}
            >
              {loading ? 'Deleting...' : 'Delete'}
            </button>
          </div>
          {error && (
            <div className="mt-4 text-red-500 text-sm">{error}</div>
          )}
        </div>
      </Modal>
  )
}

export default DeleteModel