// components/FilterBar.js
"use client";

const CATEGORIES = ["All", "Food", "Transport", "Bills", "Entertainment", "Other"];
const DATE_RANGES = [
  { label: "This Month", value: "this_month" },
  { label: "Last Month", value: "last_month" },
  { label: "All Time", value: "all" },
];

// Props:
//   filters — current { category, dateRange } filter state
//   onFilterChange(newFilters) — called when user changes a filter
export default function FilterBar({ filters, onFilterChange }) {
  return (
    <div className="flex flex-wrap gap-3 items-center">
      <span className="text-sm text-gray-500 font-medium">Filter by:</span>

      {/* Category filter */}
      <select
        value={filters.category}
        onChange={(e) => onFilterChange({ ...filters, category: e.target.value })}
        className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
      >
        {CATEGORIES.map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>

      {/* Date range filter */}
      <select
        value={filters.dateRange}
        onChange={(e) => onFilterChange({ ...filters, dateRange: e.target.value })}
        className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
      >
        {DATE_RANGES.map((range) => (
          <option key={range.value} value={range.value}>{range.label}</option>
        ))}
      </select>
    </div>
  );
}
