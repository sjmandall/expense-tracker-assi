// components/ExpenseChart.js
"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

// Colors for each bar in the chart
const COLORS = {
  Food: "#4ade80",
  Transport: "#60a5fa",
  Bills: "#fb923c",
  Entertainment: "#c084fc",
  Other: "#94a3b8",
};

// Custom tooltip shown when hovering over a bar
function CustomTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    const value = payload[0].value;
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-md px-3 py-2 text-sm">
        <p className="font-semibold text-gray-800">{payload[0].name}</p>
        <p className="text-indigo-600">
          {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(value)}
        </p>
      </div>
    );
  }
  return null;
}

// Props:
//   expenses — list of expense objects to generate chart data from
export default function ExpenseChart({ expenses }) {
  // Build chart data: [{ name: "Food", total: 450 }, { name: "Transport", total: 1200 }, ...]
  const dataMap = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {});

  const chartData = Object.entries(dataMap).map(([name, total]) => ({ name, total }));

  if (chartData.length === 0) {
    return (
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 flex items-center justify-center h-48">
        <p className="text-sm text-gray-400">No data to display</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Spending by Category</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={chartData} margin={{ top: 0, right: 0, left: 10, bottom: 0 }}>
          <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={false} tickLine={false} />
          <YAxis
            tick={{ fontSize: 11, fill: "#6b7280" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `₹${v}`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f3f4f6" }} />
          <Bar dataKey="total" name="Total" radius={[6, 6, 0, 0]}>
            {chartData.map((entry) => (
              <Cell key={entry.name} fill={COLORS[entry.name] || "#94a3b8"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
