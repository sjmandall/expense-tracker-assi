// app/api/expenses/[id]/route.js
import { NextResponse } from "next/server";
import { updateExpense, deleteExpense } from "@/lib/store";

const VALID_CATEGORIES = ["Food", "Transport", "Bills", "Entertainment", "Other"];

// PUT /api/expenses/:id — update an existing expense
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { amount, category, date, note } = body;

    // Validate amount if provided
    if (amount !== undefined && (isNaN(amount) || Number(amount) <= 0)) {
      return NextResponse.json({ error: "Amount must be a positive number" }, { status: 400 });
    }
    // Validate category if provided
    if (category && !VALID_CATEGORIES.includes(category)) {
      return NextResponse.json({ error: "A valid category is required" }, { status: 400 });
    }
    // Validate date if provided
    if (date) {
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      if (selectedDate > today) {
        return NextResponse.json({ error: "Date cannot be in the future" }, { status: 400 });
      }
    }

    const updates = {};
    if (amount !== undefined) updates.amount = Number(amount);
    if (category) updates.category = category;
    if (date) updates.date = date;
    if (note !== undefined) updates.note = note;

    const updated = updateExpense(id, updates);
    if (!updated) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }
    return NextResponse.json({ expense: updated }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update expense" }, { status: 500 });
  }
}

// DELETE /api/expenses/:id — delete an expense
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const deleted = deleteExpense(id);
    if (!deleted) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Expense deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete expense" }, { status: 500 });
  }
}
