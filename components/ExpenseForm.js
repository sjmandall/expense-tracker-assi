// components/ExpenseForm.js
"use client"; // tells Next.js this component runs in the browser (it has interactive state)

import { useState, useEffect } from "react";

const CATEGORIES = ["Food", "Transport", "Bills", "Entertainment", "Other"];

// Props:
//   onSubmit(formData) — called when form is submitted successfully
//   editExpense — if provided, form is in "edit mode" and fields are pre-filled
//   onCancel — called when user clicks Cancel (used in edit mode)
export default function ExpenseForm({ onSubmit, editExpense, onCancel }) {
  const today = new Date().toISOString().split("T")[0]; // "2025-06-12" format

  // Form state — each input field has its own state variable
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(today);
  const [note, setNote] = useState("");
  const [error, setError] = useState(""); // shows validation errors
  const [loading, setLoading] = useState(false); // disables button while submitting

  // If editExpense is provided, pre-fill the form fields
  useEffect(() => {
    if (editExpense) {
      setAmount(editExpense.amount.toString());
      setCategory(editExpense.category);
      setDate(editExpense.date);
      setNote(editExpense.note || "");
    }
  }, [editExpense]);

  // Called when user clicks "Add Expense" or "Save Changes"
  async function handleSubmit(e) {
    e.preventDefault(); // prevent page reload (default form behavior)
    setError("");

    // Basic client-side validation before calling the API
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      setError("Please enter a valid positive amount.");
      return;
    }
    if (!category) {
      setError("Please select a category.");
      return;
    }
    if (!date) {
      setError("Please select a date.");
      return;
    }

    setLoading(true);
    try {
      await onSubmit({ amount: Number(amount), category, date, note });
      // Reset form after successful submission (only for add mode, not edit)
      if (!editExpense) {
        setAmount("");
        setCategory("");
        setDate(today);
        setNote("");
      }
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">
        {editExpense ? "Edit Expense" : "Add New Expense"}
      </h2>

      {/* Error message box */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Amount input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Amount (₹) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            min="0.01"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="e.g. 450"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        {/* Category dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
          >
            <option value="">Select category</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Date picker */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={date}
            max={today} // prevents selecting future dates
            onChange={(e) => setDate(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        {/* Note input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Note <span className="text-gray-400">(optional)</span>
          </label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. Lunch at Haldiram's"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 pt-1">
        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors"
        >
          {loading ? "Saving..." : editExpense ? "Save Changes" : "Add Expense"}
        </button>
        {editExpense && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium px-5 py-2 rounded-lg transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
