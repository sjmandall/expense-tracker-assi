// components/SummaryPanel.js
"use client";

// Formats a number as Indian Rupee currency: ₹1,234.50
function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(amount);
}

// Category colors — maps each category to a color class for the visual dots
const CATEGORY_COLORS = {
  Food: "bg-green-400",
  Transport: "bg-blue-400",
  Bills: "bg-orange-400",
  Entertainment: "bg-purple-400",
  Other: "bg-gray-400",
};

// Props:
//   expenses — the currently filtered list of expense objects
export default function SummaryPanel({ expenses }) {
  // Total of all expenses in the filtered view
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  // Total per category — builds an object like { Food: 450, Transport: 1200, ... }
  const perCategory = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {});

  // Find the highest single expense
  const highest = expenses.length > 0
    ? expenses.reduce((max, e) => (e.amount > max.amount ? e : max), expenses[0])
    : null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* Total Spent Card */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5">
        <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wide">Total Spent</p>
        <p className="text-2xl font-bold text-indigo-700 mt-1">{formatCurrency(total)}</p>
        <p className="text-xs text-indigo-400 mt-1">{expenses.length} expense{expenses.length !== 1 ? "s" : ""}</p>
      </div>

      {/* Per Category Card */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">By Category</p>
        {Object.keys(perCategory).length === 0 ? (
          <p className="text-sm text-gray-400">No data</p>
        ) : (
          <ul className="space-y-1">
            {Object.entries(perCategory).map(([cat, amount]) => (
              <li key={cat} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${CATEGORY_COLORS[cat] || "bg-gray-400"}`} />
                  <span className="text-gray-600">{cat}</span>
                </span>
                <span className="font-medium text-gray-800">{formatCurrency(amount)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Highest Expense Card */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Highest Expense</p>
        {highest ? (
          <>
            <p className="text-2xl font-bold text-gray-800 mt-1">{formatCurrency(highest.amount)}</p>
            <p className="text-xs text-gray-400 mt-1">{highest.category} · {highest.date}</p>
            {highest.note && <p className="text-xs text-gray-500 mt-0.5 truncate">{highest.note}</p>}
          </>
        ) : (
          <p className="text-sm text-gray-400 mt-1">No expenses yet</p>
        )}
      </div>
    </div>
  );
}
