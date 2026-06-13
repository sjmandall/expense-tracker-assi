// components/ConfirmDialog.js
"use client";

// Props:
//   isOpen — whether the dialog is visible
//   message — the confirmation message to show
//   onConfirm() — called when user clicks "Delete"
//   onCancel() — called when user clicks "Cancel"
export default function ConfirmDialog({ isOpen, message, onConfirm, onCancel }) {
  if (!isOpen) return null; // don't render anything if not open

  return (
    // Dark overlay behind the dialog
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      {/* Dialog box */}
      <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full space-y-4">
        <div className="flex items-start gap-3">
          {/* Warning icon */}
          <div className="w-9 h-9 bg-red-100 rounded-full flex items-center justify-center shrink-0">
            <span className="text-red-600 text-lg">!</span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Confirm Delete</h3>
            <p className="text-sm text-gray-500 mt-1">{message}</p>
          </div>
        </div>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
