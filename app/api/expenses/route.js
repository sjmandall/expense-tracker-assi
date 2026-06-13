// app/api/expenses/route.js
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { getAllExpenses, addExpense } from "@/lib/store";

// Allowed categories — used for validation
const VALID_CATEGORIES = ["Food", "Transport", "Bills", "Entertainment", "Other"];

// GET /api/expenses — returns all expenses sorted newest first
export async function GET() {
  try {
    const expenses = getAllExpenses();
    // Sort by date descending (newest first)
    expenses.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return NextResponse.json({ expenses }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch expenses" }, { status: 500 });
  }
}

// POST /api/expenses — creates a new expense
export async function POST(request) {
  try {
    const body = await request.json();
    const { amount, category, date, note } = body;

    // --- Validation ---
    // amount must be a positive number
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      return NextResponse.json({ error: "Amount must be a positive number" }, { status: 400 });
    }
    // category must be one of the allowed values
    if (!category || !VALID_CATEGORIES.includes(category)) {
      return NextResponse.json({ error: "A valid category is required" }, { status: 400 });
    }
    // date must exist and not be in the future
    if (!date) {
      return NextResponse.json({ error: "Date is required" }, { status: 400 });
    }
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(23, 59, 59, 999); // allow today's date
    if (selectedDate > today) {
      return NextResponse.json({ error: "Date cannot be in the future" }, { status: 400 });
    }

    // Build the new expense object
    const newExpense = {
      id: uuidv4(),        // generates a unique ID like "f47ac10b-58cc-4372-a567-0e02b2c3d479"
      amount: Number(amount),
      category,
      date,
      note: note || "",    // note is optional, default to empty string
      createdAt: new Date().toISOString(),
    };

    const saved = addExpense(newExpense);
    return NextResponse.json({ expense: saved }, { status: 201 }); // 201 = Created
  } catch (error) {
    return NextResponse.json({ error: "Failed to create expense" }, { status: 500 });
  }
}
