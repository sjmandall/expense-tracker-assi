// app/page.js
"use client";

import { useState, useEffect, useCallback } from "react";
import ExpenseForm from "@/components/ExpenseForm";
import ExpenseTable from "@/components/ExpenseTable";
import FilterBar from "@/components/FilterBar";
import SummaryPanel from "@/components/SummaryPanel";
import ExpenseChart from "@/components/ExpenseChart";
import ConfirmDialog from "@/components/ConfirmDialog";

export default function Home() {
  // All expenses fetched from the backend
  const [expenses, setExpenses] = useState([]);
  // Whether we are loading the initial data
  const [loading, setLoading] = useState(true);
  // General error message (e.g., API failure)
  const [error, setError] = useState("");
  // The expense being edited (null means we are in "add" mode)
  const [editExpense, setEditExpense] = useState(null);
  // Current filter state
  const [filters, setFilters] = useState({ category: "All", dateRange: "this_month" });
  // Delete confirmation dialog state
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, id: null });
  // Success notification
  const [successMsg, setSuccessMsg] = useState("");

  // ── Fetch expenses from the API ──────────────────────────────────────────────
  const fetchExpenses = useCallback(async () => {
    try {
      setError("");
      const res = await fetch("/api/expenses");
      if (!res.ok) throw new Error("Failed to load expenses");
      const data = await res.json();
      setExpenses(data.expenses);
    } catch (err) {
      setError("Could not load expenses. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Run fetchExpenses once when the page first loads
  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  // ── Show a success toast that disappears after 3 seconds ─────────────────────
  function showSuccess(message) {
    setSuccessMsg(message);
    setTimeout(() => setSuccessMsg(""), 3000);
  }

  // ── Add a new expense ─────────────────────────────────────────────────────────
  async function handleAddExpense(formData) {
    const res = await fetch("/api/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Failed to add expense");
    }
    await fetchExpenses(); // refresh the list
    showSuccess("Expense added successfully!");
  }

  // ── Update an existing expense ────────────────────────────────────────────────
  async function handleEditExpense(formData) {
    const res = await fetch(`/api/expenses/${editExpense.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Failed to update expense");
    }
    await fetchExpenses();
    setEditExpense(null); // exit edit mode
    showSuccess("Expense updated successfully!");
  }

  // ── Open the delete confirmation dialog ───────────────────────────────────────
  function handleDeleteClick(id) {
    setDeleteConfirm({ open: true, id });
  }

  // ── Actually delete after user confirms ───────────────────────────────────────
  async function handleDeleteConfirm() {
    try {
      const res = await fetch(`/api/expenses/${deleteConfirm.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete expense");
      await fetchExpenses();
      showSuccess("Expense deleted.");
    } catch (err) {
      setError("Could not delete expense. Please try again.");
    } finally {
      setDeleteConfirm({ open: false, id: null });
    }
  }

  // ── Filter logic ──────────────────────────────────────────────────────────────
  // Takes the full expenses list and returns only the ones matching current filters
  function getFilteredExpenses() {
    const now = new Date();
    return expenses.filter((expense) => {
      // Category filter
      if (filters.category !== "All" && expense.category !== filters.category) return false;

      // Date range filter
      const expDate = new Date(expense.date);
      if (filters.dateRange === "this_month") {
        if (expDate.getMonth() !== now.getMonth() || expDate.getFullYear() !== now.getFullYear()) return false;
      } else if (filters.dateRange === "last_month") {
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1);
        if (expDate.getMonth() !== lastMonth.getMonth() || expDate.getFullYear() !== lastMonth.getFullYear()) return false;
      }
      // "all" — no date filtering

      return true;
    });
  }

  // ── CSV Export ────────────────────────────────────────────────────────────────
  function handleExportCSV() {
    const filtered = getFilteredExpenses();
    if (filtered.length === 0) return;

    // Build CSV content
    const header = "Date,Category,Amount,Note";
    const rows = filtered.map(
      (e) => `${e.date},${e.category},${e.amount},"${(e.note || "").replace(/"/g, '""')}"`
    );
    const csv = [header, ...rows].join("\n");

    // Create a download link and click it programmatically
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `expenses-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showSuccess("Exported to CSV!");
  }

  const filteredExpenses = getFilteredExpenses();

  // ── Render ─────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">💸 Expense Tracker</h1>
            <p className="text-xs text-gray-400">Track your daily spending</p>
          </div>
          <button
            onClick={handleExportCSV}
            disabled={filteredExpenses.length === 0}
            className="text-sm bg-gray-100 hover:bg-gray-200 disabled:opacity-40 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Export CSV
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        {/* Success toast notification */}
        {successMsg && (
          <div className="fixed top-4 right-4 z-50 bg-green-500 text-white text-sm font-medium px-4 py-3 rounded-xl shadow-lg">
            ✓ {successMsg}
          </div>
        )}

        {/* Error banner */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        {/* Add / Edit Form */}
        <ExpenseForm
          onSubmit={editExpense ? handleEditExpense : handleAddExpense}
          editExpense={editExpense}
          onCancel={() => setEditExpense(null)}
        />

        {/* Summary stats */}
        <SummaryPanel expenses={filteredExpenses} />

        {/* Chart */}
        <ExpenseChart expenses={filteredExpenses} />

        {/* Filter bar + table */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <FilterBar filters={filters} onFilterChange={setFilters} />
            <span className="text-sm text-gray-400">
              {filteredExpenses.length} expense{filteredExpenses.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Loading state */}
          {loading ? (
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-12 text-center">
              <div className="animate-spin w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full mx-auto" />
              <p className="text-sm text-gray-400 mt-3">Loading expenses...</p>
            </div>
          ) : (
            <ExpenseTable
              expenses={filteredExpenses}
              onEdit={(expense) => {
                setEditExpense(expense);
                window.scrollTo({ top: 0, behavior: "smooth" }); // scroll to form
              }}
              onDelete={handleDeleteClick}
            />
          )}
        </div>
      </main>

      {/* Delete confirmation dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.open}
        message="This expense will be permanently deleted. This action cannot be undone."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteConfirm({ open: false, id: null })}
      />
    </div>
  );
}
