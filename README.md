# 💸 Expense Tracker

A full-stack expense tracking app built with Next.js (App Router) for both frontend and backend.

## Live Demo

- **Deployed App:** [your-vercel-link.vercel.app](https://your-vercel-link.vercel.app)

## Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Framework | Next.js 14 (App Router) | Single framework for frontend + backend API routes |
| Frontend | React (functional components + hooks) | Required by the brief |
| Backend | Next.js API Routes (Node.js under the hood) | Built into Next.js, no separate server needed |
| Storage | In-memory JavaScript array | Simple; no DB setup needed for this scope |
| Styling | Tailwind CSS | Utility-first; fast to write, responsive by default |
| Charts | Recharts | React-native charts, easy integration |
| IDs | uuid | Collision-free unique IDs for expenses |

## How to Run Locally

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/expense-tracker.git
cd expense-tracker

# Install dependencies
npm install

# Start development server
npm run dev
```

Open http://localhost:3000 in your browser.

## API Documentation

All endpoints are under `/api/expenses`.

| Method | Path | Request Body | Response |
|---|---|---|---|
| GET | `/api/expenses` | — | `{ expenses: [...] }` |
| POST | `/api/expenses` | `{ amount, category, date, note? }` | `{ expense: {...} }` |
| PUT | `/api/expenses/:id` | `{ amount?, category?, date?, note? }` | `{ expense: {...} }` |
| DELETE | `/api/expenses/:id` | — | `{ message: "Expense deleted" }` |

**Expense object shape:**
```json
{
  "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "amount": 450,
  "category": "Food",
  "date": "2025-06-12",
  "note": "Lunch at Haldiram's",
  "createdAt": "2025-06-12T10:30:00.000Z"
}
```

**Validation rules:**
- `amount`: required, positive number
- `category`: required, one of: Food, Transport, Bills, Entertainment, Other
- `date`: required, cannot be in the future

## Project Structure

```
expense-tracker/
├── app/
│   ├── api/expenses/
│   │   ├── route.js          # GET all, POST new
│   │   └── [id]/route.js     # PUT update, DELETE one
│   ├── globals.css           # Tailwind imports
│   ├── layout.js             # Root HTML shell
│   └── page.js               # Main app page
├── components/
│   ├── ExpenseForm.js        # Add/Edit form
│   ├── ExpenseTable.js       # Expenses list table
│   ├── FilterBar.js          # Category + date filters
│   ├── SummaryPanel.js       # Stats cards
│   ├── ExpenseChart.js       # Bar chart (Recharts)
│   └── ConfirmDialog.js      # Delete confirmation popup
├── lib/
│   └── store.js              # In-memory data store
└── README.md
```

## What I Built vs What I Would Build Next

### ✅ Implemented
- Full CRUD (add, view, edit, delete) with confirmation dialog
- Filter by category and date range (this month, last month, all time)
- Summary panel: total spent, per-category breakdown, highest expense
- Bar chart of spending by category (Recharts)
- CSV export of visible expenses
- Form validation (client + server side)
- Currency formatting (Indian Rupee via Intl.NumberFormat)
- Responsive design (table on desktop, cards on mobile)
- Loading spinner and error states
- Empty state UI

### 🔜 Would Build Next (with more time)
- **Persistence:** Write expenses to a JSON file or SQLite so data survives server restarts
- **Budget limits per category:** Allow users to set a monthly budget per category, with a visual indicator (red bar) when exceeded
- **Custom date range picker:** Let users pick any from/to date range
- **Search:** Filter expenses by note text
- **Tests:** Jest tests for the API route validation logic
