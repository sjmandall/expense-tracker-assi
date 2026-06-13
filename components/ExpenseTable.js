// components/ExpenseTable.js
"use client";

// Formats a number as ₹1,234.50
function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(amount);
}

// Category badge colors
const BADGE_COLORS = {
  Food: "bg-green-100 text-green-700",
  Transport: "bg-blue-100 text-blue-700",
  Bills: "bg-orange-100 text-orange-700",
  Entertainment: "bg-purple-100 text-purple-700",
  Other: "bg-gray-100 text-gray-700",
};

// Props:
//   expenses — the filtered list of expense objects to display
//   onEdit(expense) — called when user clicks Edit on a row
//   onDelete(id) — called when user clicks Delete on a row (triggers confirm dialog in parent)
export default function ExpenseTable({ expenses, onEdit, onDelete }) {
  // Empty state — shown when no expenses match the current filters
  if (expenses.length === 0) {
    return (
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-12 text-center">
        <p className="text-4xl mb-3">📭</p>
        <p className="text-gray-500 font-medium">No expenses found</p>
        <p className="text-gray-400 text-sm mt-1">Try adjusting your filters or add a new expense above.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
      {/* Desktop table view */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">Date</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">Category</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">Note</th>
              <th className="text-right px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">Amount</th>
              <th className="text-right px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense, index) => (
              <tr
                key={expense.id}
                className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                  index === expenses.length - 1 ? "border-b-0" : ""
                }`}
              >
                <td className="px-4 py-3 text-gray-600">{expense.date}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${BADGE_COLORS[expense.category] || "bg-gray-100 text-gray-700"}`}>
                    {expense.category}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500 max-w-xs truncate">{expense.note || "—"}</td>
                <td className="px-4 py-3 text-right font-semibold text-gray-800">{formatCurrency(expense.amount)}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => onEdit(expense)}
                      className="text-xs text-indigo-600 hover:text-indigo-800 font-medium px-2 py-1 rounded hover:bg-indigo-50 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(expense.id)}
                      className="text-xs text-red-500 hover:text-red-700 font-medium px-2 py-1 rounded hover:bg-red-50 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile card view — shown on small screens where table doesn't fit */}
      <div className="sm:hidden divide-y divide-gray-50">
        {expenses.map((expense) => (
          <div key={expense.id} className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${BADGE_COLORS[expense.category] || "bg-gray-100 text-gray-700"}`}>
                {expense.category}
              </span>
              <span className="font-bold text-gray-800">{formatCurrency(expense.amount)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">{expense.date}</span>
              {expense.note && <span className="text-xs text-gray-500 truncate ml-2">{expense.note}</span>}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => onEdit(expense)}
                className="text-xs text-indigo-600 font-medium"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(expense.id)}
                className="text-xs text-red-500 font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
