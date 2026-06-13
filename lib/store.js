// lib/store.js
// This is our in-memory database — just a plain array
// In a real app, this would be replaced with a real database like PostgreSQL

let expenses = [
  // Seed data so the app looks populated on first load
  {
    id: "seed-1",
    amount: 450,
    category: "Food",
    date: new Date().toISOString().split("T")[0], // today's date
    note: "Lunch at Haldiram's",
    createdAt: new Date().toISOString(),
  },
  {
    id: "seed-2",
    amount: 1200,
    category: "Transport",
    date: new Date().toISOString().split("T")[0],
    note: "Ola ride to office",
    createdAt: new Date().toISOString(),
  },
  {
    id: "seed-3",
    amount: 3500,
    category: "Bills",
    date: new Date(Date.now() - 86400000).toISOString().split("T")[0], // yesterday
    note: "Electricity bill",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

// Returns a COPY of all expenses — prevents external code from directly mutating the array
export function getAllExpenses() {
  return [...expenses];
}

// Adds a new expense object to the array
export function addExpense(expense) {
  expenses.push(expense);
  return expense;
}

// Replaces an existing expense by matching ID
export function updateExpense(id, updatedFields) {
  const index = expenses.findIndex((e) => e.id === id);
  if (index === -1) return null; // not found
  expenses[index] = { ...expenses[index], ...updatedFields };
  return expenses[index];
}

// Removes an expense by ID
export function deleteExpense(id) {
  const index = expenses.findIndex((e) => e.id === id);
  if (index === -1) return false; // not found
  expenses.splice(index, 1);
  return true;
}
