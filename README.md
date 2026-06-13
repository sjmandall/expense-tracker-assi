# 💸 Expense Tracker

> **Exercise 2 — Full Stack Mini App** | Studio Graphene Full Stack Developer Assessment

A full-stack expense tracking web application built with Next.js 14, where users can log daily expenses, filter by category and date range, visualise spending through charts, and export data as CSV. Both the frontend (React) and backend (REST API) live in a single Next.js project — no separate server required.

---

## 🚀 Live Demo

| | Link |
|---|---|
| **Production App** | [https://expense-tracker-assi.vercel.app](https://expense-tracker-assi.vercel.app) |
| **GitHub Repo** | [https://github.com/sjmandall/expense-tracker-assi](https://github.com/sjmandall/expense-tracker-assi) |

---

## 🛠 Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Framework | **Next.js 14** (App Router) | Single framework for both React frontend and Node.js API routes — one project, one deploy |
| Frontend | **React 18** (functional components + hooks) | Component-based UI with clean state management |
| Backend | **Next.js API Routes** | Built into Next.js; no Express or separate server needed |
| Storage | **In-memory JavaScript array** | Simple and zero-config for this scope; swap for a DB in production |
| Styling | **Tailwind CSS** | Utility-first classes; responsive by default, no separate CSS files |
| Charts | **Recharts** | React-native charting library, easy to integrate with component props |
| IDs | **uuid** | Generates collision-free unique IDs for each expense |
| Deployment | **Vercel** | Native Next.js hosting, free tier, zero config, auto-deploy on push |

---

## 💻 How to Run Locally

> Assumes only **Node.js 18+** is installed. Nothing else required.

```bash
# 1. Clone the repository
git clone https://github.com/sjmandall/expense-tracker-assi.git
cd expense-tracker-assi

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

The app loads with **3 seed expenses** already populated so you can see it working immediately.

> **Note:** Data is stored in-memory. It resets when the server restarts — this is expected for this scope.

---

## 📡 API Documentation

All endpoints are prefixed with `/api/expenses`.

### `GET /api/expenses`
Returns all expenses sorted newest first.

**Response**
```json
{
  "expenses": [
    {
      "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      "amount": 450,
      "category": "Food",
      "date": "2025-06-12",
      "note": "Lunch at Haldiram's",
      "createdAt": "2025-06-12T10:30:00.000Z"
    }
  ]
}
```

---

### `POST /api/expenses`
Creates a new expense.

**Request Body**
```json
{
  "amount": 450,
  "category": "Food",
  "date": "2025-06-12",
  "note": "Lunch at Haldiram's"
}
```

**Response** `201 Created`
```json
{
  "expense": { ...created expense object }
}
```

**Validation Rules**
- `amount` — required, must be a positive number
- `category` — required, one of: `Food`, `Transport`, `Bills`, `Entertainment`, `Other`
- `date` — required, cannot be in the future

---

### `PUT /api/expenses/:id`
Updates an existing expense by ID. All fields are optional.

**Request Body**
```json
{
  "amount": 600,
  "category": "Transport",
  "date": "2025-06-11",
  "note": "Updated note"
}
```

**Response** `200 OK`
```json
{
  "expense": { ...updated expense object }
}
```

**Error Responses**
- `400` — validation failed
- `404` — expense not found

---

### `DELETE /api/expenses/:id`
Deletes an expense by ID.

**Response** `200 OK`
```json
{
  "message": "Expense deleted"
}
```

**Error Responses**
- `404` — expense not found

---

## 📁 Project Structure

```
expense-tracker/
│
├── app/                          # Next.js App Router
│   ├── api/
│   │   └── expenses/
│   │       ├── route.js          # GET all expenses, POST new expense
│   │       └── [id]/
│   │           └── route.js      # PUT update, DELETE one expense
│   ├── globals.css               # Tailwind CSS imports only
│   ├── layout.js                 # Root HTML shell, metadata
│   └── page.js                   # Main page — assembles all components,
│                                 # holds app state, handles CRUD + CSV export
│
├── components/                   # Reusable React UI components
│   ├── ExpenseForm.js            # Add / Edit expense form with validation
│   ├── ExpenseTable.js           # Expenses list (table on desktop, cards on mobile)
│   ├── FilterBar.js              # Category + date range filter dropdowns
│   ├── SummaryPanel.js           # Stats: total spent, per-category, highest expense
│   ├── ExpenseChart.js           # Recharts bar chart — spending by category
│   └── ConfirmDialog.js          # Delete confirmation modal popup
│
├── lib/
│   └── store.js                  # In-memory data store (the "database")
│                                 # Exports: getAllExpenses, addExpense,
│                                 # updateExpense, deleteExpense
│
├── jsconfig.json                 # Configures @/ path alias for imports
├── tailwind.config.js            # Tailwind content paths
├── next.config.js                # Next.js configuration
├── package.json                  # Dependencies and scripts
└── README.md                     # You are here
```

---

## ☁️ Cloud Deployment Plan (AWS)

While this project is deployed on **Vercel** for simplicity and cost-efficiency, below is a production-grade AWS deployment architecture I would implement for a real-world version.

### Architecture Overview

```
Internet → Route 53 → CloudFront → ALB → EC2 (Next.js) → RDS PostgreSQL
                                              ↑
                                         VPC / Subnets
                                         (Public + Private)
```

### Infrastructure (Terraform-managed)

**Networking — VPC & Subnets**
- Create a custom **VPC** (`10.0.0.0/16`) with DNS support enabled
- **2 Public Subnets** (for ALB and NAT Gateway) across 2 availability zones
- **2 Private Subnets** (for EC2 app servers and RDS) — no direct internet access
- **Internet Gateway** attached to the VPC for public subnet outbound traffic
- **NAT Gateway** in a public subnet so private EC2 instances can pull updates

**Compute — EC2**
- **EC2 instance** (t3.small) in a private subnet running the Next.js app
- Bootstrapped via **User Data** script: installs Node.js, pulls the repo, runs `npm install && npm run build && npm start`
- **Security Group** allowing inbound on port 3000 only from the ALB

**Load Balancer — ALB**
- **Application Load Balancer** in public subnets
- **Target Group** pointing to the EC2 instance on port 3000
- **HTTPS Listener** (port 443) with an SSL certificate from **ACM**
- HTTP → HTTPS redirect on port 80

**Database — RDS**
- **RDS PostgreSQL** (db.t3.micro) in private subnets
- Multi-AZ disabled (cost saving for non-prod); enabled for production
- Security Group allowing inbound port 5432 only from the EC2 Security Group
- `lib/store.js` would be replaced with **Prisma ORM** connecting to RDS

**DNS — Route 53**
- Hosted zone for custom domain
- A-record alias pointing to the CloudFront distribution

**CDN — CloudFront**
- Distribution in front of the ALB
- Caches Next.js static assets (`/_next/static/*`) at edge locations
- Reduces latency for global users

**Infrastructure as Code — Terraform**
```
terraform/
├── main.tf          # Provider config, backend (S3 + DynamoDB state lock)
├── vpc.tf           # VPC, subnets, IGW, NAT Gateway, route tables
├── ec2.tf           # EC2 instance, security group, IAM role
├── alb.tf           # ALB, target group, listeners
├── rds.tf           # RDS PostgreSQL instance, subnet group
├── cloudfront.tf    # CloudFront distribution
├── route53.tf       # DNS records
└── variables.tf     # Input variables (region, instance type, db password, etc.)
```

**CI/CD — Jenkins**
- **Jenkins** server runs on a separate EC2 instance in the public subnet
- A **webhook** from GitHub triggers a Jenkins pipeline on every push to `main`
- The pipeline runs three stages: `npm install` → `npm run build` → deploy
- Deployment is done via **AWS Systems Manager (SSM) Run Command**, which tells the app EC2 instance to pull the latest code and restart with `pm2 restart`

**Why not just use AWS Amplify or Elastic Beanstalk?**
Amplify would be the simplest AWS option for Next.js, but the manual VPC + EC2 + Terraform approach above demonstrates deeper infrastructure knowledge — understanding of networking layers, security group rules, and IaC practices that matter at scale.

---

## ✅ What I Built

- Full CRUD — add, view, edit, delete expenses with a confirmation dialog
- Filter by category and date range (this month, last month, all time)
- Summary panel — total spent, per-category breakdown, highest single expense
- Bar chart of spending by category (Recharts)
- CSV export of the currently visible filtered expenses
- Client-side and server-side form validation
- Currency formatting in Indian Rupees (`Intl.NumberFormat`)
- Responsive design — table on desktop, card layout on mobile
- Loading spinner, error banners, and success toast notifications
- Empty state UI when no expenses match filters

---

## 🔜 Next Steps

These are things I deliberately scoped out and would build given more time:

**1. Real database persistence**
Replace `lib/store.js` with **Prisma ORM + PostgreSQL** (or SQLite for local dev). Data currently resets on server restart — acceptable for this scope, not for production.

**2. Budget limits per category**
Let users set a monthly spending limit per category. The `SummaryPanel` would show a progress bar that turns red when the budget is exceeded.

**3. Custom date range picker**
The current filter supports "this month / last month / all time". A proper date picker (e.g. `react-day-picker`) would let users select any arbitrary from/to range.

**4. Full-text search**
A search input that filters expenses by the `note` field in real-time — no API call needed, just client-side filtering of the `expenses` state array.

**5. Authentication**
Add **NextAuth.js** with Google OAuth so multiple users can each have their own expense data. Each expense would carry a `userId` field.

**6. Automated tests**
Write Jest/Vitest unit tests for the API route validation logic — at minimum: POST with missing amount returns 400, POST with valid data returns 201, DELETE of non-existent ID returns 404.

---

